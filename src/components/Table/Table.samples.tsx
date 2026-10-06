/**
 * Sample data and columns shared by the Table stories and the Explorer, so both
 * render the same tables. Not part of the package (not exported from index).
 */
import type { HTMLAttributes } from "react";

import type { TableColumn, TablePaginationOptions } from "./Table.types";

/* =========================
   EMPLOYEES
   ========================= */

export interface Employee {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "Active" | "Invited" | "Suspended";
  salary: number;
  startDate: Date;
  location: string;
}

const FIRST = ["Ava", "Liam", "Noah", "Emma", "Mia", "Arjun", "Sofia", "Kenji", "Zara", "Omar", "Lena", "Ravi"];
const LAST = ["Patel", "Garcia", "Kim", "Nguyen", "Smith", "Rossi", "Okafor", "Silva", "Müller", "Haddad"];
const ROLES = ["Engineer", "Designer", "Product Manager", "Analyst", "Support Lead", "Recruiter"];
const DEPARTMENTS = ["Engineering", "Design", "Product", "Finance", "Support", "People"];
const STATUSES: Employee["status"][] = ["Active", "Active", "Active", "Invited", "Suspended"];
const LOCATIONS = ["Bengaluru", "London", "New York", "Berlin", "Singapore", "Toronto"];

