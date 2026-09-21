import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

import { cx } from "@/utils";

import styles from "./Typography.module.css";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body-lg"
  | "body-md"
  | "body-sm"
  | "caption";

export type TypographyColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "disabled"
  | "inverse"
  | "success"
  | "warning"
  | "error"
  | "info"
  | (string & {});

const TOKEN_COLORS = new Set<string>([
  "primary",
  "secondary",
  "tertiary",
  "disabled",
  "inverse",
  "success",
  "warning",
  "error",
  "info",
]);

export type TypographyWeight =
  | "regular"
  | "medium"
  | "semibold"
  | "bold";

const variantElement: Record<TypographyVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  caption: "span",
};

type TypographyOwnProps<E extends ElementType> = {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  truncate?: boolean;
  as?: E;
  className?: string;
  children?: ReactNode;
};

export type TypographyProps<E extends ElementType = "p"> =
  TypographyOwnProps<E> &
    Omit<ComponentPropsWithoutRef<E>, keyof TypographyOwnProps<E>>;

export function Typography<E extends ElementType = "p">({
  variant = "body-md",
  color = "primary",
  weight,
  truncate = false,
  as,
  className = "",
  children,
  style,
  ...props
}: TypographyProps<E>) {
  const Component = as ?? variantElement[variant];
  const isTokenColor = TOKEN_COLORS.has(color);

  const classes = cx(
    styles.base,
    styles[variant],
    isTokenColor && styles[color],
    weight && styles[weight],
    truncate && styles.truncate,
    className,
  );

  const mergedStyle = isTokenColor
    ? style
    : { color, ...style };

  return (
    <Component
      className={classes}
      style={mergedStyle}
      {...props}
    >
      {children}
    </Component>
  );
}
