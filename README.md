# Gull - Social Network for Athletes

A LinkedIn-style social platform connecting athletes, teams, and scouts.

## Features

- **Athlete Profiles**: Showcase skills, stats, videos, and resumes from any age
- **Team Profiles**: Represent sports teams and organizations
- **Feed**: Share thoughts, photos, videos, and achievements
- **Explore**: Discover talent and connect with the sports community
- **Authentication**: Secure signup and login

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT

## Getting Started

### Quick Start with Docker (Recommended)

1. Make sure you have Docker and Docker Compose installed
2. Clone the repository
3. Run the application:

\`\`\`bash
docker-compose up
\`\`\`

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Manual Setup

#### Prerequisites
- Node.js 20+
- PostgreSQL 16+

#### Backend Setup

1. Navigate to backend directory:
\`\`\`bash
cd backend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create \`.env\` file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Update the DATABASE_URL in \`.env\` with your PostgreSQL connection string

5. Run Prisma migrations:
\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
\`\`\`

6. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

#### Frontend Setup

1. Navigate to frontend directory:
\`\`\`bash
cd frontend
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

## Project Structure

\`\`\`
gull/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & upload middleware
│   │   └── index.ts        # Entry point
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx
│   └── package.json
└── docker-compose.yml
\`\`\`

## API Endpoints

### Authentication
- POST /api/auth/signup - Create new account
- POST /api/auth/login - Login to existing account

### Profiles
- GET /api/profiles/:id - Get profile by ID
- PUT /api/profiles - Update own profile
- POST /api/profiles/skills - Add skill to profile
- PUT /api/profiles/resume - Update resume
- GET /api/profiles/explore - Discover profiles

### Posts
- POST /api/posts - Create new post
- GET /api/posts/feed - Get feed
- POST /api/posts/:id/like - Like a post
- DELETE /api/posts/:id/like - Unlike a post
- POST /api/posts/:id/comments - Comment on post

## Business Model

Platform for scouts and commercial partners to discover athletic talent.
