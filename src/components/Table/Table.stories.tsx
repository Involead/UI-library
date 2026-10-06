import { useState } from "react";

import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";

import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "@/components/Button";

import { Table } from "./Table";
import type { TableProps, TableRowKey } from "./Table.types";
import {
  baseColumns,
  centeredRangeLabel,
  contactCommonArgs,
  contactEngagementColumns,
  contactIdentityColumns,
  contactProfileColumns,
  contacts,
  CustomRowsFooter,
  editableColumns,
  employees,
  errorMessage,
  filteringColumns,
  fullColumns,
  getDimmedRowProps,
  linkColumns,
  manyEmployees,
  quarterColumns,
  quarters,
  renderEmployeeDetails,
  renderEmployeeSummary,
  sessionColumns,
  sessions,
  sortingColumns,
  stickyColumns,
  truncationColumns,
  type Contact,
  type Employee,
  type Quarter,
  type Session,
} from "./Table.samples";

/* =========================
   META
   ========================= */

// Pin the row type so story args are typed against the sample data.
type EmployeeTableComponent = (
  props: TableProps<Employee>,
) => ReturnType<typeof Table>;

const EmployeeTable: EmployeeTableComponent = Table;

const meta = {
  title: "Components/Table",
  component: EmployeeTable,

  parameters: {
    layout: "padded",

    docs: {
      description: {
        component:
          "A generic, accessible data table built on semantic `<table>` markup. " +
          "Describe columns with `columns` and pass rows with `data`; every feature " +
          "(sorting, search, filters, selection, expansion, pagination, column " +
          "visibility/order/sizing) works uncontrolled out of the box, or controlled " +
          "through its `value` + `onChange` pair.",
      },
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },

  tags: ["autodocs"],

  args: {
    data: employees,
    columns: baseColumns,
    caption: "Team members",
    size: "medium",
    bordered: false,
    striped: false,
    hoverable: false,
    compact: false,
    loading: false,
  },

  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    bordered: { control: "boolean" },
    striped: { control: "boolean" },
    hoverable: { control: "boolean" },
    compact: { control: "boolean" },
    stickyHeader: { control: "boolean" },
    sortable: { control: "boolean" },
    multiSort: { control: "boolean" },
    searchable: { control: "boolean" },
    showColumnFilters: { control: "boolean" },
    showColumnSettings: { control: "boolean" },
    resizableColumns: { control: "boolean" },
    selectionMode: { control: "radio", options: ["none", "single", "multiple"] },
    loading: { control: "boolean" },
    caption: { control: "text" },
    hideCaption: { control: "boolean" },
    data: { control: false },
    columns: { control: false },
    error: { control: false },
    emptyState: { control: false },
    noResultsState: { control: false },
    toolbar: { control: false },
    footer: { control: false },
    labels: { control: false },
  },
} satisfies Meta<EmployeeTableComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

const stack = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-2xl)",
} as const;

/* =========================
   BASIC TABLE
   ========================= */

export const BasicTable: Story = {};

/* =========================
   SIZES
   ========================= */

export const Sizes: Story = {
  argTypes: { size: { control: false } },
  render: (args) => (
    <div style={stack}>
      <Table {...args} size="small" caption="Small" data={employees.slice(0, 3)} />
      <Table {...args} size="medium" caption="Medium" data={employees.slice(0, 3)} />
      <Table {...args} size="large" caption="Large" data={employees.slice(0, 3)} />
      <Table {...args} size="medium" compact caption="Medium + compact" data={employees.slice(0, 3)} />
    </div>
  ),
};

/* =========================
   BORDERS
   ========================= */

export const Borders: Story = {
  argTypes: { bordered: { control: false } },
  render: (args) => (
    <div style={stack}>
      <Table {...args} caption="Row dividers (default)" data={employees.slice(0, 4)} />
      <Table {...args} bordered caption="Bordered" data={employees.slice(0, 4)} />
    </div>
  ),
};

/* =========================
   STRIPED
   ========================= */

export const Striped: Story = {
  args: { striped: true },
};

/* =========================
   HOVERABLE
   ========================= */

export const Hoverable: Story = {
  args: {
    hoverable: true,
    onRowClick: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "`hoverable` highlights the row under the pointer. With `onRowClick`, rows are " +
          "also focusable and activate with Enter.",
      },
    },
  },
};

/* =========================
   SORTING
   ========================= */

export const Sorting: Story = {
  args: {
    sortable: true,
    multiSort: true,
    defaultSort: [{ columnId: "department", direction: "asc" }],
    caption: "Click a header to sort; Shift+click to add a secondary sort",
    columns: sortingColumns,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nameHeader = canvas.getByRole("columnheader", { name: /^Name/ });
    await userEvent.click(within(nameHeader).getByRole("button"));
    await expect(nameHeader).toHaveAttribute("aria-sort", "ascending");
    await userEvent.click(within(nameHeader).getByRole("button"));
    await expect(nameHeader).toHaveAttribute("aria-sort", "descending");
  },
};

