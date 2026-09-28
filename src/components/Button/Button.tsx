"use client";

import type { ButtonProps } from "./Button.types";
import "./Button.css";

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
  const buttonClasses = [
    "button",
    variant,
    size,
    fullWidth ? "fullWidth" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

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
          className="spinner"
          aria-hidden="true"
        />
      ) : (
        leftIcon && (
          <span
            className="icon"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )
      )}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span
          className="icon"
          aria-hidden="true"
        >
          {rightIcon}
        </span>
      )}
    </button>
  );
}