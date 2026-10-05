"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/Input";

import type {
  TableColumn,
  TableColumnVisibility,
  TableLabels,
  TableSize,
} from "./Table.types";
import { getColumnLabel, isColumnVisible } from "./tableUtils";

import styles from "./Table.module.css";

interface TableToolbarProps<T> {
  size: TableSize;
  labels: TableLabels;
  searchable: boolean;
  search: string;
  onSearchChange: (search: string) => void;
  showColumnSettings: boolean;
  /** All leaf columns, in display order, including hidden ones. */
  columns: TableColumn<T>[];
  visibility: TableColumnVisibility;
  onToggleColumn: (columnId: string, visible: boolean) => void;
  onMoveColumn: (columnId: string, offset: -1 | 1) => void;
  searchPlacement: "start" | "end";
  columnSettingsTrigger: "button" | "link";
  /** Shows the download button when set. */
  onDownload?: () => void;
  children?: ReactNode;
}

export function TableToolbar<T>({
  size,
  labels,
  searchable,
  search,
  onSearchChange,
  showColumnSettings,
  columns,
  visibility,
  onToggleColumn,
  onMoveColumn,
  searchPlacement,
  columnSettingsTrigger,
  onDownload,
  children,
}: TableToolbarProps<T>) {
  const searchField = searchable && (
    <div className={styles.toolbarSearch}>
      <Input
        type="search"
        size={size}
        fullWidth
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={labels.searchPlaceholder}
        aria-label={labels.search}
        leftIcon={<Icon name="search" size={16} />}
      />
    </div>
  );

  // Order: [search?] [custom content] — spacer — [search?] [columns] [download]
  return (
    <div className={styles.toolbar}>
      {searchPlacement === "start" && searchField}

      {children && <div className={styles.toolbarContent}>{children}</div>}

      <span className={styles.toolbarSpacer} />

      {searchPlacement === "end" && searchField}

      {showColumnSettings && (
        <ColumnSettings
          labels={labels}
          columns={columns}
          visibility={visibility}
          onToggleColumn={onToggleColumn}
          onMoveColumn={onMoveColumn}
          trigger={columnSettingsTrigger}
        />
      )}

      {onDownload && (
        <Icon
          name="download"
          size={20}
          className={styles.downloadButton}
          ariaLabel={labels.download}
          title={labels.download}
          onClick={onDownload}
        />
      )}
    </div>
  );
}

type ColumnSettingsProps<T> = Pick<
  TableToolbarProps<T>,
  "labels" | "columns" | "visibility" | "onToggleColumn" | "onMoveColumn"
> & { trigger: "button" | "link" };

function ColumnSettings<T>({
  labels,
  columns,
  visibility,
  onToggleColumn,
  onMoveColumn,
  trigger,
}: ColumnSettingsProps<T>) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        containerRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const visibleCount = columns.filter((column) =>
    isColumnVisible(column, visibility),
  ).length;

  return (
    <div ref={containerRef} className={styles.columnSettings}>
      {trigger === "link" ? (
        <button
          type="button"
          className={styles.linkButton}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {labels.columns}
        </button>
      ) : (
        <Button
          variant="outline"
          size="small"
          leftIcon={<Icon name="settings" size={16} />}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
        >
          {labels.columns}
        </Button>
      )}

      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={labels.columns}
          className={styles.columnPanel}
        >
          <ul className={styles.columnList}>
            {columns.map((column, index) => {
              const label = getColumnLabel(column);
              const visible = isColumnVisible(column, visibility);
              // Never allow hiding the last visible column.
              const locked =
                column.hideable === false || (visible && visibleCount === 1);

              return (
                <li key={column.id} className={styles.columnItem}>
                  <Checkbox
                    size="small"
                    label={label}
                    checked={visible}
                    disabled={locked}
                    onChange={(event) =>
                      onToggleColumn(column.id, event.target.checked)
                    }
                  />
                  <span className={styles.columnMove}>
                    <Icon
                      name="chevron-up"
                      size={16}
                      ariaLabel={labels.moveColumnUp(label)}
                      disabled={index === 0}
                      onClick={() => onMoveColumn(column.id, -1)}
                    />
                    <Icon
                      name="chevron-down"
                      size={16}
                      ariaLabel={labels.moveColumnDown(label)}
                      disabled={index === columns.length - 1}
                      onClick={() => onMoveColumn(column.id, 1)}
                    />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
