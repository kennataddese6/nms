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
    { name: "News & Events", href: "/news" },
    { name: "Careers", href: "/careers" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10 transition-transform group-hover:scale-110">
            <Image
              src="/images/logo.png"
              alt="Bubbly Day Nursery logo"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-foreground">
            Bubbly <span className="text-primary">Nursery</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Portal Login Button */}
        <div className="hidden md:flex items-center gap-4">
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/auth/v1/login">Parent Portal</Link>
          </Button>
          <Button asChild className="rounded-full">
            <Link href="/contact?tour=true">Book a Visit</Link>
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground focus:outline-none md:hidden"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b bg-background animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-medium text-muted-foreground hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 pt-2 border-t">
              <Button asChild variant="outline" className="w-full justify-center rounded-full">
                <Link href="/auth/v1/login" onClick={() => setIsOpen(false)}>
                  Parent Portal
                </Link>
              </Button>
              <Button asChild className="w-full justify-center rounded-full">
                <Link href="/contact?tour=true" onClick={() => setIsOpen(false)}>
                  Book a Visit
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
