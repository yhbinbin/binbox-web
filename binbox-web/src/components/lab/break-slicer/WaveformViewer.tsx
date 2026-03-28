"use client";

import { useEffect, useMemo, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions";

const SLICE_COUNT = 16;

const getSliceColor = (index: number, active: boolean) => {
  if (active) return "rgba(236, 72, 153, 0.56)";
  return index % 2 === 0 ? "rgba(148, 163, 184, 0.18)" : "rgba(100, 116, 139, 0.14)";
};

type WaveformViewerProps = {
  sampleUrl: string;
  activeSlice: number | null;
  onSliceClick?: (sliceIndex: number) => void;
};

export default function WaveformViewer({
  sampleUrl,
  activeSlice,
  onSliceClick,
}: WaveformViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveSurferRef = useRef<WaveSurfer | null>(null);
  const regionsRef = useRef<Region[]>([]);
  const onSliceClickRef = useRef(onSliceClick);
  const isUnmountingRef = useRef(false);

  const regionOptions = useMemo(() => ({
    drag: false,
    resize: false,
  }), []);

  useEffect(() => {
    onSliceClickRef.current = onSliceClick;
  }, [onSliceClick]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      height: 120,
      waveColor: "rgba(51, 65, 85, 0.96)",
      progressColor: "rgba(13, 148, 136, 0.92)",
      cursorColor: "rgba(236, 72, 153, 0.96)",
      barWidth: 2,
      barGap: 1,
      barRadius: 2,
      normalize: true,
      interact: true,
      minPxPerSec: 50,
    });

    const regions = ws.registerPlugin(RegionsPlugin.create());

    waveSurferRef.current = ws;

    const handleError = (error: unknown) => {
      const err = error as DOMException | Error | null;
      if (err && "name" in err && err.name === "AbortError") return;
      if (isUnmountingRef.current) return;
      // eslint-disable-next-line no-console
      console.error("WaveSurfer error:", error);
    };

    const onReady = () => {
      const duration = ws.getDuration();
      const sliceDuration = duration / SLICE_COUNT;
      regions.clearRegions();
      regionsRef.current = [];

      for (let i = 0; i < SLICE_COUNT; i += 1) {
        const start = i * sliceDuration;
        const end = start + sliceDuration;
        const region = regions.addRegion({
          start,
          end,
          color: getSliceColor(i, false),
          ...regionOptions,
        });
        region.id = String(i);
        const label = document.createElement("span");
        label.textContent = String(i + 1);
        label.className =
          "absolute right-2 top-1 text-[10px] uppercase tracking-[0.2em] text-white/80";
        region.element?.appendChild(label);
        region.element?.addEventListener("click", () => {
          const duration = ws.getDuration();
          if (duration > 0) {
            ws.setTime(start);
          }
          onSliceClickRef.current?.(i);
        });
        regionsRef.current.push(region);
      }
    };

    ws.on("ready", onReady);
    ws.on("error", handleError);

    return () => {
      isUnmountingRef.current = true;
      ws.un("ready", onReady);
      ws.un("error", handleError);
      ws.unAll();
      try {
        ws.destroy();
      } catch {
        // Ignore errors thrown by WaveSurfer when teardown happens mid-load (AbortError, etc.)
      }
      waveSurferRef.current = null;
      regionsRef.current = [];
      isUnmountingRef.current = false;
    };
  }, [regionOptions]);

  useEffect(() => {
    const ws = waveSurferRef.current;
    if (!ws) return;
    ws.load(sampleUrl).catch(() => {
      // Ignore AbortError from rapid sample switching or unmount.
    });
  }, [sampleUrl]);

  useEffect(() => {
    regionsRef.current.forEach((region, index) => {
      region.setOptions({ color: getSliceColor(index, activeSlice === index) });
    });
  }, [activeSlice]);

  return (
    <div className="rounded-3xl border border-[var(--border-default)] bg-[var(--bg-card)] p-4">
      <div
        ref={containerRef}
        className="w-full"
        aria-label="Break waveform"
      />
    </div>
  );
}
