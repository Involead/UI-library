import type { HTMLAttributes } from "react";

import { cx } from "@/utils";

import styles from "./Typography.module.css";

type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "bodySmall"
  | "label"
  | "caption";

type TypographyColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled";

type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label";

const defaultElements: Record<
  TypographyVariant,
  TypographyElement
> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body: "p",
  bodySmall: "p",
  label: "span",
  caption: "span",
};

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, "color"> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  as?: TypographyElement;
}

export function Typography({
  variant = "body",
  color = "primary",
  as,
  className = "",
  ...props
}: TypographyProps) {
  const Component = as ?? defaultElements[variant];

  return (
    <Component
      className={cx(
        styles.typography,
        styles[variant],
        styles[color],
        className,
      )}
      {...props}
    />
  );
}
