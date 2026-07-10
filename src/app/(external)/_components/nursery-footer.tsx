import Link from "next/link";

import { Baby, Clock, Mail, MapPin, Phone } from "lucide-react";

export function NurseryFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo & Intro */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Baby className="h-6 w-6 stroke-[2.5]" />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                Bubbly <span className="text-primary">Nursery</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A warm, stimulating, and child-centric environment giving babies, toddlers, and preschool children a
              bubbly headstart.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Nursery</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us & EYFS
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="text-sm text-muted-foreground hover:text-primary">
                  Classroom Rooms
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary">
                  Careers & Jobs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Opening Hours</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block font-medium text-foreground">Monday – Friday</span>
                  <span className="block text-xs">7:30 AM – 6:00 PM</span>
                </div>
              </li>
              <li className="text-xs text-muted-foreground italic pl-7">
                Closed during UK Bank Holidays and 1 week over Christmas.
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Phone className="h-4.5 w-4.5 text-primary shrink-0" />
                <a href="tel:+441234567890" className="hover:text-primary">
                  +44 123 456 7890
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-muted-foreground">
                <Mail className="h-4.5 w-4.5 text-primary shrink-0" />
                <a href="mailto:hello@bubblydaynursery.com" className="hover:text-primary break-all">
                  hello@bubblydaynursery.com
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>
                  12 Bubbles Road,
                  <br />
                  London, SW1A 1AA
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">&copy; {currentYear} Bubbly Day Nursery. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
