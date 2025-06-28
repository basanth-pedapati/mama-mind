# 🚀 Backend Development Guide

## 🚀 Getting Started

### Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start development server
npm run dev

# Server runs at http://localhost:3001
```

### Project Structure
```
server/
├── src/
│   ├── routes/          # API endpoints
│   │   ├── auth.ts      # Authentication routes
│   │   ├── vitals.ts    # Health vitals routes
│   │   ├── chat.ts      # Chat/AI routes
│   │   ├── alerts.ts    # Alert system routes
│   │   ├── upload.ts    # File upload routes
│   │   └── analytics.ts # Analytics routes
│   ├── middleware/      # Custom middleware
│   │   ├── auth.ts      # Authentication middleware
│   │   ├── cors.ts      # CORS configuration
│   │   └── validation.ts # Request validation
│   ├── services/        # Business logic
│   │   ├── auth.ts      # Authentication service
│   │   ├── vitals.ts    # Vitals processing
│   │   ├── alerts.ts    # Alert generation
│   │   └── ai.ts        # AI/OpenAI integration
│   ├── types/           # TypeScript types
│   │   └── index.ts     # Shared type definitions
│   ├── utils/           # Utility functions
│   │   ├── database.ts  # Database helpers
│   │   ├── validation.ts # Validation schemas
│   │   └── logger.ts    # Logging configuration
│   └── server.ts        # Main server file
├── .env                 # Environment variables
├── .env.example         # Environment template
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🛠️ API Development

### Route Structure
```typescript
// routes/vitals.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { VitalRecord, CreateVitalRequest } from '../types'

export default async function vitalsRoutes(fastify: FastifyInstance) {
  // Route options with schema validation
  const createVitalSchema = {
    body: {
      type: 'object',
      required: ['type', 'value', 'unit'],
      properties: {
        type: { type: 'string', enum: ['blood_pressure', 'weight', 'heart_rate'] },
        value: { type: 'number', minimum: 0 },
        unit: { type: 'string' },
        notes: { type: 'string', maxLength: 500 }
      }
    }
  }

  // GET /api/vitals - Get user's vitals
  fastify.get('/', {
    preHandler: [fastify.authenticate], // Auth middleware
    schema: {
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
          offset: { type: 'integer', minimum: 0, default: 0 },
          type: { type: 'string' }
        }
      }
    }
  }, async (request: FastifyRequest<{
    Querystring: { limit?: number; offset?: number; type?: string }
  }>, reply: FastifyReply) => {
    try {
      const { user } = request.user
      const { limit = 20, offset = 0, type } = request.query

      const vitals = await getVitalsForUser(user.id, { limit, offset, type })
      
      return {
        vitals,
        pagination: {
          limit,
          offset,
          total: vitals.length
        }
      }
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({ error: 'Failed to fetch vitals' })
    }
  })

  // POST /api/vitals - Create new vital record
  fastify.post('/', {
    preHandler: [fastify.authenticate],
    schema: createVitalSchema
  }, async (request: FastifyRequest<{
    Body: CreateVitalRequest
  }>, reply: FastifyReply) => {
    try {
      const { user } = request.user
      const vitalData = request.body

      // Validate vital data
      const validatedData = await validateVitalData(vitalData)
      
      // Create vital record
      const vital = await createVital({
        ...validatedData,
        user_id: user.id,
        recorded_at: new Date()
      })

      // Check for alerts
      await checkVitalAlerts(user.id, vital)

      reply.status(201).send({ vital })
    } catch (error) {
      request.log.error(error)
      if (error instanceof ValidationError) {
        reply.status(400).send({ error: error.message })
      } else {
        reply.status(500).send({ error: 'Failed to create vital record' })
      }
    }
  })
}
```

### Database Operations
```typescript
// services/vitals.ts
import { supabase } from '../utils/database'
import { VitalRecord, CreateVitalRequest } from '../types'

export async function getVitalsForUser(
  userId: string, 
  options: { limit?: number; offset?: number; type?: string } = {}
): Promise<VitalRecord[]> {
  const { limit = 20, offset = 0, type } = options

  let query = supabase
    .from('vitals')
    .select(`
      id,
      type,
      value,
      unit,
      notes,
      recorded_at,
      created_at
    `)
    .eq('user_id', userId)
    .order('recorded_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch vitals: ${error.message}`)
  }

  return data || []
}

