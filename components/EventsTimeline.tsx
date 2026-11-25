import EventCard from "./EventCard";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { siteConfig } from "@/lib/config";

export default function EventsTimeline() {
  return (
    <section id="events" className="glow-ivory px-5 py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Wedding Events"
          title="Join us in celebration"
          subtitle="Two moments we would love to share with you."
        />
      </Reveal>

      <ol className="relative mx-auto mt-12 max-w-xl space-y-8 pl-10">
        <span
          className="absolute bottom-3 left-[15px] top-3 w-px bg-gradient-to-b from-gold/0 via-gold to-gold/0"
          aria-hidden="true"
        />
        {siteConfig.events.map((event, i) => (
          <li key={event.id} className="relative">
            <span
              className="absolute -left-10 top-7 flex h-[31px] w-[31px] items-center justify-center rounded-full border border-gold bg-ivory"
              aria-hidden="true"
            >
              <span className="h-2 w-2 rounded-full bg-gold" />
            </span>
            <Reveal delay={i * 120}>
              <EventCard event={event} />
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
