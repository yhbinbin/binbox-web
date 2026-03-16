import { BreakSlicerPattern } from "@/lib/audio/breakSlicerEngine";

const stepIndexes = Array.from({ length: 16 }, (_, index) => index);

const formatSlice = (slice: number) => String(slice + 1).padStart(2, "0");

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

type SliceGridProps = {
  pattern: BreakSlicerPattern;
  currentStep: number | null;
  onSliceChange: (stepIndex: number, nextSlice: number) => void;
  onPitchChange: (stepIndex: number, nextPitch: number) => void;
  onPreviewSlice: (stepIndex: number) => void;
};

export default function SliceGrid({
  pattern,
  currentStep,
  onSliceChange,
  onPitchChange,
  onPreviewSlice,
}: SliceGridProps) {
  return (
    <div className="space-y-4">
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
      >
        {stepIndexes.map((step) => {
          const slice = pattern[step]?.slice ?? 0;
          const isCurrent = currentStep === step;
          return (
            // grid按钮
            <div
              key={`slice-${step}`}
              onClick={(event) => {
                event.stopPropagation();
                onPreviewSlice(step);
              }}
              className={`group relative flex h-24 flex-col justify-between rounded-xl border px-2 py-2 text-xs font-semibold tracking-[0.2em] transition-all duration-150 ${isCurrent
                ? "border-[var(--accent-primary)] bg-[var(--accent-primary)]/20 shadow-[0_0_16px_rgba(255,123,217,0.6)]"
                : "border-[var(--border-default)] bg-[var(--bg-card)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)] hover:shadow-[0_0_12px_rgba(96,248,255,0.2)]"
                } cursor-pointer active:scale-95 active:brightness-90`}
              aria-label={`Step ${step + 1} slice ${slice + 1}`}
            >
              <div className="flex items-center justify-between text-[10px] uppercase text-[var(--text-muted)]">
                <span>Slice</span>
                <span>{step + 1}</span>
              </div>
              <div className="text-center text-base text-[var(--text-primary)]">
                {formatSlice(slice)}
              </div>
              <div className="flex items-center justify-center">

                <div className="flex items-center gap-1">
                  {/* 减按钮 */}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSliceChange(step, clamp(slice - 1, 0, 15));
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-default)] text-[10px] leading-none text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] cursor-pointer"
                    aria-label={`Previous slice for step ${step + 1}`}
                  >
                    -
                  </button>
                  {/* 加按钮 */}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onSliceChange(step, clamp(slice + 1, 0, 15));
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--border-default)] text-[10px] leading-none text-[var(--text-secondary)] transition hover:border-[var(--border-hover)] cursor-pointer"
                    aria-label={`Next slice for step ${step + 1}`}
                  >
                    +
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
        Click to advance slice • Shift-click to go back
      </p>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
      >
        {stepIndexes.map((step) => {
          const pitch = pattern[step]?.pitch ?? 0;
          return (
            <div
              key={`pitch-${step}`}
              className="flex flex-col items-center gap-1 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-2"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                Pitch
              </span>
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => onPitchChange(step, clamp(pitch + 1, -3, 3))}
                  className="h-6 w-6 rounded-full border border-[var(--border-default)] text-xs text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                >
                  +
                </button>
                <span className="min-w-[24px] text-center text-xs text-[var(--text-primary)]">
                  {pitch > 0 ? `+${pitch}` : pitch}
                </span>
                <button
                  type="button"
                  onClick={() => onPitchChange(step, clamp(pitch - 1, -3, 3))}
                  className="h-6 w-6 rounded-full border border-[var(--border-default)] text-xs text-[var(--text-secondary)] transition hover:border-[var(--border-hover)]"
                >
                  -
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
