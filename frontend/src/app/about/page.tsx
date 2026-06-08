"use client";

import { motion } from "framer-motion";
import { Pill, Activity, ShieldAlert, HeartPulse, BrainCircuit, Globe, Terminal, UserCheck } from "lucide-react";

export default function About() {
  const cards = [
    {
      title: "🚨 The Problem",
      description: "Prescription charts are hard to parse due to handwriting scribbles, technical acronyms, and compact dosage directions. This confusion leads to recovery risks and patient anxiety.",
      icon: ShieldAlert,
      color: "text-red-500 border-red-500/30 bg-red-500/5 rotate-1"
    },
    {
      title: "💡 Our Solution",
      description: "PatientPilot decodes prescription details. We convert illegible medical document screenshots into patient-friendly listings explaining dosage times, purposes, and side effects.",
      icon: HeartPulse,
      color: "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5 -rotate-1"
    },
    {
      title: "⚙️ How It Works",
      description: "Upload your prescription image. The backend runs OCR, queries standard drug records from our database catalog, and uses Gemini to format patient guidelines in simple, wobbly cards.",
      icon: BrainCircuit,
      color: "text-[#2d5da1] dark:text-[#5eb5f8] border-secondary bg-[#2d5da1]/5 rotate-2"
    },
    {
      title: "🌍 Accessibility First",
      description: "We translate medical instructions on-the-fly into 6+ major languages, including Hindi, Tamil, Telugu, Bengali, Arabic, and Spanish, combined with built-in voice audio speak buttons.",
      icon: Globe,
      color: "text-[#2d5da1] dark:text-[#5eb5f8] border-secondary bg-[#2d5da1]/5 -rotate-2"
    }
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto flex flex-col justify-between">
      {/* Guideline margin */}
      <div className="absolute left-[30px] sm:left-[50px] top-0 bottom-0 w-[2px] bg-red-400/35 pointer-events-none" />

      <div className="space-y-12 pl-6 sm:pl-10 text-left">
        {/* Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h1 className="text-3.5xl sm:text-5xl font-heading tracking-tight text-foreground">
            About{" "}
            <span className="underline decoration-dashed decoration-primary inline-block rotate-1 text-primary">
              PatientPilot
            </span>
          </h1>
          <p className="text-base text-muted-foreground font-bold font-body leading-relaxed text-center">
            PatientPilot (formerly MedTranslate AI) is a wobbly-bordered clinical companion translating doctor notes into plain readable guidelines.
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-6 wobbly-border-md border-2 border-[#2d2d2d] dark:border-white relative overflow-hidden flex flex-col gap-4 text-left shadow-sm ${card.color}`}
            >
              {/* Pin */}
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-primary border-2 border-[#2d2d2d] dark:border-white shadow-sm" />
              
              <div className="space-y-2 pt-2">
                <h3 className="font-heading font-bold text-lg text-foreground">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-bold font-body">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chalkboard stack */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8 wobbly-border-lg border-[3px] border-[#2d2d2d] dark:border-white bg-[#1a1c23] text-white space-y-6 shadow-md hard-shadow rotate-1 relative"
        >
          {/* Tape decor */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/10 border-x border-dashed border-white/20 -rotate-1" />

          <h3 className="font-heading font-bold text-xl text-[#5eb5f8] flex items-center gap-1.5">
            <Terminal className="w-5 h-5 stroke-[2.5]" />
            <span>Scribbled Tech Stack Ledger</span>
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm font-bold font-body">
            <div className="space-y-2">
              <h4 className="font-heading text-base text-[#ff6b6b]">Client Canvas</h4>
              <ul className="space-y-1.5 text-zinc-300 text-xs">
                <li>Next.js (App Router, Typescript)</li>
                <li>Tailwind CSS Design Framework</li>
                <li>Framer Motion Snap Interactions</li>
                <li>Lucide Hand-drawn Stroke Icons</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-heading text-base text-[#ff6b6b]">Backend Core</h4>
              <ul className="space-y-1.5 text-zinc-300 text-xs">
                <li>Express.js Headless API Server</li>
                <li>Google Gemini API structured JSON</li>
                <li>MongoDB Atlas (w/ Local File Fallback!)</li>
                <li>Aggregated Medicine RAG Search</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-heading text-base text-[#ff6b6b]">OCR Extraction</h4>
              <ul className="space-y-1.5 text-zinc-300 text-xs">
                <li>Google Cloud Vision API</li>
                <li>Tesseract.js Local Offline Fallback</li>
                <li>Xenova transformers embeddings</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer Alert */}
        <div className="wobbly-border-md border-2 border-[#2d2d2d] dark:border-white p-5 bg-[#fff9c4] dark:bg-[#fff9a6] text-black flex gap-4 items-start shadow-sm rotate-1 font-bold">
          <UserCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5 stroke-[2.5]" />
          <div className="space-y-1 text-xs leading-relaxed font-body">
            <strong className="font-heading text-sm block">🛡️ Safe Patient Guideline</strong>
            PatientPilot uses structured AI and database search results to explain medical jargon. However, database checks can err. Always verify critical dosing guidelines with your medical clinician.
          </div>
        </div>
      </div>
    </div>
  );
}
