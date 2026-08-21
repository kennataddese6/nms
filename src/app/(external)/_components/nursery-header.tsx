"use client";

import * as React from "react";

import Image from "next/image";
import Link from "next/link";

import { ChevronDown, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NurseryHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  const nurseryLifeLinks = [
    { name: "Classrooms & Rooms", href: "/rooms", desc: "Explore age-appropriate learning spaces & routines", emoji: "🚪" },
    { name: "EYFS Curriculum", href: "/curriculum", desc: "Our 7 learning milestones & play framework", emoji: "📖" },
    { name: "Nutrition Food Menu", href: "/menu", desc: "Weekly freshly prepared hot meals & healthy snacks", emoji: "🍎" },
  ];

  const communityLinks = [
    { name: "News & Events", href: "/news", desc: "Bulletins, term dates & nursery celebrations", emoji: "📰" },
    { name: "Photo Gallery", href: "/gallery", desc: "Playtime photos & learning moments", emoji: "🖼️" },
    { name: "Careers & Jobs", href: "/careers", desc: "Join our passionate early years teaching team", emoji: "💼" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-orange-300/60 bg-gradient-to-r from-sky-200/90 via-cyan-100/85 to-emerald-100/85 backdrop-blur-xl shadow-md dark:from-neutral-950/90 dark:via-neutral-900/90 dark:to-neutral-950/90">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Bigger Logo & Brand Name */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0 py-1">
          <div className="relative h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-2xl bg-orange-100 ring-4 ring-orange-200 group-hover:ring-orange-400 transition-all shadow-md shrink-0">
            <Image
              src="/images/logo.png"
              alt="Bubbly Day Nursery logo"
              fill
              className="object-cover group-hover:scale-105 transition-transform"
              sizes="64px"
              priority
            />
          </div>
          <span className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-foreground">
            Bubbly <span className="text-orange-500">Nursery</span>
          </span>
        </Link>

        {/* Desktop Grouped Nav - Clean 4 Primary Items */}
        <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
          {/* 1. About Us */}
          <Link
            href="/about"
            className="text-base font-extrabold text-foreground/90 hover:text-orange-600 transition-colors py-1"
          >
            About Us
          </Link>

          {/* 2. Nursery Life Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-base font-extrabold text-foreground/90 hover:text-orange-600 transition-colors py-1 outline-none">
              <span>Nursery Life</span>
              <ChevronDown className="h-4 w-4 text-orange-500 stroke-[2.5]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2 rounded-2xl border-2 border-orange-200 shadow-xl bg-white/95 backdrop-blur-md space-y-1">
              {nurseryLifeLinks.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="rounded-xl p-2.5 cursor-pointer focus:bg-orange-50 focus:text-orange-900 transition-colors">
                  <Link href={item.href} className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                    <div>
                      <span className="block font-black text-sm text-foreground">{item.name}</span>
                      <span className="block text-xs text-muted-foreground leading-snug font-medium mt-0.5">{item.desc}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3. News & Community Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 text-base font-extrabold text-foreground/90 hover:text-orange-600 transition-colors py-1 outline-none">
              <span>Community & News</span>
              <ChevronDown className="h-4 w-4 text-orange-500 stroke-[2.5]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-80 p-2 rounded-2xl border-2 border-orange-200 shadow-xl bg-white/95 backdrop-blur-md space-y-1">
              {communityLinks.map((item) => (
                <DropdownMenuItem key={item.href} asChild className="rounded-xl p-2.5 cursor-pointer focus:bg-orange-50 focus:text-orange-900 transition-colors">
                  <Link href={item.href} className="flex items-start gap-3">
                    <span className="text-xl shrink-0 mt-0.5">{item.emoji}</span>
                    <div>
                      <span className="block font-black text-sm text-foreground">{item.name}</span>
                      <span className="block text-xs text-muted-foreground leading-snug font-medium mt-0.5">{item.desc}</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 4. Contact */}
          <Link
            href="/contact"
            className="text-base font-extrabold text-foreground/90 hover:text-orange-600 transition-colors py-1"
          >
            Contact
          </Link>
        </nav>

        {/* Portal Login & Tour Action Buttons */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button asChild variant="outline" className="rounded-full border-2 border-orange-200 text-sm font-bold h-11 px-5 hover:bg-orange-50">
            <Link href="/auth/v1/login">Parent Portal</Link>
          </Button>
          <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm h-11 px-5 shadow-md shadow-orange-500/20">
            <Link href="/contact?tour=true">Book a Visit 🎈</Link>
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2.5 rounded-xl text-foreground bg-orange-50 border border-orange-200 hover:bg-orange-100 focus:outline-none lg:hidden"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? <X className="block h-7 w-7 text-orange-600" /> : <Menu className="block h-7 w-7 text-orange-600" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-b-2 border-orange-200 bg-background animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-4 px-6 pb-6 pt-4">
            <div>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-lg font-black text-foreground hover:text-orange-600 border-b border-orange-100"
              >
                About Us
              </Link>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider block">Nursery Life</span>
              {nurseryLifeLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 py-1.5 text-base font-bold text-foreground/90 hover:text-orange-600"
                >
                  <span>{link.emoji}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-orange-100">
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider block">Community & News</span>
              {communityLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 py-1.5 text-base font-bold text-foreground/90 hover:text-orange-600"
                >
                  <span>{link.emoji}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-orange-100">
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-lg font-black text-foreground hover:text-orange-600"
              >
                Contact Us
              </Link>
            </div>

            <div className="mt-4 flex flex-col gap-3 pt-3 border-t border-orange-100">
              <Button asChild variant="outline" className="w-full justify-center rounded-full text-base font-bold h-12 border-2 border-orange-200">
                <Link href="/auth/v1/login" onClick={() => setIsOpen(false)}>
                  Parent Portal
                </Link>
              </Button>
              <Button asChild className="w-full justify-center rounded-full text-base font-bold h-12 bg-orange-500 hover:bg-orange-600 text-white shadow-md">
                <Link href="/contact?tour=true" onClick={() => setIsOpen(false)}>
                  Book a Visit 🎈
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
