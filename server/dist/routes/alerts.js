const mockAlerts = [
    {
        id: '1',
        user_id: 'user1',
        type: 'appointment',
        severity: 'medium',
        title: 'Upcoming Prenatal Appointment',
        message: 'Your prenatal checkup is scheduled for tomorrow at 2:00 PM with Dr. Smith.',
        is_read: false,
        is_resolved: false,
        metadata: { appointment_id: 'apt_123', doctor: 'Dr. Smith' },
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
        id: '2',
        user_id: 'user1',
        type: 'anomaly',
        severity: 'high',
        title: 'Blood Pressure Alert',
        message: 'Your recent blood pressure reading (140/90) is higher than normal. Please contact your healthcare provider.',
        is_read: false,
        is_resolved: false,
        metadata: { vital_id: 'vital_456', reading: '140/90' },
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
    },
    {
        id: '3',
        user_id: 'user1',
        type: 'medication',
        severity: 'low',
        title: 'Prenatal Vitamin Reminder',
        message: 'Don\'t forget to take your prenatal vitamins today!',
        is_read: true,
        is_resolved: false,
        metadata: { medication: 'prenatal_vitamins' },
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    }
];
export default async function alertsRoutes(fastify) {
    fastify.get('/health', async (request, reply) => {
        return { status: 'ok', service: 'alerts' };
    });
    fastify.get('/:userId', async (request, reply) => {
        const { userId } = request.params;
        const userAlerts = mockAlerts.filter(alert => alert.user_id === userId);
        return {
            alerts: userAlerts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
            count: userAlerts.length,
            unread: userAlerts.filter(alert => !alert.is_read).length
        };
    });
    fastify.post('/', async (request, reply) => {
        const { user_id, type, severity, title, message, metadata } = request.body;
        const newAlert = {
            id: Date.now().toString(),
            user_id,
            type,
            severity,
            title,
            message,
            is_read: false,
            is_resolved: false,
            metadata: metadata || {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        mockAlerts.push(newAlert);
        return { alert: newAlert, message: 'Alert created successfully' };
    });
    fastify.put('/:id/read', async (request, reply) => {
        const { id } = request.params;
        const alertIndex = mockAlerts.findIndex(alert => alert.id === id);
        if (alertIndex === -1) {
            return reply.code(404).send({ error: 'Alert not found' });
        }
        mockAlerts[alertIndex].is_read = true;
        mockAlerts[alertIndex].updated_at = new Date().toISOString();
        return { alert: mockAlerts[alertIndex], message: 'Alert marked as read' };
    });
    fastify.put('/:id/resolve', async (request, reply) => {
        const { id } = request.params;
        const alertIndex = mockAlerts.findIndex(alert => alert.id === id);
        if (alertIndex === -1) {
            return reply.code(404).send({ error: 'Alert not found' });
        }
        mockAlerts[alertIndex].is_resolved = true;
        mockAlerts[alertIndex].is_read = true;
        mockAlerts[alertIndex].updated_at = new Date().toISOString();
        return { alert: mockAlerts[alertIndex], message: 'Alert resolved' };
    });
    fastify.delete('/:id', async (request, reply) => {
        const { id } = request.params;
        const alertIndex = mockAlerts.findIndex(alert => alert.id === id);
        if (alertIndex === -1) {
            return reply.code(404).send({ error: 'Alert not found' });
        }
        mockAlerts.splice(alertIndex, 1);
        return { success: true, message: 'Alert dismissed successfully' };
    });
}
//# sourceMappingURL=alerts.js.map