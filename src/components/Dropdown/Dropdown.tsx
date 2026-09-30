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
type DropdownLabelPosition = "top" | "left" | "right";

export interface DropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface DropdownBaseProps {
  options: DropdownOption[];
  label?: string;
  /** Where the label sits relative to the dropdown. */
  labelPosition?: DropdownLabelPosition;
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

/** Single select (default): the value is one option value, or `null`. */
export interface SingleDropdownProps extends DropdownBaseProps {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (value: string | null) => void;
}

/** Multi select: the value is an array of option values. */
export interface MultipleDropdownProps extends DropdownBaseProps {
  multiple: true;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
}

export type DropdownProps = SingleDropdownProps | MultipleDropdownProps;

// Accepts either value shape so switching `multiple` at runtime never breaks.
function toValueArray(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function filterOptions(options: DropdownOption[], search: string) {
  const query = search.trim().toLowerCase();
  if (query === "") return options;
  return options.filter((option) =>
    option.label.toLowerCase().includes(query),
  );
}

// Index of the first enabled option from `start`, walking by `step`; -1 if none.
function findEnabledIndex(
  options: DropdownOption[],
  start: number,
  step: 1 | -1,
) {
  for (let i = start; i >= 0 && i < options.length; i += step) {
    if (!options[i].disabled) return i;
  }
  return -1;
}

export function Dropdown(props: DropdownProps) {
  const {
    options,
    label,
    labelPosition = "top",
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
  } = props;

  const multiple = props.multiple === true;

  const generatedId = useId();
  const dropdownId = id ?? generatedId;
  const labelId = `${dropdownId}-label`;
  const helperId = `${dropdownId}-helper`;
  const listId = `${dropdownId}-listbox`;
  const optionId = (index: number) => `${dropdownId}-option-${index}`;
  const hasError = Boolean(error);

  const isControlled = props.value !== undefined;

  const [internalValue, setInternalValue] = useState<string | string[] | null>(
    props.defaultValue ?? (multiple ? [] : null),
  );

  const rawValue = isControlled ? props.value : internalValue;
  const selectedValues = useMemo(() => {
    const values = toValueArray(rawValue);
    return multiple ? values : values.slice(0, 1);
  }, [multiple, rawValue]);

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // A dropdown disabled while open renders closed.
  const open = isOpen && !disabled;

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(
    () => (searchable ? filterOptions(options, search) : options),
    [options, search, searchable],
  );

  const selectedOptions = useMemo(
    () => options.filter((option) => selectedValues.includes(option.value)),
    [options, selectedValues],
  );

  // Based on matched options, so a value with no matching option shows the
  // placeholder instead of an empty trigger.
  const hasSelection = selectedOptions.length > 0;

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: globalThis.MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
        onOpenChange?.(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open && searchable) {
      searchInputRef.current?.focus();
    }
  }, [open, searchable]);

  // Keep the keyboard-highlighted option visible in the scrollable list.
  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    document
      .getElementById(`${dropdownId}-option-${highlightedIndex}`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [open, highlightedIndex, dropdownId]);

  function openDropdown() {
    if (disabled) return;

    // Start on the first selected option, otherwise the first enabled one.
    const selectedIndex = options.findIndex(
      (option) => !option.disabled && selectedValues.includes(option.value),
    );

    setIsOpen(true);
    setHighlightedIndex(
      selectedIndex !== -1 ? selectedIndex : findEnabledIndex(options, 0, 1),
    );
    onOpenChange?.(true);
  }

  function closeDropdown(restoreFocus = false) {
    setIsOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
    onOpenChange?.(false);
    if (restoreFocus) triggerRef.current?.focus();
  }

  function toggleOpen() {
    if (open) closeDropdown();
    else openDropdown();
  }

  function commitValue(nextValues: string[]) {
    if (!isControlled) {
      setInternalValue(multiple ? nextValues : (nextValues[0] ?? null));
    }

    if (props.multiple) props.onChange?.(nextValues);
    else props.onChange?.(nextValues[0] ?? null);
  }

  function handleSelect(option: DropdownOption) {
    if (option.disabled) return;

    if (multiple) {
      const isSelected = selectedValues.includes(option.value);
      commitValue(
        isSelected
          ? selectedValues.filter((value) => value !== option.value)
          : [...selectedValues, option.value],
      );
      return;
    }

    commitValue([option.value]);
    closeDropdown(true);
  }

  function handleRemove(value: string, event: ReactMouseEvent) {
    event.stopPropagation();
    if (disabled) return;
    commitValue(selectedValues.filter((v) => v !== value));
  }

  function handleClear(event: ReactMouseEvent) {
    event.stopPropagation();
    if (disabled) return;
    commitValue([]);
  }

  // Removes the last visible chip (or the single value), not an unmatched one.
  function removeLastSelection() {
    const last = selectedOptions[selectedOptions.length - 1];
    if (last) commitValue(selectedValues.filter((v) => v !== last.value));
  }

