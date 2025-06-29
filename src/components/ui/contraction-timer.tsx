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
    <div className={`max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contraction Timer</h2>
        <p className="text-gray-600 text-sm">Track your contractions during labor</p>
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
              <div className="bg-pink-50 rounded-xl p-6 border-2 border-pink-200">
                <div className="text-4xl font-mono font-bold text-pink-600 mb-2">
                  {formatTime(currentTime)}
                </div>
                <div className="text-pink-500 text-sm font-medium">
                  Contraction in progress...
                </div>
              </div>

              {/* Pulsing indicator */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-4 h-4 bg-pink-400 rounded-full mx-auto"
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
              className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
            >
              <div className="text-4xl font-mono font-bold text-gray-400 mb-2">
                00:00
              </div>
              <div className="text-gray-500 text-sm">
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
            w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200
            focus:outline-none focus:ring-4 focus:ring-offset-2
            ${isActive 
              ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-300 shadow-lg shadow-red-200' 
              : 'bg-pink-500 hover:bg-pink-600 text-white focus:ring-pink-300 shadow-lg shadow-pink-200'
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
              w-full py-2 px-4 rounded-lg font-medium text-gray-600 
              bg-gray-100 hover:bg-gray-200 transition-all duration-200
              focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-offset-2
            "
            aria-label="Clear contraction history"
          >
            Clear History
          </motion.button>
        )}
      </div>

      {/* Contractions History */}
      {contractions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Contractions</h3>
            <span className="text-sm text-gray-500">
              {contractions.length} recorded
            </span>
          </div>

          {/* Summary Stats */}
          {contractions.length >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 rounded-lg p-4 border border-blue-200"
            >
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {formatTime(Math.floor(
                      contractions.slice(-5).reduce((sum, c) => sum + c.duration, 0) / 
                      Math.min(contractions.length, 5)
                    ))}
                  </div>
                  <div className="text-xs text-blue-500">Avg Duration</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">
                    {contractions[contractions.length - 1].frequency 
                      ? formatTime(contractions[contractions.length - 1].frequency!) 
                      : '--'
                    }
                  </div>
                  <div className="text-xs text-blue-500">Last Frequency</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Contractions List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <AnimatePresence>
              {contractions.slice(-10).reverse().map((contraction, index) => (
                <motion.div
                  key={contraction.id}
                  variants={contractionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-900">
                          Duration: {formatTime(contraction.duration)}
                        </div>
                        {contraction.frequency && (
                          <div className="text-xs text-gray-500">
                            Frequency: {formatTime(contraction.frequency)}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {contraction.startTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    
                    {/* Intensity indicator based on duration */}
                    <div className="flex space-x-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`
                            w-2 h-6 rounded-full
                            ${contraction.duration >= level * 20 
                              ? level === 1 ? 'bg-green-400' 
                                : level === 2 ? 'bg-yellow-400' 
                                : 'bg-red-400'
                              : 'bg-gray-200'
                            }
                          `}
                          aria-label={`Intensity level ${level}`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {contractions.length > 10 && (
            <div className="text-center text-xs text-gray-400">
              Showing last 10 contractions
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {contractions.length === 0 && !isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            No contractions recorded yet.<br />
            Press &ldquo;Start Contraction&rdquo; when one begins.
          </p>
        </motion.div>
      )}

      {/* Accessibility Instructions */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {isActive && `Contraction timer running: ${formatTime(currentTime)}`}
        {!isActive && contractions.length > 0 && 
          `Last contraction: ${formatTime(contractions[contractions.length - 1].duration)} duration`
        }
      </div>
    </div>
  );
};

export default ContractionTimer;
