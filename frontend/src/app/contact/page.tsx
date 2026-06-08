"use client";

import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import { Send, CheckCircle, ShieldAlert, Sparkles } from "lucide-react";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setStatus("Scribing message...");
    setSuccess(null);

    emailjs.sendForm(
      "medtranslate_service", 
      "template_nak7qas", 
      formRef.current, 
      "uK5BnpSJxn0y0XLeG"
    )
    .then(() => {
      setSuccess(true);
      setStatus("Your message has been sent successfully. We will get back to you shortly!");
      formRef.current?.reset();
    })
    .catch((error) => {
      console.error(error);
      setSuccess(false);
      setStatus("Failed to send message. Verify your network connection and try again.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background py-16 px-4 sm:px-6 lg:px-8 max-w-lg mx-auto flex flex-col justify-center">
      {/* Red guideline margin */}
      <div className="absolute left-[30px] sm:left-[50px] top-0 bottom-0 w-[2px] bg-red-400/35 pointer-events-none" />

      <div className="space-y-8 bg-card wobbly-border-lg border-[3px] border-[#2d2d2d] dark:border-white p-6 sm:p-8 shadow-md hard-shadow-md relative z-10 pl-10 sm:pl-12">
        {/* Tack pin decor */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-2 border-[#2d2d2d] dark:border-white shadow-sm" />

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 wobbly-border border-2 border-[#2d2d2d] dark:border-white bg-[#fff9c4] dark:bg-[#fff9a6] text-black text-xs font-bold rotate-1">
            <Sparkles className="w-3.5 h-3.5 text-primary stroke-[2.5]" />
            <span>Support Desk</span>
          </div>
          <h1 className="text-3xl font-heading text-foreground">Get in Touch</h1>
          <p className="text-xs text-muted-foreground leading-relaxed font-bold font-body">
            Have questions about handwriting OCR reliability or database entries? Scribe your comments below to mail our support.
          </p>
        </div>

        {/* Form */}
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 text-left font-bold font-body">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-heading">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              className="w-full px-4 py-2.5 bg-muted/40 border-2 border-[#2d2d2d] dark:border-white wobbly-border text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-heading">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              required
              className="w-full px-4 py-2.5 bg-muted/40 border-2 border-[#2d2d2d] dark:border-white wobbly-border text-xs focus:outline-none focus:ring-1 focus:ring-primary text-foreground font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-heading">Message</label>
            <textarea
              name="message"
              placeholder="Type message here..."
              required
              rows={4}
              className="w-full px-4 py-2.5 bg-muted/40 border-2 border-[#2d2d2d] dark:border-white wobbly-border text-xs focus:outline-none focus:ring-1 focus:ring-primary resize-none text-foreground font-semibold"
            />
          </div>

          {/* Form Action */}
          <button
            type="submit"
            disabled={loading}
            className="press-btn wobbly-border border-[3px] border-[#2d2d2d] dark:border-white w-full py-3.5 bg-primary text-white font-bold text-sm shadow-md hard-shadow font-heading cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? "Sending..." : "Send Message"}</span>
            <Send className="w-4 h-4 inline-block ml-1.5 stroke-[3]" />
          </button>
        </form>

        {/* Status notification logs */}
        {status && (
          <div className={`wobbly-border border-2 p-4 flex gap-2.5 items-start text-xs font-bold text-left ${
            success 
              ? "border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400" 
              : success === false 
                ? "border-red-500 bg-red-500/5 text-red-500" 
                : "border-border bg-secondary/40 text-muted-foreground"
          }`}>
            {success ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 stroke-[2.5]" /> : <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5 stroke-[2.5]" />}
            <p className="leading-relaxed font-body">{status}</p>
          </div>
        )}
      </div>
    </div>
  );
}
