# 🤱 Mama Mind - Comprehensive Maternity Care Platform

A full-stack maternity care web application built for expecting mothers and healthcare providers. Featuring real-time vitals tracking, AI-powered assistance, beautiful UI, and comprehensive pregnancy management tools.

## 🎯 MVP Demo Ready!

**Hackathon-ready MVP with demo credentials:**
- **Patient Demo:** `patient@demo.com` / `password`
- **Doctor Demo:** `doctor@demo.com` / `password`
- **Live Demo:** [mama-mind.vercel.app](https://mama-mind.vercel.app)

## ✨ MVP Features Completed

### 🔐 Authentication & User Management
- ✅ **Supabase Auth Integration** - Email/password authentication
- ✅ **Role-based Access** - Separate dashboards for patients and doctors
- ✅ **Profile Management** - Comprehensive profile pages for both roles
- ✅ **Responsive Login/Signup** - Beautiful forms with ShadCN styling

### 📊 Patient Dashboard
- ✅ **Pregnancy Progress Tracking** - Gestational week display with progress visualization
- ✅ **Vitals Logging System** - Blood pressure, weight, glucose tracking with validation
- ✅ **Recent Vitals Display** - Clean list view with status indicators
- ✅ **Emergency Alert System** - One-click emergency notifications with toast feedback
- ✅ **AI Chat Assistant** - GPT-powered pregnancy support with intelligent responses
- ✅ **Responsive Design** - Mobile-first approach with Framer Motion animations

### 👩‍⚕️ Doctor Dashboard
- ✅ **Patient Management** - Comprehensive patient list with risk assessment
- ✅ **Vitals Monitoring** - Real-time patient vitals with status indicators
- ✅ **Alert Triage System** - Priority-based alert management
- ✅ **Patient Cards** - Detailed patient information with contact details
- ✅ **Responsive Layout** - Optimized for all screen sizes

### 🤖 AI Chat Assistant
- ✅ **Intelligent Responses** - Context-aware pregnancy guidance
- ✅ **Medical Information** - Blood pressure, nutrition, exercise advice
- ✅ **Emergency Guidance** - Proper escalation for serious concerns
- ✅ **Fallback System** - Works with or without backend connection
- ✅ **Beautiful UI** - Modern chat interface with animations

### 🎨 Design & UX
- ✅ **Clinical Branding** - Professional teal/navy theme with accessibility focus
- ✅ **Framer Motion Animations** - Smooth transitions and micro-interactions
- ✅ **Responsive Design** - Mobile-first approach with breakpoint optimization
- ✅ **Toast Notifications** - User feedback via Sonner
- ✅ **Loading States** - Proper loading indicators throughout

### 🔧 Technical Implementation
- ✅ **Next.js 14 App Router** - Modern React framework with TypeScript
- ✅ **Fastify Backend** - High-performance API with chat functionality
- ✅ **Supabase Integration** - Database and authentication ready
- ✅ **Tailwind CSS v4** - Utility-first styling with custom design system
- ✅ **ShadCN UI Components** - Consistent, accessible component library

## 🚀 Quick Start

**Demo the MVP:**
1. Visit the live demo or run locally: `npm run dev`
2. Login with demo credentials above
3. Experience patient or doctor dashboard
4. Test vitals logging, AI chat, and emergency alerts

**For developers:**

👉 **[QUICKSTART.md](./QUICKSTART.md)** - Get up and running in 5 minutes!

🛠️ **[DEVELOPER-GUIDE.md](./DEVELOPER-GUIDE.md)** - Complete development setup and workflow  
🎨 **[Frontend Guide](./src/FRONTEND-GUIDE.md)** - React/Next.js development  
🚀 **[Backend Guide](./server/BACKEND-GUIDE.md)** - Fastify/Node.js development

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
- **Sonner** for toast notifications

### Backend
- **Fastify** for high-performance API
- **Supabase** for database and auth
- **OpenAI** for AI chat features (ready for integration)
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
│   │   ├── auth/          # Login/register pages
│   │   ├── dashboard/     # Patient & doctor dashboards
│   │   ├── profile/       # User profile pages
│   │   └── api/           # API routes
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
- Emergency alert system with one-click activation

### Doctor Dashboard
- Patient overview and management
- Alert triage and response
- Appointment scheduling
- Medical record access
- Risk assessment and monitoring

### AI Chat Assistant
- Context-aware pregnancy guidance
- Medical information and advice
- Emergency symptom recognition
- Fallback system for reliability
- Beautiful, responsive chat interface

### Profile Management
- Comprehensive patient profiles
- Doctor credentials and certifications
- Medical history tracking
- Insurance information
- Emergency contact management

### Security & Privacy
- End-to-end encryption for sensitive data
- HIPAA-compliant data handling
- Role-based access control
- Audit logging for all actions

## 🎨 Design System

### Brand Colors
- **Primary:** #8ECAD1 (teal) - Trust and calm
- **Secondary:** #466D77 (navy) - Professional and reliable
- **Accent:** #F8E9A1 (soft yellow) - Warmth and care

### Typography
- **Headings:** Inter font family
- **Body:** Open Sans font family
- **Responsive:** Clamp-based scaling

### Components
- **Cards:** Medical-themed with subtle shadows
- **Buttons:** Primary, secondary, and ghost variants
- **Forms:** Validation with helpful error messages
- **Animations:** Smooth transitions with Framer Motion

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for expecting mothers and healthcare providers**
