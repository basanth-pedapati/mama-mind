'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Users, 
  Activity, 
  AlertTriangle,
  Search,
  Filter,
  Bell,
  Calendar,
  Stethoscope,
  TrendingUp,
  TrendingDown,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  Phone,
  Mail,
  MapPin,
  Clock,
  Target,
  BarChart3,
  FileText,
  MessageSquare
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
  vitals: {
    bloodPressure: string;
    weight: string;
    heartRate: string;
  };
  alerts: number;
  phone: string;
  dueDate: Date;
}

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  // Add state for modals
  const [showAppointments, setShowAppointments] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      age: 28,
      gestationalWeek: 28,
      riskLevel: 'medium',
      lastVisit: new Date('2024-12-01'),
      nextAppointment: new Date('2024-12-15'),
      vitals: { bloodPressure: '135/85', weight: '68.5 kg', heartRate: '78 bpm' },
      alerts: 1,
      phone: '+1 (555) 123-4567',
      dueDate: new Date('2024-08-15')
    },
    {
      id: '2',
      name: 'Emily Rodriguez',
      age: 32,
      gestationalWeek: 34,
      riskLevel: 'low',
      lastVisit: new Date('2024-11-28'),
      nextAppointment: new Date('2024-12-12'),
      vitals: { bloodPressure: '120/75', weight: '72.1 kg', heartRate: '72 bpm' },
      alerts: 0,
      phone: '+1 (555) 987-6543',
      dueDate: new Date('2024-07-20')
    },
    {
      id: '3',
      name: 'Maria Garcia',
      age: 25,
      gestationalWeek: 22,
      riskLevel: 'high',
      lastVisit: new Date('2024-12-03'),
      nextAppointment: new Date('2024-12-10'),
      vitals: { bloodPressure: '145/92', weight: '65.8 kg', heartRate: '88 bpm' },
      alerts: 3,
      phone: '+1 (555) 456-7890',
      dueDate: new Date('2024-09-30')
    }
  ]);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = selectedRiskFilter === 'all' || patient.riskLevel === selectedRiskFilter;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getWeekColor = (week: number) => {
    if (week < 28) return 'text-blue-600';
    if (week < 37) return 'text-orange-600';
    return 'text-green-600';
  };

  const handlePatientClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const statsCards = [
    {
      title: 'Total Patients',
      value: patients.length.toString(),
      change: '+2 this week',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active Alerts',
      value: patients.reduce((sum, p) => sum + p.alerts, 0).toString(),
      change: '-1 from yesterday',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Today\'s Appointments',
      value: '5',
      change: '2 remaining',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'High Risk',
      value: patients.filter(p => p.riskLevel === 'high').length.toString(),
      change: 'Needs attention',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-surface/95 backdrop-blur-md border-b border-border shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-2 md:py-0 gap-y-2 md:gap-y-0">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <Heart className="h-8 w-8 text-secondary" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground hidden sm:block">Mama Mind</span>
                <span className="text-lg font-bold text-foreground sm:hidden">MM</span>
                <div className="text-xs text-secondary font-medium hidden sm:block">Doctor Portal</div>
              </div>
            </motion.div>
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 md:space-x-6">
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm font-medium text-foreground">Dr. Amanda Wilson</p>
                <p className="text-xs text-secondary font-medium">Obstetrics & Gynecology</p>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Alerts</span>
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs">
                    {patients.reduce((sum, p) => sum + p.alerts, 0)}
                  </Badge>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
            {/* Mobile Menu Button */}
            <motion.div 
              className="md:hidden self-end"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-surface/95 backdrop-blur-md border-t border-border"
            >
              <div className="px-4 py-4">
                <motion.div 
                  className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-secondary/10"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                >
                  <div className="bg-secondary/20 p-2 rounded-full">
                    <User className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Dr. Amanda Wilson</p>
                    <p className="text-xs text-secondary font-medium">Obstetrics & Gynecology</p>
                  </div>
                </motion.div>
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start relative"
                  >
                    <Bell className="h-4 w-4 mr-3" />
                    Alerts
                    <Badge className="ml-auto bg-red-500 text-white text-xs">
                      {patients.reduce((sum, p) => sum + p.alerts, 0)}
                    </Badge>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-foreground-muted hover:text-foreground"
                    style={{ marginBottom: 0 }}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, idx) => (
          <motion.div
            key={card.title}
            className={`rounded-xl shadow-md p-4 flex items-center gap-4 ${card.bgColor}`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className={`rounded-full p-3 ${card.color} bg-white shadow-sm`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground-muted">{card.title}</p>
              <p className="text-lg font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-foreground-muted">{card.change}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 items-stretch sm:items-center">
          <Input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 min-w-0"
          />
          <div className="flex gap-2">
            <Button
              variant={selectedRiskFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRiskFilter('all')}
              className="whitespace-nowrap"
            >
              All
            </Button>
            <Button
              variant={selectedRiskFilter === 'low' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRiskFilter('low')}
              className="whitespace-nowrap"
            >
              Low Risk
            </Button>
            <Button
              variant={selectedRiskFilter === 'medium' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRiskFilter('medium')}
              className="whitespace-nowrap"
            >
              Medium Risk
            </Button>
            <Button
              variant={selectedRiskFilter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedRiskFilter('high')}
              className="whitespace-nowrap"
            >
              High Risk
            </Button>
          </div>
        </div>
        {/* Patient Cards Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
        >
          {filteredPatients.map(patient => (
            <motion.div
              key={patient.id}
              className="rounded-xl bg-white shadow-md p-4 flex flex-col gap-2 hover:shadow-lg transition-all cursor-pointer border border-border"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handlePatientClick(patient)}
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full p-2 border-2 ${getRiskColor(patient.riskLevel)}`}>
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{patient.name}</p>
                  <p className="text-xs text-foreground-muted truncate">Week {patient.gestationalWeek} • {patient.age} yrs</p>
                </div>
                {patient.alerts > 0 && (
                  <Badge className="bg-red-500 text-white text-xs animate-pulse">{patient.alerts} Alert{patient.alerts > 1 ? 's' : ''}</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getRiskColor(patient.riskLevel)}`}>{patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)} Risk</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getWeekColor(patient.gestationalWeek)}`}>Week {patient.gestationalWeek}</span>
                <span className="px-2 py-0.5 rounded text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200">Next: {patient.nextAppointment.toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded p-2">
                  <Stethoscope className="h-4 w-4 text-foreground-muted" />
                  <span className="text-xs">BP: {patient.vitals.bloodPressure}</span>
                </div>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded p-2">
                  <BarChart3 className="h-4 w-4 text-foreground-muted" />
                  <span className="text-xs">Wt: {patient.vitals.weight}</span>
                </div>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded p-2">
                  <Activity className="h-4 w-4 text-foreground-muted" />
                  <span className="text-xs">HR: {patient.vitals.heartRate}</span>
                </div>
              </div>
              <div className="block sm:hidden mt-2">
                <Button size="sm" className="w-full" onClick={e => { e.stopPropagation(); handlePatientClick(patient); }}>
                  View Details
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
        {filteredPatients.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Users className="h-12 w-12 mx-auto text-foreground-muted mb-4" />
            <p className="text-foreground-muted">No patients match your search criteria</p>
          </motion.div>
        )}
      </main>
      {/* Patient Details Modal */}
      <AnimatePresence>
        {showPatientDetails && selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 z-50"
            onClick={() => setShowPatientDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-2 sm:p-6"
              style={{ width: '100vw', maxWidth: '100vw', borderRadius: '0.75rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-2 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-2">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-semibold">{selectedPatient.name}</h3>
                    <p className="text-foreground-muted text-xs sm:text-sm">
                      {selectedPatient.age} years • Week {selectedPatient.gestationalWeek}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPatientDetails(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-foreground-muted" />
                        <span className="text-sm">{selectedPatient.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-foreground-muted" />
                        <span className="text-sm">
                          Due: {selectedPatient.dueDate.toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Current Vitals */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Latest Vitals</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground-muted">Blood Pressure</span>
                        <span className="text-sm font-medium">{selectedPatient.vitals.bloodPressure}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground-muted">Weight</span>
                        <span className="text-sm font-medium">{selectedPatient.vitals.weight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground-muted">Heart Rate</span>
                        <span className="text-sm font-medium">{selectedPatient.vitals.heartRate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {/* Contact Actions Section (below grid, always visible) */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <Button className="flex-1" variant="secondary" onClick={() => window.open(`tel:${selectedPatient.phone}`)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button className="flex-1" variant="outline" onClick={() => window.open(`mailto:${selectedPatient.phone}@example.com`)}>
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-6">
                  <Button className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    View Full Record
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setShowAppointments(true)}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Appointment
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Appointments Modal */}
      <AnimatePresence>
        {showAppointments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 z-50"
            onClick={() => setShowAppointments(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Appointments</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAppointments(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-foreground-muted mb-4">This is a placeholder for scheduling appointments. Feature coming soon.</p>
              <Button className="w-full" onClick={() => setShowAppointments(false)}>Close</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
