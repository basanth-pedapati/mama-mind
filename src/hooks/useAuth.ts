'use client'

import { useEffect, useState } from 'react'
import { supabase, type User } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

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

        setUser({
          id: session.user.id,
          email: session.user.email!,
          role: session.user.user_metadata?.role || 'patient',
          created_at: session.user.created_at!,
          profile
        })
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

        // Set demo role for routing and redirect to appropriate dashboard
        const role = userData.role
        localStorage.setItem('demoRole', role)
        
        // Redirect to appropriate dashboard
        if (role === 'doctor') {
          router.push('/dashboard/doctor')
        } else {
          router.push('/dashboard/patient')
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        localStorage.removeItem('demoRole')
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
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }
}
