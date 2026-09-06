"use client";

import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

export function NumberPad({
  onDigit,
  onClear,
  onDelete,
  max = 10,
}: {
  onDigit: (digit: string) => void;
  onClear: () => void;
  onDelete: () => void;
  max?: number;
}) {
  const keys = Array.from({ length: max + 1 }, (_, i) => String(i));

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
      {keys.map((key) => (
        <Button
          key={key}
          type="button"
          variant="outline"
          size="lg"
          className="h-14 text-xl"
          onClick={() => onDigit(key)}
        >
          {key}
        </Button>
      ))}
      <Button
        type="button"
        variant="secondary"
        size="lg"
        className="h-14"
        onClick={onDelete}
        aria-label="Delete last digit"
      >
        <Delete className="size-5" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="lg"
        className="h-14 col-span-2 sm:col-span-1"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  );
}
