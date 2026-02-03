'use client';

import {Navbar} from '@/components/navbar';
import {HeroSection} from '@/components/hero-section';
import {FeaturesSection} from '@/components/features-section';
import {HowItWorksSection} from '@/components/how-it-works-section';
import {WhySheRoutesSection} from '@/components/why-sheroutes-section';
import {CTASection} from '@/components/cta-section';
import {Footer} from '@/components/footer';
import SOSListener from '@/components/SOSListener';

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">

      {/* 🔴 GLOBAL SOS LISTENER */}
      <SOSListener />

      {/* 🔵 PAGE CONTENT */}
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <WhySheRoutesSection />
      <CTASection />
      <Footer />

    </main>
  );
}
