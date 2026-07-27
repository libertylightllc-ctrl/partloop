import type { Locale, OrderEvent } from "@partsloop/contracts";

export function OrderTimeline({ events, locale = "en" }: { events: OrderEvent[]; locale?: Locale }) {
  return (
    <ol className="order-timeline">
      {events.map((event) => (
        <li key={event.status} className={`${event.complete ? "complete" : ""} ${event.current ? "current" : ""}`}>
          <span className="timeline-dot">{event.complete ? "✓" : event.current ? "•" : ""}</span>
          <div>
            <strong>{locale === "ar" ? event.labelAr : event.label}</strong>
            {event.at && <time>{event.at}</time>}
          </div>
        </li>
      ))}
    </ol>
  );
}
