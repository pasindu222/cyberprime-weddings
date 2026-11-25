import Ornament from "./Ornament";
import Reveal from "./Reveal";
import { siteConfig, formatShortDate } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="bg-jade px-6 pb-[max(3rem,env(safe-area-inset-bottom))] pt-16 text-center text-ivory">
      <Reveal>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.34em] text-gold-light">
          With love &amp; blessings
        </p>
        <p className="mt-4 font-heading text-4xl">
          {siteConfig.groom} <span className="gold-text italic">&amp;</span> {siteConfig.bride}
        </p>
        <Ornament className="mt-6" />
        <p className="mt-6 text-sm text-ivory/80">{formatShortDate(siteConfig.weddingDate)}</p>
        <p className="mt-1 text-sm tracking-wide text-gold-light">{siteConfig.hashtag}</p>
        <a
          href="#home"
          className="mt-8 inline-flex min-h-11 items-center rounded-full border border-gold/50 px-5 text-xs font-semibold uppercase tracking-[0.25em] text-gold-light"
        >
          Back to top
        </a>
      </Reveal>
    </footer>
  );
}
