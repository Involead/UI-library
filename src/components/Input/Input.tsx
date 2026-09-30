"use client";

import {
  useId,
  useState,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "@/utils";

import styles from "./Input.module.css";

type InputSize = "small" | "medium" | "large";
type InputLabelPosition = "top" | "left" | "right";

type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "time"
  | "month"
  | "week"
  | "color"
  | "file"
  | "hidden";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  label?: string;
  /** Where the label sits relative to the input. */
  labelPosition?: InputLabelPosition;
  helperText?: string;
  error?: string;
  size?: InputSize;
  type?: InputType;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  labelPosition = "top",
  helperText,
  error,
  size = "medium",
  type = "text",
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  required,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const helperId = `${inputId}-helper`;
  const hasError = Boolean(error);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword
    ? isPasswordVisible
      ? "text"
      : "password"
    : type;

  const wrapperClasses = cx(
    styles.wrapper,
    fullWidth && styles.fullWidth,
    labelPosition === "left" && styles.labelLeft,
    labelPosition === "right" && styles.labelRight,
  );

  const fieldClasses = cx(
    styles.field,
    styles[size],
    hasError && styles.error,
    disabled && styles.disabled,
  );

  const inputClasses = cx(styles.input, className);

  return (
    <div className={wrapperClasses}>
      {label && (
        <label
          className={styles.label}
          htmlFor={inputId}
        >
          {label}
          {required && (
            <span
              className={styles.required}
              aria-hidden="true"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className={fieldClasses}>
        {leftIcon && (
          <span
            className={styles.icon}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          type={resolvedType}
          className={inputClasses}
          disabled={disabled}
          required={required}
          aria-invalid={hasError}
          aria-describedby={
            helperText || error ? helperId : undefined
          }
          {...props}
        />

        {isPassword ? (
          <button
            type="button"
            className={styles.passwordToggle}
            disabled={disabled}
            onClick={() => setIsPasswordVisible((visible) => !visible)}
            aria-label={
              isPasswordVisible ? "Hide password" : "Show password"
            }
            aria-pressed={isPasswordVisible}
          >
            {isPasswordVisible ? (
              <EyeOffIcon />
            ) : (
              <EyeIcon />
            )}
          </button>
        ) : (
          rightIcon && (
            <span
              className={styles.icon}
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )
        )}
      </div>

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

function EyeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2.5 12C4.5 7.5 8 5 12 5s7.5 2.5 9.5 7c-2 4.5-5.5 7-9.5 7s-7.5-2.5-9.5-7z" />
      <circle
        cx="12"
        cy="12"
        r="2.75"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.5 5.4A9 9 0 0 1 12 5c4 0 7.5 2.5 9.5 7a13.5 13.5 0 0 1-2.2 3.4" />
      <path d="M16.5 17.7A8.6 8.6 0 0 1 12 19c-4 0-7.5-2.5-9.5-7a13 13 0 0 1 3.6-4.9" />
      <path d="M10 10a2.75 2.75 0 0 0 3.9 3.9" />
      <path d="M4 4l16 16" />
    </svg>
  );
}
