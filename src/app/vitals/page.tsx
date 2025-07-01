'use client';
import { VitalsCard, sampleVitals } from '@/components/ui/vitals-card';
import VitalsChart from '@/components/VitalsChart';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const vitalTypes = [
  { key: 'blood_pressure', label: 'Blood Pressure' },
  { key: 'weight', label: 'Weight' },
  { key: 'glucose', label: 'Glucose' },
];

export default function VitalsPage() {
  const [selected, setSelected] = useState<'blood_pressure' | 'weight' | 'glucose'>('blood_pressure');
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Vitals</h1>
        <Button variant="outline" href="/dashboard">Back to Dashboard</Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {vitalTypes.map(v => (
          <Button key={v.key} variant={selected === v.key ? 'primary' : 'outline'} onClick={() => setSelected(v.key as 'blood_pressure' | 'weight' | 'glucose')}>{v.label}</Button>
        ))}
      </div>
      <VitalsCard vitals={sampleVitals.filter(v => v.name.toLowerCase().replace(' ', '_').includes(selected))} />
      <VitalsChart type={selected} />
    </main>
  );
} 