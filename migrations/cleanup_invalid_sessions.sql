-- Cleanup invalid session data and add constraints
-- This script will remove unrealistic session durations and add validation

-- 1. First, identify problematic data
SELECT 
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE session_time_sec > 10800) as suspiciously_long_sessions,
  MAX(session_time_sec)/60/60 as max_hours,
  AVG(session_time_sec)/60 as avg_minutes
FROM user_sessions;

-- 2. Remove excessively long sessions (more than 3 hours = 10800 seconds)
DELETE FROM user_sessions
WHERE session_time_sec > 10800;

-- 3. Remove duplicate or very short sessions (less than 2 seconds)
DELETE FROM user_sessions
WHERE session_time_sec < 2;

-- 4. Create a temporary table for cleaning user data
CREATE TEMP TABLE user_session_stats AS
SELECT 
  user_id,
  COUNT(*) as session_count,
  SUM(session_time_sec) as total_time_sec,
  AVG(session_time_sec) as avg_time_sec,
  MAX(session_time_sec) as max_time_sec
FROM user_sessions
GROUP BY user_id;

-- 5. Find users with unrealistically high average session times (more than 20 minutes)
SELECT user_id, session_count, total_time_sec/60/60 as total_hours, 
       avg_time_sec/60 as avg_minutes, max_time_sec/60 as max_minutes
FROM user_session_stats
WHERE avg_time_sec > 1200
ORDER BY total_time_sec DESC;

-- 6. Remove sessions from users with abnormal patterns
-- Now executing this since we're purging the database
DELETE FROM user_sessions
WHERE user_id IN (
  SELECT user_id 
  FROM user_session_stats 
  WHERE avg_time_sec > 1800 AND session_count > 10
);

-- 7. Add a check constraint to prevent future invalid data
ALTER TABLE user_sessions 
ADD CONSTRAINT session_time_range 
CHECK (session_time_sec > 0 AND session_time_sec <= 10800);

-- 8. Create a view for analytics to make querying easier
CREATE OR REPLACE VIEW analytics_users AS
SELECT 
  user_id,
  CONCAT('User ', SUBSTRING(user_id, 1, 8), '...') as display_id,
  COUNT(*) as session_count,
  SUM(session_time_sec) as total_time_sec,
  AVG(session_time_sec) as avg_time_sec,
  MAX(session_time_sec) as max_time_sec,
  MIN(created_at) as first_seen,
  MAX(created_at) as last_seen
FROM user_sessions
WHERE 
  -- Filter out test sessions
  user_id NOT ILIKE '%test%' AND 
  user_id NOT ILIKE '%permissi%' AND
  -- Filter out non-public pages
  page_path NOT ILIKE '%admin%' AND
  page_path NOT ILIKE '%test%' AND
  page_path NOT ILIKE '%debug%' AND
  page_path NOT ILIKE '%develop%' AND
  page_path NOT ILIKE '%permission%'
GROUP BY user_id
HAVING COUNT(*) > 1
ORDER BY total_time_sec DESC;

-- 9. Verify cleanup results
SELECT 
  COUNT(*) as total_sessions_after_cleanup,
  MAX(session_time_sec)/60/60 as max_hours_after_cleanup,
  AVG(session_time_sec)/60 as avg_minutes_after_cleanup
FROM user_sessions; 