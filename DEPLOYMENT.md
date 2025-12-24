# Deploying Gull to Vercel

This guide will help you deploy the Gull application to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A PostgreSQL database (you can use Vercel Postgres, Supabase, or Railway)
3. Google OAuth credentials from Google Cloud Console

## Step 1: Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for local development)
   - `https://your-app.vercel.app/api/auth/google/callback` (for production)
6. Save your Client ID and Client Secret

## Step 2: Set Up PostgreSQL Database

### Option A: Vercel Postgres
1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string

### Option B: Supabase
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to Project Settings > Database
4. Copy the connection string (use "Session Pooler" for serverless)

### Option C: Railway
1. Go to [Railway](https://railway.app)
2. Create a new PostgreSQL database
3. Copy the connection string

## Step 3: Configure Environment Variables

You'll need to set these environment variables in Vercel:

```bash
# Database
DATABASE_URL="your-postgres-connection-string"

# Authentication
JWT_SECRET="your-random-secret-key-here"
SESSION_SECRET="your-session-secret-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_CALLBACK_URL="https://your-app.vercel.app/api/auth/google/callback"

# Server
PORT=5000
NODE_ENV=production
```

## Step 4: Deploy to Vercel

### Method 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from the project root:
```bash
vercel
```

4. Follow the prompts and set environment variables when asked

### Method 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Configure project:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/dist`
4. Add environment variables (from Step 3)
5. Click "Deploy"

## Step 5: Run Database Migrations

After deployment, you need to run Prisma migrations:

1. In Vercel dashboard, go to your project settings
2. Connect to your deployment via terminal or use Vercel CLI:

```bash
vercel env pull
cd backend
npx prisma migrate deploy
npx prisma generate
```

## Step 6: Seed the Database (Optional)

To add sample data:

```bash
cd backend
npm run prisma:seed
```

This will create:
- 8 athlete profiles (ages 15-30, various sports)
- 3 scout/agency profiles
- Sample posts from each user

Login credentials for all accounts: `password123`

## Step 7: Update Frontend API URLs

If your backend is deployed separately, update the API URLs in:
- `frontend/src/services/api.ts`
- `frontend/src/pages/Login.tsx`
- `frontend/src/pages/Signup.tsx`
- `frontend/src/pages/AuthCallback.tsx`

Replace `http://localhost:5000` with your production API URL.

## Troubleshooting

### Database Connection Issues
- Make sure your DATABASE_URL is correct
- For serverless environments, use connection pooling
- Check if your database allows connections from Vercel's IP ranges

### Google OAuth Not Working
- Verify redirect URIs match exactly in Google Console
- Check that GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set correctly
- Make sure cookies are enabled in browser

### Build Failures
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compilation works locally first

## Post-Deployment

1. Test authentication (both email and Google)
2. Test creating posts
3. Test profile editing
4. Verify file uploads work
5. Check that explore page shows profiles

## Scaling Considerations

For production use:
- Set up Redis for session storage
- Configure CDN for media uploads (Cloudinary, S3)
- Enable database connection pooling
- Set up monitoring (Sentry, LogRocket)
- Configure rate limiting
- Add email verification

## Support

For issues, check:
- Vercel deployment logs
- Browser console for frontend errors
- Vercel Function logs for backend errors
