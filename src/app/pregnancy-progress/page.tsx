'use client';
import { PregnancyProgress } from '@/components/ui/pregnancy-progress';
import { Button } from '@/components/ui/button';

export default function PregnancyProgressPage() {
  // Placeholder dates
  const dueDate = new Date('2024-08-15');
  const lastMenstrualPeriod = new Date('2023-11-09');
  return (
    <main className="max-w-xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Pregnancy Progress</h1>
        <Button variant="outline" href="/dashboard">Back to Dashboard</Button>
      </div>
      <PregnancyProgress dueDate={dueDate} lastMenstrualPeriod={lastMenstrualPeriod} />
      {/* Add milestones, summary, etc. here as needed */}
    </main>
  );
} 