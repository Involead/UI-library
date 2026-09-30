import { Button } from "@/index";
import type { ButtonSize, ButtonVariant } from "../types";

type Props = {
  children: string;
  variant: ButtonVariant;
  size: ButtonSize;
  loading: boolean;
  disabled: boolean;
  fullWidth: boolean;
  leftIcon: boolean;
  rightIcon: boolean;
  clickCount: number;
  onClick: () => void;
  onMouseDown: () => void;
};

export function ButtonPreview({
  children,
  variant,
  size,
  loading,
  disabled,
  fullWidth,
  leftIcon,
  rightIcon,
  clickCount,
  onClick,
  onMouseDown,
}: Props) {
  return (
    <>
      <Button
        variant={variant}
        size={size}
        loading={loading}
        disabled={disabled}
        fullWidth={fullWidth}
        leftIcon={
          leftIcon ? (
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
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
          ) : undefined
        }
        rightIcon={
          rightIcon ? (
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
              <path d="m9 18 6-6-6-6" />
            </svg>
          ) : undefined
        }
        onClick={onClick}
        onMouseDown={onMouseDown}
      >
        {children}
      </Button>
      <span className="button-preview-status" role="status">
        {disabled
          ? "This button is disabled."
          : clickCount > 0
            ? `Clicked ${clickCount} time${clickCount === 1 ? "" : "s"}.`
            : "Click the button to test its interaction."}
      </span>
    </>
  );
}
