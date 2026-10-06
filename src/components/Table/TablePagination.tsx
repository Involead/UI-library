"use client";

import { Dropdown } from "@/components/Dropdown";
import { Icon } from "@/components/Icon";
import { cx } from "@/utils";

import type { TableLabels } from "./Table.types";
import { getPageItems } from "./tableUtils";

import styles from "./Table.module.css";

interface TablePaginationProps {
  page: number;
  pageCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  totalRows: number;
  labels: TableLabels;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  showFirstLast: boolean;
  showPageSizeLabel: boolean;
  align: "between" | "center";
}

/** Double chevron for first/last page. */
function DoubleChevron({ direction }: { direction: "left" | "right" }) {
  return (
    <Icon size={16}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {direction === "left" ? (
          <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
        ) : (
          <path d="M13 17l5-5-5-5M6 17l5-5-5-5" />
        )}
      </svg>
    </Icon>
  );
}

export function TablePagination({
  page,
  pageCount,
  pageSize,
  pageSizeOptions,
  totalRows,
  labels,
  onPageChange,
  onPageSizeChange,
  showFirstLast,
  showPageSizeLabel,
  align,
}: TablePaginationProps) {
  const from = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalRows);
  const isFirst = page <= 1;
  const isLast = page >= pageCount;

  return (
    <div className={cx(styles.pagination, align === "center" && styles.paginationCenter)}>
      <span className={styles.paginationRange} aria-live="polite">
        {labels.range(from, to, totalRows)}
      </span>

      <div className={styles.paginationControls}>
        {pageSizeOptions.length > 1 && (
          <Dropdown
            size="small"
            // Without a visible label, the placeholder names the control.
            label={showPageSizeLabel ? labels.rowsPerPage : undefined}
            placeholder={labels.rowsPerPage}
            labelPosition="left"
            width={88}
            options={pageSizeOptions.map((option) => ({
              label: String(option),
              value: String(option),
            }))}
            value={String(pageSize)}
            onChange={(value) => value && onPageSizeChange(Number(value))}
          />
        )}

        <nav className={styles.pageNav} aria-label={labels.pagination}>
          {showFirstLast && (
            <button
              type="button"
              className={cx(styles.pageButton, styles.pageButtonIcon)}
              onClick={() => onPageChange(1)}
              disabled={isFirst}
              aria-label={labels.firstPage}
            >
              <DoubleChevron direction="left" />
            </button>
          )}
          <button
            type="button"
            className={cx(styles.pageButton, styles.pageButtonIcon)}
            onClick={() => onPageChange(page - 1)}
            disabled={isFirst}
            aria-label={labels.previousPage}
          >
            <Icon name="chevron-left" size={16} />
          </button>

          {getPageItems(page, pageCount).map((item) =>
            typeof item === "number" ? (
              <button
                key={item}
                type="button"
                className={cx(
                  styles.pageButton,
                  item === page && styles.pageButtonCurrent,
                )}
                onClick={() => onPageChange(item)}
                aria-label={labels.page(item)}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            ) : (
              <span key={item} className={styles.pageEllipsis} aria-hidden="true">
                …
              </span>
            ),
          )}

          <button
            type="button"
            className={cx(styles.pageButton, styles.pageButtonIcon)}
            onClick={() => onPageChange(page + 1)}
            disabled={isLast}
            aria-label={labels.nextPage}
          >
            <Icon name="chevron-right" size={16} />
          </button>
          {showFirstLast && (
            <button
              type="button"
              className={cx(styles.pageButton, styles.pageButtonIcon)}
              onClick={() => onPageChange(pageCount)}
              disabled={isLast}
              aria-label={labels.lastPage}
            >
              <DoubleChevron direction="right" />
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