export function makeEmployees(count: number): Employee[] {
  return Array.from({ length: count }, (_, i) => {
    const first = FIRST[i % FIRST.length];
    const last = LAST[(i * 7) % LAST.length];
    return {
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first}.${last}@involead.com`.toLowerCase(),
      role: ROLES[(i * 5) % ROLES.length],
      department: DEPARTMENTS[(i * 3) % DEPARTMENTS.length],
      status: STATUSES[(i * 3) % STATUSES.length],
      salary: 52000 + ((i * 7919) % 90) * 1000,
      startDate: new Date(2018 + (i % 7), (i * 5) % 12, 1 + ((i * 11) % 27)),
      location: LOCATIONS[(i * 5) % LOCATIONS.length],
    };
  });
}

export const employees = makeEmployees(8);
export const manyEmployees = makeEmployees(57);

export const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const STATUS_COLORS: Record<Employee["status"], string> = {
  Active: "var(--color-success)",
  Invited: "var(--color-info)",
  Suspended: "var(--color-error)",
};

export function StatusBadge({ status }: { status: Employee["status"] }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--spacing-xs)",
        padding: "2px var(--spacing-sm)",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--font-size-xs)",
        fontWeight: "var(--font-weight-medium)",
        color: STATUS_COLORS[status],
        background: `color-mix(in srgb, ${STATUS_COLORS[status]} 10%, var(--color-surface))`,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "var(--radius-full)",
          background: "currentColor",
        }}
      />
      {status}
    </span>
  );
}

export const baseColumns: TableColumn<Employee>[] = [
  { id: "name", header: "Name", rowHeader: true },
  { id: "role", header: "Role" },
  { id: "department", header: "Department" },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.status} />,
  },
  {
    id: "salary",
    header: "Salary",
    align: "right",
    cell: ({ row }) => currency.format(row.salary),
    getSearchValue: (row) => String(row.salary),
  },
];

export const fullColumns: TableColumn<Employee>[] = [
  {
    id: "name",
    header: "Name",
    rowHeader: true,
    width: 200,
    sticky: "left",
    cell: ({ row }) => (
      <span style={{ display: "flex", flexDirection: "column" }}>
        <span>{row.name}</span>
        <span style={{ fontSize: "var(--font-size-xs)", color: "var(--color-text-secondary)", fontWeight: "var(--font-weight-regular)" }}>
          {row.email}
        </span>
      </span>
    ),
    getSearchValue: (row) => `${row.name} ${row.email}`,
    filterable: true,
    hideable: false,
    footer: "Total",
  },
  { id: "role", header: "Role", filterable: true, width: 180 },
  { id: "department", header: "Department", filterable: true, width: 160 },
  {
    id: "status",
    header: "Status",
    width: 140,
    filterable: true,
    cell: ({ row }) => <StatusBadge status={row.status} />,
    filterFn: (row, value) => value === "" || row.status === value,
    renderFilter: ({ value, setValue, label }) => (
      <select
        aria-label={label}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        style={{
          width: "100%",
          height: "var(--control-height-sm)",
          font: "inherit",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          background: "var(--color-surface)",
        }}
      >
        <option value="">All</option>
        <option>Active</option>
        <option>Invited</option>
        <option>Suspended</option>
      </select>
    ),
  },
  { id: "location", header: "Location", width: 140, defaultHidden: true },
  {
    id: "startDate",
    header: "Start date",
    width: 140,
    cell: ({ row }) => dateFormat.format(row.startDate),
    getSearchValue: (row) => dateFormat.format(row.startDate),
    sortDescFirst: true,
  },
  {
    id: "salary",
    header: "Salary",
    align: "right",
    width: 140,
    cell: ({ row }) => currency.format(row.salary),
    getSearchValue: (row) => String(row.salary),
    sortDescFirst: true,
    footer: ({ rows }) =>
      currency.format(rows.reduce((total, row) => total + row.salary, 0)),
  },
];

/* Per-story column sets */

export const sortingColumns: TableColumn<Employee>[] = [
  ...baseColumns.slice(0, 4),
  { ...baseColumns[4], sortDescFirst: true },
  {
    id: "startDate",
    header: "Start date",
    cell: ({ row }) => dateFormat.format(row.startDate),
  },
  { id: "email", header: "Email", sortable: false },
];

export const filteringColumns: TableColumn<Employee>[] = fullColumns.map((column) => ({
  ...column,
  sticky: undefined,
  footer: undefined,
}));

export const stickyColumns: TableColumn<Employee>[] = [
  { ...baseColumns[0], sticky: "left", width: 180 },
  { id: "email", header: "Email", width: 260 },
  ...baseColumns.slice(1, 4).map((column) => ({ ...column, width: 200 })),
  { id: "location", header: "Location", width: 180 },
  {
    id: "startDate",
    header: "Start date",
    width: 160,
    cell: ({ row }) => dateFormat.format(row.startDate),
  },
  { ...baseColumns[4], sticky: "right", width: 140 },
];

export const linkColumns: TableColumn<Employee>[] = [
  { id: "name", header: "Name", rowHeader: true, href: (row) => `#member-${row.id}` },
  {
    id: "email",
    header: "Email",
    href: (row) => `mailto:${row.email}`,
  },
  { id: "role", header: "Role" },
  {
    id: "department",
    header: "Department",
    // Only some rows link: others stay plain text.
    href: (row) =>
      row.department === "Engineering" ? "https://example.com/engineering" : undefined,
    linkTarget: "_blank",
  },
  { ...baseColumns[4] },
];

const editorSelectStyle = {
  width: "100%",
  height: "var(--control-height-md)",
  font: "inherit",
  border: "var(--border-width-sm) solid var(--color-border-focus)",
  borderRadius: "var(--radius-md)",
  background: "var(--color-surface)",
  boxShadow: "0 0 0 var(--focus-ring-width) var(--color-focus-ring)",
} as const;

/** Columns for the editing story: text, select, and number editors with validation. */
export const editableColumns: TableColumn<Employee>[] = [
  {
    id: "name",
    header: "Name",
    rowHeader: true,
    editable: true,
    validate: (value) => (String(value ?? "").trim() ? undefined : "Name is required."),
  },
  { id: "role", header: "Role", editable: true },
  {
    id: "department",
    header: "Department",
    editable: true,
    // A custom editor: saves as soon as an option is picked.
    renderEditor: ({ value, onCommit, onCancel, label }) => (
      <select
        autoFocus
        aria-label={label}
        defaultValue={String(value)}
        onChange={(event) => onCommit(event.target.value)}
        onBlur={() => onCancel()}
        onKeyDown={(event) => event.key === "Escape" && onCancel()}
        style={editorSelectStyle}
      >
        {DEPARTMENTS.map((department) => (
          <option key={department}>{department}</option>
        ))}
      </select>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.status} />,
  },
  {
    id: "salary",
    header: "Salary",
    align: "right",
    editable: true,
    cell: ({ row }) => currency.format(row.salary),
    validate: (value) =>
      typeof value === "number" && value >= 0 ? undefined : "Enter a salary of 0 or more.",
  },
];

export function renderEmployeeDetails(row: Employee) {
  return (
    <dl
      style={{
        display: "grid",
        gridTemplateColumns: "max-content 1fr",
        gap: "var(--spacing-xs) var(--spacing-lg)",
        margin: 0,
      }}
    >
      <dt style={{ color: "var(--color-text-secondary)" }}>Email</dt>
      <dd style={{ margin: 0 }}>{row.email}</dd>
      <dt style={{ color: "var(--color-text-secondary)" }}>Location</dt>
      <dd style={{ margin: 0 }}>{row.location}</dd>
      <dt style={{ color: "var(--color-text-secondary)" }}>Start date</dt>
      <dd style={{ margin: 0 }}>{dateFormat.format(row.startDate)}</dd>
    </dl>
  );
}

export function renderEmployeeSummary(row: Employee) {
  return (
    <span>
      <strong>{row.name}</strong> joined the {row.department} team in {row.location} on{" "}
      {dateFormat.format(row.startDate)}.
    </span>
  );
}

export const getDimmedRowProps = (row: Employee) =>
  ({
    style: row.status === "Suspended" ? { opacity: 0.55 } : undefined,
    "data-status": row.status,
  }) as HTMLAttributes<HTMLTableRowElement>;

export function CustomRowsFooter() {
  return (
    <span style={{ color: "var(--color-text-secondary)", fontWeight: "var(--font-weight-regular)" }}>
      Suspended members lose access at the end of the billing period.
    </span>
  );
}

export const errorMessage = "We couldn't load team members. Check your connection and try again.";

export const centeredRangeLabel = (from: number, to: number, total: number) =>
  `Results: ${from} - ${to} of ${total} items`;

/* =========================
   COLUMN SPANNING
   ========================= */

export interface Quarter {
  id: string;
  region: string;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  note?: string;
}

export const quarters: Quarter[] = [
  { id: "emea", region: "EMEA", q1: 120, q2: 135, q3: 128, q4: 150 },
  { id: "apac", region: "APAC", q1: 98, q2: 110, q3: 121, q4: 140 },
  { id: "na", region: "North America", q1: null, q2: null, q3: null, q4: null, note: "Data migration in progress — figures available next quarter." },
  { id: "latam", region: "LATAM", q1: 45, q2: 52, q3: 58, q4: 61 },
];

const quarterColumn = (id: "q1" | "q2" | "q3" | "q4", header: string): TableColumn<Quarter> => ({
  id,
  header,
  align: "right",
  footer: ({ rows }) => rows.reduce((total, row) => total + (row[id] ?? 0), 0),
});

export const quarterColumns: TableColumn<Quarter>[] = [
  { id: "region", header: "Region", rowHeader: true, footer: "Total" },
  {
    id: "h1",
    header: "First half",
    columns: [
      {
        ...quarterColumn("q1", "Q1"),
        // A note replaces all four quarter cells.
        colSpan: ({ row }) => (row.note ? 4 : 1),
        cell: ({ row }) =>
          row.note ? (
            <em style={{ color: "var(--color-text-secondary)" }}>{row.note}</em>
          ) : (
            row.q1
          ),
        cellProps: ({ row }) => (row.note ? { style: { textAlign: "center" } } : {}),
      },
      quarterColumn("q2", "Q2"),
    ],
  },
  {
    id: "h2",
    header: "Second half",
    columns: [quarterColumn("q3", "Q3"), quarterColumn("q4", "Q4")],
  },
];

/* =========================
   ROW SPANNING
   ========================= */

export interface Session {
  id: number;
  day: string;
  time: string;
  track: string;
  speaker: string;
}

export const sessions: Session[] = [
  { id: 1, day: "Monday", time: "09:00", track: "Keynote", speaker: "Ava Patel" },
  { id: 2, day: "Monday", time: "10:30", track: "Design systems", speaker: "Kenji Kim" },
  { id: 3, day: "Monday", time: "13:00", track: "Accessibility", speaker: "Zara Okafor" },
  { id: 4, day: "Tuesday", time: "09:00", track: "Performance", speaker: "Liam Rossi" },
  { id: 5, day: "Tuesday", time: "11:00", track: "Testing", speaker: "Mia Silva" },
  { id: 6, day: "Wednesday", time: "10:00", track: "Closing panel", speaker: "Omar Haddad" },
];

export const sessionColumns: TableColumn<Session>[] = [
  {
    id: "day",
    header: "Day",
    rowHeader: true,
    // Span all consecutive rows of the same day (within the page).
    rowSpan: ({ row, pageIndex }) => {
      let span = 1;
      while (sessions[pageIndex + span]?.day === row.day) span += 1;
      return span;
    },
  },
  { id: "time", header: "Time" },
  { id: "track", header: "Track" },
  { id: "speaker", header: "Speaker" },
];

/* =========================
   CONTACTS
   ========================= */

export interface Contact {
  id: number;
  name: string;
  organization: string;
  type: string;
  industry: string;
  priority: string[];
  expertise: string[];
  owner: string | null;
  meetings: number;
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  invitations: number;
  attended: number;
}

// Long, fictional organisation names to show truncation.
const ORGANIZATIONS = [
  "Northwind Traders, Regional Operations and Customer Success Division",
  "Contoso Group (Asia Pacific Headquarters)",
  "Fabrikam Industries, Research and Development Centre",
];
const CONTACT_TYPES = ["Customer", "Customer", "Partner", "Customer", "Supplier"];
const INDUSTRIES = ["Healthcare", "Financial Services and Insurance", "Manufacturing", "Retail and Consumer Goods", "Logistics", "Education"];
const PRIORITIES = [["P2", "P3"], ["P1"], ["P1"], ["P2"], ["P3", "P4"], ["P2"], ["P1", "P2"], ["P2"], [], []];
const EXPERTISE = [[], ["Regional"], ["National"], ["National"], ["Regional", "National"], ["Emerging"], ["Regional"], ["Global"], [], []];
const CONTACT_NAMES = ["Alex Morgan", "Jordan Lee", "Taylor Brooks", "Casey Rivera", "Riley Chen", "Morgan Patel", "Jamie Fischer", "Avery Santos", "Quinn Novak", "Drew Okafor"];

export const contacts: Contact[] = Array.from({ length: 37 }, (_, i) => {
  const sent = (i * 7) % 23;
  const opened = Math.min(sent, (i * 5) % 14);
  return {
    id: i + 1,
    name: `${CONTACT_NAMES[i % CONTACT_NAMES.length]}${i >= CONTACT_NAMES.length ? ` ${Math.floor(i / CONTACT_NAMES.length) + 1}` : ""}`,
    organization: ORGANIZATIONS[i % 7 === 6 ? 1 : i % 9 === 8 ? 2 : 0],
    type: CONTACT_TYPES[i % CONTACT_TYPES.length],
    industry: INDUSTRIES[(i * 5) % INDUSTRIES.length],
    priority: PRIORITIES[i % PRIORITIES.length],
    expertise: EXPERTISE[i % EXPERTISE.length],
    owner: null,
    meetings: (i * 17) % 95,
    emailsSent: sent,
    emailsOpened: opened,
    emailsClicked: opened > 3 ? 1 : 0,
    invitations: (i * 3) % 7,
    attended: (i * 2) % 6,
  };
});

const percent = (part: number, whole: number) =>
  whole === 0 ? "0%" : `${Math.round((part / whole) * 100)}%`;

function Badge({ children, tone = "solid" }: { children: string; tone?: "solid" | "soft" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "1px var(--spacing-sm)",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--font-size-xs)",
        fontWeight: "var(--font-weight-semibold)",
        color: "var(--color-white)",
        background: tone === "solid"
          ? "var(--color-primary)"
          : "color-mix(in srgb, var(--color-primary) 55%, var(--color-white))",
      }}
    >
      {children}
    </span>
  );
}

