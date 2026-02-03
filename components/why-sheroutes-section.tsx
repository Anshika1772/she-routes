"use client"

import { Check, Heart, Shield, Users } from "lucide-react"

const reasons = [
  "Designed specifically for women and girls",
  "Transparent safety scoring methodology",
  "Community-powered incident reports",
  "24/7 emergency response integration",
  "Privacy-first approach to data handling",
  "Regular safety updates and improvements",
]

export function WhySheRoutesSection() {
  return (
    <section id="why-sheroutes" className="bg-secondary/30 py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
              <span className="text-sm font-medium text-primary">Why SheRoutes</span>
            </div>
            <h2 className="mb-6 text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Built by Women, for Women
            </h2>
            <p className="mb-8 text-pretty text-lg text-muted-foreground">
              SheRoutes was created with a singular mission: to empower women and girls to travel safely and confidently. 
              We understand the unique safety concerns women face, and we've built every feature with that understanding in mind.
            </p>

            <ul className="grid gap-4 sm:grid-cols-2">
              {reasons.map((reason) => (
                <li key={reason} className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">Women First</h3>
                  <p className="text-sm text-muted-foreground">
                    Every decision we make puts the safety and comfort of women first.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">Privacy Protected</h3>
                  <p className="text-sm text-muted-foreground">
                    Your data stays yours. We never sell or share your information.
                  </p>
                </div>
              </div>

              <div className="mt-0 space-y-4 sm:mt-8">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">Community Driven</h3>
                  <p className="text-sm text-muted-foreground">
                    Real reports from real women help keep our safety data accurate.
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
                  <div className="text-3xl font-bold text-primary">4.9/5</div>
                  <div className="mt-1 text-sm font-medium text-foreground">User Rating</div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Trusted by thousands of women daily
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
