"use client";

import type { ReactNode } from "react";
import { cx } from "@/utils";
import styles from "./Stepper.module.css";

export type StepperOrientation = "horizontal" | "vertical";
export type StepperSize = "small" | "medium";

export interface StepItem {
  label: ReactNode;
  description?: ReactNode;
  optional?: boolean;
  error?: boolean;
  disabled?: boolean;
  icon?: ReactNode | ((status: Status) => ReactNode);
}

export interface StepperProps {
  steps: StepItem[];
  activeStep?: number;
  orientation?: StepperOrientation;
  size?: StepperSize;
  alternativeLabel?: boolean;
  onStepClick?: (index: number) => void;
  nonLinear?: boolean;
  ariaLabel?: string;
  className?: string;
  error?: boolean;
}

type Status = "completed" | "active" | "upcoming" | "error";

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}

export function Stepper({
  steps,
  activeStep = 0,
  orientation = "horizontal",
  size = "medium",
  alternativeLabel = false,
  onStepClick,
  nonLinear = false,
  ariaLabel,
  className,
  error = false,
}: StepperProps) {
  const alt = alternativeLabel && orientation === "horizontal";
  const activeLabel = steps[activeStep]?.label;

  return (
    <ol
      className={cx(
        styles.root,
        styles[orientation],
        styles[size],
        alt && styles.alt,
        className,
      )}
      aria-label={ariaLabel}
    >
      <div className={styles.srOnly} aria-live="polite">
        {`Step ${activeStep + 1} of ${steps.length}: ${activeLabel ?? ""}`}
      </div>

      {steps.map((step, index) => {
        const isError = error && index === activeStep ? true : step.error;
        
        const status: Status = isError
          ? "error"
          : index < activeStep
            ? "completed"
            : index === activeStep
              ? "active"
              : "upcoming";

        const clickable =
          !!onStepClick && !step.disabled && (nonLinear || index < activeStep);
        const isLast = index === steps.length - 1;

        const content = (
          <>
            <span
              className={cx(styles.circle, styles[`circle_${status}`])}
              aria-hidden="true"
            >
              {typeof step.icon === "function"
                ? step.icon(status)
                : step.icon ??
                  (status === "completed" ? (
                    <CheckIcon />
                  ) : status === "error" ? (
                    "!"
                  ) : (
                    index + 1
                  ))}
            </span>

            <span className={styles.text}>
              <span
                className={cx(
                  styles.label,
                  status === "upcoming" && styles.labelMuted,
                  status === "active" && styles.labelActive,
                  status === "error" && styles.labelError,
                )}
              >
                {step.label}
                {status === "completed" && (
                  <span className={styles.srOnly}> (completed)</span>
                )}
                {status === "error" && (
                  <span className={styles.srOnly}> (has an error)</span>
                )}
              </span>
              {step.optional && (
                <span className={styles.caption}>Optional</span>
              )}
              {step.description && (
                <span className={styles.description}>{step.description}</span>
              )}
            </span>
          </>
        );

        return (
          <li
            key={index}
            className={cx(styles.item, isLast && styles.itemLast)}
            aria-current={status === "active" ? "step" : undefined}
          >
            {clickable ? (
              <button
                type="button"
                className={cx(styles.step, styles.stepButton)}
                onClick={() => onStepClick?.(index)}
              >
                {content}
              </button>
            ) : (
              <div 
                className={cx(styles.step, step.disabled && styles.disabled)}
                title={step.disabled ? "This step is not available yet" : undefined}
              >
                {content}
              </div>
            )}

            {!isLast && (
              <span
                className={cx(
                  styles.connector,
                  index < activeStep && styles.connectorDone,
                )}
                aria-hidden="true"
              >
                <span className={styles.connectorFill} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}