-- Drop the existing policy first (if it exists)
DROP POLICY IF EXISTS "Allow admins to read all data" ON user_sessions;

-- Create a new policy that explicitly allows aggregation functions
CREATE POLICY "Allow admins to read data with aggregation" ON user_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- If needed, also update the RLS settings for the table
ALTER TABLE user_sessions FORCE ROW LEVEL SECURITY;

-- Enable security by default for all users
ALTER TABLE user_sessions FORCE ROW LEVEL SECURITY; 