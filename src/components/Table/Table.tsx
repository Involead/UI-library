"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/Input";
import { cx } from "@/utils";

import type {
  SortRule,
  TableAlign,
  TableCellContext,
  TableColumn,
  TableColumnSizing,
  TableColumnVisibility,
  TableEditorProps,
  TableFilters,
  TableLabels,
  TableProps,
  TableRow,
  TableRowKey,
} from "./Table.types";
import { TablePagination } from "./TablePagination";
import { TableToolbar } from "./TableToolbar";
import {
  buildHeaderRows,
  computeSpans,
  filterRows,
  getCellValue,
  getColumnLabel,
  getColumnPaths,
  getLeafColumns,
  downloadCsv,
  getRowKey,
  isColumnVisible,
  isEmptyContent,
  orderColumns,
  renderDefaultCell,
  rowsToCsv,
  sortRows,
  toCssLength,
  toggleSort,
  valueToText,
  type HeaderCell,
} from "./tableUtils";
import { useControllableState } from "./useControllableState";

import styles from "./Table.module.css";

const DEFAULT_LABELS: TableLabels = {
  search: "Search table",
  searchPlaceholder: "Search…",
  columns: "Columns",
  filterColumn: (column) => `Filter ${column}`,
  selection: "Selection",
  selectAll: "Select all rows on this page",
  selectRow: (rowKey) => `Select row ${rowKey}`,
  expandRow: "Expand row",
  collapseRow: "Collapse row",
  moveColumnUp: (column) => `Move ${column} up`,
  moveColumnDown: (column) => `Move ${column} down`,
  resizeColumn: (column) => `Resize ${column}`,
  sortAscending: "sorted ascending",
  sortDescending: "sorted descending",
  sortPriority: (index) => `sort priority ${index}`,
  empty: "No data to display",
  noResults: "No results match your search",
  loading: "Loading…",
  error: "Something went wrong while loading the data.",
  retry: "Try again",
  rowsPerPage: "Rows per page",
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  download: "Download data",
  editCell: (column) => `Edit ${column}`,
  invalidNumber: "Enter a number.",
  moveRow: (rowKey) => `Move row ${rowKey}`,
  reorder: "Reorder",
  reorderInstructions: "Drag, or press the up and down arrow keys, to move the row.",
  reorderUnavailable: "Clear sorting, search, and filters to reorder rows",
  rowMoved: (position, total) => `Row moved to position ${position} of ${total}`,
  page: (page) => `Page ${page}`,
  range: (from, to, total) => `${from}–${to} of ${total}`,
  pagination: "Pagination",
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];
const CONTROL_COLUMN_WIDTH = 44;
const MIN_COLUMN_WIDTH = 48;
const KEYBOARD_RESIZE_STEP = 16;
const DEFAULT_TRUNCATE_WIDTH = 240;
const DEFAULT_EXPORT_FILE = "table-data.csv";
const SELECT_COLUMN = "__select";
const EXPAND_COLUMN = "__expand";
const REORDER_COLUMN = "__reorder";

const ALIGN_CLASS: Record<TableAlign, string | undefined> = {
  left: undefined,
  center: styles.alignCenter,
  right: styles.alignRight,
};

const INTERACTIVE_SELECTOR =
  "button, a, input, select, textarea, label, [role='button'], [contenteditable='true']";

type StickySide = "left" | "right";

function toDomId(value: TableRowKey) {
  return String(value).replace(/[^\w-]/g, "_");
}

/** Up/down arrow pair; CSS highlights the arrow matching the sort direction. */
function GripIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
      <circle cx="6" cy="4" r="1.25" />
      <circle cx="10" cy="4" r="1.25" />
      <circle cx="6" cy="8" r="1.25" />
      <circle cx="10" cy="8" r="1.25" />
      <circle cx="6" cy="12" r="1.25" />
      <circle cx="10" cy="12" r="1.25" />
    </svg>
  );
}

/** Same rows in the same order (shallow), even if the array itself is new. */
function sameRows<T>(a: T[], b: T[]) {
  return a.length === b.length && a.every((row, index) => row === b[index]);
}

/** The built-in editor only handles plain text and numbers. */
function isPlainValue(value: unknown) {
  return value == null || typeof value === "string" || typeof value === "number";
}

type EditingCell = { rowKey: TableRowKey; columnId: string };
type DropTarget = { rowKey: TableRowKey; position: "before" | "after" };

function SortIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <g data-arrow="down">
        <path d="M8 5v14" />
        <path d="M4 15l4 4 4-4" />
      </g>
      <g data-arrow="up">
        <path d="M16 19V5" />
        <path d="M12 9l4-4 4 4" />
      </g>
    </svg>
  );
}

