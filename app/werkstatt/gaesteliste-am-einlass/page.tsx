import type { Metadata } from "next";
import { ArticleLayout, H2, P, UL, Pull } from "@/components/marketing/ArticleLayout";
import { articleBySlug } from "@/lib/werkstatt";

const article = articleBySlug("gaesteliste-am-einlass")!;

export const metadata: Metadata = {
  title: `${article.title} — NiteNexo Solutions`,
  description: article.excerpt,
};

export default function Page() {
  return (
    <ArticleLayout article={article}>
      <P>
        Die Gästeliste ist der einzige Ort, an dem dein ganzer Abend durch ein einziges Nadelöhr
        muss: die Tür. Alles davor kannst du planen — hier entscheidet sich, ob es fließt.
      </P>

      <H2>Warum das Klemmbrett am Freitag kippt</H2>
      <P>
        Auf Papier funktioniert eine Liste genau so lange, wie sie kurz ist. Ab ein paar hundert
        Namen kippt das Prinzip, und zwar aus drei Gründen gleichzeitig:
      </P>
      <UL
        items={[
          "Suchen dauert. Jeder Name kostet Sekunden — bei Andrang wird daraus eine Schlange.",
          "Handschrift ist mehrdeutig. Steht da jetzt Meier, Maier oder Mayr?",
          "Die +1 ist nirgends dokumentiert. Wer wie viele mitbringen darf, weiß nur, wer es zugesagt hat.",
          "Niemand weiß live, wie viele schon drin sind — die Zahl entsteht erst beim Nachzählen.",
        ]}
      />
      <P>
        Das Ergebnis kennt jeder, der schon an einer Tür gestanden ist: Diskussionen im
        Eingangsbereich, während drinnen die Bar leer läuft.
      </P>

      <Pull>An der Tür kostet dich nicht die Entscheidung Zeit, sondern das Suchen.</Pull>

      <H2>Wie eine Gästeliste im Chat abläuft</H2>
      <P>
        Der Gast schreibt dir ohnehin — meist auf WhatsApp oder Instagram, weil dort auch dein
        Event geteilt wurde. Genau dort trägt er sich ein: Name, Anzahl, fertig. Er bekommt sofort
        eine Bestätigung im selben Chat, die er am Einlass vorzeigen kann.
      </P>
      <P>
        Für dich entsteht daraus im Hintergrund eine saubere, durchsuchbare Liste. Kein Abtippen,
        keine Handschrift, keine zweite App für den Gast.
      </P>

      <H2>Was sich an der Tür ändert</H2>
      <UL
        items={[
          "Tippen statt blättern: drei Buchstaben, der Name steht da — inklusive zugesagter Begleitung.",
          "Abhaken mit einem Griff, sichtbar für alle an der Tür gleichzeitig.",
          "Live-Zähler: Wie viele sind da, wie viele fehlen noch.",
          "Nachträge sind möglich, ohne dass jemand quer über die Liste schreibt.",
        ]}
      />
      <P>
        Praktisch heißt das: Dein Türpersonal schaut auf ein Handy oder Tablet statt auf ein
        Klemmbrett — und der Rest der Arbeit bleibt exakt derselbe.
      </P>

      <H2>Was du am Tag danach weißt</H2>
      <P>
        Der unterschätzte Teil kommt nach dem Wochenende. Weil abgehakt wurde, weißt du zum ersten
        Mal verlässlich, wie viele der Zusagen tatsächlich gekommen sind. Aus dem Bauchgefühl
        &bdquo;war gut besucht&ldquo; wird eine Zahl, mit der du das nächste Event planen kannst.
      </P>
      <P>
        Und du kannst gezielt wieder anschreiben — die, die da waren, anders als die, die abgesagt
        haben.
      </P>

      <H2>Ein Wort zum Datenschutz</H2>
      <P>
        Eine Gästeliste ist eine Sammlung personenbezogener Daten, auch auf Papier. Digital wird
        sie nicht heikler, sondern kontrollierbarer: Wir erheben nur, was für den Einlass gebraucht
        wird, halten fest, wofür es verwendet wird, und löschen nach einer vereinbarten Frist
        automatisch. Für Werbung später brauchst du eine eigene, ausdrückliche Zustimmung — die
        holt der Chat gleich sauber mit ein, wenn du das willst.
      </P>
    </ArticleLayout>
  );
}
