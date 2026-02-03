"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, MapPin, AlertTriangle } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI-Based Safety Scoring",
    description: "Our advanced AI analyzes multiple factors including crime data, lighting, foot traffic, and community reports to provide real-time safety scores for every route.",
  },
  {
    icon: MapPin,
    title: "Live Location Tracking",
    description: "Share your live location with trusted contacts during your journey. They can monitor your route in real-time and get alerts if you deviate unexpectedly.",
  },
  {
    icon: AlertTriangle,
    title: "One-Tap SOS Emergency Alert",
    description: "In case of emergency, a single tap sends your location to emergency contacts and local authorities. Quick, discreet, and potentially life-saving.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <span className="text-sm font-medium text-primary">Features</span>
          </div>
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Safety Features That Empower You
          </h2>
          <p className="text-pretty text-muted-foreground">
            Built with cutting-edge technology to ensure your safety at every step of your journey.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group relative overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            >
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
