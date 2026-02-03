"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, MapPin, Navigation } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="hero-bg relative overflow-hidden">
      <div className="container mx-auto px-4 py-20 md:px-6 md:py-32">
        <div className="mx-auto max-w-4xl text-center rounded-2xl
  bg-white/10 dark:bg-black/15
bg-white/10 dark:bg-black/15

  ring-1 ring-white/30 dark:ring-white/10
  px-6 py-10 md:px-10 md:py-14">

      
          {/* 🔹 Glass wrapper for readability */}
          <div className="rounded-2xl bg-white/30 dark:bg-black/35 px-6 py-10">


            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-2 backdrop-blur-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                AI-Powered Safety Navigation
              </span>
            </div>

            {/* Heading */}
            <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              Safer Routes,{" "}
              <span className="text-primary">Stronger Journeys</span>
            </h1>

            {/* Description */}
            <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-black/80 font-bold dark:text-white/80 md:text-xl">

              Navigate with confidence using our AI-based safety scoring system designed especially for women and girls.
              Find the safest routes, stay connected, and travel with peace of mind.
            </p>

            {/* CTAs */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full gap-2 sm:w-auto" asChild>
                <Link href="/auth/sign-up">
                  Start Safe Navigation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 sm:w-auto bg-transparent"
                asChild
              >
                <Link href="#features">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white md:text-4xl">

                  50K+
                </div>
                <div className="mt-1 text-sm text-black dark:text-white">
  Safe Journeys
</div>

              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-black dark:text-white md:text-4xl">

                  98%
                </div>
                <div className="mt-1 text-sm text-black dark:text-white font-medium">
  Safety Accuracy
</div>

              </div>
              <div className="col-span-2 text-center md:col-span-1">
                <div className="text-3xl font-bold text-foreground md:text-4xl">
                  24/7
                </div>
                <div className="mt-1 text-sm text-black dark:text-white">
  SOS Support
</div>

              </div>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="relative mt-16 hidden md:block">
          <div className="absolute -left-4 top-0 animate-pulse">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card/90 p-3 shadow-lg backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  Route Found
                </div>
                <div className="text-xs text-muted-foreground">
                  Safety Score: 94%
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-8 animate-pulse [animation-delay:1s]">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card/90 p-3 shadow-lg backdrop-blur-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <Navigation className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  Navigation Active
                </div>
                <div className="text-xs text-muted-foreground">
                  Live Tracking On
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
