# History Through Art - Developer Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Codebase Structure](#codebase-structure)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Development Workflow](#development-workflow)
- [Conventions and Best Practices](#conventions-and-best-practices)
- [Data Sources and Structure](#data-sources-and-structure)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Project Overview

History Through Art is a comprehensive online resource designed to support students and educators in studying and mastering AP Art History. The website provides multimedia content, including videos, notes, and pictures, to enhance learning and understanding of art history. The application also includes analytics capabilities to track user engagement.

## Codebase Structure

```
HistoryThroughArt.com/
├── frontend/                  # React.js application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Page-specific components
│   │   │   ├── Admin/         # Admin dashboard
│   │   │   ├── ArtGallery/    # Gallery view
│   │   │   ├── Flashcards/    # Flashcard study tool
│   │   │   ├── Home/          # Home page
│   │   │   ├── Calendar/      # Calendar tools
│   │   │   ├── Exhibit/       # Exhibit pages
│   │   │   ├── Map/           # Interactive map
│   │   │   ├── Tutorial/      # Tutorial pages
│   │   │   └── About/         # About pages
│   │   ├── utils/             # Utility functions & services
│   │   │   ├── supabaseClient.js # Supabase connection
│   │   │   ├── analyticsService.js # Analytics functionality
│   │   │   ├── authService.js  # Authentication logic
│   │   │   └── timeTracker.js  # Time tracking functionality
│   │   ├── data/              # Static data sources
│   │   ├── artImages/         # Art images used in the application
│   │   ├── App.js             # Main application component
│   │   └── index.js           # Entry point
│   ├── package.json           # Frontend dependencies
│   └── tailwind.config.js     # Tailwind CSS configuration
├── supabase-setup.sql         # Database setup scripts
├── supabase-fix-aggregates.sql # Fix for aggregate functions
└── supabase-cors-setup.md     # CORS configuration for Supabase
```

## Technology Stack

### Frontend
- **React**: Main UI framework (v18.2.0)
- **React Router**: For navigation (v6.23.1)
- **Tailwind CSS**: For styling
- **Chart.js**: Data visualization (with react-chartjs-2)
- **React Calendar**: Calendar functionality

### Backend/Database
- **Supabase**: Backend as a service
  - Authentication
  - PostgreSQL database
  - Row-level security

### Deployment
- **Vercel**: Frontend deployment

## API Documentation

### External APIs

#### Mapbox
The application uses Mapbox for interactive map features:
- Set up with environment variable `REACT_APP_MAPBOX_TOKEN`
- Used in the Map page components
- Provides geographical visualization of art history

### Supabase Tables

#### user_sessions
Tracks user engagement with the application.

**Schema:**
- `id`: UUID (Primary Key)
- `user_id`: TEXT (Non-authenticated unique identifier)
- `session_time_sec`: INTEGER (Time spent in seconds)
- `page_path`: TEXT (Page URL path)
- `created_at`: TIMESTAMP WITH TIME ZONE

### Analytics Service API

The application uses `analyticsService.js` to interact with the Supabase backend:

#### Key Functions

```javascript
// Get total time spent by all users
AnalyticsService.getTotalTime()

// Get aggregated time per user
AnalyticsService.getUserTimeAggregated()

// Get filtered session data
AnalyticsService.getSessions({
  startDate,     // ISO date string
  endDate,       // ISO date string
  pagePath,      // Filter by specific page
  minSessionLength // Minimum session time in seconds
})
```

### Authentication

Authentication is managed through `authService.js` which provides:

- Admin login functionality
- Session management
- Authorization checks

## Development Workflow

### Setup Environment

1. Clone the repository:
```bash
git clone https://github.com/yourusername/HistoryThroughArt.com.git
cd HistoryThroughArt.com
```

2. Install dependencies:
```bash
npm install
cd frontend
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the `frontend` directory with:
```
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_MAPBOX_TOKEN=your_mapbox_token
```

4. Run the development server:
```bash
cd frontend
npm start
```

Alternatively, you can use the provided development script:
```bash
# Make script executable
chmod +x start_dev.sh

# Run the script
./start_dev.sh
```

### Database Setup

1. Create a Supabase project
2. Run the SQL scripts provided in `supabase-setup.sql`
3. Configure CORS according to `supabase-cors-setup.md`

### Branching and Pull Request Strategy

We follow a structured branching strategy to ensure code quality and stability:

1. **Branch Structure**
   - `main`: Production branch, deployed to live site
   - `development`: Integration branch for testing before production
   - `feature/*`: Feature branches for individual changes

2. **Development Process**
   - Create a new feature branch from `development`:
     ```bash
     git checkout development
     git pull
     git checkout -b feature/your-feature-name
     ```
   - Make your changes and commit them
   - Push your feature branch:
     ```bash
     git push -u origin feature/your-feature-name
     ```

3. **Pull Request Process**
   - Create a pull request from your feature branch to `development`
   - Vercel will automatically create a preview deployment
   - Perform integration testing on the preview site
   - Address any review comments or issues
   - Once approved, merge into `development`

4. **Production Deployment**
   - Create a pull request from `development` to `main`
   - Verify the Vercel preview deployment for production
   - After final review and testing, merge to `main`
   - Vercel will automatically deploy the changes to production

5. **CI/CD Integration**
   - Every pull request triggers a Vercel preview deployment
   - Integration tests should be run on preview deployments
   - Production deployment happens automatically on merge to `main`

## Conventions and Best Practices

### Code Style
- Keep component files under 200 lines
- Use functional components with React hooks
- Use Tailwind CSS for styling
- Document functions with JSDoc comments

### Component Structure
- Page components go in the `pages` directory
- Reusable UI components go in the `components` directory
- Helper functions go in the `utils` directory

### State Management
- Use React Context API for global state
- Use local state with useState for component-specific state

### File Naming
- Use PascalCase for component files (e.g., `NavBar.js`)
- Use camelCase for utility files (e.g., `supabaseClient.js`)

## Deployment

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy from main branch

### Supabase Configuration
- Configure Row Level Security (RLS) according to `supabase-setup.sql`
- Set up admin users for analytics access

## Troubleshooting

### Common Issues

#### Supabase Connection Problems
- Check environment variables are correctly set
- Verify CORS configuration
- Use `testSupabaseConnection()` from `supabaseClient.js`

#### Analytics Data Not Showing
- Check permissions in Supabase RLS
- Verify the table schema matches expected structure
- Use browser developer tools to look for API errors

#### Admin Access Issues
- Ensure admin users are properly set up in Supabase Auth
- Check login credentials 

## Data Sources and Structure

The application uses JSON files to store art history data:

### artworks.json
A comprehensive database of art pieces with the following structure:
- Contains metadata for each artwork (title, artist, period, etc.)
- Includes links to multimedia resources
- Used as the primary data source for the gallery, flashcards, and other features

### Data Processing Scripts
The repository includes several Python scripts for data management:
- `correct_info.py`: Script to make corrections to artwork data
- `missing_info.py`: Identifies missing information in the dataset
- `multiple_videos.py`: Handles multiple video sources for artworks

Data files are stored in the `frontend/src/data` directory and loaded at runtime. 