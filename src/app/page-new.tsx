'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Brain, Users, TrendingUp, Bell } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const features = [
  {
    icon: Heart,
    title: "Comprehensive Vitals Tracking",
    description: "Monitor blood pressure, weight, heart rate, and more with intelligent anomaly detection."
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get personalized recommendations and answers to your pregnancy questions with our AI chatbot."
  },
  {
    icon: Shield,
    title: "Real-time Alerts",
    description: "Receive instant notifications for health anomalies and important milestones."
  },
  {
    icon: Users,
    title: "Healthcare Provider Portal",
    description: "Seamless communication between patients and doctors with role-based access."
  },
  {
    icon: TrendingUp,
    title: "Progress Analytics",
    description: "Visualize your pregnancy journey with detailed charts and progress tracking."
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Never miss important checkups, medications, or health reminders."
  }
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">Mama Mind</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-primary">Comprehensive</span>{" "}
              <span className="text-foreground">Maternity Care</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              AI-powered platform that empowers expecting mothers and healthcare providers 
              with intelligent monitoring, personalized insights, and seamless care coordination.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Your Journey
                </Button>
              </Link>
              <Link href="/auth/register?role=doctor">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Healthcare Provider Portal
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Everything You Need for Maternal Health</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform combines cutting-edge technology with compassionate care
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <feature.icon className="h-12 w-12 text-primary mb-4" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Pregnancy Experience?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of expecting mothers and healthcare providers who trust Mama Mind 
              for comprehensive maternity care.
            </p>
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Heart className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Mama Mind</span>
            </div>
            <p className="text-muted-foreground text-center md:text-right">
              © 2024 Mama Mind. Empowering maternal health with technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
