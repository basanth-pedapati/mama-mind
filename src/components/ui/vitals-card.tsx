import { motion } from "framer-motion"
import { Heart, Activity, Thermometer, Scale, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface VitalSign {
  id: string
  name: string
  value: string
  unit: string
  status: "normal" | "warning" | "critical"
  trend: "up" | "down" | "stable"
  icon: React.ComponentType<{ className?: string }>
  lastUpdated: string
  normalRange: string
}

interface VitalsCardProps {
  vitals: VitalSign[]
  title?: string
}

export function VitalsCard({ vitals, title = "Current Vitals" }: VitalsCardProps) {
  const statusStyles = {
    normal: {
      bg: "bg-success/10",
      border: "border-success/20",
      text: "text-success",
      indicator: "bg-success"
    },
    warning: {
      bg: "bg-accent/10", 
      border: "border-accent/20",
      text: "text-accent",
      indicator: "bg-accent"
    },
    critical: {
      bg: "bg-error/10",
      border: "border-error/20", 
      text: "text-error",
      indicator: "bg-error"
    }
  }

  const trendIcons = {
    up: TrendingUp,
    down: TrendingDown,
    stable: Minus
  }

  return (
    <Card className="bg-surface border-primary/20 hover:border-primary/40 transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-heading text-secondary flex items-center space-x-2">
          <Activity className="h-5 w-5 text-primary animate-pulse-soft" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vitals.map((vital, index) => {
            const style = statusStyles[vital.status]
            const TrendIcon = trendIcons[vital.trend]
            
            return (
              <motion.div
                key={vital.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`
                  ${style.bg} ${style.border} border rounded-lg p-4 
                  hover:shadow-md transition-all duration-200 group
                `}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={vital.status === "critical" ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <vital.icon className={`h-5 w-5 ${style.text}`} />
                    </motion.div>
                    <span className="text-sm font-body text-secondary">{vital.name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <TrendIcon className={`h-4 w-4 ${style.text}`} />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-2 h-2 rounded-full ${style.indicator}`}
                    />
                  </div>
                </div>
                
                <div className="mb-2">
                  <span className="text-2xl font-heading font-bold text-primary">{vital.value}</span>
                  <span className="text-sm font-body text-secondary ml-1">{vital.unit}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-secondary font-body">Normal: {vital.normalRange}</span>
                    <span className={`font-medium capitalize font-body ${style.text}`}>
                      {vital.status}
                    </span>
                  </div>
                  <div className="text-xs text-secondary font-body">
                    Updated {vital.lastUpdated}
                  </div>
                </div>
                
                {/* Progress bar for normal range visualization */}
                <div className="mt-3">
                  <div className="h-1 bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: vital.status === "normal" ? "80%" : vital.status === "warning" ? "60%" : "30%" }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`h-full ${style.indicator} rounded-full`}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        
        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6 p-3 bg-surface rounded-lg border border-border/50"
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary font-body">Overall Status</span>
            <span className={`font-medium font-body ${
              vitals.every(v => v.status === "normal") ? "text-success" :
              vitals.some(v => v.status === "critical") ? "text-error" : "text-accent"
            }`}>
              {vitals.every(v => v.status === "normal") ? "All Normal" :
               vitals.some(v => v.status === "critical") ? "Needs Attention" : "Monitor Closely"}
            </span>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  )
}

// Sample vital signs data
export const sampleVitals: VitalSign[] = [
  {
    id: "bp",
    name: "Blood Pressure", 
    value: "120/80",
    unit: "mmHg",
    status: "normal",
    trend: "stable",
    icon: Heart,
    lastUpdated: "2 hours ago",
    normalRange: "90/60 - 140/90"
  },
  {
    id: "hr",
    name: "Heart Rate",
    value: "72",
    unit: "bpm", 
    status: "normal",
    trend: "down",
    icon: Activity,
    lastUpdated: "1 hour ago",
    normalRange: "60 - 100"
  },
  {
    id: "temp",
    name: "Temperature",
    value: "98.6",
    unit: "\u00b0F",
    status: "normal", 
    trend: "stable",
    icon: Thermometer,
    lastUpdated: "3 hours ago",
    normalRange: "97.0 - 99.5"
  },
  {
    id: "weight",
    name: "Weight",
    value: "145",
    unit: "lbs",
    status: "normal",
    trend: "up", 
    icon: Scale,
    lastUpdated: "1 day ago",
    normalRange: "Pre-pregnancy + 25-35"
  }
]
