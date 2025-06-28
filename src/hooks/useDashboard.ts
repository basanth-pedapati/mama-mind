'use client'

import { useState, useEffect } from 'react'
import { apiService } from '@/lib/api'
import { VitalRecord, Alert } from '@/lib/supabase'

export interface DashboardData {
  stats: {
    totalVitals: number
    activeAlerts: number
    weeklyTrend: number
    lastRecording: string | null
    healthScore: number
    weeklyGoals: {
      vitalsCompleted: number
      vitalsTarget: number
      appointmentsScheduled: number
      exerciseDays: number
      exerciseTarget: number
    }
    recentActivity: Array<{
      type: string
      description: string
      timestamp: string
    }>
  }
  vitals: VitalRecord[]
  alerts: Alert[]
  pregnancyProgress: {
    weeksPregnant: number
    daysRemaining: number
    dueDate: string | null
    trimester: number
    currentMilestone: {
      week: number
      title: string
      description: string
    }
    upcomingMilestones: Array<{
      week: number
      title: string
      description: string
      completed: boolean
    }>
    symptoms: Array<{
      name: string
      severity: string
      trending: string
    }>
    babySize: {
      length: string
      weight: string
      comparison: string
    }
  }
}

export function useDashboard(userId: string | null) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      
      // Fetch all dashboard data in parallel
      const [
        statsResponse,
        vitalsResponse,
        alertsResponse,
        pregnancyResponse
      ] = await Promise.all([
        apiService.getDashboardStats(userId),
        apiService.getVitals(userId),
        apiService.getAlerts(userId),
        apiService.getPregnancyProgress(userId)
      ])

      setData({
        stats: statsResponse,
        vitals: vitalsResponse,
        alerts: alertsResponse,
        pregnancyProgress: pregnancyResponse
      })
    } catch (err: any) {
      console.error('Failed to fetch dashboard data:', err)
      setError(err.message || 'Failed to load dashboard data')
      
      // Set fallback data for development
      setData({
        stats: {
          totalVitals: 0,
          activeAlerts: 0,
          weeklyTrend: 0,
          lastRecording: null,
          healthScore: 0,
          weeklyGoals: {
            vitalsCompleted: 0,
            vitalsTarget: 7,
            appointmentsScheduled: 0,
            exerciseDays: 0,
            exerciseTarget: 5
          },
          recentActivity: []
        },
        vitals: [],
        alerts: [],
        pregnancyProgress: {
          weeksPregnant: 0,
          daysRemaining: 0,
          dueDate: null,
          trimester: 1,
          currentMilestone: {
            week: 0,
            title: 'Getting started',
            description: 'Welcome to your pregnancy journey'
          },
          upcomingMilestones: [],
          symptoms: [],
          babySize: {
            length: 'N/A',
            weight: 'N/A',
            comparison: 'Just getting started'
          }
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [userId])

  const refreshData = () => {
    setLoading(true)
    fetchDashboardData()
  }

  const addVital = async (vitalData: Omit<VitalRecord, 'id' | 'created_at'>) => {
    if (!userId) return

    try {
      const response = await apiService.createVital(vitalData)
      
      // Update local data
      setData(prev => prev ? {
        ...prev,
        vitals: [response, ...prev.vitals]
      } : null)
      
      // Refresh stats
      const statsResponse = await apiService.getDashboardStats(userId)
      setData(prev => prev ? {
        ...prev,
        stats: statsResponse
      } : null)
      
      return response
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add vital')
    }
  }

  const markAlertAsRead = async (alertId: string) => {
    try {
      await apiService.markAlertAsRead(alertId)
      
      // Update local data
      setData(prev => prev ? {
        ...prev,
        alerts: prev.alerts.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true } : alert
        )
      } : null)
    } catch (err: any) {
      throw new Error(err.message || 'Failed to mark alert as read')
    }
  }

  const resolveAlert = async (alertId: string) => {
    try {
      await apiService.resolveAlert(alertId)
      
      // Update local data
      setData(prev => prev ? {
        ...prev,
        alerts: prev.alerts.map(alert => 
          alert.id === alertId ? { ...alert, is_read: true, is_resolved: true } : alert
        )
      } : null)
    } catch (err: any) {
      throw new Error(err.message || 'Failed to resolve alert')
    }
  }

  return {
    data,
    loading,
    error,
    refreshData,
    addVital,
    markAlertAsRead,
    resolveAlert
  }
}
