"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  accentColor?: "primary" | "secondary" | "tertiary" | "quaternary";
}

const colorVars = {
  primary: "var(--accent-primary)",
  secondary: "var(--accent-secondary)",
  tertiary: "var(--accent-tertiary)",
  quaternary: "var(--accent-quaternary)",
};

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, accentColor = "secondary", ...props }, ref) => {
    const color = colorVars[accentColor];

    return (
      <input
        type="range"
        className={cn(
          "w-full h-2 rounded-full appearance-none cursor-pointer",
          "bg-[var(--input)] border border-[var(--input-border)]",
          "[&::-webkit-slider-thumb]:appearance-none",
          "[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4",
          "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2",
          "[&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110",
          "[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4",
          "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2",
          "[&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
          className
        )}
        style={{
          // @ts-expect-error CSS custom properties
          "--slider-accent": color,
          background: `linear-gradient(to right, ${color} 0%, ${color} ${
            ((Number(props.value) - Number(props.min || 0)) /
              (Number(props.max || 100) - Number(props.min || 0))) *
            100
          }%, var(--input) ${
            ((Number(props.value) - Number(props.min || 0)) /
              (Number(props.max || 100) - Number(props.min || 0))) *
            100
          }%, var(--input) 100%)`,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Slider.displayName = "Slider";

// Additional styles in globals.css for thumb color:
// [style*="--slider-accent"]::-webkit-slider-thumb { background: var(--slider-accent); border-color: var(--slider-accent); }
// [style*="--slider-accent"]::-moz-range-thumb { background: var(--slider-accent); border-color: var(--slider-accent); }

export { Slider };
