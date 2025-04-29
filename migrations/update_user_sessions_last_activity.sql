-- Add last_activity column to user_sessions table
ALTER TABLE user_sessions
ADD COLUMN last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Comment on column
COMMENT ON COLUMN user_sessions.last_activity IS 'Timestamp of the last update to this session';

-- Backfill last_activity with created_at for existing records
UPDATE user_sessions
SET last_activity = created_at
WHERE last_activity IS NULL;

-- Remove test data
DELETE FROM user_sessions
WHERE 
  user_id ILIKE '%test%' OR
  user_id ILIKE '%permission%' OR
  user_id ILIKE '%rls-test%' OR
  page_path ILIKE '%test%' OR
  page_path ILIKE '%permission%' OR
  page_path ILIKE '%rls-test%';

-- Create a function to update session duration by adding time
CREATE OR REPLACE FUNCTION update_session_duration(
  p_session_id INTEGER,
  p_additional_seconds INTEGER
) RETURNS SETOF user_sessions AS $$
BEGIN
  RETURN QUERY
  UPDATE user_sessions
  SET 
    session_time_sec = LEAST(session_time_sec + p_additional_seconds, 10800),
    last_activity = NOW()
  WHERE id = p_session_id
  RETURNING *;
END;
$$ LANGUAGE plpgsql; 