import { Mail, MapPin, Phone, Sparkles } from "lucide-react";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-primary/10 py-16 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              Contact Us & Book a Visit
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or want to tour our nursery classroom? Get in touch with our friendly management team.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 sm:py-24 bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {/* Left Column: Contact details */}
              <div className="space-y-8 flex flex-col justify-center">
                <div>
                  <h2 className="text-3xl font-extrabold text-foreground mb-4">Get In Touch</h2>
                  <p className="text-muted-foreground text-sm">
                    Drop by, give us a call, or write an email. We are here to support parent partnerships and explain
                    child care hours allocations.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4 items-start">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Phone Number</h4>
                      <p className="text-muted-foreground text-sm">+44 123 456 7890</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-secondary/15 text-secondary-foreground">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Email Address</h4>
                      <p className="text-muted-foreground text-sm">hello@bubblydaynursery.com</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-accent/15 text-accent-foreground">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Nursery Location</h4>
                      <p className="text-muted-foreground text-sm">12 Bubbles Road, London, SW1A 1AA</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Placeholder booking box */}
              <div className="p-8 rounded-3xl bg-background border shadow-md flex flex-col justify-center text-center">
                <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Visit Booking Portal Under Construction</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  We are developing an automated tour reservation calendar. Soon you will be able to check available
                  slots, pick dates, and receive automated email booking confirmations.
                </p>
                <div className="text-xs text-muted-foreground border-t pt-4">
                  For immediate tour inquiries, please contact us by phone or email.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
