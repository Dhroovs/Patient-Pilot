import Link from "next/link";
import { Pill, Activity, ShieldCheck, HeartPulse } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-[#2d2d2d] dark:border-white bg-[#fff9c4]/5 dark:bg-card/20 mt-auto relative">
      {/* Hand-drawn guideline overlay */}
      <div className="absolute top-4 left-0 right-0 h-[1px] border-t border-dashed border-[#2d2d2d]/10 dark:border-white/10" />

      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Disclaimer Brief */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="wobbly-border border-2 border-[#2d2d2d] dark:border-white bg-[#fff9c4]/15 w-7 h-7 flex items-center justify-center -rotate-2 overflow-hidden">
                <img src="/logo_icon.png" className="w-5 h-5 object-contain" alt="PatientPilot Icon" />
              </div>
              <span className="font-heading font-bold text-lg text-foreground">
                <span className="text-primary">Patient</span>Pilot
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed font-normal">
              A playful but secure AI companion helping you understand handwriting, translations, and dosage timings.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
              <span>HIPAA Compliant Processing</span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground tracking-wider underline decoration-dashed decoration-primary">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground font-bold">
              <li><Link href="/dashboard" className="hover:line-through hover:text-primary transition-all">Scan Prescription</Link></li>
              <li><Link href="/history" className="hover:line-through hover:text-primary transition-all">Scan Archive</Link></li>
              <li><Link href="/about" className="hover:line-through hover:text-primary transition-all">Safety Guidelines</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-sm font-bold text-foreground tracking-wider underline decoration-dashed decoration-primary">Resources</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground font-bold">
              <li><Link href="/about" className="hover:line-through hover:text-primary transition-all">How It Works</Link></li>
              <li><Link href="/contact" className="hover:line-through hover:text-primary transition-all">Support Desk</Link></li>
              <li><a href="#" className="hover:line-through hover:text-primary transition-all">Developer API</a></li>
            </ul>
          </div>

          {/* Trust Panel */}
          <div className="space-y-4">
            <h3 className="font-heading text-sm font-bold text-foreground tracking-wider underline decoration-dashed decoration-primary">Accuracy</h3>
            <div className="wobbly-border-md border-2 border-[#2d2d2d] dark:border-white p-3.5 bg-card/80 dark:bg-card/50 rotate-1 flex items-start space-x-2 shadow-sm">
              <HeartPulse className="w-5 h-5 text-primary flex-shrink-0 animate-pulse mt-0.5" />
              <div className="text-xs text-muted-foreground leading-snug font-semibold">
                Clinical RAG database cross-references chemical structures before AI formatting.
              </div>
            </div>
          </div>
        </div>

        {/* Post-it Style Warning Sticky Note */}
        <div className="mt-8 pt-8 border-t border-[#2d2d2d]/10 dark:border-white/10">
          <div className="wobbly-border-md border-[3px] border-[#2d2d2d] p-5 bg-[#fff9c4] dark:bg-[#fff9a6] text-black text-sm leading-relaxed mb-6 -rotate-1 hard-shadow-sm">
            {/* Mock tape overlay on sticky note */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-neutral-500/10 border-x border-dashed border-[#2d2d2d]/30 rotate-1" />
            
            <strong>⚠️ Safety Disclaimer:</strong> PatientPilot is a wobbly-bordered educational aid meant to clarify complex chemical shorthand. It is NOT a doctor or clinician. Never alter dosage structures or stop medications without consulting a qualified physician or pharmacist.
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-bold">
            <span>&copy; {new Date().getFullYear()} PatientPilot Inc. Handwritten with care.</span>
            <div className="flex space-x-3">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <span>&middot;</span>
              <a href="#" className="hover:underline">Terms of Service</a>
              <span>&middot;</span>
              <Link href="/contact" className="hover:underline">Contact Devs</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
