import type {
  CSSProperties,
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

/*
 * Extension points
 * ----------------
 * The API is built around a row model (`TableRow<T>`) and per-column
 * definitions (`TableColumn<T>`), so advanced features can be layered on
 * without breaking existing props:
 *
 * - Row grouping / tree data: `TableRow` already carries `depth`; grouping can
 *   add `subRows` and a `grouping` state prop next to `sort` and `filters`.
 * - Row pinning: a `pinnedRowKeys` state prop, rendered before/after the page
 *   rows — same shape as `selectedRowKeys` / `expandedRowKeys`.
 * - Virtualization: the body only renders `TableRow` objects, so a windowed
 *   renderer can slice that list instead of the pagination step.
 * - Editable cells: `TableCellContext` is the single input to `cell`; an
 *   `editing` member can be added to it, plus an `editCell` column renderer.
 * - Drag-and-drop columns: ordering is plain `columnOrder` state; any DnD
 *   layer only has to call `onColumnOrderChange`.
 * - `meta` on columns is reserved for consumer/feature-specific data.
 */

export type TableSize = "small" | "medium" | "large";
export type TableAlign = "left" | "center" | "right";
export type TableRowKey = string | number;
export type SortDirection = "asc" | "desc";

export interface SortRule {
  columnId: string;
  direction: SortDirection;
}

/** Column id → filter value. Empty strings mean "no filter". */
export type TableFilters = Record<string, string>;
/** Column id → visible. Missing ids fall back to the column's `defaultHidden`. */
export type TableColumnVisibility = Record<string, boolean>;
/** Column id → width in px, set by column resizing. */
export type TableColumnSizing = Record<string, number>;

/** A row of the processed row model. */
export interface TableRow<T> {
  key: TableRowKey;
  original: T;
  /** Index of the row in the `data` prop. */
  index: number;
  /** Nesting depth; always 0 today, reserved for grouping and tree data. */
  depth: number;
}

export interface TableCellContext<T> {
  row: T;
  rowKey: TableRowKey;
  /** Index of the row in the `data` prop. */
  rowIndex: number;
  /** Index of the row within the rendered page. */
  pageIndex: number;
  value: unknown;
  column: TableColumn<T>;
  isSelected: boolean;
  isExpanded: boolean;
}

export interface TableHeaderContext<T> {
  column: TableColumn<T>;
  sortDirection: SortDirection | false;
  /** 1-based position in a multi-column sort, or `undefined`. */
  sortIndex?: number;
}

export interface TableFooterContext<T> {
  column: TableColumn<T>;
  /** All rows after search and filters, before pagination. */
  rows: T[];
  /** Rows on the current page. */
  pageRows: T[];
}

export interface TableFilterRenderProps<T> {
  column: TableColumn<T>;
  value: string;
  setValue: (value: string) => void;
  /** Accessible name to put on the filter control. */
  label: string;
}

export interface TableEditorProps<T> {
  /** The value being edited. */
  value: unknown;
  /** Update the value while editing. */
  onChange: (value: unknown) => void;
  /** Save. Pass a value to save that instead of the current one. */
  onCommit: (value?: unknown) => void;
  /** Discard the edit. */
  onCancel: () => void;
  row: T;
  column: TableColumn<T>;
  /** Accessible name to put on the editor control. */
  label: string;
  /** Validation message for the current value, if any. */
  error?: string;
}

/** A saved cell edit, passed to `onCellEdit`. */
export interface TableCellEdit<T> {
  /** The row after the edit. */
  row: T;
  previousRow: T;
  rowKey: TableRowKey;
  /** Index of the row in `data`. */
  rowIndex: number;
  columnId: string;
  value: unknown;
  previousValue: unknown;
}

/** A row move, passed to `onRowReorder`. */
export interface TableRowReorder<T> {
  rowKey: TableRowKey;
  /** Index in `data` before the move. */
  fromIndex: number;
  /** Index in `data` after the move. */
  toIndex: number;
  /** The data in its new order. */
  data: T[];
}

export interface TableColumn<T> {
  /** Unique, stable id. Also the default accessor when `accessor` is unset. */
  id: string;
  header?: ReactNode | ((context: TableHeaderContext<T>) => ReactNode);
  /** Plain-text name for menus and accessible labels; defaults to a string `header` or `id`. */
  label?: string;
  /** Where the cell value comes from: a key of the row or a function. */
  accessor?: keyof T | ((row: T, index: number) => unknown);
  /** Custom cell renderer. Defaults to the stringified value. */
  cell?: (context: TableCellContext<T>) => ReactNode;
  footer?: ReactNode | ((context: TableFooterContext<T>) => ReactNode);
  /** Child columns; renders a grouped header that spans its children. */
  columns?: TableColumn<T>[];
  /**
   * Secondary header text shown in a row under the header (e.g. "Name of
   * primary HCO"). With grouped columns it lines up with the sub-headers.
   */
  description?: ReactNode;

  /* Layout */
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  align?: TableAlign;
  /** Header alignment; defaults to `align`. */
  headerAlign?: TableAlign;
  /** Pins the column while scrolling horizontally. */
  sticky?: "left" | "right";
  /** Allows wrapping long content; cells don't wrap by default. */
  wrap?: boolean;
  /** Render body cells as `<th scope="row">`, naming each row for screen readers. */
  rowHeader?: boolean;
  /**
   * Cut long content (cell and header) with an ellipsis at `maxWidth`
   * (default 240px); the full text shows as a tooltip.
   */
  truncate?: boolean;
  /** Let the header text wrap onto several lines. Overrides the table's `wrapHeaders`. */
  headerWrap?: boolean;
  /** Shown when the cell is empty. Overrides the table's `emptyCellValue`. */
  emptyValue?: ReactNode;
  /**
   * Renders the cell content as a link to this URL (return `undefined` for no
   * link on that row). Works with `cell` too: its output becomes the link text.
   */
  href?: (row: T, index: number) => string | undefined;
  /** `"_blank"` opens links in a new tab (with `rel="noopener noreferrer"`). */
  linkTarget?: "_self" | "_blank";

  /* Export */
  /** Include this column in CSV export. Default `true`. */
  exportable?: boolean;
  /** Value written to the CSV. Defaults to the cell value as text. */
  exportValue?: (row: T, index: number) => string | number | boolean | null | undefined;

  /* Spanning (body cells, within the current page) */
  colSpan?: (context: TableCellContext<T>) => number;
  rowSpan?: (context: TableCellContext<T>) => number;

  /* Sorting */
  /** Overrides the table-level `sortable` for this column. */
  sortable?: boolean;
  /** Ascending comparator. Defaults to a number/date/string-aware compare. */
  sortFn?: (a: T, b: T) => number;
  /** Start with descending order on first click. */
  sortDescFirst?: boolean;

  /* Search & filtering */
  /** Include this column in the global search. Default `true`. */
  searchable?: boolean;
  /** Show a filter control for this column (requires `showColumnFilters`). */
  filterable?: boolean;
  /** Custom filter predicate. Defaults to a case-insensitive "contains". */
  filterFn?: (row: T, filterValue: string, value: unknown) => boolean;
  /** Custom filter control. Defaults to a text input. */
  renderFilter?: (props: TableFilterRenderProps<T>) => ReactNode;
  filterPlaceholder?: string;
  /** Text used for search and the default filter. Defaults to the value. */
  getSearchValue?: (row: T) => string;

  /* Visibility & sizing */
  defaultHidden?: boolean;
  /** Whether the column can be hidden from the column menu. Default `true`. */
  hideable?: boolean;
  /** Overrides the table-level `resizableColumns` for this column. */
  resizable?: boolean;

  /* Editing */
  /**
   * Lets users edit this column's cells: double-click a cell, or use its edit
   * button. Pass a function to lock some rows. Needs `setValue` when
   * `accessor` is a function.
   */
  editable?: boolean | ((row: T, index: number) => boolean);
  /** Input type of the built-in editor. Defaults to `"number"` for numeric values. */
  editorType?: "text" | "number";
  /** Custom editor (e.g. a select). Replaces the built-in input. */
  renderEditor?: (props: TableEditorProps<T>) => ReactNode;
  /** Writes an edited value into a row. Defaults to `{ ...row, [accessor ?? id]: value }`. */
  setValue?: (row: T, value: unknown) => T;
  /** Return a message to reject a value; the editor stays open and shows it. */
  validate?: (value: unknown, row: T) => string | undefined;

  /* Custom props */
  className?: string;
  headerClassName?: string;
  cellProps?: (context: TableCellContext<T>) => TdHTMLAttributes<HTMLTableCellElement>;
  headerProps?: ThHTMLAttributes<HTMLTableCellElement>;

  /** Free-form data for consumers and future features. */
  meta?: Record<string, unknown>;
}

export interface TablePaginationOptions {
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  /** Show first/last page buttons. Default `true`. */
  showFirstLast?: boolean;
  /** Show the visible "Rows per page" label. Default `true`. */
  showPageSizeLabel?: boolean;
  /**
   * `"between"`: range on the left, controls on the right (default).
   * `"center"`: range on the left, page size and pages centred.
   */
  align?: "between" | "center";
}

export interface TableExportOptions {
  /** Default `"table-data.csv"`. */
  fileName?: string;
}

export interface TableLabels {
  search: string;
  searchPlaceholder: string;
  columns: string;
  filterColumn: (column: string) => string;
  /** Screen-reader name of the selection column header. */
  selection: string;
  selectAll: string;
  selectRow: (rowKey: TableRowKey) => string;
  expandRow: string;
  collapseRow: string;
  moveColumnUp: (column: string) => string;
  moveColumnDown: (column: string) => string;
  resizeColumn: (column: string) => string;
  sortAscending: string;
  sortDescending: string;
  sortPriority: (index: number) => string;
  empty: ReactNode;
  noResults: ReactNode;
  loading: string;
  error: ReactNode;
  retry: string;
  rowsPerPage: string;
  firstPage: string;
  previousPage: string;
  nextPage: string;
  lastPage: string;
  download: string;
  editCell: (column: string) => string;
  /** Shown when the built-in number editor gets text that isn't a number. */
  invalidNumber: string;
  moveRow: (rowKey: TableRowKey) => string;
  /** Hint on the drag handle while sorting, search, or filters hide the real order. */
  reorderUnavailable: string;
  /** Screen-reader name of the drag-handle column header. */
  reorder: string;
  /** Read with each drag handle: how to move a row from the keyboard. */
  reorderInstructions: string;
  rowMoved: (position: number, total: number) => string;
  page: (page: number) => string;
  range: (from: number, to: number, total: number) => string;
  pagination: string;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  /** Unique key per row: a key of the row, or a function. Default `"id"`. */
  rowKey?: keyof T | ((row: T, index: number) => TableRowKey);

  /* Content */
  caption?: ReactNode;
  /** Keep the caption for screen readers only. */
  hideCaption?: boolean;
  /** Accessible name when there is no visible caption. */
  ariaLabel?: string;
  /** Extra content shown in the toolbar, after the search field. */
  toolbar?: ReactNode;
  /** Full-width row appended to `<tfoot>`, after column footers. */
  footer?: ReactNode;

  /* Appearance */
  size?: TableSize;
  bordered?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  /** Limit the height and scroll vertically (pairs with `stickyHeader`). */
  maxHeight?: number | string;
  stickyHeader?: boolean;
  /** Let header text wrap onto several lines (per column: `headerWrap`). */
  wrapHeaders?: boolean;
  /** Shown in empty cells, e.g. `"-"` (per column: `emptyValue`). */
  emptyCellValue?: ReactNode;

  /* Toolbar */
  /** Where the search field sits in the toolbar. Default `"start"`. */
  searchPlacement?: "start" | "end";
  /** Column menu trigger style. Default `"button"`. */
  columnSettingsTrigger?: "button" | "link";

  /* Export */
  /**
   * Show a download button that exports the searched/filtered/sorted rows
   * (all pages) and visible columns as CSV.
   */
  exportable?: boolean | TableExportOptions;
  /** Replaces the built-in CSV download, e.g. for server-side or Excel export. */
  onExport?: (rows: T[], columns: TableColumn<T>[]) => void;

  /* Sorting */
  sortable?: boolean;
  /** Shift+click a header to add it to the sort. */
  multiSort?: boolean;
  sort?: SortRule[];
  defaultSort?: SortRule[];
  onSortChange?: (sort: SortRule[]) => void;
  /** Data is sorted by the consumer (e.g. server side). */
  manualSorting?: boolean;

  /* Search & filtering */
  /** Show the global search field. */
  searchable?: boolean;
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Show a filter row for `filterable` columns. */
  showColumnFilters?: boolean;
  filters?: TableFilters;
  defaultFilters?: TableFilters;
  onFiltersChange?: (filters: TableFilters) => void;
  /** Data is searched/filtered by the consumer. */
  manualFiltering?: boolean;

  /* Selection */
  selectionMode?: "none" | "single" | "multiple";
  selectedRowKeys?: TableRowKey[];
  defaultSelectedRowKeys?: TableRowKey[];
  onSelectionChange?: (keys: TableRowKey[], rows: T[]) => void;
  isRowSelectable?: (row: T, index: number) => boolean;

  /* Expansion */
  renderExpandedRow?: (row: T, index: number) => ReactNode;
  isRowExpandable?: (row: T, index: number) => boolean;
  expandedRowKeys?: TableRowKey[];
  defaultExpandedRowKeys?: TableRowKey[];
  onExpandedChange?: (keys: TableRowKey[]) => void;

  /* Pagination */
  pagination?: boolean | TablePaginationOptions;
  /** 1-based page. */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  /** Data is already the current page; `totalRows` gives the full count. */
  manualPagination?: boolean;
  totalRows?: number;

  /* Columns */
  /** Show the column visibility/order menu. */
  showColumnSettings?: boolean;
  columnVisibility?: TableColumnVisibility;
  defaultColumnVisibility?: TableColumnVisibility;
  onColumnVisibilityChange?: (visibility: TableColumnVisibility) => void;
  /** Leaf column ids in display order. Unknown ids are ignored; missing ones go last. */
  columnOrder?: string[];
  defaultColumnOrder?: string[];
  onColumnOrderChange?: (order: string[]) => void;
  resizableColumns?: boolean;
  columnSizing?: TableColumnSizing;
  defaultColumnSizing?: TableColumnSizing;
  onColumnSizingChange?: (sizing: TableColumnSizing) => void;

  /* States */
  loading?: boolean;
  /** Skeleton rows shown while loading with no data. Default 5. */
  loadingRows?: number;
  /** Shows an error row in place of the data. */
  error?: ReactNode | boolean;
  onRetry?: () => void;
  /** Shown when `data` is empty. */
  emptyState?: ReactNode;
  /** Shown when search/filters match nothing. */
  noResultsState?: ReactNode;

  /* Editing & reordering */
  /** Called after a cell edit is saved (see the column's `editable`). */
  onCellEdit?: (edit: TableCellEdit<T>) => void;
  /**
   * Show a drag handle to reorder rows (drag, or focus it and use the arrow
   * keys). Paused while sorting, search, or filters are active.
   */
  reorderableRows?: boolean;
  onRowReorder?: (move: TableRowReorder<T>) => void;
  /**
   * Called with the full updated data after an edit or a row move. Without
   * it the table keeps the changes itself until `data` changes.
   */
  onDataChange?: (data: T[]) => void;

  /* Rows */
  rowClassName?: string | ((row: T, index: number) => string | undefined);
  getRowProps?: (row: T, index: number) => HTMLAttributes<HTMLTableRowElement>;
  /** Makes rows focusable; Enter on a focused row also triggers it. */
  onRowClick?: (row: T, index: number) => void;

  labels?: Partial<TableLabels>;
  id?: string;
  className?: string;
  tableClassName?: string;
  style?: CSSProperties;
}
