import { MapPin } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">SheRoutes</span>
            </Link>
            <p className="mb-4 max-w-sm text-muted-foreground">
              Empowering women and girls to travel safely with AI-powered navigation and real-time safety insights.
            </p>
            <p className="text-sm font-medium text-primary">
              Navigate with confidence. Travel with peace of mind.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-muted-foreground transition-colors hover:text-primary">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground transition-colors hover:text-primary">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Safety Reports
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-4 font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground transition-colors hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground transition-colors hover:text-primary">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SheRoutes. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with <span className="text-primary">&hearts;</span> for women everywhere
          </p>
        </div>
      </div>
    </footer>
  )
}
