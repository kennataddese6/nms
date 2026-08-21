"use client";

import Image from "next/image";
import Link from "next/link";

import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";

import { FloatingCallButton } from "./floating-call-button";

export function NurseryFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t-4 border-orange-300 bg-gradient-to-br from-orange-50 via-pink-50 to-yellow-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & Intro */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-orange-100 ring-4 ring-orange-200 group-hover:ring-orange-400 transition-all shadow-sm">
                <Image
                  src="/images/logo.png"
                  alt="Bubbly Day Nursery logo"
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <span className="font-heading font-black text-2xl tracking-tight text-foreground">
                Bubbly <span className="text-orange-500">Nursery</span> 🌟
              </span>
            </Link>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xs font-medium">
              A warm, stimulating, and child-centric environment providing babies, toddlers, and preschool children a
              significant bubbly headstart in learning and development. 🌱
            </p>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold space-y-1 mt-1">
              <span className="block text-foreground font-black text-xs">BUBBLY DAY NURSERY LIMITED</span>
            </div>

            {/* Fun badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="inline-flex items-center gap-1 bg-orange-100 border border-orange-300 text-orange-800 text-xs font-black px-3 py-1 rounded-full">
                🛡️ Ofsted Registered
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black px-3 py-1 rounded-full">
                🌱 EYFS Aligned
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-black text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
              🏫 Nursery Pages
            </h4>
            <ul className="space-y-3.5">
              {[
                { href: "/about", label: "About Us & EYFS", emoji: "📖" },
                { href: "/rooms", label: "Classroom Rooms", emoji: "🚪" },
                { href: "/menu", label: "Nursery Food Menu", emoji: "🍎" },
                { href: "/gallery", label: "Photo Gallery", emoji: "🖼️" },
                { href: "/news", label: "News & Events", emoji: "📰" },
                { href: "/careers", label: "Careers & Jobs", emoji: "💼" },
                { href: "/contact", label: "Contact Us", emoji: "✉️" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-base font-bold text-foreground/80 hover:text-orange-600 transition-colors flex items-center gap-2.5 group"
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
            <h4 className="text-base font-black text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
              🕐 Opening Hours
            </h4>
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-orange-200 space-y-3 shadow-sm">
              <div className="flex items-start gap-3 text-base text-muted-foreground">
                <Clock className="h-6 w-6 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-black text-foreground text-base">Monday – Friday</span>
                  <span className="block text-sm font-bold text-orange-600 mt-0.5">7:30 AM – 6:00 PM</span>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground italic pl-9 font-medium">
                Closed during UK Bank Holidays and 1 week over Christmas.
              </p>
            </div>

            {/* Mini fun fact */}
            <div className="mt-4 bg-yellow-100 border border-yellow-300 rounded-2xl p-3.5 text-xs sm:text-sm text-yellow-900 font-bold">
              🎉 Open 52 weeks a year (excluding bank holidays)
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-base font-black text-foreground uppercase tracking-wider mb-5 flex items-center gap-2">
              📍 Our Settings
            </h4>
            <div className="space-y-5">
              {/* Branch 1 */}
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-4.5 border-2 border-orange-200 space-y-2 shadow-sm">
                <span className="block font-black text-orange-600 text-xs uppercase tracking-wider flex items-center gap-1">
                  🏠 Branch 1 (Main)
                </span>
                <span className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0 mt-1" />
                  <span>Manor Methodist Church, Galleywall Road, SE16 3PB</span>
                </span>
                <span className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  <Phone className="h-4 w-4 text-orange-500 shrink-0 mt-1" />
                  <span className="leading-relaxed font-bold text-foreground">
                    07359760335 / 07863862973 / 020 8109 8601
                  </span>
                </span>
                <span className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  <Mail className="h-4 w-4 text-orange-500 shrink-0" />
                  <a href="mailto:info@bubblydnursery.co.uk" className="font-bold text-orange-600 hover:underline">
                    info@bubblydnursery.co.uk
                  </a>
                </span>
              </div>

              {/* Branch 2 */}
              <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm rounded-2xl p-4.5 border-2 border-teal-200 space-y-2 shadow-sm">
                <span className="block font-black text-teal-600 text-xs uppercase tracking-wider flex items-center gap-1">
                  🏫 Branch 2 (New Setting)
                </span>
                <span className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  <MapPin className="h-4 w-4 text-teal-500 shrink-0 mt-1" />
                  <span>St Gertrudes Church Hall, Corbetts Lane, London, SE16 2BQ</span>
                </span>
                <span className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground font-medium">
                  <Mail className="h-4 w-4 text-teal-500 shrink-0" />
                  <a href="mailto:bubblyd2nursery@gmail.com" className="font-bold text-teal-600 hover:underline">
                    bubblyd2nursery@gmail.com
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t-2 border-orange-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm font-bold text-muted-foreground">
            🌟 &copy; {currentYear} Bubbly Day Nursery. All rights reserved. Made with 💛 for little ones.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-xs sm:text-sm font-bold text-muted-foreground hover:text-orange-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs sm:text-sm font-bold text-muted-foreground hover:text-orange-600 transition-colors"
            >
              Terms of Service
            </Link>
            <div className="border-l-2 border-orange-200 pl-4 flex items-center">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
      <FloatingCallButton />
    </footer>
  );
}
