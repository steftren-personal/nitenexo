import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { BackgroundVideo } from "@/components/screens/BackgroundVideo";

// Start — dark marketing landing for NiteNexo Solutions. A single robot video
// runs fixed behind the whole page; all content scrolls over it as one piece.
export default function HomePage() {
  return (
    <>
      <BackgroundVideo />
      <div style={{ position: "relative", zIndex: 1 }}>
        <NavBar polarity="dark" />
        <HomeScreen />
        <Footer />
      </div>
    </>
  );
}
