import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Contraction {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  frequency?: number; // seconds since last contraction
}

interface ContractionTimerProps {
  className?: string;
}

const ContractionTimer: React.FC<ContractionTimerProps> = ({ className = '' }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [contractions, setContractions] = useState<Contraction[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
        setCurrentTime(elapsed);
      }, 100); // Update every 100ms for smooth display
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, startTime]);

  // Format time to mm:ss
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Start contraction
  const startContraction = useCallback(() => {
    const now = new Date();
    setStartTime(now);
    setCurrentTime(0);
    setIsActive(true);
  }, []);

  // End contraction
  const endContraction = useCallback(() => {
    if (!startTime) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
    
    // Calculate frequency (time since last contraction ended)
    let frequency: number | undefined;
    if (contractions.length > 0) {
      const lastContraction = contractions[contractions.length - 1];
      frequency = Math.floor((startTime.getTime() - lastContraction.endTime.getTime()) / 1000);
    }

    const newContraction: Contraction = {
      id: Date.now().toString(),
      startTime,
      endTime,
      duration,
      frequency
    };

    setContractions(prev => [...prev, newContraction]);
    setIsActive(false);
    setCurrentTime(0);
    setStartTime(null);
  }, [startTime, contractions]);

  // Clear all contractions
  const clearHistory = useCallback(() => {
    setContractions([]);
  }, []);

  // Animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    pressed: { scale: 0.95 },
    hover: { scale: 1.02 }
  };

  const contractionVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const timerVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  };

  return (
    <div className={`max-w-md mx-auto p-6 bg-surface rounded-2xl shadow-md ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-primary mb-2">Contraction Timer</h2>
        <p className="text-secondary text-sm font-body">Track your contractions during labor</p>
      </div>

      {/* Main Timer Display */}
      <div className="text-center mb-8">
        <AnimatePresence mode="wait">
          {isActive ? (
            <motion.div
              key="active-timer"
              variants={timerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Current Timer */}
              <div className="bg-accent/20 rounded-xl p-6 border-2 border-accent/40">
                <div className="text-4xl font-mono font-bold text-accent mb-2">
                  {formatTime(currentTime)}
                </div>
                <div className="text-accent text-sm font-body font-medium">
                  Contraction in progress...
                </div>
              </div>

              {/* Pulsing indicator */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-4 h-4 bg-accent rounded-full mx-auto"
              />
            </motion.div>
          ) : (
            <motion.div
              key="idle-timer"
              variants={timerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-surface rounded-xl p-6 border-2 border-surface"
            >
              <div className="text-4xl font-mono font-bold text-secondary mb-2">
                00:00
              </div>
              <div className="text-secondary text-sm font-body">
                Ready to time contraction
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Buttons */}
      <div className="space-y-3 mb-8">
        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="pressed"
          onClick={isActive ? endContraction : startContraction}
          disabled={false}
          className={`
            w-full py-4 px-6 rounded-xl font-heading font-semibold text-lg transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-offset-2
            ${isActive 
              ? 'bg-error hover:bg-error/90 text-white focus:ring-error/30 shadow-md' 
              : 'bg-primary hover:bg-primary/90 text-white focus:ring-primary/30 shadow-md'
            }
          `}
          aria-label={isActive ? 'End contraction' : 'Start contraction'}
        >
          {isActive ? 'End Contraction' : 'Start Contraction'}
        </motion.button>

        {contractions.length > 0 && (
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="pressed"
            onClick={clearHistory}
            className="
              w-full py-2 px-4 rounded-lg font-body font-medium text-secondary 
              bg-surface hover:bg-surface/80 transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-primary/10 focus:ring-offset-2
            "
            aria-label="Clear contraction history"
          >
            Clear History
          </motion.button>
        )}
      </div>

      {/* Contraction History */}
      {contractions.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-heading font-semibold text-primary mb-4">Recent Contractions</h3>
          <div className="space-y-3">
            <AnimatePresence>
              {contractions.slice(-5).reverse().map((c) => (
                <motion.div
                  key={c.id}
                  variants={contractionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="bg-background rounded-lg p-4 border border-surface"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-secondary font-body text-sm">Duration</span>
                    <span className="text-primary font-heading font-bold text-lg">{formatTime(c.duration)}</span>
                  </div>
                  {c.frequency !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-secondary font-body text-xs">Since last</span>
                      <span className="text-accent font-heading font-semibold text-base">{formatTime(c.frequency)}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractionTimer;
