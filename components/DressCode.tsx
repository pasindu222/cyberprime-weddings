import { Gift, Shirt } from "lucide-react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { siteConfig } from "@/lib/config";

export default function DressCode() {
  const { dressCode, giftNote, palette } = siteConfig;

  return (
    <section id="details" className="bg-ivory-deep px-5 py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Details"
          title={dressCode.title}
          subtitle="Our wedding palette — wear what makes you feel elegant."
        />
      </Reveal>

      <Reveal delay={120}>
        <ul className="mx-auto mt-10 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-6">
          {palette.map((c) => (
            <li key={c.hex} className="flex w-[4.5rem] flex-col items-center text-center">
              <span
                className="h-16 w-16 rounded-full border border-jade/20 shadow-[0_10px_24px_-10px_rgba(27,67,50,0.5)] ring-2 ring-white ring-offset-2 ring-offset-gold/30"
                style={{ backgroundColor: c.hex }}
                role="img"
                aria-label={`${c.name} ${c.hex}`}
              />
              <span className="mt-3 text-[0.7rem] font-semibold leading-tight">{c.name}</span>
              <span className="mt-0.5 text-[0.62rem] uppercase tracking-wider text-jade/55">
                {c.hex}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-md gap-5">
        <Reveal delay={80}>
          <div className="rounded-3xl border border-gold/30 bg-white/80 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jade text-gold-light">
                <Shirt className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-xl">{dressCode.title}</h3>
            </div>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-jade/80">{dressCode.text}</p>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="rounded-3xl border border-gold/30 bg-white/80 p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-jade text-gold-light">
                <Gift className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
              </span>
              <h3 className="font-heading text-xl">{giftNote.title}</h3>
            </div>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-jade/80">{giftNote.text}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
