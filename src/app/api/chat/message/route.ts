import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Proxy to the backend server
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    
    const response = await fetch(`${backendUrl}/api/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Chat API error:', error);
    
    // Fallback response when backend is not available
    const fallbackResponse = {
      message: "I'm here to help with your pregnancy journey! While our full AI assistant is currently updating, I can still provide general guidance. For specific medical concerns, please contact your healthcare provider directly.",
      type: 'response',
      timestamp: new Date().toISOString(),
      messageId: `fallback_${Date.now()}`
    };
    
    return NextResponse.json(fallbackResponse);
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Chat API is running',
    timestamp: new Date().toISOString() 
  });
}
