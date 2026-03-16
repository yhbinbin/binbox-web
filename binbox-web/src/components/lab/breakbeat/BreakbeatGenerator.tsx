"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import * as Tone from "tone";
import {
  BreakbeatPattern,
  createBreakbeatEngine,
} from "@/lib/audio/breakbeatEngine";
import { DrumKitId } from "@/lib/audio/drumKits";
import { downloadMidi, exportPatternToMidi } from "@/lib/audio/midiExport";
import ControlsPanel from "@/components/lab/breakbeat/ControlsPanel";
import SequencerGrid from "@/components/lab/breakbeat/SequencerGrid";

const createEmptyPattern = (): BreakbeatPattern =>
  Array.from({ length: 16 }, () => ({ kick: false, snare: false, hat: false }));

type EngineRef = ReturnType<typeof createBreakbeatEngine> | null;

type InstrumentKey = "kick" | "snare" | "hat";

// 默认值常量，避免在 ref 内引用 state
const DEFAULT_TEMPO = 120;
const DEFAULT_SWING = 25;
const DEFAULT_HUMANIZE = true;

export default function BreakbeatGenerator() {
  const t = useTranslations("lab.breakbeatGenerator");
  const engineRef = useRef<EngineRef>(null);
  const [pattern, setPattern] = useState<BreakbeatPattern>(createEmptyPattern());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [tempo, setTempo] = useState(DEFAULT_TEMPO);
  const [swing, setSwing] = useState(DEFAULT_SWING);
  const [humanize, setHumanize] = useState(DEFAULT_HUMANIZE);
  const [kitId, setKitId] = useState<DrumKitId>("classic-909");

  // ensureEngine 不依赖于任何会变化的参数，只负责创建 engine
  // 具体参数通过 setter 方法设置，避免 engine 被重复销毁/重建
  const ensureEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = createBreakbeatEngine({
        onStep: (stepIndex) => setCurrentStep(stepIndex),
      });
      const initial = engineRef.current.generatePattern();
      engineRef.current.setPattern(initial);
      setPattern(initial);
      // 使用默认值初始化，之后通过 setter 更新
      engineRef.current.setTempo(DEFAULT_TEMPO);
      engineRef.current.setSwing(DEFAULT_SWING / 100);
      engineRef.current.setHumanize(DEFAULT_HUMANIZE);
    }
  }, []);

  const handlePlay = useCallback(async () => {
    ensureEngine();

    // AudioContext must be resumed from a user gesture.
    await Tone.start();
    await engineRef.current?.init();
    engineRef.current?.start();
    setIsPlaying(true);
  }, [ensureEngine]);

  const handleStop = useCallback(() => {
    engineRef.current?.stop();
    setIsPlaying(false);
    setCurrentStep(null);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (isPlaying) {
      handleStop();
      return;
    }

    void handlePlay();
  }, [handlePlay, handleStop, isPlaying]);

  const handleGenerate = useCallback(() => {
    ensureEngine();
    const nextPattern = engineRef.current?.generatePattern();
    if (!nextPattern) return;
    engineRef.current?.setPattern(nextPattern);
    setPattern(nextPattern);
  }, [ensureEngine]);

  const handleExportMidi = useCallback(() => {
    const { blob } = exportPatternToMidi(pattern, tempo);
    downloadMidi(blob, "binbox-breakbeat.mid");
  }, [pattern, tempo]);

  const handleTempoChange = useCallback((value: number) => {
    setTempo(value);
    engineRef.current?.setTempo(value);
  }, []);

  const handleSwingChange = useCallback((value: number) => {
    setSwing(value);
    engineRef.current?.setSwing(value / 100);
  }, []);

  const handleHumanizeChange = useCallback((value: boolean) => {
    setHumanize(value);
    engineRef.current?.setHumanize(value);
  }, []);

  const handleKitChange = useCallback(async (value: DrumKitId) => {
    setKitId(value);
    ensureEngine();
    await engineRef.current?.setKit(value);
  }, [ensureEngine]);

  const handleToggleStep = useCallback(
    (row: InstrumentKey, step: number) => {
      setPattern((prev) => {
        const next = prev.map((item) => ({ ...item }));
        if (!next[step]) return prev;
        next[step][row] = !next[step][row];
        engineRef.current?.setPattern(next);
        return next;
      });
    },
    []
  );

  const filledSteps = useMemo(
    () => pattern.filter((step) => step.kick || step.snare || step.hat).length,
    [pattern]
  );

  useEffect(() => {
    ensureEngine();

    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, [ensureEngine]);

  return (
    <div className="space-y-8">
      <div className="space-y-3 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-[var(--accent-secondary)]">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold uppercase tracking-[0.2em] text-[var(--accent-primary)]">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-sm text-[var(--text-secondary)]">
          {t("description")}
        </p>
        <div className="text-xs uppercase tracking-[0.35em] text-[var(--text-muted)]">
          {t("hitsLoaded", { count: filledSteps })}
        </div>
      </div>

      <ControlsPanel
        isPlaying={isPlaying}
        tempo={tempo}
        swing={swing}
        humanize={humanize}
        kitId={kitId}
        onTogglePlay={handleTogglePlay}
        onGenerate={handleGenerate}
        onExportMidi={handleExportMidi}
        onTempoChange={handleTempoChange}
        onSwingChange={handleSwingChange}
        onHumanizeChange={handleHumanizeChange}
        onKitChange={handleKitChange}
      />

      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
        <SequencerGrid
          pattern={pattern}
          currentStep={currentStep}
          onToggleStep={handleToggleStep}
        />
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
        <p>
          {t("grooveNote")}
        </p>
      </div>
    </div>
  );
}
