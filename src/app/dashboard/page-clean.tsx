'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check for demo role in localStorage or default to patient
    const demoRole = localStorage.getItem('demoRole') || 'patient';
    
    // Redirect to appropriate dashboard
    if (demoRole === 'doctor') {
      router.replace('/dashboard/doctor');
    } else {
      router.replace('/dashboard/patient');
    }
  }, [router]);

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
