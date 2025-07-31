-- Workflow Functions (run these in Supabase SQL Editor)

-- Weekly beer count validation function
CREATE OR REPLACE FUNCTION validate_weekly_beer_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM beer_reviews 
      WHERE state_code = NEW.state_code 
        AND week_number = NEW.week_number
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) >= 7 THEN
    RAISE EXCEPTION 'Maximum 7 beer reviews per state per week exceeded';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for weekly beer limit
DROP TRIGGER IF EXISTS check_weekly_beer_limit ON beer_reviews;
CREATE TRIGGER check_weekly_beer_limit
  BEFORE INSERT OR UPDATE ON beer_reviews
  FOR EACH ROW
  EXECUTE FUNCTION validate_weekly_beer_count();

-- Journey statistics function
CREATE OR REPLACE FUNCTION get_journey_statistics()
RETURNS JSON AS $$
DECLARE
  total_states INTEGER := 50;
  total_expected_beers INTEGER := 350;
  published_states INTEGER;
  published_beers INTEGER;
  result JSON;
BEGIN
  SELECT COUNT(DISTINCT state_code) INTO published_states
  FROM beer_reviews 
  WHERE state_code IS NOT NULL;
  
  SELECT COUNT(*) INTO published_beers
  FROM beer_reviews 
  WHERE state_code IS NOT NULL;
  
  result := json_build_object(
    'total_states', total_states,
    'states_with_content', published_states,
    'states_progress_percent', ROUND((published_states::DECIMAL / total_states) * 100, 1),
    'total_expected_beers', total_expected_beers,
    'published_beers', published_beers,
    'beers_progress_percent', ROUND((published_beers::DECIMAL / total_expected_beers) * 100, 1),
    'average_beers_per_state', CASE 
      WHEN published_states > 0 THEN ROUND(published_beers::DECIMAL / published_states, 1)
      ELSE 0 
    END,
    'migration_status', 'completed'
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;