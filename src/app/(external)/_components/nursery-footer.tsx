"use client";

import Image from "next/image";
import Link from "next/link";

import { Baby, Clock, Mail, MapPin, Phone } from "lucide-react";

import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";

import { FloatingCallButton } from "./floating-call-button";

export function NurseryFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t-4 border-orange-300 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-yellow-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-48 w-48 rounded-full bg-pink-200/30 blur-3xl" />

      {/* Floating decorations */}
      <span
        aria-hidden="true"
        className="absolute top-6 left-6 text-3xl pointer-events-none select-none nursery-twinkle opacity-40 hidden sm:block"
        style={{ animationDelay: "0.4s" }}
      >
        ⭐
      </span>
      <span
        aria-hidden="true"
        className="absolute top-8 right-10 text-2xl pointer-events-none select-none nursery-float opacity-40 hidden sm:block"
        style={{ animationDelay: "0.9s" }}
      >
        🌸
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-16 left-10 text-2xl pointer-events-none select-none nursery-wiggle opacity-30 hidden md:block"
        style={{ animationDelay: "0.6s" }}
      >
        🎈
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-20 right-8 text-2xl pointer-events-none select-none nursery-float-slow opacity-30 hidden lg:block"
        style={{ animationDelay: "1.2s" }}
      >
        🦋
      </span>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Intro */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-orange-100 ring-4 ring-orange-200 group-hover:ring-orange-400 transition-all shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="Bubbly Day Nursery logo"
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <span className="font-heading font-black text-xl tracking-tight text-foreground">
                Bubbly <span className="text-orange-500">Nursery</span> 🌟
              </span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              A warm, stimulating, and child-centric environment providing babies, toddlers, and preschool children a
              significant bubbly headstart in their learning and development. 🌱
            </p>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold space-y-0.5 mt-1">
              <span className="block text-foreground font-bold">BUBBLY DAY NURSERY LIMITED</span>
              <span className="block">Company number 15176895</span>
            </div>

            {/* Fun badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-orange-100 border border-orange-300 text-orange-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                🛡️ Ofsted Registered
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                🌱 EYFS Aligned
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
              🏫 Nursery
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us & EYFS", emoji: "📖" },
                { href: "/rooms", label: "Classroom Rooms", emoji: "🚪" },
                { href: "/menu", label: "Nursery Food Menu", emoji: "🍎" },
                { href: "/careers", label: "Careers & Jobs", emoji: "💼" },
                { href: "/contact", label: "Contact Us", emoji: "✉️" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-orange-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="group-hover:scale-110 transition-transform inline-block">{item.emoji}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
              🕐 Opening Hours
            </h4>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-orange-200 space-y-3">
              <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Clock className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-foreground">Monday – Friday</span>
                  <span className="block text-xs">7:30 AM – 6:00 PM</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground italic pl-7">
                Closed during UK Bank Holidays and 1 week over Christmas.
              </p>
            </div>

            {/* Mini fun fact */}
            <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-2xl p-3 text-xs text-yellow-800 font-medium">
              🎉 Open 52 weeks a year (excluding bank holidays)
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-black text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
              📍 Our Settings
            </h4>
            <div className="space-y-5">
              {/* Branch 1 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-orange-200 space-y-2">
                <span className="block font-black text-orange-500 text-[10px] uppercase tracking-wider flex items-center gap-1">
                  🏠 Branch 1 (Main)
                </span>
                <span className="flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <span>Manor Methodist Church, Galleywall Road, SE16 3PB</span>
                </span>
                <span className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Phone className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    07359760335 /<br />
                    07863862973 /<br />
                    020 8109 8601
                  </span>
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                  <a href="mailto:info@bubblydnursery.co.uk" className="hover:text-orange-500 transition-colors">
                    info@bubblydnursery.co.uk
                  </a>
                </span>
              </div>

              {/* Branch 2 */}
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-teal-200 space-y-2">
                <span className="block font-black text-teal-600 text-[10px] uppercase tracking-wider flex items-center gap-1">
                  🏫 Branch 2 (New Setting)
                </span>
                <span className="flex items-start gap-2 text-xs text-muted-foreground">
                  <MapPin className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                  <span>St Gertrudes Church Hall, Corbetts Lane, London, SE16 2BQ</span>
                </span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="h-4 w-4 text-teal-500 shrink-0" />
                  <a href="mailto:bubblyd2nursery@gmail.com" className="hover:text-teal-500 transition-colors">
                    bubblyd2nursery@gmail.com
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-orange-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            🌟 &copy; {currentYear} Bubbly Day Nursery. All rights reserved. Made with 💛 for little ones.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-orange-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-orange-500 transition-colors">
              Terms of Service
            </Link>
            <div className="border-l border-orange-200 pl-4 flex items-center">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
      <FloatingCallButton />
    </footer>
  );
}
