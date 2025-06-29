# 🔑 API Keys Setup for Developers

*This guide helps you get your own Supabase API keys for development*

---

## 🎯 Goal: Get Your Own API Keys

You need your **own** Supabase project so you can develop without affecting production data.

**⏱️ Time needed**: ~10 minutes  
**💰 Cost**: FREE (using Supabase free tier)

---

## 🚀 The 5-Step Process

### 1️⃣ Create Supabase Account
- Go to [supabase.com](https://supabase.com)
- Click "Start your project" 
- Sign up with GitHub (easiest)

### 2️⃣ Create Your Dev Project
- Click "New Project"
- Name: `mama-mind-dev-yourname`
- Plan: **Free** (perfect for development)
- Wait 2-3 minutes for setup

### 3️⃣ Setup Database
- Go to **SQL Editor** in your project
- Copy entire content of our `/database/schema.sql`
- Paste and click **Run**
- *(Optional)* Run `/database/sample-data.sql` for test data

### 4️⃣ Get Your Keys
- Go to **Settings > API**
- Copy these 3 values:
  - **Project URL**: `https://yourproject.supabase.co`
  - **Anon key**: `eyJhbG...` (for frontend)
  - **Service role key**: `eyJhbG...` (for backend - longer key)

### 5️⃣ Configure Environment
```bash
# Auto-create .env files
npm run env:setup

# Edit .env.local (frontend)
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Edit server/.env (backend)  
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=make_this_long_and_random_32plus_chars
```

---

## ✅ Test Your Setup

```bash
# Validate environment
npm run env:test

# Start development (if validation passes)
npm run dev:check
```

**Success looks like:**
- ✅ Environment validation passed
- 🚀 Frontend running on http://localhost:3000
- 🚀 Backend running on http://localhost:3001

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "Invalid API key" | Double-check you copied keys correctly |
| "Project not found" | Verify project URL is exact |
| Database errors | Re-run database schema setup (Step 3) |
| Environment errors | Run `npm run env:setup` again |

---

## 💡 What You Get

✅ **Your own database** - experiment freely!  
✅ **Separate from production** - no risk of breaking anything  
✅ **Free tier limits** - 500MB storage, 50k users (plenty for dev)  
✅ **Complete isolation** - your changes don't affect others  

---

## 🤝 Need Help?

1. **Check our detailed [QUICKSTART.md](./QUICKSTART.md)** for more info
2. **Ask the team lead** for project-specific help
3. **Visit [Supabase docs](https://supabase.com/docs)** for Supabase questions

---

**🎉 Once you see both servers running, you're ready to develop!**
