'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loading } from '@/components/ui/loading';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface ChatAssistantProps {
  onClose?: () => void;
}

export default function ChatAssistant({ onClose = () => {} }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI health assistant. I can help answer questions about your pregnancy, provide health tips, and offer support. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
      status: 'sent',
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI responses with more comprehensive patterns
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Blood pressure and vitals
    if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp') || lowerMessage.includes('pressure')) {
      return 'Blood pressure monitoring is crucial during pregnancy. Normal BP is typically below 120/80. If you\'re experiencing readings above 140/90, please contact your healthcare provider immediately. Stay hydrated, reduce sodium intake, and rest regularly. Monitor your BP at the same time daily for consistency.';
    }
    
    // Weight and nutrition
    if (lowerMessage.includes('weight') || lowerMessage.includes('gain') || lowerMessage.includes('lose')) {
      return 'Healthy weight gain during pregnancy varies by your pre-pregnancy BMI. Generally, gaining 25-35 pounds is recommended for normal weight women. Focus on nutritious foods, stay active with approved exercises, and track your weight weekly. Remember, every pregnancy is different!';
    }
    
    // Baby development and fetal movement
    if (lowerMessage.includes('baby') || lowerMessage.includes('fetal') || lowerMessage.includes('movement') || lowerMessage.includes('kick')) {
      return 'Your baby is developing beautifully! At 28 weeks, your baby weighs about 2.5 pounds and is practicing breathing movements. You might feel more pronounced kicks and movements. This is normal and healthy! Keep track of your baby\'s movements - you should feel at least 10 movements in 2 hours.';
    }
    
    // Pain and discomfort
    if (lowerMessage.includes('pain') || lowerMessage.includes('cramp') || lowerMessage.includes('discomfort') || lowerMessage.includes('ache')) {
      return 'Some discomfort is normal during pregnancy, but severe or persistent pain should be evaluated. Try gentle stretching, warm baths, and proper positioning. If pain is severe or accompanied by bleeding, contact your healthcare provider immediately. Trust your instincts - you know your body best!';
    }
    
    // Nutrition and diet
    if (lowerMessage.includes('nutrition') || lowerMessage.includes('food') || lowerMessage.includes('diet') || lowerMessage.includes('eat')) {
      return 'Focus on a balanced diet rich in folate, iron, calcium, and DHA. Include leafy greens, lean proteins, dairy, and omega-3 rich fish. Avoid raw fish, deli meats, and excessive caffeine. Take your prenatal vitamins daily! Small, frequent meals can help with nausea.';
    }
    
    // Sleep and fatigue
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('fatigue') || lowerMessage.includes('rest')) {
      return 'Fatigue is common, especially in the third trimester. Try sleeping on your left side with a pregnancy pillow, maintain a cool room temperature, and establish a bedtime routine. Short naps (20-30 minutes) can help boost energy. Listen to your body\'s need for rest.';
    }
    
    // Exercise and activity
    if (lowerMessage.includes('exercise') || lowerMessage.includes('workout') || lowerMessage.includes('activity') || lowerMessage.includes('yoga')) {
      return 'Exercise is beneficial during pregnancy! Focus on low-impact activities like walking, swimming, or prenatal yoga. Listen to your body and stop if you feel uncomfortable. Aim for 30 minutes of moderate activity most days. Always consult your healthcare provider before starting any new exercise routine.';
    }
    
    // Appointments and checkups
    if (lowerMessage.includes('appointment') || lowerMessage.includes('visit') || lowerMessage.includes('checkup') || lowerMessage.includes('doctor')) {
      return 'Regular prenatal care is essential! You should be seeing your healthcare provider every 2-4 weeks. These visits help monitor your health and your baby\'s development. Don\'t hesitate to ask questions during your appointments - your healthcare team is there to support you!';
    }
    
    // Emergency symptoms
    if (lowerMessage.includes('emergency') || lowerMessage.includes('bleeding') || lowerMessage.includes('severe') || lowerMessage.includes('urgent')) {
      return 'If you\'re experiencing severe symptoms, please contact your healthcare provider immediately or go to the emergency room. Trust your instincts - you know your body best. For non-emergency concerns, I\'m here to help, but always consult your healthcare provider for medical advice.';
    }
    
    // Morning sickness
    if (lowerMessage.includes('nausea') || lowerMessage.includes('morning sickness') || lowerMessage.includes('vomit')) {
      return 'Morning sickness is common, especially in the first trimester. Try eating small, frequent meals, staying hydrated, and avoiding strong smells. Ginger tea or crackers can help. If it\'s severe or persistent, talk to your healthcare provider about safe medications.';
    }
    
    // Mood and emotions
    if (lowerMessage.includes('mood') || lowerMessage.includes('emotion') || lowerMessage.includes('anxiety') || lowerMessage.includes('stress')) {
      return 'Pregnancy can bring many emotional changes. It\'s normal to feel anxious, excited, or overwhelmed. Practice self-care, talk to loved ones, and consider joining a pregnancy support group. If you\'re feeling persistently sad or anxious, reach out to your healthcare provider.';
    }
    
    // Default response
    return 'I understand your concern. While I can provide general information, it\'s always best to discuss specific symptoms with your healthcare provider. They know your medical history and can provide personalized advice. Is there anything else I can help you with regarding general pregnancy wellness?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    // Update user message status
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === userMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 500);

    try {
      // Show typing indicator
      setIsTyping(true);
      
      // Try to use the backend API first
      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          userType: 'patient',
          gestationalWeek: 28, // This would come from user data in real app
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Simulate typing delay for more natural feel
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          sender: 'assistant',
          timestamp: new Date(),
          status: 'sent',
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error(`Backend responded with ${response.status}`);
      }
    } catch (error) {
      console.log('Using fallback response (backend not available):', error);
      setError('Using offline mode - responses may be limited');
      
      // Fallback to simulated response if backend is not available
      setTimeout(async () => {
        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800));
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(inputValue),
          sender: 'assistant',
          timestamp: new Date(),
          status: 'sent',
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
        setIsTyping(false);
      }, 1000);
      return;
    }

    setIsLoading(false);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-primary/10 border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-2 rounded-full">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Health Assistant</h3>
              <p className="text-sm text-foreground-muted">Always here to help</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-foreground-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-yellow-50 border-b border-yellow-200 p-3 flex items-center space-x-2"
          >
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm text-yellow-800">{error}</span>
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-3 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-white'
                    }`}
                  >
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary rounded-br-md'
                        : 'bg-secondary text-primary border border-secondary shadow-sm rounded-bl-md'
                    } animate-fade-in text-sm md:text-base max-w-[90vw] md:max-w-[70%]`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p
                        className={`text-xs ${
                          message.sender === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-blue-700'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {message.status === 'sending' && (
                        <Loader2 className="h-3 w-3 animate-spin text-primary-foreground/50" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-primary flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md">
                  <Loading />
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex space-x-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your pregnancy..."
              disabled={isLoading || isTyping}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isTyping}
              size="sm"
              className="px-4"
            >
              {isLoading || isTyping ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          <p className="text-xs text-foreground-muted mt-2 text-center">
            This AI assistant provides general information only. Always consult your healthcare provider for medical advice.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
