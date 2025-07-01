'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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
  MoreVertical,
  X,
  MessageCircle,
  Video,
  FileText,
  User,
  Menu
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
  address: string;
  emergencyContact: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  notes: string;
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
    email: 'sarah.johnson@email.com',
    address: '123 Oak Street, Portland, OR 97201',
    emergencyContact: 'Mike Johnson (Husband) - +1 (555) 123-4568',
    medicalHistory: ['Gestational diabetes (controlled)', 'Previous C-section'],
    currentMedications: ['Prenatal vitamins', 'Folic acid'],
    allergies: ['Penicillin'],
    notes: 'Patient is doing well. No concerns at this time.'
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
    email: 'maria.rodriguez@email.com',
    address: '456 Pine Avenue, Seattle, WA 98101',
    emergencyContact: 'Carlos Rodriguez (Husband) - +1 (555) 234-5679',
    medicalHistory: ['Hypertension', 'Obesity'],
    currentMedications: ['Labetalol', 'Prenatal vitamins'],
    allergies: ['Sulfa drugs'],
    notes: 'Blood pressure elevated. Monitor closely. Consider bed rest if BP continues to rise.'
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
    email: 'jennifer.chen@email.com',
    address: '789 Elm Drive, San Francisco, CA 94102',
    emergencyContact: 'David Chen (Husband) - +1 (555) 345-6790',
    medicalHistory: ['Preeclampsia', 'Gestational diabetes', 'Previous preterm birth'],
    currentMedications: ['Nifedipine', 'Insulin', 'Magnesium sulfate'],
    allergies: ['Latex', 'Iodine'],
    notes: 'High risk patient. Preeclampsia symptoms present. Consider early delivery if condition worsens.'
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
    email: 'emily.davis@email.com',
    address: '321 Maple Lane, Austin, TX 73301',
    emergencyContact: 'James Davis (Husband) - +1 (555) 456-7891',
    medicalHistory: ['None significant'],
    currentMedications: ['Prenatal vitamins'],
    allergies: ['None known'],
    notes: 'Healthy pregnancy. Patient is following all recommendations well.'
  }
];

