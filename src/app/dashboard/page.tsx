'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // Check for demo role in localStorage or user role from auth
    let demoRole = 'patient'; // default
    
    if (typeof window !== 'undefined') {
      demoRole = localStorage.getItem('demoRole') || 
                 user?.role || 
                 (user?.email?.includes('doctor') ? 'doctor' : 'patient') ||
                 'patient';
    } else {
      demoRole = user?.role || 'patient';
    }
    
    // Redirect to appropriate dashboard
    if (demoRole === 'doctor') {
      router.replace('/dashboard/doctor');
    } else {
      router.replace('/dashboard/patient');
    }
  }, [router, user, loading]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
