'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatAssistantProps {
  onClose: () => void;
}

export default function ChatAssistant({ onClose }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI health assistant. I can help answer questions about your pregnancy, provide health tips, and offer support. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI responses
  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) {
      return 'Blood pressure monitoring is important during pregnancy. Normal BP is typically below 120/80. If you\'re experiencing readings above 140/90, please contact your healthcare provider immediately. Stay hydrated, reduce sodium intake, and rest regularly.';
    }
    
    if (lowerMessage.includes('weight') || lowerMessage.includes('gain')) {
      return 'Healthy weight gain during pregnancy varies by your pre-pregnancy BMI. Generally, gaining 25-35 pounds is recommended for normal weight women. Focus on nutritious foods, stay active with approved exercises, and track your weight weekly.';
    }
    
    if (lowerMessage.includes('baby') || lowerMessage.includes('fetal')) {
      return 'Your baby is developing beautifully! At 28 weeks, your baby weighs about 2.5 pounds and is practicing breathing movements. You might feel more pronounced kicks and movements. This is normal and healthy!';
    }
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('cramp')) {
      return 'Some discomfort is normal during pregnancy, but severe or persistent pain should be evaluated. Try gentle stretching, warm baths, and proper positioning. If pain is severe or accompanied by bleeding, contact your healthcare provider immediately.';
    }
    
    if (lowerMessage.includes('nutrition') || lowerMessage.includes('food')) {
      return 'Focus on a balanced diet rich in folate, iron, calcium, and DHA. Include leafy greens, lean proteins, dairy, and omega-3 rich fish. Avoid raw fish, deli meats, and excessive caffeine. Take your prenatal vitamins daily!';
    }
    
    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
      return 'Fatigue is common, especially in the third trimester. Try sleeping on your left side with a pregnancy pillow, maintain a cool room temperature, and establish a bedtime routine. Short naps (20-30 minutes) can help boost energy.';
    }
    
    return 'I understand your concern. While I can provide general information, it\'s always best to discuss specific symptoms with your healthcare provider. They know your medical history and can provide personalized advice. Is there anything else I can help you with regarding general pregnancy wellness?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
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
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.message,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        throw new Error('Backend API not available');
      }
    } catch (error) {
      console.log('Using fallback response (backend not available):', error);
      // Fallback to simulated response if backend is not available
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(inputValue),
          sender: 'assistant',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000 + Math.random() * 1000); // 1-2 second delay
      return;
    }

    setIsLoading(false);
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
                        ? 'bg-primary text-white rounded-br-md'
                        : 'bg-gray-100 text-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.sender === 'user'
                          ? 'text-primary-foreground/70'
                          : 'text-foreground-muted'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-foreground-muted" />
                    <span className="text-sm text-foreground-muted">Thinking...</span>
                  </div>
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
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="px-4"
            >
              <Send className="h-4 w-4" />
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
