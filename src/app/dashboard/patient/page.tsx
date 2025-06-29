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
  User,
  LogOut,
  Baby,
  Scale,
  Stethoscope,
  Menu,
  X,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Bell,
  BarChart3,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ChatAssistant from '@/components/ChatAssistant';
import VitalsChart from '@/components/VitalsChart';

interface Vital {
  id: string;
  type: 'blood_pressure' | 'weight' | 'glucose';
  value: string;
  timestamp: Date;
  status: 'normal' | 'warning' | 'critical';
}

interface VitalForm {
  type: 'blood_pressure' | 'weight' | 'glucose';
  systolic: string;
  diastolic: string;
  weight: string;
  glucose: string;
}

export default function PatientDashboard() {
  const [showChat, setShowChat] = useState(false);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedQuickAction, setSelectedQuickAction] = useState<string | null>(null);
  const [vitals, setVitals] = useState<Vital[]>([
    {
      id: '1',
      type: 'blood_pressure',
      value: '120/80',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'normal'
    },
    {
      id: '2',
      type: 'weight',
      value: '68.5 kg',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'normal'
    }
  ]);

  const [vitalForm, setVitalForm] = useState<VitalForm>({
    type: 'blood_pressure',
    systolic: '',
    diastolic: '',
    weight: '',
    glucose: ''
  });

  const [showAppointments, setShowAppointments] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const gestationalWeek = 28;
  const dueDate = new Date('2024-08-15');

  const handleVitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let value = '';
    if (vitalForm.type === 'blood_pressure' && vitalForm.systolic && vitalForm.diastolic) {
      value = `${vitalForm.systolic}/${vitalForm.diastolic}`;
    } else if (vitalForm.type === 'weight' && vitalForm.weight) {
      value = `${vitalForm.weight} kg`;
    } else if (vitalForm.type === 'glucose' && vitalForm.glucose) {
      value = `${vitalForm.glucose} mg/dL`;
    }

    if (value) {
      const newVital: Vital = {
        id: Date.now().toString(),
        type: vitalForm.type,
        value,
        timestamp: new Date(),
        status: 'normal'
      };

      setVitals(prev => [newVital, ...prev]);
      setVitalForm({ type: 'blood_pressure', systolic: '', diastolic: '', weight: '', glucose: '' });
      setShowVitalsForm(false);
      toast.success('Vital signs recorded successfully! 📊');
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
      default: return <Heart className="h-4 w-4" />;
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
      id: 'appointments',
      label: 'Appointments',
      icon: Calendar,
      color: 'bg-purple-500 text-white hover:bg-purple-600',
      action: () => setShowAppointments(true)
    },
    {
      id: 'emergency',
      label: 'Emergency',
      icon: AlertTriangle,
      color: 'bg-red-500 text-white hover:bg-red-600',
      action: () => setShowEmergencyModal(true)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Enhanced Mobile Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-surface/95 backdrop-blur-md border-b border-border shadow-lg sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo with pulse animation */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <Heart className="h-8 w-8 text-primary" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"
                />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground hidden sm:block">Mama Mind</span>
                <span className="text-lg font-bold text-foreground sm:hidden">MM</span>
                <div className="text-xs text-primary font-medium hidden sm:block">Patient Portal</div>
              </div>
            </motion.div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <motion.div 
                className="text-right"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-sm font-medium text-foreground">Sarah Johnson</p>
                <p className="text-xs text-primary font-medium">Week {gestationalWeek} • Due Aug 15</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground-muted hover:text-foreground"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">Notifications</span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button with rotation animation */}
            <motion.div 
              className="md:hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-foreground-muted hover:text-foreground"
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

        {/* Enhanced Mobile Menu */}
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
                  className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-primary/10"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="bg-primary/20 p-2 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Sarah Johnson</p>
                    <p className="text-xs text-primary font-medium">Week {gestationalWeek} • Due Aug 15</p>
                  </div>
                </motion.div>
                
                <div className="space-y-2">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground-muted hover:text-foreground hover:bg-primary/10"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Bell className="h-4 w-4 mr-3" />
                      Notifications
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-foreground-muted hover:text-foreground hover:bg-red-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content with better mobile spacing */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Enhanced Pregnancy Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <motion.div 
                    className="bg-primary/20 p-3 rounded-full"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Baby className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                  </motion.div>
                  <div>
                    <motion.h2 
                      className="text-xl sm:text-2xl font-bold text-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Week {gestationalWeek}
                    </motion.h2>
                    <p className="text-sm sm:text-base text-foreground-muted">Your baby is the size of an eggplant! 🍆</p>
                    <p className="text-xs sm:text-sm text-foreground-muted mt-1">
                      Due date: {dueDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <motion.div 
                      className="text-2xl sm:text-3xl font-bold text-primary"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {gestationalWeek}/40
                    </motion.div>
                    <p className="text-xs sm:text-sm text-foreground-muted">weeks</p>
                  </div>
                  <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <motion.div
                      className="text-xs sm:text-sm font-semibold text-primary text-center"
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      70%<br/>Complete
                    </motion.div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
              <CardDescription>Access your most-used features instantly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onTap={() => setSelectedQuickAction(action.id)}
                  >
                    <Button
                      onClick={action.action}
                      className={`h-20 sm:h-24 flex-col space-y-2 w-full ${action.color} shadow-md hover:shadow-lg transition-all duration-200`}
                    >
                      <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      <span className="text-xs sm:text-sm font-medium">{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Grid Layout - Mobile First */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Vitals with enhanced mobile view */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      <span>Recent Vital Signs</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowVitalsForm(true)}
                      className="text-xs sm:text-sm"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Add
                    </Button>
                  </CardTitle>
                  <CardDescription>Your latest health measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {vitals.map((vital, index) => (
                      <motion.div
                        key={vital.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center justify-between p-3 sm:p-4 border border-border rounded-lg hover:bg-surface/50 transition-all duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            className="p-2 rounded-full bg-primary/20"
                            whileHover={{ rotate: 10 }}
                          >
                            {getVitalIcon(vital.type)}
                          </motion.div>
                          <div>
                            <p className="font-medium text-foreground capitalize text-sm sm:text-base">
                              {vital.type.replace('_', ' ')}
                            </p>
                            <p className="text-xs sm:text-sm text-foreground-muted">
                              {vital.timestamp.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground text-sm sm:text-base">{vital.value}</p>
                          <motion.span 
                            className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(vital.status)}`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {vital.status}
                          </motion.span>
                        </div>
                      </motion.div>
                    ))}
                    
                    {vitals.length === 0 && (
                      <motion.div 
                        className="text-center py-8 text-foreground-muted"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No vital signs recorded yet</p>
                        <p className="text-sm">Start by logging your blood pressure or weight</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Vitals Charts for Mobile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
            >
              <VitalsChart type="blood_pressure" className="shadow-lg" />
              <VitalsChart type="weight" className="shadow-lg" />
            </motion.div>
          </div>

          {/* Sidebar with better mobile spacing */}
          <div className="space-y-6">
            {/* Today's Summary - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span>Today's Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Vitals</span>
                    </div>
                    <span className="text-green-600 font-semibold">Normal</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Next Appointment</span>
                    </div>
                    <span className="text-blue-600 font-semibold text-sm">Dec 15</span>
                  </motion.div>
                  
                  <motion.div 
                    className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Days to Due</span>
                    </div>
                    <span className="text-purple-600 font-semibold">84</span>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Emergency Button - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="border-red-200 shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="text-red-600">Emergency Contact</CardTitle>
                  <CardDescription>Get immediate help when you need it</CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleEmergencyAlert}
                      className="w-full bg-red-500 hover:bg-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                      size="lg"
                    >
                      <AlertTriangle className="h-5 w-5 mr-2" />
                      Emergency Alert
                    </Button>
                  </motion.div>
                  <p className="text-xs text-center text-red-600 mt-2">
                    This will immediately notify your healthcare provider
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Enhanced Vitals Form Modal */}
      <AnimatePresence>
        {showVitalsForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowVitalsForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-surface rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Log Vital Signs</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowVitalsForm(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleVitalSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={vitalForm.type}
                      onChange={(e) => setVitalForm({...vitalForm, type: e.target.value as any})}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="blood_pressure">Blood Pressure</option>
                      <option value="weight">Weight</option>
                      <option value="glucose">Glucose</option>
                    </select>
                  </div>

                  {vitalForm.type === 'blood_pressure' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Systolic</label>
                        <Input
                          type="number"
                          placeholder="120"
                          value={vitalForm.systolic}
                          onChange={(e) => setVitalForm({...vitalForm, systolic: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Diastolic</label>
                        <Input
                          type="number"
                          placeholder="80"
                          value={vitalForm.diastolic}
                          onChange={(e) => setVitalForm({...vitalForm, diastolic: e.target.value})}
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
                        onChange={(e) => setVitalForm({...vitalForm, weight: e.target.value})}
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
                        onChange={(e) => setVitalForm({...vitalForm, glucose: e.target.value})}
                      />
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowVitalsForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      Save Vital
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
          <ChatAssistant
            onClose={() => setShowChat(false)}
          />
        )}
      </AnimatePresence>

      {/* Appointments Modal */}
      <AnimatePresence>
        {showAppointments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAppointments(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Appointments</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAppointments(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-foreground-muted mb-4">This is a placeholder for your upcoming appointments. Scheduling and details will be available soon.</p>
              <Button className="w-full" onClick={() => setShowAppointments(false)}>Close</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Modal */}
      <AnimatePresence>
        {showEmergencyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowEmergencyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center"
              onClick={e => e.stopPropagation()}
            >
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-2 animate-pulse" />
              <h2 className="text-xl font-bold text-red-600 mb-2">Emergency Alert Sent!</h2>
              <p className="text-sm text-foreground mb-4">Your details have been sent to your healthcare provider. If this is a life-threatening emergency, call your emergency contact now.</p>
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white mb-2 flex items-center justify-center"
                size="lg"
                onClick={() => window.open('tel:911')}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call Emergency Contact
              </Button>
              <Button variant="outline" className="w-full" onClick={() => setShowEmergencyModal(false)}>
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
