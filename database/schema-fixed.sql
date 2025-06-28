-- Mama Mind Database Schema - FIXED VERSION
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER DEFAULT PRIVILEGES GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES GRANT ALL ON SEQUENCES TO authenticated;

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  phone_number TEXT,
  due_date DATE,
  gestational_week INTEGER,
  baseline_weight DECIMAL(5,2),
  emergency_contact JSONB,
  medical_history TEXT,
  specialization TEXT, -- For doctors
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vitals tracking table
CREATE TABLE public.vitals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  weight DECIMAL(5,2),
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  temperature DECIMAL(4,1),
  oxygen_saturation INTEGER,
  glucose_level DECIMAL(5,1),
  notes TEXT,
  analysis_status TEXT DEFAULT 'normal' CHECK (analysis_status IN ('normal', 'warning', 'critical')),
  risk_score DECIMAL(3,2) DEFAULT 0.0,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kick counts table
CREATE TABLE public.kick_counts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  count INTEGER NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contractions table
CREATE TABLE public.contractions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL, -- in seconds
  intensity TEXT NOT NULL CHECK (intensity IN ('mild', 'moderate', 'strong')),
  notes TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Alerts table
CREATE TABLE public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  vitals_id UUID REFERENCES public.vitals(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('normal', 'warning', 'critical')),
  category TEXT NOT NULL, -- 'vitals', 'fetal_movement', 'contractions', 'ai_triage', etc.
  message TEXT NOT NULL,
  metadata JSONB,
  acknowledged_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  user_message TEXT NOT NULL,
  ai_response TEXT NOT NULL,
  triage_level TEXT DEFAULT 'routine' CHECK (triage_level IN ('routine', 'urgent', 'emergency')),
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat feedback table
CREATE TABLE public.chat_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  helpful BOOLEAN,
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Uploaded files table
CREATE TABLE public.uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  filename TEXT NOT NULL,
  stored_filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  category TEXT DEFAULT 'general' CHECK (category IN ('ultrasound', 'lab_results', 'prescription', 'medical_record', 'general')),
  notes TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table (bonus feature)
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  appointment_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  type TEXT DEFAULT 'regular_checkup',
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_vitals_user_id ON public.vitals(user_id);
CREATE INDEX idx_vitals_recorded_at ON public.vitals(recorded_at);
CREATE INDEX idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX idx_alerts_type ON public.alerts(type);
CREATE INDEX idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX idx_kick_counts_user_id ON public.kick_counts(user_id);
CREATE INDEX idx_contractions_user_id ON public.contractions(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kick_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- FIXED: Simple RLS policies without recursion
-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Vitals policies
CREATE POLICY "Users can view own vitals" ON public.vitals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vitals" ON public.vitals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Alerts policies
CREATE POLICY "Users can view own alerts" ON public.alerts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON public.alerts
  FOR UPDATE USING (auth.uid() = user_id);

-- Chat policies
CREATE POLICY "Users can view own chats" ON public.chat_conversations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chats" ON public.chat_conversations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kick counts policies
CREATE POLICY "Users can view own kick counts" ON public.kick_counts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kick counts" ON public.kick_counts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Contractions policies
CREATE POLICY "Users can view own contractions" ON public.contractions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contractions" ON public.contractions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- File upload policies
CREATE POLICY "Users can view own files" ON public.uploaded_files
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can upload files" ON public.uploaded_files
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own files" ON public.uploaded_files
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own files" ON public.uploaded_files
  FOR DELETE USING (auth.uid() = user_id);

-- Appointment policies
CREATE POLICY "Users can view own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

CREATE POLICY "Patients can create appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- Chat feedback policies
CREATE POLICY "Users can view own feedback" ON public.chat_feedback
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback" ON public.chat_feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.uploaded_files
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Success message
SELECT 'Mama Mind database schema created successfully! 🎉' as message;
