"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center md:px-12 md:py-20">
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          </div>

          <h2 className="mx-auto mb-4 max-w-2xl text-balance text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl lg:text-5xl">
            Because Every Woman Deserves a Safer Journey
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-pretty text-lg text-primary-foreground/80">
            Join thousands of women who travel with confidence every day. Download SheRoutes and start your safer journey today.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              variant="secondary"
              className="w-full gap-2 bg-white text-primary hover:bg-white/90 sm:w-auto"
              asChild
            >
              <Link href="/auth/sign-up">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 sm:w-auto"
              asChild
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/20 pt-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">50,000+</div>
              <div className="text-sm text-primary-foreground/70">Active Users</div>
            </div>
            <div className="hidden h-8 w-px bg-white/20 sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">100+</div>
              <div className="text-sm text-primary-foreground/70">Cities Covered</div>
            </div>
            <div className="hidden h-8 w-px bg-white/20 sm:block" />
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-foreground">99.9%</div>
              <div className="text-sm text-primary-foreground/70">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
