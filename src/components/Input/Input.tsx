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
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle
        cx="12"
        cy="12"
        r="3"
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
      <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.35 2.9A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 4.22-5.94" />
      <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}
