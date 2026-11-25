/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE to personalise the invitation.
 *  Everything on the page (names, dates, venues, photos, colours,
 *  copy) is driven from here. All venue names, addresses, times,
 *  and story text below are PLACEHOLDERS.
 * ─────────────────────────────────────────────────────────────
 */

export type EventIcon = "poruwa" | "reception";

export type WeddingEvent = {
  id: string;
  title: string;
  tagline: string;
  icon: EventIcon;
  /** ISO 8601 with Sri Lanka offset (+05:30) so every guest sees the same moment */
  start: string;
  end: string;
  venue: string;
  address: string;
  /** What Google Maps should search for. Venue name + city works best. */
  mapsQuery: string;
  /** Optional: paste a Google Maps share link here to override mapsQuery */
  mapsUrl?: string;
  note?: string;
  /** Shown inside the calendar entry */
  description: string;
};

export const siteConfig = {
  groom: "Kasun",
  bride: "Dilini",
  coupleNames: "Kasun & Dilini",
  /** Letters shown on the envelope seal and splash monogram */
  monogram: { first: "K", second: "D" },
  hashtag: "#KasunWedsDilini",
  city: "Colombo, Sri Lanka",

  /** Wedding moment (Poruwa nekath). Drives the countdown. */
  weddingDate: "2027-03-20T09:12:00+05:30",

  rsvpDeadline: "28 February 2027",

  music: {
    // Put your own licensed instrumental at public/music/wedding-instrumental.mp3
    src: "/music/wedding-instrumental.mp3",
    volume: 0.45,
  },

  images: {
    hero: "/images/hero.jpg",
    ogCover: "/og-cover.jpg",
  },

  story: {
    title: "Our Story",
    text: "It began with a simple hello and a long cup of tea. Through every season since — monsoon rains, train rides to Kandy, quiet evenings by the sea — we found home in each other. Now, with the blessings of our families, we begin our forever.",
  },

  gallery: [
    { src: "/images/gallery-1.jpg", alt: "Kasun and Dilini on their first outing", caption: "The first hello", year: "2019" },
    { src: "/images/gallery-2.jpg", alt: "Kasun and Dilini walking together in the rain", caption: "Monsoon walks", year: "2021" },
    { src: "/images/gallery-3.jpg", alt: "Kasun and Dilini on the day of the proposal", caption: "The question", year: "2026" },
    { src: "/images/gallery-4.jpg", alt: "Kasun and Dilini with their families", caption: "Two families, one celebration", year: "2027" },
  ],

  events: [
    {
      id: "poruwa",
      title: "Poruwa Ceremony",
      tagline: "The traditional wedding rites",
      icon: "poruwa",
      start: "2027-03-20T09:12:00+05:30",
      end: "2027-03-20T12:00:00+05:30",
      venue: "Lotus Garden Pavilion",
      address: "No. 24, Beach Road, Mount Lavinia",
      mapsQuery: "Mount Lavinia Hotel, Mount Lavinia, Sri Lanka",
      note: "Kindly be seated by 8:45 AM. The auspicious time (nekath) is 9:12 AM.",
      description:
        "Poruwa Ceremony — wedding of Kasun & Dilini. Please be seated by 8:45 AM; the nekath is 9:12 AM.",
    },
    {
      id: "reception",
      title: "Registration & Reception",
      tagline: "An evening of dinner, music and dancing",
      icon: "reception",
      start: "2027-03-20T17:30:00+05:30",
      end: "2027-03-20T22:30:00+05:30",
      venue: "The Grand Ballroom",
      address: "No. 1, Galle Road, Colombo 03",
      mapsQuery: "Galle Face Hotel, Colombo, Sri Lanka",
      note: "Registration at 5:30 PM · Welcome drinks at 6:30 PM · Dinner at 8:00 PM.",
      description:
        "Registration & Reception — wedding of Kasun & Dilini. Registration 5:30 PM, welcome drinks 6:30 PM, dinner 8:00 PM.",
    },
  ] as WeddingEvent[],

  dressCode: {
    title: "Dress Code",
    text: "Elegant traditional or formal attire. Sarees, osariya, national dress and formal suits are all welcome. We would love to see you in emerald, gold, ivory and soft earth tones — and kindly avoid all-white (reserved for the bride) and all-black.",
  },

  giftNote: {
    title: "A Note on Gifts",
    text: "Your presence and blessings are the greatest gift we could ask for. Should you wish to give something, a contribution towards our new home would be warmly appreciated — an envelope box will be available at the reception.",
  },

  palette: [
    { name: "Royal Emerald", hex: "#1B4332" },
    { name: "Brushed Gold", hex: "#D4AF37" },
    { name: "Warm Ivory", hex: "#FAF8F5" },
    { name: "Sage", hex: "#8FA998" },
    { name: "Champagne", hex: "#E9DCB8" },
  ],
};

/* ───────────── Date / time helpers ─────────────
 * Sri Lanka has a fixed UTC+05:30 offset (no daylight saving), so we format
 * by hand instead of using Intl. That keeps server and browser output
 * identical and avoids React hydration mismatches.
 */

const LK_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function lk(iso: string) {
  const d = new Date(new Date(iso).getTime() + LK_OFFSET_MS);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    date: d.getUTCDate(),
    weekday: d.getUTCDay(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
  };
}

/** "Saturday, 20 March 2027" */
export function formatLongDate(iso: string): string {
  const p = lk(iso);
  return `${DAYS[p.weekday]}, ${p.date} ${MONTHS[p.month]} ${p.year}`;
}

/** "20 March 2027" */
export function formatShortDate(iso: string): string {
  const p = lk(iso);
  return `${p.date} ${MONTHS[p.month]} ${p.year}`;
}

/** "20 · 03 · 2027" — used on the envelope card */
export function formatNumericDate(iso: string): string {
  const p = lk(iso);
  const dd = String(p.date).padStart(2, "0");
  const mm = String(p.month + 1).padStart(2, "0");
  return `${dd} · ${mm} · ${p.year}`;
}

/** "9:12 AM" */
export function formatTime(iso: string): string {
  const p = lk(iso);
  const h12 = p.hours % 12 || 12;
  const mm = String(p.minutes).padStart(2, "0");
  return `${h12}:${mm} ${p.hours >= 12 ? "PM" : "AM"}`;
}
