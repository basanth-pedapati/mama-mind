import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import dotenv from 'dotenv';
dotenv.config();

let openai: any = null;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (OPENAI_API_KEY) {
  // Dynamically import OpenAI only if key is present
  import('openai').then(module => {
    openai = new module.OpenAI({ apiKey: OPENAI_API_KEY });
  });
}

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
      let response: string;
      
      if (OPENAI_API_KEY && openai) {
        try {
          response = await getOpenAIResponse(message, userType, gestationalWeek);
        } catch (err) {
          fastify.log.error('OpenAI API error:', err);
          response = generateAIResponse(message.toLowerCase(), gestationalWeek);
        }
      } else {
        response = generateAIResponse(message.toLowerCase(), gestationalWeek);
      }
      
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

async function getOpenAIResponse(message: string, userType: string, gestationalWeek: number): Promise<string> {
  if (!openai) throw new Error('OpenAI not initialized');
  const systemPrompt = `You are a helpful, empathetic AI health assistant for a maternity care app.\nUser type: ${userType}\nGestational week: ${gestationalWeek}\nAlways recommend consulting healthcare providers for concerning symptoms. Never provide specific diagnoses. Use clear, supportive language.`;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ],
    max_tokens: 300,
    temperature: 0.7
  });
  return completion.choices[0]?.message?.content || 'I apologize, but I cannot process your request right now.';
}

