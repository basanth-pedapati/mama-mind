-- Mama Mind Database Migrations and Sample Data
-- Run this AFTER running the main schema.sql

-- Add any schema updates or new features here
-- This file is for iterative updates to the database

-- Sample data for development and testing
-- Remove this section in production

-- Note: You'll need to replace these UUIDs with actual user IDs from Supabase Auth
-- after creating test users through the authentication system

DO $$
DECLARE
    sample_patient_id UUID := '12345678-1234-1234-1234-123456789012'; -- Replace with real UUID
    sample_doctor_id UUID := '87654321-4321-4321-4321-210987654321'; -- Replace with real UUID
BEGIN
    -- Insert sample users (uncomment after creating auth users)
    -- INSERT INTO public.users (id, email, full_name, role, due_date, gestational_week, baseline_weight, phone_number) 
    -- VALUES 
    --   (sample_patient_id, 'patient@test.com', 'Sarah Johnson', 'patient', CURRENT_DATE + INTERVAL '16 weeks', 24, 65.5, '+1234567890'),
    --   (sample_doctor_id, 'doctor@test.com', 'Dr. Emily Chen', 'doctor', NULL, NULL, NULL, '+1987654321');

    -- Sample vitals data
    INSERT INTO public.vitals (user_id, weight, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, temperature, notes, recorded_at) 
    VALUES 
      (sample_patient_id, 70.2, 120, 80, 75, 98.6, 'Morning reading, feeling good', NOW() - INTERVAL '1 day'),
      (sample_patient_id, 70.5, 118, 78, 72, 98.4, 'Post-exercise reading', NOW() - INTERVAL '2 days'),
      (sample_patient_id, 70.8, 125, 82, 78, 98.8, 'Afternoon reading, slight headache', NOW() - INTERVAL '3 days');

    -- Sample kick counts
    INSERT INTO public.kick_counts (user_id, count, duration, notes, recorded_at)
    VALUES
      (sample_patient_id, 12, 60, 'Very active today', NOW() - INTERVAL '6 hours'),
      (sample_patient_id, 8, 60, 'Normal activity', NOW() - INTERVAL '1 day'),
      (sample_patient_id, 15, 60, 'Extra active after eating', NOW() - INTERVAL '2 days');

    -- Sample alerts
    INSERT INTO public.alerts (user_id, type, category, message, metadata, created_at)
    VALUES
      (sample_patient_id, 'warning', 'vitals', 'Blood pressure slightly elevated', '{"systolic": 125, "diastolic": 82}', NOW() - INTERVAL '3 days'),
      (sample_patient_id, 'normal', 'fetal_movement', 'Good fetal movement detected', '{"kicks_per_hour": 12}', NOW() - INTERVAL '6 hours');

    -- Sample chat conversations
    INSERT INTO public.chat_conversations (user_id, user_message, ai_response, triage_level, context, created_at)
    VALUES
      (sample_patient_id, 'I''ve been having mild cramping. Should I be concerned?', 'Mild cramping can be normal during pregnancy, especially in the second trimester as your uterus grows. However, please monitor the intensity and frequency. If cramping becomes severe, persistent, or is accompanied by bleeding, please contact your healthcare provider immediately.', 'routine', '{"gestational_week": 24, "symptoms": ["cramping"]}', NOW() - INTERVAL '1 day'),
      (sample_patient_id, 'What foods should I avoid?', 'During pregnancy, avoid raw or undercooked meats, unpasteurized dairy products, high-mercury fish, raw eggs, and limit caffeine intake. Focus on a balanced diet with plenty of fruits, vegetables, lean proteins, and whole grains.', 'routine', '{"topic": "nutrition"}', NOW() - INTERVAL '2 days');

    RAISE NOTICE 'Sample data inserted successfully!';
    RAISE NOTICE 'Note: Update the user IDs with real UUIDs from your Supabase Auth users';
END $$;
