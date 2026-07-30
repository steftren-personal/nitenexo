import type { Metadata } from "next";
import { ArticleLayout, H2, P, UL, Pull } from "@/components/marketing/ArticleLayout";
import { articleBySlug } from "@/lib/werkstatt";

const article = articleBySlug("chatbot-mehr-reservierungen")!;

export const metadata: Metadata = {
  title: `${article.title} — NiteNexo Solutions`,
  description: article.excerpt,
};

export default function Page() {
  return (
    <ArticleLayout article={article}>
      <P>
        Die meisten Betriebe verlieren Reservierungen nicht, weil sie ausgebucht sind. Sie
        verlieren sie, weil zwischen der Frage des Gastes und der Antwort zu viel Zeit liegt.
      </P>

      <H2>Gäste fragen nicht zu Bürozeiten</H2>
      <P>
        Der Moment, in dem jemand einen Tisch will, ist selten der Moment, in dem jemand am
        Reservierungsbuch sitzt. Er entsteht abends auf der Couch, in der U-Bahn, mitten in einer
        Runde Freunde, die spontan beschließen: heute noch essen gehen. Also schreibt jemand — und
        zwar dort, wo er ohnehin gerade tippt.
      </P>
      <P>
        In deinem Betrieb landet diese Nachricht dann irgendwo: im WhatsApp-Postfach der
        Geschäftsnummer, in den Instagram-Anfragen, auf der Mailbox. Und sie bleibt liegen, bis
        jemand Zeit hat. Genau das ist der teuerste Moment des Abends — denn während sie liegt,
        entscheidet sich der Gast weiter.
      </P>

      <H2>Was passiert, während niemand antwortet</H2>
      <P>
        Eine unbeantwortete Anfrage ist kein neutraler Zustand. Wer keine Antwort bekommt, fragt
        weiter — beim Lokal zwei Straßen weiter, bei der App, die sofort einen Tisch anzeigt. Das
        ist kein böser Wille, sondern schlicht die Art, wie heute entschieden wird: schnell und
        nebenbei.
      </P>
      <P>
        Dazu kommt ein zweiter, weniger sichtbarer Effekt: Wer erst nach Stunden eine Antwort
        bekommt, hat sein Bild von deinem Betrieb schon geformt, bevor er zum ersten Mal
        drinnen war.
      </P>

      <Pull>Der Gast vergleicht nicht dein Essen mit dem der Konkurrenz. Er vergleicht die Antwortzeit.</Pull>

      <H2>Was ein Assistent konkret übernimmt</H2>
      <P>
        Ein Chatbot ist kein Callcenter und keine künstliche Persönlichkeit. Er ist ein sehr
        schneller Mitarbeiter für die immer gleichen Handgriffe:
      </P>
      <UL
        items={[
          "Verfügbarkeit prüfen und passende Zeiten vorschlagen",
          "Reservierung aufnehmen: Name, Personenzahl, Uhrzeit, Wünsche",
          "Sofort bestätigen — der Gast hat es schriftlich",
          "Am Tag davor erinnern, damit weniger Tische leer bleiben",
          "Wiederkehrende Fragen beantworten: Öffnungszeiten, Anfahrt, Karte, Parken",
        ]}
      />
      <P>
        Das Entscheidende daran ist nicht die Technik, sondern der Zeitpunkt: Das alles passiert um
        23:40, wenn gefragt wird, und nicht am nächsten Vormittag.
      </P>

      <H2>Wo weiterhin ein Mensch übernehmen muss</H2>
      <P>
        Ein guter Assistent kennt seine Grenzen — und übergibt, statt zu improvisieren. Gruppen ab
        einer bestimmten Größe, Feiern mit eigenem Ablauf, Beschwerden, Sonderwünsche bei
        Allergien: Das gehört zu dir und deinem Team. Der Bot sammelt die Eckdaten, meldet sich bei
        euch und sagt dem Gast ehrlich, dass sich gleich jemand persönlich meldet.
      </P>
      <P>
        Ein Assistent, der so gebaut ist, macht dein Team nicht überflüssig. Er nimmt ihm die
        siebzehnte Öffnungszeiten-Frage des Abends ab, damit Zeit für die Gäste bleibt, die
        gerade im Laden stehen.
      </P>

      <H2>Was du realistisch erwarten kannst</H2>
      <P>
        Zwei Dinge ändern sich meist zuerst: Anfragen bleiben nicht mehr liegen, und dein Team
        greift seltener zum Handy, während Gäste warten. Ob daraus mehr Reservierungen werden,
        hängt davon ab, wie viele Anfragen bei dir überhaupt außerhalb der Bürozeiten ankommen —
        das schauen wir uns vorher gemeinsam an, statt es dir zu versprechen.
      </P>
      <P>
        Wenn bei dir kaum jemand schreibt, bringt dir ein Bot wenig. Wenn dein Postfach nach jedem
        Wochenende voll ist, ist er vermutlich die günstigste Aushilfe, die du bekommen kannst.
      </P>
    </ArticleLayout>
  );
}
