"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Pill, Menu, X, Sun, Moon, History, Info, Phone, Activity } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "History", href: "/history", icon: History },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card border-b-[3px] border-[#2d2d2d] dark:border-white transition-all duration-300">
      {/* Tape decoration overlay on header */}
      <div className="absolute top-0 left-10 w-16 h-4 bg-neutral-500/15 dark:bg-white/10 -rotate-2 border-x border-dashed border-[#2d2d2d]/30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="wobbly-border border-2 border-[#2d2d2d] dark:border-white bg-[#fff9c4]/10 dark:bg-white/5 w-9 h-9 flex items-center justify-center -rotate-1 relative overflow-hidden">
              <img src="/logo_icon.png" className="w-6.5 h-6.5 object-contain" alt="PatientPilot Icon" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-foreground group-hover:rotate-1 transition-transform">
              <span className="text-primary">Patient</span>Pilot
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-sm font-bold transition-all hover:rotate-1 ${
                    isActive 
                      ? "text-primary dark:text-[#ff6b6b] wobbly-border border-2 border-[#2d2d2d] dark:border-white bg-[#fff9c4]/20 dark:bg-white/5 rotate-2 scale-102"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="wobbly-border border-2 border-[#2d2d2d] dark:border-white p-1.5 bg-card text-foreground hover:rotate-2 transition-transform cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-secondary" />}
            </button>

            {/* Launch App Button */}
            <Link
              href="/dashboard"
              className="press-btn wobbly-border border-[3px] border-[#2d2d2d] dark:border-white px-4 py-1.5 text-xs font-bold text-white bg-primary dark:bg-primary hover:-rotate-1 hard-shadow-sm font-heading tracking-wide"
            >
              Launch Scan
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-3 md:hidden">
            <button
              onClick={toggleTheme}
              className="wobbly-border border-2 border-[#2d2d2d] dark:border-white p-1.5 bg-card text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-secondary" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="wobbly-border border-2 border-[#2d2d2d] dark:border-white p-1.5 bg-card text-foreground"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t-2 border-[#2d2d2d] dark:border-white bg-background/95 backdrop-blur-lg"
          >
            <div className="px-3 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 text-base font-bold transition-all ${
                      isActive 
                        ? "text-primary dark:text-[#ff6b6b] wobbly-border border-2 border-[#2d2d2d] dark:border-white bg-[#fff9c4]/15" 
                        : "text-muted-foreground hover:bg-secondary/40"
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="pt-2 px-3">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2.5 text-center text-sm font-bold text-white bg-primary dark:bg-primary wobbly-border border-[3px] border-[#2d2d2d] dark:border-white shadow-sm"
                >
                  Launch Scan
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
