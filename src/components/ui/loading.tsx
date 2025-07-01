import { motion } from "framer-motion"
import { Heart } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  message?: string
}

export function LoadingSpinner({ size = "md", message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8", 
    lg: "h-12 w-12"
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
        }}
        className="relative"
      >
        <Heart className={`${sizeClasses[size]} text-primary`} />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 ${sizeClasses[size]} border-2 border-primary/30 rounded-full`}
        />
      </motion.div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-secondary text-center font-body"
        >
          {message}
        </motion.p>
      )}
    </div>
  )
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="relative mx-auto mb-6"
        >
          <Heart className="h-16 w-16 text-primary" />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 h-16 w-16 border-4 border-primary/20 rounded-full"
          />
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute inset-0 h-16 w-16 border-2 border-accent/30 rounded-full"
          />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-heading text-primary mb-2"
        >
          Mama Mind
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-secondary font-body"
        >
          Loading your personalized care experience...
        </motion.p>
      </motion.div>
    </div>
  )
}

export function Loading() {
  return (
    <div className="loader-baby">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce">
        <circle cx="32" cy="32" r="30" fill="#8ECAD1" stroke="#466D77" strokeWidth="4" />
        <ellipse cx="32" cy="40" rx="12" ry="8" fill="#fff" />
        <circle cx="24" cy="28" r="3" fill="#1E2D32" />
        <circle cx="40" cy="28" r="3" fill="#1E2D32" />
        <path d="M28 44 Q32 48 36 44" stroke="#1E2D32" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="32" cy="20" rx="8" ry="4" fill="#fff" opacity="0.3" />
      </svg>
    </div>
  );
}
