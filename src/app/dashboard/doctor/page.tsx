'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Users, 
  AlertTriangle, 
  Calendar,
  Phone,
  Mail,
  Activity,
  LogOut,
  Search,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Patient {
  id: string;
  name: string;
  age: number;
  gestationalWeek: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastVisit: Date;
  nextAppointment: Date;
  recentVitals: {
    bloodPressure: string;
    weight: string;
    status: 'normal' | 'warning' | 'critical';
  };
  alerts: number;
  phone: string;
  email: string;
}

const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    age: 28,
    gestationalWeek: 28,
    riskLevel: 'low',
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    nextAppointment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    recentVitals: {
      bloodPressure: '120/80',
      weight: '68.5 kg',
      status: 'normal'
    },
    alerts: 0,
    phone: '+1 (555) 123-4567',
    email: 'sarah.johnson@email.com'
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    age: 32,
    gestationalWeek: 34,
    riskLevel: 'medium',
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    nextAppointment: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    recentVitals: {
      bloodPressure: '145/92',
      weight: '78.2 kg',
      status: 'warning'
    },
    alerts: 2,
    phone: '+1 (555) 234-5678',
    email: 'maria.rodriguez@email.com'
  },
  {
    id: '3',
    name: 'Jennifer Chen',
    age: 25,
    gestationalWeek: 36,
    riskLevel: 'high',
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    nextAppointment: new Date(Date.now() + 0.5 * 24 * 60 * 60 * 1000),
    recentVitals: {
      bloodPressure: '160/100',
      weight: '82.1 kg',
      status: 'critical'
    },
    alerts: 3,
    phone: '+1 (555) 345-6789',
    email: 'jennifer.chen@email.com'
  },
  {
    id: '4',
    name: 'Emily Davis',
    age: 30,
    gestationalWeek: 22,
    riskLevel: 'low',
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    nextAppointment: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    recentVitals: {
      bloodPressure: '118/76',
      weight: '64.8 kg',
      status: 'normal'
    },
    alerts: 0,
    phone: '+1 (555) 456-7890',
    email: 'emily.davis@email.com'
  }
];

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');

  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'all' || patient.riskLevel === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const stats = {
    totalPatients: mockPatients.length,
    highRisk: mockPatients.filter(p => p.riskLevel === 'high').length,
    alertsToday: mockPatients.reduce((sum, p) => sum + p.alerts, 0),
    appointmentsToday: mockPatients.filter(p => {
      const today = new Date();
      const appointmentDate = new Date(p.nextAppointment);
      return appointmentDate.toDateString() === today.toDateString();
    }).length
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <header className="bg-surface border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Mama Mind</span>
              <Badge variant="secondary">Provider Portal</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">Dr. Michelle Carter</p>
                <p className="text-xs text-foreground-muted">Obstetrician</p>
              </div>
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-foreground-muted">Total Patients</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalPatients}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-red-100 p-3 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-foreground-muted">High Risk</p>
                    <p className="text-2xl font-bold text-foreground">{stats.highRisk}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Activity className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-foreground-muted">Active Alerts</p>
                    <p className="text-2xl font-bold text-foreground">{stats.alertsToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-foreground-muted">Today&apos;s Appointments</p>
                    <p className="text-2xl font-bold text-foreground">{stats.appointmentsToday}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </motion.div>

        {/* Patient List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>
                Manage your patients and monitor their health status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((patient, index) => (
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        {/* Patient Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-foreground">{patient.name}</h3>
                            <Badge className={getRiskColor(patient.riskLevel)} variant="secondary">
                              {patient.riskLevel} risk
                            </Badge>
                            {patient.alerts > 0 && (
                              <Badge variant="destructive">
                                {patient.alerts} alert{patient.alerts > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-foreground-muted">
                            <div>
                              <span className="font-medium">Age:</span> {patient.age}
                            </div>
                            <div>
                              <span className="font-medium">Week:</span> {patient.gestationalWeek}
                            </div>
                            <div>
                              <span className="font-medium">Last Visit:</span>{' '}
                              {patient.lastVisit.toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Next:</span>{' '}
                              {patient.nextAppointment.toLocaleDateString()}
                            </div>
                          </div>
                        </div>

                        {/* Vitals */}
                        <div className="bg-gray-50 rounded-lg p-3 min-w-0">
                          <p className="text-xs text-foreground-muted mb-2">Recent Vitals</p>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">BP:</span>
                              <span className={`text-sm ${getStatusColor(patient.recentVitals.status)}`}>
                                {patient.recentVitals.bloodPressure}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">Weight:</span>
                              <span className="text-sm text-foreground">
                                {patient.recentVitals.weight}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button variant="outline" size="sm">
                            <Mail className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredPatients.length === 0 && (
                  <div className="text-center py-8 text-foreground-muted">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No patients found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
