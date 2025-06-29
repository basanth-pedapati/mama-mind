'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  User, 
  MapPin,
  Edit,
  Save,
  X,
  Stethoscope,
  Award,
  GraduationCap,
  Building,
  CheckCircle,
  Star,
  BarChart3,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DoctorProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: number;
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications: string[];
  languages: string[];
  officeHours: {
    day: string;
    hours: string;
  }[];
  officeLocation: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  insuranceAccepted: string[];
  patientCapacity: number;
  currentPatients: number;
}

const mockProfile: DoctorProfile = {
  id: 'DOC001',
  firstName: 'Michelle',
  lastName: 'Carter',
  email: 'dr.carter@mamamind.com',
  phone: '+1 (555) 987-6543',
  dateOfBirth: '1985-07-22',
  licenseNumber: 'MD123456',
  specialization: 'Obstetrics & Gynecology',
  yearsOfExperience: 12,
  education: [
    {
      degree: 'Doctor of Medicine (MD)',
      institution: 'Harvard Medical School',
      year: '2012'
    },
    {
      degree: 'Bachelor of Science in Biology',
      institution: 'Stanford University',
      year: '2008'
    }
  ],
  certifications: [
    'Board Certified - American Board of Obstetrics and Gynecology',
    'Fellowship in Maternal-Fetal Medicine',
    'Advanced Life Support in Obstetrics (ALSO)',
    'Neonatal Resuscitation Program (NRP)'
  ],
  languages: ['English', 'Spanish', 'French'],
  officeHours: [
    { day: 'Monday', hours: '8:00 AM - 5:00 PM' },
    { day: 'Tuesday', hours: '8:00 AM - 5:00 PM' },
    { day: 'Wednesday', hours: '8:00 AM - 5:00 PM' },
    { day: 'Thursday', hours: '8:00 AM - 5:00 PM' },
    { day: 'Friday', hours: '8:00 AM - 3:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 12:00 PM' },
    { day: 'Sunday', hours: 'Emergency Only' }
  ],
  officeLocation: {
    address: '123 Medical Center Drive',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102'
  },
  emergencyContact: {
    name: 'Dr. Robert Carter',
    phone: '+1 (555) 123-4567',
    relationship: 'Spouse'
  },
  insuranceAccepted: [
    'Blue Cross Blue Shield',
    'Aetna',
    'Cigna',
    'UnitedHealth Group',
    'Kaiser Permanente'
  ],
  patientCapacity: 200,
  currentPatients: 156
};

export default function DoctorProfilePage() {
  const [profile, setProfile] = useState<DoctorProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<DoctorProfile>(mockProfile);

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

  const getAvailabilityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage < 70) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage < 90) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                      <Stethoscope className="h-10 w-10 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-white"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">
                      Dr. {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-lg text-primary font-medium">
                      {profile.specialization}
                    </p>
                    <p className="text-muted-foreground">
                      License: {profile.licenseNumber} • {profile.yearsOfExperience} years experience
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-primary border-primary">
                        <Award className="h-3 w-3 mr-1" />
                        Board Certified
                      </Badge>
                      <Badge variant="outline" className="text-secondary border-secondary">
                        <Star className="h-3 w-3 mr-1" />
                        4.9/5 Rating
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
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
                  <label className="text-sm font-medium text-muted-foreground">License Number</label>
                  <p className="text-foreground font-medium">{profile.licenseNumber}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Languages</label>
                  <div className="mt-2 space-y-1">
                    {profile.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Practice Statistics */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Practice Statistics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Patient Capacity</span>
                  <span className="font-medium">{profile.patientCapacity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Patients</span>
                  <span className="font-medium">{profile.currentPatients}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Availability</span>
                  <Badge className={getAvailabilityColor(profile.currentPatients, profile.patientCapacity)}>
                    {Math.round((profile.currentPatients / profile.patientCapacity) * 100)}% Full
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Education & Certifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>Education & Certifications</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Education</h4>
                  <div className="space-y-3">
                    {profile.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <p className="font-medium text-foreground">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <p className="text-xs text-muted-foreground">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-3">Certifications</h4>
                  <div className="space-y-2">
                    {profile.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-foreground">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Office Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-primary" />
                  <span>Office Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">Location</h4>
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-foreground">{profile.officeLocation.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.officeLocation.city}, {profile.officeLocation.state} {profile.officeLocation.zipCode}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-3">Office Hours</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {profile.officeHours.map((schedule, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className="font-medium text-foreground">{schedule.day}</span>
                        <span className="text-muted-foreground">{schedule.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-foreground mb-3">Insurance Accepted</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.insuranceAccepted.map((insurance, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {insurance}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <span>Emergency Contact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-foreground font-medium">{profile.emergencyContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-foreground font-medium">{profile.emergencyContact.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                    <p className="text-foreground font-medium">{profile.emergencyContact.relationship}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 