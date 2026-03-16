"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ value, onValueChange, options, placeholder, disabled, className }, ref) => {
    return (
      <div className="relative">
        <select
          ref={ref}
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "w-full appearance-none rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-2.5 pr-10",
            "text-xs uppercase tracking-[0.2em] text-[var(--text-primary)]",
            "transition-colors cursor-pointer",
            "hover:border-[var(--border-hover)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select, type SelectOption };
