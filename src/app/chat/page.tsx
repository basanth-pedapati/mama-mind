import ChatAssistant from '@/components/ChatAssistant';
import { Button } from '@/components/ui/button';

export default function ChatPage() {
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6 h-[80vh] flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Chat with AI</h1>
        <Button variant="outline" href="/dashboard">Back to Dashboard</Button>
      </div>
      <div className="flex-1 min-h-0">
        <ChatAssistant />
      </div>
    </main>
  );
} 