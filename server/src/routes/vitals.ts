import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Mock data for development
const mockVitals = [
  {
    id: '1',
    user_id: 'user1',
    type: 'blood_pressure',
    value: '120/80',
    unit: 'mmHg',
    notes: 'Normal reading',
    recorded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '2',
    user_id: 'user1',
    type: 'weight',
    value: '145',
    unit: 'lbs',
    notes: 'Weekly weigh-in',
    recorded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: '3',
    user_id: 'user1',
    type: 'baby_movement',
    value: '12',
    unit: 'kicks/hour',
    notes: 'Active baby today',
    recorded_at: new Date().toISOString(),
    created_at: new Date().toISOString()
  }
];

export default async function vitalsRoutes(fastify: FastifyInstance) {
  // Health check for vitals routes
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', service: 'vitals' };
  });

  // Get vitals by user ID
  fastify.get('/:userId', async (request: FastifyRequest<{
    Params: { userId: string }
  }>, reply: FastifyReply) => {
    const { userId } = request.params;
    const userVitals = mockVitals.filter(vital => vital.user_id === userId);
    return { vitals: userVitals, count: userVitals.length };
  });

  // Create new vital record
  fastify.post('/', async (request: FastifyRequest<{
    Body: {
      user_id: string;
      type: string;
      value: string;
      unit: string;
      notes?: string;
    }
  }>, reply: FastifyReply) => {
    const { user_id, type, value, unit, notes } = request.body;
    
    const newVital = {
      id: Date.now().toString(),
      user_id,
      type,
      value,
      unit,
      notes: notes || '',
      recorded_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };

    mockVitals.push(newVital);
    return { vital: newVital, message: 'Vital recorded successfully' };
  });

  // Update vital record
  fastify.put('/:id', async (request: FastifyRequest<{
    Params: { id: string };
    Body: Partial<{
      type: string;
      value: string;
      unit: string;
      notes: string;
    }>
  }>, reply: FastifyReply) => {
    const { id } = request.params;
    const updates = request.body;
    
    const vitalIndex = mockVitals.findIndex(vital => vital.id === id);
    if (vitalIndex === -1) {
      return reply.code(404).send({ error: 'Vital record not found' });
    }

    const updatedVital = { ...mockVitals[vitalIndex], ...updates };
    mockVitals[vitalIndex] = updatedVital;
    
    return { vital: updatedVital, message: 'Vital updated successfully' };
  });

  // Delete vital record
  fastify.delete('/:id', async (request: FastifyRequest<{
    Params: { id: string }
  }>, reply: FastifyReply) => {
    const { id } = request.params;
    
    const vitalIndex = mockVitals.findIndex(vital => vital.id === id);
    if (vitalIndex === -1) {
      return reply.code(404).send({ error: 'Vital record not found' });
    }

    mockVitals.splice(vitalIndex, 1);
    return { success: true, message: 'Vital deleted successfully' };
  });

  // Get vitals summary/stats
  fastify.get('/stats/:userId', async (request: FastifyRequest<{
    Params: { userId: string }
  }>, reply: FastifyReply) => {
    const { userId } = request.params;
    const userVitals = mockVitals.filter(vital => vital.user_id === userId);
    
    const stats = {
      totalRecords: userVitals.length,
      recentRecords: userVitals.filter(vital => 
        new Date(vital.recorded_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      ).length,
      types: [...new Set(userVitals.map(vital => vital.type))],
      lastRecording: userVitals.length > 0 
        ? userVitals.sort((a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime())[0].recorded_at
        : null
    };

    return { stats };
  });
}
