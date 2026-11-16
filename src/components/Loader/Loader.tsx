"use client";

import {
  forwardRef,
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cx } from "@/utils";

import styles from "./Loader.module.css";

/* ============================================================
   Types
   ============================================================ */

export type LoaderVariant =
  | "spinner"
  | "dots"
  | "bars"
  | "pulse"
  | "ring";

export type LoaderSize = "small" | "medium" | "large";

export type LoaderColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "inherit";

export interface LoaderProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color"> {
  /** Visual style. Default "spinner". */
  variant?: LoaderVariant;
  /** Size preset OR exact pixel number. Default "medium" (24px). */
  size?: LoaderSize | number;
  /** Palette token. Use "inherit" to pick up the surrounding text colour. */
  color?: LoaderColor;
  /** Visible label under or beside the loader. */
  label?: ReactNode;
  /** Where the label sits relative to the spinner. Default "bottom". */
  labelPlacement?: "top" | "bottom" | "start" | "end";
  /** Hides the visual part and keeps only the accessible name. */
  hideVisual?: boolean;
  /** Accessible label for screen readers. Defaults to "Loading". */
  ariaLabel?: string;
  /** Renders a full-viewport overlay with a backdrop (portals to body). */
  fullscreen?: boolean;
  /** Milliseconds to wait before showing. Default 0 (immediate). */
  delay?: number;

  /* ---------- MUI CircularProgress parity ---------- */

  /**
   * MUI-style variant:
   *  - "indeterminate" → the spinner animates indefinitely
   *  - "determinate"   → a fixed arc based on `value` (0–100)
   *
   * Note: this is orthogonal to `variant` (the visual shape). If you set
   * `progressVariant="determinate"`, only the ring shape is used.
   */
  progressVariant?: "indeterminate" | "determinate";
  /** 0–100, only when progressVariant="determinate". */
  value?: number;
  /** Ring thickness in px. Default derived from size. */
  thickness?: number;
  /** Turn off the indeterminate stroke shrink; keeps rotation only. */
  disableShrink?: boolean;
}

/* ============================================================
   Size map
   ============================================================ */

const presetSizes = {
  small: { box: 16, gap: 6, font: "12px", dot: 6, barW: 3, barH: 12 },
  medium: { box: 24, gap: 8, font: "14px", dot: 8, barW: 4, barH: 18 },
  large: { box: 36, gap: 10, font: "16px", dot: 12, barW: 5, barH: 26 },
} as const;

function resolveDims(size: LoaderSize | number) {
  if (typeof size === "number") {
    return {
      box: size,
      gap: Math.round(size * 0.33),
      font: `${Math.max(11, Math.round(size * 0.55))}px`,
      stroke: Math.max(2, Math.round(size / 10)),
      dot: Math.round(size / 3),
      barW: Math.max(3, Math.round(size / 6)),
      barH: Math.round(size * 0.75),
    };
  }
  const p = presetSizes[size];
  return { ...p, stroke: Math.max(2, Math.round(p.box / 10)) };
}

/* ============================================================
   Component
   ============================================================ */

export const Loader = forwardRef<HTMLSpanElement, LoaderProps>(function Loader(
  {
    variant = "spinner",
    size = "medium",
    color = "primary",
    label,
    labelPlacement = "bottom",
    hideVisual = false,
    ariaLabel = "Loading",
    fullscreen = false,
    delay = 0,
    progressVariant,
    value,
    thickness,
    disableShrink = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  /* ---------- Delay gate ---------- */

  const [visible, setVisible] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) {
      setVisible(true);
      return;
    }
    setVisible(false);
    const id = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(id);
  }, [delay]);

  if (!visible) return null;

  /* ---------- Resolve dims + progress mode ---------- */

  const dims = resolveDims(size);
  const stroke = thickness ?? dims.stroke;

  const isDeterminate = progressVariant === "determinate" && typeof value === "number";
  const clampedValue = isDeterminate
    ? Math.min(Math.max(value, 0), 100)
    : undefined;

  /* ---------- SVG geometry (ring / determinate) ---------- */

  const RADIUS = 9;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  /* ---------- CSS variables ---------- */

  const cssVars = {
    "--loader-box": `${dims.box}px`,
    "--loader-gap": `${dims.gap}px`,
    "--loader-font": dims.font,
    "--loader-stroke": stroke,
    "--loader-dot": `${dims.dot}px`,
    "--loader-bar-w": `${dims.barW}px`,
    "--loader-bar-h": `${dims.barH}px`,
    ...style,
  } as CSSProperties;

  /* ---------- Render ---------- */

  const root = (
    <span
      ref={ref}
      role={isDeterminate ? "progressbar" : "status"}
      aria-live={isDeterminate ? undefined : "polite"}
      aria-label={ariaLabel}
      aria-valuenow={clampedValue}
      aria-valuemin={isDeterminate ? 0 : undefined}
      aria-valuemax={isDeterminate ? 100 : undefined}
      className={cx(styles.root, fullscreen && styles.fullscreen, className)}
      style={cssVars}
      {...rest}
    >
      <span className={cx(styles.content, styles[`placement_${labelPlacement}`])}>
        {!hideVisual && (
          <span
            className={cx(
              styles.visual,
              styles[`variant_${variant}`],
              styles[`color_${color}`],
              isDeterminate && styles.determinate,
              disableShrink && styles.disableShrink,
            )}
            aria-hidden="true"
          >
            {/* ---------- Ring (spinner + ring + determinate) ---------- */}

            {variant === "spinner" && (
              <svg
                viewBox="0 0 24 24"
                className={styles.svg}
                role="presentation"
              >
                <circle
                  cx="12"
                  cy="12"
                  r={RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.2"
                  strokeWidth="var(--loader-stroke)"
                />
                {isDeterminate ? (
                  <circle
                    cx="12"
                    cy="12"
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="var(--loader-stroke)"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={
                      CIRCUMFERENCE * (1 - (clampedValue ?? 0) / 100)
                    }
                    transform="rotate(-90 12 12)"
                    className={styles.arcDet}
                  />
                ) : (
                  <circle
                    cx="12"
                    cy="12"
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="var(--loader-stroke)"
                    strokeLinecap="round"
                    strokeDasharray="14 44"
                    className={styles.arc}
                  />
                )}
              </svg>
            )}

            {variant === "ring" && (
              <svg
                viewBox="0 0 24 24"
                className={styles.svg}
                role="presentation"
              >
                <circle
                  cx="12"
                  cy="12"
                  r={RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="var(--loader-stroke)"
                  strokeLinecap="round"
                  strokeDasharray="1 56"
                  className={styles.ringDash}
                />
              </svg>
            )}

            {/* ---------- Dots ---------- */}

            {variant === "dots" && (
              <>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </>
            )}

            {/* ---------- Bars ---------- */}

            {variant === "bars" && (
              <>
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
                <span className={styles.bar} />
              </>
            )}

            {/* ---------- Pulse (core + ring) ---------- */}

            {variant === "pulse" && (
              <>
                <span className={styles.pulseCore} />
                <span className={styles.pulseRing} />
              </>
            )}
          </span>
        )}
        {label && <span className={styles.label}>{label}</span>}
      </span>
    </span>
  );

  if (!fullscreen) return root;
  if (typeof document === "undefined") return root;

  return createPortal(root, document.body);
});