/* =========================
   FILTERING / SEARCH
   ========================= */

export const FilteringAndSearch: Story = {
  name: "Filtering / Search",
  args: {
    data: manyEmployees,
    columns: filteringColumns,
    searchable: true,
    showColumnFilters: true,
    pagination: { defaultPageSize: 10 },
    caption: "Search across columns, or filter a single column",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox", { name: "Search table" }), "zzzz");
    await expect(canvas.getByText("No results match your search")).toBeInTheDocument();
    await userEvent.clear(canvas.getByRole("searchbox", { name: "Search table" }));
  },
};

/* =========================
   ROW SELECTION
   ========================= */

function SelectionDemo(args: Story["args"]) {
  const [selected, setSelected] = useState<TableRowKey[]>([2]);

  return (
    <div style={stack}>
      <Table
        {...args}
        data={employees}
        columns={baseColumns}
        caption="Multiple selection (suspended members can't be selected)"
        selectionMode="multiple"
        selectedRowKeys={selected}
        onSelectionChange={(keys) => setSelected(keys)}
        isRowSelectable={(row) => row.status !== "Suspended"}
        hoverable
        toolbar={
          <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
            {selected.length} selected
          </span>
        }
      />
      <Table
        {...args}
        data={employees.slice(0, 4)}
        columns={baseColumns}
        caption="Single selection"
        selectionMode="single"
        defaultSelectedRowKeys={[1]}
      />
    </div>
  );
}

export const RowSelection: Story = {
  argTypes: { selectionMode: { control: false } },
  render: (args) => <SelectionDemo {...args} />,
};

/* =========================
   EXPANDABLE ROWS
   ========================= */

export const ExpandableRows: Story = {
  args: {
    defaultExpandedRowKeys: [1],
    isRowExpandable: (row) => row.status !== "Invited",
    renderExpandedRow: renderEmployeeDetails,
    caption: "Expandable rows (invited members have no details yet)",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [toggle] = canvas.getAllByRole("button", { name: "Collapse row" });
    await userEvent.click(toggle);
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  },
};

/* =========================
   PAGINATION
   ========================= */

export const Pagination: Story = {
  render: (args) => (
    <div style={stack}>
      <Table
        {...args}
        data={manyEmployees}
        caption="Default: range left, controls right, first/last buttons"
        pagination={{ defaultPageSize: 5, pageSizeOptions: [5, 10, 25] }}
      />
      <Table
        {...args}
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
  ),
};

/* =========================
   LOADING
   ========================= */

export const Loading: Story = {
  argTypes: { loading: { control: false } },
  render: (args) => (
    <div style={stack}>
      <Table {...args} loading data={[]} caption="Initial load (skeleton)" loadingRows={4} />
      <Table {...args} loading data={employees.slice(0, 4)} caption="Refreshing existing data" />
    </div>
  ),
};

/* =========================
   EMPTY STATE
   ========================= */

export const EmptyState: Story = {
  render: (args) => (
    <div style={stack}>
      <Table {...args} data={[]} caption="Default empty state" />
      <Table
        {...args}
        data={[]}
        caption="Custom empty state"
        emptyState={
          <>
            <strong style={{ color: "var(--color-text-primary)" }}>No team members yet</strong>
            <span>Invite people to collaborate on this workspace.</span>
            <Button size="small">Invite members</Button>
          </>
        }
      />
    </div>
  ),
};

/* =========================
   ERROR STATE
   ========================= */

export const ErrorState: Story = {
  args: {
    error: errorMessage,
    onRetry: fn(),
  },
};

/* =========================
   COLUMN SPANNING
   ========================= */

export const ColumnSpanning: Story = {
  render: () => (
    <Table<Quarter>
      bordered
      caption="Grouped headers and a body cell spanning four columns"
      data={quarters}
      columns={quarterColumns}
    />
  ),
};

/* =========================
   ROW SPANNING
   ========================= */

export const RowSpanning: Story = {
  render: () => (
    <Table<Session>
      bordered
      caption="Conference schedule — day cells span their sessions"
      data={sessions}
      columns={sessionColumns}
    />
  ),
};

/* =========================
   STICKY HEADER
   ========================= */

export const StickyHeader: Story = {
  args: {
    data: manyEmployees.slice(0, 30),
    stickyHeader: true,
    maxHeight: 320,
    striped: true,
    caption: "Scroll inside the table — the header stays in place",
  },
};

