"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  Pill, 
  ShieldAlert, 
  MessageSquare, 
  Volume2, 
  Languages, 
  ArrowRight, 
  CheckCircle,
  FileText,
  FileCheck,
  BrainCircuit,
  Eye,
  Activity,
  Heart
} from "lucide-react";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "1. Upload Sheet",
      desc: "Upload a photo of your handwritten doctor's note or clinical receipt. Simple image uploads work out of the box.",
      icon: FileText,
      color: "bg-[#fff9c4]",
      rotation: "-rotate-1"
    },
    {
      title: "2. Sketch Scanning",
      desc: "Our dual OCR system scans the text, mapping wobbly drug handwriting line-by-line.",
      icon: BrainCircuit,
      color: "bg-[#e2f0d9]",
      rotation: "rotate-2"
    },
    {
      title: "3. Database Search",
      desc: "We look up the active chemical compound in our local reference catalog to fetch warnings and dosages.",
      icon: Eye,
      color: "bg-[#fce4d6]",
      rotation: "-rotate-2"
    },
    {
      title: "4. Scribe Summary",
      desc: "Review wobbly cards explaining your therapy. Ask follow-up questions in the chat sandbox.",
      icon: FileCheck,
      color: "bg-[#fff9c4]",
      rotation: "rotate-1"
    },
  ];

  const features = [
    {
      title: "Pencil Handwriting OCR",
      description: "Dual Google Vision and local Tesseract.js processing handles scribbled doctor handwriting.",
      icon: BrainCircuit,
      color: "bg-[#ffffff] dark:bg-[#222631]"
    },
    {
      title: "Clinical RAG Crosscheck",
      description: "Uses semantic vector similarity matches to load standard medical profiles and safe guidelines.",
      icon: FileCheck,
      color: "bg-[#fff9c4] dark:bg-[#fff9a6] text-black"
    },
    {
      title: "Drug Interaction Flags",
      description: "Highlighter red warnings detect overlapping chemical substances and dosing duplicates.",
      icon: ShieldAlert,
      color: "bg-[#ffffff] dark:bg-[#222631]"
    },
    {
      title: "Interactive Sandbox Chat",
      description: "Ask follow-up questions safely in a conversational ledger layout powered by Gemini.",
      icon: MessageSquare,
      color: "bg-[#fff9c4] dark:bg-[#fff9a6] text-black"
    },
    {
      title: "6+ Language Translation",
      description: "Scribe medicine instructions on the fly to Hindi, Tamil, Telugu, Bengali, Arabic, or Spanish.",
      icon: Languages,
      color: "bg-[#ffffff] dark:bg-[#222631]"
    },
    {
      title: "Read-Aloud Voice Aid",
      description: "Native text-to-speech engine reads instructions aloud for accessible visual guidance.",
      icon: Volume2,
      color: "bg-[#fff9c4] dark:bg-[#fff9a6] text-black"
    },
  ];

  const testimonials = [
    {
      quote: "My doctor's handwriting was completely illegible. PatientPilot's local OCR extracted the text and flagged a potential overdose risk with my daily vitamins.",
      author: "Sarah K.",
      role: "Patient Caregiver",
      rotation: "-rotate-1"
    },
    {
      quote: "A wobbly-bordered UI with solid medical accuracy. The local JSON fallback is incredible for testing when database configurations are missing.",
      author: "Dr. David L.",
      role: "Pharmacist Consultant",
      rotation: "rotate-1"
    }
  ];

  return (
    <div className="relative overflow-hidden bg-background min-h-screen flex flex-col justify-between">
      {/* Decorative Grid Notebook margins */}
      <div className="absolute left-[30px] sm:left-[50px] top-0 bottom-0 w-[2px] bg-red-400/35 pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6 max-w-3xl mx-auto"
        >
          {/* Scribbled tag */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 wobbly-border border-2 border-[#2d2d2d] dark:border-white bg-[#fff9c4] dark:bg-[#fff9a6] text-black text-xs font-bold rotate-1 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '4s' }} />
            <span>Interactive Sketched Healthcare AI</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-heading tracking-tight leading-tight text-foreground">
            Understand Prescriptions{" "}
            <span className="underline decoration-dashed decoration-primary decoration-4 rotate-1 inline-block text-primary dark:text-[#ff6b6b]">
              Instantly!
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto font-bold font-body">
            Upload handwritten prescriptions and let AI explain medicines, dosage, precautions, and instructions in simple language.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 relative">
            {/* Hand-drawn helper arrow markup - Desktop Only */}
            <div className="hidden md:block absolute -left-20 top-1/2 -translate-y-1/2 text-primary rotate-12">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 100">
                <path d="M10,80 Q50,90 90,60" strokeDasharray="5,5" />
                <path d="M75,55 L90,60 L80,75" />
              </svg>
              <div className="text-[10px] font-bold -mt-2 -rotate-12">Start here</div>
            </div>

            <Link
              href="/dashboard"
              className="press-btn wobbly-border border-[3px] border-[#2d2d2d] dark:border-white px-8 py-3.5 bg-primary dark:bg-primary text-white font-bold rounded-xl text-base shadow-md hard-shadow font-heading transform hover:-rotate-1"
            >
              <span>Scan Prescription Now</span>
              <ArrowRight className="w-4 h-4 inline-block ml-2 stroke-[3]" />
            </Link>
            <Link
              href="/about"
              className="press-btn wobbly-border border-[3px] border-[#2d2d2d] dark:border-white px-8 py-3.5 bg-card text-foreground font-bold rounded-xl text-base shadow-md hard-shadow transform hover:rotate-1"
            >
              Learn How It Works
            </Link>
          </div>
        </motion.div>

        {/* Sketched Scan Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-16 max-w-2xl mx-auto wobbly-border-lg border-[3px] border-[#2d2d2d] dark:border-white bg-card relative shadow-md hard-shadow-md p-6 sm:p-8"
        >
          {/* Thumbtack pin overlay */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-[#2d2d2d] dark:border-white shadow-sm z-20 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white" />
          </div>

          <div className="flex items-center justify-between border-b border-dashed border-[#2d2d2d]/30 dark:border-white/30 pb-3 mb-6 font-bold text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Activity className="w-4.5 h-4.5 text-primary stroke-[2.5]" />
              <span>prescription_sketch.jpeg</span>
            </div>
            <div className="flex gap-1">
              <span>●</span>
              <span>●</span>
              <span>●</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left relative min-h-[260px]">
            {/* Mock Handwriting column */}
            <div className="relative wobbly-border border-2 border-[#2d2d2d] dark:border-white bg-[#fdfbf7]/40 dark:bg-card/10 p-5 flex flex-col justify-between overflow-hidden aspect-[4/3] md:aspect-auto">
              {/* Laser line sweep animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-dashed border-t border-[#ff4d4d] shadow-sm animate-scan z-10" />

              <div className="space-y-3 font-mono text-[#2d2d2d]/40 dark:text-white/30 text-sm leading-relaxed font-bold">
                <div className="border-b border-[#2d2d2d]/20 dark:border-white/10 pb-1 mb-2 text-xs">CLINICAL GUIDE</div>
                <div>Rx: Metformin 500mg tab</div>
                <div>Sig: 1 tab bid with breakfast/dinner</div>
                <div>Disp: #60 tablets</div>
                <div className="pt-2 text-xs italic">Dr. Miller, MD</div>
              </div>
              <div className="text-[11px] text-[#ff4d4d] dark:text-[#ff6b6b] font-heading flex items-center gap-1 font-bold pt-4 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-primary" />
                OCR SCANNING TEXT LINES
              </div>
            </div>

            {/* Results mockup column */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-base flex items-center gap-1.5">
                  <Pill className="w-4.5 h-4.5 text-primary stroke-[2.5]" />
                  <span>Identified Compounds</span>
                </h4>
                <div className="wobbly-border border-2 border-[#2d2d2d] dark:border-white p-3.5 bg-[#fff9c4] dark:bg-[#fff9a6] text-black -rotate-1 shadow-sm">
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span>Metformin</span>
                    <span className="text-[9px] bg-black/5 border border-black/20 px-1.5 py-0.5 rounded">
                      98% Match
                    </span>
                  </div>
                  <div className="text-xs font-bold opacity-80">Dosage: 500mg table with meals</div>
                </div>
              </div>

              {/* Safety alerts mockup */}
              <div className="wobbly-border border-2 border-dashed border-[#ff4d4d] p-3 bg-[#ff4d4d]/5 text-primary text-xs leading-normal font-bold">
                <div className="flex items-center gap-1.5 mb-1 font-heading">
                  <ShieldAlert className="w-4.5 h-4.5 stroke-[2.5]" />
                  <span>Safety Alert</span>
                </div>
                <p className="opacity-90 font-body text-[11px] font-bold">
                  Take with food. Heavy alcohol usage increases lactic acid risks.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="bg-[#fff9c4]/15 border-y-[3px] border-[#2d2d2d] dark:border-white py-16 text-left">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center space-y-4 max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-heading text-foreground">
              Sketched Feature Notebook
            </h2>
            <p className="text-base text-muted-foreground font-bold">
              We replace clinical grid alignment with organic wobbly cards held together by thumbtacks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const IconComp = feature.icon;
              return (
                <div
                  key={idx}
                  className={`wobbly-border-md border-2 border-[#2d2d2d] dark:border-white p-6 ${feature.color} flex flex-col items-start relative shadow-sm hover:scale-[1.01] transition-transform`}
                >
                  {/* Tape strip on top of card */}
                  {idx % 2 === 0 && (
                    <div className="absolute -top-3.5 left-1/3 w-12 h-4 bg-neutral-500/15 dark:bg-white/10 rotate-1 border-x border-dashed border-[#2d2d2d]/30" />
                  )}
                  {/* Thumbtack pin on top of card */}
                  {idx % 2 !== 0 && (
                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-[#2d2d2d] dark:border-white shadow-sm" />
                  )}
                  
                  <div className="w-10 h-10 rounded-full border-2 border-[#2d2d2d] dark:border-white flex items-center justify-center bg-card mb-4">
                    <IconComp className="w-4.5 h-4.5 text-primary stroke-[2.5]" />
                  </div>
                  <h3 className="font-heading text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-bold font-body">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16 max-w-5xl mx-auto px-6 text-center relative">
        <div className="space-y-3 max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-heading text-foreground">Notebook Step Outline</h2>
          <p className="text-base text-muted-foreground font-bold">From handwritten clinical notes to simple structured cards.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 wobbly-border-md border-2 border-[#2d2d2d] dark:border-white text-left cursor-pointer transition-all duration-100 ${
                  activeStep === idx 
                    ? `${step.color} dark:bg-neutral-800 scale-102 border-primary dark:border-primary text-black dark:text-white hard-shadow-sm` 
                    : "bg-card/50 border-border hover:bg-card"
                } ${step.rotation}`}
              >
                <div className="w-9 h-9 rounded-xl border border-[#2d2d2d] dark:border-white flex items-center justify-center bg-card mb-3.5">
                  <IconComp className="w-4.5 h-4.5 text-primary stroke-[2.5]" />
                </div>
                <h4 className="font-heading font-bold text-sm sm:text-base mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-bold font-body">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[#fff9c4]/10 border-t-[3px] border-[#2d2d2d] dark:border-white py-12 text-left">
        <div className="max-w-4xl mx-auto px-6 space-y-10">
          <h2 className="text-2xl font-heading text-center text-foreground">Scrawled Feedback Logs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div 
                key={idx} 
                className={`wobbly-border-md border-2 border-[#2d2d2d] dark:border-white p-6 bg-card flex flex-col justify-between relative shadow-sm ${t.rotation}`}
              >
                {/* Speech Bubble geometric pointer tail */}
                <div className="absolute -bottom-3 left-8 w-4 h-4 bg-card border-r-2 border-b-2 border-[#2d2d2d] dark:border-white rotate-45 pointer-events-none" />

                <p className="text-sm italic text-muted-foreground leading-relaxed font-bold font-body mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full border-2 border-[#2d2d2d] dark:border-white bg-[#fff9c4]/30 flex items-center justify-center text-xs font-bold">
                    {t.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-foreground">{t.author}</div>
                    <div className="text-[10px] text-muted-foreground font-bold">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 max-w-4xl mx-auto px-6 text-center">
        <div className="wobbly-border-lg border-[3px] border-[#2d2d2d] dark:border-white bg-[#fff9c4] dark:bg-[#fff9a6] text-black p-10 relative overflow-hidden shadow-md hard-shadow-md rotate-1">
          {/* Tape strip decors */}
          <div className="absolute -top-3.5 left-10 w-16 h-5 bg-neutral-500/10 border-x border-dashed border-[#2d2d2d]/30 rotate-2" />
          <div className="absolute -top-3.5 right-10 w-16 h-5 bg-neutral-500/10 border-x border-dashed border-[#2d2d2d]/30 -rotate-2" />

          <div className="space-y-4">
            <h2 className="text-3xl font-heading font-extrabold leading-tight">
              Ready to Scribe Your Prescriptions?
            </h2>
            <p className="text-sm font-bold max-w-lg mx-auto leading-relaxed opacity-85 font-body">
              Start parsing medication files, check duplicate combinations, verify side effects, and download printable PDFs locally out-of-the-box.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3">
              <Link
                href="/dashboard"
                className="press-btn wobbly-border border-[3px] border-[#2d2d2d] px-8 py-3 bg-primary text-white font-bold text-sm shadow-md hard-shadow font-heading transform hover:-rotate-1"
              >
                <span>Launch Sketch Explainer</span>
                <ArrowRight className="w-4 h-4 inline-block ml-1 stroke-[3]" />
              </Link>
              <div className="flex items-center gap-1.5 text-xs text-black/70 font-bold px-3 py-1">
                <CheckCircle className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>Zero registration required</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
