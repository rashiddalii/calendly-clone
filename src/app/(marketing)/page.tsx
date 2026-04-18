import type { Metadata } from "next";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { SocialProof } from "@/components/marketing/social-proof";
import { FeatureShowcase } from "@/components/marketing/feature-showcase";
import { Integrations } from "@/components/marketing/integrations";
import { Pricing } from "@/components/marketing/pricing";
import { Stats } from "@/components/marketing/stats";
import { CtaBanner } from "@/components/marketing/cta-banner";
import { Footer } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "Fluid | Easy scheduling ahead",
  description:
    "Join millions who book meetings without the back-and-forth. Share your link, set your availability, and let Fluid handle the rest.",
  openGraph: {
    title: "Fluid | Easy scheduling ahead",
    description:
      "Share one link. Let availability speak for itself. Fluid is the scheduling platform built for how modern work actually works.",
    type: "website",
    siteName: "Fluid",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fluid | Easy scheduling ahead",
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
        <FeatureShowcase />
        <Integrations />
        <Pricing />
        <Stats />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
