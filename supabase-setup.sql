-- Create the user_sessions table to store tracking data

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  session_time_sec INTEGER NOT NULL,
  page_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_page_path ON user_sessions(page_path);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert from anonymous users (tracking)
CREATE POLICY "Allow anonymous inserts" ON user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow admin to read all data
CREATE POLICY "Allow admins to read all data" ON user_sessions
  FOR SELECT
  TO authenticated
  USING (true);

-- Instructions for setting up an admin user:
-- 1. Go to Supabase Dashboard: https://app.supabase.com
-- 2. Navigate to your project
-- 3. Go to Authentication > Users
-- 4. Click "Invite new user" or use the Supabase API to create a new user
-- 5. Enable email/password auth in the Authentication settings
--
-- Example API call to create user:
-- POST https://YOUR_SUPABASE_URL/auth/v1/admin/users
-- Headers:
--   apikey: YOUR_SUPABASE_SERVICE_ROLE_KEY
--   Authorization: Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY
-- Body:
-- {
--   "email": "admin@example.com",
--   "password": "secure-password",
--   "email_confirm": true
-- } 