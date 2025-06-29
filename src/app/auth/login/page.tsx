'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const router = useRouter()

  // Demo login handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (formData.email && formData.password) {
      toast.success('Login successful!')
      
      // Route based on demo email and set localStorage role
      if (formData.email.includes('doctor') || formData.email.includes('provider')) {
        localStorage.setItem('demoUserRole', 'doctor')
        router.push('/dashboard/doctor')
      } else {
        localStorage.setItem('demoUserRole', 'patient')
        router.push('/dashboard/patient')
      }
    } else {
      setError('Please fill in all fields')
      toast.error('Please fill in all fields')
    }

    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await handleSignIn(e)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-xl"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to home */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <Link 
            href="/"
            className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
        </motion.div>

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="relative">
              <Heart className="h-10 w-10 text-primary" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
              />
            </div>
            <span className="text-3xl font-bold text-gradient-primary">
              Mama Mind
            </span>
          </div>
          <p className="text-muted-foreground">
            Welcome back to your care journey
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Card className="bg-surface/80 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-secondary">Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {/* Demo Credentials */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-accent/20 border border-accent/40 rounded-lg p-3 mb-6 text-xs"
              >
                <p className="font-medium text-secondary mb-1">Demo Credentials:</p>
                <p>Patient: patient@demo.com / password</p>
                <p>Doctor: doctor@demo.com / password</p>
              </motion.div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    label="Email Address"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      label="Password"
                      icon={Lock}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[38px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border text-primary focus:ring-primary/20" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-primary hover:text-primary-dark transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
                  >
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Heart className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    <Heart className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  )}
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Link href="/auth/register" className="text-primary hover:text-primary-dark font-medium transition-colors">
                    Sign up here
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex justify-center items-center space-x-6 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse-soft" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
              <span>256-bit Encryption</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
