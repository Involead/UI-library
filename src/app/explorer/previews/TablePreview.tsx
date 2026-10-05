import { useState, type ReactNode } from "react";
import {
  Button,
  Table,
  type TableColumn,
  type TableExportOptions,
  type TablePaginationOptions,
  type TableProps,
  type TableRowKey,
  type TableSize,
} from "@/index";
import {
  baseColumns,
  centeredRangeLabel,
  contactEngagementColumns,
  contactIdentityColumns,
  contactPagination,
  contactProfileColumns,
  contacts,
  CustomRowsFooter,
  employees,
  errorMessage,
  filteringColumns,
  fullColumns,
  getDimmedRowProps,
  linkColumns,
  manyEmployees,
  quarterColumns,
  quarters,
  renderContactSummary,
  renderEmployeeDetails,
  renderEmployeeSummary,
  sessionColumns,
  sessions,
  sortingColumns,
  stickyColumns,
  truncationColumns,
  type Contact,
  type Employee,
} from "@/components/Table/Table.samples";
import type { ExplorerArgs } from "../../explorer-config";
import { getBooleanArg, getStringArg } from "../args";
import { isChoice, type PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onAction: (action: string) => void;
};

/** What a story renders besides the control-driven props. */
type Sample<T> = {
  data: T[];
  columns: TableColumn<T>[];
  /** Options used when the `pagination` control is on (`align` comes from its control). */
  pagination?: TablePaginationOptions;
  /** Options used when the `exportable` control is on. */
  exportable?: TableExportOptions;
  /** Used when the `expandable` control is on. */
  renderExpandedRow?: (row: T) => ReactNode;
  maxHeight?: number;
  /** Story-specific props, applied last. */
  props?: Partial<TableProps<T>>;
};

/** Height used by the `stickyHeader` control when the story sets none. */
export const tableStickyMaxHeight = 320;

/** Table stories that stack several tables, so the layout toggle applies. */
export const tableStackCompositions = [
  "table-sizes",
  "table-borders",
  "table-selection",
  "table-pagination",
  "table-loading",
  "table-empty",
];

const employeeSample: Sample<Employee> = {
  data: employees,
  columns: baseColumns,
  renderExpandedRow: renderEmployeeDetails,
};

const contactSample: Sample<Contact> = {
  data: contacts,
  columns: [...contactIdentityColumns, ...contactEngagementColumns],
  pagination: contactPagination,
  exportable: { fileName: "engagement.csv" },
  renderExpandedRow: renderContactSummary,
  props: { labels: { range: centeredRangeLabel } },
};

/** Maps the Explorer controls onto Table props, the way Storybook args do. */
function getTableProps<T>(
  args: ExplorerArgs,
  sample: Sample<T>,
  onAction: (action: string) => void,
): TableProps<T> {
  const selectedSize = getStringArg(args, "size", "medium");
  const size: TableSize = isChoice(selectedSize, ["small", "medium", "large"])
    ? selectedSize
    : "medium";
  const selectedMode = getStringArg(args, "selectionMode", "none");
  const selectionMode = isChoice(selectedMode, ["none", "single", "multiple"])
    ? selectedMode
    : "none";
  const stickyHeader = getBooleanArg(args, "stickyHeader");
  const pagination = getBooleanArg(args, "pagination") && {
    ...sample.pagination,
    align: getStringArg(args, "paginationAlign") === "center" ? ("center" as const) : undefined,
  };

  return {
    data: args.dataState === "empty" ? [] : sample.data,
    columns: sample.columns,
    caption: getStringArg(args, "caption") || undefined,
    size,
    hideCaption: getBooleanArg(args, "hideCaption"),
    bordered: getBooleanArg(args, "bordered"),
    striped: getBooleanArg(args, "striped"),
    hoverable: getBooleanArg(args, "hoverable"),
    compact: getBooleanArg(args, "compact"),
    wrapHeaders: getBooleanArg(args, "wrapHeaders"),
    emptyCellValue: getStringArg(args, "emptyCellValue") || undefined,
    stickyHeader,
    maxHeight: sample.maxHeight ?? (stickyHeader ? tableStickyMaxHeight : undefined),
    sortable: getBooleanArg(args, "sortable"),
    multiSort: getBooleanArg(args, "multiSort"),
    searchable: getBooleanArg(args, "searchable"),
    showColumnFilters: getBooleanArg(args, "showColumnFilters"),
    showColumnSettings: getBooleanArg(args, "showColumnSettings"),
    resizableColumns: getBooleanArg(args, "resizableColumns"),
    selectionMode,
    renderExpandedRow: getBooleanArg(args, "expandable") ? sample.renderExpandedRow : undefined,
    pagination,
    searchPlacement: getStringArg(args, "searchPlacement") === "end" ? "end" : "start",
    columnSettingsTrigger: getStringArg(args, "columnSettingsTrigger") === "link" ? "link" : "button",
    exportable: getBooleanArg(args, "exportable") && (sample.exportable ?? true),
    loading: getBooleanArg(args, "loading"),
    error:
      args.dataState === "error"
        ? getStringArg(args, "errorMessage") || errorMessage
        : undefined,
    onRetry: () => onAction("table: retry"),
    onSortChange: (sort) =>
      onAction(`table: sort (${sort.map((rule) => `${rule.columnId} ${rule.direction}`).join(", ") || "none"})`),
    onSearchChange: (search) => onAction(`table: search "${search}"`),
    onFiltersChange: () => onAction("table: filters changed"),
    onSelectionChange: (keys) => onAction(`table: selection [${keys.join(", ")}]`),
    onExpandedChange: (keys) => onAction(`table: expanded [${keys.join(", ")}]`),
    onPageChange: (page) => onAction(`table: page ${page}`),
    onPageSizeChange: (pageSize) => onAction(`table: page size ${pageSize}`),
    onColumnVisibilityChange: () => onAction("table: column visibility changed"),
    onColumnOrderChange: (order) => onAction(`table: column order [${order.join(", ")}]`),
    ...sample.props,
  };
}

