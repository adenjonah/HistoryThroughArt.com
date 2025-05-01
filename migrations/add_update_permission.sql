-- Add update permission to user_sessions table
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'user_sessions';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'user_sessions';

-- Create a policy for update operations
CREATE POLICY "Allow update for anon" ON user_sessions 
FOR UPDATE TO anon 
USING (true);

-- Create a policy for update operations for authenticated users
CREATE POLICY "Allow update for authenticated" ON user_sessions 
FOR UPDATE TO authenticated 
USING (true);

-- Get the updated policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE tablename = 'user_sessions'; 