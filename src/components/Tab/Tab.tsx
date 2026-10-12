"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ButtonHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from "react";

import { Icon } from "@/components/Icon";
import type { IconName } from "@/icons";
import { cx } from "@/utils";

import styles from "./Tab.module.css";
import { getPanelId, getTabId } from "./tab-ids";

/* ------------------------------------------------------------------ */
/* Public types                                                        */
/* ------------------------------------------------------------------ */

export type TabItem = {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: IconName;
};

export type TabSize = "small" | "medium" | "large";
export type TabVariant = "line" | "pill";
export type TabOrientation = "horizontal" | "vertical";
export type TabIconPosition = "start" | "end" | "top" | "bottom";

const iconSizes = { small: 14, medium: 16, large: 18 } as const;

const iconPositionClass = {
  start: "iconStart",
  end: "iconEnd",
  top: "iconTop",
  bottom: "iconBottom",
} as const;

/* ------------------------------------------------------------------ */
/* Context                                                             */
/* ------------------------------------------------------------------ */

type TabContextValue = {
  baseId?: string;
  value: string;
  size: TabSize;
  variant: TabVariant;
  orientation: TabOrientation;
  iconPosition: TabIconPosition;
  iconOnly: boolean;
  disabled: boolean;
  select: (value: string) => void;
  focusValue: (value: string) => void;
  listRef: React.RefObject<HTMLDivElement | null>;
};

const TabContext = createContext<TabContextValue | null>(null);

function useTabContext(component: string) {
  const ctx = useContext(TabContext);
  if (!ctx) {
    throw new Error(`<${component}> must be used inside <TabList>.`);
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* Chevron                                                             */
/* ------------------------------------------------------------------ */

function ChevronIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* TabList — compound container                                        */
/* ------------------------------------------------------------------ */

export interface TabListProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  orientation?: TabOrientation;
  disabled?: boolean;
  scrollable?: boolean;
  iconPosition?: TabIconPosition;
  iconOnly?: boolean;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}

export function TabList({
  id,
  value,
  onChange,
  variant = "pill",
  size = "small",
  orientation = "horizontal",
  disabled = false,
  scrollable = false,
  iconPosition = "start",
  iconOnly = false,
  className = "",
  ariaLabel,
  children,
}: TabListProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const listRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const isVertical = orientation === "vertical";
  const showArrows = scrollable;
  const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
  const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

  /* ---------- DOM helpers (called only from handlers/effects) ---------- */

  const getEnabledTabs = () => {
    const list = listRef.current;
    if (!list) return [];
    return Array.from(
      list.querySelectorAll<HTMLButtonElement>('[role="tab"]'),
    ).filter(
      (t) =>
        !disabled &&
        !t.disabled &&
        t.getAttribute("aria-disabled") !== "true",
    );
  };

  const focusValue = useCallback(
    (target: string) => {
      document.getElementById(getTabId(baseId, target))?.focus();
    },
    [baseId],
  );

  const select = useCallback(
    (next: string) => {
      onChange(next);
    },
    [onChange],
  );

  /* ---------- scrolling ---------- */

  const updateEdges = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const position = isVertical ? list.scrollTop : list.scrollLeft;
    const visible = isVertical ? list.clientHeight : list.clientWidth;
    const total = isVertical ? list.scrollHeight : list.scrollWidth;
    const start = position > 1;
    const end = position + visible < total - 1;
    setEdges((prev) =>
      prev.start === start && prev.end === end ? prev : { start, end },
    );
  }, [isVertical]);

  useEffect(() => {
    const list = listRef.current;
    if (!showArrows || !list) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(list);
    return () => observer.disconnect();
  }, [showArrows, updateEdges]);

  useEffect(() => {
    if (!scrollable) return;
    document
      .getElementById(getTabId(baseId, value))
      ?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [scrollable, baseId, value]);

  const scrollByPage = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const amount = (isVertical ? list.clientHeight : list.clientWidth) * 0.6;
    list.scrollBy({
      [isVertical ? "top" : "left"]: direction * amount,
      behavior: "smooth",
    });
  };

  /* ---------- keyboard nav (DOM order, event handler only) ---------- */

  const handleKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    const keys = [prevKey, nextKey, "Home", "End"];
    if (!keys.includes(event.key)) return;

    const target = event.target as HTMLElement;
    if (target.getAttribute("role") !== "tab") return;

    const tabs = getEnabledTabs();
    if (tabs.length === 0) return;

    event.preventDefault();

    let next: HTMLButtonElement | undefined;
    if (event.key === "Home") {
      next = tabs[0];
    } else if (event.key === "End") {
      next = tabs[tabs.length - 1];
    } else {
      const currentIndex = tabs.findIndex((t) => t === target);
      const from = currentIndex === -1 ? 0 : currentIndex;
      const step = event.key === nextKey ? 1 : -1;
      const nextIndex =
        (((from + step) % tabs.length) + tabs.length) % tabs.length;
      next = tabs[nextIndex];
    }

    if (!next || next === target) return;

    const tabValue = next.dataset.value ?? "";
    if (!tabValue) return;

    select(tabValue);
    next.focus();
  };

  /* ---------- context ---------- */

  const ctx = useMemo<TabContextValue>(
    () => ({
      baseId,
      value,
      size,
      variant,
      orientation,
      iconPosition,
      iconOnly,
      disabled,
      select,
      focusValue,
      listRef,
    }),
    [
      baseId,
      value,
      size,
      variant,
      orientation,
      iconPosition,
      iconOnly,
      disabled,
      select,
      focusValue,
    ],
  );

  const tabList = (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      onScroll={showArrows ? updateEdges : undefined}
      onKeyDownCapture={handleKeyDownCapture}
      className={cx(
        styles.tabList,
        styles[orientation],
        styles[variant],
        scrollable && styles.scrollList,
        className,
      )}
    >
      <TabContext.Provider value={ctx}>{children}</TabContext.Provider>
    </div>
  );

  if (!showArrows) return tabList;

  return (
    <div
      className={cx(
        styles.scrollWrapper,
        isVertical && styles.scrollWrapperVertical,
      )}
    >
      {edges.start ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          data-tab-scroll="start"
          className={cx(styles.scrollButton, styles.scrollButtonStart)}
          onClick={() => scrollByPage(-1)}
        >
          <ChevronIcon />
        </button>
      ) : null}
      {tabList}
      {edges.end ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          data-tab-scroll="end"
          className={cx(styles.scrollButton, styles.scrollButtonEnd)}
          onClick={() => scrollByPage(1)}
        >
          <ChevronIcon />
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TabButton — compound child                                          */
/* ------------------------------------------------------------------ */

export interface TabButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  value: string;
  label?: string;
  disabled?: boolean;
  icon?: IconName;
  children?: ReactNode;
}

