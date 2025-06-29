import * as React from "react"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="relative">
        {label && (
          <motion.label
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="block text-sm font-medium text-foreground mb-2"
          >
            {label}
          </motion.label>
        )}
        
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <textarea
            className={cn(
              "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-error focus:border-error focus:ring-error/20",
              className
            )}
            ref={ref}
            {...props}
          />
        </motion.div>
        
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
Textarea.displayName = "Textarea"

export { Textarea }
