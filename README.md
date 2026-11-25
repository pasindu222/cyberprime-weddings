# Kasun & Dilini — Digital Wedding Invitation

A mobile-first, single-page wedding invitation built with **Next.js (App Router)**, **Tailwind CSS 3** and **Lucide React**.
Warm ivory `#FAF8F5` · deep emerald `#1B4332` · brushed gold `#D4AF37` · Playfair Display + Plus Jakarta Sans.

## Run it locally

Requires **Node.js 20+**.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

**Preview on your phone** (same Wi-Fi):

```bash
npm run dev -- -H 0.0.0.0
```

then open `http://<your-computer-LAN-IP>:3000` on the phone.

Production build:

```bash
npm run build
npm run start
```

## Personalise it

Almost everything lives in **`lib/config.ts`**: names, monogram, wedding date, both events (time, venue, address, map search),
love-story text, gallery captions, dress code, gift note, palette, RSVP deadline.
The venues, times and story text in the file are **placeholders** — replace them.

| What | Where |
| --- | --- |
| Hero photo (3:4 portrait) | `public/images/hero.jpg` |
| 4 gallery photos | `public/images/gallery-1.jpg` … `gallery-4.jpg` |
| WhatsApp preview image (1200×630 JPG, keep under ~300 KB) | `public/og-cover.jpg` |
| Background music | `public/music/wedding-instrumental.mp3` |
| Exact map pin | `mapsUrl` on an event in `lib/config.ts` (paste a Google Maps share link) |

Just overwrite the files with your own using the same names. The included images and music are generated placeholders —
use a track you have the licence to use for the music. If the music file is missing, the play/pause button hides itself.

## WhatsApp link preview (Open Graph)

The tags are configured in `app/layout.tsx` (title, description, `og:image`, Twitter card).
For WhatsApp to show the preview card:

1. **Deploy it** (e.g. Vercel) — WhatsApp cannot read `localhost`.
2. Set `NEXT_PUBLIC_SITE_URL` to your final `https://…` address (see `.env.example`). On Vercel the default project URL is picked up automatically.
3. Share the link. WhatsApp caches previews, so after changing the image/title, share the URL with a throwaway suffix (e.g. `?v=2`) to force a refresh.

## RSVP responses

The form posts to `app/api/rsvp/route.ts`, which validates the data and then:

- **If `RSVP_WEBHOOK_URL` is set** → forwards the JSON to it (recommended for production; see below).
- **Otherwise** → appends one JSON line per response to `data/rsvps.jsonl` (works locally or on your own server, **not on Vercel**, whose filesystem is read-only; guests would see a "couldn't send" message there instead of silently losing RSVPs).

### Google Sheets in ~2 minutes

1. Create a Google Sheet, then **Extensions → Apps Script** and paste:

   ```js
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()
       .appendRow([d.receivedAt, d.name, d.attending, d.guests, d.meal, d.message]);
     return ContentService.createTextOutput(JSON.stringify({ ok: true }))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
2. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*. Copy the URL.
3. Put it in `.env.local` (and your host's environment variables): `RSVP_WEBHOOK_URL=https://script.google.com/macros/s/…/exec`

## Notes

- **Music** can only start after a tap (browser autoplay rules) — that is why the envelope cover exists. It also pauses automatically when the guest switches apps.
- **Add to Calendar** offers Google Calendar (works inside WhatsApp's in-app browser) and an `.ics` download for Apple/Outlook. On iPhone, the `.ics` option can be blocked inside WhatsApp's in-app browser; guests can use "Open in Safari" or the Google option.
- The countdown targets `weddingDate` with the `+05:30` offset, so every guest sees the same moment regardless of their time zone.
- The page is set to `noindex` so it stays out of search engines.

## Structure

```
app/
  layout.tsx            fonts, Open Graph / Twitter metadata, viewport
  page.tsx              composes the sections
  globals.css           theme, envelope animation, scroll-reveal
  icon.svg              favicon
  api/rsvp/route.ts     RSVP endpoint
components/
  InvitationShell.tsx   envelope → invitation transition + music (audio element)
  EnvelopeSplash.tsx    "Tap to Open Invitation" cover with monogram
  MusicToggle.tsx       floating play / pause button
  Hero.tsx              names, date, parallax arch photo frame
  Countdown.tsx         live Days / Hours / Minutes / Seconds
  EventsTimeline.tsx    timeline of events
  EventCard.tsx         event card: Google Maps + Add to Calendar
  Gallery.tsx           love story + 4-photo grid
  Lightbox.tsx          full-screen viewer (swipe, arrows, Esc)
  RsvpForm.tsx          RSVP form + confirmation
  Toast.tsx             confirmation toast
  DressCode.tsx         palette circles, dress code, gift note
  Footer.tsx  Reveal.tsx  Ornament.tsx  SectionHeading.tsx  Photo.tsx
lib/
  config.ts             ← all your content lives here
  calendar.ts           .ics + Google Calendar + Maps links
public/
  images/  music/  og-cover.jpg
```