export async function createVital(vitalData: CreateVitalRequest & {
  user_id: string;
  recorded_at: Date;
}): Promise<VitalRecord> {
  const { data, error } = await supabase
    .from('vitals')
    .insert([vitalData])
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create vital: ${error.message}`)
  }

  return data
}

export async function getVitalsTrends(
  userId: string,
  type: string,
  days: number = 30
): Promise<VitalRecord[]> {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  const { data, error } = await supabase
    .from('vitals')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .gte('recorded_at', startDate.toISOString())
    .order('recorded_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch trends: ${error.message}`)
  }

  return data || []
}
```

### Authentication Middleware
```typescript
// middleware/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify'
import { supabase } from '../utils/database'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      email: string
      role: 'patient' | 'doctor' | 'admin'
    }
  }
}

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.substring(7)
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return reply.status(401).send({ error: 'Invalid or expired token' })
    }

    // Get user profile with role
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return reply.status(500).send({ error: 'Failed to fetch user profile' })
    }

    // Attach user to request
    request.user = {
      id: user.id,
      email: user.email!,
      role: profile.role
    }
  } catch (error) {
    request.log.error(error)
    return reply.status(500).send({ error: 'Authentication failed' })
  }
}

// Role-based authorization
export function requireRole(allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({ error: 'User not authenticated' })
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({ error: 'Insufficient permissions' })
    }
  }
}
```

## 📊 Database Integration

### Supabase Client Setup
```typescript
// utils/database.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
})

// Helper for database transactions
export async function withTransaction<T>(
  callback: (client: typeof supabase) => Promise<T>
): Promise<T> {
  // Note: Supabase doesn't support explicit transactions yet
  // This is a placeholder for future transaction support
  return await callback(supabase)
}

