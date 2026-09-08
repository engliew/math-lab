export function StarBurst({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
      fill="none"
    >
      <path
        d="M32 6l5.2 14.2L52 22l-11 8.6L44.4 46 32 37.8 19.6 46 23 30.6 12 22l14.8-1.8L32 6z"
        fill="#ffe566"
        stroke="#e6c200"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CountBuddy({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 96 80"
      className={className}
      aria-hidden
      fill="none"
    >
      <ellipse cx="48" cy="70" rx="22" ry="6" fill="#f0d9b5" />
      <circle cx="48" cy="40" r="26" fill="#7ce0b3" />
      <circle cx="38" cy="36" r="4" fill="#2d2a55" />
      <circle cx="58" cy="36" r="4" fill="#2d2a55" />
      <path
        d="M38 50c4 6 16 6 20 0"
        stroke="#2d2a55"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="18" cy="28" r="7" fill="#ff8fab" />
      <circle cx="78" cy="28" r="7" fill="#4c6fff" />
    </svg>
  );
}

export function SoftShapes() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="blob absolute -left-8 top-10 h-24 w-24 bg-secondary/70" />
      <span className="blob absolute -right-6 top-24 h-20 w-20 bg-accent/60" />
      <span className="blob absolute bottom-4 left-1/3 h-16 w-16 bg-primary/20" />
    </div>
  );
}
