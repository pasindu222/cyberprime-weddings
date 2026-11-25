"use client";

import { Sparkles } from "lucide-react";
import { siteConfig, formatNumericDate } from "@/lib/config";

export type SplashStage = "sealed" | "opening" | "leaving" | "done";

type Props = {
  stage: SplashStage;
  onOpen: () => void;
};

/** Fixed positions (no Math.random → no hydration mismatch) for the drifting gold specks */
const SPECKS = [
  { top: "9%", left: "14%", delay: "0s", size: 5 },
  { top: "17%", left: "82%", delay: "0.8s", size: 4 },
  { top: "31%", left: "8%", delay: "1.6s", size: 3 },
  { top: "44%", left: "91%", delay: "2.2s", size: 5 },
  { top: "63%", left: "12%", delay: "0.4s", size: 4 },
  { top: "74%", left: "86%", delay: "1.2s", size: 3 },
  { top: "88%", left: "30%", delay: "2.6s", size: 4 },
  { top: "92%", left: "70%", delay: "1.9s", size: 5 },
];

export default function EnvelopeSplash({ stage, onOpen }: Props) {
  const isOpen = stage !== "sealed";
  const leaving = stage === "leaving";
  const { first, second } = siteConfig.monogram;

  return (
    <div
      role="dialog"
      aria-label="Wedding invitation cover"
      className={`fixed inset-0 z-[100] overflow-hidden bg-jade-deep transition-[transform,opacity] duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)] [overscroll-behavior:contain] [touch-action:none] ${
        leaving ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(70% 50% at 50% 38%, rgba(45,106,79,0.55), transparent 70%), radial-gradient(80% 60% at 50% 110%, rgba(212,175,55,0.14), transparent 70%)",
      }}
    >
      {/* Gold inner frame */}
      <div
        className="pointer-events-none absolute inset-3 rounded-[28px] border border-gold/40"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[18px] rounded-[22px] border border-gold/15"
        aria-hidden="true"
      />

      {SPECKS.map((s, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="absolute rounded-full bg-gold-light animate-twinkle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay }}
        />
      ))}

      <button
        type="button"
        onClick={onOpen}
        disabled={isOpen}
        aria-label="Tap to open the wedding invitation"
        className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6 pb-[env(safe-area-inset-bottom)] text-center outline-none disabled:cursor-default"
      >
        {/* Monogram */}
        <div
          className={`flex flex-col items-center transition-opacity duration-500 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-gold/70">
            <span
              className="absolute inset-1.5 rounded-full border border-gold/30"
              aria-hidden="true"
            />
            <span className="font-heading text-4xl italic leading-none text-gold-light">
              {first}
              <span className="mx-0.5 text-2xl text-gold">&amp;</span>
              {second}
            </span>
          </div>
          <p className="mt-5 text-[0.68rem] font-semibold uppercase tracking-[0.4em] text-gold-light/90">
            You are cordially invited
          </p>
        </div>

        {/* Envelope */}
        <div
          className={`env-scene relative aspect-[10/7] w-[min(80vw,380px)] ${
            isOpen ? "" : "animate-float"
          }`}
        >
          {/* back */}
          <div className="absolute inset-0 rounded-md bg-[#0b2218] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] ring-1 ring-gold/50" />

          {/* letter */}
          <div
            className={`env-card absolute inset-x-[6%] bottom-[6%] top-[6%] flex flex-col items-center justify-center rounded-sm bg-ivory px-3 text-center shadow-md ${
              isOpen ? "is-open" : ""
            }`}
          >
            <div className="absolute inset-1.5 rounded-[2px] border border-gold/60" aria-hidden="true" />
            <p className="text-[0.55rem] font-semibold uppercase tracking-[0.3em] text-gold-dark">
              Wedding Invitation
            </p>
            <p className="mt-1.5 font-heading text-[1.35rem] leading-none text-jade">
              {siteConfig.groom} <span className="gold-text italic">&amp;</span> {siteConfig.bride}
            </p>
            <p className="mt-2 text-[0.6rem] tracking-[0.25em] text-jade/70">
              {formatNumericDate(siteConfig.weddingDate)}
            </p>
          </div>

          {/* front pocket + gold stitching */}
          <svg
            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
            viewBox="0 0 100 70"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="env-front" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f4c39" />
                <stop offset="100%" stopColor="#14382a" />
              </linearGradient>
            </defs>
            <polygon
              points="0,0 50,38 100,0 100,70 0,70"
              fill="url(#env-front)"
              stroke="#D4AF37"
              strokeWidth="0.8"
              strokeOpacity="0.7"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points="0,70 50,38 100,70"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="0.6"
              strokeOpacity="0.35"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {/* flap */}
          <div
            className={`env-flap absolute inset-x-0 top-0 h-[54.3%] ${isOpen ? "is-open" : ""}`}
            aria-hidden="true"
          >
            <svg className="h-full w-full" viewBox="0 0 100 38" preserveAspectRatio="none">
              <defs>
                <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2b6a4f" />
                  <stop offset="100%" stopColor="#1b4332" />
                </linearGradient>
              </defs>
              <polygon
                points="0,0 100,0 50,38"
                fill="url(#env-flap)"
                stroke="#D4AF37"
                strokeWidth="0.8"
                strokeOpacity="0.8"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {/* wax seal */}
          <div
            className={`absolute left-1/2 top-[54.3%] z-40 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold-foil shadow-[0_4px_14px_rgba(0,0,0,0.45)] ring-1 ring-gold-light/60 transition duration-300 ${
              isOpen ? "scale-50 opacity-0" : "scale-100 opacity-100"
            }`}
            aria-hidden="true"
          >
            <span className="font-heading text-sm italic font-semibold text-jade-deep">
              {first}·{second}
            </span>
          </div>
        </div>

        {/* CTA */}
        <span
          className={`inline-flex items-center gap-2 rounded-full border border-gold/70 bg-jade/40 px-6 py-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-gold-light backdrop-blur-sm transition-opacity duration-500 ${
            isOpen ? "opacity-0" : "opacity-100 animate-pulse-glow"
          }`}
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Tap to Open Invitation
        </span>
      </button>
    </div>
  );
}
