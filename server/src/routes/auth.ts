import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcrypt';

// Validation schemas
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(2),
  role: z.enum(['patient', 'doctor', 'admin']).default('patient'),
  phoneNumber: z.string().optional(),
  dueDate: z.string().optional(), // For patients
  specialization: z.string().optional(), // For doctors
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const RefreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Types
interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export default async function authRoutes(fastify: FastifyInstance) {
  // Authentication middleware
  const authenticate = async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const decoded = await request.jwtVerify();
      request.user = decoded as any;
    } catch (error) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  };

  // Register endpoint
  fastify.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = RegisterSchema.parse(request.body);
      
      // Check if user already exists
      const { data: existingUser } = await fastify.supabase
        .from('users')
        .select('id')
        .eq('email', body.email)
        .single();

      if (existingUser) {
        return reply.code(409).send({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(body.password, 12);

      // Create user in Supabase Auth
      const { data: authUser, error: authError } = await fastify.supabase.auth.admin.createUser({
        email: body.email,
        password: body.password,
        email_confirm: true,
        user_metadata: {
          full_name: body.fullName,
          role: body.role,
        },
      });

      if (authError) {
        fastify.log.error('Auth user creation error:', authError);
        return reply.code(400).send({ error: 'Failed to create user account' });
      }

      // Create user profile in database
      const { data: user, error: dbError } = await fastify.supabase
        .from('users')
        .insert({
          id: authUser.user?.id,
          email: body.email,
          full_name: body.fullName,
          role: body.role,
          phone_number: body.phoneNumber,
          due_date: body.dueDate,
          specialization: body.specialization,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) {
        fastify.log.error('Database user creation error:', dbError);
        // Clean up auth user if database insertion fails
        await fastify.supabase.auth.admin.deleteUser(authUser.user?.id!);
        return reply.code(400).send({ error: 'Failed to create user profile' });
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove sensitive data
      const { password_hash, ...userResponse } = user;

      reply.code(201).send({
        message: 'User registered successfully',
        user: userResponse,
        token,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error('Registration error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Login endpoint
  fastify.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = LoginSchema.parse(request.body);

      // Authenticate with Supabase Auth
      const { data: authData, error: authError } = await fastify.supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password,
      });

      if (authError || !authData.user) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }

      // Get user profile from database
      const { data: user, error: dbError } = await fastify.supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (dbError || !user) {
        return reply.code(401).send({ error: 'User profile not found' });
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        email: user.email,
        role: user.role,
      });

      // Remove sensitive data
      const { password_hash, ...userResponse } = user;

      reply.send({
        message: 'Login successful',
        user: userResponse,
        token,
        refreshToken: authData.session?.refresh_token,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error('Login error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Get current user profile
  fastify.get('/me', { preHandler: authenticate }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const { data: user, error } = await fastify.supabase
        .from('users')
        .select('*')
        .eq('id', request.user?.id)
        .single();

      if (error || !user) {
        return reply.code(404).send({ error: 'User not found' });
      }

      // Remove sensitive data
      const { password_hash, ...userResponse } = user;

      reply.send({ user: userResponse });
    } catch (error) {
      fastify.log.error('Get user error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Update user profile
  fastify.put('/profile', { preHandler: authenticate }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      const allowedFields = ['full_name', 'phone_number', 'due_date', 'emergency_contact', 'medical_history'];
      const updates: any = {};
      
      // Filter only allowed fields
      for (const [key, value] of Object.entries(request.body as any)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updates[key] = value;
        }
      }

      if (Object.keys(updates).length === 0) {
        return reply.code(400).send({ error: 'No valid fields to update' });
      }

      updates.updated_at = new Date().toISOString();

      const { data: user, error } = await fastify.supabase
        .from('users')
        .update(updates)
        .eq('id', request.user?.id)
        .select()
        .single();

      if (error) {
        fastify.log.error('Update user error:', error);
        return reply.code(400).send({ error: 'Failed to update profile' });
      }

      // Remove sensitive data
      const { password_hash, ...userResponse } = user;

      reply.send({
        message: 'Profile updated successfully',
        user: userResponse,
      });

    } catch (error) {
      fastify.log.error('Update profile error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Refresh token endpoint
  fastify.post('/refresh', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = RefreshTokenSchema.parse(request.body);

      const { data: authData, error } = await fastify.supabase.auth.refreshSession({
        refresh_token: body.refreshToken,
      });

      if (error || !authData.user) {
        return reply.code(401).send({ error: 'Invalid refresh token' });
      }

      // Generate new JWT
      const { data: user } = await fastify.supabase
        .from('users')
        .select('id, email, role')
        .eq('id', authData.user.id)
        .single();

      const token = fastify.jwt.sign({
        id: user?.id,
        email: user?.email,
        role: user?.role,
      });

      reply.send({
        token,
        refreshToken: authData.session?.refresh_token,
      });

    } catch (error) {
      fastify.log.error('Refresh token error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });

  // Logout endpoint
  fastify.post('/logout', { preHandler: authenticate }, async (request: AuthenticatedRequest, reply: FastifyReply) => {
    try {
      // In a more complex setup, you might want to blacklist the JWT token
      // For now, we'll just return success as the client should remove the token
      reply.send({ message: 'Logged out successfully' });
    } catch (error) {
      fastify.log.error('Logout error:', error);
      reply.code(500).send({ error: 'Internal server error' });
    }
  });
}