export function TabButton({
  value,
  label,
  disabled = false,
  icon,
  children,
  className,
  ...rest
}: TabButtonProps) {
  const ctx = useTabContext("TabButton");

  const selected = ctx.value === value;
  const hideLabel = ctx.iconOnly && Boolean(icon);
  const isDisabled = ctx.disabled || disabled;

  return (
    <button
      id={ctx.baseId ? getTabId(ctx.baseId, value) : undefined}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={ctx.baseId ? getPanelId(ctx.baseId, value) : undefined}
      aria-label={hideLabel ? label : undefined}
      title={hideLabel ? label : undefined}
      tabIndex={isDisabled ? -1 : selected ? 0 : -1}
      disabled={isDisabled}
      data-value={value}
      className={cx(
        styles.tab,
        styles[ctx.size],
        icon && styles.hasIcon,
        icon && styles[iconPositionClass[ctx.iconPosition]],
        hideLabel && styles.iconOnly,
        selected && styles.active,
        isDisabled && styles.disabled,
        className,
      )}
      onClick={() => {
        if (!isDisabled) ctx.select(value);
      }}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault();
          if (!isDisabled) ctx.select(value);
        }
      }}
      {...rest}
    >
      {icon ? <Icon name={icon} size={iconSizes[ctx.size]} /> : null}
      {hideLabel ? null : (children ?? label)}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Tab — legacy array-based API                                        */
/* ------------------------------------------------------------------ */

export interface TabProps {
  id?: string;
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: TabVariant;
  size?: TabSize;
  orientation?: TabOrientation;
  disabled?: boolean;
  scrollable?: boolean;
  iconPosition?: TabIconPosition;
  iconOnly?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Array-based convenience wrapper around <TabList> + <TabButton>.
 * Kept for compatibility with existing call sites.
 */
export function Tab({
  items,
  id,
  value,
  onChange,
  variant,
  size,
  orientation,
  disabled,
  scrollable,
  iconPosition,
  iconOnly,
  className,
  ariaLabel,
}: TabProps) {
  return (
    <TabList
      id={id}
      value={value}
      onChange={onChange}
      variant={variant}
      size={size}
      orientation={orientation}
      disabled={disabled}
      scrollable={scrollable}
      iconPosition={iconPosition}
      iconOnly={iconOnly}
      className={className}
      ariaLabel={ariaLabel}
    >
      {items.map((item) => (
        <TabButton
          key={item.value}
          value={item.value}
          label={item.label}
          icon={item.icon}
          disabled={item.disabled}
        />
      ))}
    </TabList>
  );
}