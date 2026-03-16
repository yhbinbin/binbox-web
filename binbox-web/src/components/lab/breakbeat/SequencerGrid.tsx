import { BreakbeatPattern } from "@/lib/audio/breakbeatEngine";

const stepIndexes = Array.from({ length: 16 }, (_, index) => index);

const instrumentRows = [
  { key: "kick", label: "Kick" },
  { key: "snare", label: "Snare" },
  { key: "hat", label: "Hi-hat" },
] as const;

type InstrumentKey = (typeof instrumentRows)[number]["key"];

type SequencerGridProps = {
  pattern: BreakbeatPattern;
  currentStep: number | null;
  onToggleStep: (row: InstrumentKey, step: number) => void;
};

export default function SequencerGrid({
  pattern,
  currentStep,
  onToggleStep,
}: SequencerGridProps) {
  return (
    <div className="space-y-4">
      {instrumentRows.map((row) => (
        <div key={row.key} className="space-y-2">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">
            <span>{row.label}</span>
            <span className="text-[10px] text-[var(--text-muted)] opacity-60">
              {row.key.toUpperCase()}
            </span>
          </div>
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
            aria-label={`${row.label} pattern`}
          >
            {stepIndexes.map((step) => {
              const isActive = pattern[step]?.[row.key];
              const isCurrent = currentStep === step;
              return (
                <button
                  type="button"
                  key={`${row.key}-${step}`}
                  onClick={() => onToggleStep(row.key, step)}
                  className={`group relative h-10 rounded-lg border text-[10px] uppercase transition cursor-pointer ${
                    isActive
                      ? "border-[var(--accent-secondary)] bg-[var(--accent-secondary)]/30"
                      : "border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--border-hover)]"
                  } ${
                    isCurrent
                      ? "shadow-[0_0_16px_rgba(var(--accent-primary-rgb,255,123,217),0.65)]"
                      : ""
                  }`}
                  aria-pressed={isActive}
                >
                  <span
                    className={`absolute inset-0 rounded-lg transition ${
                      isCurrent
                        ? "animate-pulse border border-[var(--accent-primary)]/60"
                        : ""
                    }`}
                  />
                  <span className="relative text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]">
                    {step + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
