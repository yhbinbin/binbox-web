import { useTranslations } from "next-intl";
import { DrumKitId, drumKits } from "@/lib/audio/drumKits";
import { Button } from "@/components/ui/Button";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import { Select, type SelectOption } from "@/components/ui/Select";

type ControlsPanelProps = {
  isPlaying: boolean;
  tempo: number;
  swing: number;
  humanize: boolean;
  kitId: DrumKitId;
  onTogglePlay: () => void;
  onGenerate: () => void;
  onExportMidi: () => void;
  onTempoChange: (value: number) => void;
  onSwingChange: (value: number) => void;
  onHumanizeChange: (value: boolean) => void;
  onKitChange: (value: DrumKitId) => void;
};

export default function ControlsPanel({
  isPlaying,
  tempo,
  swing,
  humanize,
  kitId,
  onTogglePlay,
  onGenerate,
  onExportMidi,
  onTempoChange,
  onSwingChange,
  onHumanizeChange,
  onKitChange,
}: ControlsPanelProps) {
  const t = useTranslations("lab.breakbeatGenerator");

  const kitOptions: SelectOption[] = drumKits.map((kit) => ({
    value: kit.id,
    label: kit.name,
    description: kit.description,
  }));

  const currentKit = drumKits.find((kit) => kit.id === kitId);

  return (
    <div className="grid gap-6 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 md:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="default" onClick={onTogglePlay}>
          {isPlaying ? t("stop") : t("play")}
        </Button>
        <Button variant="secondary" onClick={onGenerate}>
          {t("generatePattern")}
        </Button>
        <Button variant="ghost" onClick={onExportMidi}>
          {t("exportMidi")}
        </Button>
        <label className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          <span>{t("humanize")}</span>
          <Switch
            checked={humanize}
            onCheckedChange={onHumanizeChange}
            accentColor="secondary"
          />
        </label>
      </div>

      <div className="grid gap-5 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
        <label className="space-y-3">
          <span className="block">{t("tempo")}</span>
          <div className="flex items-center gap-3">
            <Slider
              min={80}
              max={180}
              value={tempo}
              onChange={(e) => onTempoChange(Number(e.target.value))}
              accentColor="secondary"
            />
            <span className="min-w-[70px] text-right text-sm text-[var(--accent-secondary)]">
              {tempo} BPM
            </span>
          </div>
        </label>

        <label className="space-y-3">
          <span className="block">{t("swing")}</span>
          <div className="flex items-center gap-3">
            <Slider
              min={0}
              max={100}
              value={swing}
              onChange={(e) => onSwingChange(Number(e.target.value))}
              accentColor="primary"
            />
            <span className="min-w-[70px] text-right text-sm text-[var(--accent-primary)]">
              {swing}%
            </span>
          </div>
        </label>

        <div className="space-y-3">
          <span className="block">{t("drumKit")}</span>
          <Select
            value={kitId}
            onValueChange={(value) => onKitChange(value as DrumKitId)}
            options={kitOptions}
          />
          {currentKit && (
            <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">
              {currentKit.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