  function handleSearchChange(nextSearch: string) {
    setSearch(nextSearch);
    setHighlightedIndex(
      findEnabledIndex(filterOptions(options, nextSearch), 0, 1),
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (disabled) return;

    // The search input keeps native text editing (space, caret, backspace).
    const fromSearch = event.currentTarget === searchInputRef.current;
    const { key } = event;

    if (!open) {
      if (
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "Enter" ||
        key === " "
      ) {
        event.preventDefault();
        openDropdown();
      } else if (
        (key === "Backspace" || key === "Delete") &&
        hasSelection &&
        (multiple || clearable)
      ) {
        // Multi removes the last selection; single clears when clearable.
        event.preventDefault();
        removeLastSelection();
      }
      return;
    }

    const lastIndex = filteredOptions.length - 1;

    switch (key) {
      case "Escape":
        event.preventDefault();
        closeDropdown(true);
        return;

      case "Tab":
        closeDropdown();
        return;

      case "ArrowDown": {
        event.preventDefault();
        const next = findEnabledIndex(filteredOptions, highlightedIndex + 1, 1);
        if (next !== -1) setHighlightedIndex(next);
        return;
      }

      case "ArrowUp": {
        event.preventDefault();
        const start = highlightedIndex === -1 ? lastIndex : highlightedIndex - 1;
        const next = findEnabledIndex(filteredOptions, start, -1);
        if (next !== -1) setHighlightedIndex(next);
        return;
      }

      case "Home":
      case "End":
        if (fromSearch) return;
        event.preventDefault();
        setHighlightedIndex(
          key === "Home"
            ? findEnabledIndex(filteredOptions, 0, 1)
            : findEnabledIndex(filteredOptions, lastIndex, -1),
        );
        return;

      case "Enter":
      case " ": {
        if (key === " " && fromSearch) return;
        event.preventDefault();
        const option = filteredOptions[highlightedIndex];
        if (option) handleSelect(option);
        return;
      }

      case "Backspace":
        if (fromSearch && search === "" && multiple && hasSelection) {
          event.preventDefault();
          removeLastSelection();
        }
        return;
    }
  }

  const wrapperClasses = cx(
    styles.wrapper,
    fullWidth && styles.fullWidth,
    labelPosition === "left" && styles.labelLeft,
    labelPosition === "right" && styles.labelRight,
  );

  // With a side label, `width` sizes the dropdown column rather than the whole
  // wrapper, so the label never eats into the dropdown's width.
  const sideLabel = labelPosition === "left" || labelPosition === "right";
  const cssWidth = typeof width === "number" ? `${width}px` : width;

  const wrapperStyle: CSSProperties | undefined =
    width === undefined
      ? style
      : sideLabel
        ? ({ "--dropdown-width": cssWidth, ...style } as CSSProperties)
        : { width, ...style };

  const triggerClasses = cx(
    styles.trigger,
    styles[size],
    hasError && styles.error,
    disabled && styles.disabled,
    open && styles.open,
  );

  const activeDescendant =
    open && highlightedIndex >= 0 ? optionId(highlightedIndex) : undefined;

  return (
    <div
      className={wrapperClasses}
      style={wrapperStyle}
      ref={containerRef}
    >
      {label && (
        <label
          className={styles.label}
          id={labelId}
          onClick={() => triggerRef.current?.focus()}
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
        ref={triggerRef}
        id={dropdownId}
        className={cx(triggerClasses, className)}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={searchable ? undefined : activeDescendant}
        aria-labelledby={label ? labelId : undefined}
        aria-label={label ? undefined : placeholder}
        aria-disabled={disabled}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={helperText || error ? helperId : undefined}
        tabIndex={disabled ? -1 : 0}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
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
                  {/* Mouse shortcut only: keyboard users remove with
                      Backspace or by toggling the option, so no focusable
                      control is nested inside the combobox. */}
                  {!disabled && (
                    <span
                      className={styles.chipRemove}
                      aria-hidden="true"
                      title={`Remove ${option.label}`}
                      onClick={(event) => handleRemove(option.value, event)}
                    >
                      <CloseIcon />
                    </span>
                  )}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className={styles.indicators}>
          {clearable && hasSelection && !disabled && (
            <span
              className={styles.clearButton}
              aria-hidden="true"
              title="Clear selection"
              onClick={handleClear}
            >
              <CloseIcon />
            </span>
          )}

          <ChevronIcon isOpen={open} />
        </div>
      </div>

      {open && (
        <div className={styles.panel}>
          {searchable && (
            <div className={styles.searchWrapper}>
              <input
                ref={searchInputRef}
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                aria-controls={listId}
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                autoComplete="off"
                value={search}
                onChange={(event) => handleSearchChange(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          )}

          <ul
            id={listId}
            className={styles.list}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            aria-multiselectable={multiple}
            // Keep focus on the trigger / search input while clicking options.
            onMouseDown={(event) => event.preventDefault()}
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
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled}
                  className={cx(
                    styles.option,
                    isSelected && styles.selected,
                    isHighlighted && styles.highlighted,
                    option.disabled && styles.optionDisabled,
                  )}
                  onMouseEnter={() => {
                    if (!option.disabled) setHighlightedIndex(index);
                  }}
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

      {name &&
        (multiple ? (
          selectedValues.map((value) => (
            <input
              key={value}
              type="hidden"
              name={name}
              value={value}
            />
          ))
        ) : (
          <input
            type="hidden"
            name={name}
            value={selectedValues[0] ?? ""}
          />
        ))}

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
      aria-hidden="true"
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
      aria-hidden="true"
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
      aria-hidden="true"
    >
      <path d="M4.5 12.5l4.75 4.75L19.5 7" />
    </svg>
  );
}
