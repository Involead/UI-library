"use client";

import {
  useEffect,
  useId,
  useRef,
  type ComponentPropsWithRef,
  type ReactNode,
} from "react";

import { cx, mergeRefs } from "@/utils";

import styles from "./Checkbox.module.css";

type CheckboxSize = "small" | "medium" | "large";

export interface CheckboxProps
  extends Omit<ComponentPropsWithRef<"input">, "size" | "type"> {
  label?: ReactNode;
  helperText?: string;
  error?: string;
  size?: CheckboxSize;
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  helperText,
  error,
  size = "medium",
  indeterminate = false,
  disabled,
  required,
  id,
  className = "",
  ref,
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  const helperId = `${checkboxId}-helper`;
  const hasError = Boolean(error);
  const indeterminateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (indeterminateRef.current) {
      indeterminateRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const wrapperClasses = cx(
    styles.wrapper,
    disabled && styles.disabled,
  );

  const boxClasses = cx(
    styles.box,
    styles[size],
    hasError && styles.error,
  );

  return (
    <div className={styles.container}>
      <label
        className={wrapperClasses}
        htmlFor={checkboxId}
      >
        <input
          ref={mergeRefs(ref, indeterminateRef)}
          id={checkboxId}
          type="checkbox"
          className={cx(styles.input, className)}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            helperText || error ? helperId : undefined
          }
          {...props}
        />

        <span
          className={boxClasses}
          aria-hidden="true"
        >
          <CheckIcon className={styles.checkIcon} />
          <span className={styles.indeterminateMark} />
        </span>

        {label && (
          <span className={styles.label}>
            {label}
            {required && (
              <span
                className={styles.required}
                aria-hidden="true"
              >
                *
              </span>
            )}
          </span>
        )}
      </label>

      {(helperText || error) && (
        <span
          id={helperId}
          className={cx(
            styles.helperText,
            hasError && styles.errorText,
          )}
        >
          {error ?? helperText}
        </span>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8.5L6.5 11.5L12.5 4.5" />
    </svg>
  );
}