export const contactIdentityColumns: TableColumn<Contact>[] = [
  {
    id: "name",
    header: "Name",
    description: "Contact name",
    rowHeader: true,
    sticky: "left",
    width: 180,
    href: (row) => `#contact-${row.id}`,
  },
  {
    id: "organization",
    header: "Organisation",
    description: "Primary organisation",
    sticky: "left",
    truncate: true,
    maxWidth: 200,
    cell: ({ row }) => (
      <a href={`#organization-${row.id}`} style={{ color: "inherit", textDecoration: "underline" }}>
        {row.organization}
      </a>
    ),
    getSearchValue: (row) => row.organization,
  },
];

export const contactProfileColumns: TableColumn<Contact>[] = [
  { id: "type", header: "Type", description: "Contact type" },
  { id: "industry", header: "Industry", description: "Primary industry", truncate: true, maxWidth: 160 },
  {
    id: "priority",
    header: "Priority",
    description: "Account priority",
    sortFn: (a, b) => a.priority.join().localeCompare(b.priority.join()),
    cell: ({ row }) =>
      row.priority.length > 0 && (
        <span style={{ display: "inline-flex", gap: "var(--spacing-xs)" }}>
          {row.priority.map((item, index) => (
            <Badge key={item} tone={index === 0 ? "solid" : "soft"}>{item}</Badge>
          ))}
        </span>
      ),
  },
  {
    id: "expertise",
    header: "Expertise",
    description: "Area of influence",
    wrap: true,
    sortFn: (a, b) => a.expertise.join().localeCompare(b.expertise.join()),
    cell: ({ row }) =>
      row.expertise.length > 0 && (
        <span>
          {row.expertise.map((item, index) => (
            <span key={item}>
              <a href={`#expertise-${item}`} style={{ color: "inherit", textDecoration: "underline" }}>{item}</a>
              {index < row.expertise.length - 1 && ", "}
            </span>
          ))}
        </span>
      ),
  },
  { id: "owner", header: "Owner", description: "Account owner" },
];

