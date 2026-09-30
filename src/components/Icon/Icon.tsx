import type { CSSProperties, MouseEventHandler, ReactNode } from "react";

import { icons, type IconName } from "@/icons";
import { cx } from "@/utils";

import styles from "./Icon.module.css";

export interface IconProps {
  /** A built-in icon, e.g. `"search"` or `"arrow-down"`. Ignored when `children` is given. */
  name?: IconName;
  /**
   * Any custom `<svg>`. It is scaled to `size` without editing it, and painted
   * with the icon color wherever it uses `currentColor` or leaves `fill` unset.
   */
  children?: ReactNode;
  /** Width and height; a number is px, a string is any CSS length. */
  size?: number | string;
  /** Icon color. Defaults to `currentColor`, so icons follow the text color. */
  color?: string;
  /** Color while hovered. Not applied when `disabled`. */
  hoverColor?: string;
  /** Stroke width of the built-in icons. */
  strokeWidth?: number | string;
  /** Mutes the icon and blocks hover styling and clicks. */
  disabled?: boolean;
  className?: string;
  /**
   * Makes the icon interactive: it renders as a native `<button>`, so it is
   * focusable and works with Enter and Space. Give it a `title` or `ariaLabel`.
   */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Tooltip; also the accessible name when `ariaLabel` is not set. */
  title?: string;
  /**
   * Accessible name. Without it (or a `title`) a non-clickable icon is
   * decorative and hidden from assistive tech.
   */
  ariaLabel?: string;
}

function toCssLength(value: number | string) {
  return typeof value === "number" ? `${value}px` : value;
}

export function Icon({
  name,
  children,
  size = 24,
  color,
  hoverColor,
  strokeWidth = 2,
  disabled = false,
  className,
  onClick,
  title,
  ariaLabel,
}: IconProps) {
  const label = ariaLabel ?? title;

  const graphic = children ?? (name && (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[name]}
    </svg>
  ));

  const style = {
    "--icon-size": toCssLength(size),
    ...(color && { "--icon-color": color }),
    ...(hoverColor && { "--icon-hover-color": hoverColor }),
  } as CSSProperties;

  const classes = cx(
    styles.icon,
    onClick && styles.interactive,
    disabled && styles.disabled,
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        className={classes}
        style={style}
        title={title}
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        {graphic}
      </button>
    );
  }

  return (
    <span
      className={classes}
      style={style}
      title={title}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      aria-disabled={disabled || undefined}
    >
      {graphic}
    </span>
  );
}
