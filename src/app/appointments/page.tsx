import { Button } from '@/components/ui/button';

const appointments = [
  { id: 1, date: '2024-06-10', time: '10:00 AM', doctor: 'Dr. Smith', type: 'Checkup', status: 'upcoming' },
  { id: 2, date: '2024-05-20', time: '2:00 PM', doctor: 'Dr. Lee', type: 'Ultrasound', status: 'completed' },
];

export default function AppointmentsPage() {
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Appointments</h1>
        <Button variant="outline" href="/dashboard">Back to Dashboard</Button>
      </div>
      <div className="space-y-4">
        {appointments.map(app => (
          <div key={app.id} className="p-4 rounded-lg border border-border bg-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="font-semibold text-lg text-secondary">{app.type}</div>
              <div className="text-sm text-muted-foreground">{app.date} at {app.time}</div>
              <div className="text-sm text-muted-foreground">Doctor: {app.doctor}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${app.status === 'upcoming' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>{app.status}</span>
              {app.status === 'upcoming' && <Button size="sm">Reschedule</Button>}
            </div>
          </div>
        ))}
      </div>
      <Button variant="primary" className="w-full">Book New Appointment</Button>
    </main>
  );
} 