import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type User = {
  id: string
  email: string
  role: 'patient' | 'doctor' | 'admin'
  created_at: string
  profile?: UserProfile
}

export type UserProfile = {
  id: string
  user_id: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  last_menstrual_period?: string
  due_date?: string
  blood_type?: string
  allergies?: string
  medical_history?: string
  doctor_id?: string
  created_at: string
  updated_at: string
}

export type VitalRecord = {
  id: string
  user_id: string
  type: 'blood_pressure' | 'weight' | 'heart_rate' | 'temperature' | 'glucose' | 'baby_movement'
  value: string
  unit: string
  notes?: string
  recorded_at: string
  created_at: string
}

export type Alert = {
  id: string
  user_id: string
  type: 'anomaly' | 'appointment' | 'medication' | 'emergency'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  is_read: boolean
  is_resolved: boolean
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

export type ChatMessage = {
  id: string
  user_id: string
  message: string
  response: string
  message_type: 'question' | 'concern' | 'general'
  metadata?: Record<string, unknown>
  created_at: string
}

export const getVitals = async (userId: string): Promise<Record<string, unknown>[]> => {
  try {
    const { data, error } = await supabase
      .from('vitals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return [];
  }
};

export const addVital = async (vital: Record<string, unknown>): Promise<Record<string, unknown> | null> => {
  try {
    const { data, error } = await supabase
      .from('vitals')
      .insert([vital])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding vital:', error);
    return null;
  }
};
