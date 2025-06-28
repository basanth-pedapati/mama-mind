# 🚀 Developer Onboarding Guide

Welcome to the Mama Mind development team! This guide will help you set up your development environment and understand our workflow.

## 🎯 Quick Setup (5 minutes)

### Prerequisites
- **Node.js 18+** and **npm**
- **Git** for version control
- **VS Code** (recommended) with extensions
- **Supabase** account (free tier works)

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd mama-mind

# Install dependencies
npm install
cd server && npm install && cd ..

# Run the interactive setup
npm run setup
```

### 2. Environment Configuration
The setup script will help you configure:
- Supabase database connection
- API keys and secrets
- Development environment variables

### 3. Start Development
```bash
# Terminal 1: Frontend (Next.js)
npm run dev

# Terminal 2: Backend (Fastify)
cd server && npm run dev

# Terminal 3: Database (if needed)
npm run db:studio
```

## 🏗️ Project Architecture

### Frontend (`/src`)
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS v4+ with ShadCN UI
- **State**: React hooks + Context API
- **Animations**: Framer Motion
- **Testing**: Jest + Testing Library

### Backend (`/server`)
- **Framework**: Fastify (high-performance Node.js)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Socket.io
- **Testing**: Jest + Supertest

### Database (`/database`)
- **PostgreSQL** via Supabase
- **Row Level Security** for data protection
- **Migrations** and seed data included

## 👥 Development Workflow

### Branch Strategy
```
main              # Production-ready code
├── dev           # Integration branch
├── feature/xxx   # Feature development
├── bugfix/xxx    # Bug fixes
└── hotfix/xxx    # Emergency fixes
```

### Commit Convention
```bash
feat: add new patient dashboard component
fix: resolve authentication redirect issue
docs: update API documentation
style: improve button hover animations
refactor: optimize vitals data fetching
test: add unit tests for auth service
```

### Pull Request Process
1. Create feature branch from `dev`
2. Develop and test your changes
3. Create PR to `dev` branch
4. Code review and approval
5. Merge to `dev`, deploy to staging
6. Merge `dev` to `main` for production

## 🛠️ Development Commands

### Frontend Development
```bash
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
npm test             # Run tests
```

### Backend Development
```bash
cd server
npm run dev          # Start Fastify dev server
npm run build        # Compile TypeScript
npm run start        # Run production build
npm test             # Run API tests
npm run db:test      # Test database connection
```

### Database Operations
```bash
npm run setup        # Interactive project setup
npm run db:migrate   # Apply database migrations
npm run db:seed      # Add sample data
npm run db:reset     # Reset database (dev only)
npm run db:studio    # Open Supabase Studio
```

## 📱 Frontend Development Guide

### Component Structure
```typescript
// components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  // Component props
}
```

### Styling Guidelines
- Use **Tailwind CSS** utility classes
- Follow **ShadCN UI** patterns
- Implement **dark mode** support
- Use **CSS variables** for theming
- Add **Framer Motion** for animations

### State Management
```typescript
// hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Auth logic here
  
  return { user, loading, signIn, signOut, signUp }
}
```

## 🚀 Backend Development Guide

### API Route Structure
```typescript
// server/src/routes/vitals.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

export default async function vitalsRoutes(fastify: FastifyInstance) {
  // GET /api/vitals
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const { user } = request.user // from auth middleware
    const vitals = await getVitalsForUser(user.id)
    return { vitals }
  })
  
  // POST /api/vitals
  fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const vitalsData = request.body
    const newVital = await createVital(vitalsData)
    return { vital: newVital }
  })
}
```

### Database Queries
```typescript
// Use Supabase client
import { supabase } from '@/lib/supabase'

export async function getVitalsForUser(userId: string) {
  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    
  if (error) throw error
  return data
}
```

## 🔧 VS Code Setup

### Recommended Extensions
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-typescript.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "usernamehw.errorlens",
    "ms-vscode.vscode-jest"
  ]
}
```

### Workspace Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## 🧪 Testing Guidelines

### Frontend Tests
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### Backend Tests
```typescript
// __tests__/routes/vitals.test.ts
import { build } from '../helper'

describe('Vitals API', () => {
  it('should get vitals for authenticated user', async () => {
    const app = build({ t })
    
    const response = await app.inject({
      method: 'GET',
      url: '/api/vitals',
      headers: { authorization: 'Bearer valid-token' }
    })
    
    expect(response.statusCode).toBe(200)
  })
})
```

## 🐛 Debugging

### Frontend Debugging
- Use **React DevTools**
- **Next.js** built-in debugging
- **Chrome DevTools** for performance
- **Tailwind CSS** IntelliSense

### Backend Debugging
- **Fastify** has excellent logging
- Use **VS Code** debugger
- **Supabase Dashboard** for database queries
- **Postman/Insomnia** for API testing

## 📚 Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Fastify Docs](https://www.fastify.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [ShadCN UI](https://ui.shadcn.com/)

### Team Communication
- **Slack/Discord**: Daily communication
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Architecture decisions
- **Weekly Standups**: Progress and blockers

## 🆘 Getting Help

1. **Check existing issues** on GitHub
2. **Ask in team chat** for quick questions
3. **Create detailed issue** for bugs
4. **Tag relevant team members** for reviews

Welcome to the team! 🎉
