'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    // For demo purposes, check if there's a stored user role
    const storedRole = localStorage.getItem('demoUserRole')
    
    // Add a small delay to prevent flash
    const timer = setTimeout(() => {
      if (storedRole === 'doctor') {
        router.replace('/dashboard/doctor')
      } else {
        // Default to patient dashboard for demo
        router.replace('/dashboard/patient')
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="inline-flex items-center space-x-2 mb-6">
          <div className="relative">
            <Heart className="h-12 w-12 text-primary" />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full"
            />
          </div>
          <span className="text-4xl font-bold text-gradient-primary">
            Mama Mind
          </span>
        </div>
        
        <div className="flex items-center justify-center space-x-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading your dashboard...</span>
        </div>
        
        <p className="text-sm text-muted-foreground mt-4 max-w-md mx-auto">
          Redirecting you to your personalized maternity care dashboard
        </p>
      </motion.div>
    </div>
  )
}
