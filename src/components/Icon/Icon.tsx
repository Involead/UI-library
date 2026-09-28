import type { SVGProps } from "react";

import { icons, type IconName } from "@/icons";
import { cx } from "@/utils";

import styles from "./Icon.module.css";

export interface IconProps
  extends Omit<SVGProps<SVGSVGElement>, "color" | "children"> {
  /** Which icon to render, e.g. `"search"` or `"arrow-down"`. */
  name: IconName;
  /** Width and height in px (or any CSS length). */
  size?: number | string;
  /** Stroke color. Defaults to `currentColor`, so icons follow the text color. */
  color?: string;
  /**
   * Accessible name. When set, the icon is announced as an image;
   * otherwise it is treated as decorative and hidden from assistive tech.
   */
  title?: string;
}

export function Icon({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  title,
  className,
  ...props
}: IconProps) {
  const isLabelled = Boolean(title || props["aria-label"] || props["aria-labelledby"]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cx(styles.icon, className)}
      role={isLabelled ? "img" : undefined}
      aria-hidden={isLabelled ? undefined : true}
      focusable="false"
      {...props}
    >
      {title && <title>{title}</title>}
      {icons[name]}
    </svg>
  );
}
