"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "@/utils";

import styles from "./Notification.module.css";

export type NotificationColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "default";

export type NotificationVariant = "standard" | "dot";

export type NotificationOverlap = "rectangular" | "circular";

export type NotificationAnchorOrigin = {
  vertical: "top" | "bottom";
  horizontal: "left" | "right";
};

export interface NotificationProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "color" | "content"> {
  /** The notification content. Ignored when `variant="dot"`. */
  content?: ReactNode;
  /** Hide the notification but keep the children. */
  invisible?: boolean;
  /** `standard` shows content; `dot` shows a small dot. */
  variant?: NotificationVariant;
  /** Palette token. */
  color?: NotificationColor;
  /** Cap the number. Values above render as `{max}+`. Default 99. */
  max?: number;
  /** Position of the notification relative to the child. */
  anchorOrigin?: NotificationAnchorOrigin;
  /** How the notification sits on the corner of the child. */
  overlap?: NotificationOverlap;
  /** Show the notification when content is 0. */
  showZero?: boolean;
  /** The wrapped content. */
  children?: ReactNode;
  /** Classes passed to the notification span itself. */
  notificationClassName?: string;
  /** Classes passed to the wrapper around children. */
  wrapperClassName?: string;
}

const defaultAnchor: NotificationAnchorOrigin = {
  vertical: "top",
  horizontal: "right",
};

function formatCount(content: ReactNode, max: number): ReactNode {
  if (typeof content !== "number") return content;
  return content > max ? `${max}+` : content;
}

export const Notification = forwardRef<HTMLSpanElement, NotificationProps>(
  function Notification(
    {
      content,
      invisible: invisibleProp = false,
      variant = "standard",
      color = "default",
      max = 99,
      anchorOrigin = defaultAnchor,
      overlap = "rectangular",
      showZero = false,
      children,
      notificationClassName,
      wrapperClassName,
      className,
      ...rest
    },
    ref,
  ) {
    const displayContent = formatCount(content, max);

    const invisible =
      invisibleProp ||
      (variant === "standard" &&
        (displayContent === null ||
          displayContent === undefined ||
          displayContent === "" ||
          (displayContent === 0 && !showZero)));

    return (
      <span ref={ref} className={cx(styles.root, className)} {...rest}>
        {children !== undefined && children !== null && (
          <span className={cx(styles.wrapper, wrapperClassName)}>{children}</span>
        )}
        <span
          className={cx(
            styles.notification,
            styles[`color_${color}`],
            styles[`anchor_${anchorOrigin.vertical}_${anchorOrigin.horizontal}`],
            styles[`overlap_${overlap}`],
            variant === "dot" && styles.dot,
            invisible && styles.invisible,
            notificationClassName,
          )}
          aria-hidden={invisible || undefined}
        >
          {variant === "dot" ? null : displayContent}
        </span>
      </span>
    );
  },
);