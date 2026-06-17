import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { BackgroundGradientAnimation } from "@/components/ui/BackgroundGradientAnimation";

// Start — dark marketing landing for NiteNexo Solutions. An animated gradient
// (violet/pink/lime gooey blobs) sits fixed behind the content, tamed by a dark
// scrim for legibility; the interactive mascot lives in the hero.
export default function HomePage() {
  return (
    <>
      <div className="bw-page-bg" aria-hidden="true" />
      <div aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden" }}>
        <BackgroundGradientAnimation interactive={false} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,11,26,0.5)", pointerEvents: "none" }} />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <NavBar polarity="dark" />
        <HomeScreen />
        <Footer />
      </div>
    </>
  );
}
