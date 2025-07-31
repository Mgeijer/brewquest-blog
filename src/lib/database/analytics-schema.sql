-- Analytics tables for map interactions

-- Map interactions table
CREATE TABLE IF NOT EXISTS map_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state_code VARCHAR(2) NOT NULL,
  action VARCHAR(50) NOT NULL CHECK (action IN ('hover', 'click', 'navigation', 'tooltip_view', 'completion_celebration')),
  timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  user_agent TEXT,
  session_id VARCHAR(100) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_map_interactions_state_code ON map_interactions(state_code);
CREATE INDEX IF NOT EXISTS idx_map_interactions_action ON map_interactions(action);
CREATE INDEX IF NOT EXISTS idx_map_interactions_timestamp ON map_interactions(timestamp);
CREATE INDEX IF NOT EXISTS idx_map_interactions_session_id ON map_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_map_interactions_metadata ON map_interactions USING GIN(metadata);

-- Session summary table for faster analytics queries
CREATE TABLE IF NOT EXISTS analytics_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  total_interactions INTEGER DEFAULT 0,
  states_visited TEXT[] DEFAULT '{}',
  device_type VARCHAR(20) CHECK (device_type IN ('mobile', 'desktop', 'tablet')),
  converted BOOLEAN DEFAULT FALSE,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_session_id ON analytics_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_start_time ON analytics_sessions(start_time);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_device_type ON analytics_sessions(device_type);
CREATE INDEX IF NOT EXISTS idx_analytics_sessions_converted ON analytics_sessions(converted);

-- State popularity aggregation table (updated daily)
CREATE TABLE IF NOT EXISTS state_popularity_daily (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  state_code VARCHAR(2) NOT NULL,
  date DATE NOT NULL,
  total_interactions INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  hover_count INTEGER DEFAULT 0,
  navigation_count INTEGER DEFAULT 0,
  unique_sessions INTEGER DEFAULT 0,
  avg_interaction_time NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state_code, date)
);

-- Create indexes for state popularity
CREATE INDEX IF NOT EXISTS idx_state_popularity_daily_state_code ON state_popularity_daily(state_code);
CREATE INDEX IF NOT EXISTS idx_state_popularity_daily_date ON state_popularity_daily(date);

-- Function to update session summary
CREATE OR REPLACE FUNCTION update_session_summary()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update session summary
  INSERT INTO analytics_sessions (
    session_id,
    start_time,
    end_time,
    total_interactions,
    states_visited,
    device_type,
    converted,
    user_agent
  )
  VALUES (
    NEW.session_id,
    NEW.timestamp,
    NEW.timestamp,
    1,
    ARRAY[NEW.state_code],
    CASE 
      WHEN NEW.user_agent ~* 'iPad|Android.*Tablet|Tablet' THEN 'tablet'
      WHEN NEW.user_agent ~* 'Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini' THEN 'mobile'
      ELSE 'desktop'
    END,
    CASE WHEN NEW.action = 'navigation' THEN TRUE ELSE FALSE END,
    NEW.user_agent
  )
  ON CONFLICT (session_id) DO UPDATE SET
    end_time = NEW.timestamp,
    total_interactions = analytics_sessions.total_interactions + 1,
    states_visited = CASE 
      WHEN NEW.state_code = ANY(analytics_sessions.states_visited) 
      THEN analytics_sessions.states_visited
      ELSE array_append(analytics_sessions.states_visited, NEW.state_code)
    END,
    converted = CASE 
      WHEN NEW.action = 'navigation' THEN TRUE 
      ELSE analytics_sessions.converted 
    END,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for session summary updates
DROP TRIGGER IF EXISTS trigger_update_session_summary ON map_interactions;
CREATE TRIGGER trigger_update_session_summary
  AFTER INSERT ON map_interactions
  FOR EACH ROW
  EXECUTE FUNCTION update_session_summary();

-- Function to aggregate daily state popularity
CREATE OR REPLACE FUNCTION aggregate_daily_state_popularity()
RETURNS void AS $$
BEGIN
  INSERT INTO state_popularity_daily (
    state_code,
    date,
    total_interactions,
    click_count,
    hover_count,
    navigation_count,
    unique_sessions,
    conversion_rate
  )
  SELECT 
    mi.state_code,
    DATE(mi.timestamp) as date,
    COUNT(*) as total_interactions,
    COUNT(*) FILTER (WHERE mi.action = 'click') as click_count,
    COUNT(*) FILTER (WHERE mi.action = 'hover') as hover_count,
    COUNT(*) FILTER (WHERE mi.action = 'navigation') as navigation_count,
    COUNT(DISTINCT mi.session_id) as unique_sessions,
    CASE 
      WHEN COUNT(*) FILTER (WHERE mi.action = 'click') > 0 
      THEN (COUNT(*) FILTER (WHERE mi.action = 'navigation')::numeric / COUNT(*) FILTER (WHERE mi.action = 'click')) * 100
      ELSE 0 
    END as conversion_rate
  FROM map_interactions mi
  WHERE DATE(mi.timestamp) = CURRENT_DATE - INTERVAL '1 day'
  GROUP BY mi.state_code, DATE(mi.timestamp)
  ON CONFLICT (state_code, date) DO UPDATE SET
    total_interactions = EXCLUDED.total_interactions,
    click_count = EXCLUDED.click_count,
    hover_count = EXCLUDED.hover_count,
    navigation_count = EXCLUDED.navigation_count,
    unique_sessions = EXCLUDED.unique_sessions,
    conversion_rate = EXCLUDED.conversion_rate;
END;
$$ LANGUAGE plpgsql;

-- Create materialized view for popular states (last 30 days)
CREATE MATERIALIZED VIEW IF NOT EXISTS popular_states_30d AS
SELECT 
  state_code,
  SUM(total_interactions) as total_interactions,
  SUM(click_count) as click_count,
  SUM(hover_count) as hover_count,
  SUM(navigation_count) as navigation_count,
  SUM(unique_sessions) as unique_sessions,
  AVG(conversion_rate) as avg_conversion_rate,
  MAX(date) as last_activity
FROM state_popularity_daily
WHERE date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY state_code
ORDER BY total_interactions DESC;

-- Create unique index for materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_popular_states_30d_state_code ON popular_states_30d(state_code);

-- Function to refresh popular states view
CREATE OR REPLACE FUNCTION refresh_popular_states_view()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY popular_states_30d;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS (Row Level Security) for analytics tables
ALTER TABLE map_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE state_popularity_daily ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics tables (read-only for authenticated users)
CREATE POLICY "Analytics read access" ON map_interactions
  FOR SELECT USING (true);

CREATE POLICY "Analytics insert access" ON map_interactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sessions read access" ON analytics_sessions
  FOR SELECT USING (true);

CREATE POLICY "State popularity read access" ON state_popularity_daily
  FOR SELECT USING (true);