# 🚀 Mama Mind - Quick Setup Guide

Welcome to Mama Mind! This guide will get you up and running in under 10 minutes.

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier is fine)
- Git installed

## 🛠️ Quick Setup (5 steps)

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd mama-mind

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in:
   - Name: `mama-mind`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Click "Create new project" and wait 2-3 minutes

### Step 3: Run Setup Script

```bash
# Run the automated setup script
npm run setup
```

This script will:
- Ask for your Supabase credentials
- Update environment files automatically
- Guide you through the next steps

### Step 4: Setup Database Schema

1. Copy the URL provided by the setup script OR go to your Supabase dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy the entire content from `database/schema.sql`
4. Paste it and click **Run**
5. You should see "Success. No rows returned"

### Step 5: Configure Authentication

In your Supabase dashboard:
1. Go to **Authentication** → **Settings**
2. Set **Site URL**: `http://localhost:3000`
3. Add to **Redirect URLs**: `http://localhost:3000/auth/callback`
4. Save configuration

## 🎉 Start the Application

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd server
npm run dev
```

Visit `http://localhost:3000` and you should see the Mama Mind app!

## 🧪 Test Your Setup

1. Try creating a new account at `/auth/register`
2. Login with your account at `/auth/login`
3. Check the dashboard for sample data

## 📁 Project Structure

```
mama-mind/
├── src/                    # Frontend (Next.js)
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities and API clients
├── server/               # Backend (Fastify)
│   └── src/
│       ├── routes/       # API endpoints
│       ├── middleware/   # Server middleware
│       └── services/     # Business logic
├── database/             # Database schema and migrations
└── shared/              # Shared types and utilities
```

## 🔧 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (server/.env)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
PORT=3001
NODE_ENV=development
```

## 🐛 Troubleshooting

### Database Issues
- **"relation does not exist"**: Run the schema.sql file again
- **RLS errors**: Make sure Row Level Security is enabled
- **Authentication errors**: Check your Supabase URLs and keys

### Connection Issues
- **Can't connect to backend**: Make sure backend is running on port 3001
- **CORS errors**: Verify CORS_ORIGIN in backend .env
- **Auth redirects**: Check your redirect URLs in Supabase

### Common Commands
```bash
# Reset and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check if services are running
curl http://localhost:3001/health  # Backend health check
curl http://localhost:3000         # Frontend check

# View backend logs
cd server && npm run dev           # Shows detailed logs
```

## 📚 Next Steps

Once your setup is working:

1. **Add Sample Data**: Run `database/sample-data.sql` in Supabase SQL Editor
2. **Configure External Services** (optional):
   - OpenAI API for AI chat features
   - Twilio for SMS notifications
   - SendGrid for email notifications
3. **Customize the App**: Modify branding, colors, and features
4. **Deploy**: Follow deployment guides for Vercel (frontend) and Railway/Heroku (backend)

## 🆘 Need Help?

- Check the detailed setup guide: `database/SETUP.md`
- Review the API documentation: `server/README.md`
- Check component examples: `src/components/ui/`

## 🎨 Key Features

- ✅ Patient dashboard with vitals tracking
- ✅ Pregnancy progress visualization
- ✅ Real-time alerts and notifications
- ✅ AI-powered chat assistance
- ✅ Doctor dashboard (role-based access)
- ✅ File upload for medical records
- ✅ Beautiful, responsive UI with animations
- ✅ Full authentication and security

Happy coding! 🚀
