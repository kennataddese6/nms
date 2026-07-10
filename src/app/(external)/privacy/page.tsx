import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            At Bubbly Day Nursery, we take data privacy and GDPR safeguarding rules very seriously. We only collect the
            minimal profile and emergency details necessary to care for children and coordinate parent messaging or
            invoice balances.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Full compliance documents, details on secure Supabase database encryptions, data storage retention limits,
            and cookies policies will be published here in subsequent phases.
          </p>
        </div>
      </main>
      <NurseryFooter />
    </div>
  );
}
