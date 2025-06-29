export default async function analyticsRoutes(fastify) {
    fastify.get('/dashboard/:userId', async (request, reply) => {
        const { userId } = request.params;
        const stats = {
            totalVitals: 28,
            activeAlerts: 2,
            weeklyTrend: 15,
            lastRecording: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            healthScore: 85,
            weeklyGoals: {
                vitalsCompleted: 5,
                vitalsTarget: 7,
                appointmentsScheduled: 1,
                exerciseDays: 3,
                exerciseTarget: 5
            },
            recentActivity: [
                {
                    type: 'vital',
                    description: 'Recorded blood pressure',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
                },
                {
                    type: 'alert',
                    description: 'New appointment reminder',
                    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
                },
                {
                    type: 'chat',
                    description: 'Asked about morning sickness',
                    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
                }
            ]
        };
        return { stats };
    });
    fastify.get('/pregnancy/progress/:userId', async (request, reply) => {
        const { userId } = request.params;
        const progress = {
            weeksPregnant: 24,
            daysRemaining: 112,
            dueDate: new Date(Date.now() + 112 * 24 * 60 * 60 * 1000).toISOString(),
            trimester: 2,
            currentMilestone: {
                week: 24,
                title: "Baby's hearing is developing",
                description: "Your baby can now hear sounds from outside the womb"
            },
            upcomingMilestones: [
                {
                    week: 26,
                    title: "Baby's eyes can open",
                    description: "Baby can now open and close their eyes",
                    completed: false
                },
                {
                    week: 28,
                    title: "Third trimester begins",
                    description: "You're entering the final stretch!",
                    completed: false
                }
            ],
            symptoms: [
                { name: "Back pain", severity: "mild", trending: "stable" },
                { name: "Fatigue", severity: "moderate", trending: "improving" },
                { name: "Heartburn", severity: "mild", trending: "worsening" }
            ],
            babySize: {
                length: "11.8 inches",
                weight: "1.3 pounds",
                comparison: "about the size of an ear of corn"
            }
        };
        return { progress };
    });
    fastify.get('/trends/:userId', async (request, reply) => {
        const { userId } = request.params;
        const { period = 'month' } = request.query;
        const trends = {
            period,
            bloodPressure: {
                data: [
                    { date: '2024-01-01', systolic: 118, diastolic: 78 },
                    { date: '2024-01-08', systolic: 120, diastolic: 80 },
                    { date: '2024-01-15', systolic: 122, diastolic: 82 },
                    { date: '2024-01-22', systolic: 119, diastolic: 79 },
                ],
                trend: 'stable',
                average: { systolic: 120, diastolic: 80 }
            },
            weight: {
                data: [
                    { date: '2024-01-01', value: 142 },
                    { date: '2024-01-08', value: 143 },
                    { date: '2024-01-15', value: 144 },
                    { date: '2024-01-22', value: 145 },
                ],
                trend: 'increasing',
                change: '+3 lbs this month'
            },
            heartRate: {
                data: [
                    { date: '2024-01-01', value: 72 },
                    { date: '2024-01-08', value: 74 },
                    { date: '2024-01-15', value: 76 },
                    { date: '2024-01-22', value: 75 },
                ],
                trend: 'slightly_elevated',
                average: 74
            }
        };
        return { trends };
    });
    fastify.get('/insights/:userId', async (request, reply) => {
        const { userId } = request.params;
        const insights = {
            recommendations: [
                {
                    type: 'exercise',
                    priority: 'high',
                    title: 'Stay Active',
                    description: 'Try 30 minutes of light exercise like walking or prenatal yoga',
                    actionable: true
                },
                {
                    type: 'nutrition',
                    priority: 'medium',
                    title: 'Iron-Rich Foods',
                    description: 'Include more spinach, lean meat, and legumes in your diet',
                    actionable: true
                },
                {
                    type: 'sleep',
                    priority: 'medium',
                    title: 'Sleep Quality',
                    description: 'Aim for 8-9 hours of sleep with a consistent bedtime routine',
                    actionable: true
                }
            ],
            alerts: [
                {
                    type: 'reminder',
                    message: 'Your next prenatal appointment is in 3 days',
                    urgency: 'medium'
                }
            ],
            achievements: [
                {
                    title: 'Consistent Tracking',
                    description: 'You\'ve logged vitals 5 days in a row!',
                    earnedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                }
            ]
        };
        return { insights };
    });
}
//# sourceMappingURL=analytics.js.map