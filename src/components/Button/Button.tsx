"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cx } from "@/utils";

import styles from "./Button.module.css";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

type ButtonSize =
  | "small"
  | "medium"
  | "large";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "medium",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  const buttonClasses = cx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  );

  return (
    <button
      type="button"
      className={buttonClasses}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <span
          className={styles.spinner}
          aria-hidden="true"
        />
      ) : (
        leftIcon && (
          <span
            className={styles.icon}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )
      )}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span
          className={styles.icon}
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
}