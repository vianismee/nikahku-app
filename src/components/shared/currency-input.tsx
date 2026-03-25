"use client";

import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { formatInputRupiah, parseCurrency } from "@/lib/utils/format-currency";
import { cn } from "@/lib/utils";

interface CurrencyInputProps
  extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value: number;
  onValueChange: (value: number) => void;
  prefix?: string;
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, prefix = "Rp", className, ...props }, ref) => {
    const displayValue = value ? formatInputRupiah(value.toString()) : "";

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = e.target.value;
      const parsed = parseCurrency(raw);
      onValueChange(parsed);
    }

    return (
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-number">
            {prefix}
          </span>
        )}
        <Input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          className={cn("font-number", prefix && "pl-10", className)}
          {...props}
        />
      </div>
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
