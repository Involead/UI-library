"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "@/utils";

import styles from "./Radio.module.css";

type RadioSize = "small" | "medium" | "large";

export interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: ReactNode;
  helperText?: string;
  /** `true` shows the error styling; a string also replaces the helper text. */
  error?: boolean | string;
  size?: RadioSize;
  /** When false, only the radio circle toggles selection — clicking the label does nothing. */
  labelClickable?: boolean;
}

export function Radio({
  label,
  helperText,
  error,
  size = "medium",
  labelClickable = true,
  disabled,
  id,
  className = "",
  ...props
}: RadioProps) {
  const generatedId = useId();
  const radioId = id ?? generatedId;
  const labelId = `${radioId}-label`;
  const helperId = `${radioId}-helper`;

  const hasError = Boolean(error);
  const message = typeof error === "string" && error ? error : helperText;

  const rootClasses = cx(
    styles.root,
    styles[size],
    hasError && styles.error,
    disabled && styles.disabled,
    className,
  );

  const control = (
    <span className={styles.control}>
      <input
        id={radioId}
        type="radio"
        className={styles.input}
        disabled={disabled}
        aria-labelledby={!labelClickable && label ? labelId : undefined}
        aria-describedby={message ? helperId : undefined}
        {...props}
      />
      <span
        className={styles.circle}
        aria-hidden="true"
      />
    </span>
  );

  const labelText = label && (
    <span
      id={labelId}
      className={cx(styles.label, !labelClickable && styles.labelStatic)}
    >
      {label}
    </span>
  );

  return (
    <div className={rootClasses}>
      {labelClickable ? (
        <label
          className={styles.row}
          htmlFor={radioId}
        >
          {control}
          {labelText}
        </label>
      ) : (
        <div className={styles.row}>
          {control}
          {labelText}
        </div>
      )}

      {message && (
        <span
          id={helperId}
          className={cx(
            styles.helperText,
            hasError && styles.errorText,
          )}
        >
          {message}
        </span>
      )}
    </div>
  );
}
