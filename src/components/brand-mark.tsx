import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const mark = size === "sm" ? "h-9 w-9" : "h-12 w-12";
  const word = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "grid place-items-center rounded-[1.35rem] bg-primary text-primary-foreground shadow-[0_3px_0_0_#3554d6]",
          mark,
        )}
      >
        <svg viewBox="0 0 32 32" className="h-[70%] w-[70%]" fill="none">
          <circle cx="10" cy="13" r="3" fill="#ffe566" />
          <circle cx="22" cy="13" r="3" fill="#ff8fab" />
          <circle cx="16" cy="21" r="3" fill="#7ce0b3" />
        </svg>
      </span>
      <span className={cn("font-display font-semibold tracking-tight", word)}>
        Math Lab
      </span>
    </div>
  );
}
