import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { Werkbank } from "@/components/home/Werkbank";

// Start — »Dein Samstag«. Richtung und Regeln stehen in .redesign/DESIGN.md,
// der Auftrag in .redesign/BRIEF.md.
export default function HomePage() {
  return (
    <>
      <NavBar polarity="dark" />
      <Werkbank />
      <Footer />
    </>
  );
}
