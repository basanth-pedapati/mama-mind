import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, XCircle, Info, X } from "lucide-react"
import { useState, useEffect } from "react"

type ToastType = "success" | "error" | "warning" | "info"

interface ToastProps {
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose?: () => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const styles = {
  success: {
    icon: "text-success",
    bg: "bg-success/10 border-success/20",
    title: "text-success"
  },
  error: {
    icon: "text-error",
    bg: "bg-error/10 border-error/20", 
    title: "text-error"
  },
  warning: {
    icon: "text-warning",
    bg: "bg-warning/10 border-warning/20",
    title: "text-warning"
  },
  info: {
    icon: "text-primary",
    bg: "bg-primary/10 border-primary/20",
    title: "text-primary"
  }
}

export function Toast({ type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const Icon = icons[type]
  const style = styles[type]

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => onClose?.(), 300)
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onClose?.(), 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`
            fixed top-4 right-4 z-50 max-w-sm w-full
            ${style.bg} border rounded-lg p-4 shadow-lg backdrop-blur-sm
            hover:shadow-xl transition-shadow duration-200
          `}
        >
          <div className="flex items-start space-x-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.3, ease: "easeOut" }}
            >
              <Icon className={`h-5 w-5 ${style.icon} mt-0.5`} />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <motion.h4
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className={`text-sm font-semibold ${style.title}`}
              >
                {title}
              </motion.h4>
              
              {message && (
                <motion.p
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="text-sm text-muted-foreground mt-1 leading-relaxed"
                >
                  {message}
                </motion.p>
              )}
            </div>
            
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25, duration: 0.2 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-surface-hover"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </div>
          
          {/* Progress bar for duration */}
          {duration > 0 && (
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`absolute bottom-0 left-0 h-1 ${style.icon.includes('success') ? 'bg-success' : style.icon.includes('error') ? 'bg-error' : style.icon.includes('warning') ? 'bg-warning' : 'bg-primary'} rounded-b-lg`}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Toast container for managing multiple toasts
export function ToastContainer({ toasts }: { toasts: (ToastProps & { id: string })[] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast, index) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: index * 80, // Stack toasts vertically
              scale: 1 
            }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Toast {...toast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