export function Table<T>({
  data,
  columns,
  rowKey = "id" as keyof T,

  caption,
  hideCaption = false,
  ariaLabel,
  toolbar,
  footer,

  size = "medium",
  bordered = false,
  striped = false,
  hoverable = false,
  compact = false,
  maxHeight,
  stickyHeader = false,
  wrapHeaders = false,
  emptyCellValue,

  searchPlacement = "start",
  columnSettingsTrigger = "button",

  exportable = false,
  onExport,

  sortable = false,
  multiSort = false,
  sort: sortProp,
  defaultSort,
  onSortChange,
  manualSorting = false,

  searchable = false,
  search: searchProp,
  defaultSearch,
  onSearchChange,
  showColumnFilters = false,
  filters: filtersProp,
  defaultFilters,
  onFiltersChange,
  manualFiltering = false,

  selectionMode = "none",
  selectedRowKeys,
  defaultSelectedRowKeys,
  onSelectionChange,
  isRowSelectable,

  renderExpandedRow,
  isRowExpandable,
  expandedRowKeys,
  defaultExpandedRowKeys,
  onExpandedChange,

  pagination = false,
  page: pageProp,
  defaultPage,
  onPageChange,
  pageSize: pageSizeProp,
  onPageSizeChange,
  manualPagination = false,
  totalRows: totalRowsProp,

  showColumnSettings = false,
  columnVisibility,
  defaultColumnVisibility,
  onColumnVisibilityChange,
  columnOrder,
  defaultColumnOrder,
  onColumnOrderChange,
  resizableColumns = false,
  columnSizing,
  defaultColumnSizing,
  onColumnSizingChange,

  loading = false,
  loadingRows = 5,
  error,
  onRetry,
  emptyState,
  noResultsState,

  onCellEdit,
  reorderableRows = false,
  onRowReorder,
  onDataChange,

  rowClassName,
  getRowProps,
  onRowClick,

  labels: labelOverrides,
  id,
  className,
  tableClassName,
  style,
}: TableProps<T>) {
  const labels = useMemo(
    () => ({ ...DEFAULT_LABELS, ...labelOverrides }),
    [labelOverrides],
  );

  const generatedId = useId();
  const tableId = id ?? generatedId;
  const captionId = `${tableId}-caption`;

  const paginationOptions = typeof pagination === "object" ? pagination : {};
  const paginated = Boolean(pagination);
  const selectionEnabled = selectionMode !== "none";
  const expandable = Boolean(renderExpandedRow);

  /* =========================
     STATE
     ========================= */

  // Edits and row moves change a local copy of `data`; new `data` (e.g. the
  // consumer saving `onDataChange`) replaces it. Compare the rows, not the
  // array, so an inline `data={items.slice(0, 5)}` doesn't undo every edit.
  const [rowData, setRowData] = useState(data);
  const prevDataRef = useRef(data);
  useEffect(() => {
    const prevData = prevDataRef.current;
    prevDataRef.current = data;
    if (!sameRows(prevData, data)) setRowData(data);
  }, [data]);

  const [sort, setSort] = useControllableState<SortRule[]>(
    sortProp,
    defaultSort ?? [],
    onSortChange,
  );
  const [search, setSearch] = useControllableState(
    searchProp,
    defaultSearch ?? "",
    onSearchChange,
  );
  const [filters, setFilters] = useControllableState<TableFilters>(
    filtersProp,
    defaultFilters ?? {},
    onFiltersChange,
  );
  const [page, setPage] = useControllableState(
    pageProp,
    defaultPage ?? 1,
    onPageChange,
  );
  const [pageSize, setPageSize] = useControllableState(
    pageSizeProp,
    paginationOptions.defaultPageSize ?? DEFAULT_PAGE_SIZE,
    onPageSizeChange,
  );
  const [selectedKeys, setSelectedKeys] = useControllableState<TableRowKey[]>(
    selectedRowKeys,
    defaultSelectedRowKeys ?? [],
    (keys) => {
      if (!onSelectionChange) return;
      const keySet = new Set(keys);
      onSelectionChange(
        keys,
        rowData.filter((row, index) => keySet.has(getRowKey(row, index, rowKey))),
      );
    },
  );
  const [expandedKeys, setExpandedKeys] = useControllableState<TableRowKey[]>(
    expandedRowKeys,
    defaultExpandedRowKeys ?? [],
    onExpandedChange,
  );
  const [visibility, setVisibility] =
    useControllableState<TableColumnVisibility>(
      columnVisibility,
      defaultColumnVisibility ?? {},
      onColumnVisibilityChange,
    );
  const [order, setOrder] = useControllableState<string[]>(
    columnOrder,
    defaultColumnOrder ?? [],
    onColumnOrderChange,
  );
  const [sizing, setSizing] = useControllableState<TableColumnSizing>(
    columnSizing,
    defaultColumnSizing ?? {},
    onColumnSizingChange,
  );
  const [resizingId, setResizingId] = useState<string | null>(null);

  /* =========================
     COLUMNS
     ========================= */

  const leafColumns = useMemo(() => getLeafColumns(columns), [columns]);
  const columnPaths = useMemo(() => getColumnPaths(columns), [columns]);
  const orderedColumns = useMemo(
    () => orderColumns(leafColumns, order),
    [leafColumns, order],
  );
  const displayColumns = useMemo(
    () => orderedColumns.filter((column) => isColumnVisible(column, visibility)),
    [orderedColumns, visibility],
  );
  const headerRows = useMemo(
    () => buildHeaderRows(displayColumns, columnPaths),
    [displayColumns, columnPaths],
  );

  const controlIds = [
    ...(reorderableRows ? [REORDER_COLUMN] : []),
    ...(selectionEnabled ? [SELECT_COLUMN] : []),
    ...(expandable ? [EXPAND_COLUMN] : []),
  ];
  const totalColumnCount = controlIds.length + displayColumns.length;

  /* =========================
     ROW MODEL
     ========================= */

  const allRows = useMemo<TableRow<T>[]>(
    () =>
      rowData.map((original, index) => ({
        key: getRowKey(original, index, rowKey),
        original,
        index,
        depth: 0,
      })),
    [rowData, rowKey],
  );

  const filteredRows = useMemo(
    () =>
      manualFiltering
        ? allRows
        : filterRows(allRows, displayColumns, leafColumns, search, filters),
    [manualFiltering, allRows, displayColumns, leafColumns, search, filters],
  );

  const sortedRows = useMemo(
    () => (manualSorting ? filteredRows : sortRows(filteredRows, leafColumns, sort)),
    [manualSorting, filteredRows, leafColumns, sort],
  );

  const totalRows = manualPagination
    ? (totalRowsProp ?? rowData.length)
    : sortedRows.length;
  const pageCount = paginated ? Math.max(1, Math.ceil(totalRows / pageSize)) : 1;
  const currentPage = Math.min(Math.max(1, page), pageCount);

  const pageRows = useMemo(
    () =>
      paginated && !manualPagination
        ? sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)
        : sortedRows,
    [paginated, manualPagination, sortedRows, currentPage, pageSize],
  );

  /* =========================
     SELECTION & EXPANSION
     ========================= */

  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys]);
  const expandedSet = useMemo(() => new Set(expandedKeys), [expandedKeys]);

  const canSelect = (row: TableRow<T>) =>
    !isRowSelectable || isRowSelectable(row.original, row.index);
  const canExpand = (row: TableRow<T>) =>
    expandable && (!isRowExpandable || isRowExpandable(row.original, row.index));
  const isExpanded = (row: TableRow<T>) => canExpand(row) && expandedSet.has(row.key);

  const selectablePageKeys = pageRows.filter(canSelect).map((row) => row.key);
  const selectedOnPage = selectablePageKeys.filter((key) => selectedSet.has(key));
  const allOnPageSelected =
    selectablePageKeys.length > 0 &&
    selectedOnPage.length === selectablePageKeys.length;
  const someOnPageSelected = selectedOnPage.length > 0 && !allOnPageSelected;

  function toggleRowSelected(row: TableRow<T>, selected: boolean) {
    if (!canSelect(row)) return;
    if (selectionMode === "single") {
      setSelectedKeys(selected ? [row.key] : []);
      return;
    }
    setSelectedKeys((keys) =>
      selected
        ? keys.includes(row.key) ? keys : [...keys, row.key]
        : keys.filter((key) => key !== row.key),
    );
  }

  function toggleAllOnPage(selected: boolean) {
    const pageKeys = new Set(selectablePageKeys);
    setSelectedKeys((keys) =>
      selected
        ? [...keys, ...selectablePageKeys.filter((key) => !keys.includes(key))]
        : keys.filter((key) => !pageKeys.has(key)),
    );
  }

  function toggleRowExpanded(row: TableRow<T>) {
    setExpandedKeys((keys) =>
      keys.includes(row.key)
        ? keys.filter((key) => key !== row.key)
        : [...keys, row.key],
    );
  }

  /* =========================
     SEARCH, FILTERS, SORT, PAGES
     ========================= */

  function resetPage() {
    if (paginated && currentPage !== 1) setPage(1);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    resetPage();
  }

  function handleFilterChange(columnId: string, value: string) {
    setFilters((previous) => ({ ...previous, [columnId]: value }));
    resetPage();
  }

  function handleSort(column: TableColumn<T>, additive: boolean) {
    setSort((previous) => toggleSort(previous, column, multiSort && additive));
    resetPage();
  }

  function handlePageSizeChange(nextSize: number) {
    setPageSize(nextSize);
    // Keep the first visible row on screen.
    const firstRow = (currentPage - 1) * pageSize;
    setPage(Math.floor(firstRow / nextSize) + 1);
  }

  function handleToggleColumn(columnId: string, visible: boolean) {
    setVisibility((previous) => ({ ...previous, [columnId]: visible }));
  }

  function handleMoveColumn(columnId: string, offset: -1 | 1) {
    const ids = orderedColumns.map((column) => column.id);
    const from = ids.indexOf(columnId);
    const to = from + offset;
    if (from === -1 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    setOrder(ids);
  }

  /* =========================
     EDITING
     ========================= */

  const [editing, setEditing] = useState<EditingCell | null>(null);
  const [draft, setDraft] = useState<unknown>(undefined);
  const [editError, setEditError] = useState<string>();
  // Guards against a second commit (e.g. blur right after Enter).
  const editingRef = useRef<EditingCell | null>(null);

  const editButtonId = (key: TableRowKey, columnId: string) =>
    `${tableId}-edit-${toDomId(key)}-${toDomId(columnId)}`;

  function canEditCell(row: TableRow<T>, column: TableColumn<T>) {
    if (!column.editable) return false;
    // A computed value can't be written back without `setValue`.
    if (typeof column.accessor === "function" && !column.setValue) return false;
    if (!column.renderEditor && !isPlainValue(getCellValue(column, row.original, row.index))) {
      return false;
    }
    return typeof column.editable === "function"
      ? column.editable(row.original, row.index)
      : true;
  }

  function isEditingCell(row: TableRow<T>, column: TableColumn<T>) {
    return editing?.rowKey === row.key && editing.columnId === column.id;
  }

  function isNumericEditor(row: TableRow<T>, column: TableColumn<T>) {
    return column.editorType
      ? column.editorType === "number"
      : typeof getCellValue(column, row.original, row.index) === "number";
  }

  function startEdit(row: TableRow<T>, column: TableColumn<T>) {
    if (!canEditCell(row, column)) return;
    const cell = { rowKey: row.key, columnId: column.id };
    const value = getCellValue(column, row.original, row.index);
    editingRef.current = cell;
    setEditing(cell);
    // The built-in input edits text; numbers are parsed back on save.
    setDraft(column.renderEditor ? value : value == null ? "" : String(value));
    setEditError(undefined);
  }

  function finishEdit(row: TableRow<T>, column: TableColumn<T>, refocus: boolean) {
    editingRef.current = null;
    setEditing(null);
    setEditError(undefined);
    if (refocus) {
      // Put keyboard focus back on the cell's edit button.
      const id = editButtonId(row.key, column.id);
      requestAnimationFrame(() => document.getElementById(id)?.focus());
    }
  }

  function cancelEdit(row: TableRow<T>, column: TableColumn<T>, refocus = false) {
    if (!editingRef.current) return;
    finishEdit(row, column, refocus);
  }

  function commitEdit(
    row: TableRow<T>,
    column: TableColumn<T>,
    value: unknown = draft,
    refocus = false,
  ) {
    if (!editingRef.current) return;
    const previousValue = getCellValue(column, row.original, row.index);

    let nextValue = value;
    if (!column.renderEditor && isNumericEditor(row, column)) {
      const text = String(value ?? "").trim();
      nextValue = text === "" ? null : Number(text);
      if (Number.isNaN(nextValue)) {
        setEditError(labels.invalidNumber);
        return;
      }
    }

    const message = column.validate?.(nextValue, row.original);
    if (message) {
      setEditError(message);
      return;
    }

    finishEdit(row, column, refocus);
    if (Object.is(nextValue, previousValue)) return;

    const key = (column.accessor ?? column.id) as keyof T;
    const updated = column.setValue
      ? column.setValue(row.original, nextValue)
      : ({ ...row.original, [key]: nextValue } as T);
    const nextData = rowData.map((item, index) => (index === row.index ? updated : item));

    setRowData(nextData);
    onCellEdit?.({
      row: updated,
      previousRow: row.original,
      rowKey: row.key,
      rowIndex: row.index,
      columnId: column.id,
      value: nextValue,
      previousValue,
    });
    onDataChange?.(nextData);
  }

  function renderEditor(row: TableRow<T>, column: TableColumn<T>) {
    const label = labels.editCell(getColumnLabel(column));
    const errorId = `${editButtonId(row.key, column.id)}-error`;

    if (column.renderEditor) {
      const props: TableEditorProps<T> = {
        value: draft,
        onChange: setDraft,
        onCommit: (value) => commitEdit(row, column, value === undefined ? draft : value),
        onCancel: () => cancelEdit(row, column, true),
        row: row.original,
        column,
        label,
        error: editError,
      };
      return <div className={styles.editor}>{column.renderEditor(props)}</div>;
    }

    return (
      <div className={styles.editor}>
        <input
          // Focus the editor as soon as it opens.
          autoFocus
          className={cx(styles.editorInput, editError && styles.editorInputInvalid)}
          type={isNumericEditor(row, column) ? "number" : "text"}
          value={String(draft ?? "")}
          aria-label={label}
          aria-invalid={editError ? true : undefined}
          aria-describedby={editError ? errorId : undefined}
          onChange={(event) => {
            setDraft(event.target.value);
            setEditError(undefined);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitEdit(row, column, draft, true);
            } else if (event.key === "Escape") {
              event.preventDefault();
              cancelEdit(row, column, true);
            }
          }}
          onBlur={() => commitEdit(row, column)}
        />
        {editError && (
          <span id={errorId} className={styles.editorError} role="alert">
            {editError}
          </span>
        )}
      </div>
    );
  }

  /* =========================
     ROW REORDERING
     ========================= */

  const hasActiveFilters = Object.values(filters).some((value) => value.trim() !== "");
  // Moving rows only makes sense when the table shows the real `data` order.
  const canReorder =
    reorderableRows && sort.length === 0 && search.trim() === "" && !hasActiveFilters;

  const [armedRowKey, setArmedRowKey] = useState<TableRowKey | null>(null);
  const [draggingKey, setDraggingKey] = useState<TableRowKey | null>(null);
  const [dropTarget, setDropTarget] = useState<DropTarget | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [focusHandleKey, setFocusHandleKey] = useState<TableRowKey | null>(null);

  const handleId = (key: TableRowKey) => `${tableId}-handle-${toDomId(key)}`;
  const reorderHintId = `${tableId}-reorder-hint`;

  // After a keyboard move, keep focus on the moved row's handle.
  useEffect(() => {
    if (focusHandleKey == null) return;
    document.getElementById(handleId(focusHandleKey))?.focus();
    setFocusHandleKey(null);
  });

  // A press on a handle that never turns into a drag disarms the row.
  useEffect(() => {
    if (armedRowKey == null) return;
    const disarm = () => setArmedRowKey(null);
    window.addEventListener("pointerup", disarm);
    return () => window.removeEventListener("pointerup", disarm);
  }, [armedRowKey]);

  function moveRow(fromIndex: number, toIndex: number, focus: boolean) {
    if (toIndex < 0 || toIndex >= rowData.length || fromIndex === toIndex) return;

    const nextData = [...rowData];
    const [moved] = nextData.splice(fromIndex, 1);
    nextData.splice(toIndex, 0, moved);
    const movedKey = getRowKey(moved, toIndex, rowKey);

    setRowData(nextData);
    setAnnouncement(labels.rowMoved(toIndex + 1, nextData.length));
    onRowReorder?.({ rowKey: movedKey, fromIndex, toIndex, data: nextData });
    onDataChange?.(nextData);

    // Follow the row to its new page.
    if (paginated && !manualPagination) {
      const nextPage = Math.floor(toIndex / pageSize) + 1;
      if (nextPage !== currentPage) setPage(nextPage);
    }
    if (focus) setFocusHandleKey(movedKey);
  }

  function handleHandleKeyDown(event: KeyboardEvent<HTMLButtonElement>, row: TableRow<T>) {
    if (!canReorder) return;
    const offset = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    if (offset === 0) return;
    event.preventDefault();
    moveRow(row.index, row.index + offset, true);
  }

  function handleDragStart(event: DragEvent<HTMLTableRowElement>, row: TableRow<T>) {
    if (!canReorder || armedRowKey !== row.key) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(row.key));
    setDraggingKey(row.key);
  }

  function handleDragOver(event: DragEvent<HTMLTableRowElement>, row: TableRow<T>) {
    if (draggingKey == null) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    const rect = event.currentTarget.getBoundingClientRect();
    const position = event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    if (dropTarget?.rowKey !== row.key || dropTarget.position !== position) {
      setDropTarget({ rowKey: row.key, position });
    }
  }

  function handleDrop(event: DragEvent<HTMLTableRowElement>, row: TableRow<T>) {
    if (draggingKey == null) return;
    event.preventDefault();
    const fromIndex = allRows.findIndex((item) => item.key === draggingKey);
    const position = dropTarget?.rowKey === row.key ? dropTarget.position : "after";
    let toIndex = position === "after" ? row.index + 1 : row.index;
    if (fromIndex < toIndex) toIndex -= 1;
    if (fromIndex !== -1) moveRow(fromIndex, toIndex, false);
    handleDragEnd();
  }

  function handleDragEnd() {
    setDraggingKey(null);
    setDropTarget(null);
    setArmedRowKey(null);
  }

  /* =========================
     LAYOUT: MEASURING, STICKY, RESIZING
     ========================= */

  const scrollRef = useRef<HTMLDivElement>(null);
  const headerCellRefs = useRef(new Map<string, HTMLTableCellElement>());
  const [measured, setMeasured] = useState<Record<string, number>>({});
  const [viewportWidth, setViewportWidth] = useState<number>();

  const hasSticky = displayColumns.some((column) => column.sticky);
  const layoutKey = [...controlIds, ...displayColumns.map((column) => column.id)].join("|");

  function headerCellRef(columnId: string) {
    return (element: HTMLTableCellElement | null) => {
      if (!element) return;
      headerCellRefs.current.set(columnId, element);
      return () => {
        headerCellRefs.current.delete(columnId);
      };
    };
  }

  // Track the visible width (for full-width states) and, with sticky
  // columns, the header cell widths that drive sticky offsets.
  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      setViewportWidth(scroller.clientWidth);
      if (!hasSticky) return;

      const next: Record<string, number> = {};
      headerCellRefs.current.forEach((cell, columnId) => {
        next[columnId] = cell.getBoundingClientRect().width;
      });
      setMeasured((previous) => {
        const keys = Object.keys(next);
        const unchanged =
          keys.length === Object.keys(previous).length &&
          keys.every((key) => previous[key] === next[key]);
        return unchanged ? previous : next;
      });
    });

    observer.observe(scroller);
    if (hasSticky) {
      headerCellRefs.current.forEach((cell) => observer.observe(cell));
    }
    return () => observer.disconnect();
  }, [hasSticky, layoutKey]);

  const stickySides = new Map<string, StickySide>();
  const hasStickyLeft = displayColumns.some((column) => column.sticky === "left");
  for (const controlId of controlIds) {
    if (hasStickyLeft) stickySides.set(controlId, "left");
  }
  for (const column of displayColumns) {
    if (column.sticky) stickySides.set(column.id, column.sticky);
  }

  const layoutIds = [...controlIds, ...displayColumns.map((column) => column.id)];
  const widthOf = (columnId: string) =>
    sizing[columnId] ??
    measured[columnId] ??
    (controlIds.includes(columnId) ? CONTROL_COLUMN_WIDTH : 0);

  const stickyOffsets = new Map<string, number>();
  let lastLeftId: string | undefined;
  let firstRightId: string | undefined;
  let offset = 0;
  for (const columnId of layoutIds) {
    if (stickySides.get(columnId) !== "left") continue;
    stickyOffsets.set(columnId, offset);
    offset += widthOf(columnId);
    lastLeftId = columnId;
  }
  offset = 0;
  for (const columnId of [...layoutIds].reverse()) {
    if (stickySides.get(columnId) !== "right") continue;
    stickyOffsets.set(columnId, offset);
    offset += widthOf(columnId);
    firstRightId = columnId;
  }

  /** Sticky class + offset for a cell that starts at `firstId` and ends at `lastId`. */
  function stickyCell(firstId: string, lastId = firstId) {
    const side = stickySides.get(firstId);
    if (!side || stickySides.get(lastId) !== side) return {};
    const anchor = side === "left" ? firstId : lastId;
    return {
      className: cx(
        styles.sticky,
        side === "left" ? styles.stickyLeft : styles.stickyRight,
        (side === "left" ? lastId === lastLeftId : firstId === firstRightId) &&
          styles.stickyEdge,
      ),
      style: { [side]: stickyOffsets.get(anchor) ?? 0 } as CSSProperties,
    };
  }

  const isResizable = (column: TableColumn<T>) =>
    column.resizable ?? resizableColumns;
  const fixedLayout = Object.keys(sizing).length > 0;

  // Resizing switches to a fixed layout, so every column needs a width:
  // freeze the current rendered widths before changing one.
  function frozenSizing(): TableColumnSizing {
    const frozen: TableColumnSizing = { ...sizing };
    for (const column of displayColumns) {
      if (frozen[column.id] == null) {
        const cell = headerCellRefs.current.get(column.id);
        frozen[column.id] = Math.round(
          cell?.getBoundingClientRect().width ?? MIN_COLUMN_WIDTH,
        );
      }
    }
    return frozen;
  }

  function clampWidth(column: TableColumn<T>, width: number) {
    const min = column.minWidth ?? MIN_COLUMN_WIDTH;
    const max = column.maxWidth ?? Number.POSITIVE_INFINITY;
    return Math.round(Math.min(Math.max(width, min), max));
  }

  function handleResizeStart(
    event: PointerEvent<HTMLDivElement>,
    column: TableColumn<T>,
  ) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();

    const handle = event.currentTarget;
    const startX = event.clientX;
    const base = frozenSizing();
    const startWidth = base[column.id];

    handle.setPointerCapture(event.pointerId);
    setResizingId(column.id);
    setSizing(base);

    const handleMove = (moveEvent: globalThis.PointerEvent) => {
      setSizing({
        ...base,
        [column.id]: clampWidth(column, startWidth + moveEvent.clientX - startX),
      });
    };
    const handleEnd = () => {
      handle.removeEventListener("pointermove", handleMove);
      handle.removeEventListener("pointerup", handleEnd);
      handle.removeEventListener("pointercancel", handleEnd);
      setResizingId(null);
    };

    handle.addEventListener("pointermove", handleMove);
    handle.addEventListener("pointerup", handleEnd);
    handle.addEventListener("pointercancel", handleEnd);
  }

  function handleResizeKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    column: TableColumn<T>,
  ) {
    const step =
      event.key === "ArrowRight" ? KEYBOARD_RESIZE_STEP
      : event.key === "ArrowLeft" ? -KEYBOARD_RESIZE_STEP
      : 0;
    if (step === 0) return;
    event.preventDefault();
    const base = frozenSizing();
    setSizing({ ...base, [column.id]: clampWidth(column, base[column.id] + step) });
  }

  const tableWidth = fixedLayout
    ? layoutIds.reduce(
        (total, columnId) =>
          total +
          (sizing[columnId] ??
            (controlIds.includes(columnId)
              ? CONTROL_COLUMN_WIDTH
              : (measured[columnId] ?? MIN_COLUMN_WIDTH * 2))),
        0,
      )
    : undefined;

  /* =========================
     CELLS
     ========================= */

  const descriptionId = (columnId: string) => `${tableId}-desc-${toDomId(columnId)}`;

  /** Width that `truncate` cuts content at, as a CSS variable for cell and header. */
  function truncateStyle(column: TableColumn<T>) {
    if (!column.truncate) return undefined;
    return {
      "--table-truncate-width": toCssLength(column.maxWidth ?? DEFAULT_TRUNCATE_WIDTH),
    } as CSSProperties;
  }

  function renderCellContent(column: TableColumn<T>, context: TableCellContext<T>) {
    let content = column.cell ? column.cell(context) : renderDefaultCell(context.value);
    const empty = isEmptyContent(content);
    if (empty) content = column.emptyValue ?? emptyCellValue ?? content;

    // The empty placeholder is never linked.
    const href = empty ? undefined : column.href?.(context.row, context.rowIndex);
    if (href) {
      const newTab = column.linkTarget === "_blank";
      content = (
        <a
          className={styles.link}
          href={href}
          target={newTab ? "_blank" : undefined}
          rel={newTab ? "noopener noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }
    if (!column.truncate) return content;

    const title =
      typeof content === "string" || typeof content === "number"
        ? String(content)
        : column.getSearchValue?.(context.row) ?? (valueToText(context.value) || undefined);
    return (
      <span className={styles.truncate} title={title}>
        {content}
      </span>
    );
  }

  function cellContext(
    row: TableRow<T>,
    pageIndex: number,
    column: TableColumn<T>,
  ): TableCellContext<T> {
    return {
      row: row.original,
      rowKey: row.key,
      rowIndex: row.index,
      pageIndex,
      value: getCellValue(column, row.original, row.index),
      column,
      isSelected: selectedSet.has(row.key),
      isExpanded: isExpanded(row),
    };
  }

  const hasSpans = displayColumns.some((column) => column.colSpan || column.rowSpan);
  const spans = hasSpans
    ? computeSpans(
        pageRows.length,
        displayColumns.length,
        (r, c) => {
          const column = displayColumns[c];
          const context = cellContext(pageRows[r], r, column);
          return {
            colSpan: column.colSpan?.(context) ?? 1,
            rowSpan: column.rowSpan?.(context) ?? 1,
          };
        },
        (r) => isExpanded(pageRows[r]),
      )
    : null;

  function renderHeaderContent(column: TableColumn<T>, sortIndex?: number) {
    const rule = sortIndex ? sort[sortIndex - 1] : undefined;
    if (typeof column.header === "function") {
      return column.header({
        column,
        sortDirection: rule?.direction ?? false,
        sortIndex,
      });
    }
    return column.header ?? column.id;
  }

  function renderHeaderCell(cell: HeaderCell<T>) {
    const { column } = cell;
    const align =
      column.headerAlign ?? column.align ?? (cell.kind === "group" ? "center" : "left");
    const sticky = stickyCell(cell.leaves[0].id, cell.leaves[cell.leaves.length - 1].id);
    const headerWrap = column.headerWrap ?? wrapHeaders;

    if (cell.kind === "description") {
      // Not a header of its own: the column header points to it as its description.
      return (
        <td
          key={cell.key}
          id={descriptionId(column.id)}
          className={cx(
            styles.th,
            styles.descriptionTh,
            ALIGN_CLASS[align],
            headerWrap && styles.headerWrap,
            sticky.className,
          )}
          style={{ ...truncateStyle(column), ...sticky.style }}
        >
          <span className={cx(column.truncate && styles.truncateHeader)}>
            {column.description}
          </span>
        </td>
      );
    }

    if (cell.kind === "group") {
      return (
        <th
          key={cell.key}
          scope="colgroup"
          colSpan={cell.colSpan}
          rowSpan={cell.rowSpan}
          className={cx(
            styles.th,
            styles.groupTh,
            ALIGN_CLASS[align],
            headerWrap && styles.headerWrap,
            sticky.className,
            column.headerClassName,
          )}
          style={sticky.style}
        >
          {renderHeaderContent(column)}
        </th>
      );
    }

    const columnSortable = !column.columns && (column.sortable ?? sortable);
    const sortPosition = sort.findIndex((rule) => rule.columnId === column.id);
    const sortIndex = sortPosition === -1 ? undefined : sortPosition + 1;
    const direction = sortIndex ? sort[sortPosition].direction : undefined;
    const label = getColumnLabel(column);
    const resizable = isResizable(column);
    const width = sizing[column.id];

    const content = renderHeaderContent(column, sortIndex);
    const labelNode = (
      <span
        className={cx(styles.headerLabel, column.truncate && !headerWrap && styles.truncateHeader)}
        title={column.truncate ? label : undefined}
      >
        {content}
      </span>
    );

    return (
      <th
        key={cell.key}
        ref={headerCellRef(column.id)}
        scope="col"
        rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
        aria-describedby={column.description != null ? descriptionId(column.id) : undefined}
        aria-sort={
          columnSortable && sortIndex === 1
            ? direction === "asc" ? "ascending" : "descending"
            : undefined
        }
        {...column.headerProps}
        className={cx(
          styles.th,
          ALIGN_CLASS[align],
          columnSortable && styles.sortableTh,
          resizable && styles.resizableTh,
          headerWrap && styles.headerWrap,
          sticky.className,
          column.headerClassName,
          column.headerProps?.className,
        )}
        style={{
          // Auto layout treats widths as preferences that shrink to fit the
          // container; a matching min-width keeps them when the table scrolls.
          ...(width == null && {
            width: toCssLength(column.width),
            minWidth: toCssLength(column.minWidth ?? column.width),
            maxWidth: toCssLength(column.maxWidth),
          }),
          ...truncateStyle(column),
          ...sticky.style,
          ...column.headerProps?.style,
        }}
      >
        {columnSortable ? (
          <button
            type="button"
            className={styles.sortButton}
            onClick={(event) => handleSort(column, event.shiftKey)}
          >
            {labelNode}
            <span className={styles.sortIcon} data-direction={direction} aria-hidden="true">
              <SortIcon />
            </span>
            {multiSort && sortIndex && sort.length > 1 && (
              <span className={styles.sortIndex} aria-hidden="true">
                {sortIndex}
              </span>
            )}
            {direction && (
              <span className={styles.srOnly}>
                {", "}
                {direction === "asc" ? labels.sortAscending : labels.sortDescending}
                {sort.length > 1 && `, ${labels.sortPriority(sortIndex!)}`}
              </span>
            )}
          </button>
        ) : (
          labelNode
        )}

        {resizable && (
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label={labels.resizeColumn(label)}
            aria-valuenow={width ?? (Math.round(measured[column.id] ?? 0) || undefined)}
            aria-valuemin={column.minWidth ?? MIN_COLUMN_WIDTH}
            aria-valuemax={column.maxWidth}
            tabIndex={0}
            className={cx(
              styles.resizeHandle,
              resizingId === column.id && styles.resizeHandleActive,
            )}
            onPointerDown={(event) => handleResizeStart(event, column)}
            onKeyDown={(event) => handleResizeKeyDown(event, column)}
            onClick={(event) => event.stopPropagation()}
          />
        )}
      </th>
    );
  }

  function renderControlHeader(controlId: string) {
    const sticky = stickyCell(controlId);
    const common = {
      ref: headerCellRef(controlId),
      rowSpan: headerRows.length,
      style: sticky.style,
    };

    if (controlId === SELECT_COLUMN) {
      return (
        <th key={controlId} {...common} scope="col" className={cx(styles.th, styles.controlCell, sticky.className)}>
          {selectionMode === "multiple" ? (
            <input
              type="checkbox"
              className={styles.checkbox}
              aria-label={labels.selectAll}
              checked={allOnPageSelected}
              disabled={selectablePageKeys.length === 0}
              ref={(input) => {
                if (input) input.indeterminate = someOnPageSelected;
              }}
              onChange={(event) => toggleAllOnPage(event.target.checked)}
            />
          ) : (
            <span className={styles.srOnly}>{labels.selection}</span>
          )}
        </th>
      );
    }

    return (
      <th key={controlId} {...common} scope="col" className={cx(styles.th, styles.controlCell, sticky.className)}>
        <span className={styles.srOnly}>
          {controlId === REORDER_COLUMN ? labels.reorder : labels.expandRow}
        </span>
      </th>
    );
  }

  function renderFilterRow() {
    if (!showColumnFilters || !displayColumns.some((column) => column.filterable)) {
      return null;
    }

    return (
      <tr className={styles.filterRow}>
        {controlIds.map((controlId) => {
          const sticky = stickyCell(controlId);
          return (
            <td
              key={controlId}
              className={cx(styles.td, styles.controlCell, sticky.className)}
              style={sticky.style}
            />
          );
        })}
        {displayColumns.map((column) => {
          const sticky = stickyCell(column.id);
          const value = filters[column.id] ?? "";
          const label = labels.filterColumn(getColumnLabel(column));
          const setValue = (next: string) => handleFilterChange(column.id, next);

          return (
            <td
              key={column.id}
              className={cx(styles.td, styles.filterCell, sticky.className)}
              style={sticky.style}
            >
              {column.filterable &&
                (column.renderFilter ? (
                  column.renderFilter({ column, value, setValue, label })
                ) : (
                  <Input
                    size="small"
                    fullWidth
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder={column.filterPlaceholder ?? "Filter…"}
                    aria-label={label}
                  />
                ))}
            </td>
          );
        })}
      </tr>
    );
  }

  function handleRowClick(event: MouseEvent<HTMLTableRowElement>, row: TableRow<T>) {
    if (!onRowClick) return;
    const target = event.target as HTMLElement;
    const interactive = target.closest(INTERACTIVE_SELECTOR);
    if (interactive && event.currentTarget.contains(interactive)) return;
    onRowClick(row.original, row.index);
  }

  function handleRowKeyDown(event: KeyboardEvent<HTMLTableRowElement>, row: TableRow<T>) {
    if (!onRowClick || event.target !== event.currentTarget) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick(row.original, row.index);
    }
  }

  function renderRow(row: TableRow<T>, pageIndex: number) {
    const selected = selectedSet.has(row.key);
    const expanded = isExpanded(row);
    const detailId = `${tableId}-detail-${toDomId(row.key)}`;
    const rowProps = getRowProps?.(row.original, row.index) ?? {};
    const customClass =
      typeof rowClassName === "function"
        ? rowClassName(row.original, row.index)
        : rowClassName;

    const cells: ReactNode[] = [];

    if (reorderableRows) {
      const sticky = stickyCell(REORDER_COLUMN);
      cells.push(
        <td
          key={REORDER_COLUMN}
          className={cx(styles.td, styles.controlCell, sticky.className)}
          style={sticky.style}
        >
          <button
            type="button"
            id={handleId(row.key)}
            className={styles.dragHandle}
            aria-label={labels.moveRow(row.key)}
            aria-describedby={reorderHintId}
            // aria-disabled keeps the button focusable so its title explains why.
            aria-disabled={canReorder ? undefined : true}
            title={canReorder ? undefined : labels.reorderUnavailable}
            onPointerDown={() => canReorder && setArmedRowKey(row.key)}
            onKeyDown={(event) => handleHandleKeyDown(event, row)}
          >
            <GripIcon />
          </button>
        </td>,
      );
    }

    if (selectionEnabled) {
      const sticky = stickyCell(SELECT_COLUMN);
      const disabled = !canSelect(row);
      cells.push(
        <td
          key={SELECT_COLUMN}
          className={cx(styles.td, styles.controlCell, sticky.className)}
          style={sticky.style}
        >
          <input
            type={selectionMode === "single" ? "radio" : "checkbox"}
            name={selectionMode === "single" ? `${tableId}-selection` : undefined}
            className={cx(
              styles.checkbox,
              selectionMode === "single" && styles.radio,
            )}
            aria-label={labels.selectRow(row.key)}
            checked={selected}
            disabled={disabled}
            onChange={(event) => toggleRowSelected(row, event.target.checked)}
            onClick={(event) => {
              // Radios can't be unchecked natively; a second click clears.
              if (selectionMode === "single" && selected) {
                event.preventDefault();
                toggleRowSelected(row, false);
              }
            }}
          />
        </td>,
      );
    }

    if (expandable) {
      const sticky = stickyCell(EXPAND_COLUMN);
      cells.push(
        <td
          key={EXPAND_COLUMN}
          className={cx(styles.td, styles.controlCell, sticky.className)}
          style={sticky.style}
        >
          {canExpand(row) && (
            <button
              type="button"
              className={styles.expandButton}
              aria-expanded={expanded}
              aria-controls={expanded ? detailId : undefined}
              aria-label={expanded ? labels.collapseRow : labels.expandRow}
              onClick={() => toggleRowExpanded(row)}
            >
              <span className={cx(styles.expandIcon, expanded && styles.expandIconOpen)}>
                <Icon name="chevron-right" size={16} />
              </span>
            </button>
          )}
        </td>,
      );
    }

    displayColumns.forEach((column, columnIndex) => {
      const span = spans ? spans[pageIndex].get(columnIndex) : { colSpan: 1, rowSpan: 1 };
      if (!span) return;

      const context = cellContext(row, pageIndex, column);
      const lastColumn = displayColumns[columnIndex + span.colSpan - 1];
      const sticky = stickyCell(column.id, lastColumn.id);
      const extra = column.cellProps?.(context) ?? {};
      const CellTag = column.rowHeader ? "th" : "td";
      const editable = canEditCell(row, column);
      const editingThis = editable && isEditingCell(row, column);

      cells.push(
        <CellTag
          key={column.id}
          scope={column.rowHeader ? "row" : undefined}
          colSpan={span.colSpan > 1 ? span.colSpan : undefined}
          rowSpan={span.rowSpan > 1 ? span.rowSpan : undefined}
          {...extra}
          className={cx(
            styles.td,
            column.rowHeader && styles.rowHeader,
            ALIGN_CLASS[column.align ?? "left"],
            column.wrap && styles.wrap,
            span.rowSpan > 1 && styles.spanned,
            editable && styles.editableCell,
            editingThis && styles.editingCell,
            sticky.className,
            column.className,
            extra.className,
          )}
          style={{ ...truncateStyle(column), ...sticky.style, ...extra.style }}
          onDoubleClick={(event) => {
            extra.onDoubleClick?.(event as MouseEvent<HTMLTableCellElement>);
            if (editable && !editingThis) startEdit(row, column);
          }}
        >
          {editingThis ? (
            renderEditor(row, column)
          ) : editable ? (
            <span className={styles.editableContent}>
              <span className={styles.editableValue}>{renderCellContent(column, context)}</span>
              <button
                type="button"
                id={editButtonId(row.key, column.id)}
                className={styles.editButton}
                aria-label={labels.editCell(getColumnLabel(column))}
                onClick={() => startEdit(row, column)}
              >
                <Icon name="edit" size={14} />
              </button>
            </span>
          ) : (
            renderCellContent(column, context)
          )}
        </CellTag>,
      );
    });

    return [
      <tr
        key={row.key}
        tabIndex={onRowClick ? 0 : undefined}
        data-selected={selected || undefined}
        data-expanded={expanded || undefined}
        // Only a press on the drag handle makes the row draggable, so text in
        // the cells can still be selected.
        draggable={canReorder && armedRowKey === row.key ? true : undefined}
        data-dragging={draggingKey === row.key || undefined}
        data-drop={dropTarget?.rowKey === row.key ? dropTarget.position : undefined}
        onDragStart={(event) => handleDragStart(event, row)}
        onDragOver={(event) => handleDragOver(event, row)}
        onDrop={(event) => handleDrop(event, row)}
        onDragEnd={handleDragEnd}
        {...rowProps}
        className={cx(
          styles.tr,
          selected && styles.selected,
          onRowClick && styles.clickable,
          customClass,
          rowProps.className,
        )}
        onClick={(event) => {
          rowProps.onClick?.(event);
          handleRowClick(event, row);
        }}
        onKeyDown={(event) => {
          rowProps.onKeyDown?.(event);
          handleRowKeyDown(event, row);
        }}
      >
        {cells}
      </tr>,
      expanded && (
        <tr key={`${row.key}-detail`} id={detailId} className={styles.detailRow}>
          <td colSpan={totalColumnCount} className={styles.detailCell}>
            <div className={styles.viewportContent}>
              {renderExpandedRow!(row.original, row.index)}
            </div>
          </td>
        </tr>
      ),
    ];
  }

  function renderStateRow(content: ReactNode, tone?: "error") {
    return (
      <tr className={styles.stateRow}>
        <td colSpan={totalColumnCount} className={styles.stateCell}>
          <div
            className={cx(styles.viewportContent, styles.state, tone === "error" && styles.stateError)}
            role={tone === "error" ? "alert" : undefined}
          >
            {content}
          </div>
        </td>
      </tr>
    );
  }

  function renderSkeletonRows() {
    return Array.from({ length: loadingRows }, (_, r) => (
      <tr key={`skeleton-${r}`} className={styles.tr} aria-hidden="true">
        {layoutIds.map((columnId, c) => {
          const sticky = stickyCell(columnId);
          const isControl = controlIds.includes(columnId);
          return (
            <td
              key={columnId}
              className={cx(styles.td, isControl && styles.controlCell, sticky.className)}
              style={sticky.style}
            >
              <span
                className={cx(styles.skeleton, isControl && styles.skeletonControl)}
                style={isControl ? undefined : { width: `${45 + ((r * 7 + c * 13) % 45)}%` }}
              />
            </td>
          );
        })}
      </tr>
    ));
  }

  function renderBody() {
    if (error) {
      return renderStateRow(
        <>
          <Icon name="error" size={24} />
          <span>{error === true ? labels.error : error}</span>
          {onRetry && (
            <Button variant="outline" size="small" onClick={onRetry}>
              {labels.retry}
            </Button>
          )}
        </>,
        "error",
      );
    }

    if (loading && pageRows.length === 0) return renderSkeletonRows();

    if (pageRows.length === 0) {
      return renderStateRow(
        rowData.length === 0 ? (emptyState ?? labels.empty) : (noResultsState ?? labels.noResults),
      );
    }

    return pageRows.flatMap((row, pageIndex) => renderRow(row, pageIndex));
  }

  /* =========================
     FOOTER
     ========================= */

  const hasColumnFooters = displayColumns.some((column) => column.footer != null);
  const footerRows = useMemo(
    () => (hasColumnFooters ? sortedRows.map((row) => row.original) : []),
    [hasColumnFooters, sortedRows],
  );

  function renderFooter() {
    if (!hasColumnFooters && footer == null) return null;
    const pageData = pageRows.map((row) => row.original);

    return (
      <tfoot className={styles.tfoot}>
        {hasColumnFooters && (
          <tr>
            {controlIds.map((controlId) => {
              const sticky = stickyCell(controlId);
              return (
                <td
                  key={controlId}
                  className={cx(styles.td, styles.controlCell, sticky.className)}
                  style={sticky.style}
                />
              );
            })}
            {displayColumns.map((column) => {
              const sticky = stickyCell(column.id);
              return (
                <td
                  key={column.id}
                  className={cx(styles.td, ALIGN_CLASS[column.align ?? "left"], sticky.className)}
                  style={sticky.style}
                >
                  {typeof column.footer === "function"
                    ? column.footer({ column, rows: footerRows, pageRows: pageData })
                    : column.footer}
                </td>
              );
            })}
          </tr>
        )}
        {footer != null && (
          <tr>
            <td colSpan={totalColumnCount} className={styles.footerCell}>
              <div className={styles.viewportContent}>{footer}</div>
            </td>
          </tr>
        )}
      </tfoot>
    );
  }

  /* =========================
     RENDER
     ========================= */

  /* =========================
     EXPORT
     ========================= */

  const canExport = Boolean(exportable) || onExport != null;

  // Exports every searched/filtered/sorted row (not just the page) and the
  // visible columns in their current order.
  function handleExport() {
    const exportColumns = displayColumns.filter((column) => column.exportable !== false);
    if (onExport) {
      onExport(sortedRows.map((row) => row.original), exportColumns);
      return;
    }
    const fileName =
      (typeof exportable === "object" && exportable.fileName) || DEFAULT_EXPORT_FILE;
    downloadCsv(rowsToCsv(sortedRows, exportColumns, columnPaths), fileName);
  }

  const showToolbar =
    searchable || showColumnSettings || canExport || toolbar != null;
  const regionLabelProps = caption
    ? { "aria-labelledby": captionId }
    : ariaLabel
      ? { "aria-label": ariaLabel }
      : null;

  const rootClasses = cx(
    styles.root,
    styles[size],
    compact && styles.compact,
    bordered && styles.bordered,
    striped && styles.striped,
    hoverable && styles.hoverable,
    stickyHeader && styles.stickyHeader,
    resizingId && styles.resizing,
    className,
  );

  return (
    <div
      className={rootClasses}
      style={
        {
          ...(viewportWidth && { "--table-viewport-width": `${viewportWidth}px` }),
          ...style,
        } as CSSProperties
      }
    >
      {showToolbar && (
        <TableToolbar
          size={size}
          labels={labels}
          searchable={searchable}
          search={search}
          onSearchChange={handleSearchChange}
          showColumnSettings={showColumnSettings}
          columns={orderedColumns}
          visibility={visibility}
          onToggleColumn={handleToggleColumn}
          onMoveColumn={handleMoveColumn}
          searchPlacement={searchPlacement}
          columnSettingsTrigger={columnSettingsTrigger}
          onDownload={canExport ? handleExport : undefined}
        >
          {toolbar}
        </TableToolbar>
      )}

      <div className={styles.container}>
        <div
          ref={scrollRef}
          className={styles.scroll}
          style={{ maxHeight: toCssLength(maxHeight) }}
          {...(regionLabelProps && { role: "region", tabIndex: 0, ...regionLabelProps })}
        >
          <table
            id={tableId}
            className={cx(styles.table, fixedLayout && styles.fixed, tableClassName)}
            style={tableWidth ? { width: tableWidth } : undefined}
            aria-label={caption ? undefined : ariaLabel}
            aria-busy={loading || undefined}
          >
            {caption && (
              <caption id={captionId} className={hideCaption ? styles.srOnly : styles.caption}>
                <div className={styles.captionContent}>{caption}</div>
              </caption>
            )}

            <colgroup>
              {controlIds.map((controlId) => (
                <col key={controlId} style={{ width: CONTROL_COLUMN_WIDTH }} />
              ))}
              {displayColumns.map((column) => (
                <col
                  key={column.id}
                  style={{
                    width: sizing[column.id] ?? toCssLength(column.width),
                  }}
                />
              ))}
            </colgroup>

            <thead className={styles.thead}>
              {headerRows.map((row, level) => (
                <tr key={level}>
                  {level === 0 && controlIds.map(renderControlHeader)}
                  {row.map(renderHeaderCell)}
                </tr>
              ))}
              {renderFilterRow()}
            </thead>

            <tbody className={styles.tbody}>{renderBody()}</tbody>

            {renderFooter()}
          </table>
        </div>

        {loading && (
          <div className={cx(styles.loadingOverlay, pageRows.length === 0 && styles.loadingOverlayQuiet)} role="status">
            {pageRows.length > 0 && (
              <span className={styles.spinner}>
                <Icon name="loader" size={24} />
              </span>
            )}
            <span className={styles.srOnly}>{labels.loading}</span>
          </div>
        )}
      </div>

      {reorderableRows && (
        <>
          <span id={reorderHintId} className={styles.srOnly}>
            {labels.reorderInstructions}
          </span>
          <div className={styles.srOnly} role="status" aria-live="polite">
            {announcement}
          </div>
        </>
      )}

      {paginated && !error && (
        <TablePagination
          page={currentPage}
          pageCount={pageCount}
          pageSize={pageSize}
          pageSizeOptions={paginationOptions.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS}
          totalRows={totalRows}
          labels={labels}
          onPageChange={(next) => setPage(Math.min(Math.max(1, next), pageCount))}
          onPageSizeChange={handlePageSizeChange}
          showFirstLast={paginationOptions.showFirstLast ?? true}
          showPageSizeLabel={paginationOptions.showPageSizeLabel ?? true}
          align={paginationOptions.align ?? "between"}
        />
      )}
    </div>
  );
}
