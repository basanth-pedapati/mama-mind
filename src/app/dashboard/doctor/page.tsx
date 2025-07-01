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
  Menu,
  Settings,
  Scale
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { VitalsCard } from '@/components/ui/vitals-card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import VitalsChart from '@/components/VitalsChart';

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
  }
];

export default function DoctorDashboard() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedVital, setSelectedVital] = useState<{
    patientName: string;
    vitalType: 'bloodPressure' | 'weight';
    value: string;
    status: 'normal' | 'warning' | 'critical';
  } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully! 👋');
    } catch {
      toast.error('Error signing out');
    }
  };

  const handleProfileClick = () => {
    router.push('/profile/doctor');
  };

  const handleOpenVitalModal = (patientName: string, vitalType: 'bloodPressure' | 'weight', value: string, status: 'normal' | 'warning' | 'critical') => {
    setSelectedVital({ patientName, vitalType, value, status });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVital(null);
  };

  return (
    <ProtectedRoute allowedRoles={['doctor']}>
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
        {/* Header */}
        <motion.header 
          className="bg-surface border-b border-border shadow-sm sticky top-0 z-50"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Mama Mind</span>
                <Badge variant="secondary" className="hidden sm:inline-flex">Provider Portal</Badge>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    Dr. {user?.profile?.first_name} {user?.profile?.last_name}
                  </p>
                  <p className="text-xs text-foreground-muted">Obstetrician</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex"
                  onClick={handleProfileClick}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="sm:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 sm:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Mobile Menu */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-surface border-b border-border sm:hidden relative z-40 shadow-lg"
              >
                <div className="px-4 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
                  {/* User Info */}
                  <div className="text-center pb-4 border-b border-border">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">
                      Dr. {user?.profile?.first_name} {user?.profile?.last_name}
                    </p>
                    <p className="text-sm text-foreground-muted">Obstetrician</p>
                    <Badge variant="outline" className="mt-2">Provider Portal</Badge>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">Today&apos;s Overview</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalPatients}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Patients</p>
                      </div>
                      <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.alertsToday}</p>
                        <p className="text-xs text-red-600 dark:text-red-400">Alerts</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">Quick Actions</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        // Add search functionality
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Search className="h-4 w-4 mr-3" />
                      Search Patients
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        // Add calendar functionality
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Calendar className="h-4 w-4 mr-3" />
                      View Schedule
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">Navigation</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={() => {
                        handleProfileClick();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Profile Settings
                    </Button>
                  </div>

                  {/* Account */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">Account</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-red-600 hover:text-red-700"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="h-full">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 sm:p-3 rounded-full">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm text-foreground-muted">Total Patients</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalPatients}</p>
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
                    <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                      <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm text-foreground-muted">High Risk</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.highRisk}</p>
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
                    <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                      <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm text-foreground-muted">Active Alerts</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.alertsToday}</p>
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
                    <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="ml-3 sm:ml-4">
                      <p className="text-xs sm:text-sm text-foreground-muted">Today&apos;s Appointments</p>
                      <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.appointmentsToday}</p>
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
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6"
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
                className="px-3 py-2 border border-border rounded-lg text-sm flex-shrink-0"
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
                      className="border border-border rounded-lg p-3 sm:p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedPatient(patient)}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        {/* Patient Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="font-semibold text-foreground text-sm sm:text-base">{patient.name}</h3>
                            <Badge className={`${getRiskColor(patient.riskLevel)} text-xs`} variant="secondary">
                              {patient.riskLevel} risk
                            </Badge>
                            {patient.alerts > 0 && (
                              <Badge variant="error" className="text-xs">
                                {patient.alerts} alert{patient.alerts > 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm text-foreground-muted">
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
                        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 min-w-0 flex-shrink-0">
                          <p className="text-xs text-foreground-muted mb-1 sm:mb-2">Recent Vitals</p>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleOpenVitalModal(patient.name, 'bloodPressure', patient.recentVitals.bloodPressure, patient.recentVitals.status)} tabIndex={0} role="button" aria-label={`View details for ${patient.name} blood pressure`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpenVitalModal(patient.name, 'bloodPressure', patient.recentVitals.bloodPressure, patient.recentVitals.status); }}>
                              <span className="text-xs font-medium">BP:</span>
                              <span className={`text-xs ${getStatusColor(patient.recentVitals.status)}`}>{patient.recentVitals.bloodPressure}</span>
                            </div>
                            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleOpenVitalModal(patient.name, 'weight', patient.recentVitals.weight, patient.recentVitals.status)} tabIndex={0} role="button" aria-label={`View details for ${patient.name} weight`} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpenVitalModal(patient.name, 'weight', patient.recentVitals.weight, patient.recentVitals.status); }}>
                              <span className="text-xs font-medium">Weight:</span>
                              <span className="text-xs text-foreground">{patient.recentVitals.weight}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 sm:px-3"
                            onClick={() => handleCall(patient.phone)}
                          >
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Call</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 px-2 sm:px-3"
                            onClick={() => handleMessage(patient.email, patient.name)}
                          >
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="hidden sm:inline">Message</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                              e.stopPropagation();
                              setSelectedPatient(patient);
                            }}
                          >
                            <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
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

        {/* Patient Details Popup */}
        <AnimatePresence>
          {selectedPatient && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedPatient(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">{selectedPatient.name}</h2>
                      <p className="text-sm text-foreground-muted">Patient ID: {selectedPatient.id}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPatient(null)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <Button 
                        onClick={() => handleCall(selectedPatient.phone)}
                        className="flex flex-col items-center space-y-1 h-auto py-3"
                      >
                        <Phone className="h-5 w-5" />
                        <span className="text-xs">Call</span>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handleMessage(selectedPatient.email, selectedPatient.name)}
                        className="flex flex-col items-center space-y-1 h-auto py-3"
                      >
                        <MessageCircle className="h-5 w-5" />
                        <span className="text-xs">Message</span>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => toast.success(`Video call with ${selectedPatient.name}...`)}
                        className="flex flex-col items-center space-y-1 h-auto py-3"
                      >
                        <Video className="h-5 w-5" />
                        <span className="text-xs">Video Call</span>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => toast.success(`Opening records for ${selectedPatient.name}...`)}
                        className="flex flex-col items-center space-y-1 h-auto py-3"
                      >
                        <FileText className="h-5 w-5" />
                        <span className="text-xs">Records</span>
                      </Button>
                    </div>

                    {/* Patient Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                    {/* Recent Vitals */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Recent Vitals</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground-muted">Blood Pressure:</span>
                            <span className={`text-sm font-medium ${getStatusColor(selectedPatient.recentVitals.status)}`}>
                              {selectedPatient.recentVitals.bloodPressure}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground-muted">Weight:</span>
                            <span className="text-sm font-medium text-foreground">
                              {selectedPatient.recentVitals.weight}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground-muted">Status:</span>
                            <Badge className={`${getRiskColor(selectedPatient.recentVitals.status)}`}>
                              {selectedPatient.recentVitals.status}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal for detailed vital info */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg w-full sm:rounded-lg p-0 overflow-hidden bg-white shadow-2xl sm:max-h-[90vh] flex flex-col">
            <DialogHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2 border-b border-border">
              <DialogTitle className="text-lg font-bold">
                {selectedVital ? `${selectedVital.patientName} - ${selectedVital.vitalType === 'bloodPressure' ? 'Blood Pressure' : 'Weight'} Details` : ''}
              </DialogTitle>
              <DialogClose onClick={handleCloseModal} className="ml-auto text-2xl text-muted-foreground hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full px-2 py-1" aria-label="Close">×</DialogClose>
            </DialogHeader>
            {selectedVital && (
              <div className="p-4 space-y-6 overflow-y-auto">
                <VitalsCard vitals={[{
                  id: `${selectedVital.patientName}-${selectedVital.vitalType}`,
                  name: selectedVital.vitalType === 'bloodPressure' ? 'Blood Pressure' : 'Weight',
                  value: selectedVital.value,
                  unit: selectedVital.vitalType === 'bloodPressure' ? 'mmHg' : 'kg',
                  status: selectedVital.status,
                  trend: 'stable',
                  icon: selectedVital.vitalType === 'bloodPressure' ? Heart : Scale,
                  lastUpdated: '', // Add if available
                  normalRange: selectedVital.vitalType === 'bloodPressure' ? '90/60 - 140/90' : 'Varies',
                }]} />
                <div>
                  <VitalsChart type={selectedVital.vitalType === 'bloodPressure' ? 'blood_pressure' : 'weight'} />
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  );
}