// Database health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('user_profiles').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}
```

### Query Patterns
```typescript
// Complex queries with joins
export async function getPatientSummary(patientId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select(`
      id,
      email,
      full_name,
      role,
      vitals:vitals(
        id,
        type,
        value,
        unit,
        recorded_at
      ),
      alerts:alerts(
        id,
        type,
        severity,
        message,
        created_at
      )
    `)
    .eq('id', patientId)
    .eq('vitals.recorded_at', '>=', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    .order('recorded_at', { foreignTable: 'vitals', ascending: false })
    .order('created_at', { foreignTable: 'alerts', ascending: false })
    .single()

  if (error) throw error
  return data
}

// Bulk operations
export async function createMultipleVitals(vitals: CreateVitalRequest[]) {
  const { data, error } = await supabase
    .from('vitals')
    .insert(vitals)
    .select()

  if (error) throw error
  return data
}

// Real-time subscriptions
export function subscribeToVitals(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`vitals:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'vitals',
      filter: `user_id=eq.${userId}`
    }, callback)
    .subscribe()
}
```

## 🤖 AI Integration

### OpenAI Service
```typescript
// services/ai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

interface ChatContext {
  userId: string
  recentVitals: VitalRecord[]
  userProfile: UserProfile
  conversationHistory: ChatMessage[]
}

export async function generateChatResponse(
  message: string,
  context: ChatContext
): Promise<string> {
  const systemPrompt = `
You are a helpful AI assistant for pregnant women. You provide:
- General pregnancy information and tips
- Interpretation of vital signs (but always recommend consulting healthcare providers)
- Emotional support and encouragement
- Exercise and nutrition guidance

IMPORTANT GUIDELINES:
- Never provide specific medical diagnoses
- Always recommend consulting healthcare providers for concerning symptoms
- Be empathetic and supportive
- Use simple, clear language
- Focus on general wellness and education

User Context:
- Recent vitals: ${JSON.stringify(context.recentVitals)}
- Pregnancy week: ${context.userProfile.pregnancy_week || 'Not specified'}
`

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...context.conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    })),
    { role: 'user', content: message }
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages,
    max_tokens: 500,
    temperature: 0.7
  })

  return completion.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now.'
}

export async function analyzeVitalsForAlerts(vitals: VitalRecord[]): Promise<string[]> {
  const prompt = `
Analyze the following vital signs for a pregnant woman and identify any potential concerns:

${vitals.map(v => `${v.type}: ${v.value} ${v.unit} (${v.recorded_at})`).join('\n')}

Return only specific, actionable concerns in a JSON array of strings. Focus on patterns or values that might need medical attention.
`

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.3
  })

  try {
    const response = completion.choices[0]?.message?.content || '[]'
    return JSON.parse(response)
  } catch {
    return []
  }
}
```

## 🔔 Alert System

### Alert Generation
```typescript
// services/alerts.ts
export interface AlertRule {
  id: string
  name: string
  condition: (vital: VitalRecord, history: VitalRecord[]) => boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
}

const alertRules: AlertRule[] = [
  {
    id: 'high_blood_pressure',
    name: 'High Blood Pressure',
    condition: (vital, history) => {
      if (vital.type !== 'blood_pressure') return false
      const [systolic, diastolic] = String(vital.value).split('/').map(Number)
      return systolic > 140 || diastolic > 90
    },
    severity: 'high',
    message: 'Blood pressure reading is elevated. Please consult your healthcare provider.'
  },
  {
    id: 'rapid_weight_gain',
    name: 'Rapid Weight Gain',
    condition: (vital, history) => {
      if (vital.type !== 'weight') return false
      const recentWeights = history
        .filter(v => v.type === 'weight')
        .slice(0, 7) // Last 7 readings
      
      if (recentWeights.length < 2) return false
      
      const weightGain = Number(vital.value) - Number(recentWeights[recentWeights.length - 1].value)
      return weightGain > 2 // More than 2 units in recent period
    },
    severity: 'medium',
    message: 'Significant weight change detected. Consider discussing with your healthcare provider.'
  }
]

export async function checkVitalAlerts(userId: string, vital: VitalRecord): Promise<void> {
  // Get recent vital history
  const history = await getVitalsForUser(userId, { limit: 30 })
  
  // Check each alert rule
  for (const rule of alertRules) {
    if (rule.condition(vital, history)) {
      await createAlert({
        user_id: userId,
        type: rule.id,
        severity: rule.severity,
        message: rule.message,
        vital_id: vital.id,
        created_at: new Date()
      })
    }
  }
}

async function createAlert(alertData: any) {
  const { error } = await supabase
    .from('alerts')
    .insert([alertData])

  if (error) {
    throw new Error(`Failed to create alert: ${error.message}`)
  }
}
```

## 📁 File Upload

### File Upload Route
```typescript
// routes/upload.ts
import { FastifyInstance } from 'fastify'
import { pipeline } from 'stream/promises'
import { createWriteStream } from 'fs'
import { join } from 'path'

export default async function uploadRoutes(fastify: FastifyInstance) {
  // Configure multipart
  await fastify.register(require('@fastify/multipart'), {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
      files: 5
    }
  })

  fastify.post('/file', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const data = await request.file()
      
      if (!data) {
        return reply.status(400).send({ error: 'No file uploaded' })
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(data.mimetype)) {
        return reply.status(400).send({ error: 'Invalid file type' })
      }

      // Generate unique filename
      const filename = `${Date.now()}-${data.filename}`
      const filepath = join(process.cwd(), 'uploads', filename)

      // Save file
      await pipeline(data.file, createWriteStream(filepath))

      // Save file record to database
      const { data: fileRecord, error } = await supabase
        .from('uploaded_files')
        .insert([{
          user_id: request.user.id,
          filename: data.filename,
          filepath: filename,
          mimetype: data.mimetype,
          size: data.file.bytesRead
        }])
        .select()
        .single()

      if (error) {
        throw error
      }

      reply.send({ file: fileRecord })
    } catch (error) {
      request.log.error(error)
      reply.status(500).send({ error: 'File upload failed' })
    }
  })
}
```

## 🧪 Testing

### API Testing
```typescript
// __tests__/routes/vitals.test.ts
import { build } from '../helper'
import { FastifyInstance } from 'fastify'

describe('Vitals API', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = build({ t })
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /api/vitals', () => {
    it('should require authentication', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/vitals'
      })

      expect(response.statusCode).toBe(401)
    })

    it('should return vitals for authenticated user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/vitals',
        headers: {
          authorization: 'Bearer valid-test-token'
        }
      })

      expect(response.statusCode).toBe(200)
      const body = JSON.parse(response.body)
      expect(body).toHaveProperty('vitals')
      expect(Array.isArray(body.vitals)).toBe(true)
    })
  })

  describe('POST /api/vitals', () => {
    it('should create new vital record', async () => {
      const vitalData = {
        type: 'blood_pressure',
        value: '120/80',
        unit: 'mmHg',
        notes: 'Feeling good'
      }

      const response = await app.inject({
        method: 'POST',
        url: '/api/vitals',
        headers: {
          authorization: 'Bearer valid-test-token',
          'content-type': 'application/json'
        },
        payload: vitalData
      })

      expect(response.statusCode).toBe(201)
      const body = JSON.parse(response.body)
      expect(body.vital).toMatchObject(vitalData)
    })

    it('should validate required fields', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/vitals',
        headers: {
          authorization: 'Bearer valid-test-token',
          'content-type': 'application/json'
        },
        payload: { type: 'blood_pressure' } // Missing required fields
      })

      expect(response.statusCode).toBe(400)
    })
  })
})
```

### Service Testing
```typescript
// __tests__/services/vitals.test.ts
import { getVitalsForUser, createVital } from '../../../src/services/vitals'
import { supabase } from '../../../src/utils/database'

jest.mock('../../../src/utils/database')
const mockedSupabase = supabase as jest.Mocked<typeof supabase>

describe('Vitals Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getVitalsForUser', () => {
    it('should fetch user vitals with correct parameters', async () => {
      const mockVitals = [
        { id: '1', type: 'blood_pressure', value: '120/80', user_id: 'user1' }
      ]

      mockedSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockReturnValue({
              range: jest.fn().mockResolvedValue({ data: mockVitals, error: null })
            })
          })
        })
      } as any)

      const result = await getVitalsForUser('user1', { limit: 10, offset: 0 })

      expect(result).toEqual(mockVitals)
      expect(mockedSupabase.from).toHaveBeenCalledWith('vitals')
    })
  })
})
```

## 📊 Monitoring & Logging

### Logging Setup
```typescript
// utils/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  } : undefined
})

// Custom log methods
export const loggers = {
  request: (req: any) => logger.info({ req }, 'Request received'),
  response: (res: any) => logger.info({ res }, 'Response sent'),
  error: (error: Error, context?: any) => logger.error({ error, context }, 'Error occurred'),
  database: (query: string, duration: number) => logger.debug({ query, duration }, 'Database query'),
  auth: (userId: string, action: string) => logger.info({ userId, action }, 'Auth action')
}
```

### Health Checks
```typescript
// routes/health.ts
export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async () => {
    const dbConnected = await checkDatabaseConnection()
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV,
      services: {
        database: dbConnected ? 'healthy' : 'unhealthy',
        memory: process.memoryUsage(),
        uptime: process.uptime()
      }
    }
  })

  fastify.get('/ready', async (request, reply) => {
    const dbConnected = await checkDatabaseConnection()
    
    if (!dbConnected) {
      return reply.status(503).send({ status: 'not ready', reason: 'database unavailable' })
    }

    return { status: 'ready' }
  })
}
```

## 🚀 Deployment

### Environment Configuration
```bash
# .env.production
NODE_ENV=production
PORT=3001
HOST=0.0.0.0

# Database
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-frontend-domain.com

# Monitoring
LOG_LEVEL=warn
```

### Build Process
```bash
# Build TypeScript
npm run build

# Start production server
npm start

# With PM2 (recommended)
pm2 start dist/server.js --name mama-mind-api
```

This guide provides a comprehensive foundation for backend development on the Mama Mind platform!