function SingleTable<T>({
  args,
  sample,
  onAction,
}: {
  args: ExplorerArgs;
  sample: Sample<T>;
  onAction: (action: string) => void;
}) {
  return (
    <div className="table-preview">
      <Table<T> {...getTableProps(args, sample, onAction)} />
    </div>
  );
}

function SelectionDemo({ props, onAction }: { props: TableProps<Employee>; onAction: (action: string) => void }) {
  const [selected, setSelected] = useState<TableRowKey[]>([2]);

  return (
    <>
      <Table
        {...props}
        data={employees}
        columns={baseColumns}
        caption="Multiple selection (suspended members can't be selected)"
        selectionMode="multiple"
        selectedRowKeys={selected}
        onSelectionChange={(keys) => {
          setSelected(keys);
          onAction(`table: selection [${keys.join(", ")}]`);
        }}
        isRowSelectable={(row) => row.status !== "Suspended"}
        hoverable
        toolbar={
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
            {selected.length} selected
          </span>
        }
      />
      <Table
        {...props}
        data={employees.slice(0, 4)}
        columns={baseColumns}
        caption="Single selection"
        selectionMode="single"
        defaultSelectedRowKeys={[1]}
      />
    </>
  );
}

function AllFeaturesDemo({ args, onAction }: { args: ExplorerArgs; onAction: (action: string) => void }) {
  const [selected, setSelected] = useState<TableRowKey[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const props = getTableProps(
    args,
    {
      data: manyEmployees,
      columns: fullColumns,
      maxHeight: 480,
      renderExpandedRow: renderEmployeeSummary,
      pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50] },
      props: {
        defaultSort: [{ columnId: "name", direction: "asc" }],
        isRowSelectable: (row) => row.status !== "Suspended",
      },
    },
    onAction,
  );

  return (
    <div className="table-preview">
      <Table
        {...props}
        selectedRowKeys={selected}
        onSelectionChange={(keys) => {
          setSelected(keys);
          onAction(`table: selection [${keys.join(", ")}]`);
        }}
        loading={props.loading || refreshing}
        toolbar={
          <>
            <Button
              variant="outline"
              size="small"
              onClick={() => {
                setRefreshing(true);
                onAction("table: refresh");
                window.setTimeout(() => setRefreshing(false), 1200);
              }}
            >
              Refresh
            </Button>
            {selected.length > 0 && (
              <Button variant="danger" size="small" onClick={() => setSelected([])}>
                Clear {selected.length} selected
              </Button>
            )}
          </>
        }
      />
    </div>
  );
}

