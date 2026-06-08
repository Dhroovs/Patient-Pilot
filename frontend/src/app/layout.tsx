import type { Metadata } from "next";
import { Kalam, Patrick_Hand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["700"],
});

const patrickHand = Patrick_Hand({
  variable: "--font-patrick-hand",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "PatientPilot - AI-powered Prescription Explainer",
  description: "Upload handwritten prescriptions and let AI translate and explain medicines, dosage, warnings, and safety guidelines in simple language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${kalam.variable} ${patrickHand.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
