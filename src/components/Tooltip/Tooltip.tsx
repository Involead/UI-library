"use client";

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";

import { cx } from "@/utils";

import styles from "./Tooltip.module.css";

/* ------------------------------------------------------------------ */
/* Public types                                                        */
/* ------------------------------------------------------------------ */

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export type TooltipVariant = "dark" | "light";

export interface TooltipProps {
  /** Tooltip content. Plain text for `dark`, any markup for `light`. */
  title: ReactNode;
  /** A single element that receives hover / focus handlers. */
  children: ReactElement<Record<string, unknown>>;
  /** Preferred side. Flips to the opposite side when there isn't room. */
  placement?: TooltipPlacement;
  /**
   * - "dark"  → compact bold text with an arrow (default tooltip)
   * - "light" → tinted panel for rich content (custom tooltip)
   */
  variant?: TooltipVariant;
  /** Defaults to `true` for `dark`, `false` for `light`. */
  arrow?: boolean;
  /**
   * Lets the pointer move into the tooltip without closing it, so links
   * and buttons inside it stay clickable.
   */
  interactive?: boolean;
  /** Ms before opening. */
  enterDelay?: number;
  /** Ms before closing. Defaults to 150 when `interactive`, else 0. */
  leaveDelay?: number;
  /** Only open when the trigger's text is cut off (ellipsis). */
  onlyWhenTruncated?: boolean;
  disabled?: boolean;
  /** Any CSS length. Overrides the variant's max width. */
  maxWidth?: number | string;
  /** Gap in px between trigger and tooltip. */
  offset?: number;
  className?: string;
  onOpenChange?: (open: boolean) => void;
}

/* ------------------------------------------------------------------ */
/* Positioning                                                         */
/* ------------------------------------------------------------------ */

const VIEWPORT_MARGIN = 8;
const ARROW_INSET = 12;

const OPPOSITE: Record<TooltipPlacement, TooltipPlacement> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

interface Position {
  top: number;
  left: number;
  placement: TooltipPlacement;
  arrowOffset: number;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), Math.max(min, max));

function computePosition(
  anchor: DOMRect,
  tip: DOMRect,
  preferred: TooltipPlacement,
  offset: number,
): Position {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const space: Record<TooltipPlacement, number> = {
    top: anchor.top,
    bottom: vh - anchor.bottom,
    left: anchor.left,
    right: vw - anchor.right,
  };
  const needed = (p: TooltipPlacement) =>
    (p === "top" || p === "bottom" ? tip.height : tip.width) +
    offset +
    VIEWPORT_MARGIN;

  let placement = preferred;
  if (
    space[preferred] < needed(preferred) &&
    space[OPPOSITE[preferred]] > space[preferred]
  ) {
    placement = OPPOSITE[preferred];
  }

  const vertical = placement === "top" || placement === "bottom";
  let top: number;
  let left: number;
  let arrowOffset: number;

  if (vertical) {
    left = clamp(
      anchor.left + anchor.width / 2 - tip.width / 2,
      VIEWPORT_MARGIN,
      vw - tip.width - VIEWPORT_MARGIN,
    );
    top =
      placement === "top"
        ? anchor.top - tip.height - offset
        : anchor.bottom + offset;
    arrowOffset = clamp(
      anchor.left + anchor.width / 2 - left,
      ARROW_INSET,
      tip.width - ARROW_INSET,
    );
  } else {
    top = clamp(
      anchor.top + anchor.height / 2 - tip.height / 2,
      VIEWPORT_MARGIN,
      vh - tip.height - VIEWPORT_MARGIN,
    );
    left =
      placement === "left"
        ? anchor.left - tip.width - offset
        : anchor.right + offset;
    arrowOffset = clamp(
      anchor.top + anchor.height / 2 - top,
      ARROW_INSET,
      tip.height - ARROW_INSET,
    );
  }

  return { top, left, placement, arrowOffset };
}

/* ------------------------------------------------------------------ */
/* Tooltip                                                             */
/* ------------------------------------------------------------------ */

