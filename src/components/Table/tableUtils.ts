import { isValidElement, type ReactNode } from "react";

import type {
  SortRule,
  TableColumn,
  TableColumnVisibility,
  TableFilters,
  TableRow,
  TableRowKey,
} from "./Table.types";

/* =========================
   COLUMNS
   ========================= */

export function getLeafColumns<T>(columns: TableColumn<T>[]): TableColumn<T>[] {
  return columns.flatMap((column) =>
    column.columns?.length ? getLeafColumns(column.columns) : [column],
  );
}

/** Ancestor groups of every leaf column, keyed by leaf id (outermost first). */
export function getColumnPaths<T>(
  columns: TableColumn<T>[],
  parents: TableColumn<T>[] = [],
  paths = new Map<string, TableColumn<T>[]>(),
) {
  for (const column of columns) {
    if (column.columns?.length) {
      getColumnPaths(column.columns, [...parents, column], paths);
    } else {
      paths.set(column.id, parents);
    }
  }
  return paths;
}

export function getColumnLabel<T>(column: TableColumn<T>): string {
  if (column.label) return column.label;
  if (typeof column.header === "string") return column.header;
  return column.id;
}

/** Applies `order`: unknown ids are ignored, missing ids keep their place at the end. */
export function orderColumns<T>(leaves: TableColumn<T>[], order: string[]) {
  if (order.length === 0) return leaves;
  const byId = new Map(leaves.map((column) => [column.id, column]));
  return [
    ...order.flatMap((id) => byId.get(id) ?? []),
    ...leaves.filter((column) => !order.includes(column.id)),
  ];
}

export function isColumnVisible<T>(
  column: TableColumn<T>,
  visibility: TableColumnVisibility,
) {
  return visibility[column.id] ?? !column.defaultHidden;
}

export type HeaderCellKind = "group" | "leaf" | "description";

export interface HeaderCell<T> {
  key: string;
  kind: HeaderCellKind;
  column: TableColumn<T>;
  /** Leaf columns covered by this cell. */
  leaves: TableColumn<T>[];
  colSpan: number;
  rowSpan: number;
}

/**
 * Builds the `<thead>` rows for (possibly grouped) columns. Adjacent leaves
 * sharing a group are merged under one spanning cell, so reordering columns
 * out of their group just splits the group header instead of breaking it.
 *
 * A leaf with a `description` gets it in the last header row, under its own
 * header. That is the row where grouped columns show their sub-headers, so
 * descriptions line up with them.
 */
export function buildHeaderRows<T>(
  visibleLeaves: TableColumn<T>[],
  paths: Map<string, TableColumn<T>[]>,
): HeaderCell<T>[][] {
  const hasDescription = (leaf: TableColumn<T>) => leaf.description != null;
  const depth = Math.max(
    1,
    ...visibleLeaves.map(
      (leaf) => (paths.get(leaf.id)?.length ?? 0) + 1 + (hasDescription(leaf) ? 1 : 0),
    ),
  );
  const rows: HeaderCell<T>[][] = Array.from({ length: depth }, () => []);

  for (let level = 0; level < depth; level += 1) {
    const row = rows[level];

    for (const leaf of visibleLeaves) {
      const groups = paths.get(leaf.id) ?? [];

      if (level < groups.length) {
        const group = groups[level];
        const previous = row[row.length - 1];
        if (previous?.kind === "group" && previous.column === group) {
          previous.leaves.push(leaf);
          previous.colSpan += 1;
        } else {
          row.push({
            key: `${group.id}-${leaf.id}`,
            kind: "group",
            column: group,
            leaves: [leaf],
            colSpan: 1,
            rowSpan: 1,
          });
        }
      } else if (level === groups.length) {
        row.push({
          key: leaf.id,
          kind: "leaf",
          column: leaf,
          leaves: [leaf],
          colSpan: 1,
          rowSpan: depth - level - (hasDescription(leaf) ? 1 : 0),
        });
      } else if (level === depth - 1 && hasDescription(leaf)) {
        row.push({
          key: `${leaf.id}-description`,
          kind: "description",
          column: leaf,
          leaves: [leaf],
          colSpan: 1,
          rowSpan: 1,
        });
      }
    }
  }

  return rows;
}

/* =========================
   VALUES
   ========================= */

export function getRowKey<T>(
  row: T,
  index: number,
  rowKey: keyof T | ((row: T, index: number) => TableRowKey),
): TableRowKey {
  if (typeof rowKey === "function") return rowKey(row, index);
  const value = row[rowKey];
  return typeof value === "number" ? value : String(value ?? index);
}

