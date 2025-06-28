'use client'

import { motion } from 'framer-motion'
import { Heart, TrendingUp, Calendar, Bell, Baby, Activity, AlertTriangle, Plus, RefreshCw, Scale, Thermometer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import { PregnancyProgress } from '@/components/ui/pregnancy-progress'
import { VitalsCard } from '@/components/ui/vitals-card'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  const { data, loading, error, refreshData, markAlertAsRead, resolveAlert } = useDashboard(user?.id || null)

  // Transform vitals data for the VitalsCard component
  const transformVitalsData = (vitals: any[]) => {
    const iconMap: { [key: string]: any } = {
      'blood_pressure': Activity,
      'weight': Scale,
      'heart_rate': Heart,
      'temperature': Thermometer,
      'glucose': Activity,
      'baby_movement': Baby
    }

    return vitals.map(vital => ({
      id: vital.id,
      name: vital.type.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
      value: vital.value,
      unit: vital.unit,
      status: 'normal' as const, // We could add logic to determine status based on value
      trend: 'stable' as const, // We could calculate trend from historical data
      icon: iconMap[vital.type] || Activity,
      lastUpdated: vital.recorded_at,
      normalRange: getNormalRange(vital.type)
    }))
  }

  const getNormalRange = (type: string): string => {
    const ranges: { [key: string]: string } = {
      'blood_pressure': '90-120/60-80 mmHg',
      'weight': 'Varies by trimester',
      'heart_rate': '60-100 bpm',
      'temperature': '98.6°F (37°C)',
      'glucose': '70-140 mg/dL',
      'baby_movement': '10+ per 2 hours'
    }
    return ranges[type] || 'Normal range varies'
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error && !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Dashboard</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={refreshData} className="bg-primary hover:bg-primary-dark">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  const quickStats = [
    {
      title: "Current Week",
      value: data?.pregnancyProgress.weeksPregnant.toString() || "0",
      unit: "weeks",
      change: `Trimester ${data?.pregnancyProgress.trimester || 1}`,
      icon: Baby,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Days Remaining",
      value: data?.pregnancyProgress.daysRemaining.toString() || "0",
      unit: "days",
      change: data?.pregnancyProgress.dueDate ? new Date(data.pregnancyProgress.dueDate).toLocaleDateString() : "Due date not set",
      icon: Calendar,
      color: "text-accent",
      bg: "bg-accent/10"
    },
    {
      title: "Health Score",
      value: data?.stats.healthScore.toString() || "0",
      unit: "/100",
      change: data?.stats.weeklyTrend ? `${data.stats.weeklyTrend > 0 ? '+' : ''}${data.stats.weeklyTrend}% this week` : "No change",
      icon: Activity,
      color: "text-success",
      bg: "bg-success/10"
    },
    {
      title: "Active Alerts",
      value: data?.stats.activeAlerts.toString() || "0",
      unit: "alerts",
      change: data?.alerts.filter(a => !a.is_read).length ? `${data.alerts.filter(a => !a.is_read).length} unread` : "All read",
      icon: AlertTriangle,
      color: "text-warning",
      bg: "bg-warning/10"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "vitals",
      title: "Vitals Recorded",
      description: "Blood pressure, weight, and heart rate logged",
      time: "2 hours ago",
      icon: Activity,
      status: "normal"
    },
    {
      id: 2,
      type: "appointment",
      title: "Appointment Scheduled",
      description: "Regular checkup with Dr. Smith",
      time: "1 day ago",
      icon: Calendar,
      status: "scheduled"
    },
    {
      id: 3,
      type: "alert",
      title: "Blood Pressure Alert",
      description: "Slightly elevated reading detected",
      time: "3 hours ago",
      icon: AlertTriangle,
      status: "warning"
    },
    {
      id: 4,
      type: "milestone",
      title: "Pregnancy Milestone",
      description: "Entered 3rd trimester - 8 months!",
      time: "1 week ago",
      icon: Baby,
      status: "milestone"
    }
  ]

  const statusColors = {
    normal: "text-success bg-success/10",
    scheduled: "text-primary bg-primary/10",
    warning: "text-warning bg-warning/10",
    milestone: "text-accent bg-accent/10"
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome section */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Heart className="h-8 w-8 text-primary animate-pulse-soft" />
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.profile?.first_name || 'there'}!
            </h1>
            <p className="text-muted-foreground">Here's how you and baby are doing today</p>
          </div>
        </div>
      </motion.div>

      {/* Quick stats */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="bg-surface/80 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300 hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.bg}`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-bold text-foreground">{stat.value}</span>
                      <span className="text-sm text-muted-foreground">{stat.unit}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{stat.title}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Pregnancy progress and vitals */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pregnancy Progress */}
          <motion.div variants={itemVariants}>
            <PregnancyProgress
              weeksCurrent={data?.pregnancyProgress.weeksPregnant || 0}
              weeksTotal={40}
              babyName={user?.profile?.first_name ? `Baby ${user.profile.first_name}` : "Your Baby"}
              nextAppointment={data?.pregnancyProgress.dueDate ? `Due: ${new Date(data.pregnancyProgress.dueDate).toLocaleDateString()}` : "Due date not set"}
              vitalsStatus={(data?.stats.healthScore || 0) >= 80 ? "normal" : (data?.stats.healthScore || 0) >= 60 ? "warning" : "critical"}
            />
          </motion.div>

          {/* Current Vitals */}
          <motion.div variants={itemVariants}>
            <VitalsCard vitals={transformVitalsData(data?.vitals || [])} />
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-medical border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl text-secondary">Quick Actions</CardTitle>
                <CardDescription>Record your daily health information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button className="bg-primary hover:bg-primary-dark text-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
                    <Activity className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Record Vitals
                  </Button>
                  <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-surface">
                    <Baby className="mr-2 h-4 w-4" />
                    Track Movement
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right column - Recent activity and alerts */}
        <div className="space-y-6">
          {/* Active Alerts */}
          <motion.div variants={itemVariants}>
            <Card className="bg-warning/5 border-warning/20 hover:border-warning/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-warning flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Active Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.alerts && data.alerts.length > 0 ? (
                    data.alerts.slice(0, 3).map((alert) => (
                      <div key={alert.id} className={`p-3 rounded-lg border ${
                        alert.severity === 'critical' ? 'bg-destructive/10 border-destructive/20' :
                        alert.severity === 'high' ? 'bg-warning/10 border-warning/20' :
                        alert.severity === 'medium' ? 'bg-accent/10 border-accent/20' :
                        'bg-surface/10 border-border/20'
                      }`}>
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 animate-pulse-soft ${
                            alert.severity === 'critical' ? 'bg-destructive' :
                            alert.severity === 'high' ? 'bg-warning' :
                            alert.severity === 'medium' ? 'bg-accent' :
                            'bg-muted-foreground'
                          }`} />
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${
                              alert.severity === 'critical' ? 'text-destructive' :
                              alert.severity === 'high' ? 'text-warning' :
                              alert.severity === 'medium' ? 'text-accent' :
                              'text-foreground'
                            }`}>
                              {alert.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {alert.message}
                            </p>
                            <div className="flex space-x-2 mt-2">
                              {!alert.is_read && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs"
                                  onClick={() => data && markAlertAsRead && markAlertAsRead(alert.id)}
                                >
                                  Mark Read
                                </Button>
                              )}
                              {!alert.is_resolved && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-xs"
                                  onClick={() => data && resolveAlert && resolveAlert(alert.id)}
                                >
                                  Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No active alerts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={itemVariants}>
            <Card className="bg-surface/80 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg text-secondary">Recent Activity</CardTitle>
                <CardDescription>Your latest health records and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data?.stats.recentActivity && data.stats.recentActivity.length > 0 ? (
                    data.stats.recentActivity.map((activity, index) => (
                      <motion.div
                        key={`${activity.type}-${index}`}
                        whileHover={{ x: 4 }}
                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-surface-hover transition-colors cursor-pointer"
                      >
                        <div className="p-2 rounded-full bg-primary/10">
                          {activity.type === 'vital' && <Activity className="h-4 w-4 text-primary" />}
                          {activity.type === 'alert' && <AlertTriangle className="h-4 w-4 text-warning" />}
                          {activity.type === 'chat' && <Heart className="h-4 w-4 text-accent" />}
                          {activity.type === 'appointment' && <Calendar className="h-4 w-4 text-accent" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(activity.timestamp).toLocaleDateString()} at {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Activity className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming appointments */}
          <motion.div variants={itemVariants}>
            <Card className="bg-accent/5 border-accent/20 hover:border-accent/40 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-lg text-secondary flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-accent" />
                  <span>Upcoming</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-accent/10 rounded-lg">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-accent font-bold">15</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Regular Checkup</p>
                      <p className="text-sm text-muted-foreground">Dr. Smith • 2:00 PM</p>
                      <p className="text-xs text-accent">In 3 days</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
