import { Mail, MapPin, Phone } from "lucide-react";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { ContactForms } from "./_components/contact-forms";

export default function ContactPage() {
  const contacts = [
    { icon: Phone, label: "Phone Lines", value: "+44 20 7123 4567", desc: "Mon-Fri 7:30 AM – 6:00 PM" },
    { icon: Mail, label: "Direct Email", value: "admissions@bubblynursery.co.uk", desc: "Response within 24 hours" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-primary/10 py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-4 py-1.5 text-xs font-semibold mb-4">
              <MapPin className="h-4 w-4" />
              Visit Us in London
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Get In Touch & Book a Tour
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about registration fees, EYFS learning structures, or waitlists? Send us an enquiry or
              reserve a physical tour slot.
            </p>
          </div>
        </section>

        {/* Support Grid & Interactive Forms */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
              {/* Left Column: Office Contacts & Maps */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-foreground mb-4">Nursery Office</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our admissions coordinators are on hand to support parent queries, process child registrations, and
                    schedule personalized walkthroughs.
                  </p>
                </div>

                {/* Contact channels list */}
                <div className="grid grid-cols-1 gap-4">
                  {contacts.map((c) => (
                    <div key={c.label} className="p-6 rounded-3xl border bg-card flex gap-4">
                      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-secondary/15 text-secondary-foreground">
                        <c.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          {c.label}
                        </span>
                        <span className="block text-sm font-bold text-foreground mt-0.5">{c.value}</span>
                        <span className="block text-xs text-muted-foreground mt-0.5">{c.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Location Map Placeholder Card */}
                <div className="p-6 rounded-3xl border bg-card space-y-4">
                  <div className="flex gap-3 items-start">
                    <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Nursery Address
                      </span>
                      <span className="block text-sm font-bold text-foreground mt-0.5">
                        12 Bubbles Road, London, SW1A 1AA
                      </span>
                    </div>
                  </div>

                  {/* Google maps frame mockup */}
                  <div className="aspect-video w-full rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center relative group">
                    <div className="absolute inset-0 bg-neutral-200/50 flex flex-col items-center justify-center text-center p-4">
                      <MapPin className="h-8 w-8 text-primary mb-2 animate-bounce" />
                      <span className="text-sm font-bold text-foreground">Bubbly Day Nursery London</span>
                      <span className="text-xs text-muted-foreground mt-0.5">SW1A 1AA • Near Westminster Park</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Tabbed Forms */}
              <div className="lg:col-span-7 bg-card p-8 rounded-3xl border shadow-sm h-fit">
                <ContactForms />
              </div>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
