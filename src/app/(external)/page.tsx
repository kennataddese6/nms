import { Hero } from "./_components/hero";
import { Highlights } from "./_components/highlights";
import { NurseryFooter } from "./_components/nursery-footer";
import { NurseryHeader } from "./_components/nursery-header";
import { NurseryShowcase } from "./_components/nursery-showcase";
import { RoomsPreview } from "./_components/rooms-preview";
import { Testimonials } from "./_components/testimonials";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-50 text-foreground">
      <NurseryHeader />
      <main className="flex-grow animate-fade-in">
        <Hero />
        <Highlights />
        <NurseryShowcase />
        <RoomsPreview />
        <Testimonials />
      </main>
      <NurseryFooter />
    </div>
  );
}
