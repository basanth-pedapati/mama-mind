# 🗄️ Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login with your GitHub account
3. Click "New Project"
4. Choose your organization
5. Fill in:
   - **Project Name**: `mama-mind`
   - **Database Password**: (create a strong password - save it!)
   - **Region**: Choose closest to you
6. Click "Create new project"
7. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy these values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOi...`)
   - **service_role/secret key** (starts with `eyJhbGciOi...`)

## Step 3: Update Environment Files

### Frontend (.env.local):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### Backend (server/.env):
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the entire content from `database/schema.sql`
4. Click "Run" button
5. You should see "Success. No rows returned" message

## Step 5: Enable Authentication

1. Go to **Authentication** → **Settings**
2. Under **Site URL**, add: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. Save configuration

## Step 6: Set up Row Level Security (RLS)

The schema already includes RLS policies, but verify they're enabled:

1. Go to **Table Editor**
2. For each table, click the table name
3. Click **Settings** tab
4. Ensure "Enable Row Level Security" is ON

## Step 7: Test Database Connection

Run this in your Supabase SQL Editor to verify setup:

```sql
-- Test query
SELECT 
  schemaname,
  tablename 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

You should see all the tables: `users`, `vitals`, `alerts`, etc.

## 🎉 Database Setup Complete!

Your Supabase database is now ready for the Mama Mind app!

## Next Steps:
- Update your environment variables
- Test the backend connection
- Start building frontend components

## Troubleshooting:

**Error: "relation does not exist"**
- Make sure you ran the entire schema.sql file
- Check that all tables were created in the Table Editor

**Authentication issues:**
- Verify your URLs in Authentication settings
- Make sure you're using the correct anon key

**RLS Policy errors:**
- Check that RLS is enabled on all tables
- Verify policies exist in Authentication → Policies

## 🔗 Useful Links:
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
