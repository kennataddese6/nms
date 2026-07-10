import { Hero } from "./_components/hero";
import { Highlights } from "./_components/highlights";
import { NurseryFooter } from "./_components/nursery-footer";
import { NurseryHeader } from "./_components/nursery-header";
import { RoomsPreview } from "./_components/rooms-preview";
import { Testimonials } from "./_components/testimonials";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow animate-fade-in">
        <Hero />
        <Highlights />
        <RoomsPreview />
        <Testimonials />
      </main>
      <NurseryFooter />
    </div>
  );
}
