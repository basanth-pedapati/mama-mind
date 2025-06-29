'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('patient' | 'doctor')[];
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = ['patient', 'doctor'],
  redirectTo = '/auth/login'
}: ProtectedRouteProps) {
  const { user, loading, getCurrentUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const currentUser = getCurrentUser();
      
      // If we have a user (real or demo)
      if (currentUser) {
        console.log('User authenticated with role:', currentUser.role);
        
        // Check if user has the required role
        if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role as 'patient' | 'doctor')) {
          const roleRedirect = currentUser.role === 'doctor' ? '/dashboard/doctor' : '/dashboard/patient';
          console.log('User role not allowed, redirecting to:', roleRedirect);
          router.push(roleRedirect);
          return;
        }
        
        console.log('User authorized for this route');
        return;
      }
      
      // No user found
      console.log('No user found, redirecting to login');
      router.push(redirectTo);
    }
  }, [user, loading, allowedRoles, redirectTo, router, getCurrentUser]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mx-auto mb-4"
          >
            <Heart className="h-12 w-12 text-primary" />
          </motion.div>
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <p className="text-foreground">Loading...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Show content if we have a user with proper role
  const currentUser = getCurrentUser();
  if (currentUser && allowedRoles.includes(currentUser.role as 'patient' | 'doctor')) {
    return <>{children}</>;
  }

  return null; // Will redirect to login
} 