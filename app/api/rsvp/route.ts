import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RsvpRecord = {
  receivedAt: string;
  name: string;
  attending: "yes" | "no";
  guests: number;
  meal: "veg" | "non-veg" | null;
  message: string;
};

/** Trim, cap the length, and strip control characters (keeps newlines). */
function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return value.replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, " ").trim().slice(0, max);
}

const fail = (error: string, status: number) =>
  NextResponse.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return fail("Invalid request.", 400);
  }

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 80);
  if (name.length < 2) return fail("Please tell us your name.", 400);

  if (body.attending !== "yes" && body.attending !== "no") {
    return fail("Please let us know if you can attend.", 400);
  }
  const attending = body.attending;

  let guests = 0;
  let meal: RsvpRecord["meal"] = null;
  if (attending === "yes") {
    guests = Number(body.guests);
    if (!Number.isInteger(guests) || guests < 1 || guests > 5) {
      return fail("Guests must be between 1 and 5.", 400);
    }
    if (body.meal !== "veg" && body.meal !== "non-veg") {
      return fail("Please choose a meal preference.", 400);
    }
    meal = body.meal;
  }

  const record: RsvpRecord = {
    receivedAt: new Date().toISOString(),
    name,
    attending,
    guests,
    meal,
    message: clean(body.message, 300),
  };

  try {
    const webhook = process.env.RSVP_WEBHOOK_URL;
    if (webhook) {
      // Google Apps Script / Zapier / Make / n8n …
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
        redirect: "follow",
      });
      if (!res.ok) throw new Error(`Webhook responded with ${res.status}`);
    } else {
      // Local / VPS fallback: one JSON object per line in ./data/rsvps.jsonl
      const dir = path.join(process.cwd(), "data");
      await fs.mkdir(dir, { recursive: true });
      await fs.appendFile(path.join(dir, "rsvps.jsonl"), JSON.stringify(record) + "\n", "utf8");
    }
  } catch (err) {
    console.error("[rsvp] failed to save response:", err);
    return fail("We couldn't save your RSVP just now. Please try again in a moment.", 500);
  }

  return NextResponse.json({ ok: true });
}
