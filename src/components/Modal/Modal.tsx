"use client";

import {
  useEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { createPortal } from "react-dom";

import { cx } from "@/utils";

import styles from "./Modal.module.css";

/* ------------------------------------------------------------------ */
/* Public types                                                        */
/* ------------------------------------------------------------------ */

export type ModalCloseReason = "backdropClick" | "escapeKeyDown" | "closeClick";

export type ModalMaxWidth = "xs" | "sm" | "md" | "lg" | "xl" | false;

export interface ModalProps {
  open: boolean;
  onClose: (event: unknown, reason: ModalCloseReason) => void;
  /**
   * Preset width.
   * - "xs" → 444px
   * - "sm" → 600px (default)
   * - "md" → 900px
   * - "lg" → 1200px
   * - "xl" → 1536px
   * - `false` → no width constraint (panel shrinks to content)
   */
  maxWidth?: ModalMaxWidth;
  /**
   * Any CSS length. Overrides `maxWidth` when provided.
   * e.g. 720, "720px", "80%", "min(720px, 100%)".
   */
  width?: number | string;
  /** Fills the entire viewport. */
  fullScreen?: boolean;
  /** Which element scrolls when content overflows. */
  scroll?: "body" | "paper";
  children?: ReactNode;
  className?: string;
  /**
   * Extra class on the outer <dialog>. Use it to style the ::backdrop,
   * e.g. `.my-dialog::backdrop { backdrop-filter: blur(8px); }`.
   */
  dialogClassName?: string;
  /** Accessible name — required when there is no visible title. */
  ariaLabel?: string;
  /** Disables Esc-to-close. */
  disableEscapeKeyDown?: boolean;
  /** Disables backdrop-click-to-close. */
  disableBackdropClick?: boolean;
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

export function Modal({
  open,
  onClose,
  maxWidth = "xs",
  width,
  fullScreen = false,
  scroll = "paper",
  children,
  className,
  dialogClassName,
  ariaLabel,
  disableEscapeKeyDown = false,
  disableBackdropClick = false,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Sync `open` → native <dialog>.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        /* already open */
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Keep React state in sync if the dialog closes on its own.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      if (open) onClose(null, "closeClick");
    };
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [open, onClose]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    if (disableEscapeKeyDown) {
      event.preventDefault();
      return;
    }
    onClose(event, "escapeKeyDown");
  };

  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (disableBackdropClick) return;
    if (event.target === dialogRef.current) {
      onClose(event, "backdropClick");
    }
  };

  if (typeof document === "undefined") return null;

  // Preset class only when `width` isn't overriding it.
  const usePreset = width === undefined && maxWidth !== false;
  const presetClass = usePreset ? styles[`maxWidth_${maxWidth}`] : undefined;

  // Arbitrary width: fixed width up to the viewport minus the safe margin.
  const inlineWidth =
    width !== undefined
      ? (() => {
          const value = typeof width === "number" ? `${width}px` : width;
          return {
            width: `min(${value}, calc(100vw - var(--spacing-16)))`,
          };
        })()
      : undefined;

  return createPortal(
    <dialog
      ref={dialogRef}
      className={cx(
        styles.dialog,
        fullScreen && styles.fullScreen,
        dialogClassName,
      )}
      aria-label={ariaLabel}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
    >
      <div
        className={cx(
          styles.panel,
          scroll === "body" && styles.scrollBody,
          presetClass,
          fullScreen && styles.fullScreenPanel,
          className,
        )}
        style={inlineWidth}
      >
        {children}
      </div>
    </dialog>,
    document.body,
  );
}