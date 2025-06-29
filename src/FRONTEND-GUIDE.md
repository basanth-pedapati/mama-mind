# 🎨 Frontend Development Guide

## 🚀 Getting Started

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Auth layout group
│   ├── dashboard/      # Dashboard pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/
│   ├── ui/             # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useDashboard.ts
│   └── ...
├── lib/                # Utilities and configurations
│   ├── api.ts          # API client
│   ├── supabase.ts     # Supabase client
│   ├── utils.ts        # Utility functions
│   └── ...
└── types/              # TypeScript type definitions
```

## 🎯 Component Development

### UI Component Pattern
```typescript
// components/ui/Button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Feature Component Pattern
```typescript
// components/features/VitalsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { motion } from "framer-motion"

interface VitalsCardProps {
  title: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
  status?: 'normal' | 'warning' | 'danger'
  className?: string
}

export function VitalsCard({ 
  title, 
  value, 
  unit, 
  trend, 
  status = 'normal',
  className 
}: VitalsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />
      case 'down': return <TrendingDown className="h-4 w-4" />
      default: return <Minus className="h-4 w-4" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'warning': return 'border-amber-200 bg-amber-50'
      case 'danger': return 'border-red-200 bg-red-50'
      default: return 'border-green-200 bg-green-50'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("relative overflow-hidden", getStatusColor(), className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-bold">{value}</span>
              {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
            </div>
            {trend && (
              <div className={cn(
                "flex items-center space-x-1 text-sm",
                trend === 'up' ? 'text-green-600' : 
                trend === 'down' ? 'text-red-600' : 'text-gray-600'
              )}>
                {getTrendIcon()}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

## 🎨 Styling Guidelines

### Tailwind CSS Usage
```typescript
// ✅ Good - Use semantic classes
<div className="bg-card text-card-foreground rounded-lg border shadow-sm">

// ✅ Good - Use utilities for spacing and layout  
<div className="flex items-center justify-between p-4 gap-3">

// ✅ Good - Use responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ Avoid - Hard-coded colors
<div className="bg-blue-500 text-white">

// ❌ Avoid - Magic numbers
<div className="p-[13px] ml-[27px]">
```

### CSS Variables (Theming)
```css
/* globals.css */
:root {
  /* Brand Colors */
  --primary: 340 82% 52%;           /* Deep rose */
  --primary-foreground: 0 0% 98%;   /* Near white */
  
  /* UI Colors */
  --background: 0 0% 100%;          /* Pure white */
  --foreground: 240 10% 3.9%;      /* Dark gray */
  --muted: 240 4.8% 95.9%;         /* Light gray */
  --accent: 340 20% 96%;           /* Light rose */
  
  /* Status Colors */
  --success: 142 76% 36%;          /* Green */
  --warning: 38 92% 50%;           /* Amber */
  --destructive: 0 84% 60%;        /* Red */
}

[data-theme="dark"] {
  /* Dark mode overrides */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... */
}
```

### Animation Guidelines
```typescript
// Use Framer Motion for animations
import { motion, AnimatePresence } from "framer-motion"

// Page transitions
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
}

// Card hover effects
<motion.div
  whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>

// Loading states
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
>
```

## 🔧 Custom Hooks

### API Data Fetching
```typescript
// hooks/useVitals.ts
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface Vital {
  id: string
  type: string
  value: number
  unit: string
  recorded_at: string
}

export function useVitals() {
  const [vitals, setVitals] = useState<Vital[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVitals = async () => {
    try {
      setLoading(true)
      const response = await api.get('/vitals')
      setVitals(response.data.vitals)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vitals')
    } finally {
      setLoading(false)
    }
  }

  const addVital = async (vital: Omit<Vital, 'id' | 'recorded_at'>) => {
    try {
      const response = await api.post('/vitals', vital)
      setVitals(prev => [response.data.vital, ...prev])
      return response.data.vital
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add vital')
      throw err
    }
  }

  useEffect(() => {
    fetchVitals()
  }, [])

  return {
    vitals,
    loading,
    error,
    refetch: fetchVitals,
    addVital
  }
}
```

### Form Management
```typescript
// hooks/useForm.ts
import { useState, useCallback } from 'react'

interface UseFormOptions<T> {
  initialValues: T
  validate?: (values: T) => Partial<Record<keyof T, string>>
  onSubmit: (values: T) => void | Promise<void>
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }, [errors])

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault()
    
    if (validate) {
      const validationErrors = validate(values)
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors)
        return
      }
    }

    try {
      setIsSubmitting(true)
      await onSubmit(values)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }, [values, validate, onSubmit])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    handleSubmit,
    reset
  }
}
```

## 📱 Responsive Design

### Breakpoint Strategy
```typescript
// Use Tailwind's responsive prefixes
<div className="
  grid grid-cols-1           // Mobile: 1 column
  sm:grid-cols-2            // Small: 2 columns  
  md:grid-cols-3            // Medium: 3 columns
  lg:grid-cols-4            // Large: 4 columns
  xl:grid-cols-5            // XL: 5 columns
  gap-4                     // Consistent gap
