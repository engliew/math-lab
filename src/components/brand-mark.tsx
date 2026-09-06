import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const mark = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  const word = size === "sm" ? "text-lg" : "text-2xl";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className={cn(
          "grid place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm",
          mark,
        )}
      >
        <svg viewBox="0 0 32 32" className="h-[60%] w-[60%]" fill="none">
          <circle cx="10" cy="12" r="2.2" fill="currentColor" />
          <circle cx="16" cy="8" r="2.2" fill="currentColor" />
          <circle cx="22" cy="12" r="2.2" fill="currentColor" />
          <circle cx="12" cy="20" r="2.2" fill="currentColor" />
          <circle cx="20" cy="20" r="2.2" fill="currentColor" />
        </svg>
      </span>
      <span className={cn("font-display font-semibold tracking-tight", word)}>
        Math Lab
      </span>
    </div>
  );
}