/* =========================
   STICKY COLUMNS & RESIZING
   ========================= */

export const StickyColumnsAndResizing: Story = {
  name: "Sticky Columns & Resizing",
  args: {
    data: employees,
    resizableColumns: true,
    selectionMode: "multiple",
    caption: "Scroll horizontally; drag (or focus and use arrow keys on) a header edge to resize",
    columns: stickyColumns,
  },
  decorators: [
    (StoryComponent) => (
      <div style={{ maxWidth: 720 }}>
        <StoryComponent />
      </div>
    ),
  ],
};

/* =========================
   CUSTOM ROWS
   ========================= */

export const CustomRows: Story = {
  args: {
    caption: "Custom row classes and props: suspended members are dimmed",
    getRowProps: getDimmedRowProps,
    footer: <CustomRowsFooter />,
  },
};

/* =========================
   EDITABLE CELLS
   ========================= */

function EditableDemo(args: Story["args"]) {
  const [rows, setRows] = useState(() => employees.slice(0, 6));
  const [lastEdit, setLastEdit] = useState("");

  return (
    <Table
      {...args}
      data={rows}
      columns={editableColumns}
      caption="Double-click a cell, or use its edit button. Enter saves, Escape cancels."
      onDataChange={setRows}
      onCellEdit={(edit) =>
        setLastEdit(`${edit.columnId}: ${String(edit.previousValue)} → ${String(edit.value)}`)
      }
      toolbar={
        <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-secondary)" }}>
          {lastEdit ? `Last edit: ${lastEdit}` : "No edits yet"}
        </span>
      }
    />
  );
}

export const EditableCells: Story = {
  name: "Editable Cells",
  parameters: {
    docs: {
      description: {
        story:
          "Set a column's `editable` to edit its cells. `validate` rejects bad values, " +
          "`renderEditor` swaps in a custom editor (Department uses a select), and " +
          "`onCellEdit` / `onDataChange` report each saved change. Status isn't editable.",
      },
    },
  },
  render: (args) => <EditableDemo {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Edit a text cell with the keyboard.
    await userEvent.click(canvas.getAllByRole("button", { name: "Edit Role" })[0]);
    const input = canvas.getByRole("textbox", { name: "Edit Role" });
    await userEvent.clear(input);
    await userEvent.type(input, "Staff Engineer{Enter}");
    await expect(canvas.getByText("Staff Engineer")).toBeInTheDocument();

    // A rejected value keeps the editor open with its message.
    await userEvent.click(canvas.getAllByRole("button", { name: "Edit Salary" })[0]);
    const salary = canvas.getByRole("spinbutton", { name: "Edit Salary" });
    await userEvent.clear(salary);
    await userEvent.type(salary, "-5{Enter}");
    await expect(canvas.getByRole("alert")).toHaveTextContent("Enter a salary of 0 or more.");
    await userEvent.keyboard("{Escape}");
  },
};

/* =========================
   ROW REORDERING
   ========================= */

export const RowReordering: Story = {
  name: "Row Reordering",
  parameters: {
    docs: {
      description: {
        story:
          "`reorderableRows` adds a drag handle to each row: drag it, or focus it and press " +
          "the up and down arrow keys. `onRowReorder` and `onDataChange` report the new order. " +
          "Reordering pauses while the table is sorted, searched, or filtered.",
      },
    },
  },
  args: {
    data: employees.slice(0, 6),
    reorderableRows: true,
    sortable: true,
    caption: "Drag a row by its handle, or focus the handle and use the arrow keys",
    onRowReorder: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const firstName = () => canvas.getAllByRole("rowheader")[0].textContent;
    const before = firstName();

    canvas.getAllByRole("button", { name: /^Move row/ })[0].focus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(firstName()).not.toBe(before);
    await expect(args.onRowReorder).toHaveBeenCalledWith(
      expect.objectContaining({ fromIndex: 0, toIndex: 1 }),
    );
  },
};

/* =========================
   HEADER DESCRIPTIONS
   ========================= */

export const HeaderDescriptions: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`description` adds a secondary header line. With grouped columns, it sits on the " +
          "same row as the sub-headers (Sent, Opened rate…), giving a double header.",
      },
    },
  },
  render: () => (
    <Table<Contact>
      {...contactCommonArgs}
      caption="Engagement summary"
      columns={[...contactIdentityColumns, ...contactEngagementColumns]}
    />
  ),
};

/* =========================
   CUSTOM CELLS
   ========================= */

export const CustomCells: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`cell` can return any element: links, badges, lists. `emptyCellValue` (or a " +
          "column's `emptyValue`) fills cells that render nothing.",
      },
    },
  },
  render: () => (
    <Table<Contact>
      {...contactCommonArgs}
      caption="Engagement summary"
      columns={[...contactIdentityColumns, ...contactProfileColumns]}
    />
  ),
};

