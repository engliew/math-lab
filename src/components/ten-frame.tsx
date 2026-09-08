import { cn } from "@/lib/utils";

function Cells({ count, label }: { count: number; label?: string }) {
  return (
    <div
      className="inline-grid grid-cols-5 gap-1 rounded-xl border-2 border-foreground/15 bg-muted/60 p-1.5"
      role="img"
      aria-label={label ?? "A ten-frame of counters"}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-5 w-5 rounded-full border-2 sm:h-6 sm:w-6",
            i < count
              ? "border-primary bg-primary shadow-sm"
              : "border-dashed border-foreground/20 bg-card",
          )}
        />
      ))}
    </div>
  );
}

export function TenFrame({ count }: { count: number }) {
  return <Cells count={count} />;
}

export function TwoFrames({ left, right }: { left: number; right: number }) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-8">
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Left
        </p>
        <Cells count={left} />
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Right
        </p>
        <Cells count={right} />
      </div>
    </div>
  );
}

export function NumberSequence({ items }: { items: Array<number | null> }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-xl border-2 text-xl font-semibold",
            item === null
              ? "border-dashed border-primary bg-accent text-primary"
              : "border-border bg-muted text-foreground",
          )}
        >
          {item ?? "?"}
        </span>
      ))}
    </div>
  );
}