export function Tooltip({
  title,
  children,
  placement = "top",
  variant = "dark",
  arrow,
  interactive = false,
  enterDelay = 100,
  leaveDelay,
  onlyWhenTruncated = false,
  disabled = false,
  maxWidth,
  offset = 8,
  className,
  onOpenChange,
}: TooltipProps) {
  const id = useId();
  const tipRef = useRef<HTMLDivElement>(null);
  const onOpenChangeRef = useRef(onOpenChange);

  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  // What the pointer / keyboard currently wants, and how long to wait first.
  const [intent, setIntent] = useState({ open: false, delay: 0 });

  const showArrow = arrow ?? variant === "dark";
  const closeDelay = leaveDelay ?? (interactive ? 150 : 0);
  const hasContent = title !== null && title !== undefined && title !== "";

  // Keep the latest callback without re-running the timer effect.
  useEffect(() => {
    onOpenChangeRef.current = onOpenChange;
  });

  const close = useCallback(() => setIntent({ open: false, delay: 0 }), []);

  // Turns the current intent into an open / closed state after its delay.
  // A new intent re-runs the effect, which cancels the previous timer.
  // A disabled tooltip never wants to be open, so disabling it while it is
  // showing closes it here too (no separate effect, no synchronous setState).
  useEffect(() => {
    const wanted = intent.open && !disabled;
    if (wanted === open) return;
    const delay = intent.open && disabled ? 0 : intent.delay;
    const timer = setTimeout(() => {
      if (wanted) {
        if (
          onlyWhenTruncated &&
          anchor &&
          anchor.scrollWidth <= anchor.clientWidth
        ) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(
              "[Tooltip] onlyWhenTruncated is set, but the trigger isn't truncated. " +
                "Apply a width constraint plus `overflow: hidden` and " +
                "`white-space: nowrap` to the trigger, or remove onlyWhenTruncated.",
            );
          }
          return;
        }
        setContainer(anchor?.closest("dialog") ?? document.body);
        setOpen(true);
      } else {
        setOpen(false);
      }
      onOpenChangeRef.current?.(wanted);
    }, delay);
    return () => clearTimeout(timer);
  }, [intent, open, anchor, onlyWhenTruncated, disabled]);

  // Place the tooltip by writing straight to its DOM node (an external
  // system), so measuring never causes an extra React render.
  const updatePosition = useCallback(() => {
    const tip = tipRef.current;
    if (!anchor || !tip) return;
    const pos = computePosition(
      anchor.getBoundingClientRect(),
      tip.getBoundingClientRect(),
      placement,
      offset,
    );
    tip.style.top = `${pos.top}px`;
    tip.style.left = `${pos.left}px`;
    tip.dataset.placement = pos.placement;

    const arrowEl = tip.querySelector<HTMLElement>("[data-arrow]");
    if (arrowEl) {
      const vertical = pos.placement === "top" || pos.placement === "bottom";
      arrowEl.style.left = vertical ? `${pos.arrowOffset}px` : "";
      arrowEl.style.top = vertical ? "" : `${pos.arrowOffset}px`;
    }
    // Hidden until the first measurement so it never flashes at 0,0.
    tip.style.visibility = "visible";
  }, [anchor, placement, offset]);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open, title, updatePosition]);

  // Keep it attached while open: scroll, resize, content size, Esc.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("keydown", onKeyDown);

    // Re-place when the content changes size on its own (e.g. a pager
    // inside the tooltip swapping to a taller or shorter page).
    const tip = tipRef.current;
    const observer =
      tip && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updatePosition)
        : null;
    if (tip) observer?.observe(tip);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("keydown", onKeyDown);
      observer?.disconnect();
    };
  }, [open, updatePosition, close]);

  /* Trigger handlers — chained with the child's own handlers. */
  const childProps = children.props as Record<string, unknown> & {
    onMouseEnter?: (e: MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (e: MouseEvent<HTMLElement>) => void;
    onFocus?: (e: FocusEvent<HTMLElement>) => void;
    onBlur?: (e: FocusEvent<HTMLElement>) => void;
    "aria-describedby"?: string;
  };

  const wantOpen = (el: HTMLElement, delay: number) => {
    if (disabled || !hasContent) return;
    setAnchor(el);
    setIntent({ open: true, delay });
  };

  const trigger = cloneElement(children, {
    onMouseEnter: (e: MouseEvent<HTMLElement>) => {
      childProps.onMouseEnter?.(e);
      wantOpen(e.currentTarget, enterDelay);
    },
    onMouseLeave: (e: MouseEvent<HTMLElement>) => {
      childProps.onMouseLeave?.(e);
      setIntent({ open: false, delay: closeDelay });
    },
    onFocus: (e: FocusEvent<HTMLElement>) => {
      childProps.onFocus?.(e);
      wantOpen(e.currentTarget, 0);
    },
    onBlur: (e: FocusEvent<HTMLElement>) => {
      childProps.onBlur?.(e);
      setIntent({ open: false, delay: 0 });
    },
    "aria-describedby": open
      ? cx(childProps["aria-describedby"], id)
      : childProps["aria-describedby"],
  });

  const style: CSSProperties | undefined =
    maxWidth !== undefined
      ? { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth }
      : undefined;

  return (
    <>
      {trigger}
      {open && container
        ? createPortal(
            <div
              ref={tipRef}
              id={id}
              role="tooltip"
              className={cx(
                styles.tooltip,
                styles[variant],
                interactive && styles.interactive,
                className,
              )}
              style={style}
              onMouseEnter={
                interactive
                  ? () => setIntent({ open: true, delay: 0 })
                  : undefined
              }
              onMouseLeave={
                interactive
                  ? () => setIntent({ open: false, delay: closeDelay })
                  : undefined
              }
            >
              {title}
              {showArrow && <span className={styles.arrow} data-arrow />}
            </div>,
            container,
          )
        : null}
    </>
  );
}