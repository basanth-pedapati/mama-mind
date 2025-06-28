// API service layer for communicating with the Fastify backend
import { VitalRecord, Alert, ChatMessage } from './supabase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    return response.json()
  }

  // Health check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health')
  }

  // Vitals API
  async getVitals(userId: string) {
    return this.request<VitalRecord[]>(`/api/vitals/${userId}`)
  }

  async createVital(vitalData: Omit<VitalRecord, 'id' | 'created_at'>) {
    return this.request<VitalRecord>('/api/vitals', {
      method: 'POST',
      body: JSON.stringify(vitalData),
    })
  }

  async updateVital(id: string, updates: Partial<VitalRecord>) {
    return this.request<VitalRecord>(`/api/vitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
  }

  async deleteVital(id: string) {
    return this.request<{ success: boolean }>(`/api/vitals/${id}`, {
      method: 'DELETE',
    })
  }

  // Alerts API
  async getAlerts(userId: string) {
    return this.request<Alert[]>(`/api/alerts/${userId}`)
  }

  async createAlert(alertData: Omit<Alert, 'id' | 'created_at' | 'updated_at'>) {
    return this.request<Alert>('/api/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    })
  }

  async markAlertAsRead(id: string) {
    return this.request<Alert>(`/api/alerts/${id}/read`, {
      method: 'PUT',
    })
  }

  async resolveAlert(id: string) {
    return this.request<Alert>(`/api/alerts/${id}/resolve`, {
      method: 'PUT',
    })
  }

  // Chat API
  async getChatHistory(userId: string) {
    return this.request<ChatMessage[]>(`/api/chat/${userId}`)
  }

  async sendChatMessage(messageData: {
    user_id: string
    message: string
    message_type: 'question' | 'concern' | 'general'
  }) {
    return this.request<ChatMessage>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(messageData),
    })
  }

  // Upload API
  async uploadFile(file: File, metadata: { user_id: string; type: string }) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('metadata', JSON.stringify(metadata))

    return this.request<{ url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    })
  }

  // Analytics API (for dashboard stats)
  async getDashboardStats(userId: string) {
    return this.request<{
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
    }>(`/api/analytics/dashboard/${userId}`)
  }

  // Pregnancy tracking
  async getPregnancyProgress(userId: string) {
    return this.request<{
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
    }>(`/api/analytics/pregnancy/progress/${userId}`)
  }

  // Health trends
  async getHealthTrends(userId: string, period: 'week' | 'month' | '3months' = 'month') {
    return this.request<{
      period: string
      bloodPressure: {
        data: Array<{ date: string; systolic: number; diastolic: number }>
        trend: string
        average: { systolic: number; diastolic: number }
      }
      weight: {
        data: Array<{ date: string; value: number }>
        trend: string
        change: string
      }
      heartRate: {
        data: Array<{ date: string; value: number }>
        trend: string
        average: number
      }
    }>(`/api/analytics/trends/${userId}?period=${period}`)
  }

  // Health insights
  async getHealthInsights(userId: string) {
    return this.request<{
      recommendations: Array<{
        type: string
        priority: string
        title: string
        description: string
        actionable: boolean
      }>
      alerts: Array<{
        type: string
        message: string
        urgency: string
      }>
      achievements: Array<{
        title: string
        description: string
        earnedAt: string
      }>
    }>(`/api/analytics/insights/${userId}`)
  }
}

export const apiService = new ApiService()
export default apiService