export default function DoctorDashboardEnhanced() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const handleCall = (phone: string) => {
    toast.success(`Calling ${phone}...`);
  };

  const handleMessage = (email: string, name: string) => {
    toast.success(`Opening message to ${name}...`);
  };

  const handleVideoCall = (name: string) => {
    toast.success(`Initiating video call with ${name}...`);
  };

  const handleViewRecords = (name: string) => {
    toast.success(`Opening medical records for ${name}...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 border-b shadow-sm bg-surface border-border"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Heart className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-foreground">Mama Mind</span>
              <Badge variant="secondary" className="hidden sm:inline-flex">Provider Portal</Badge>
              </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-foreground">Dr. Michelle Carter</p>
                <p className="text-xs text-foreground-muted">Obstetrician</p>
              </div>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <LogOut className="mr-2 w-4 h-4" />
                Sign Out
                </Button>
              <Button
                variant="outline" 
                size="sm"
                className="sm:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            className="border-b bg-surface border-border sm:hidden"
          >
            <div className="px-4 py-3 space-y-2">
              <div className="text-sm">
                <p className="font-medium text-foreground">Dr. Michelle Carter</p>
                <p className="text-foreground-muted">Obstetrician</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <LogOut className="mr-2 w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 sm:mb-8">
                <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
                >
            <Card className="h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-primary/10 sm:p-3">
                    <Users className="w-5 h-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm text-foreground-muted">Total Patients</p>
                    <p className="text-xl font-bold sm:text-2xl text-foreground">{stats.totalPatients}</p>
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
            <Card className="h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-full sm:p-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm text-foreground-muted">High Risk</p>
                    <p className="text-xl font-bold sm:text-2xl text-foreground">{stats.highRisk}</p>
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
            <Card className="h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-full sm:p-3">
                    <Activity className="w-5 h-5 text-yellow-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm text-foreground-muted">Active Alerts</p>
                    <p className="text-xl font-bold sm:text-2xl text-foreground">{stats.alertsToday}</p>
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
            <Card className="h-full">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-full sm:p-3">
                    <Calendar className="w-5 h-5 text-blue-600 sm:h-6 sm:w-6" />
                  </div>
                  <div className="ml-3 sm:ml-4">
                    <p className="text-xs sm:text-sm text-foreground-muted">Today&apos;s Appointments</p>
                    <p className="text-xl font-bold sm:text-2xl text-foreground">{stats.appointmentsToday}</p>
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
          className="flex flex-col gap-3 mb-6 sm:flex-row sm:gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 w-4 h-4 transform -translate-y-1/2 text-foreground-muted" />
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
              className="flex-shrink-0 px-3 py-2 text-sm rounded-lg border border-border"
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
              <div className="space-y-3 sm:space-y-4">
                {filteredPatients.map((patient, index) => (
            <motion.div
              key={patient.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-lg border transition-all duration-200 cursor-pointer border-border sm:p-4 hover:shadow-md"
                    onClick={() => setSelectedPatient(patient)}
            >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                      {/* Patient Info */}
                <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap gap-2 items-center mb-2 sm:gap-3">
                          <h3 className="text-sm font-semibold text-foreground sm:text-base">{patient.name}</h3>
                          <Badge className={`${getRiskColor(patient.riskLevel)} text-xs`} variant="secondary">
                            {patient.riskLevel} risk
                          </Badge>
                {patient.alerts > 0 && (
                            <Badge variant="error" className="text-xs">
                              {patient.alerts} alert{patient.alerts > 1 ? 's' : ''}
                            </Badge>
                )}
              </div>
                        <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4 sm:gap-4 sm:text-sm text-foreground-muted">
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
                      <div className="flex-shrink-0 p-2 min-w-0 bg-gray-50 rounded-lg sm:p-3">
                        <p className="mb-1 text-xs text-foreground-muted sm:mb-2">Recent Vitals</p>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium">BP:</span>
                            <span className={`text-xs ${getStatusColor(patient.recentVitals.status)}`}>
                              {patient.recentVitals.bloodPressure}
                            </span>
                </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-medium">Weight:</span>
                            <span className="text-xs text-foreground">
                              {patient.recentVitals.weight}
                            </span>
                </div>
                </div>
              </div>

                      {/* Actions */}
                      <div className="flex flex-shrink-0 gap-1 items-center sm:gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="px-2 h-8 sm:px-3"
                          onClick={() => handleCall(patient.phone)}
                        >
                          <Phone className="mr-1 w-3 h-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Call</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="px-2 h-8 sm:px-3"
                          onClick={() => handleMessage(patient.email, patient.name)}
                        >
                          <Mail className="mr-1 w-3 h-3 sm:h-4 sm:w-4" />
                          <span className="hidden sm:inline">Message</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="p-0 w-8 h-8"
                          onClick={() => setSelectedPatient(patient)}
                        >
                          <MoreVertical className="w-3 h-3 sm:h-4 sm:w-4" />
                </Button>
                      </div>
              </div>
            </motion.div>
          ))}

                {filteredPatients.length === 0 && (
                  <div className="py-8 text-center text-foreground-muted">
                    <Users className="mx-auto mb-4 w-12 h-12 opacity-50" />
                    <p>No patients found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Patient Details Popup */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex fixed inset-0 z-50 justify-center items-center p-4 bg-black/50"
            onClick={() => setSelectedPatient(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b sm:p-6 border-border">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl text-foreground">{selectedPatient.name}</h2>
                    <p className="text-sm text-foreground-muted">Patient ID: {selectedPatient.id}</p>
                  </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                  onClick={() => setSelectedPatient(null)}
                  className="p-0 w-8 h-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="p-4 space-y-6 sm:p-6">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <Button 
                      onClick={() => handleCall(selectedPatient.phone)}
                      className="flex flex-col items-center py-3 space-y-1 h-auto"
                    >
                      <Phone className="w-5 h-5" />
                      <span className="text-xs">Call</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleMessage(selectedPatient.email, selectedPatient.name)}
                      className="flex flex-col items-center py-3 space-y-1 h-auto"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-xs">Message</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleVideoCall(selectedPatient.name)}
                      className="flex flex-col items-center py-3 space-y-1 h-auto"
                    >
                      <Video className="w-5 h-5" />
                      <span className="text-xs">Video Call</span>
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleViewRecords(selectedPatient.name)}
                      className="flex flex-col items-center py-3 space-y-1 h-auto"
                    >
                      <FileText className="w-5 h-5" />
                      <span className="text-xs">Records</span>
                    </Button>
                  </div>

                  {/* Patient Information */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Basic Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Basic Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-foreground-muted">Age:</span>
                            <p className="text-foreground">{selectedPatient.age} years</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground-muted">Gestational Week:</span>
                            <p className="text-foreground">{selectedPatient.gestationalWeek} weeks</p>
                          </div>
                          <div>
                            <span className="font-medium text-foreground-muted">Risk Level:</span>
                            <Badge className={`${getRiskColor(selectedPatient.riskLevel)} mt-1`}>
                              {selectedPatient.riskLevel} risk
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium text-foreground-muted">Alerts:</span>
                            <p className="text-foreground">{selectedPatient.alerts}</p>
                          </div>
                        </div>
                        <div>
                          <span className="font-medium text-foreground-muted">Address:</span>
                          <p className="text-sm text-foreground">{selectedPatient.address}</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground-muted">Emergency Contact:</span>
                          <p className="text-sm text-foreground">{selectedPatient.emergencyContact}</p>
                        </div>
                      </CardContent>
                    </Card>

                  {/* Contact Info */}
                  <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                          <span className="font-medium text-foreground-muted">Phone:</span>
                          <p className="text-foreground">{selectedPatient.phone}</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground-muted">Email:</span>
                          <p className="text-foreground">{selectedPatient.email}</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground-muted">Last Visit:</span>
                          <p className="text-foreground">{selectedPatient.lastVisit.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="font-medium text-foreground-muted">Next Appointment:</span>
                          <p className="text-foreground">{selectedPatient.nextAppointment.toLocaleDateString()}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Medical Information */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Medical History */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Medical History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPatient.medicalHistory.map((item, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 rounded-full bg-primary"></div>
                              <span className="text-sm text-foreground">{item}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Current Medications */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Current Medications</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPatient.currentMedications.map((med, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm text-foreground">{med}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Allergies and Notes */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Allergies */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Allergies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {selectedPatient.allergies.length > 0 ? (
                            selectedPatient.allergies.map((allergy, index) => (
                              <div key={index} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-foreground">{allergy}</span>
                      </div>
                            ))
                          ) : (
                            <p className="text-sm text-foreground-muted">No known allergies</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Vitals */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Vitals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground-muted">Blood Pressure:</span>
                            <span className={`text-sm font-medium ${getStatusColor(selectedPatient.recentVitals.status)}`}>
                              {selectedPatient.recentVitals.bloodPressure}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground-muted">Weight:</span>
                            <span className="text-sm font-medium text-foreground">
                              {selectedPatient.recentVitals.weight}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground-muted">Status:</span>
                            <Badge className={`${getRiskColor(selectedPatient.recentVitals.status)}`}>
                              {selectedPatient.recentVitals.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Notes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Clinical Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground">{selectedPatient.notes}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
