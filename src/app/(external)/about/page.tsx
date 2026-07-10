import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { AboutHero } from "./_components/about-hero";
import { Philosophy } from "./_components/philosophy";
import { Safeguarding } from "./_components/safeguarding";
import { Team } from "./_components/team";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground animate-fade-in">
      <NurseryHeader />
      <main className="flex-grow">
        <AboutHero />
        <Philosophy />
        <Safeguarding />
        <Team />
      </main>
      <NurseryFooter />
    </div>
  );
}
