import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { Features } from "@/components/marketing/features";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Integrations } from "@/components/marketing/integrations";
import { Testimonials } from "@/components/marketing/testimonials";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Fluid — Scheduling, reimagined for serious work",
  description:
    "Fluid makes booking meetings feel effortless. Share your link, set your availability, and let people book when it works — without the back-and-forth.",
  openGraph: {
    title: "Fluid — Scheduling, reimagined",
    description:
      "Share one link. Let availability speak for itself. Fluid is the scheduling platform built for how modern work actually works.",
    type: "website",
    siteName: "Fluid",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluid — Scheduling, reimagined",
    description: "Share your link. Set your hours. Get booked. That's all it takes.",
  },
};

export default function MarketingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <Integrations />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