export function TablePreview({ args, composition, layout, onAction }: Props) {
  const stackClass = `table-preview preview-stack${layout === "horizontal" ? " horizontal" : ""}`;
  const employeeProps = getTableProps(args, employeeSample, onAction);
  const logRowClick = (row: Employee) => onAction(`table: row click (${row.name})`);

  switch (composition) {
    case "table-sizes":
      return (
        <div className={stackClass}>
          <Table {...employeeProps} size="small" caption="Small" data={employees.slice(0, 3)} />
          <Table {...employeeProps} size="medium" caption="Medium" data={employees.slice(0, 3)} />
          <Table {...employeeProps} size="large" caption="Large" data={employees.slice(0, 3)} />
          <Table {...employeeProps} size="medium" compact caption="Medium + compact" data={employees.slice(0, 3)} />
        </div>
      );
    case "table-borders":
      return (
        <div className={stackClass}>
          <Table {...employeeProps} caption="Row dividers (default)" data={employees.slice(0, 4)} />
          <Table {...employeeProps} bordered caption="Bordered" data={employees.slice(0, 4)} />
        </div>
      );
    case "table-hoverable":
      return <SingleTable args={args} onAction={onAction} sample={{ ...employeeSample, props: { onRowClick: logRowClick } }} />;
    case "table-sorting":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{
            ...employeeSample,
            columns: sortingColumns,
            props: { defaultSort: [{ columnId: "department", direction: "asc" }] },
          }}
        />
      );
    case "table-filtering":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{ ...employeeSample, data: manyEmployees, columns: filteringColumns, pagination: { defaultPageSize: 10 } }}
        />
      );
    case "table-selection":
      return (
        <div className={stackClass}>
          <SelectionDemo props={employeeProps} onAction={onAction} />
        </div>
      );
    case "table-expandable":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{
            ...employeeSample,
            props: {
              defaultExpandedRowKeys: [1],
              isRowExpandable: (row) => row.status !== "Invited",
            },
          }}
        />
      );
    case "table-pagination":
      return (
        <div className={stackClass}>
          <Table
            {...employeeProps}
            data={manyEmployees}
            caption="Default: range left, controls right, first/last buttons"
            pagination={{ defaultPageSize: 5, pageSizeOptions: [5, 10, 25] }}
          />
          <Table
            {...employeeProps}
            data={manyEmployees}
            caption="Centred controls, no page-size label"
            labels={{ range: centeredRangeLabel }}
            pagination={{
              defaultPageSize: 5,
              pageSizeOptions: [5, 10, 25],
              align: "center",
              showPageSizeLabel: false,
            }}
          />
        </div>
      );
    case "table-loading":
      return (
        <div className={stackClass}>
          <Table {...employeeProps} loading data={[]} caption="Initial load (skeleton)" loadingRows={4} />
          <Table {...employeeProps} loading data={employees.slice(0, 4)} caption="Refreshing existing data" />
        </div>
      );
    case "table-empty":
      return (
        <div className={stackClass}>
          <Table {...employeeProps} data={[]} caption="Default empty state" />
          <Table
            {...employeeProps}
            data={[]}
            caption="Custom empty state"
            emptyState={
              <>
                <strong style={{ color: "var(--color-text-primary)" }}>No team members yet</strong>
                <span>Invite people to collaborate on this workspace.</span>
                <Button size="small" onClick={() => onAction("table: invite members")}>Invite members</Button>
              </>
            }
          />
        </div>
      );
    case "column-spanning":
      return <SingleTable args={args} onAction={onAction} sample={{ data: quarters, columns: quarterColumns }} />;
    case "row-spanning":
      return <SingleTable args={args} onAction={onAction} sample={{ data: sessions, columns: sessionColumns }} />;
    case "table-sticky-header":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{ ...employeeSample, data: manyEmployees.slice(0, 30), maxHeight: tableStickyMaxHeight }}
        />
      );
    case "table-sticky-columns":
      return (
        <div className="table-preview">
          <div style={{ maxWidth: 720 }}>
            <Table {...getTableProps(args, { ...employeeSample, columns: stickyColumns }, onAction)} />
          </div>
        </div>
      );
    case "table-custom-rows":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{ ...employeeSample, props: { getRowProps: getDimmedRowProps, footer: <CustomRowsFooter /> } }}
        />
      );
    case "table-header-descriptions":
    case "table-download":
      return <SingleTable args={args} onAction={onAction} sample={contactSample} />;
    case "table-custom-cells":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{ ...contactSample, columns: [...contactIdentityColumns, ...contactProfileColumns] }}
        />
      );
    case "table-links":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{ ...employeeSample, columns: linkColumns, props: { onRowClick: logRowClick } }}
        />
      );
    case "table-truncation":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{ ...contactSample, data: contacts.slice(0, 5), columns: truncationColumns, props: undefined }}
        />
      );
    case "table-toolbar":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{
            ...employeeSample,
            data: manyEmployees.slice(0, 6),
            columns: fullColumns,
            props: { labels: { columns: "Manage columns", searchPlaceholder: "Search collaborators" } },
          }}
        />
      );
    case "table-contact-directory":
      return (
        <SingleTable
          args={args}
          onAction={onAction}
          sample={{
            ...contactSample,
            columns: [...contactIdentityColumns, ...contactProfileColumns, ...contactEngagementColumns],
            props: { labels: { range: centeredRangeLabel, columns: "Manage columns" } },
          }}
        />
      );
    case "table-all-features":
      return <AllFeaturesDemo args={args} onAction={onAction} />;
    default:
      return <SingleTable args={args} onAction={onAction} sample={employeeSample} />;
  }
}
