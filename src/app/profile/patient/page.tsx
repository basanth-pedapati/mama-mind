'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  User, 
  Edit,
  Save,
  X,
  Baby,
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodType: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  pregnancyInfo: {
    lastMenstrualPeriod: string;
    dueDate: string;
    gestationalWeek: number;
    highRiskFactors: string[];
  };
  medicalHistory: {
    allergies: string[];
    conditions: string[];
    medications: string[];
  };
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
  };
}

const mockProfile: PatientProfile = {
  id: '1',
  firstName: 'Sarah',
  lastName: 'Johnson',
  email: 'sarah.johnson@email.com',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1996-03-15',
  bloodType: 'O+',
  emergencyContact: {
    name: 'Michael Johnson',
    phone: '+1 (555) 987-6543',
    relationship: 'Spouse'
  },
  pregnancyInfo: {
    lastMenstrualPeriod: '2024-01-15',
    dueDate: '2024-10-22',
    gestationalWeek: 28,
    highRiskFactors: ['Gestational diabetes', 'Advanced maternal age']
  },
  medicalHistory: {
    allergies: ['Penicillin', 'Shellfish'],
    conditions: ['Asthma', 'Hypothyroidism'],
    medications: ['Levothyroxine 50mcg daily', 'Prenatal vitamins']
  },
  insurance: {
    provider: 'Blue Cross Blue Shield',
    policyNumber: 'BCBS123456789',
    groupNumber: 'GRP987654321'
  }
};

export default function PatientProfilePage() {
  const [profile, setProfile] = useState<PatientProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<PatientProfile>(mockProfile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully! 📝');
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
              <Badge variant="secondary">Patient Portal</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <X className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-accent rounded-full border-2 border-white"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">
                      {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-muted-foreground">
                      Patient ID: {profile.id} • Age: {calculateAge(profile.dateOfBirth)} years
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-primary border-primary">
                        <Baby className="h-3 w-3 mr-1" />
                        Week {profile.pregnancyInfo.gestationalWeek}
                      </Badge>
                      <Badge variant="outline" className="text-secondary border-secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        {profile.bloodType}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-primary" />
                  <span>Personal Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">First Name</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Name</label>
                    {isEditing ? (
                      <Input
                        value={editedProfile.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{profile.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{profile.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{profile.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedProfile.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground font-medium">
                      {new Date(profile.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pregnancy Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Baby className="h-5 w-5 text-primary" />
                  <span>Pregnancy Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Due Date</label>
                    <p className="text-foreground font-medium">
                      {new Date(profile.pregnancyInfo.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gestational Week</label>
                    <p className="text-foreground font-medium">
                      Week {profile.pregnancyInfo.gestationalWeek}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Menstrual Period</label>
                  <p className="text-foreground font-medium">
                    {new Date(profile.pregnancyInfo.lastMenstrualPeriod).toLocaleDateString()}
                  </p>
                </div>
                
                {profile.pregnancyInfo.highRiskFactors.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Risk Factors</label>
                    <div className="mt-2 space-y-1">
                      {profile.pregnancyInfo.highRiskFactors.map((factor, index) => (
                        <Badge key={index} variant="error" className="mr-2">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.emergencyContact.name}
                      onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{profile.emergencyContact.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.emergencyContact.phone}
                      onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{profile.emergencyContact.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.emergencyContact.relationship}
                      onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{profile.emergencyContact.relationship}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Medical History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <span>Medical History</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Allergies</label>
                  <div className="mt-2 space-y-1">
                    {profile.medicalHistory.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline" className="mr-2 bg-red-50 text-red-700 border-red-200">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Medical Conditions</label>
                  <div className="mt-2 space-y-1">
                    {profile.medicalHistory.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="mr-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Current Medications</label>
                  <div className="mt-2 space-y-1">
                    {profile.medicalHistory.medications.map((medication, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-foreground">{medication}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Insurance Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <span>Insurance Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Provider</label>
                  <p className="text-foreground font-medium">{profile.insurance.provider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Policy Number</label>
                  <p className="text-foreground font-medium">{profile.insurance.policyNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Group Number</label>
                  <p className="text-foreground font-medium">{profile.insurance.groupNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 