import type { Metadata } from "next";
import { LegalLayout, LegalSection, LegalList, legalLink } from "@/components/marketing/Legal";

export const metadata: Metadata = {
  title: "Datenschutzerklärung — NiteNexo Solutions",
  description: "Datenschutzerklärung nach DSGVO und österreichischem DSG.",
};

export default function DatenschutzPage() {
  return (
    <LegalLayout
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      intro="Wir nehmen den Schutz deiner persönlichen Daten ernst und verarbeiten sie nach der Datenschutz-Grundverordnung (DSGVO) und dem österreichischen Datenschutzgesetz (DSG)."
      updated="Juli 2026"
    >
      <LegalSection title="1. Verantwortlicher">
        <p style={{ margin: 0 }}>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <p style={{ margin: 0 }}>
          Stefan Trendafilov (NiteNexo Solutions)
          <br />
          Schumanngasse 9, 1180 Wien, Österreich
          <br />
          E-Mail: <a href="mailto:info@nitenexo.at" style={legalLink}>info@nitenexo.at</a> · Telefon:{" "}
          <a href="tel:+436609390787" style={legalLink}>+43 660 9390787</a>
        </p>
      </LegalSection>

      <LegalSection title="2. Grundsatz der Datensparsamkeit">
        <p style={{ margin: 0 }}>
          Wir erheben personenbezogene Daten nur, soweit dies für die Bereitstellung der Website und
          unserer Leistungen erforderlich ist. Eine Weitergabe an Dritte erfolgt nur in den
          nachfolgend beschriebenen Fällen oder wenn wir gesetzlich dazu verpflichtet sind.
        </p>
      </LegalSection>

      <LegalSection title="3. Hosting & Server-Logfiles">
        <p style={{ margin: 0 }}>
          Beim Aufruf dieser Website werden durch den Hosting-Anbieter automatisch Informationen in
          sogenannten Server-Logfiles erfasst, die dein Browser übermittelt: Browsertyp und -version,
          verwendetes Betriebssystem, Referrer-URL, Hostname des zugreifenden Rechners, Uhrzeit der
          Serveranfrage und die IP-Adresse.
        </p>
        <p style={{ margin: 0 }}>
          Diese Daten dienen der technischen Bereitstellung, Sicherheit und Stabilität der Website.
          Rechtsgrundlage ist unser berechtigtes Interesse gemäß Art. 6 Abs. 1 lit. f DSGVO.
          Hosting-Anbieter: Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Die
          Verarbeitung erfolgt auf Grundlage eines Auftragsverarbeitungsvertrags (Data Processing
          Agreement); eine mögliche Datenübermittlung in die USA ist durch die
          EU-Standardvertragsklauseln abgesichert.
        </p>
      </LegalSection>

      <LegalSection title="4. Kontaktaufnahme">
        <p style={{ margin: 0 }}>
          Wenn du uns über das Kontaktformular, per E-Mail oder Telefon kontaktierst, verarbeiten wir
          deine Angaben (z. B. Name, E-Mail-Adresse, Betrieb und deine Nachricht) ausschließlich zur
          Bearbeitung deiner Anfrage.
        </p>
        <p style={{ margin: 0 }}>
          Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie — bei Anbahnung
          eines Vertrags — Art. 6 Abs. 1 lit. b DSGVO. Die Daten werden gelöscht, sobald die Anfrage
          erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
        </p>
        <p style={{ margin: 0 }}>
          Der Versand dieser Nachrichten erfolgt über den E-Mail-Dienst von Google (Google Ireland
          Limited, Gordon House, Barrow Street, Dublin 4, Irland). Google verarbeitet die Inhalte
          deiner Anfrage als Auftragsverarbeiter für uns; Grundlage ist ein
          Auftragsverarbeitungsvertrag (Cloud Data Processing Addendum). Eine mögliche
          Datenübermittlung in die USA ist durch die EU-Standardvertragsklauseln abgesichert.
        </p>
      </LegalSection>

      <LegalSection title="5. Benutzerkonto & Terminbuchung">
        <p style={{ margin: 0 }}>
          Für die Registrierung eines Benutzerkontos und die Buchung von Terminen verarbeiten wir die
          von dir angegebenen Daten (E-Mail-Adresse, Zugangsdaten in verschlüsselter Form sowie die
          gebuchten Termine). Rechtsgrundlage ist die Erfüllung des Nutzungsverhältnisses bzw. die
          Durchführung vorvertraglicher Maßnahmen gemäß Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p style={{ margin: 0 }}>
          Für Konten- und Terminverwaltung setzen wir Supabase als Auftragsverarbeiter ein
          (Supabase Inc., USA). Die Daten werden ausschließlich in der Region Frankfurt am Main
          (EU, <code>eu-central-1</code>) gespeichert und verarbeitet. Grundlage ist ein
          Auftragsverarbeitungsvertrag; für eine mögliche Datenübermittlung in die USA gelten die
          EU-Standardvertragsklauseln.
        </p>
        <p style={{ margin: 0 }}>
          Dein Konto und die damit verbundenen Daten kannst du jederzeit löschen lassen — schreib uns
          dazu einfach an{" "}
          <a href="mailto:info@nitenexo.at" style={legalLink}>
            info@nitenexo.at
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection title="6. WhatsApp-Kommunikation">
        <p style={{ margin: 0 }}>
          Ein Kernprodukt von NiteNexo Solutions sind Chatbots über WhatsApp. Sofern du mit einem von
          uns eingerichteten Assistenten über WhatsApp kommunizierst, läuft diese Kommunikation über
          die WhatsApp-Dienste der Meta Platforms Ireland Ltd. Es gelten zusätzlich deren
          Datenschutzbestimmungen.
        </p>
        <p style={{ margin: 0 }}>
          Im Auftrag des jeweiligen Betriebs verarbeiten wir die im Chat übermittelten Daten (z. B.
          Reservierungs- oder Bestelldetails) ausschließlich zur Erbringung der angefragten Leistung.
          Für diese Verarbeitungen schließen wir mit dem Betrieb einen Auftragsverarbeitungsvertrag
          gemäß Art. 28 DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="7. Cookies & lokale Speicherung">
        <p style={{ margin: 0 }}>
          Diese Website verwendet ausschließlich technisch notwendige Cookies bzw. lokalen Speicher
          (Local Storage), z. B. um deine Cookie-Auswahl zu merken. Optionale oder analytische Cookies
          setzen wir nur nach deiner ausdrücklichen Einwilligung über das Cookie-Banner, die du
          jederzeit widerrufen kannst. Rechtsgrundlage für notwendige Cookies ist Art. 6 Abs. 1 lit. f
          DSGVO, für optionale Cookies Art. 6 Abs. 1 lit. a DSGVO.
        </p>
      </LegalSection>

      <LegalSection title="8. Deine Rechte">
        <p style={{ margin: 0 }}>Dir stehen gegenüber uns folgende Rechte hinsichtlich deiner personenbezogenen Daten zu:</p>
        <LegalList
          items={[
            "Recht auf Auskunft (Art. 15 DSGVO)",
            "Recht auf Berichtigung (Art. 16 DSGVO)",
            "Recht auf Löschung (Art. 17 DSGVO)",
            "Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)",
            "Recht auf Datenübertragbarkeit (Art. 20 DSGVO)",
            "Recht auf Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)",
            "Recht auf Widerruf einer erteilten Einwilligung (Art. 7 Abs. 3 DSGVO)",
          ]}
        />
        <p style={{ margin: 0 }}>
          Zur Ausübung genügt eine formlose Nachricht an{" "}
          <a href="mailto:info@nitenexo.at" style={legalLink}>info@nitenexo.at</a>.
        </p>
      </LegalSection>

      <LegalSection title="9. Beschwerderecht">
        <p style={{ margin: 0 }}>
          Du hast das Recht, dich bei einer Aufsichtsbehörde zu beschweren. In Österreich ist dies die
          Österreichische Datenschutzbehörde, Barichgasse 40–42, 1030 Wien,{" "}
          <a href="https://www.dsb.gv.at" target="_blank" rel="noopener noreferrer" style={legalLink}>
            www.dsb.gv.at
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
