"use client";

import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import { siteConfig } from "@/lib/config";

const target = new Date(siteConfig.weddingDate).getTime();

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
};

function compute(now: number): TimeLeft {
  const ms = Math.max(0, target - now);
  const total = Math.floor(ms / 1000);
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
    done: ms === 0,
  };
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function Countdown() {
  // null on the server / first paint → avoids a hydration mismatch
  const [left, setLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setLeft(compute(Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const units = [
    { label: "Days", value: left ? pad(left.days) : "--" },
    { label: "Hours", value: left ? pad(left.hours) : "--" },
    { label: "Minutes", value: left ? pad(left.minutes) : "--" },
    { label: "Seconds", value: left ? pad(left.seconds) : "--" },
  ];

  return (
    <section
      id="countdown"
      className="relative overflow-hidden bg-jade px-5 py-20 text-ivory"
      style={{
        backgroundImage:
          "radial-gradient(60% 80% at 50% 0%, rgba(212,175,55,0.16), transparent 70%), radial-gradient(50% 60% at 0% 100%, rgba(45,106,79,0.6), transparent 70%)",
      }}
    >
      <Reveal>
        <SectionHeading
          light
          eyebrow="The Big Day"
          title={left?.done ? "Today is the day" : "Counting down to forever"}
          subtitle={
            left?.done
              ? "The celebration has begun — thank you for sharing it with us."
              : undefined
          }
        />
      </Reveal>

      <Reveal delay={150}>
        <div
          role="timer"
          aria-label="Time remaining until the wedding"
          className="mx-auto mt-10 grid max-w-md grid-cols-4 gap-2.5 sm:gap-4"
        >
          {units.map((u) => (
            <div
              key={u.label}
              className="flex flex-col items-center rounded-2xl border border-gold/50 bg-jade-deep/40 px-1 py-4 backdrop-blur-sm sm:py-5"
            >
              <span className="font-heading text-[1.85rem] leading-none tabular-nums text-gold-light sm:text-4xl">
                {u.value}
              </span>
              <span className="mt-2.5 text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-ivory/75 sm:text-[0.65rem]">
                {u.label}
              </span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
