"use client";

import {
  useId,
  type InputHTMLAttributes,
} from "react";

import { cx } from "@/utils";

import styles from "./Checkbox.module.css";

type CheckboxSize = "small" | "medium" | "large";

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: CheckboxSize;
}

export function Checkbox({
  label,
  helperText,
  error,
  size = "medium",
  disabled,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const hasError = Boolean(error);

  const wrapperClasses = cx(
    styles.wrapper,
    styles[size],
    hasError && styles.error,
    disabled && styles.disabled,
    className,
  );

  return (
    <div className={wrapperClasses}>
      <label
        className={styles.field}
        htmlFor={inputId}
      >
        <span className={styles.control}>
          <input
            id={inputId}
            type="checkbox"
            className={styles.input}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              helperText || error ? helperId : undefined
            }
            {...props}
          />

          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>

        {label && (
          <span className={styles.label}>{label}</span>
        )}
      </label>

      {(helperText || error) && (
        <span
          id={helperId}
          className={styles.helperText}
        >
          {error ?? helperText}
        </span>
      )}
    </div>
  );
}
