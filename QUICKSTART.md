# 🚀 Mama Mind - MVP Quickstart Guide

Welcome to the **Mama Mind MVP** - your hackathon-ready maternity care platform! This guide will get you up and running in under 5 minutes.

## 🎯 MVP Demo Features

✅ **Patient Dashboard** - Gestational tracking, vitals logging, trends visualization  
✅ **Doctor Dashboard** - Patient management, vitals monitoring, alerts  
✅ **AI Chat Assistant** - 24/7 pregnancy support with contextual responses  
✅ **Authentication** - Demo login with role-based access  
✅ **Modern UI** - Clinical branding, animations, mobile-responsive  
✅ **Emergency Alerts** - One-click emergency notifications  
✅ **Data Visualization** - Beautiful charts with Recharts
✅ **Responsive Design** - Mobile-first, works on all devices

## 🔐 Demo Credentials (Ready to Use!)

### Patient Login
- **Email:** `patient@demo.com`
- **Password:** `demo123`

### Doctor Login  
- **Email:** `doctor@demo.com`
- **Password:** `demo123`

## ⚡ Quick Setup (2 Options)

### Option 1: Frontend Only (Fastest - 2 minutes)
```bash
# Install and start frontend
npm install
npm run dev
```
Visit: http://localhost:3000

### Option 2: Full Stack (Frontend + Backend - 5 minutes)
```bash
# Terminal 1: Frontend
npm install
npm run dev

# Terminal 2: Backend (for enhanced AI chat)
cd server
npm install
npm run dev
```

## 🎪 Demo Flow & Script

### Patient Journey (3 minutes)
1. **Login**: Use `patient@demo.com` / `demo123`
2. **Dashboard Overview**: Point out gestational week (28/40), baby size
3. **Log Vitals**: Add blood pressure (try 135/85 for "warning" status)
4. **View Charts**: Show beautiful BP and weight trend visualizations
5. **AI Chat**: Ask "I'm having back pain, is this normal?"
6. **Emergency Alert**: Test one-click emergency notification

### Doctor Journey (2 minutes)
1. **Login**: Use `doctor@demo.com` / `demo123`
2. **Patient List**: Show patient overview with risk scores and search
3. **Alert Management**: Demonstrate alert system
4. **Patient Monitoring**: View patient vitals and trends

## ✨ Key Demo Highlights

### 🎨 **Beautiful UI/UX**
- **Clinical Branding**: Professional teal (#8ECAD1) & navy (#466D77) theme
- **Framer Motion**: Smooth animations throughout
- **ShadCN UI**: Modern, accessible component library
- **Mobile Responsive**: Perfect on phones, tablets, desktop

### 🤖 **Smart AI Assistant**
- Contextual pregnancy guidance
- Medical triage and recommendations  
- Emergency situation detection
- Intelligent responses based on gestational week

### 📊 **Data Visualization**
- Blood pressure trends (systolic/diastolic lines)
- Weight progression (beautiful area charts)
- Real-time status indicators
- Risk assessment scoring

### 🔔 **Alert System**
- Emergency notifications with toast feedback
- Doctor alert management dashboard
- Real-time status updates
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
