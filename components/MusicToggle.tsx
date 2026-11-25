"use client";

import { Pause, Play } from "lucide-react";

type Props = {
  visible: boolean;
  playing: boolean;
  onToggle: () => void;
};

export default function MusicToggle({ visible, playing, onToggle }: Props) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? "Pause background music" : "Play background music"}
      aria-pressed={playing}
      tabIndex={visible ? 0 : -1}
      className={`fixed right-4 top-[max(1rem,env(safe-area-inset-top))] z-[80] flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-jade/90 text-gold-light shadow-lg backdrop-blur-md transition duration-500 active:scale-95 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {playing ? (
        <span
          className="absolute inset-0 rounded-full border border-dashed border-gold/60 animate-spin-slow"
          aria-hidden="true"
        />
      ) : null}
      {playing ? (
        <Pause className="h-5 w-5" fill="currentColor" aria-hidden="true" />
      ) : (
        <Play className="ml-0.5 h-5 w-5" fill="currentColor" aria-hidden="true" />
      )}
    </button>
  );
}
