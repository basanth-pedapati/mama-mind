import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

interface ChatMessage {
  message: string;
  userType: 'patient' | 'doctor';
  gestationalWeek?: number;
}

interface ChatResponse {
  message: string;
  type: 'response';
  timestamp: string;
  messageId: string;
}

export default async function chatRoutes(fastify: FastifyInstance) {
  // Health check for chat routes
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    return { status: 'ok', service: 'chat' };
  });

  // AI Chat endpoint
  fastify.post('/message', async (request: FastifyRequest<{ Body: ChatMessage }>, reply: FastifyReply) => {
    try {
      const { message, userType, gestationalWeek = 28 } = request.body;
      
      // Simple AI response logic for MVP
      const response = generateAIResponse(message.toLowerCase(), gestationalWeek);
      
      const chatResponse: ChatResponse = {
        message: response,
        type: 'response',
        timestamp: new Date().toISOString(),
        messageId: `msg_${Date.now()}`
      };

      return chatResponse;
    } catch (error) {
      fastify.log.error('Chat error:', error);
      return reply.status(500).send({ 
        error: 'Internal server error',
        message: 'I apologize, but I\'m having trouble processing your request. Please try again or contact your healthcare provider for immediate assistance.'
      });
    }
  });

  // Get chat history
  fastify.get('/history', async (request: FastifyRequest, reply: FastifyReply) => {
    // For MVP, return empty history - in production this would fetch from database
    return { 
      messages: [], 
      message: 'Chat history will be available in the full version' 
    };
  });
}

function generateAIResponse(userMessage: string, gestationalWeek: number): string {
  // Blood pressure related
  if (userMessage.includes('blood pressure') || userMessage.includes('bp')) {
    return `Blood pressure monitoring is crucial during pregnancy. Normal BP is typically below 120/80. If you're experiencing readings above 140/90, please contact your healthcare provider immediately. At ${gestationalWeek} weeks, your blood pressure should be monitored regularly. Stay hydrated, reduce sodium intake, and rest regularly.`;
  }
  
  // Weight related
  if (userMessage.includes('weight') || userMessage.includes('gain')) {
    const expectedGain = gestationalWeek < 13 ? '1-4 pounds' : 
                        gestationalWeek < 27 ? '1 pound per week' : 
                        '1 pound per week until delivery';
    return `Healthy weight gain during pregnancy varies by your pre-pregnancy BMI. At ${gestationalWeek} weeks, you should expect to gain ${expectedGain}. Focus on nutritious foods, stay active with approved exercises, and track your weight weekly. Remember, every pregnancy is different!`;
  }
  
  // Baby development
  if (userMessage.includes('baby') || userMessage.includes('fetal') || userMessage.includes('development')) {
    const babyInfo = getBabyDevelopmentInfo(gestationalWeek);
    return `Your baby is developing beautifully! At ${gestationalWeek} weeks, ${babyInfo}. You might feel more pronounced kicks and movements. This is normal and healthy! Keep track of your baby's movements - you should feel at least 10 movements in 2 hours.`;
  }
  
  // Pain and discomfort
  if (userMessage.includes('pain') || userMessage.includes('cramp') || userMessage.includes('discomfort')) {
    return `Some discomfort is normal during pregnancy, especially at ${gestationalWeek} weeks. Try gentle stretching, warm baths, and proper positioning. However, if pain is severe, persistent, or accompanied by bleeding, contact your healthcare provider immediately. Trust your instincts - you know your body best!`;
  }
  
  // Nutrition
  if (userMessage.includes('nutrition') || userMessage.includes('food') || userMessage.includes('diet')) {
    return `Focus on a balanced diet rich in folate, iron, calcium, and DHA. Include leafy greens, lean proteins, dairy, and omega-3 rich fish. Avoid raw fish, deli meats, and excessive caffeine. Take your prenatal vitamins daily! At ${gestationalWeek} weeks, your baby needs extra nutrients for growth.`;
  }
  
  // Sleep
  if (userMessage.includes('sleep') || userMessage.includes('tired') || userMessage.includes('fatigue')) {
    return `Fatigue is common, especially in the third trimester. Try sleeping on your left side with a pregnancy pillow, maintain a cool room temperature, and establish a bedtime routine. Short naps (20-30 minutes) can help boost energy. At ${gestationalWeek} weeks, your body is working hard to support your growing baby!`;
  }
  
  // Exercise
  if (userMessage.includes('exercise') || userMessage.includes('workout') || userMessage.includes('activity')) {
    return `Exercise is beneficial during pregnancy! At ${gestationalWeek} weeks, focus on low-impact activities like walking, swimming, or prenatal yoga. Listen to your body and stop if you feel uncomfortable. Aim for 30 minutes of moderate activity most days. Always consult your healthcare provider before starting any new exercise routine.`;
  }
  
  // Appointments
  if (userMessage.includes('appointment') || userMessage.includes('visit') || userMessage.includes('checkup')) {
    return `Regular prenatal care is essential! At ${gestationalWeek} weeks, you should be seeing your healthcare provider every 2-4 weeks. These visits help monitor your health and your baby's development. Don't hesitate to ask questions during your appointments - your healthcare team is there to support you!`;
  }
  
  // Emergency symptoms
  if (userMessage.includes('emergency') || userMessage.includes('bleeding') || userMessage.includes('severe')) {
    return `If you're experiencing severe symptoms, please contact your healthcare provider immediately or go to the emergency room. Trust your instincts - you know your body best. For non-emergency concerns, I'm here to help, but always consult your healthcare provider for medical advice.`;
  }
  
  // Default response
  return `I understand your concern about pregnancy at ${gestationalWeek} weeks. While I can provide general information, it's always best to discuss specific symptoms with your healthcare provider. They know your medical history and can provide personalized advice. Is there anything else I can help you with regarding general pregnancy wellness?`;
}

function getBabyDevelopmentInfo(gestationalWeek: number): string {
  if (gestationalWeek < 13) {
    return 'your baby is in the first trimester, developing major organs and systems';
  } else if (gestationalWeek < 27) {
    return 'your baby is growing rapidly and developing more defined features';
  } else if (gestationalWeek < 37) {
    return 'your baby is gaining weight and practicing breathing movements';
  } else {
    return 'your baby is considered full-term and ready for birth';
  }
}
