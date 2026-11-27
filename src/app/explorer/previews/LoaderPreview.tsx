"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/index";
import { getStringArg } from "../args";
import type { ExplorerArgs } from "../../explorer-config";
import type { PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange?: (progress: number) => void;
};

const row = { display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" } as const;
const column = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  alignItems: "center",
} as const;
const hint = { fontSize: 11, color: "var(--color-text-secondary)" } as const;

export function LoaderPreview({ args, composition, layout, onChange }: Props) {
  const variant = getStringArg(args, "variant", "spinner") as "spinner" | "progress";
  const size = Number(args.size) || 50;
  const label = getStringArg(args, "label", "Loading");
  
  // Use args.progress if provided, otherwise default to trickling
  const manualProgress = args.progress !== undefined ? Number(args.progress) : undefined;

  // State for the auto-looping progress animation in the main preview
  const [autoProgress, setAutoProgress] = useState(0);

  useEffect(() => {
    if (variant !== "progress" || manualProgress !== undefined) return;

    // Auto-fill loop for the preview when no manual progress is set
    const interval = setInterval(() => {
      setAutoProgress((prev) => {
        if (prev >= 1) {
          setTimeout(() => setAutoProgress(0), 800);
          return 1;
        }
        return Math.min(1, prev + 0.02);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [variant, manualProgress]);

  // Notify the explorer of the changing progress (optional, for the action log)
  useEffect(() => {
    if (variant === "progress" && manualProgress === undefined) {
      onChange?.(autoProgress);
    }
  }, [autoProgress, variant, manualProgress, onChange]);

  const activeProgress = manualProgress !== undefined ? manualProgress : autoProgress;

  const containerStyle = {
    ...row,
    flexDirection: layout === "horizontal" ? ("row" as const) : ("column" as const),
  };

  /* ============================================================
     Compositions
     ============================================================ */

  if (composition === "sizes") {
    return (
      <div style={containerStyle}>
        {[50, 60, 70].map((s) => (
          <div key={s} style={column}>
            <Loader variant={variant} size={s} label={label} />
            <span style={hint}>{s}px</span>
          </div>
        ))}
      </div>
    );
  }

  if (composition === "variants") {
    return (
      <div style={containerStyle}>
        <div style={column}>
          <Loader variant="spinner" size={size} label={label} />
          <span style={hint}>Spinner</span>
        </div>
        <div style={column}>
          <Loader variant="progress" size={size} label={label} />
          <span style={hint}>Progress (Trickle)</span>
        </div>
        <div style={column}>
          <Loader variant="progress" progress={1} size={size} label={label} />
          <span style={hint}>Progress (100%)</span>
        </div>
      </div>
    );
  }

  /* ============================================================
     Default (Single)
     ============================================================ */
  return (
    <div style={column}>
      <Loader
        variant={variant}
        size={size}
        label={label}
        progress={variant === "progress" ? activeProgress : undefined}
      />
      {variant === "progress" && (
        <span style={hint}>{Math.round(activeProgress * 100)}%</span>
      )}
    </div>
  );
}