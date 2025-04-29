-- Update user_sessions table to follow industry standards

-- Add new fields to the user_sessions table
ALTER TABLE user_sessions 
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS device_type TEXT,
ADD COLUMN IF NOT EXISTS browser TEXT,
ADD COLUMN IF NOT EXISTS os TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_page_path ON user_sessions(page_path);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);

-- Create a view for session analytics that excludes test data
CREATE OR REPLACE VIEW analytics_sessions AS
SELECT *
FROM user_sessions
WHERE 
  -- Exclude test entries
  user_id NOT LIKE 'test-%' AND
  user_id NOT LIKE 'permissi%' AND
  -- Exclude pages with test keywords
  page_path NOT LIKE '/test%' AND
  page_path NOT LIKE '/debug%' AND
  page_path NOT LIKE '/admin%' AND
  page_path NOT LIKE '/permission%';

-- Create a view for user analytics with anonymized IDs
CREATE OR REPLACE VIEW analytics_users AS
SELECT
  CONCAT('User ', SUBSTRING(user_id, 1, 8), '...') as display_id,
  user_id,
  COUNT(*) as session_count,
  SUM(session_time_sec) as total_time_sec,
  AVG(session_time_sec) as avg_session_time,
  MIN(created_at) as first_seen,
  MAX(created_at) as last_seen,
  ARRAY_AGG(DISTINCT device_type) FILTER (WHERE device_type IS NOT NULL) as devices,
  ARRAY_AGG(DISTINCT browser) FILTER (WHERE browser IS NOT NULL) as browsers,
  ARRAY_AGG(DISTINCT os) FILTER (WHERE os IS NOT NULL) as operating_systems
FROM analytics_sessions
GROUP BY user_id
HAVING COUNT(*) > 1; -- Exclude single-session users 