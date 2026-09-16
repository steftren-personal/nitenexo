import { NavBar } from "@/components/marketing/NavBar";
import { Footer } from "@/components/marketing/Footer";
import { HomeScreen } from "@/components/screens/HomeScreen";
import "./home.css";

export default function HomePage() {
  return (
    <div className="nn-home">
      <NavBar polarity="dark" />
      <main><HomeScreen /></main>
      <Footer calm />
    </div>
  );
}
