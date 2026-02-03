"use client"

import { MapPinned, Route, Navigation2 } from "lucide-react"

const steps = [
  {
    step: "01",
    icon: MapPinned,
    title: "Enter Your Destination",
    description: "Simply enter your starting point and destination. Our app understands your location and finds all possible routes.",
  },
  {
    step: "02",
    icon: Route,
    title: "AI Analyzes Routes",
    description: "Our AI evaluates multiple routes based on safety factors including lighting, crowd density, incident history, and real-time reports.",
  },
  {
    step: "03",
    icon: Navigation2,
    title: "Navigate Safely",
    description: "Choose the safest route that suits you and start navigation. Share your journey with trusted contacts for added peace of mind.",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <span className="text-sm font-medium text-primary">How It Works</span>
          </div>
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Three Simple Steps to Safer Travel
          </h2>
          <p className="text-pretty text-muted-foreground">
            Getting started with SheRoutes is easy. Here's how you can begin your safer journey today.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line - hidden on mobile */}
          <div className="absolute left-0 right-0 top-24 hidden h-0.5 bg-border lg:block" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                {/* Step number circle */}
                <div className="relative mx-auto mb-6">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-background shadow-lg">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {step.step}
                  </div>
                </div>

                <h3 className="mb-3 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mx-auto max-w-sm text-muted-foreground">{step.description}</p>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="absolute -right-4 top-24 hidden text-primary lg:block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <title>Arrow right</title>
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
