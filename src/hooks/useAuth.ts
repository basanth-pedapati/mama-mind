'use client'

import { useEffect, useState, useRef } from 'react'
import { supabase, type User } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const hasRedirected = useRef(false)

  // Check for demo user
  const getDemoUser = (): User | null => {
    // Only access localStorage on the client side
    if (typeof window === 'undefined') return null;
    
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole) {
      return {
        id: 'demo-user-id',
        email: demoRole === 'doctor' ? 'doctor@demo.com' : 'patient@demo.com',
        role: demoRole as 'patient' | 'doctor',
        created_at: new Date().toISOString(),
        profile: {
          id: 'demo-profile-id',
          user_id: 'demo-user-id',
          first_name: demoRole === 'doctor' ? 'Dr. Sarah' : 'Emily',
          last_name: demoRole === 'doctor' ? 'Johnson' : 'Davis',
          phone: '+1 (555) 123-4567',
          date_of_birth: '1990-01-01',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    }
    return null
  }

  // Get current user (real or demo)
  const getCurrentUser = (): User | null => {
    return user || getDemoUser()
  }

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        const userData = {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata?.role || 'patient',
          created_at: session.user.created_at!,
          profile
        }

        setUser(userData)

        // Set demo role for routing
        const role = userData.role
        if (typeof window !== 'undefined') {
          localStorage.setItem('demoRole', role)
        }
        
        // Only redirect for real authentication (not demo)
        if (!session.user.email?.includes('@demo.com') && !hasRedirected.current) {
          hasRedirected.current = true
          if (role === 'doctor') {
            router.replace('/dashboard/doctor')
          } else {
            router.replace('/dashboard/patient')
          }
        }
      }
      
      setLoading(false)
    }

    getSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        const userData = {
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata?.role || 'patient',
          created_at: session.user.created_at!,
          profile
        }

        setUser(userData)

        // Set demo role for routing
        const role = userData.role
        if (typeof window !== 'undefined') {
          localStorage.setItem('demoRole', role)
        }
        
        // Only redirect for real authentication (not demo)
        if (!session.user.email?.includes('@demo.com') && !hasRedirected.current) {
          hasRedirected.current = true
          if (role === 'doctor') {
            router.replace('/dashboard/doctor')
          } else {
            router.replace('/dashboard/patient')
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('demoRole')
        }
        hasRedirected.current = false
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error

    // Set demo role for routing based on user metadata or email
    const role = data.user?.user_metadata?.role || 
                 (data.user?.email?.includes('doctor') ? 'doctor' : 'patient')
    localStorage.setItem('demoRole', role)

    return data
  }

  const signUp = async (email: string, password: string, userData: {
    firstName: string
    lastName: string
    role?: 'patient' | 'doctor'
    phone?: string
    dateOfBirth?: string
  }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: userData.role || 'patient',
          first_name: userData.firstName,
          last_name: userData.lastName,
        }
      }
    })

    if (error) throw error

    // Create profile if signup successful
    if (data.user) {
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          user_id: data.user.id,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          date_of_birth: userData.dateOfBirth,
        })

      if (profileError) throw profileError

      // Set demo role for routing
      const role = userData.role || 'patient'
      localStorage.setItem('demoRole', role)
    }

    return data
  }

  const signOut = async () => {
    // Check if it's a demo user
    if (typeof window === 'undefined') return;
    
    const demoRole = localStorage.getItem('demoRole')
    if (demoRole) {
      // Demo user - just clear localStorage
      localStorage.removeItem('demoRole')
      router.push('/auth/login')
      return
    }

    // Real user - sign out from Supabase
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/auth/login')
  }

  const updateProfile = async (updates: Partial<{
    first_name: string
    last_name: string
    phone: string
    date_of_birth: string
    last_menstrual_period: string
    due_date: string
    blood_type: string
    allergies: string
    medical_history: string
    emergency_contact_name: string
    emergency_contact_phone: string
  }>) => {
    if (!user) throw new Error('No user logged in')

    const { data, error } = await supabase
      .from('user_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    // Update local user state
    setUser(prev => prev ? {
      ...prev,
      profile: { ...prev.profile, ...data }
    } : null)

    return data
  }

  return {
    user: getCurrentUser(),
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    getDemoUser,
    getCurrentUser,
  }
}
