import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { HomeScreen } from "@/components/screens/HomeScreen";

// Start — dark marketing landing for NiteNexo Solutions. The film's world IS
// the page's world: the ThreadFilm ending frame (the ordered light field)
// sits fixed behind the entire page with a whisper-slow drift, so scrolling
// out of the film continues seamlessly into the same environment.
export default function HomePage() {
  return (
    <>
      <div className="bw-page-bg" aria-hidden="true" />
      <div className="thread-env" aria-hidden="true">
        <div className="thread-env-img" />
        <div className="thread-env-scrim" />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <NavBar polarity="dark" />
        <HomeScreen />
        <Footer />
      </div>
    </>
  );
}
