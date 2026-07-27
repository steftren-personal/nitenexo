import type { Metadata } from "next";
import { Space_Grotesk, Rubik } from "next/font/google";
import "./globals.css";
import { MotionRoot } from "@/components/motion/MotionRoot";
import { CinematicLayer } from "@/components/motion/CinematicLayer";
import { CookieBanner } from "@/components/marketing/CookieBanner";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-rubik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NiteNexo Solutions — Digitale Assistenten für Gastro & Clubs",
  description:
    "NiteNexo Solutions baut Websites, WhatsApp-Chatbots und digitale Automatisierungen für Gastronomie, Bars und Clubs. Reservierungen, Anfragen und Gästelisten — digital und unkompliziert.",
};

// Adds `gsap-enabled` to <html> before paint, but only when motion is allowed.
// This lets animated elements start hidden with no flicker, while reduced-motion
// and no-JS visitors always see content.
const MOTION_GATE = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('gsap-enabled')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${spaceGrotesk.variable} ${rubik.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_GATE }} />
      </head>
      <body>
        <MotionRoot />
        <CinematicLayer />
        {children}
        <CookieBanner />
        <div className="bw-grain" aria-hidden="true" />
      </body>
    </html>
  );
}
