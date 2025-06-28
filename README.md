# 🤱 Mama Mind - Comprehensive Maternity Care Platform

A full-stack maternity care web application built for expecting mothers and healthcare providers. Featuring real-time vitals tracking, AI-powered assistance, beautiful UI, and comprehensive pregnancy management tools.

## ✨ Features

- 📊 **Real-time Vitals Tracking** - Blood pressure, weight, heart rate, baby movement
- 🤖 **AI-Powered Chat Assistant** - 24/7 support with intelligent triage
- 📱 **Responsive Dashboard** - Beautiful, mobile-first design with animations
- 👩‍⚕️ **Role-based Access** - Separate dashboards for patients and doctors
- 🔔 **Smart Alerts** - Automated health monitoring and notifications
- 📈 **Pregnancy Progress** - Week-by-week tracking with milestones
- 🗂️ **File Management** - Upload and manage medical records
- 🔐 **Secure Authentication** - Powered by Supabase with RLS

## 🚀 Quick Start

**New to the project? Start here:**

👉 **[QUICKSTART.md](./QUICKSTART.md)** - Get up and running in 5 minutes!

**For developers:**

🛠️ **[DEVELOPER-GUIDE.md](./DEVELOPER-GUIDE.md)** - Complete development setup and workflow  
🎨 **[Frontend Guide](./src/FRONTEND-GUIDE.md)** - React/Next.js development  
🚀 **[Backend Guide](./server/BACKEND-GUIDE.md)** - Fastify/Node.js development  
🤝 **[CONTRIBUTING.md](./CONTRIBUTING.md)** - How to contribute to the project  
📋 **[TEAM-TEMPLATES.md](./TEAM-TEMPLATES.md)** - Communication templates and workflows

```bash
# Quick developer setup
npm run setup:dev
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS v4+** for styling
- **ShadCN UI** + **Radix** for components
- **Framer Motion** for animations
- **Lucide Icons** for iconography

### Backend
- **Fastify** for high-performance API
- **Supabase** for database and auth
- **OpenAI** for AI chat features
- **Socket.io** for real-time features
- **Redis** for caching and sessions

### Database
- **PostgreSQL** (via Supabase)
- **Row Level Security** for data protection
- **Real-time subscriptions** for live updates

## 📁 Project Structure

```
mama-mind/
├── src/                    # Frontend application
│   ├── app/               # Next.js App Router pages
│   ├── components/ui/     # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   └── lib/              # Utilities and API clients
├── server/               # Backend API server
│   └── src/
│       ├── routes/       # API endpoints
│       ├── middleware/   # Server middleware
│       └── services/     # Business logic
├── database/             # Database schema and setup
│   ├── schema.sql        # Main database schema
│   ├── sample-data.sql   # Test data
│   └── SETUP.md         # Detailed database setup
└── shared/              # Shared types and utilities
```

## 🎯 Getting Started

### Quick Setup (5 minutes)
1. **[Follow the Quickstart Guide](./QUICKSTART.md)** - Automated setup
2. Create a Supabase project
3. Run our setup script: `npm run setup`
4. Import the database schema
5. Start coding!

### Manual Setup
If you prefer step-by-step control, see the detailed guides:
- 📊 [Database Setup](./database/SETUP.md)
- 🖥️ [Backend Setup](./server/README.md)
- 🎨 [Frontend Development](./src/README.md)

## 🧪 Development

```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Quick setup for new developers
npm run setup:dev

# Start development servers
npm run dev:all         # Both frontend and backend
npm run dev             # Frontend only (http://localhost:3000)
npm run dev:backend     # Backend only (http://localhost:3001)

# Database operations
npm run setup           # Interactive setup script
npm run db:test         # Test database connection
npm run db:migrate      # Apply database migrations
npm run db:seed         # Add sample data

# Testing and quality
npm run test:all        # Run all tests
npm run lint:all        # Lint all code
npm run type-check:all  # TypeScript checking
```

### 👥 For Team Development

- **Setup:** Run `npm run setup:dev` for guided environment setup
- **VS Code:** Recommended extensions and settings included
- **Documentation:** Comprehensive guides for frontend and backend
- **Templates:** Communication templates for standups, PRs, and planning

## 🌟 Key Features Demo

### Patient Dashboard
- Real-time vitals tracking and trends
- Pregnancy progress visualization
- Smart health alerts and recommendations
- AI chat assistant for 24/7 support

### Doctor Dashboard
- Patient overview and management
- Alert triage and response
- Appointment scheduling
- Medical record access

### Security & Privacy
- End-to-end encryption for sensitive data
- HIPAA-compliant data handling
- Role-based access control
- Audit logging for all actions

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
