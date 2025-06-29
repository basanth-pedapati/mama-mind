# Environment Setup Guide

## 🔐 Environment Variables

This project uses environment variables for sensitive configuration. Each developer needs their own environment setup.

## 📋 Required Environment Variables

### Frontend (.env.local)
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Development
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (server/.env)
```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
NODE_ENV=development
PORT=3001
HOST=localhost

# JWT Configuration
JWT_SECRET=your_development_jwt_secret
```

## 🏗️ Setup Options for Developers

### Option 1: Individual Supabase Projects (Recommended)
Each developer creates their own free Supabase project:

1. **Sign up at [supabase.com](https://supabase.com)**
2. **Create a new project**
3. **Run the database schema**: Use `/database/schema.sql`
4. **Add sample data**: Use `/database/sample-data.sql`
5. **Copy API keys** from Settings > API
6. **Create environment files** with your own keys

### Option 2: Shared Development Database
Use a shared development Supabase instance (team lead provides keys):

1. **Get development keys** from team lead
2. **Create environment files** with shared development keys
3. **Never commit these keys** to git

### Option 3: Local Development with Mock Data
Work with local mock data without Supabase:

1. **Use mock API responses** in development
2. **Skip Supabase setup** initially
3. **Focus on UI/UX development**

## 🚀 Quick Setup Commands

```bash
# Copy environment templates
npm run env:setup

# Test environment configuration
npm run env:test

# Start development with environment validation
npm run dev:check
```

## ⚠️ Important Security Notes

1. **Never commit `.env` files** to git
2. **Use different keys** for development vs production
3. **Rotate keys regularly** in production
4. **Use service role keys** only in backend (never frontend)
5. **Keep anon keys** for frontend use only

## 🔄 Environment Validation

The project includes automatic environment validation to catch missing variables early.

## 📞 Need Help?

- Check existing `.env.example` files for templates
- Ask team lead for shared development database access
- Create your own Supabase project following the setup guide
