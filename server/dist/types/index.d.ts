import { FastifyRequest } from 'fastify';
import { SupabaseClient } from '@supabase/supabase-js';
import { Server } from 'socket.io';
import { RedisClientType } from 'redis';
declare module 'fastify' {
    interface FastifyInstance {
        supabase: SupabaseClient;
        io: Server;
        redis: RedisClientType;
    }
}
declare module '@fastify/jwt' {
    interface FastifyJWT {
        user: {
            id: string;
            email: string;
            role: string;
        };
    }
}
export interface AuthenticatedRequest extends FastifyRequest {
    user: {
        id: string;
        email: string;
        role: string;
    };
}
export interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'patient' | 'doctor' | 'admin';
    phone_number?: string;
    due_date?: string;
    specialization?: string;
    baseline_weight?: number;
    gestational_week?: number;
    emergency_contact?: string;
    medical_history?: string;
    created_at: string;
    updated_at: string;
}
export interface VitalsRecord {
    id: string;
    user_id: string;
    weight?: number;
    blood_pressure_systolic?: number;
    blood_pressure_diastolic?: number;
    heart_rate?: number;
    temperature?: number;
    oxygen_saturation?: number;
    glucose_level?: number;
    notes?: string;
    analysis_status: 'normal' | 'warning' | 'critical';
    risk_score: number;
    recorded_at: string;
}
export interface Alert {
    id: string;
    user_id: string;
    vitals_id?: string;
    type: 'normal' | 'warning' | 'critical';
    category: string;
    message: string;
    metadata?: any;
    created_at: string;
    acknowledged_at?: string;
}
export interface KickCount {
    id: string;
    user_id: string;
    count: number;
    duration: number;
    notes?: string;
    recorded_at: string;
}
export interface Contraction {
    id: string;
    user_id: string;
    start_time: string;
    duration: number;
    intensity: 'mild' | 'moderate' | 'strong';
    notes?: string;
    recorded_at: string;
}
//# sourceMappingURL=index.d.ts.map