export const contactEngagementColumns: TableColumn<Contact>[] = [
  { id: "meetings", header: "Meetings", description: "All meetings", align: "right" },
  {
    id: "emails",
    header: "Emails",
    columns: [
      { id: "emailsSent", header: "Sent", align: "right" },
      { id: "emailsOpened", header: "Opened", align: "right" },
      {
        id: "openedRate",
        header: "Opened rate",
        align: "right",
        accessor: (row) => (row.emailsSent ? row.emailsOpened / row.emailsSent : 0),
        cell: ({ row }) => percent(row.emailsOpened, row.emailsSent),
        exportValue: (row) => percent(row.emailsOpened, row.emailsSent),
      },
      { id: "emailsClicked", header: "Clicked", align: "right" },
      {
        id: "clickedRate",
        header: "Clicked rate",
        align: "right",
        accessor: (row) => (row.emailsSent ? row.emailsClicked / row.emailsSent : 0),
        cell: ({ row }) => percent(row.emailsClicked, row.emailsSent),
        exportValue: (row) => percent(row.emailsClicked, row.emailsSent),
      },
    ],
  },
  {
    id: "events",
    header: "Events",
    columns: [
      { id: "invitations", header: "No. of invitations", align: "right" },
      { id: "attended", header: "Attended", align: "right" },
    ],
  },
];

export function renderContactSummary(row: Contact) {
  return (
    <span>
      <strong>{row.name}</strong> ({row.type}, {row.industry}) attended {row.attended} of{" "}
      {row.invitations} events.
    </span>
  );
}

export const truncationColumns: TableColumn<Contact>[] = [
  { id: "name", header: "Name", rowHeader: true },
  { id: "organization", header: "Organisation (truncated at 200px)", truncate: true, maxWidth: 200 },
  { id: "industry", header: "Primary industry", truncate: true, maxWidth: 140 },
  { id: "emailsOpened", header: "Opened emails this quarter", width: 110, align: "right" },
  { id: "invitations", header: "No. of invitations", width: 100, align: "right" },
];

export const contactPagination: TablePaginationOptions = {
  defaultPageSize: 10,
  align: "center",
  showPageSizeLabel: false,
};

export const contactCommonArgs = {
  data: contacts,
  sortable: true,
  striped: true,
  wrapHeaders: true,
  emptyCellValue: "-",
  pagination: contactPagination,
  labels: { range: centeredRangeLabel },
} as const;
