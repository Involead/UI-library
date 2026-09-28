"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { cx } from "@/utils";

import styles from "./Dropdown.module.css";

type DropdownSize = "small" | "medium" | "large";

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownBaseProps {
  options: DropdownOption[];
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  size?: DropdownSize;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  width?: number | string;
  searchable?: boolean;
  searchPlaceholder?: string;
  noOptionsMessage?: string;
  clearable?: boolean;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  className?: string;
  style?: CSSProperties;
  onOpenChange?: (isOpen: boolean) => void;
}

export interface SingleDropdownProps extends DropdownBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

export interface MultipleDropdownProps extends DropdownBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export type DropdownProps = SingleDropdownProps | MultipleDropdownProps;

export function Dropdown(props: DropdownProps) {
  const {
    options,
    label,
    helperText,
    error,
    placeholder = "Select…",
    size = "medium",
    disabled = false,
    required = false,
    fullWidth = false,
    width,
    searchable = false,
    searchPlaceholder = "Search…",
    noOptionsMessage = "No options found",
    clearable = false,
    autoFocus = false,
    name,
    id,
    className = "",
    style,
    onOpenChange,
    multiple = false,
  } = props;

  const generatedId = useId();
  const dropdownId = id ?? generatedId;
  const helperId = `${dropdownId}-helper`;
  const listId = `${dropdownId}-listbox`;
  const hasError = Boolean(error);

  const isControlled = props.value !== undefined;

  const [internalValue, setInternalValue] = useState<string | string[] | null>(
    props.defaultValue ?? (multiple ? [] : null),
  );

  const rawValue = isControlled ? props.value : internalValue;
  const selectedValues: string[] = useMemo(
    () =>
      multiple
        ? ((rawValue as string[] | undefined) ?? [])
        : rawValue
          ? [rawValue as string]
          : [],
    [multiple, rawValue],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!searchable || search.trim() === "") return options;
    const query = search.trim().toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(query),
    );
  }, [options, search, searchable]);

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(option.value)),
    [options, selectedValues],
  );

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: globalThis.MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && searchable) {
      searchInputRef.current?.focus();
    }
  }, [isOpen, searchable]);

  function openDropdown() {
    if (disabled) return;
    setIsOpen(true);
    setHighlightedIndex(-1);
    onOpenChange?.(true);
  }

  function closeDropdown() {
    setIsOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
    onOpenChange?.(false);
  }

  function toggleOpen() {
    if (isOpen) closeDropdown();
    else openDropdown();
  }

  function commitValue(next: string | string[] | null) {
    if (!isControlled) setInternalValue(next);

    if (multiple) {
      (props.onChange as MultipleDropdownProps["onChange"])?.(
        (next as string[]) ?? [],
      );
    } else {
      (props.onChange as SingleDropdownProps["onChange"])?.(
        next as string | null,
      );
    }
  }

  function handleSelect(option: DropdownOption) {
    if (option.disabled) return;

    if (multiple) {
      const isSelected = selectedValues.includes(option.value);
      const next = isSelected
        ? selectedValues.filter((value) => value !== option.value)
        : [...selectedValues, option.value];
      commitValue(next);
      return;
    }

    commitValue(option.value);
    closeDropdown();
  }

  function handleRemove(value: string, event: ReactMouseEvent) {
    event.stopPropagation();
    commitValue(selectedValues.filter((v) => v !== value));
  }

  function handleClear(event: ReactMouseEvent) {
    event.stopPropagation();
    commitValue(multiple ? [] : null);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (disabled) return;

    if (!isOpen) {
      if (
        event.key === "ArrowDown" ||
        event.key === "Enter" ||
        event.key === " "
      ) {
        event.preventDefault();
        openDropdown();
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeDropdown();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedIndex((index) =>
        Math.min(index + 1, filteredOptions.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedIndex((index) => Math.max(index - 1, 0));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) handleSelect(option);
    }
  }

  const wrapperClasses = cx(styles.wrapper, fullWidth && styles.fullWidth);

  const wrapperStyle: CSSProperties | undefined =
    width !== undefined ? { width, ...style } : style;

  const triggerClasses = cx(
    styles.trigger,
    styles[size],
    hasError && styles.error,
    disabled && styles.disabled,
    isOpen && styles.open,
  );

  const hasSelection = selectedValues.length > 0;

  return (
    <div
      className={wrapperClasses}
      style={wrapperStyle}
      ref={containerRef}
    >
      {label && (
        <label
          className={styles.label}
          id={`${dropdownId}-label`}
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

      <div
        id={dropdownId}
        className={cx(triggerClasses, className)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-labelledby={label ? `${dropdownId}-label` : undefined}
        aria-disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={helperText || error ? helperId : undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={toggleOpen}
        onKeyDown={handleTriggerKeyDown}
        autoFocus={autoFocus}
      >
        <div className={styles.valueArea}>
          {!hasSelection && (
            <span className={styles.placeholder}>{placeholder}</span>
          )}

          {!multiple && hasSelection && (
            <span className={styles.singleValue}>
              {selectedOptions[0]?.label}
            </span>
          )}

          {multiple && hasSelection && (
            <div className={styles.chips}>
              {selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className={styles.chip}
                >
                  {option.label}
                  <button
                    type="button"
                    className={styles.chipRemove}
                    aria-label={`Remove ${option.label}`}
                    onClick={(event) => handleRemove(option.value, event)}
                  >
                    <CloseIcon />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.indicators}>
          {clearable && hasSelection && !disabled && (
            <button
              type="button"
              className={styles.clearButton}
              aria-label="Clear selection"
              onClick={handleClear}
            >
              <CloseIcon />
            </button>
          )}

          <ChevronIcon isOpen={isOpen} />
        </div>
      </div>

      {isOpen && (
        <div className={styles.panel}>
          {searchable && (
            <div className={styles.searchWrapper}>
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setHighlightedIndex(-1);
                }}
                onKeyDown={handleTriggerKeyDown}
              />
            </div>
          )}

          <ul
            id={listId}
            className={styles.list}
            role="listbox"
            aria-multiselectable={multiple}
          >
            {filteredOptions.length === 0 && (
              <li className={styles.noOptions}>{noOptionsMessage}</li>
            )}

            {filteredOptions.map((option, index) => {
              const isSelected = selectedValues.includes(option.value);
              const isHighlighted = index === highlightedIndex;

              return (
                <li
                  key={option.value}
                  id={`${dropdownId}-option-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  className={cx(
                    styles.option,
                    isSelected && styles.selected,
                    isHighlighted && styles.highlighted,
                    option.disabled && styles.optionDisabled,
                  )}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => handleSelect(option)}
                >
                  {multiple && (
                    <span
                      className={cx(
                        styles.checkbox,
                        isSelected && styles.checkboxChecked,
                      )}
                      aria-hidden="true"
                    >
                      {isSelected && <CheckIcon />}
                    </span>
                  )}

                  <span>{option.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {name && (
        <input
          type="hidden"
          name={name}
          value={multiple ? selectedValues.join(",") : (rawValue ?? "")}
        />
      )}

      {(helperText || error) && (
        <span
          id={helperId}
          className={cx(styles.helperText, hasError && styles.errorText)}
        >
          {error ?? helperText}
        </span>
      )}
    </div>
  );
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
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
      className={isOpen ? styles.chevronOpen : undefined}
    >
      <path d="M5 9l7 7 7-7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 12.5l4.75 4.75L19.5 7" />
    </svg>
  );
}
