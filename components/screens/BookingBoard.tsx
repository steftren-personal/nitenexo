import React from "react";
import { MessageCircle, Check } from "lucide-react";

const ROWS = [
  { t: "18:30", name: "Lena", p: "2 Pers." },
  { t: "19:00", name: "Marco", p: "4 Pers." },
  { t: "20:00", name: "Stefan", p: "4 Pers." },
  { t: "20:30", name: "Aylin", p: "6 Pers." },
  { t: "21:15", name: "David", p: "3 Pers." },
  { t: "22:00", name: "Nora", p: "5 Pers." },
];

/** Static illustration, not the authenticated appointment flow. */
export function BookingBoard() {
  return (
    <div className="nn-booking-board">
      <div className="nn-booking-head">
        <div><strong>Reservierungen · heute</strong><p>über Nacht angenommen</p></div>
        <span className="nn-booking-status">Ausgebucht</span>
      </div>
      <ul>{ROWS.map(row => <li key={row.t}>
        <span className="nn-booking-time">{row.t}</span><strong>{row.name}</strong><span>{row.p}</span><Check size={18} aria-hidden="true" />
      </li>)}</ul>
      <p className="nn-booking-note"><MessageCircle size={18} aria-hidden="true" />Alle über WhatsApp angenommen — ohne einen einzigen Griff zum Handy.</p>
    </div>
  );
}
