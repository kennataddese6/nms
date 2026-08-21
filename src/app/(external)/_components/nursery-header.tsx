"use client";

import * as React from "react";

import Image from "next/image";
import Link from "next/link";

import { Baby, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NurseryHeader() {
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: "About Us", href: "/about" },
    { name: "Rooms", href: "/rooms" },
    { name: "Curriculum", href: "/curriculum" },
    { name: "Menu", href: "/menu" },
    { name: "Gallery", href: "/gallery" },
    { name: "News & Events", href: "/news" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-orange-200/80 bg-background/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative h-12 w-12 overflow-hidden rounded-full bg-orange-100 ring-4 ring-orange-200 group-hover:ring-orange-400 transition-all shadow-sm">
            <Image
              src="/images/logo.png"
              alt="Bubbly Day Nursery logo"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <span className="font-heading font-black text-2xl tracking-tight text-foreground">
            Bubbly <span className="text-orange-500">Nursery</span> 🌟
          </span>
        </Link>

        {/* Desktop Nav - Enlarge links for superior readability */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-base font-extrabold text-foreground/80 hover:text-orange-600 transition-colors py-1"
            >
              {link.name}
            </Link>
          ))}
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
          <div className="space-y-1.5 px-6 pb-6 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2.5 text-lg font-black text-foreground/90 hover:text-orange-600 border-b border-orange-100/50"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-5 flex flex-col gap-3 pt-3">
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
