import { NurseryHeader } from "../_components/nursery-header";
import { NurseryFooter } from "../_components/nursery-footer";
import { BookOpen, HelpCircle, FileText, Gift, Info } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function ParentInfoPage() {
  const fees = [
    { age: "Babies (3m - 2y)", day: "£90 / day", am: "£55", pm: "£50" },
    { age: "Toddlers (2y - 3y)", day: "£85 / day", am: "£52", pm: "£48" },
    { age: "Preschool (3y - 5y)", day: "£80 / day", am: "£48", pm: "£45" },
  ];

  const faqs = [
    {
      q: "What are the opening and closing hours?",
      a: "Bubbly Day Nursery is open Monday through Friday from 7:30 AM to 6:00 PM. We are closed on bank holidays and for a brief week during the Christmas season.",
    },
    {
      q: "How does the settling-in process work?",
      a: "We offer three complimentary settling-in sessions of increasing length before your child starts full attendance. This allows them to bond with their key practitioner and adapt to classroom rhythms.",
    },
    {
      q: "Are hot meals and snacks included in the fees?",
      a: "Yes! All day fees include a hot freshly cooked lunch, high tea, morning/afternoon milk, fruit, and snacks prepared daily by our nursery chef.",
    },
    {
      q: "Do you accept government funding hours?",
      a: "Absolutely. We support the 15-hour and 30-hour free childcare schemes for eligible children, which can be applied directly to invoice deductions during term times.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-primary/10 py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/3 -z-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-4 py-1.5 text-xs font-semibold mb-4">
              <Info className="h-4 w-4" />
              Parent Resources
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Parent Information Hub
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Find detail sheets on fee schedules, government funding hours allocations, policy handbooks, and FAQs.
            </p>
          </div>
        </section>

        {/* Fees & Funding Grid */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto">
              
              {/* Left Column: Fees Table */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
                  <Gift className="h-7 w-7 text-primary" />
                  Fees & Session Rates
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Our transparent rates cover all nappies, formula milks, cooked meals, and curriculum resources. Fees are billed monthly in advance.
                </p>

                <div className="overflow-hidden rounded-3xl border shadow-sm bg-card">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b bg-neutral-50/50 text-xs font-semibold text-muted-foreground">
                        <th className="p-4">Age Group</th>
                        <th className="p-4">Full Day</th>
                        <th className="p-4">Morning Session</th>
                        <th className="p-4">Afternoon Session</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {fees.map((f) => (
                        <tr key={f.age} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="p-4 font-bold text-foreground">{f.age}</td>
                          <td className="p-4 text-primary font-bold">{f.day}</td>
                          <td className="p-4 text-muted-foreground">{f.am}</td>
                          <td className="p-4 text-muted-foreground">{f.pm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Funding Schemes */}
              <div className="lg:col-span-5 bg-card p-8 rounded-3xl border shadow-sm space-y-6">
                <h3 className="text-2xl font-bold text-foreground">Free Childcare Funding</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  The government provides free hours allowances for childcare support. We help you map out allocations:
                </p>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border bg-background space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase">15 Hours Scheme</span>
                    <h4 className="font-bold text-sm text-foreground">Universal Early Years Funding</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Available to all families for children aged 3 and 4 years old, starting the term following their 3rd birthday.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border bg-background space-y-1">
                    <span className="text-[10px] font-bold text-secondary-foreground uppercase">30 Hours Scheme</span>
                    <h4 className="font-bold text-sm text-foreground">Working Parent Care Funding</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Extended hours for working parents in England who satisfy minimum and maximum income thresholds.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Accordions FAQs & Downloads */}
        <section className="py-16 sm:py-20 bg-card border-t">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 max-w-6xl mx-auto">
              
              {/* Left Column: Handbooks & Downloads */}
              <div className="lg:col-span-4 space-y-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  Policy Downloads
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  Download digital PDFs of our parent guidebooks, health policies, and terms of service.
                </p>
                <div className="space-y-2">
                  <a href="#" className="flex items-center justify-between p-4 rounded-2xl border bg-background hover:bg-neutral-50/50 transition-colors text-xs font-semibold text-foreground">
                    <span>Nursery Parent Handbook (PDF)</span>
                    <span className="text-primary">Download</span>
                  </a>
                  <a href="#" className="flex items-center justify-between p-4 rounded-2xl border bg-background hover:bg-neutral-50/50 transition-colors text-xs font-semibold text-foreground">
                    <span>Healthy Eating & Food Policy</span>
                    <span className="text-primary">Download</span>
                  </a>
                  <a href="#" className="flex items-center justify-between p-4 rounded-2xl border bg-background hover:bg-neutral-50/50 transition-colors text-xs font-semibold text-foreground">
                    <span>Safeguarding & Security Standards</span>
                    <span className="text-primary">Download</span>
                  </a>
                </div>
              </div>

              {/* Right Column: FAQ Accordion */}
              <div className="lg:col-span-8 space-y-6">
                <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-6 w-6 text-primary" />
                  Frequently Asked Questions
                </h3>
                <p className="text-muted-foreground text-xs">
                  Review answers to general nursery topics. Feel free to contact our coordinator if you need extra details.
                </p>

                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`} className="border-b">
                      <AccordionTrigger className="text-sm font-bold text-foreground py-4 text-left">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
