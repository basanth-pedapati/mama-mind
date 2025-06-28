-- Mama Mind Database Migration - Handle Existing Tables
-- Run this SQL in your Supabase SQL Editor to fix existing schema

-- First, let's drop the problematic policies that cause infinite recursion
DROP POLICY IF EXISTS "Doctors can view patients" ON public.users;

-- Drop and recreate policies to fix any recursion issues
-- Users table policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Add missing policies for appointments if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'appointments') THEN
        -- Drop existing policies first
        DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
        DROP POLICY IF EXISTS "Patients can create appointments" ON public.appointments;
        
        -- Create new policies
        CREATE POLICY "Users can view own appointments" ON public.appointments
          FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = doctor_id);

        CREATE POLICY "Patients can create appointments" ON public.appointments
          FOR INSERT WITH CHECK (auth.uid() = patient_id);
          
        RAISE NOTICE 'Appointment policies updated';
    END IF;
END $$;

-- Add missing policies for chat_feedback if table exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chat_feedback') THEN
        -- Drop existing policies first
        DROP POLICY IF EXISTS "Users can view own feedback" ON public.chat_feedback;
        DROP POLICY IF EXISTS "Users can create feedback" ON public.chat_feedback;
        
        -- Create new policies
        CREATE POLICY "Users can view own feedback" ON public.chat_feedback
          FOR SELECT USING (auth.uid() = user_id);

        CREATE POLICY "Users can create feedback" ON public.chat_feedback
          FOR INSERT WITH CHECK (auth.uid() = user_id);
          
        RAISE NOTICE 'Chat feedback policies updated';
    END IF;
END $$;

-- Ensure RLS is enabled on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kick_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contractions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Enable RLS on optional tables if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chat_feedback') THEN
        ALTER TABLE public.chat_feedback ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'appointments') THEN
        ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Create missing indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_vitals_user_id ON public.vitals(user_id);
CREATE INDEX IF NOT EXISTS idx_vitals_recorded_at ON public.vitals(recorded_at);
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON public.alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON public.alerts(type);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_kick_counts_user_id ON public.kick_counts(user_id);
CREATE INDEX IF NOT EXISTS idx_contractions_user_id ON public.contractions(user_id);

-- Create the updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add missing triggers
DO $$ 
BEGIN
    -- Check if trigger exists before creating
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'set_updated_at' 
        AND event_object_table = 'users'
    ) THEN
        CREATE TRIGGER set_updated_at
          BEFORE UPDATE ON public.users
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_updated_at();
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'uploaded_files') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'set_updated_at' 
            AND event_object_table = 'uploaded_files'
        ) THEN
            CREATE TRIGGER set_updated_at
              BEFORE UPDATE ON public.uploaded_files
              FOR EACH ROW
              EXECUTE FUNCTION public.handle_updated_at();
        END IF;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'appointments') THEN
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.triggers 
            WHERE trigger_name = 'set_updated_at' 
            AND event_object_table = 'appointments'
        ) THEN
            CREATE TRIGGER set_updated_at
              BEFORE UPDATE ON public.appointments
              FOR EACH ROW
              EXECUTE FUNCTION public.handle_updated_at();
        END IF;
    END IF;
END $$;

-- Verify the setup
SELECT 
  'Migration completed successfully! 🎉' as message,
  'Tables: ' || count(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Show existing tables
SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('users', 'vitals', 'alerts', 'chat_conversations', 'kick_counts', 'contractions', 'uploaded_files') 
    THEN '✅ Core table'
    ELSE '📋 Additional table'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
