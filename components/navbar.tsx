"use client"

import { Button } from "@/components/ui/button"
import { MapPin, Menu, X, Volume2, Phone } from "lucide-react"
import Link from "next/link"
import { useState, useRef } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"


/* 📞 Helpline Numbers */
const HELPLINES = [
  { label: "Women Helpline", number: "181" },
  { label: "Police Emergency", number: "112" },
  { label: "Child Helpline", number: "1098" },
  { label: "Ambulance", number: "108" },
  { label: "Student / Youth Help", number: "9152987821" },
]

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showHelplines, setShowHelplines] = useState(false)
  const { theme, setTheme } = useTheme()
  const toggleTheme = () => {
  setTheme(theme === "dark" ? "light" : "dark")
}



  /* 🔊 Audio reference */
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playVoice = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(() => {})
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">SheRoutes</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#features">Features</Link>
          <Link href="#how-it-works">How It Works</Link>
          <Link href="#why-sheroutes">Why SheRoutes</Link>
          <Link href="/route-planner">Route Planner</Link>
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          {/* 📞 Helplines Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowHelplines(!showHelplines)}
          >
            📞 Helplines
          </Button>

          {/* 🔊 Voice Button */}
          <Button size="sm" variant="destructive" onClick={playVoice}>
            <Volume2 className="h-4 w-4 mr-1" />
            Voice
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button
  size="icon"
  variant="ghost"
  onClick={toggleTheme}
  aria-label="Toggle theme"
  className="text-muted-foreground hover:text-foreground"

>
  {theme === "dark" ? (
    <Sun className="h-4 w-4" />
  ) : (
    <Moon className="h-4 w-4" />
  )}
</Button>

        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link href="#features">Features</Link>
            <Link href="#how-it-works">How It Works</Link>
            <Link href="#why-sheroutes">Why SheRoutes</Link>
            <Link href="/route-planner">Route Planner</Link>

            <Button
              variant="outline"
              onClick={() => setShowHelplines(!showHelplines)}
            >
              📞 Helplines
            </Button>

            <Button variant="destructive" onClick={playVoice}>
              <Volume2 className="h-4 w-4 mr-1" />
              Play Voice
            </Button>
          </nav>
        </div>
      )}

      {/* 📞 Helplines Popup */}
      {showHelplines && (
        <div className="fixed top-20 right-4 z-50 w-72 rounded-xl border bg-white shadow-lg">
          <div className="flex items-center justify-between border-b px-4 py-2">
            <h3 className="font-semibold">Emergency Helplines</h3>
            <button onClick={() => setShowHelplines(false)}>✕</button>
          </div>

          <div className="p-4 space-y-2">
            {HELPLINES.map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm hover:bg-gray-100"
              >
                <span>{item.label}</span>
                <span className="flex items-center gap-1 text-primary">
                  <Phone className="h-4 w-4" />
                  {item.number}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 🔊 Hidden Audio */}
      <audio ref={audioRef} src="/audio/mainvoice.aac" preload="auto" />
    </header>
  )
}
