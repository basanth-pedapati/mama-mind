'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const fetchDashboardData = useCallback(async () => {
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data';
      console.error('Failed to fetch dashboard data:', err)
      setError(errorMessage)
      
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
  }, [userId])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const refreshData = () => {
    fetchDashboardData()
  }

  const addVital = async (vital: Record<string, unknown>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newVital: VitalRecord = {
        id: Date.now().toString(),
        user_id: userId || '',
        type: (vital.type as VitalRecord['type']) || 'blood_pressure',
        value: (vital.value as string) || '',
        unit: (vital.unit as string) || '',
        notes: (vital.notes as string) || undefined,
        recorded_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      
      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          vitals: [newVital, ...prev.vitals]
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding vital:', error);
      return { success: false, error: 'Failed to add vital' };
    }
  };

  const updateVital = async (id: string, updates: Record<string, unknown>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          vitals: prev.vitals.map(vital => 
            vital.id === id ? { ...vital, ...updates } : vital
          )
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error updating vital:', error);
      return { success: false, error: 'Failed to update vital' };
    }
  };

  const deleteVital = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          vitals: prev.vitals.filter(vital => vital.id !== id)
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting vital:', error);
      return { success: false, error: 'Failed to delete vital' };
    }
  };

  const addAlert = async (alert: Record<string, unknown>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newAlert: Alert = {
        id: Date.now().toString(),
        user_id: userId || '',
        type: (alert.type as Alert['type']) || 'anomaly',
        severity: (alert.severity as Alert['severity']) || 'low',
        title: (alert.title as string) || '',
        message: (alert.message as string) || '',
        is_read: false,
        is_resolved: false,
        metadata: alert.metadata as Record<string, unknown> || undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          alerts: [newAlert, ...prev.alerts]
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding alert:', error);
      return { success: false, error: 'Failed to add alert' };
    }
  };

  const markAlertAsRead = async (alertId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          alerts: prev.alerts.map(alert => 
            alert.id === alertId ? { ...alert, is_read: true } : alert
          )
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error marking alert as read:', error);
      return { success: false, error: 'Failed to mark alert as read' };
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          alerts: prev.alerts.map(alert => 
            alert.id === alertId ? { ...alert, is_resolved: true } : alert
          )
        };
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error resolving alert:', error);
      return { success: false, error: 'Failed to resolve alert' };
    }
  };

  return {
    data,
    loading,
    error,
    refreshData,
    addVital,
    updateVital,
    deleteVital,
    addAlert,
    markAlertAsRead,
    resolveAlert
  }
}
