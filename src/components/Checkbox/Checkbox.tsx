"use client";

import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
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
  /**
   * When `true`, clicking the label toggles the checkbox.
   * When `false`, only the checkbox itself toggles the state.
   */
  labelClickable?: boolean;
  /**
   * Custom SVG or React node shown inside the box when checked,
   * replacing the default checkmark. Use `currentColor` to inherit
   * the indicator colour.
   */
  icon?: ReactNode;
}

export function Checkbox({
  label,
  helperText,
  error,
  size = "medium",
  labelClickable = true,
  icon,
  disabled,
  id,
  className = "",
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const labelId = `${inputId}-label`;
  const hasError = Boolean(error);

  // A non-clickable label must not be a <label>, or clicks would toggle the
  // input; the input is then named via aria-labelledby instead.
  const FieldElement = labelClickable ? "label" : "div";

  const wrapperClasses = cx(
    styles.wrapper,
    styles[size],
    hasError && styles.error,
    disabled && styles.disabled,
    className,
  );

  return (
    <div className={wrapperClasses}>
      <FieldElement
        className={cx(
          styles.field,
          !labelClickable && styles.labelStatic,
        )}
        htmlFor={labelClickable ? inputId : undefined}
      >
        <span className={styles.control}>
          <input
            id={inputId}
            type="checkbox"
            className={styles.input}
            disabled={disabled}
            aria-invalid={hasError}
            aria-labelledby={
              !labelClickable && label ? labelId : undefined
            }
            aria-describedby={
              helperText || error ? helperId : undefined
            }
            {...props}
          />

          {icon ? (
            <span
              className={cx(styles.icon, styles.customIcon)}
              aria-hidden="true"
            >
              {icon}
            </span>
          ) : (
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
          )}
        </span>

        {label && (
          <span id={labelId} className={styles.label}>
            {label}
          </span>
        )}
      </FieldElement>

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
