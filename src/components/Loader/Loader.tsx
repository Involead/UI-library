"use client";
import { useEffect, useId, useRef, type CSSProperties } from "react";

import { cx } from "@/utils";

import styles from "./Loader.module.css";

export type LoaderVariant = "spinner" | "progress";

export interface LoaderProps {
  /**
   * `"spinner"`: a gradient ring spins while the logo assembles inside it.
   * `"progress"`: the logo fills from the bottom. Default `"spinner"`.
   */
  variant?: LoaderVariant;
  /**
   * `progress` variant only. 0 to 1. Leave it undefined while a request is in
   * flight and the loader trickles toward ~92% on its own; pass `1` when the
   * work is done to fill it up.
   */
  progress?: number;
  /** Accessible name for screen readers. Not shown on screen. Default `"Loading"`. */
  label?: string;
  /** Width in px (the spinner's ring is included). Default `160`. */
  size?: number;
  className?: string;
  style?: CSSProperties;
}

const PROGRESS_VIEW = { x: 330, y: 60, w: 470, h: 450 };
const SPINNER_VIEWBOX = "246 -15 630 610";

interface Piece {
  name: string;
  shape: "polygon" | "rect" | "path";
  d?: string;
  /** Gradient id suffix, or `null` to use `fill`. */
  gradient: string | null;
  fill?: string;
  /** Where the piece flies in from (spinner assembly), in px. */
  from: [number, number];
}

const PIECES: Piece[] = [
  {
    name: "top",
    shape: "polygon",
    d: "553,82 513,153 595,153",
    gradient: null,
    fill: "var(--loader-top)",
    from: [0, -60],
  },
  {
    name: "left",
    shape: "polygon",
    d: "513,172 543,172 410,403 575,403 575,441 347,441",
    gradient: "L",
    from: [-90, 60],
  },
  {
    name: "right",
    shape: "polygon",
    d: "575,172 612,172 775,441 636,441 636,403 710,403",
    gradient: "R",
    from: [90, 60],
  },
  { name: "i", shape: "rect", gradient: "I", from: [0, -70] },
  {
    name: "l",
    shape: "path",
    d: "M585 311a8 8 0 0 1 8-8h27a8 8 0 0 1 8 8V455H675a8 8 0 0 1 8 8V490a8 8 0 0 1-8 8H593a8 8 0 0 1-8-8Z",
    gradient: "LL",
    from: [0, 80],
  },
];

const STOPS: Record<string, [string, string, Record<string, number>]> = {
  L: ["--loader-p1", "--loader-p2", { x1: 347, y1: 0, x2: 575, y2: 0 }],
  R: ["--loader-t1", "--loader-t2", { x1: 575, y1: 172, x2: 775, y2: 441 }],
  I: ["--loader-p2", "--loader-p1", { x1: 0, y1: 190, x2: 0, y2: 370 }],
  LL: ["--loader-t1", "--loader-t2", { x1: 585, y1: 303, x2: 683, y2: 498 }],
};

function Shapes({ uid, animated }: { uid: string; animated: boolean }) {
  return (
    <>
      {PIECES.map((p, i) => {
        const common = {
          fill: p.gradient ? `url(#${uid}-${p.gradient})` : p.fill,
          ...(animated
            ? {
                className: styles.loader__piece,
                style: {
                  "--i": i,
                  "--x": `${p.from[0]}px`,
                  "--y": `${p.from[1]}px`,
                } as CSSProperties,
              }
            : {}),
        };
        if (p.shape === "polygon") return <polygon key={p.name} {...common} points={p.d} />;
        if (p.shape === "rect")
          return <rect key={p.name} {...common} x="537" y="190" width="38" height="180" rx="5" />;
        return <path key={p.name} {...common} d={p.d} />;
      })}
    </>
  );
}

export function Loader({
  variant = "spinner",
  progress,
  label = "Loading",
  size = 50,
  className,
  style,
}: LoaderProps) {
  const uid = useId().replace(/:/g, "");
  const isProgress = variant === "progress";
  const root = useRef<HTMLDivElement>(null);
  const clipRect = useRef<SVGRectElement>(null);
  const target = useRef<number | undefined>(progress);

  useEffect(() => {
    target.current = progress;
  }, [progress]);

  // Progress variant: ease toward the given value, or trickle when undefined.
  useEffect(() => {
    if (!isProgress) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const { y, h } = PROGRESS_VIEW;
    let shown = 0;
    let raf = 0;

    const tick = (now: number) => {
      const raw = target.current ?? 0.92 * (1 - Math.exp(-(now - start) / 2500));
      const goal = Math.min(1, Math.max(0, raw));
      shown = reduce ? goal : shown + (goal - shown) * 0.1;
      if (Math.abs(goal - shown) < 0.001) shown = goal;
      clipRect.current?.setAttribute("y", String(y + h - h * shown));
      clipRect.current?.setAttribute("height", String(h * shown));
      root.current?.setAttribute("aria-valuenow", String(Math.round(shown * 100)));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isProgress]);

  const a11y = isProgress
    ? { role: "progressbar", "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": 0 }
    : { role: "status", "aria-live": "polite" as const };

  return (
    <div
      ref={root}
      className={cx(styles.loader, className)}
      style={{ width: size, ...style }}
      aria-label={label}
      {...a11y}
    >
      <svg
        viewBox={
          isProgress
            ? `${PROGRESS_VIEW.x} ${PROGRESS_VIEW.y} ${PROGRESS_VIEW.w} ${PROGRESS_VIEW.h}`
            : SPINNER_VIEWBOX
        }
        aria-hidden="true"
      >
        <defs>
          {Object.entries(STOPS).map(([id, [from, to, coords]]) => (
            <linearGradient key={id} id={`${uid}-${id}`} gradientUnits="userSpaceOnUse" {...coords}>
              <stop offset="0" style={{ stopColor: `var(${from})` }} />
              <stop offset="1" style={{ stopColor: `var(${to})` }} />
            </linearGradient>
          ))}
          {isProgress ? (
            <clipPath id={`${uid}-clip`}>
              <rect
                ref={clipRect}
                x={PROGRESS_VIEW.x}
                y={PROGRESS_VIEW.y + PROGRESS_VIEW.h}
                width={PROGRESS_VIEW.w}
                height="0"
              />
            </clipPath>
          ) : (
            <linearGradient id={`${uid}-ring`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" style={{ stopColor: "var(--loader-p1)" }} />
              <stop offset="1" style={{ stopColor: "var(--loader-t2)" }} />
            </linearGradient>
          )}
        </defs>

        {isProgress ? (
          <>
            <g opacity=".14">
              <Shapes uid={uid} animated={false} />
            </g>
            <g clipPath={`url(#${uid}-clip)`}>
              <Shapes uid={uid} animated={false} />
            </g>
          </>
        ) : (
          <>
            <circle
              cx="561"
              cy="290"
              r="292"
              fill="none"
              strokeWidth="14"
              className={styles.loader__track}
            />
            <circle
              className={styles.loader__ring}
              cx="561"
              cy="290"
              r="292"
              fill="none"
              stroke={`url(#${uid}-ring)`}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray="520 1320"
            />
            <Shapes uid={uid} animated />
          </>
        )}
      </svg>
    </div>
  );
}
