-- Create content_approvals table for persistent approval system
-- This replaces the in-memory AdminStorage system

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS content_edits CASCADE;
DROP TABLE IF EXISTS content_approvals CASCADE;

-- Create content_approvals table
CREATE TABLE content_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL UNIQUE,
  content_type TEXT NOT NULL DEFAULT 'social_post',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by TEXT,
  approved_at TIMESTAMP WITH TIME ZONE,
  rejected_by TEXT,
  rejected_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content_edits table for edited content
CREATE TABLE content_edits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id TEXT NOT NULL,
  original_content TEXT,
  edited_content TEXT NOT NULL,
  edited_by TEXT,
  edit_reason TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_content_approvals_content_id ON content_approvals(content_id);
CREATE INDEX idx_content_approvals_status ON content_approvals(status);
CREATE INDEX idx_content_approvals_type ON content_approvals(content_type);
CREATE INDEX idx_content_approvals_created_at ON content_approvals(created_at);

CREATE INDEX idx_content_edits_content_id ON content_edits(content_id);
CREATE INDEX idx_content_edits_active ON content_edits(is_active);
CREATE INDEX idx_content_edits_created_at ON content_edits(created_at);

-- Enable Row Level Security
ALTER TABLE content_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_edits ENABLE ROW LEVEL SECURITY;

-- Create policies (admin access only for now)
CREATE POLICY "Admin can manage content approvals" ON content_approvals
  FOR ALL USING (true);

CREATE POLICY "Admin can manage content edits" ON content_edits
  FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_content_approvals_updated_at
  BEFORE UPDATE ON content_approvals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_edits_updated_at
  BEFORE UPDATE ON content_edits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some test data to verify everything works
INSERT INTO content_approvals (content_id, content_type, status) VALUES 
  ('test-content-1', 'social_post', 'pending'),
  ('test-content-2', 'social_post', 'approved')
ON CONFLICT (content_id) DO NOTHING;

-- Verify tables were created successfully
SELECT 'content_approvals' as table_name, COUNT(*) as row_count FROM content_approvals
UNION ALL
SELECT 'content_edits' as table_name, COUNT(*) as row_count FROM content_edits;