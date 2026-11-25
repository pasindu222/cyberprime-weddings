import Ornament from "./Ornament";

type Props = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  /** Use on dark (emerald) backgrounds */
  light?: boolean;
};

export default function SectionHeading({ eyebrow, title, subtitle, light = false }: Props) {
  return (
    <header className="mx-auto max-w-xl text-center">
      <p
        className={`text-[0.7rem] font-semibold uppercase tracking-[0.32em] ${
          light ? "text-gold-light" : "text-gold-dark"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-heading text-[2rem] leading-tight sm:text-4xl ${
          light ? "text-ivory" : "text-jade"
        }`}
      >
        {title}
      </h2>
      <Ornament className="mt-5" />
      {subtitle ? (
        <p
          className={`mt-5 text-[0.95rem] leading-relaxed ${
            light ? "text-ivory/80" : "text-jade/75"
          }`}
        >
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
