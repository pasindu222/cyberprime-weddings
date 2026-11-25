/** Gold lotus divider */
export default function Ornament({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 text-gold ${className}`}
      aria-hidden="true"
    >
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-gold" />
      <svg
        width="30"
        height="30"
        viewBox="0 0 32 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M16 5 C20.5 10.5 20.5 18 16 24 C11.5 18 11.5 10.5 16 5Z" />
        <path d="M16 24 C10 22.5 6 17.5 5 12 C10.5 12.8 14.2 17 16 24Z" />
        <path d="M16 24 C22 22.5 26 17.5 27 12 C21.5 12.8 17.8 17 16 24Z" />
        <path d="M9 27 H23" />
      </svg>
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}
