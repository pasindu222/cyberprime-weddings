"use client";

import { useCallback, useState, type FormEvent } from "react";
import { Check, Drumstick, Leaf, Minus, Plus, Send } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import Toast, { type ToastData } from "./Toast";
import { siteConfig } from "@/lib/config";

type Attending = "yes" | "no";
type Meal = "veg" | "non-veg";
type Errors = Partial<Record<"name" | "attending" | "meal", string>>;

const MAX_GUESTS = 5;
const MAX_MESSAGE = 300;

const inputClass =
  "w-full rounded-2xl border border-jade/15 bg-white px-4 py-3.5 text-base text-jade placeholder:text-jade/40 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

export default function RsvpForm() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<Attending | null>(null);
  const [guests, setGuests] = useState(1);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real guests never see/fill this
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ name: string; attending: Attending } | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  const closeToast = useCallback(() => setToast(null), []);

  const validate = (): Errors => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = "Please tell us your name.";
    if (!attending) next.attending = "Please let us know if you can join us.";
    if (attending === "yes" && !meal) next.meal = "Please choose a meal preference.";
    return next;
  };

  const reset = () => {
    setName("");
    setAttending(null);
    setGuests(1);
    setMeal(null);
    setMessage("");
    setErrors({});
    setSubmitted(null);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          guests: attending === "yes" ? guests : 0,
          meal: attending === "yes" ? meal : null,
          message: message.trim(),
          website,
        }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Something went wrong.");
      }

      const first = name.trim().split(/\s+/)[0];
      setSubmitted({ name: first, attending: attending as Attending });
      setToast({
        id: Date.now(),
        kind: "success",
        title: attending === "yes" ? "RSVP received" : "Thank you for letting us know",
        text:
          attending === "yes"
            ? `Thank you, ${first}! We can't wait to celebrate with you.`
            : `We'll miss you, ${first}. Your wishes mean the world to us.`,
      });
    } catch (err) {
      setToast({
        id: Date.now(),
        kind: "error",
        title: "We couldn't send your RSVP",
        text:
          err instanceof Error && err.message !== "Failed to fetch"
            ? err.message
            : "Please check your connection and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="rsvp" className="glow-ivory px-5 py-20">
      <Toast toast={toast} onClose={closeToast} />

      <Reveal>
        <SectionHeading
          eyebrow="RSVP"
          title="Will you be joining us?"
          subtitle={`Kindly respond by ${siteConfig.rsvpDeadline}.`}
        />
      </Reveal>

      <Reveal delay={120}>
        <div className="mx-auto mt-10 max-w-md rounded-3xl border border-gold/30 bg-white/80 p-5 shadow-[0_24px_50px_-28px_rgba(27,67,50,0.45)] backdrop-blur-sm sm:p-7">
          {submitted ? (
            <div className="py-6 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-jade text-gold-light">
                <Check className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-2xl text-jade">
                {submitted.attending === "yes"
                  ? `See you there, ${submitted.name}!`
                  : `Thank you, ${submitted.name}`}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-jade/75">
                {submitted.attending === "yes"
                  ? "Your RSVP has been received. We're so happy you'll be celebrating with us."
                  : "We're sorry you can't make it, and we're grateful you let us know."}
              </p>
              <button
                type="button"
                onClick={reset}
                className="mt-6 min-h-11 rounded-full border border-gold px-6 text-sm font-semibold text-jade"
              >
                Submit another response
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="space-y-6">
              {/* Honeypot */}
              <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="rsvp-name" className="mb-2 block text-sm font-semibold">
                  Your name
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  placeholder="e.g. Nimal Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "rsvp-name-error" : undefined}
                  className={inputClass}
                />
                {errors.name ? (
                  <p id="rsvp-name-error" className="mt-1.5 text-sm text-red-700">
                    {errors.name}
                  </p>
                ) : null}
              </div>

              {/* Attending */}
              <fieldset>
                <legend className="mb-2 text-sm font-semibold">Will you attend?</legend>
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { value: "yes", label: "Joyfully accept" },
                      { value: "no", label: "Regretfully decline" },
                    ] as const
                  ).map((opt) => {
                    const selected = attending === opt.value;
                    return (
                      <label
                        key={opt.value}
                        className={`flex min-h-14 cursor-pointer items-center justify-center rounded-2xl border px-3 text-center text-sm font-semibold transition ${
                          selected
                            ? "border-jade bg-jade text-ivory"
                            : "border-jade/15 bg-white text-jade"
                        }`}
                      >
                        <input
                          type="radio"
                          name="attending"
                          value={opt.value}
                          checked={selected}
                          onChange={() => setAttending(opt.value)}
                          className="sr-only"
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
                {errors.attending ? (
                  <p className="mt-1.5 text-sm text-red-700">{errors.attending}</p>
                ) : null}
              </fieldset>

              {attending === "yes" ? (
                <div className="animate-fade-in space-y-6">
                  {/* Guests */}
                  <div>
                    <p id="guests-label" className="mb-2 text-sm font-semibold">
                      Number of guests <span className="font-normal text-jade/60">(including you)</span>
                    </p>
                    <div
                      role="group"
                      aria-labelledby="guests-label"
                      className="flex items-center justify-between rounded-2xl border border-jade/15 bg-white p-2"
                    >
                      <button
                        type="button"
                        aria-label="Decrease guests"
                        disabled={guests <= 1}
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory-deep text-jade disabled:opacity-35"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span
                        className="font-heading text-2xl tabular-nums"
                        aria-live="polite"
                        aria-atomic="true"
                      >
                        {guests}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase guests"
                        disabled={guests >= MAX_GUESTS}
                        onClick={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
                        className="flex h-11 w-11 items-center justify-center rounded-full bg-ivory-deep text-jade disabled:opacity-35"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Meal */}
                  <fieldset>
                    <legend className="mb-2 text-sm font-semibold">Meal preference</legend>
                    <div className="grid grid-cols-2 gap-3">
                      {(
                        [
                          { value: "veg", label: "Vegetarian", Icon: Leaf },
                          { value: "non-veg", label: "Non-Vegetarian", Icon: Drumstick },
                        ] as const
                      ).map(({ value, label, Icon }) => {
                        const selected = meal === value;
                        return (
                          <label
                            key={value}
                            className={`flex min-h-20 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 text-center text-sm font-semibold transition ${
                              selected
                                ? "border-gold bg-gold/15 text-jade ring-2 ring-gold/40"
                                : "border-jade/15 bg-white text-jade"
                            }`}
                          >
                            <input
                              type="radio"
                              name="meal"
                              value={value}
                              checked={selected}
                              onChange={() => setMeal(value)}
                              className="sr-only"
                            />
                            <Icon className="h-5 w-5 text-gold-dark" aria-hidden="true" />
                            {label}
                          </label>
                        );
                      })}
                    </div>
                    <p className="mt-2 text-xs text-jade/60">
                      Different preferences in your party? Mention it in your message below.
                    </p>
                    {errors.meal ? (
                      <p className="mt-1.5 text-sm text-red-700">{errors.meal}</p>
                    ) : null}
                  </fieldset>
                </div>
              ) : null}

              {/* Message */}
              <div>
                <label htmlFor="rsvp-message" className="mb-2 flex justify-between text-sm font-semibold">
                  <span>Wishes for the couple</span>
                  <span className="font-normal text-jade/50">optional</span>
                </label>
                <textarea
                  id="rsvp-message"
                  rows={4}
                  maxLength={MAX_MESSAGE}
                  placeholder="Share a blessing, a memory, or a note…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
                <p className="mt-1 text-right text-xs text-jade/50">
                  {message.length}/{MAX_MESSAGE}
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-jade text-sm font-semibold uppercase tracking-[0.2em] text-ivory shadow-lg transition active:scale-[0.98] disabled:opacity-70"
              >
                <Send className="h-4 w-4 text-gold-light" aria-hidden="true" />
                {submitting ? "Sending…" : "Send RSVP"}
              </button>
            </form>
          )}
        </div>
      </Reveal>
    </section>
  );
}
