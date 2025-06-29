'use client';

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface VitalData {
  date: string;
  systolic: number;
  diastolic: number;
  weight: number;
  glucose?: number;
}

interface VitalsChartProps {
  data?: VitalData[];
  type: 'blood_pressure' | 'weight' | 'glucose';
  className?: string;
}

// Sample data for demo
const sampleData: VitalData[] = [
  { date: '2024-01-01', systolic: 110, diastolic: 70, weight: 65.2 },
  { date: '2024-01-07', systolic: 115, diastolic: 72, weight: 65.8 },
  { date: '2024-01-14', systolic: 118, diastolic: 75, weight: 66.5 },
  { date: '2024-01-21', systolic: 120, diastolic: 78, weight: 67.1 },
  { date: '2024-01-28', systolic: 122, diastolic: 80, weight: 67.8 },
  { date: '2024-02-04', systolic: 125, diastolic: 82, weight: 68.5 },
  { date: '2024-02-11', systolic: 118, diastolic: 76, weight: 69.2 },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

const getStatusColor = (value: number, type: string, isSecondary = false) => {
  if (type === 'blood_pressure') {
    if (isSecondary) { // diastolic
      if (value < 60) return '#ef4444'; // red
      if (value > 90) return '#f59e0b'; // amber
      return '#10b981'; // green
    } else { // systolic
      if (value < 90) return '#ef4444'; // red
      if (value > 140) return '#f59e0b'; // amber
      return '#10b981'; // green
    }
  } else if (type === 'weight') {
    return '#8ECAD1'; // primary teal
  }
  return '#10b981';
};

export default function VitalsChart({ data = sampleData, type, className = '' }: VitalsChartProps) {
  const renderBloodPressureChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          stroke="#64748b"
          fontSize={12}
        />
        <YAxis 
          domain={['dataMin - 10', 'dataMax + 10']}
          stroke="#64748b"
          fontSize={12}
        />
        <Tooltip 
          formatter={(value: number, name: string) => [
            `${value} mmHg`,
            name === 'systolic' ? 'Systolic' : 'Diastolic'
          ]}
          labelFormatter={(label) => `Date: ${formatDate(label)}`}
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="systolic" 
          stroke="#ef4444" 
          strokeWidth={2}
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
        />
        <Line 
          type="monotone" 
          dataKey="diastolic" 
          stroke="#3b82f6" 
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderWeightChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatDate}
          stroke="#64748b"
          fontSize={12}
        />
        <YAxis 
          domain={['dataMin - 2', 'dataMax + 2']}
          stroke="#64748b"
          fontSize={12}
        />
        <Tooltip 
          formatter={(value: number) => [`${value} kg`, 'Weight']}
          labelFormatter={(label) => `Date: ${formatDate(label)}`}
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="weight" 
          stroke="#8ECAD1" 
          fill="#8ECAD1"
          fillOpacity={0.3}
          strokeWidth={2}
          dot={{ fill: '#8ECAD1', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#8ECAD1', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );

  const getChartTitle = () => {
    switch (type) {
      case 'blood_pressure': return 'Blood Pressure Trends';
      case 'weight': return 'Weight Progress';
      case 'glucose': return 'Glucose Levels';
      default: return 'Vitals Trends';
    }
  };

  const getChartDescription = () => {
    switch (type) {
      case 'blood_pressure': return 'Monitor your blood pressure over time';
      case 'weight': return 'Track healthy weight gain during pregnancy';
      case 'glucose': return 'Keep glucose levels within healthy ranges';
      default: return 'Track your vital signs';
    }
  };

  const getTrendInfo = () => {
    if (data.length < 2) return null;
    
    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    let currentValue, previousValue, unit;
    
    if (type === 'blood_pressure') {
      currentValue = latest.systolic;
      previousValue = previous.systolic;
      unit = 'mmHg';
    } else if (type === 'weight') {
      currentValue = latest.weight;
      previousValue = previous.weight;
      unit = 'kg';
    } else {
      return null;
    }
    
    const change = currentValue - previousValue;
    const isIncrease = change > 0;
    
    return {
      change: Math.abs(change).toFixed(1),
      isIncrease,
      unit,
      percentage: ((Math.abs(change) / previousValue) * 100).toFixed(1)
    };
  };

  const trendInfo = getTrendInfo();

  return (
    <Card className={`bg-surface/80 backdrop-blur-sm border-border/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-lg text-secondary">{getChartTitle()}</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {getChartDescription()}
              </CardDescription>
            </div>
          </div>
          
          {trendInfo && (
            <div className="flex items-center space-x-1 text-sm">
              {trendInfo.isIncrease ? (
                <TrendingUp className="h-4 w-4 text-amber-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-green-500" />
              )}
              <span className={trendInfo.isIncrease ? 'text-amber-600' : 'text-green-600'}>
                {trendInfo.isIncrease ? '+' : '-'}{trendInfo.change} {trendInfo.unit}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {type === 'blood_pressure' && renderBloodPressureChart()}
        {type === 'weight' && renderWeightChart()}
        
        {type === 'blood_pressure' && (
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-muted-foreground">Systolic</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-muted-foreground">Diastolic</span>
            </div>
          </div>
        )}
        
        <div className="mt-3 text-xs text-muted-foreground">
          Last updated: {formatDate(data[data.length - 1]?.date || new Date().toISOString())}
        </div>
      </CardContent>
    </Card>
  );
}
