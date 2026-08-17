import { Mail, MapPin, Phone } from "lucide-react";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { ContactForms } from "./_components/contact-forms";

export default function ContactPage() {
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
              Visit Our Settings
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
                  <h2 className="text-3xl font-extrabold text-foreground mb-4">Nursery Branches</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our admissions coordinators are on hand to support parent queries, process child registrations, and
                    schedule personalized walkthroughs at either setting.
                  </p>
                </div>

                {/* Branch Cards */}
                <div className="space-y-6">
                  {/* Branch 1 */}
                  <div className="p-6 rounded-3xl border bg-card space-y-4">
                    <div className="flex gap-3.5 items-start">
                      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-primary uppercase tracking-wider">
                          Branch 1 (Main)
                        </span>
                        <h4 className="text-lg font-bold text-foreground mt-1">BUBBLY DAY NURSERY LIMITED</h4>
                        <p className="text-xs text-muted-foreground mt-0.5 font-medium">Company number 15176895</p>
                        <p className="text-sm font-semibold text-foreground mt-2 leading-relaxed">
                          Manor Methodist Church, Galleywall Road, London, SE16 3PB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-semibold block uppercase tracking-wider text-[10px]">Phone lines</span>
                        <a href="tel:07359760335" className="block font-bold text-foreground hover:text-primary">07359760335</a>
                        <a href="tel:07863862973" className="block font-bold text-foreground hover:text-primary">07863862973</a>
                        <a href="tel:02081098601" className="block font-bold text-foreground hover:text-primary">020 8109 8601</a>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-semibold block uppercase tracking-wider text-[10px]">Email addresses</span>
                        <a href="mailto:info@bubblydnursery.co.uk" className="block font-bold text-primary hover:underline break-all">info@bubblydnursery.co.uk</a>
                        <a href="mailto:bubblydnursery@gmail.com" className="block font-bold text-primary hover:underline break-all">bubblydnursery@gmail.com</a>
                      </div>
                    </div>
                  </div>

                  {/* Branch 2 */}
                  <div className="p-6 rounded-3xl border bg-card space-y-4">
                    <div className="flex gap-3.5 items-start">
                      <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-secondary/15 text-secondary-foreground">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="block text-xs font-semibold text-secondary-foreground uppercase tracking-wider">
                          Branch 2 (New Setting)
                        </span>
                        <h4 className="text-lg font-bold text-foreground mt-1">Bubbly Day Nursery</h4>
                        <p className="text-sm font-semibold text-foreground mt-2 leading-relaxed">
                          St Gertrudes Church Hall, Corbetts Lane, London, SE16 2BQ
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4 text-xs space-y-1">
                      <span className="text-muted-foreground font-semibold block uppercase tracking-wider text-[10px]">Email addresses</span>
                      <a href="mailto:info@bubblydnursery.co.uk" className="block font-bold text-primary hover:underline break-all">info@bubblydnursery.co.uk</a>
                      <a href="mailto:bubblyd2nursery@gmail.com" className="block font-bold text-primary hover:underline break-all">bubblyd2nursery@gmail.com</a>
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
