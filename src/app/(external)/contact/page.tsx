import { ExternalLink, Mail, MapPin, Phone, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { ContactForms } from "./_components/contact-forms";

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-50 text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-100 py-16 sm:py-20 text-center relative overflow-hidden">
          {/* Ambient glow blobs */}
          <div className="absolute top-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-yellow-300/30 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-pink-300/20 blur-3xl" />

          {/* Floating decorations */}
          <span
            aria-hidden="true"
            className="absolute top-6 left-10 text-3xl pointer-events-none select-none nursery-twinkle opacity-60 hidden sm:block"
          >
            ⭐
          </span>
          <span
            aria-hidden="true"
            className="absolute top-10 right-12 text-3xl pointer-events-none select-none nursery-float opacity-60 hidden sm:block"
            style={{ animationDelay: "0.8s" }}
          >
            📍
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-1/4 text-2xl pointer-events-none select-none nursery-wiggle opacity-50 hidden md:block"
          >
            🎈
          </span>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 text-sky-800 px-4 py-1.5 text-xs font-bold shadow-sm mb-4">
              <MapPin className="h-4 w-4 text-orange-500" />
              Visit Our Settings
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-sky-950 tracking-tight leading-[1.1]">
              Get In Touch & Book a Tour 🏫
            </h1>
            <p className="mt-4 text-lg text-sky-900/80 max-w-2xl mx-auto leading-relaxed">
              Have questions about registration fees, EYFS learning structures, or waitlists? Send us an enquiry or
              reserve a tour slot at either nursery setting.
            </p>
          </div>
        </section>

        {/* Support Grid & Interactive Forms */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              {/* Left Column: Office Contacts & Branch Cards */}
              <div className="lg:col-span-5 space-y-8">
                <div>
                  <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-bold rounded-full px-3.5 py-1 mb-3">
                    📍 Two Locations
                  </div>
                  <h2 className="text-3xl font-black text-foreground">Nursery Branches</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mt-2">
                    Our admissions coordinators are on hand to support parent queries, process registrations, and
                    schedule personalised walkthroughs at either setting.
                  </p>
                </div>

                {/* Branch Cards */}
                <div className="space-y-6">
                  {/* Branch 1 Card */}
                  <div className="p-6 rounded-3xl border-2 border-orange-200 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 space-y-4">
                    <div className="flex gap-3.5 items-start">
                      <div className="h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl bg-orange-100 text-orange-600 shadow-sm">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-black text-orange-600 uppercase tracking-wider bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                          Branch 1 (Main)
                        </span>
                        <h4 className="text-lg font-black text-foreground mt-1">BUBBLY DAY NURSERY LIMITED</h4>
                        <p className="text-xs text-muted-foreground font-medium">Company number 15176895</p>
                        <p className="text-sm font-bold text-foreground mt-2 leading-relaxed">
                          Manor Methodist Church, Galleywall Road, London, SE16 3PB
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-orange-100 pt-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-bold block uppercase tracking-wider text-[10px]">
                          Phone lines
                        </span>
                        <a
                          href="tel:07359760335"
                          className="block font-bold text-foreground hover:text-orange-500 transition-colors"
                        >
                          07359760335
                        </a>
                        <a
                          href="tel:07863862973"
                          className="block font-bold text-foreground hover:text-orange-500 transition-colors"
                        >
                          07863862973
                        </a>
                        <a
                          href="tel:02081098601"
                          className="block font-bold text-foreground hover:text-orange-500 transition-colors"
                        >
                          020 8109 8601
                        </a>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-bold block uppercase tracking-wider text-[10px]">
                          Email addresses
                        </span>
                        <a
                          href="mailto:info@bubblydnursery.co.uk"
                          className="block font-bold text-orange-600 hover:underline break-all"
                        >
                          info@bubblydnursery.co.uk
                        </a>
                        <a
                          href="mailto:bubblydnursery@gmail.com"
                          className="block font-bold text-orange-600 hover:underline break-all"
                        >
                          bubblydnursery@gmail.com
                        </a>
                      </div>
                    </div>

                    {/* Google Map Embed for Branch 1 */}
                    <div className="mt-4 pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-orange-500" /> Interactive Map (Branch 1)
                        </span>
                        <a
                          href="https://maps.google.com/?q=Manor+Methodist+Church,+Galleywall+Road,+London+SE16+3PB"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-orange-600 hover:underline flex items-center gap-1"
                        >
                          Open in Google Maps <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="relative w-full h-52 rounded-2xl overflow-hidden border-2 border-orange-200 shadow-inner bg-neutral-100">
                        <iframe
                          title="Branch 1 Google Map"
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d352.41846114670216!2d-0.05981244358831666!3d51.49031590547794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487603d54d7c527b%3A0xdaf0a75a15626080!2sBubbly%20Day%20Nursery!5e0!3m2!1sen!2sus!4v1787302151549!5m2!1sen!2sus"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Branch 2 Card */}
                  <div className="p-6 rounded-3xl border-2 border-teal-200 bg-white/90 backdrop-blur-sm shadow-md hover:shadow-xl transition-all duration-300 space-y-4">
                    <div className="flex gap-3.5 items-start">
                      <div className="h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl bg-teal-100 text-teal-600 shadow-sm">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="inline-block text-[10px] font-black text-teal-600 uppercase tracking-wider bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                          Branch 2 (New Setting)
                        </span>
                        <h4 className="text-lg font-black text-foreground mt-1">Bubbly Day Nursery</h4>
                        <p className="text-sm font-bold text-foreground mt-2 leading-relaxed">
                          St Gertrudes Church Hall, Corbetts Lane, London, SE16 2BQ
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-teal-100 pt-4 text-xs space-y-1">
                      <span className="text-muted-foreground font-bold block uppercase tracking-wider text-[10px]">
                        Email addresses
                      </span>
                      <a
                        href="mailto:info@bubblydnursery.co.uk"
                        className="block font-bold text-teal-600 hover:underline break-all"
                      >
                        info@bubblydnursery.co.uk
                      </a>
                      <a
                        href="mailto:bubblyd2nursery@gmail.com"
                        className="block font-bold text-teal-600 hover:underline break-all"
                      >
                        bubblyd2nursery@gmail.com
                      </a>
                    </div>

                    {/* Google Map Embed for Branch 2 */}
                    <div className="mt-4 pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-teal-500" /> Interactive Map (Branch 2)
                        </span>
                        <a
                          href="https://maps.google.com/?q=St+Gertrudes+Church+Hall,+Corbetts+Lane,+London+SE16+2BQ"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-teal-600 hover:underline flex items-center gap-1"
                        >
                          Open in Google Maps <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      <div className="relative w-full h-52 rounded-2xl overflow-hidden border-2 border-teal-200 shadow-inner bg-neutral-100">
                        <iframe
                          title="Branch 2 Google Map"
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.2487592203624!2d-0.053843300000000004!3d51.4903024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760319394c89d1%3A0x33c3b7cf834b54a9!2sSt%20Gertrude's%20Church!5e0!3m2!1sen!2sus!4v1787302207192!5m2!1sen!2sus"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen={false}
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Tabbed Forms */}
              <div className="lg:col-span-7 bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-3xl border-2 border-orange-200 shadow-lg h-fit">
                <ContactForms />
              </div>
            </div>
          </div>
        </section>

        {/* Full Width Location Maps Section */}
        <section className="py-12 bg-white/60 border-t border-b border-orange-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-full px-3.5 py-1 mb-3">
                🗺️ Find Us Easily
              </div>
              <h2 className="font-heading text-3xl font-black text-foreground">Interactive Location Maps</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Both nursery branches are situated in SE16 with easy transport access. Click or tap any map to explore
                directions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Branch 1 Large Map Card */}
              <div className="rounded-3xl border-2 border-orange-200 bg-white overflow-hidden shadow-md space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-orange-600 uppercase tracking-wider">Branch 1 (Main)</span>
                    <h3 className="text-base font-bold text-foreground">Galleywall Road Setting</h3>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full border-orange-300 text-orange-600 text-xs font-bold hover:bg-orange-50"
                  >
                    <a
                      href="https://maps.google.com/?q=Manor+Methodist+Church,+Galleywall+Road,+London+SE16+3PB"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      Directions <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
                <div className="h-72 w-full rounded-2xl overflow-hidden border border-orange-100">
                  <iframe
                    title="Branch 1 Google Map Large"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d352.41846114670216!2d-0.05981244358831666!3d51.49031590547794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487603d54d7c527b%3A0xdaf0a75a15626080!2sBubbly%20Day%20Nursery!5e0!3m2!1sen!2sus!4v1787302151549!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  📍 Manor Methodist Church, Galleywall Road, London, SE16 3PB
                </p>
              </div>

              {/* Branch 2 Large Map Card */}
              <div className="rounded-3xl border-2 border-teal-200 bg-white overflow-hidden shadow-md space-y-3 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-teal-600 uppercase tracking-wider">
                      Branch 2 (New Setting)
                    </span>
                    <h3 className="text-base font-bold text-foreground">Corbetts Lane Setting</h3>
                  </div>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="rounded-full border-teal-300 text-teal-600 text-xs font-bold hover:bg-teal-50"
                  >
                    <a
                      href="https://maps.google.com/?q=St+Gertrudes+Church+Hall,+Corbetts+Lane,+London+SE16+2BQ"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                    >
                      Directions <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>
                <div className="h-72 w-full rounded-2xl overflow-hidden border border-teal-100">
                  <iframe
                    title="Branch 2 Google Map Large"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2484.2487592203624!2d-0.053843300000000004!3d51.4903024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48760319394c89d1%3A0x33c3b7cf834b54a9!2sSt%20Gertrude's%20Church!5e0!3m2!1sen!2sus!4v1787302207192!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  📍 St Gertrudes Church Hall, Corbetts Lane, London, SE16 2BQ
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
