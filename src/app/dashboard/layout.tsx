'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Heart, 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Activity, 
  Calendar, 
  MessageCircle, 
  BarChart3,
  Baby,
  Stethoscope,
  User
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ 
  children
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Default values - these would be determined by the actual user context
  const userRole = 'patient' // This should come from auth context
  const userName = 'Sarah Johnson' // This should come from auth context

  const patientNavItems = [
    { icon: Activity, label: 'Dashboard', href: '/dashboard/patient', active: true },
    { icon: Heart, label: 'Vitals', href: '/dashboard/vitals' },
    { icon: Baby, label: 'Pregnancy Progress', href: '/dashboard/progress' },
    { icon: Calendar, label: 'Appointments', href: '/dashboard/appointments' },
    { icon: MessageCircle, label: 'Chat with AI', href: '/dashboard/chat' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: User, label: 'Profile', href: '/profile/patient' },
  ]

  const doctorNavItems = [
    { icon: Activity, label: 'Dashboard', href: '/dashboard/doctor', active: true },
    { icon: Stethoscope, label: 'Patients', href: '/dashboard/patients' },
    { icon: Calendar, label: 'Appointments', href: '/dashboard/appointments' },
    { icon: Bell, label: 'Alerts', href: '/dashboard/alerts' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: User, label: 'Profile', href: '/profile/doctor' },
  ]

  const navItems = userRole === 'patient' ? patientNavItems : doctorNavItems

  return (
    <div className="min-h-screen bg-gradient-soft">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-surface/95 backdrop-blur-md border-r border-border/50 shadow-xl
          lg:translate-x-0 lg:static lg:shadow-none
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Heart className="h-8 w-8 text-primary" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient-primary">Mama Mind</h1>
                <p className="text-xs text-muted-foreground capitalize">{userRole} Portal</p>
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {userName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-medium text-foreground">{userName}</p>
                <p className="text-sm text-muted-foreground">
                  {userRole === 'patient' ? '32 weeks pregnant' : 'Obstetrician'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${item.active 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-error"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="lg:ml-72">
        {/* Top header */}
        <header className="sticky top-0 z-40 w-full bg-surface/80 backdrop-blur-md border-b border-border/50">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            {/* Page title - will be dynamic */}
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold text-secondary">Dashboard</h2>
              <p className="text-muted-foreground">Welcome back, {userName.split(' ')[0]}!</p>
            </div>

            {/* Header actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"
                  />
                </Button>
              </motion.div>

              {/* Profile menu */}
              <Link href={userRole === 'patient' ? '/profile/patient' : '/profile/doctor'}>
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/30 transition-colors">
                  <span className="text-primary font-semibold text-sm">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar close button */}
      {sidebarOpen && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 lg:hidden bg-surface shadow-lg"
          onClick={() => setSidebarOpen(false)}
        >
          <X className="h-6 w-6" />
        </Button>
      )}
    </div>
  )
}
