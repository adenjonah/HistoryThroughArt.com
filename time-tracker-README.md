# Time Tracking & Analytics System

This system tracks user time spent on the website and provides an admin dashboard for analytics.

## Features

- **Anonymous User Tracking**: Records user sessions with unique IDs stored in localStorage
- **Session Data**: Tracks time spent, page path, and timestamps
- **Admin Dashboard**: View and filter user session data
- **Analytics**: Aggregated user stats and detailed session information

## Tech Stack

- **Frontend**: React
- **Backend**: Supabase (for data storage and authentication)
- **Hosting**: Vercel (frontend application)

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [Supabase](https://app.supabase.com/)
2. Run the `supabase-setup.sql` script in the SQL Editor to create the necessary tables and policies
3. Set up Authentication:
   - Go to Authentication > Settings
   - Enable Email auth provider
   - Configure any other auth settings as needed

4. Create an admin user:
   - Go to Authentication > Users
   - Click "Add User" and enter admin credentials
   - Note: This user will be used to access the admin dashboard

5. Get your Supabase credentials:
   - Go to Project Settings > API
   - Copy the URL and anon key for the next step

### 2. Frontend Configuration

1. Update the `.env` file with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL='your-supabase-url'
   REACT_APP_SUPABASE_ANON_KEY='your-supabase-anon-key'
   ```

2. Install dependencies:
   ```
   cd frontend
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

### 3. Deployment

1. Deploy the frontend to Vercel:
   - Connect your repository to Vercel
   - Set the environment variables in the Vercel project settings
   - Deploy the project

## Usage

### User Tracking

The tracking is automatically initialized when the app loads. It records:
- When a user enters the site (generates a unique ID)
- How long they spend on each page
- Which pages they visit

### Admin Dashboard

Access the admin dashboard at `/admin`. You'll need to log in with the admin credentials created in Supabase.

The dashboard provides:
- Overview statistics
- User time aggregation
- Detailed session data
- Filtering capabilities

## Customization

- **Tracking Logic**: Modify `timeTracker.js` to change tracking behavior
- **Dashboard UI**: Update components in the `components` directory
- **Data Processing**: Adjust the analytics service in `analyticsService.js`

## Privacy Considerations

- This system uses anonymous tracking (no personal information is stored)
- User IDs are randomly generated UUIDs and stored in localStorage
- Session data is stored indefinitely unless manually purged 