export function getCellValue<T>(column: TableColumn<T>, row: T, index: number) {
  const { accessor } = column;
  if (typeof accessor === "function") return accessor(row, index);
  const key = (accessor ?? column.id) as keyof T;
  return row != null && typeof row === "object" ? row[key] : undefined;
}

export function valueToText(value: unknown): string {
  if (value == null) return "";
  if (value instanceof Date) return value.toLocaleDateString();
  if (Array.isArray(value)) return value.map(valueToText).filter(Boolean).join(", ");
  if (typeof value === "object") return "";
  return String(value);
}

export function renderDefaultCell(value: unknown): ReactNode {
  if (isValidElement(value)) return value;
  return valueToText(value);
}

function getSearchText<T>(column: TableColumn<T>, row: T, index: number) {
  return column.getSearchValue
    ? column.getSearchValue(row)
    : valueToText(getCellValue(column, row, index));
}

/* =========================
   SEARCH & FILTERS
   ========================= */

/**
 * Global search runs over `searchColumns` (the visible ones); column filters
 * run over `filterColumns`, so a filter keeps applying while its column is hidden.
 */
export function filterRows<T>(
  rows: TableRow<T>[],
  searchColumns: TableColumn<T>[],
  filterColumns: TableColumn<T>[],
  search: string,
  filters: TableFilters,
) {
  const query = search.trim().toLowerCase();
  const searchable = searchColumns.filter((column) => column.searchable !== false);
  const activeFilters = filterColumns.flatMap((column) => {
    const value = filters[column.id];
    return value != null && value !== "" ? [{ column, value }] : [];
  });

  if (query === "" && activeFilters.length === 0) return rows;

  return rows.filter(({ original, index }) => {
    const matchesSearch =
      query === "" ||
      searchable.some((column) =>
        getSearchText(column, original, index).toLowerCase().includes(query),
      );
    if (!matchesSearch) return false;

    return activeFilters.every(({ column, value }) =>
      column.filterFn
        ? column.filterFn(original, value, getCellValue(column, original, index))
        : getSearchText(column, original, index)
            .toLowerCase()
            .includes(value.trim().toLowerCase()),
    );
  });
}

/* =========================
   SORTING
   ========================= */

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: "base",
});

function isEmpty(value: unknown) {
  return value == null || value === "";
}

export function compareValues(a: unknown, b: unknown): number {
  const aEmpty = isEmpty(a);
  const bEmpty = isEmpty(b);
  if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;

  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
  if (typeof a === "number" && typeof b === "number") return a - b;
  if (typeof a === "boolean" && typeof b === "boolean") {
    return Number(a) - Number(b);
  }
  return collator.compare(valueToText(a), valueToText(b));
}

export function sortRows<T>(
  rows: TableRow<T>[],
  columns: TableColumn<T>[],
  sort: SortRule[],
) {
  const rules = sort.flatMap((rule) => {
    const column = columns.find((candidate) => candidate.id === rule.columnId);
    return column ? [{ column, sign: rule.direction === "asc" ? 1 : -1 }] : [];
  });
  if (rules.length === 0) return rows;

  return [...rows].sort((a, b) => {
    for (const { column, sign } of rules) {
      let result: number;
      if (column.sortFn) {
        result = column.sortFn(a.original, b.original) * sign;
      } else {
        const aValue = getCellValue(column, a.original, a.index);
        const bValue = getCellValue(column, b.original, b.index);
        // Empty values stay last in both directions.
        result =
          isEmpty(aValue) || isEmpty(bValue)
            ? compareValues(aValue, bValue)
            : compareValues(aValue, bValue) * sign;
      }
      if (result !== 0) return result;
    }
    // Stable fallback: original data order.
    return a.index - b.index;
  });
}

/** Next sort state after a header click. Cycles asc → desc → off. */
export function toggleSort<T>(
  sort: SortRule[],
  column: TableColumn<T>,
  additive: boolean,
): SortRule[] {
  const first: SortRule["direction"] = column.sortDescFirst ? "desc" : "asc";
  const current = sort.find((rule) => rule.columnId === column.id);

  let next: SortRule | null;
  if (!current) next = { columnId: column.id, direction: first };
  else if (current.direction === first) {
    next = { columnId: column.id, direction: first === "asc" ? "desc" : "asc" };
  } else next = null;

  if (!additive) return next ? [next] : [];

  const others = sort.filter((rule) => rule.columnId !== column.id);
  if (!next) return others;
  return current
    ? sort.map((rule) => (rule.columnId === column.id ? next : rule))
    : [...others, next];
}

