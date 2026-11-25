"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import EnvelopeSplash, { type SplashStage } from "./EnvelopeSplash";
import MusicToggle from "./MusicToggle";
import { siteConfig } from "@/lib/config";

/**
 * Owns the envelope → invitation transition and the background music.
 * The page sections are passed in as children (rendered on the server).
 */
export default function InvitationShell({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<SplashStage>("sealed");
  const [playing, setPlaying] = useState(false);
  const [musicAvailable, setMusicAvailable] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const timers = useRef<number[]>([]);
  const resumeOnVisible = useRef(false);

  // Always start at the top, and clean up timers on unmount.
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  // Lock page scroll while the envelope cover is showing.
  useEffect(() => {
    const root = document.documentElement;
    if (stage === "done") {
      root.style.overflow = "";
      return;
    }
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [stage]);

  // Pause music when the tab/app is backgrounded; resume on return.
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        resumeOnVisible.current = !audio.paused;
        audio.pause();
      } else if (resumeOnVisible.current) {
        resumeOnVisible.current = false;
        void audio.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const startMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = siteConfig.music.volume;
    // Must be called inside the tap handler so mobile browsers allow audio.
    void audio.play().catch(() => {});
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.volume = siteConfig.music.volume;
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, []);

  const openInvitation = useCallback(() => {
    if (stage !== "sealed") return;
    startMusic();
    setStage("opening");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timers.current.push(
      window.setTimeout(() => setStage("leaving"), reduced ? 120 : 2000),
      window.setTimeout(() => setStage("done"), reduced ? 400 : 3000)
    );
  }, [stage, startMusic]);

  const revealed = stage === "leaving" || stage === "done";

  return (
    <div data-open={revealed ? "true" : "false"} className="relative">
      <audio
        ref={audioRef}
        src={siteConfig.music.src}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setMusicAvailable(false)}
      />

      {stage !== "done" ? <EnvelopeSplash stage={stage} onOpen={openInvitation} /> : null}

      <MusicToggle
        visible={musicAvailable && revealed}
        playing={playing}
        onToggle={toggleMusic}
      />

      <main inert={stage !== "done" ? true : undefined}>{children}</main>
    </div>
  );
}
