import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ComponentType<{ className?: string }>
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon: Icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false)

    return (
      <div className="w-full">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </motion.label>
        )}
        
        <div className="relative">
          {Icon && (
            <motion.div
              animate={{
                color: isFocused ? "rgb(var(--primary))" : "rgb(var(--foreground-muted))",
                scale: isFocused ? 1.1 : 1
              }}
              transition={{ duration: 0.2 }}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          )}
          
          <motion.div
            whileFocus={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <input
              type={type}
              className={cn(
                "flex h-12 w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground",
                "placeholder:text-muted-foreground",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "hover:border-primary/50",
                "disabled:cursor-not-allowed disabled:opacity-50",
                Icon && "pl-12",
                error && "border-error focus:border-error focus:ring-error/20",
                className
              )}
              ref={ref}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              {...props}
            />
          </motion.div>
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-error"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
