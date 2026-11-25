"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";
import { Heart } from "lucide-react";
import Lightbox from "./Lightbox";
import Photo from "./Photo";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { siteConfig } from "@/lib/config";

const photos = siteConfig.gallery;

/** Staggered two-column layout: tall / square on the left, square / tall on the right */
const LAYOUT = [
  { col: 0, aspect: "aspect-[3/4]" },
  { col: 0, aspect: "aspect-square" },
  { col: 1, aspect: "aspect-square" },
  { col: 1, aspect: "aspect-[3/4]" },
] as const;

export default function Gallery() {
  const [active, setActive] = useState<number | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = (i: number) => (e: MouseEvent<HTMLButtonElement>) => {
    triggerRef.current = e.currentTarget;
    setActive(i);
  };

  const close = useCallback(() => {
    setActive(null);
    triggerRef.current?.focus();
  }, []);

  const renderTile = (i: number) => {
    const p = photos[i];
    return (
      <Reveal key={p.src} delay={i * 90}>
        <button
          type="button"
          onClick={open(i)}
          aria-label={`Open photo: ${p.caption}`}
          className={`group relative block w-full overflow-hidden rounded-2xl border border-gold/30 bg-jade/10 shadow-[0_18px_40px_-24px_rgba(27,67,50,0.5)] ${LAYOUT[i].aspect}`}
        >
          <Photo
            src={p.src}
            alt={p.alt}
            sizes="(max-width: 640px) 46vw, 260px"
            className="object-cover transition duration-700 group-active:scale-105 sm:group-hover:scale-105"
          />
          <span
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-jade-deep/80 to-transparent px-3 pb-3 pt-10 text-left"
            aria-hidden="true"
          >
            <span className="block font-heading text-sm leading-tight text-ivory">{p.caption}</span>
            <span className="block text-[0.6rem] tracking-[0.25em] text-gold-light">{p.year}</span>
          </span>
        </button>
      </Reveal>
    );
  };

  return (
    <section id="story" className="bg-ivory-deep px-5 py-20">
      <Reveal>
        <SectionHeading
          eyebrow="Our Love Story"
          title={siteConfig.story.title}
          subtitle={siteConfig.story.text}
        />
      </Reveal>

      <div className="mx-auto mt-12 grid max-w-md grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-3 sm:space-y-4">{[0, 1].map(renderTile)}</div>
        <div className="mt-8 space-y-3 sm:space-y-4">{[2, 3].map(renderTile)}</div>
      </div>

      <Reveal delay={200}>
        <p className="mt-10 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.28em] text-gold-dark">
          <Heart className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true" />
          Tap a photo to view
        </p>
      </Reveal>

      {active !== null ? (
        <Lightbox photos={photos} index={active} onClose={close} onChange={setActive} />
      ) : null}
    </section>
  );
}