/* =========================
   LINKS
   ========================= */

export const Links: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A column's `href` turns its cells into links; return `undefined` to leave a row " +
          "unlinked. `linkTarget=\"_blank\"` opens a new tab. Combine with `cell` to link " +
          "custom content. Clicking a link never triggers `onRowClick`.",
      },
    },
  },
  args: {
    caption: "Team members with profile and email links",
    onRowClick: fn(),
    hoverable: true,
    columns: linkColumns,
  },
};

/* =========================
   TRUNCATION & WRAPPING
   ========================= */

export const TruncationAndWrapping: Story = {
  name: "Truncation & Wrapping",
  parameters: {
    docs: {
      description: {
        story:
          "`truncate` cuts cells and headers at `maxWidth` with an ellipsis (hover for the " +
          "full text). `wrapHeaders` / `headerWrap` let long headers wrap; `wrap` does the same for cells.",
      },
    },
  },
  render: () => (
    <Table<Contact>
      sortable
      wrapHeaders
      emptyCellValue="-"
      caption="Long content"
      data={contacts.slice(0, 5)}
      columns={truncationColumns}
    />
  ),
};

/* =========================
   DOWNLOAD DATA
   ========================= */

export const DownloadData: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`exportable` adds a download button that saves the searched, filtered and sorted " +
          "rows (every page) and the visible columns as CSV. Use a column's `exportValue` to " +
          "control the text, or `onExport` to replace the download (e.g. a server export).",
      },
    },
  },
  render: () => (
    <Table<Contact>
      {...contactCommonArgs}
      caption="Engagement summary"
      searchable
      searchPlacement="end"
      exportable={{ fileName: "engagement.csv" }}
      columns={[...contactIdentityColumns, ...contactEngagementColumns]}
    />
  ),
};

/* =========================
   TOOLBAR LAYOUT
   ========================= */

export const ToolbarLayout: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "`searchPlacement=\"end\"` moves search to the right; `columnSettingsTrigger=\"link\"` " +
          "renders the column menu trigger as a text link (rename it with `labels.columns`).",
      },
    },
  },
  render: (args) => (
    <Table
      {...args}
      data={manyEmployees.slice(0, 6)}
      columns={fullColumns}
      caption="Collaborators"
      sortable
      searchable
      searchPlacement="end"
      showColumnSettings
      columnSettingsTrigger="link"
      labels={{ columns: "Manage columns", searchPlaceholder: "Search collaborators" }}
    />
  ),
};

/* =========================
   CONTACT DIRECTORY
   ========================= */

export const ContactDirectory: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "A complete data table: fixed columns, header descriptions, grouped " +
          "sub-headers, custom cells, truncation, toolbar on the right, CSV download, and " +
          "centred pagination with first/last buttons.",
      },
    },
  },
  render: () => (
    <Table<Contact>
      {...contactCommonArgs}
      caption="Engagement summary"
      searchable
      searchPlacement="end"
      showColumnSettings
      columnSettingsTrigger="link"
      exportable={{ fileName: "engagement.csv" }}
      labels={{ ...contactCommonArgs.labels, columns: "Manage columns" }}
      columns={[...contactIdentityColumns, ...contactProfileColumns, ...contactEngagementColumns]}
    />
  ),
};

/* =========================
   ALL FEATURES
   ========================= */

function AllFeaturesDemo(args: Story["args"]) {
  const [selected, setSelected] = useState<TableRowKey[]>([]);
  const [loading, setLoading] = useState(false);

  return (
    <Table<Employee>
      {...args}
      data={manyEmployees}
      columns={fullColumns}
      caption="Team directory"
      hideCaption
      size="medium"
      hoverable
      striped
      stickyHeader
      maxHeight={480}
      sortable
      multiSort
      defaultSort={[{ columnId: "name", direction: "asc" }]}
      searchable
      showColumnFilters
      showColumnSettings
      resizableColumns
      exportable
      emptyCellValue="-"
      selectionMode="multiple"
      selectedRowKeys={selected}
      onSelectionChange={(keys) => setSelected(keys)}
      isRowSelectable={(row) => row.status !== "Suspended"}
      renderExpandedRow={renderEmployeeSummary}
      pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 25, 50] }}
      loading={loading}
      toolbar={
        <>
          <Button
            variant="outline"
            size="small"
            onClick={() => {
              setLoading(true);
              window.setTimeout(() => setLoading(false), 1200);
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
  );
}

export const AllFeatures: Story = {
  render: (args) => <AllFeaturesDemo {...args} />,
  parameters: {
    controls: { disable: true },
  },
};