/* =========================
   PAGINATION
   ========================= */

export type PageItem = number | "ellipsis-start" | "ellipsis-end";

/** Page numbers to show: first, last, and a window around the current page. */
export function getPageItems(page: number, pageCount: number): PageItem[] {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const start = Math.max(2, Math.min(page - 1, pageCount - 4));
  const end = Math.min(pageCount - 1, Math.max(page + 1, 5));
  const items: PageItem[] = [1];

  if (start > 2) items.push("ellipsis-start");
  for (let i = start; i <= end; i += 1) items.push(i);
  if (end < pageCount - 1) items.push("ellipsis-end");
  items.push(pageCount);

  return items;
}

/* =========================
   SPANS
   ========================= */

export interface CellSpan {
  colSpan: number;
  rowSpan: number;
}

/**
 * Resolves body cell spans for the current page. Returns, per row, a map of
 * column index → span; columns missing from the map are covered by another
 * cell and are not rendered. Row spans stop at an expanded row so they never
 * reach across its detail row.
 */
export function computeSpans(
  rowCount: number,
  columnCount: number,
  getSpan: (rowIndex: number, columnIndex: number) => CellSpan,
  isRowExpanded: (rowIndex: number) => boolean,
): Map<number, CellSpan>[] {
  const covered = Array.from({ length: rowCount }, () =>
    new Array<boolean>(columnCount).fill(false),
  );
  const result = Array.from({ length: rowCount }, () => new Map<number, CellSpan>());

  for (let r = 0; r < rowCount; r += 1) {
    let maxRows = 1;
    while (r + maxRows - 1 < rowCount - 1 && !isRowExpanded(r + maxRows - 1)) {
      maxRows += 1;
    }

    for (let c = 0; c < columnCount; c += 1) {
      if (covered[r][c]) continue;

      const requested = getSpan(r, c);
      let colSpan = clampSpan(requested.colSpan, columnCount - c);
      const rowSpan = clampSpan(requested.rowSpan, maxRows);

      // Never overlap a cell that an earlier row span already claimed.
      for (let i = 1; i < colSpan; i += 1) {
        if (covered[r][c + i]) {
          colSpan = i;
          break;
        }
      }

      for (let dr = 0; dr < rowSpan; dr += 1) {
        for (let dc = 0; dc < colSpan; dc += 1) {
          covered[r + dr][c + dc] = true;
        }
      }
      result[r].set(c, { colSpan, rowSpan });
    }
  }

  return result;
}

function clampSpan(value: number, max: number) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(Math.floor(value), max));
}

/* =========================
   EMPTY CELLS
   ========================= */

export function isEmptyContent(content: ReactNode) {
  return content == null || content === false || content === "";
}

/* =========================
   CSV EXPORT
   ========================= */

// Characters a spreadsheet would read as the start of a formula.
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

function escapeCsv(value: unknown) {
  let text = valueToText(value);
  // Guard against CSV/formula injection when the file is opened in Excel.
  if (typeof value === "string" && FORMULA_PREFIX.test(text)) text = `'${text}`;
  return /[",\r\n]/.test(text) || text !== text.trim()
    ? `"${text.replace(/"/g, '""')}"`
    : text;
}

/** CSV for `rows` × `columns`. Grouped columns are labelled "Group - Column". */
export function rowsToCsv<T>(
  rows: TableRow<T>[],
  columns: TableColumn<T>[],
  paths: Map<string, TableColumn<T>[]>,
) {
  const header = columns.map((column) =>
    escapeCsv(
      [...(paths.get(column.id) ?? []), column].map(getColumnLabel).join(" - "),
    ),
  );
  const lines = rows.map(({ original, index }) =>
    columns
      .map((column) =>
        escapeCsv(
          column.exportValue
            ? column.exportValue(original, index)
            : getCellValue(column, original, index),
        ),
      )
      .join(","),
  );
  return [header.join(","), ...lines].join("\r\n");
}

/** Saves `csv` as a file. The BOM makes Excel read it as UTF-8 (non-Latin text). */
export function downloadCsv(csv: string, fileName: string) {
  const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function toCssLength(value: number | string | undefined) {
  return typeof value === "number" ? `${value}px` : value;
}
