import type { Metadata } from "next";
import { LegalLayout, LegalSection, LegalList, PH, legalLink } from "@/components/marketing/Legal";

export const metadata: Metadata = {
  title: "Impressum — NiteNexo Solutions",
  description: "Offenlegung gemäß § 5 ECG, § 25 MedienG und § 14 UGB.",
};

export default function ImpressumPage() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Impressum"
      intro="Offenlegung gemäß § 5 E-Commerce-Gesetz (ECG), § 25 Mediengesetz und § 14 Unternehmensgesetzbuch (UGB)."
      updated="Juni 2026"
    >
      <LegalSection title="Medieninhaber & Diensteanbieter">
        <p style={{ margin: 0 }}>
          Stefan Trendafilov
          <br />
          NiteNexo Solutions (Geschäftsbezeichnung)
          <br />
          Schumanngasse 9
          <br />
          1180 Wien, Österreich
        </p>
      </LegalSection>

      <LegalSection title="Kontakt">
        <p style={{ margin: 0 }}>
          E-Mail: <a href="mailto:info@nitenexo.at" style={legalLink}>info@nitenexo.at</a>
          <br />
          Telefon: <a href="tel:+436609390787" style={legalLink}>+43 660 9390787</a>
        </p>
      </LegalSection>

      <LegalSection title="Unternehmensdaten">
        <LegalList
          items={[
            "Unternehmensform: Einzelunternehmen",
            "Unternehmensgegenstand: IT-Dienstleistungen — WhatsApp-Chatbots, Website-Design und digitale Assistenten",
            "UID-Nummer: nicht vorhanden — Kleinunternehmer gemäß § 6 Abs 1 Z 27 UStG (keine Umsatzsteuer)",
            "Firmenbuch: keine Eintragung (nicht eintragungspflichtiges Einzelunternehmen)",
          ]}
        />
      </LegalSection>

      <LegalSection title="Gewerbe & Behörden">
        <LegalList
          items={[
            "Berufsbezeichnung: IT-Dienstleister (Gewerbe ausgeübt in Österreich)",
            <span key="wk">Mitglied der Wirtschaftskammer Wien, <PH>Fachgruppe ergänzen</PH></span>,
            "Anwendbare Rechtsvorschrift: Gewerbeordnung (GewO), abrufbar unter www.ris.bka.gv.at",
            "Gewerbebehörde: Magistratisches Bezirksamt des XVIII. Wiener Gemeindebezirks",
          ]}
        />
      </LegalSection>

      <LegalSection title="Verbraucherinformationen zur Online-Streitbeilegung">
        <p style={{ margin: 0 }}>
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={legalLink}>
            ec.europa.eu/consumers/odr
          </a>
          . Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Inhalte">
        <p style={{ margin: 0 }}>
          Die Inhalte dieser Seiten wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit,
          Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als
          Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
          verantwortlich, jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
          Informationen zu überwachen.
        </p>
      </LegalSection>

      <LegalSection title="Haftung für Links">
        <p style={{ margin: 0 }}>
          Unser Angebot enthält gegebenenfalls Links zu externen Websites Dritter, auf deren Inhalte
          wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige
          Anbieter oder Betreiber der Seiten verantwortlich.
        </p>
      </LegalSection>

      <LegalSection title="Urheberrecht">
        <p style={{ margin: 0 }}>
          Die auf dieser Website erstellten Inhalte und Werke unterliegen dem österreichischen
          Urheberrecht. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung
          außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
