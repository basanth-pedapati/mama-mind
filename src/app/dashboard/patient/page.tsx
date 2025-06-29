'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Heart, 
  Activity, 
  Calendar,
  MessageCircle,
  AlertTriangle,
  Plus,
  Baby,
  Scale,
  Stethoscope,
  Menu,
  X,
  Zap,
  BarChart3,
  Phone,
  ChevronDown,
  ChevronUp,
  Thermometer,
  ActivitySquare,
  LogOut,
  Settings,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ChatAssistant from '@/components/ChatAssistant';
import VitalsChart from '@/components/VitalsChart';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

interface Vital {
  id: string;
  type: 'blood_pressure' | 'weight' | 'glucose' | 'heart_rate' | 'temperature' | 'baby_movement';
  value: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
  interface: 'mother' | 'child';
}

interface VitalForm {
  type: 'blood_pressure' | 'weight' | 'glucose' | 'heart_rate' | 'temperature' | 'baby_movement';
  systolic: string;
  diastolic: string;
  weight: string;
  glucose: string;
  heartRate: string;
  temperature: string;
  babyMovement: string;
}

interface BabyData {
  gestationalWeek: number;
  estimatedWeight: string;
  heartRate: string;
  movementCount: number;
  lastKick: Date;
  position: string;
}

