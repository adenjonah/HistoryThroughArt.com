# History Through Art - Developer Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Codebase Structure](#codebase-structure)
- [Technology Stack](#technology-stack)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
  - [Getting Started](#getting-started)
  - [Branching and Pull Request Strategy](#branching-and-pull-request-strategy)
  - [Testing Preview Deployments](#testing-preview-deployments)
  - [Bug Reports and Feature Requests](#bug-reports-and-feature-requests)
  - [Communication Channels](#communication-channels)
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

## Contributing

### Getting Started

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

3. Start the development server:
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

6. **Code Review Standards**
   - All PRs must be reviewed by at least one other developer
   - Automated tests must pass before merging
   - Check that the Vercel preview builds correctly
   - Test functionality on the preview deployment before approval

### Testing Preview Deployments

When a pull request is created, Vercel automatically creates a preview deployment. This deployment is crucial for testing changes before they're merged:

1. **Accessing the Preview**
   - Find the "Preview" link in the pull request comments added by the Vercel bot
   - The preview URL will follow the pattern: `https://history-through-art-git-feature-name.vercel.app`

2. **Required Integration Tests**
   - Verify all affected features work as expected
   - Test responsive design on multiple screen sizes
   - Check that analytics tracking is functioning correctly
   - Ensure all links and navigation elements work properly
   - Validate that content is loading correctly

3. **Cross-Browser Testing**
   - Test on Chrome, Firefox, and Safari at minimum
   - Verify functionality on mobile devices if applicable

4. **Performance Checks**
   - Run Lighthouse tests to check performance metrics
   - Address any critical performance issues before merging

5. **Approval Process**
   - Document testing results in the PR comments
   - Issues found must be addressed before approval
   - Clearly state "Approved" when testing is complete and successful

### Bug Reports and Feature Requests

Before starting work on a new feature or bug fix, follow these steps:

1. **Check Existing Issues**
   - Search the GitHub issue tracker to see if the bug or feature has already been reported
   - If it exists, add comments with any additional information you have

2. **Creating New Issues**
   - For bugs: Create a new issue with the "bug" label
     - Include steps to reproduce
     - Describe expected vs. actual behavior
     - Include browser/device information if relevant
   - For features: Create a new issue with the "enhancement" label
     - Clearly describe the feature and its benefits
     - Include mockups or diagrams if applicable

3. **Issue Assignment**
   - Feel free to work on any open issue
   - All work is asynchronous - no need to ask for permission to begin work
   - Simply start by creating a feature branch and submitting a PR when ready
   - Reference the issue number in your pull request with "Fixes #123" or "Relates to #123"

4. **Work Tracking**
   - Move issues to the appropriate project board column when you start working on them
   - Update issue status as you make progress

### Communication Channels

Stay connected with the team through these communication channels:

1. **GitHub Discussions**
   - Use for technical discussions about features and implementation details
   - Tag relevant team members for specific questions

2. **Discord Server**
   - Join our Discord server: [https://discord.gg/cMkzPGTNQK](https://discord.gg/cMkzPGTNQK)
   - Use the #history-through-art channel for project discussions
   - All communication is asynchronous - no need to wait for real-time responses

3. **Code Review Comments**
   - Use GitHub's review feature for inline comments
   - Keep feedback constructive and specific

4. **Getting Help**
   - For questions, post in the appropriate Discord channel
   - Include screenshots or code snippets when describing issues

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