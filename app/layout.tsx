import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import "leaflet/dist/leaflet.css"

import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SheRoutes - Safer Routes, Stronger Journeys",
  description:
    "AI-powered safety navigation app designed for women and girls. Find the safest routes with real-time safety scoring, live tracking, and one-tap SOS alerts.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* 🌙 Theme Provider – MOST IMPORTANT */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
        >
          {children}
        </ThemeProvider>

        <Analytics />
      </body>
    </html>
  )
}