export default function PatientDashboard() {
  const { user, signOut, addToHistory } = useAuth();
  const router = useRouter();
  const [interfaceMode, setInterfaceMode] = useState<'mother' | 'child'>('mother');
  const [showChat, setShowChat] = useState(false);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));
  const [vitals, setVitals] = useState<Vital[]>([
    {
      id: '1',
      type: 'blood_pressure',
      value: '120/80',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'normal',
      interface: 'mother'
    },
    {
      id: '2',
      type: 'weight',
      value: '68.5 kg',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'normal',
      interface: 'mother'
    },
    {
      id: '3',
      type: 'baby_movement',
      value: '15 kicks',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      status: 'normal',
      interface: 'child'
    }
  ]);

  const [vitalForm, setVitalForm] = useState<VitalForm>({
    type: 'blood_pressure',
    systolic: '',
    diastolic: '',
    weight: '',
    glucose: '',
    heartRate: '',
    temperature: '',
    babyMovement: ''
  });

  const [babyData] = useState<BabyData>({
    gestationalWeek: 28,
    estimatedWeight: '1.1 kg',
    heartRate: '140 bpm',
    movementCount: 15,
    lastKick: new Date(Date.now() - 30 * 60 * 1000),
    position: 'Head down'
  });

  const gestationalWeek = 28;
  const dueDate = new Date('2024-08-15');

  // Calculate pregnancy progress
  const calculatePregnancyProgress = () => {
    const today = new Date();
    const startDate = new Date(dueDate);
    startDate.setDate(startDate.getDate() - 280); // 40 weeks = 280 days
    
    const totalDays = 280;
    const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const progress = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
    
    return {
      progress: Math.round(progress),
      daysRemaining: Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))),
      weeksRemaining: Math.ceil(Math.max(0, (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 7)))
    };
  };

  const pregnancyProgress = calculatePregnancyProgress();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully! 👋');
    } catch {
      toast.error('Error signing out');
    }
  };

  const handleProfileClick = () => {
    addToHistory('/profile/patient');
    router.push('/profile/patient');
  };

  const toggleInterfaceMode = () => {
    setInterfaceMode(prev => prev === 'mother' ? 'child' : 'mother');
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleVitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let value = '';
    if (vitalForm.type === 'blood_pressure' && vitalForm.systolic && vitalForm.diastolic) {
      value = `${vitalForm.systolic}/${vitalForm.diastolic}`;
    } else if (vitalForm.type === 'weight' && vitalForm.weight) {
      value = `${vitalForm.weight} kg`;
    } else if (vitalForm.type === 'glucose' && vitalForm.glucose) {
      value = `${vitalForm.glucose} mg/dL`;
    } else if (vitalForm.type === 'heart_rate' && vitalForm.heartRate) {
      value = `${vitalForm.heartRate} bpm`;
    } else if (vitalForm.type === 'temperature' && vitalForm.temperature) {
      value = `${vitalForm.temperature}°F`;
    } else if (vitalForm.type === 'baby_movement' && vitalForm.babyMovement) {
      value = `${vitalForm.babyMovement} kicks`;
    }

    if (value) {
      const newVital: Vital = {
        id: Date.now().toString(),
        type: vitalForm.type,
        value,
        timestamp: new Date(),
        status: 'normal',
        interface: interfaceMode
      };

      setVitals(prev => [newVital, ...prev]);
      setVitalForm({ 
        type: 'blood_pressure', 
        systolic: '', 
        diastolic: '', 
        weight: '', 
        glucose: '',
        heartRate: '',
        temperature: '',
        babyMovement: ''
      });
      setShowVitalsForm(false);
      toast.success(`${interfaceMode === 'mother' ? 'Maternal' : 'Baby'} vitals recorded successfully! 📊`);
    } else {
      toast.error('Please fill in the required fields');
    }
  };

  const handleEmergencyAlert = () => {
    toast.error('🚨 Emergency alert sent to your healthcare provider!', {
      duration: 5000,
    });
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return <Stethoscope className="h-4 w-4" />;
      case 'weight': return <Scale className="h-4 w-4" />;
      case 'glucose': return <Activity className="h-4 w-4" />;
      case 'heart_rate': return <Heart className="h-4 w-4" />;
      case 'temperature': return <Thermometer className="h-4 w-4" />;
      case 'baby_movement': return <Baby className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVitalLabel = (type: string) => {
    switch (type) {
      case 'blood_pressure': return 'Blood Pressure';
      case 'weight': return 'Weight';
      case 'glucose': return 'Glucose';
      case 'heart_rate': return 'Heart Rate';
      case 'temperature': return 'Temperature';
      case 'baby_movement': return 'Baby Movement';
      default: return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const filteredVitals = vitals.filter(vital => vital.interface === interfaceMode);

  const quickActions = [
    {
      id: 'vitals',
      label: 'Log Vitals',
      icon: Plus,
      color: 'bg-primary text-white hover:bg-primary/90',
      action: () => setShowVitalsForm(true)
    },
    {
      id: 'chat',
      label: 'AI Assistant',
      icon: MessageCircle,
      color: 'bg-blue-500 text-white hover:bg-blue-600',
      action: () => setShowChat(true)
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: AlertTriangle,
      color: 'bg-red-500 text-white hover:bg-red-600',
      action: () => handleEmergencyAlert()
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['patient']}>
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
                <Badge variant="secondary" className="hidden sm:inline-flex">Patient Portal</Badge>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-foreground">
                    {user?.profile?.first_name} {user?.profile?.last_name}
                  </p>
                  <p className="text-xs text-foreground-muted">Week {gestationalWeek}</p>
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
            
            {/* Pregnancy Progress Bar */}
            <div className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Baby className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">Pregnancy Progress</span>
                </div>
                <span className="text-sm text-foreground-muted">
                  {pregnancyProgress.weeksRemaining} weeks remaining
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pregnancyProgress.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-foreground-muted mt-1">
                <span>Week 1</span>
                <span className="text-primary font-medium">{pregnancyProgress.progress}%</span>
                <span>Week 40</span>
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
              className="bg-surface border-b border-border sm:hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {/* User Info */}
                <div className="text-center pb-4 border-b border-border">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-foreground">
                    {user?.profile?.first_name} {user?.profile?.last_name}
                  </p>
                  <p className="text-sm text-foreground-muted">Week {gestationalWeek}</p>
                  <Badge variant="outline" className="mt-2">Patient</Badge>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">Quick Actions</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start" 
                    onClick={() => {
                      setShowVitalsForm(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-3" />
                    Add Vitals
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setShowChat(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <MessageCircle className="h-4 w-4 mr-3" />
                    Chat Assistant
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      handleEmergencyAlert();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-3" />
                    Emergency Alert
                  </Button>
                </div>

                {/* Interface Toggle */}
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-foreground-muted uppercase tracking-wide">View Mode</h3>
                  <Button 
                    variant={interfaceMode === 'mother' ? 'default' : 'outline'}
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      toggleInterfaceMode();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <User className="h-4 w-4 mr-3" />
                    Maternal View
                  </Button>
                  <Button 
                    variant={interfaceMode === 'child' ? 'default' : 'outline'}
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      toggleInterfaceMode();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Baby className="h-4 w-4 mr-3" />
                    Baby View
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

                {/* Pregnancy Progress (Mobile) */}
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Baby className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Progress</span>
                    </div>
                    <span className="text-xs text-foreground-muted">
                      {pregnancyProgress.weeksRemaining}w left
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pregnancyProgress.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-foreground-muted mt-1">
                    <span>W1</span>
                    <span className="text-primary font-medium">{pregnancyProgress.progress}%</span>
                    <span>W40</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
                
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
                  <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Welcome back, Sarah! 👋
                </h2>
                <p className="text-muted-foreground">
                  {interfaceMode === 'mother' 
                    ? 'Track your pregnancy journey and monitor your health'
                    : 'Monitor your baby\'s development and well-being'
                  }
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <Badge variant="secondary" className="text-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    Week {gestationalWeek} • Due {dueDate.toLocaleDateString()}
                  </Badge>
                    <Button
                    variant="outline"
                      size="sm"
                    onClick={toggleInterfaceMode}
                    className="flex items-center space-x-2"
                  >
                    {interfaceMode === 'mother' ? (
                      <>
                        <User className="w-4 h-4" />
                        <span>Switch to Baby View</span>
                      </>
                    ) : (
                      <>
                        <Baby className="w-4 h-4" />
                        <span>Switch to Mother View</span>
                      </>
                    )}
                    </Button>
                </div>
              </div>
            </div>
                  </motion.div>
                  
          {/* Quick Actions */}
                  <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  className={`${action.color} p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}
                >
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-6 h-6" />
                    <span className="font-semibold">{action.label}</span>
                </div>
                </button>
              ))}
              </div>
            </motion.div>

          {/* Vitals Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6"
          >
            <Card>
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary" />
                      <span>Health Vitals</span>
                      <Badge variant="outline" className="ml-2">
                        {interfaceMode === 'mother' ? 'Maternal' : 'Baby'} View
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-foreground-muted mt-1">
                      Track your {interfaceMode === 'mother' ? 'maternal' : 'baby'} health metrics
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleInterfaceMode}
                      className="flex items-center space-x-2"
                    >
                      {interfaceMode === 'mother' ? <Baby className="h-4 w-4" /> : <User className="h-4 w-4" />}
                      <span className="hidden sm:inline">
                        Switch to {interfaceMode === 'mother' ? 'Baby' : 'Mother'} View
                      </span>
                    </Button>
                    <Button
                      onClick={() => setShowVitalsForm(true)}
                      className="bg-primary hover:bg-primary-dark text-secondary"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Add Vitals</span>
                      <span className="sm:hidden">Add</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Vitals Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {interfaceMode === 'mother' ? (
                    <>
                      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Blood Pressure</p>
                              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">120/80</p>
                              <p className="text-xs text-blue-600 dark:text-blue-400">Last: 2 hours ago</p>
                            </div>
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                              <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-green-700 dark:text-green-300">Weight</p>
                              <p className="text-2xl font-bold text-green-900 dark:text-green-100">68.5 kg</p>
                              <p className="text-xs text-green-600 dark:text-green-400">Last: 1 day ago</p>
                            </div>
                            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                              <Scale className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Glucose</p>
                              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">95 mg/dL</p>
                              <p className="text-xs text-purple-600 dark:text-purple-400">Last: 3 hours ago</p>
                            </div>
                            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full">
                              <Stethoscope className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  ) : (
                    <>
                      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/20 dark:to-pink-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-pink-700 dark:text-pink-300">Baby Heart Rate</p>
                              <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">140 bpm</p>
                              <p className="text-xs text-pink-600 dark:text-pink-400">Last: 1 hour ago</p>
                            </div>
                            <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-full">
                              <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Baby Movement</p>
                              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">15 kicks</p>
                              <p className="text-xs text-orange-600 dark:text-orange-400">Last: 30 min ago</p>
                            </div>
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-full">
                              <Baby className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-950/20 dark:to-teal-900/20">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-teal-700 dark:text-teal-300">Estimated Weight</p>
                              <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">1.1 kg</p>
                              <p className="text-xs text-teal-600 dark:text-teal-400">Week {gestationalWeek}</p>
                            </div>
                            <div className="bg-teal-100 dark:bg-teal-900/30 p-2 rounded-full">
                              <Scale className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>

                {/* Recent Vitals List */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Recent Vitals</h3>
                    <Button variant="ghost" size="sm" onClick={() => setExpandedSections(prev => 
                      prev.has('vitals') ? new Set([...prev].filter(s => s !== 'vitals')) : new Set([...prev, 'vitals'])
                    )}>
                      {expandedSections.has('vitals') ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                  </div>
                  
                  <AnimatePresence>
                    {expandedSections.has('vitals') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        {vitals
                          .filter(vital => vital.interface === interfaceMode)
                          .slice(0, 5)
                          .map((vital) => (
                            <motion.div
                              key={vital.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 bg-surface-light rounded-lg border border-border/50 hover:shadow-sm transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${getStatusColor(vital.status)}/10`}>
                                  {getVitalIcon(vital.type)}
                                </div>
                                <div>
                                  <p className="font-medium text-foreground">{getVitalLabel(vital.type)}</p>
                                  <p className="text-sm text-foreground-muted">
                                    {vital.timestamp.toLocaleDateString()} at {vital.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className={`font-semibold ${getStatusColor(vital.status)}`}>{vital.value}</p>
                                <Badge variant={vital.status === 'normal' ? 'secondary' : vital.status === 'warning' ? 'default' : 'destructive'} className="text-xs">
                                  {vital.status}
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        
                        {vitals.filter(vital => vital.interface === interfaceMode).length === 0 && (
                          <div className="text-center py-8 text-foreground-muted">
                            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No {interfaceMode === 'mother' ? 'maternal' : 'baby'} vitals recorded yet</p>
                            <p className="text-sm">Add your first vital reading to get started</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Overview & Vitals */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview Section */}
        <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <ActivitySquare className="w-5 h-5 mr-2 text-primary" />
                        {interfaceMode === 'mother' ? 'Maternal Overview' : 'Baby Overview'}
                      </CardTitle>
                      <button
                        onClick={() => toggleSection('overview')}
                        className="p-1 rounded-md hover:bg-muted"
                      >
                        {expandedSections.has('overview') ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </CardHeader>
                  <AnimatePresence>
                    {expandedSections.has('overview') && (
                  <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <CardContent className="pt-0">
                          {interfaceMode === 'mother' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              <div className="bg-background/50 rounded-lg p-4 border border-border">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Heart className="w-5 h-5 text-blue-600" />
                                  </div>
                  <div>
                                    <p className="text-sm text-muted-foreground">Blood Pressure</p>
                                    <p className="text-lg font-semibold">120/80</p>
                  </div>
                </div>
                  </div>
                            <div className="bg-background/50 rounded-lg p-4 border border-border">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <Scale className="w-5 h-5 text-green-600" />
                  </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Weight</p>
                                  <p className="text-lg font-semibold">68.5 kg</p>
                </div>
              </div>
                            </div>
                            <div className="bg-background/50 rounded-lg p-4 border border-border">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <Activity className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Glucose</p>
                                  <p className="text-lg font-semibold">95 mg/dL</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="bg-background/50 rounded-lg p-4 border border-border">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                  <Heart className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Heart Rate</p>
                                  <p className="text-lg font-semibold">140 bpm</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-background/50 rounded-lg p-4 border border-border">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                  <Scale className="w-5 h-5 text-orange-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Weight</p>
                                  <p className="text-lg font-semibold">1.1 kg</p>
                                </div>
                              </div>
                            </div>
                            <div className="bg-background/50 rounded-lg p-4 border border-border">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                                  <Baby className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Movements</p>
                                  <p className="text-lg font-semibold">15 kicks</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
            </CardContent>
                      </motion.div>
                    )}
                  </AnimatePresence>
          </Card>
        </motion.div>

              {/* Vitals Chart */}
        <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-primary" />
                        {interfaceMode === 'mother' ? 'Maternal Vitals' : 'Baby Vitals'} Trends
              </CardTitle>
                      <button
                        onClick={() => toggleSection('vitals')}
                        className="p-1 rounded-md hover:bg-muted"
                      >
                        {expandedSections.has('vitals') ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
            </CardHeader>
                  <AnimatePresence>
                    {expandedSections.has('vitals') && (
                  <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <CardContent className="pt-0">
                          <div className="h-64">
                            <VitalsChart type={interfaceMode === 'mother' ? 'blood_pressure' : 'weight'} />
              </div>
            </CardContent>
                    </motion.div>
                  )}
                  </AnimatePresence>
          </Card>
        </motion.div>

              {/* Recent Vitals */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-primary/5 to-accent/5">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl font-semibold flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-primary" />
                        Recent {interfaceMode === 'mother' ? 'Maternal' : 'Baby'} Vitals
                  </CardTitle>
                      <button
                        onClick={() => toggleSection('recent')}
                        className="p-1 rounded-md hover:bg-muted"
                      >
                        {expandedSections.has('recent') ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                </CardHeader>
                  <AnimatePresence>
                    {expandedSections.has('recent') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <CardContent className="pt-0">
                          <div className="space-y-3">
                            {filteredVitals.slice(0, 5).map((vital) => (
                              <div
                        key={vital.id}
                                className="flex items-center justify-between p-3 bg-background/50 rounded-lg border border-border"
                      >
                        <div className="flex items-center space-x-3">
                            {getVitalIcon(vital.type)}
                          <div>
                                          <p className="font-medium">{getVitalLabel(vital.type)}</p>
                                          <p className="text-sm text-muted-foreground">
                              {vital.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                                        <p className="font-semibold">{vital.value}</p>
                                        <Badge className={`text-xs ${getStatusColor(vital.status)}`}>
                            {vital.status}
                                        </Badge>
                        </div>
                                    </div>
                                  ))}
                  </div>
                </CardContent>
                    </motion.div>
                  )}
                  </AnimatePresence>
              </Card>
            </motion.div>
          </div>

            {/* Right Column - Sidebar */}
          <div className="space-y-6">
              {/* Baby Info (when in child mode) */}
              {interfaceMode === 'child' && (
            <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-pink-50 to-purple-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl font-semibold flex items-center text-pink-700">
                        <Baby className="w-5 h-5 mr-2" />
                        Baby Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white rounded-lg border border-pink-200">
                          <p className="text-sm text-pink-600">Gestational Week</p>
                          <p className="text-xl font-bold text-pink-700">{babyData.gestationalWeek}</p>
                    </div>
                        <div className="text-center p-3 bg-white rounded-lg border border-pink-200">
                          <p className="text-sm text-pink-600">Weight</p>
                          <p className="text-xl font-bold text-pink-700">{babyData.estimatedWeight}</p>
                    </div>
                    </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-pink-200">
                          <span className="text-sm text-pink-600">Heart Rate</span>
                          <span className="font-semibold text-pink-700">{babyData.heartRate}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-pink-200">
                          <span className="text-sm text-pink-600">Position</span>
                          <span className="font-semibold text-pink-700">{babyData.position}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-white rounded-lg border border-pink-200">
                          <span className="text-sm text-pink-600">Last Kick</span>
                          <span className="font-semibold text-pink-700">
                            {babyData.lastKick.toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                </CardContent>
              </Card>
            </motion.div>
              )}

              {/* Emergency Contact */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-red-50 to-orange-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold flex items-center text-red-700">
                      <Phone className="w-5 h-5 mr-2" />
                      Emergency Contact
                    </CardTitle>
                </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-red-200">
                      <p className="font-semibold text-red-700">Dr. Emily Johnson</p>
                      <p className="text-sm text-red-600">Obstetrician</p>
                      <p className="text-sm text-red-600">(555) 123-4567</p>
                    </div>
                    <Button
                      onClick={handleEmergencyAlert}
                      className="w-full bg-red-600 hover:bg-red-700 text-white"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Emergency Alert
                    </Button>
                  </CardContent>
                </Card>
                  </motion.div>

              {/* Quick Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-semibold flex items-center text-blue-700">
                      <Zap className="w-5 h-5 mr-2" />
                      Quick Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-700">
                        {interfaceMode === 'mother' 
                          ? 'Stay hydrated and take regular walks'
                          : 'Count kicks daily - should be 10+ in 2 hours'
                        }
                      </p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-blue-200">
                      <p className="text-sm font-medium text-blue-700">
                        {interfaceMode === 'mother'
                          ? 'Monitor blood pressure regularly'
                          : 'Baby should move more after meals'
                        }
                      </p>
                    </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        </div>

        {/* Vitals Form Modal */}
      <AnimatePresence>
        {showVitalsForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowVitalsForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
                className="bg-background rounded-xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Log {interfaceMode === 'mother' ? 'Maternal' : 'Baby'} Vitals
                    </h3>
                    <button
                    onClick={() => setShowVitalsForm(false)}
                      className="p-1 rounded-md hover:bg-muted"
                  >
                      <X className="w-4 h-4" />
                    </button>
                </div>
                <form onSubmit={handleVitalSubmit} className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium mb-2">Vital Type</label>
                    <select
                      value={vitalForm.type}
                        onChange={(e) => setVitalForm(prev => ({ ...prev, type: e.target.value as Vital['type'] }))}
                        className="w-full p-3 border border-border rounded-lg bg-background"
                    >
                        {interfaceMode === 'mother' ? (
                          <>
                      <option value="blood_pressure">Blood Pressure</option>
                      <option value="weight">Weight</option>
                      <option value="glucose">Glucose</option>
                            <option value="temperature">Temperature</option>
                          </>
                        ) : (
                          <>
                            <option value="heart_rate">Heart Rate</option>
                            <option value="weight">Weight</option>
                            <option value="baby_movement">Baby Movement</option>
                          </>
                        )}
                    </select>
                  </div>

                  {vitalForm.type === 'blood_pressure' && (
                      <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Systolic</label>
                        <Input
                          type="number"
                          placeholder="120"
                          value={vitalForm.systolic}
                            onChange={(e) => setVitalForm(prev => ({ ...prev, systolic: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Diastolic</label>
                        <Input
                          type="number"
                          placeholder="80"
                          value={vitalForm.diastolic}
                            onChange={(e) => setVitalForm(prev => ({ ...prev, diastolic: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  {vitalForm.type === 'weight' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Weight (kg)</label>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="68.5"
                        value={vitalForm.weight}
                          onChange={(e) => setVitalForm(prev => ({ ...prev, weight: e.target.value }))}
                      />
                    </div>
                  )}

                  {vitalForm.type === 'glucose' && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Glucose (mg/dL)</label>
                      <Input
                        type="number"
                        placeholder="95"
                        value={vitalForm.glucose}
                          onChange={(e) => setVitalForm(prev => ({ ...prev, glucose: e.target.value }))}
                        />
                      </div>
                    )}

                    {vitalForm.type === 'heart_rate' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Heart Rate (bpm)</label>
                        <Input
                          type="number"
                          placeholder="140"
                          value={vitalForm.heartRate}
                          onChange={(e) => setVitalForm(prev => ({ ...prev, heartRate: e.target.value }))}
                        />
                      </div>
                    )}

                    {vitalForm.type === 'temperature' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Temperature (°F)</label>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="98.6"
                          value={vitalForm.temperature}
                          onChange={(e) => setVitalForm(prev => ({ ...prev, temperature: e.target.value }))}
                        />
                      </div>
                    )}

                    {vitalForm.type === 'baby_movement' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Baby Movements (kicks)</label>
                        <Input
                          type="number"
                          placeholder="15"
                          value={vitalForm.babyMovement}
                          onChange={(e) => setVitalForm(prev => ({ ...prev, babyMovement: e.target.value }))}
                      />
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
e                      <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowVitalsForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                        Save Vitals
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Assistant */}
      <AnimatePresence>
        {showChat && (
            <ChatAssistant onClose={() => setShowChat(false)} />
        )}
      </AnimatePresence>
              </div>
    </ProtectedRoute>
  );
}
