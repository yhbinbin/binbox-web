"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import * as Tone from "tone";
import {
  BreakSlicerPattern,
  createBreakSlicerEngine,
} from "@/lib/audio/breakSlicerEngine";
import { Button } from "@/components/ui/Button";
import { Select, type SelectOption } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";
import WaveformViewer from "@/components/lab/break-slicer/WaveformViewer";
import SliceGrid from "@/components/lab/break-slicer/SliceGrid";

const SAMPLE_OPTIONS: SelectOption[] = [
  {
    value: "/audio/breaks/amen-break.wav",
    label: "Amen Break (Synth)",
    description: "Built-in synthetic break for fast load.",
  },
  {
    value: "/audio/breaks/real-amen-break.wav",
    label: "Real Amen Break",
    description: "User-provided break sample.",
  },
];

const createEmptyPattern = (): BreakSlicerPattern =>
  Array.from({ length: 16 }, (_item, index) => ({ slice: index, pitch: 0 }));

type EngineRef = ReturnType<typeof createBreakSlicerEngine> | null;

export default function BreakSlicer() {
  const t = useTranslations("lab.breakSlicer");
  const engineRef = useRef<EngineRef>(null);
  const [pattern, setPattern] = useState<BreakSlicerPattern>(createEmptyPattern());
  const patternRef = useRef<BreakSlicerPattern>(pattern);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [activeSlice, setActiveSlice] = useState<number | null>(null);
  const [sampleUrl, setSampleUrl] = useState(SAMPLE_OPTIONS[0].value);
  const [tempo, setTempo] = useState(120);

  const ensureEngine = useCallback(() => {
    if (!engineRef.current) {
      engineRef.current = createBreakSlicerEngine({
        onStep: (stepIndex) => setCurrentStep(stepIndex),
        onSliceTriggered: (sliceIndex) => setActiveSlice(sliceIndex),
      });
      engineRef.current.setPattern(patternRef.current);
      engineRef.current.setTempo(tempo);
    }
  }, [tempo]);

  const handlePlay = useCallback(async () => {
    ensureEngine();
    await Tone.start();
    await engineRef.current?.init(sampleUrl);
    engineRef.current?.start();
    setIsPlaying(true);
  }, [ensureEngine, sampleUrl]);

  const handleStop = useCallback(() => {
    engineRef.current?.stop();
    setIsPlaying(false);
    setCurrentStep(null);
    setActiveSlice(null);
  }, []);

  const handleToggle = useCallback(() => {
    if (isPlaying) {
      handleStop();
      return;
    }

    void handlePlay();
  }, [handlePlay, handleStop, isPlaying]);

  const handleRandomize = useCallback(() => {
    ensureEngine();
    const nextPattern = engineRef.current?.randomizePattern();
    if (!nextPattern) return;
    engineRef.current?.setPattern(nextPattern);
    setPattern(nextPattern);
  }, [ensureEngine]);

  const handleJungleChop = useCallback(() => {
    ensureEngine();
    const nextPattern = engineRef.current?.generateJungleChop();
    if (!nextPattern) return;
    engineRef.current?.setPattern(nextPattern);
    setPattern(nextPattern);
  }, [ensureEngine]);

  const handleSliceChange = useCallback((stepIndex: number, nextSlice: number) => {
    setPattern((prev) => {
      const next = prev.map((step) => ({ ...step }));
      if (!next[stepIndex]) return prev;
      next[stepIndex].slice = nextSlice;
      engineRef.current?.setPattern(next);
      return next;
    });
  }, []);

  const applySliceToStep = useCallback(
    (stepIndex: number, sliceIndex: number) => {
      setPattern((prev) => {
        const next = prev.map((step) => ({ ...step }));
        if (!next[stepIndex]) return prev;
        next[stepIndex].slice = sliceIndex;
        engineRef.current?.setPattern(next);
        return next;
      });
    },
    []
  );

  const handlePitchChange = useCallback((stepIndex: number, nextPitch: number) => {
    setPattern((prev) => {
      const next = prev.map((step) => ({ ...step }));
      if (!next[stepIndex]) return prev;
      next[stepIndex].pitch = nextPitch;
      engineRef.current?.setPattern(next);
      return next;
    });
  }, []);

  const handleSampleChange = useCallback(
    async (value: string) => {
      setSampleUrl(value);
      ensureEngine();
      await engineRef.current?.setSample(value);
    },
    [ensureEngine]
  );

  const handleTempoChange = useCallback(
    (value: number) => {
      setTempo(value);
      engineRef.current?.setTempo(value);
    },
    []
  );

  const handleSlicePreview = useCallback(
    async (sliceIndex: number) => {
      // 确保 AudioContext 已启动（需要用户手势触发）
      await Tone.start();
      setActiveSlice(sliceIndex);
      ensureEngine();
      await engineRef.current?.init(sampleUrl);
      engineRef.current?.playSlice(sliceIndex);
    },
    [ensureEngine, sampleUrl]
  );

  const handleStepPreview = useCallback(
    (stepIndex: number) => {
      const step = patternRef.current[stepIndex];
      if (!step) return;
      void handleSlicePreview(step.slice);
    },
    [handleSlicePreview]
  );

  const sliceSummary = useMemo(
    () => pattern.map((step) => step.slice + 1).join(" "),
    [pattern]
  );

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

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
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {t("sliceOrder")}: {sliceSummary}
        </p>
      </div>

      <WaveformViewer
        sampleUrl={sampleUrl}
        activeSlice={activeSlice}
        onSliceHover={handleSlicePreview}
      />


      {/* 操作栏 */}
      <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
        <Button variant="default" onClick={handleToggle}>
          {isPlaying ? t("stop") : t("play")}
        </Button>
        <Button variant="secondary" onClick={handleRandomize}>
          {t("randomize")}
        </Button>
        <Button variant="ghost" onClick={handleJungleChop}>
          {t("jungleChop")}
        </Button>
        <label className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          <span>{t("tempo")}</span>
          <Slider
            min={80}
            max={180}
            value={tempo}
            onChange={(event) => handleTempoChange(Number(event.target.value))}
            accentColor="secondary"
          />
          <span className="min-w-[70px] text-right text-sm text-[var(--accent-secondary)]">
            {tempo} BPM
          </span>
        </label>
        <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
          <span>{t("breakSelect")}</span>
          <div className="min-w-[220px]">
            <Select
              value={sampleUrl}
              onValueChange={handleSampleChange}
              options={SAMPLE_OPTIONS}
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
        <SliceGrid
          pattern={pattern}
          currentStep={currentStep}
          onSliceChange={handleSliceChange}
          onPitchChange={handlePitchChange}
          onPreviewSlice={handleStepPreview}
        />
      </div>

      <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4 text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
        <p>{t("note")}</p>
      </div>
    </div>
  );
}