function generateAIResponse(userMessage: string, gestationalWeek: number): string {
  // Blood pressure and vitals monitoring
  if (userMessage.includes('blood pressure') || userMessage.includes('bp') || userMessage.includes('pressure')) {
    return `Blood pressure monitoring is crucial during pregnancy. Normal BP is typically below 120/80. If you're experiencing readings above 140/90, please contact your healthcare provider immediately. At ${gestationalWeek} weeks, your blood pressure should be monitored regularly. Stay hydrated, reduce sodium intake, and rest regularly. Monitor your BP at the same time daily for consistency.`;
  }
  
  // Weight gain and nutrition
  if (userMessage.includes('weight') || userMessage.includes('gain') || userMessage.includes('lose')) {
    const expectedGain = gestationalWeek < 13 ? '1-4 pounds' : 
                        gestationalWeek < 27 ? '1 pound per week' : 
                        '1 pound per week until delivery';
    return `Healthy weight gain during pregnancy varies by your pre-pregnancy BMI. At ${gestationalWeek} weeks, you should expect to gain ${expectedGain}. Focus on nutritious foods, stay active with approved exercises, and track your weight weekly. Remember, every pregnancy is different!`;
  }
  
  // Baby development and fetal movement
  if (userMessage.includes('baby') || userMessage.includes('fetal') || userMessage.includes('development') || userMessage.includes('movement') || userMessage.includes('kick')) {
    const babyInfo = getBabyDevelopmentInfo(gestationalWeek);
    return `Your baby is developing beautifully! At ${gestationalWeek} weeks, ${babyInfo}. You might feel more pronounced kicks and movements. This is normal and healthy! Keep track of your baby's movements - you should feel at least 10 movements in 2 hours.`;
  }
  
  // Pain and discomfort
  if (userMessage.includes('pain') || userMessage.includes('cramp') || userMessage.includes('discomfort') || userMessage.includes('ache')) {
    return `Some discomfort is normal during pregnancy, especially at ${gestationalWeek} weeks. Try gentle stretching, warm baths, and proper positioning. However, if pain is severe, persistent, or accompanied by bleeding, contact your healthcare provider immediately. Trust your instincts - you know your body best!`;
  }
  
  // Nutrition and diet
  if (userMessage.includes('nutrition') || userMessage.includes('food') || userMessage.includes('diet') || userMessage.includes('eat')) {
    return `Focus on a balanced diet rich in folate, iron, calcium, and DHA. Include leafy greens, lean proteins, dairy, and omega-3 rich fish. Avoid raw fish, deli meats, and excessive caffeine. Take your prenatal vitamins daily! At ${gestationalWeek} weeks, your baby needs extra nutrients for growth. Small, frequent meals can help with nausea.`;
  }
  
  // Sleep and fatigue
  if (userMessage.includes('sleep') || userMessage.includes('tired') || userMessage.includes('fatigue') || userMessage.includes('rest')) {
    return `Fatigue is common, especially in the third trimester. Try sleeping on your left side with a pregnancy pillow, maintain a cool room temperature, and establish a bedtime routine. Short naps (20-30 minutes) can help boost energy. At ${gestationalWeek} weeks, your body is working hard to support your growing baby! Listen to your body's need for rest.`;
  }
  
  // Exercise and activity
  if (userMessage.includes('exercise') || userMessage.includes('workout') || userMessage.includes('activity') || userMessage.includes('yoga')) {
    return `Exercise is beneficial during pregnancy! At ${gestationalWeek} weeks, focus on low-impact activities like walking, swimming, or prenatal yoga. Listen to your body and stop if you feel uncomfortable. Aim for 30 minutes of moderate activity most days. Always consult your healthcare provider before starting any new exercise routine.`;
  }
  
  // Appointments and checkups
  if (userMessage.includes('appointment') || userMessage.includes('visit') || userMessage.includes('checkup') || userMessage.includes('doctor')) {
    return `Regular prenatal care is essential! At ${gestationalWeek} weeks, you should be seeing your healthcare provider every 2-4 weeks. These visits help monitor your health and your baby's development. Don't hesitate to ask questions during your appointments - your healthcare team is there to support you!`;
  }
  
  // Emergency symptoms
  if (userMessage.includes('emergency') || userMessage.includes('bleeding') || userMessage.includes('severe') || userMessage.includes('urgent')) {
    return `If you're experiencing severe symptoms, please contact your healthcare provider immediately or go to the emergency room. Trust your instincts - you know your body best. For non-emergency concerns, I'm here to help, but always consult your healthcare provider for medical advice.`;
  }
  
  // Morning sickness and nausea
  if (userMessage.includes('nausea') || userMessage.includes('morning sickness') || userMessage.includes('vomit') || userMessage.includes('sick')) {
    return `Morning sickness is common, especially in the first trimester. Try eating small, frequent meals, staying hydrated, and avoiding strong smells. Ginger tea or crackers can help. If it's severe or persistent, talk to your healthcare provider about safe medications. At ${gestationalWeek} weeks, this should be improving, but every pregnancy is different.`;
  }
  
  // Mood and emotions
  if (userMessage.includes('mood') || userMessage.includes('emotion') || userMessage.includes('anxiety') || userMessage.includes('stress') || userMessage.includes('depression')) {
    return `Pregnancy can bring many emotional changes. It's normal to feel anxious, excited, or overwhelmed. Practice self-care, talk to loved ones, and consider joining a pregnancy support group. If you're feeling persistently sad or anxious, reach out to your healthcare provider. Your mental health is just as important as your physical health.`;
  }
  
  // Swelling and fluid retention
  if (userMessage.includes('swelling') || userMessage.includes('edema') || userMessage.includes('fluid') || userMessage.includes('ankle')) {
    return `Some swelling, especially in the ankles and feet, is normal during pregnancy. Elevate your feet when possible, stay hydrated, and avoid standing for long periods. However, sudden swelling in your face, hands, or feet could be a sign of preeclampsia - contact your healthcare provider immediately if this occurs.`;
  }
  
  // Braxton Hicks contractions
  if (userMessage.includes('contraction') || userMessage.includes('braxton') || userMessage.includes('tightening')) {
    return `Braxton Hicks contractions are normal practice contractions that can start as early as the second trimester. They're usually painless and irregular. At ${gestationalWeek} weeks, you might notice them more frequently. If they become regular, painful, or increase in intensity, contact your healthcare provider immediately.`;
  }
  
  // Heartburn and digestion
  if (userMessage.includes('heartburn') || userMessage.includes('acid') || userMessage.includes('indigestion') || userMessage.includes('reflux')) {
    return `Heartburn is common during pregnancy due to hormonal changes and your growing uterus. Try eating smaller meals, avoiding spicy foods, and not lying down immediately after eating. Over-the-counter antacids are generally safe, but check with your healthcare provider first.`;
  }
  
  // Back pain
  if (userMessage.includes('back') || userMessage.includes('spine') || userMessage.includes('lower back')) {
    return `Back pain is very common during pregnancy, especially as your belly grows. Practice good posture, wear supportive shoes, and try gentle stretches. A pregnancy pillow can help with sleep positioning. If the pain is severe or radiates down your legs, contact your healthcare provider.`;
  }
  
  // Gestational diabetes
  if (userMessage.includes('diabetes') || userMessage.includes('glucose') || userMessage.includes('sugar') || userMessage.includes('gestational')) {
    return `Gestational diabetes screening typically occurs between 24-28 weeks. If you've been diagnosed, work closely with your healthcare team to manage your blood sugar through diet, exercise, and possibly medication. Most cases resolve after delivery, but you'll need follow-up testing.`;
  }
  
  // Labor and delivery preparation
  if (userMessage.includes('labor') || userMessage.includes('delivery') || userMessage.includes('birth') || userMessage.includes('contraction')) {
    if (gestationalWeek < 37) {
      return `It's great that you're thinking about labor and delivery! At ${gestationalWeek} weeks, you still have time to prepare. Consider taking childbirth classes, creating a birth plan, and discussing your preferences with your healthcare provider. Focus on staying healthy and comfortable for now.`;
    } else {
      return `You're in the final stretch! At ${gestationalWeek} weeks, your baby is considered full-term. Watch for signs of labor like regular contractions, water breaking, or bloody show. Have your hospital bag ready and know when to call your healthcare provider. You're doing great!`;
    }
  }
  
  // Default response with more encouragement
  return `I understand your concern about pregnancy at ${gestationalWeek} weeks. While I can provide general information, it's always best to discuss specific symptoms with your healthcare provider. They know your medical history and can provide personalized advice. You're doing an amazing job taking care of yourself and your baby! Is there anything else I can help you with regarding general pregnancy wellness?`;
}

function getBabyDevelopmentInfo(gestationalWeek: number): string {
  if (gestationalWeek < 13) {
    return 'your baby is in the first trimester, developing major organs and systems. The risk of miscarriage significantly decreases after this point.';
  } else if (gestationalWeek < 27) {
    return 'your baby is growing rapidly and developing more defined features. You might start feeling movements soon if you haven\'t already.';
  } else if (gestationalWeek < 37) {
    return 'your baby is gaining weight and practicing breathing movements. The lungs are maturing, and your baby is preparing for life outside the womb.';
  } else {
    return 'your baby is considered full-term and ready for birth. The lungs are fully developed, and your baby has all the skills needed for life outside the womb.';
  }
}
