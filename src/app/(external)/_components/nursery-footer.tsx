import Link from "next/link";
import Image from "next/image";

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
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-primary/10">
                <Image
                  src="/images/logo.png"
                  alt="Bubbly Day Nursery logo"
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <span className="font-heading font-bold text-xl tracking-tight text-foreground">
                Bubbly <span className="text-primary">Nursery</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-xs leading-relaxed max-w-xs">
              A warm, stimulating, and child-centric environment providing babies, toddlers, and preschool children a
              significant bubbly headstart in their learning and development.
            </p>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold space-y-0.5 mt-2">
              <span className="block text-foreground font-bold">BUBBLY DAY NURSERY LIMITED</span>
              <span className="block">Company number 15176895</span>
            </div>
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
                <Link href="/menu" className="text-sm text-muted-foreground hover:text-primary">
                  Nursery Food Menu
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
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider mb-4">Our Settings</h4>
            <div className="space-y-6 text-xs text-muted-foreground">
              {/* Branch 1 */}
              <div className="space-y-1.5">
                <span className="block font-bold text-primary text-[10px] uppercase tracking-wider">Branch 1 (Main)</span>
                <span className="flex items-start gap-2 text-xs">
                  <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Manor Methodist Church, Galleywall Road, SE16 3PB</span>
                </span>
                <span className="flex items-start gap-2 text-xs">
                  <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-relaxed">07359760335 /<br />07863862973 /<br />020 8109 8601</span>
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <Mail className="h-4 w-4 text-primary shrink-0" />
                  <a href="mailto:info@bubblydnursery.co.uk" className="hover:text-primary">info@bubblydnursery.co.uk</a>
                </span>
              </div>

              {/* Branch 2 */}
              <div className="space-y-1.5 pt-4 border-t border-border">
                <span className="block font-bold text-teal-600 dark:text-teal-400 text-[10px] uppercase tracking-wider">Branch 2 (New Setting)</span>
                <span className="flex items-start gap-2 text-xs">
                  <MapPin className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                  <span>St Gertrudes Church Hall, Corbetts Lane, London, SE16 2BQ</span>
                </span>
                <span className="flex items-center gap-2 text-xs">
                  <Mail className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
                  <a href="mailto:bubblyd2nursery@gmail.com" className="hover:text-primary">bubblyd2nursery@gmail.com</a>
                </span>
              </div>
            </div>
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
