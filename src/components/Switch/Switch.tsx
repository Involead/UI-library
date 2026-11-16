"use client";

import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

import { cx } from "@/utils";

import styles from "./Switch.module.css";

export type SwitchSize = "small" | "medium" | "large";

export type SwitchColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "inherit";

export interface SwitchProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "size" | "type" | "onChange"
  > {
  /** Controlled checked state. */
  checked?: boolean;
  /** Uncontrolled initial state. */
  defaultChecked?: boolean;
  /** Fires when the user toggles the switch. */
  onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;
  /** Size preset. Default "medium". */
  size?: SwitchSize;
  /** Palette colour when on. Use "inherit" to pick up the parent text colour. */
  color?: SwitchColor;
  /** Visible label. */
  label?: ReactNode;
  /** Where the label sits relative to the switch. Default "end". */
  labelPlacement?: "start" | "end";
  /** Supporting text under the label. */
  helperText?: ReactNode;
  /** Error message. Replaces helper text and sets the error style. */
  error?: ReactNode;
  /** Loading state — disabled, with a spinner in the thumb. */
  loading?: boolean;
}

const sizeMap = {
  small: { trackW: 32, trackH: 18, thumb: 14, thumbOff: 2, font: "12px" },
  medium: { trackW: 40, trackH: 22, thumb: 18, thumbOff: 2, font: "14px" },
  large: { trackW: 52, trackH: 28, thumb: 24, thumbOff: 2, font: "16px" },
} as const;

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    checked,
    defaultChecked = false,
    onChange,
    size = "medium",
    color = "primary",
    label,
    labelPlacement = "end",
    helperText,
    error,
    loading = false,
    disabled,
    id,
    className,
    ...rest
  },
  ref,
) {
  const uid = useId();
  const inputId = id ?? `${uid}-switch`;
  const helperId = `${uid}-help`;

  const isControlled = checked !== undefined;
  const [innerChecked, setInnerChecked] = useState(defaultChecked);
  const isOn = isControlled ? checked : innerChecked;

  const dims = sizeMap[size];
  const isDisabled = disabled || loading;
  const hasError = Boolean(error);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (isDisabled) return;
    if (!isControlled) setInnerChecked(event.target.checked);
    onChange?.(event.target.checked, event);
  };

  const describedBy = error || helperText ? helperId : undefined;

  const control = (
    <span
      className={cx(
        styles.control,
        styles[`size_${size}`],
        styles[`color_${color}`],
        isOn && styles.checked,
        isDisabled && styles.disabled,
        hasError && styles.hasError,
        loading && styles.loading,
      )}
      style={
        {
          "--switch-track-w": `${dims.trackW}px`,
          "--switch-track-h": `${dims.trackH}px`,
          "--switch-thumb": `${dims.thumb}px`,
          "--switch-thumb-off": `${dims.thumbOff}px`,
          "--switch-font": dims.font,
        } as React.CSSProperties
      }
    >
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        role="switch"
        className={styles.input}
        checked={isOn}
        disabled={isDisabled}
        aria-checked={isOn}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        aria-busy={loading || undefined}
        onChange={handleChange}
        {...rest}
      />
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb}>
          {loading && <span className={styles.spinner} />}
        </span>
      </span>
    </span>
  );

  const labelEl = label && (
    <label htmlFor={inputId} className={styles.label}>
      {label}
    </label>
  );

  return (
    <div
      className={cx(
        styles.root,
        isDisabled && styles.rootDisabled,
        className,
      )}
    >
      <div
        className={cx(
          styles.row,
          labelPlacement === "start" && styles.labelStart,
        )}
      >
        {labelPlacement === "start" && labelEl}
        {control}
        {labelPlacement === "end" && labelEl}
      </div>
      {(error || helperText) && (
        <p
          id={helperId}
          className={cx(styles.helper, hasError && styles.helperError)}
          role={hasError ? "alert" : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
});