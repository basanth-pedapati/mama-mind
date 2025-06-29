import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: (string | undefined | null | Record<string, unknown>)[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date, options?: Record<string, unknown>): string {
  const defaultOptions: Record<string, unknown> = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return new Date(date).toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

export function formatTime(date: Date | string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function calculateWeeksPregnant(lastMenstrualPeriod: Date | string): number {
  const lmp = new Date(lastMenstrualPeriod)
  const today = new Date()
  const diffTime = Math.abs(today.getTime() - lmp.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.floor(diffDays / 7)
}

export function getPregnancyTrimester(weeks: number): 1 | 2 | 3 {
  if (weeks <= 12) return 1
  if (weeks <= 27) return 2
  return 3
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Calculate days until due date
export function daysUntilDue(dueDate: string): number {
  const due = new Date(dueDate)
  const now = new Date()
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

// Validate vitals ranges
export function validateVitals(vitals: Record<string, unknown>): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (vitals.bloodPressure && typeof vitals.bloodPressure === 'object' && vitals.bloodPressure !== null) {
    const bp = vitals.bloodPressure as Record<string, unknown>;
    if (typeof bp.systolic === 'number' && (bp.systolic < 70 || bp.systolic > 200)) {
      errors.push('Systolic blood pressure should be between 70-200 mmHg')
    }
    if (typeof bp.diastolic === 'number' && (bp.diastolic < 40 || bp.diastolic > 130)) {
      errors.push('Diastolic blood pressure should be between 40-130 mmHg')
    }
  }
  
  if (typeof vitals.heartRate === 'number' && (vitals.heartRate < 50 || vitals.heartRate > 200)) {
    errors.push('Heart rate should be between 50-200 BPM')
  }
  
  if (typeof vitals.weight === 'number' && vitals.weight < 50) {
    errors.push('Weight seems unusually low')
  }
  
  if (typeof vitals.temperature === 'number' && (vitals.temperature < 95 || vitals.temperature > 105)) {
    errors.push('Temperature should be between 95-105°F')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Format blood pressure for display
export function formatBloodPressure(systolic: number, diastolic: number): string {
  return `${systolic}/${diastolic} mmHg`
}

// Get vitals status color
export function getVitalsStatusColor(status: 'normal' | 'warning' | 'critical'): string {
  switch (status) {
    case 'normal':
      return 'text-green-600 bg-green-50 border-green-200'
    case 'warning':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200'
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

// API request helper
export async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Record<string, unknown>> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const token = localStorage.getItem('auth_token')
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }
  
  return response.json()
}

export function debounce<T extends (...args: Record<string, unknown>[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
