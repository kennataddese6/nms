import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-black text-foreground mb-6">Terms of Service</h1>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Welcome to Bubbly Day Nursery's platform terms. By accessing our marketing website or registering on the
            parent portal, you agree to comply with safe usage guidelines and billing agreements.
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Detailed session booking cancelation times, direct-debit schedules, government free-childcare funding hours
            limits, and user responsibilities will be fully populated in subsequent phases.
          </p>
        </div>
      </main>
      <NurseryFooter />
    </div>
  );
}
