"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import Photo from "./Photo";
import Ornament from "./Ornament";
import { siteConfig, formatLongDate } from "@/lib/config";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Hero() {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Subtle parallax: the photo drifts slower than the frame as you scroll.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const frame = frameRef.current;
      const image = imageRef.current;
      if (!frame || !image) return;
      const rect = frame.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh; // ≈ -1 … 1
      const clamped = Math.max(-1, Math.min(1, progress));
      image.style.transform = `translate3d(0, ${(clamped * -22).toFixed(1)}px, 0) scale(1.15)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      id="home"
      className="glow-ivory relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-20 text-center"
    >
      <p
        className="hero-in text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-gold-dark"
        style={delay(150)}
      >
        Together with their families
      </p>
      <p className="hero-in mt-2 text-sm italic text-jade/70" style={delay(250)}>
        request the pleasure of your company
      </p>

      {/* Arched photo frame */}
      <div
        className="hero-in relative mt-8 w-[min(70vw,300px)]"
        style={delay(400)}
      >
        <div
          ref={frameRef}
          className="rounded-t-[999px] rounded-b-2xl border border-gold/70 p-2 shadow-[0_30px_60px_-24px_rgba(27,67,50,0.4)]"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-xl bg-jade/10">
            <div
              ref={imageRef}
              className="absolute inset-0 will-change-transform [transform:scale(1.15)]"
            >
              <Photo
                src={siteConfig.images.hero}
                alt={`${siteConfig.groom} and ${siteConfig.bride}`}
                sizes="(max-width: 640px) 70vw, 300px"
                priority
                className="object-cover"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-jade/25 via-transparent to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
        {/* offset echo of the arch */}
        <div
          className="pointer-events-none absolute -inset-2.5 -z-10 rounded-t-[999px] rounded-b-3xl border border-gold/25"
          aria-hidden="true"
        />
      </div>

      <h1
        className="hero-in mt-9 font-heading text-[clamp(2.5rem,12vw,4.75rem)] leading-none text-jade"
        style={delay(600)}
      >
        {siteConfig.groom}{" "}
        <span className="gold-text px-1 font-normal italic">&amp;</span>{" "}
        {siteConfig.bride}
      </h1>

      <div className="hero-in mt-6 w-full" style={delay(750)}>
        <Ornament />
      </div>

      <p
        className="hero-in mt-6 font-heading text-xl text-jade sm:text-2xl"
        style={delay(850)}
      >
        {formatLongDate(siteConfig.weddingDate)}
      </p>
      <p
        className="hero-in mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-jade/70"
        style={delay(950)}
      >
        {siteConfig.city}
      </p>

      <a
        href="#countdown"
        aria-label="Scroll to the countdown"
        className="hero-in absolute bottom-6 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold-dark"
        style={delay(1200)}
      >
        <ChevronDown className="h-5 w-5 animate-float" aria-hidden="true" />
      </a>
    </section>
  );
}
