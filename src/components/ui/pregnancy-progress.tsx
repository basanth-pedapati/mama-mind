import { motion } from "framer-motion"
import { Calendar, Baby, Heart, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PregnancyProgressProps {
  dueDate: string | Date
  lastMenstrualPeriod: string | Date
  babyName?: string
  nextAppointment?: string
  vitalsStatus?: "normal" | "warning" | "critical"
}

export function PregnancyProgress({
  dueDate,
  lastMenstrualPeriod,
  babyName = "Baby",
  nextAppointment,
  vitalsStatus = "normal"
}: PregnancyProgressProps) {
  // Calculate progress
  const totalDays = 280;
  const due = new Date(dueDate);
  const lmp = new Date(lastMenstrualPeriod);
  const today = new Date();
  const daysElapsed = Math.max(0, Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const progressPercentage = Math.min(Math.max((daysElapsed / totalDays) * 100, 0), 100);
  const weeksCurrent = Math.floor(daysElapsed / 7);
  const weeksTotal = 40;
  const trimester = weeksCurrent < 13 ? 1 : weeksCurrent < 27 ? 2 : 3;

  const trimesterInfo = {
    1: { name: "First Trimester", color: "text-accent", bg: "bg-accent" },
    2: { name: "Second Trimester", color: "text-primary", bg: "bg-primary" },
    3: { name: "Third Trimester", color: "text-secondary", bg: "bg-secondary" }
  };

  const vitalsColors = {
    normal: "text-success",
    warning: "text-warning",
    critical: "text-error"
  };

  return (
    <Card className="bg-gradient-soft border-primary/20 hover:border-primary/40 transition-all duration-300 hover-lift">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-secondary flex items-center space-x-2">
            <Baby className="h-5 w-5 text-primary" />
            <span>Pregnancy Journey</span>
          </CardTitle>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${vitalsColors[vitalsStatus]} animate-pulse-soft`}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-secondary font-body">Week {weeksCurrent} of {weeksTotal}</span>
            <span className={`text-sm font-medium ${trimesterInfo[trimester].color}`}>{trimesterInfo[trimester].name}</span>
          </div>
          <div className="relative">
            {/* Progress Bar Container */}
            <div className="h-6 bg-surface-light rounded-full overflow-visible flex items-center border border-surface shadow-sm relative">
              {/* Progress Fill */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-secondary shadow-lg glow-primary transition-all duration-500"
                style={{ boxShadow: '0 0 12px 2px rgba(142,202,209,0.18), 0 2px 8px 0 rgba(70,109,119,0.10)' }}
              />
              {/* Today Marker */}
              <div
                className="absolute top-[-4px] h-7 w-2 bg-accent border-2 border-secondary rounded-lg shadow-md z-10"
                style={{ left: `calc(${progressPercentage}% - 6px)` }}
                aria-label="Today marker"
              />
              {/* Animated highlight overlay */}
              <motion.div
                animate={{ x: [0, 24, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-0 top-0 h-full w-8 bg-white/20 rounded-full blur-md pointer-events-none"
                style={{ opacity: 0.7 }}
              />
            </div>
            {/* Bar Labels */}
            <div className="mt-2 flex flex-col sm:flex-row sm:justify-between items-center text-xs text-secondary font-body">
              <div className="flex-1 text-left">Start</div>
              <div className="flex-1 text-center">
                <span className="text-2xl font-bold text-primary font-heading drop-shadow-sm">{Math.round(progressPercentage)}%</span>
                <span className="text-sm text-secondary ml-1">complete</span>
              </div>
              <div className="flex-1 text-right">Due</div>
            </div>
            <div className="text-xs text-secondary font-body text-center mt-1">
              <span className="font-semibold text-primary">{daysRemaining} days left</span> (Due: {due.toLocaleDateString()})
            </div>
          </div>
        </div>
        {/* Key Info */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-surface/50 rounded-lg p-3 border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center space-x-2 mb-1">
              <Heart className="h-4 w-4 text-primary animate-pulse-soft" />
              <span className="text-xs text-muted-foreground">Baby Status</span>
            </div>
            <p className="font-semibold text-secondary">{babyName} is growing well</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-surface/50 rounded-lg p-3 border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className={`h-4 w-4 ${vitalsColors[vitalsStatus]}`} />
              <span className="text-xs text-muted-foreground">Vitals</span>
            </div>
            <p className={`font-semibold capitalize ${vitalsColors[vitalsStatus]}`}>{vitalsStatus}</p>
          </motion.div>
        </div>
        {/* Next Appointment */}
        {nextAppointment && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-accent/10 rounded-lg p-3 border border-accent/20"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-secondary">Next Appointment</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{nextAppointment}</p>
          </motion.div>
        )}
        {/* Milestones */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-secondary">Recent Milestones</h4>
          <div className="space-y-1">
            {[
              { week: weeksCurrent - 1, milestone: "Baby's movements are stronger" },
              { week: weeksCurrent - 2, milestone: "Hearing is fully developed" }
            ].map((milestone, index) => (
              <motion.div
                key={milestone.week}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center space-x-3 text-sm"
              >
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
                <span className="text-muted-foreground">Week {milestone.week}:</span>
                <span className="text-foreground">{milestone.milestone}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