">

// Mobile-first approach
<nav className="
  fixed bottom-0 left-0 right-0    // Mobile: bottom nav
  md:static md:w-64                 // Desktop: sidebar
  bg-background border-t md:border-r
">
```

### Touch-Friendly Design
```typescript
// Ensure interactive elements are at least 44px
<button className="h-11 min-w-[44px] px-4">

// Add hover states for desktop, active states for mobile
<button className="
  bg-primary text-primary-foreground
  hover:bg-primary/90 
  active:bg-primary/80
  transition-colors
">
```

## 🧪 Testing

### Component Testing
```typescript
// __tests__/components/VitalsCard.test.tsx
import { render, screen } from '@testing-library/react'
import { VitalsCard } from '@/components/features/VitalsCard'

describe('VitalsCard', () => {
  it('renders vital information correctly', () => {
    render(
      <VitalsCard
        title="Blood Pressure"
        value="120/80"
        unit="mmHg"
        status="normal"
        trend="stable"
      />
    )

    expect(screen.getByText('Blood Pressure')).toBeInTheDocument()
    expect(screen.getByText('120/80')).toBeInTheDocument()
    expect(screen.getByText('mmHg')).toBeInTheDocument()
  })

  it('applies correct styling for warning status', () => {
    render(
      <VitalsCard
        title="Heart Rate"
        value={110}
        unit="bpm"
        status="warning"
      />
    )

    const card = screen.getByText('Heart Rate').closest('div')
    expect(card).toHaveClass('border-amber-200', 'bg-amber-50')
  })
})
```

### Hook Testing
```typescript
// __tests__/hooks/useVitals.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { useVitals } from '@/hooks/useVitals'
import { api } from '@/lib/api'

jest.mock('@/lib/api')
const mockedApi = api as jest.Mocked<typeof api>

describe('useVitals', () => {
  it('fetches vitals on mount', async () => {
    const mockVitals = [
      { id: '1', type: 'blood_pressure', value: 120, unit: 'mmHg', recorded_at: '2024-01-01' }
    ]
    
    mockedApi.get.mockResolvedValue({ data: { vitals: mockVitals } })

    const { result } = renderHook(() => useVitals())

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.vitals).toEqual(mockVitals)
    })
  })
})
```

## 🚀 Performance

### Code Splitting
```typescript
// Dynamic imports for large components
import dynamic from 'next/dynamic'

const DashboardCharts = dynamic(
  () => import('@/components/dashboard/Charts'),
  { 
    loading: () => <div>Loading charts...</div>,
    ssr: false // Client-side only if needed
  }
)

// Route-based code splitting (automatic in Next.js App Router)
```

### Image Optimization
```typescript
import Image from 'next/image'

// Use Next.js Image component
<Image
  src="/pregnancy-hero.jpg"
  alt="Pregnancy journey illustration"
  width={800}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

## 🔍 Debugging

### React DevTools
- Install React DevTools browser extension
- Use Profiler for performance debugging
- Component tree inspection

### Next.js Debugging
```typescript
// Enable debug mode
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    instrumentationHook: true,
  },
}
```

### Error Boundaries
```typescript
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>
    }

    return this.props.children
  }
}
```

## 📦 Build & Deployment

### Build Process
```bash
# Development build
npm run dev

# Production build
npm run build
npm run start

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix
```

### Environment Variables
```bash
# .env.local (local development)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

This guide should help frontend developers get up to speed quickly! The patterns shown here are used throughout the codebase for consistency.
