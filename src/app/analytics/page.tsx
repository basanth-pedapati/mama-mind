import { Button } from '@/components/ui/button';
import VitalsChart from '@/components/VitalsChart';

export default function AnalyticsPage() {
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        <Button variant="outline" href="/dashboard">Back to Dashboard</Button>
      </div>
      <div className="space-y-4">
        <VitalsChart type="blood_pressure" />
        <VitalsChart type="weight" />
        {/* Add more analytics charts or stats as needed */}
      </div>
    </main>
  );
} 