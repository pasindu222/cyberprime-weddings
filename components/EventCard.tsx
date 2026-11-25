"use client";

import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  CalendarPlus,
  ChevronDown,
  Clock,
  Flower2,
  MapPin,
  Wine,
} from "lucide-react";
import {
  formatLongDate,
  formatTime,
  type WeddingEvent,
} from "@/lib/config";
import { downloadIcs, googleCalendarUrl, mapsUrl } from "@/lib/calendar";

const ICONS = { poruwa: Flower2, reception: Wine } as const;

export default function EventCard({ event }: { event: WeddingEvent }) {
  const Icon = ICONS[event.icon];
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the calendar menu on outside tap / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onPointer = (e: Event) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <article className="relative rounded-3xl border border-gold/30 bg-white/80 p-6 shadow-[0_24px_50px_-28px_rgba(27,67,50,0.45)] backdrop-blur-sm">
      <span
        className="absolute inset-x-8 top-0 h-px bg-gold-foil"
        aria-hidden="true"
      />

      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-jade text-gold-light">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="font-heading text-2xl leading-tight text-jade">{event.title}</h3>
          <p className="mt-1 text-sm italic text-jade/70">{event.tagline}</p>
        </div>
      </div>

      <dl className="mt-6 space-y-3.5 text-[0.95rem]">
        <div className="flex gap-3">
          <dt className="mt-0.5 text-gold-dark">
            <CalendarDays className="h-[1.1rem] w-[1.1rem]" aria-label="Date" />
          </dt>
          <dd>{formatLongDate(event.start)}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="mt-0.5 text-gold-dark">
            <Clock className="h-[1.1rem] w-[1.1rem]" aria-label="Time" />
          </dt>
          <dd>
            {formatTime(event.start)} – {formatTime(event.end)}
          </dd>
        </div>
        <div className="flex gap-3">
          <dt className="mt-0.5 text-gold-dark">
            <MapPin className="h-[1.1rem] w-[1.1rem]" aria-label="Venue" />
          </dt>
          <dd>
            <span className="font-semibold">{event.venue}</span>
            <br />
            <span className="text-jade/70">{event.address}</span>
          </dd>
        </div>
      </dl>

      {event.note ? (
        <p className="mt-5 rounded-xl bg-ivory-deep px-4 py-3 text-[0.85rem] leading-relaxed text-jade/80">
          {event.note}
        </p>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a
          href={mapsUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-jade px-5 text-sm font-semibold text-ivory transition active:scale-[0.98]"
        >
          <MapPin className="h-4 w-4" aria-hidden="true" />
          View on Google Maps
        </a>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-haspopup="true"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-gold bg-transparent px-5 text-sm font-semibold text-jade transition active:scale-[0.98]"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Add to Calendar
            <ChevronDown
              className={`h-4 w-4 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>

          {menuOpen ? (
            <div className="mt-2 animate-fade-in overflow-hidden rounded-2xl border border-gold/40 bg-white shadow-lg sm:absolute sm:inset-x-0 sm:z-10">
              <a
                href={googleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-12 items-center px-5 text-sm hover:bg-ivory"
              >
                Google Calendar
              </a>
              <button
                type="button"
                onClick={() => {
                  downloadIcs(event);
                  setMenuOpen(false);
                }}
                className="flex min-h-12 w-full items-center border-t border-gold/20 px-5 text-left text-sm hover:bg-ivory"
              >
                Apple / Outlook (.ics)
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
