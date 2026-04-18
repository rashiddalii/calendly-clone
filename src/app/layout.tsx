import type { Metadata } from "next";
import { Inter, Manrope, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fluid | Scheduling, Reimagined",
    template: "%s | Fluid",
  },
  description:
    "A serene, sophisticated scheduling experience. Share your availability, book meetings, sync with Google Calendar. All in a design that treats your time as an art object.",
  applicationName: "Fluid",
  keywords: [
    "scheduling",
    "calendly alternative",
    "meeting scheduler",
    "availability",
    "google calendar",
  ],
  openGraph: {
    type: "website",
    title: "Fluid | Scheduling, Reimagined",
    description:
      "Share your availability and book meetings with a design that makes time feel effortless.",
    siteName: "Fluid",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${manrope.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className="min-h-full flex flex-col bg-surface text-on-surface"
        suppressHydrationWarning
      >
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
