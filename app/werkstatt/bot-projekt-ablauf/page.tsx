import type { Metadata } from "next";
import { ArticleLayout, H2, P, UL, Pull } from "@/components/marketing/ArticleLayout";
import { articleBySlug } from "@/lib/werkstatt";

const article = articleBySlug("bot-projekt-ablauf")!;

export const metadata: Metadata = {
  title: `${article.title} — NiteNexo Solutions`,
  description: article.excerpt,
};

export default function Page() {
  return (
    <ArticleLayout article={article}>
      <P>
        &bdquo;Digitalisierungsprojekt&ldquo; klingt nach Monaten, Meetings und einem Budget, das dir jemand
        erst noch erklären muss. Bei einem Assistenten für deinen Betrieb ist es das nicht — hier
        steht, was tatsächlich passiert.
      </P>

      <H2>1 · Das Gespräch (15 Minuten)</H2>
      <P>
        Wir reden nicht über Technik, sondern über deinen Abend. Wo kommen die Anfragen rein? Wer
        beantwortet sie gerade — und wann? Was ist die Frage, die dir am häufigsten gestellt wird?
        Was passiert, wenn samstags alle gleichzeitig schreiben?
      </P>
      <P>
        Am Ende dieses Gesprächs sagen wir dir ehrlich, ob sich ein Assistent für dich rechnet. Wenn
        bei dir kaum jemand schreibt, sagen wir das auch.
      </P>

      <H2>2 · Dein Ablauf auf Papier</H2>
      <P>
        Wir schreiben auf, wie es bei dir wirklich läuft — nicht, wie es idealerweise laufen
        sollte. Dazu gehören auch die Ausnahmen: Der Stammgast, der immer denselben Tisch will. Die
        Küche, die ab 22 Uhr nichts Warmes mehr macht. Der Montag, an dem zu ist.
      </P>
      <P>
        Genau diese Ausnahmen entscheiden später, ob ein Bot hilfreich oder peinlich ist. Du
        bekommst danach einen Festpreis, keine Schätzung mit offenem Ende.
      </P>

      <Pull>Wir bauen deinen echten Ablauf nach — nicht den, den die Software sich wünscht.</Pull>

      <H2>3 · Einrichtung und Test</H2>
      <P>
        Jetzt bauen wir. Du musst dabei nichts tun außer erreichbar sein für Rückfragen. Bevor
        irgendetwas live geht, testen wir mit echten Beispiel-Anfragen aus deinem Postfach — auch
        mit den unhöflichen, den unvollständigen und den Tippfehler-Nachrichten. Ein Assistent, der
        nur perfekte Sätze versteht, ist im Nachtbetrieb wertlos.
      </P>
      <P>
        Du bekommst den Testzugang und kannst selbst schreiben, was dir einfällt. Was dir nicht
        gefällt, ändern wir vor der Live-Schaltung.
      </P>

      <H2>4 · Live und Einschulung</H2>
      <P>
        Die Schaltung selbst dauert wenige Minuten. Wichtiger ist die kurze Einschulung für dein
        Team: Woran erkenne ich, dass der Bot übernommen hat? Wie steige ich in ein Gespräch ein,
        wenn ich selbst antworten will? Wie schalte ich ihn für einen Abend ab?
      </P>
      <P>
        In den ersten Tagen schauen wir mit und justieren nach, wenn echte Gäste Dinge fragen, an
        die vorher niemand gedacht hat — das ist normal und der Grund, warum wir danach nicht
        einfach verschwinden.
      </P>

      <H2>Was wir von dir brauchen</H2>
      <UL
        items={[
          "Deine Öffnungszeiten inklusive der Ausnahmen (Feiertage, Ruhetag, Küchenschluss)",
          "Speise- und Getränkekarte in irgendeiner Form — PDF, Foto, Link",
          "Wie viele Plätze du hast und wie du derzeit einteilst",
          "Zugang zu der Nummer oder dem Kanal, über den geschrieben werden soll",
          "Eine Person bei dir, die Fragen beantworten darf",
        ]}
      />
      <P>
        Mehr nicht. Kein Vorwissen, keine neue Hardware, kein Systemwechsel in deinem Betrieb.
      </P>
    </ArticleLayout>
  );
}
