"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

import { Icon } from "@/components/Icon";
import type { IconName } from "@/icons";
import { cx } from "@/utils";

import styles from "./Tab.module.css";
import { getPanelId, getTabId } from "./tab-ids";

export type TabItem = {
  label: string;
  value: string;
  disabled?: boolean;
  /** Built-in icon shown with the label (or alone when `iconOnly`). */
  icon?: IconName;
};

export type TabIconPosition = "start" | "end" | "top" | "bottom";

export interface TabProps {
  /**
   * Base id shared with <TabPanel tabsId>. Pass it when you render panels;
   * `aria-controls` is only emitted when this is provided.
   */
  id?: string;
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
  variant?: "line" | "pill";
  size?: "small" | "medium" | "large";
  orientation?: "horizontal" | "vertical";
  disabled?: boolean;
  /** Keep tabs on one line and scroll when they don't fit. */
  scrollable?: boolean;
  /** Where the icon sits relative to the label. */
  iconPosition?: TabIconPosition;
  /** Show only the icons. The label stays as the accessible name. */
  iconOnly?: boolean;
  className?: string;
  ariaLabel?: string;
}

const iconSizes = { small: 16, medium: 20, large: 24 } as const;

const iconPositionClass = {
  start: "iconStart",
  end: "iconEnd",
  top: "iconTop",
  bottom: "iconBottom",
} as const;

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

export function Tab({
  id,
  items,
  value,
  onChange,
  variant = "line",
  size = "medium",
  orientation = "horizontal",
  disabled = false,
  scrollable = false,
  iconPosition = "start",
  iconOnly = false,
  className = "",
  ariaLabel,
}: TabProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const listRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const isVertical = orientation === "vertical";
  const showArrows = scrollable;
  const prevKey = isVertical ? "ArrowUp" : "ArrowLeft";
  const nextKey = isVertical ? "ArrowDown" : "ArrowRight";

  const isItemDisabled = (item: TabItem) => disabled || Boolean(item.disabled);

  // Which sides still have hidden tabs (left/right or top/bottom).
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

  // ResizeObserver fires once on observe, so this also sets the initial state.
  useEffect(() => {
    const list = listRef.current;
    if (!showArrows || !list) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(list);
    return () => observer.disconnect();
  }, [showArrows, updateEdges, items.length]);

  // Keep the selected tab visible.
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

  // Walks from `from` in `step` direction (wrapping) and returns the first
  // enabled index, or -1 if there is none.
  const findEnabledIndex = (from: number, step: 1 | -1) => {
    const count = items.length;
    for (let n = 1; n <= count; n++) {
      const candidate = (((from + step * n) % count) + count) % count;
      const item = items[candidate];
      if (item && !isItemDisabled(item)) {
        return candidate;
      }
    }
    return -1;
  };

  // Only one tab is a tab stop. Fall back to the first enabled tab when the
  // current value matches nothing selectable.
  const selectedItem = items.find((item) => item.value === value);
  const focusableValue =
    selectedItem && !isItemDisabled(selectedItem)
      ? selectedItem.value
      : items.find((item) => !isItemDisabled(item))?.value;

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (![prevKey, nextKey, "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    let nextIndex = index;
    if (event.key === "Home") {
      nextIndex = findEnabledIndex(-1, 1);
    } else if (event.key === "End") {
      nextIndex = findEnabledIndex(0, -1);
    } else {
      nextIndex = findEnabledIndex(index, event.key === nextKey ? 1 : -1);
    }

    const target = items[nextIndex];
    if (!target || nextIndex === index) {
      return;
    }

    onChange(target.value);
    document.getElementById(getTabId(baseId, target.value))?.focus();
  };

  const tabList = (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      aria-label={ariaLabel}
      onScroll={showArrows ? updateEdges : undefined}
      className={cx(
        styles.tabList,
        styles[orientation],
        styles[variant],
        scrollable && styles.scrollList,
        className,
      )}
    >
      {items.map((item, index) => {
        const selected = item.value === value;
        const itemDisabled = isItemDisabled(item);
        // Icon-only without an icon would be an empty button, so keep the label.
        const hideLabel = iconOnly && Boolean(item.icon);

        return (
          <button
            key={item.value}
            id={getTabId(baseId, item.value)}
            type="button"
            role="tab"
            aria-selected={selected}
            aria-controls={id ? getPanelId(baseId, item.value) : undefined}
            aria-label={hideLabel ? item.label : undefined}
            title={hideLabel ? item.label : undefined}
            tabIndex={item.value === focusableValue ? 0 : -1}
            disabled={itemDisabled}
            className={cx(
              styles.tab,
              styles[size],
              item.icon && styles.hasIcon,
              item.icon && styles[iconPositionClass[iconPosition]],
              hideLabel && styles.iconOnly,
              selected && styles.active,
              itemDisabled && styles.disabled,
            )}
            onClick={() => {
              if (!itemDisabled) {
                onChange(item.value);
              }
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            {item.icon ? <Icon name={item.icon} size={iconSizes[size]} /> : null}
            {hideLabel ? null : item.label}
          </button>
        );
      })}
    </div>
  );

  if (!showArrows) {
    return tabList;
  }

  // The arrows are a mouse/touch aid. Keyboard users scroll with the arrow
  // keys, and focus keeps the selected tab in view, so hide them from AT.
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
          className={cx(styles.scrollButton, styles.scrollButtonEnd)}
          onClick={() => scrollByPage(1)}
        >
          <ChevronIcon />
        </button>
      ) : null}
    </div>
  );
}