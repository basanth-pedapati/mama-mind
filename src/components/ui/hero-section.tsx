import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles } from "lucide-react"
import Link from "next/link"

interface HeroSectionProps {
  badge?: {
    icon?: React.ComponentType<{ className?: string }>
    text: string
  }
  title: {
    main: string
    highlight: string
  }
  description: string
  primaryAction: {
    text: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
  secondaryAction?: {
    text: string
    href: string
    icon?: React.ComponentType<{ className?: string }>
  }
  stats?: Array<{
    number: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }>
}

export function HeroSection({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats
}: HeroSectionProps) {
  return (
    <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-accent/10 rounded-full blur-xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" as const }}
          className="text-center"
        >
          {/* Badge */}
          {badge && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center space-x-2 bg-accent/20 text-secondary px-4 py-2 rounded-full mb-8 border border-accent/30 hover:bg-accent/30 transition-colors"
            >
              {badge.icon && <badge.icon className="h-4 w-4 text-accent" />}
              <span className="text-sm font-medium">{badge.text}</span>
            </motion.div>
          )}
          
          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-primary block"
            >
              {title.highlight}
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="text-secondary block"
            >
              {title.main}
            </motion.span>
          </h1>
          
          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
          >
            {description}
          </motion.p>
          
          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href={primaryAction.href}>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-secondary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                {primaryAction.icon && (
                  <primaryAction.icon className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                )}
                {primaryAction.text}
              </Button>
            </Link>
            
            {secondaryAction && (
              <Link href={secondaryAction.href}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-secondary text-secondary hover:bg-secondary hover:text-surface transition-all duration-300 hover:scale-105 group"
                >
                  {secondaryAction.icon && (
                    <secondaryAction.icon className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                  )}
                  {secondaryAction.text}
                </Button>
              </Link>
            )}
          </motion.div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.2 }}
                className="text-center bg-surface/80 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-3xl font-bold text-secondary mb-1">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
