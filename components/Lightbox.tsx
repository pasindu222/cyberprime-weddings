"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Photo from "./Photo";

export type LightboxPhoto = {
  src: string;
  alt: string;
  caption: string;
  year: string;
};

type Props = {
  photos: readonly LightboxPhoto[];
  index: number;
  onClose: () => void;
  onChange: (index: number) => void;
};

export default function Lightbox({ photos, index, onClose, onChange }: Props) {
  const touchStartX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const count = photos.length;
  const photo = photos[index];

  const prev = () => onChange((index - 1 + count) % count);
  const next = () => onChange((index + 1) % count);

  // Keyboard: ← → Esc
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") onChange((index - 1 + count) % count);
      else if (e.key === "ArrowRight") onChange((index + 1) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, count, onClose, onChange]);

  // Lock background scroll + move focus into the dialog
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      root.style.overflow = previous;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[90] flex animate-fade-in flex-col bg-jade-deep/95 backdrop-blur-md"
      onClick={onClose}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50) (dx > 0 ? prev : next)();
      }}
    >
      <div className="flex items-center justify-between px-5 pt-[max(1rem,env(safe-area-inset-top))] text-ivory/80">
        <span className="text-xs font-semibold tracking-[0.25em]">
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close photo viewer"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold-light"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative mx-auto my-3 min-h-0 w-full max-w-3xl flex-1">
        <div
          key={photo.src}
          className="absolute inset-x-3 inset-y-0 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <Photo src={photo.src} alt={photo.alt} sizes="100vw" className="object-contain" />
        </div>
      </div>

      <div className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] text-center">
        <p className="font-heading text-xl text-ivory">{photo.caption}</p>
        <p className="mt-1 text-xs tracking-[0.3em] text-gold-light">{photo.year}</p>

        <div className="mt-4 flex items-center justify-center gap-6">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold-light active:scale-95"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 text-gold-light active:scale-95"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
