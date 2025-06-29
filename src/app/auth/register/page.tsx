'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff, Mail, Lock, User, Calendar, Stethoscope, ArrowLeft, Baby, Activity, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'

type UserRole = 'patient' | 'doctor'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [userRole, setUserRole] = useState<UserRole>('patient')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phoneNumber: '',
    dueDate: '',
    specialization: ''
  })

  const { signUp, user } = useAuth()
  const router = useRouter()

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      role: formData.get('role') as 'patient' | 'doctor'
    }

    // Validation
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (data.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      })

      router.push('/dashboard')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred during registration';
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => setCurrentStep(2)
  const prevStep = () => setCurrentStep(1)

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
            Join our caring community
          </p>
        </motion.div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of 2</span>
            <span>{currentStep === 1 ? 'Choose your role' : 'Create account'}</span>
          </div>
          <div className="w-full bg-surface-light rounded-full h-2">
            <motion.div
              initial={{ width: "50%" }}
              animate={{ width: currentStep === 1 ? "50%" : "100%" }}
              transition={{ duration: 0.3 }}
              className="bg-primary h-2 rounded-full"
            />
          </div>
        </div>

        {/* Registration Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Card className="bg-surface/80 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-secondary">
                {currentStep === 1 ? 'Choose Your Role' : 'Create Account'}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 
                  ? 'Select how you\'ll be using Mama Mind'
                  : 'Fill in your details to get started'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {currentStep === 1 ? (
                <div className="space-y-4">
                  {/* Role Selection */}
                  <div className="grid grid-cols-1 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserRole('patient')}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${userRole === 'patient' 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Baby className={`h-6 w-6 ${userRole === 'patient' ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div>
                          <h3 className={`font-semibold ${userRole === 'patient' ? 'text-primary' : 'text-foreground'}`}>
                            Expecting Mother
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Track your pregnancy journey and vitals
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setUserRole('doctor')}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${userRole === 'doctor' 
                          ? 'border-secondary bg-secondary/10' 
                          : 'border-border hover:border-secondary/50'
                        }
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <Stethoscope className={`h-6 w-6 ${userRole === 'doctor' ? 'text-secondary' : 'text-muted-foreground'}`} />
                        <div>
                          <h3 className={`font-semibold ${userRole === 'doctor' ? 'text-secondary' : 'text-foreground'}`}>
                            Healthcare Provider
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Monitor and care for your patients
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <Button
                    onClick={nextStep}
                    className="w-full bg-primary hover:bg-primary-dark text-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group mt-6"
                  >
                    Continue
                    <Activity className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      label="Full Name"
                      icon={User}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />

                    <Input
                      type="email"
                      placeholder="Enter your email"
                      label="Email Address"
                      icon={Mail}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />

                    <Input
                      type="tel"
                      placeholder="Enter your phone number"
                      label="Phone Number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />

                    {userRole === 'patient' && (
                      <Input
                        type="date"
                        label="Expected Due Date"
                        icon={Calendar}
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      />
                    )}

                    {userRole === 'doctor' && (
                      <Input
                        type="text"
                        placeholder="e.g., Obstetrics & Gynecology"
                        label="Specialization"
                        icon={Stethoscope}
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      />
                    )}
                    
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
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

                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        label="Confirm Password"
                        icon={Lock}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-[38px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="text-primary hover:text-primary-dark">Terms of Service</Link>
                    {' '}and{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary-dark">Privacy Policy</Link>
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

                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="w-full border-secondary text-secondary hover:bg-secondary hover:text-surface"
                    >
                      Back
                    </Button>

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
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>

                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium transition-colors">
                      Sign in here
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
