import { useState, type ReactNode } from "react";
import {
  Button,
  Checkbox,
  Dropdown,
  Icon,
  Input,
  Radio,
  Table,
  Typography,
  type IconName,
  type TableColumn,
} from "@/index";
import { employees, StatusBadge, type Employee } from "@/components/Table/Table.samples";
import packageJson from "../../../package.json";
import { explorerComponents } from "../explorer-config";

type Props = {
  groups: { title: string; items: string[] }[];
  onSelectStory: (component: string, story: string) => void;
};

const REPOSITORY_URL = "https://github.com/Involead/UI-library";
const NPM_URL = "https://www.npmjs.com/package/@involead/ui";

const installCommands = {
  npm: "npm install @involead/ui",
  pnpm: "pnpm add @involead/ui",
  yarn: "yarn add @involead/ui",
} as const;

type PackageManager = keyof typeof installCommands;

const setupCode = `// app/layout.tsx (or your app's entry file)
import "@involead/ui/ui.css";`;

const usageCode = `"use client";

import { Button, Input } from "@involead/ui";

export function InviteForm() {
  return (
    <form>
      <Input label="Email" type="email" placeholder="you@company.com" required />
      <Button type="submit" variant="primary">
        Send invite
      </Button>
    </form>
  );
}`;

const themingCode = `/* globals.css: load after @involead/ui/ui.css */
:root {
  --color-primary: #7c3aed;
  --radius-md: 10px;
  --font-family-primary: "Inter", sans-serif;
}`;

const tokensCode = `import { tokens } from "@involead/ui";

const card = {
  padding: tokens.spacing.lg,         // "var(--spacing-lg)"
  borderRadius: tokens.radius.md,     // "var(--radius-md)"
  color: tokens.colors.textPrimary,   // "var(--color-text-primary)"
};`;

const principles: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "check-circle",
    title: "Accessible by default",
    body: "Semantic markup, labelled controls, keyboard support, and visible focus states come built in.",
  },
  {
    icon: "edit",
    title: "Strongly typed",
    body: "Every component ships TypeScript declarations, so props, variants, and callbacks autocomplete and type-check.",
  },
  {
    icon: "settings",
    title: "Token-driven theming",
    body: "Colors, spacing, radius, and type come from CSS custom properties you can override in one place.",
  },
  {
    icon: "home",
    title: "React-first",
    body: "Works in any React 19 app. Next.js is supported, but you don't need it to render a component.",
  },
  {
    icon: "lock",
    title: "Scoped, framework-free CSS",
    body: "CSS Modules keep styles isolated. No Tailwind, Bootstrap, or runtime CSS-in-JS needed.",
  },
  {
    icon: "star",
    title: "Tested and documented",
    body: "Storybook stories cover each component's important states, and every story runs as an automated browser test.",
  },
];

const pipeline: { label: string; title: string; body: string }[] = [
  { label: "01", title: "Design tokens", body: "CSS custom properties for color, spacing, radius, and type" },
  { label: "02", title: "Components", body: "React + TypeScript, styled with CSS Modules that read tokens" },
  { label: "03", title: "@involead/ui", body: "One entry point, built with Vite library mode" },
  { label: "04", title: "Your app", body: "Import components and the stylesheet. That's it." },
];

const packageOutputs = [
  { file: "dist/index.es.js", format: "ES module", use: "Modern bundlers: Vite, Next.js, webpack" },
  { file: "dist/index.cjs.js", format: "CommonJS", use: "require() and older tooling" },
  { file: "dist/ui.css", format: "Stylesheet", use: 'Imported once as "@involead/ui/ui.css"' },
  { file: "dist/types", format: "Type declarations", use: "Props and helpers for TypeScript" },
];

const explorerTour: { title: string; body: string }[] = [
  { title: "Canvas", body: "A live preview of the selected story, with zoom and layout controls." },
  { title: "Controls", body: "Change props and watch the component update instantly." },
  { title: "Actions", body: "A log of the events the component fires as you interact." },
  { title: "Code", body: "Ready-to-paste code for what you see. Edit it and apply it back." },
  { title: "Docs", body: "Usage notes, accessibility guidance, and every story on one page." },
];

const sampleIcons: IconName[] = ["home", "search", "bell", "mail", "settings", "user"];

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Editor", value: "editor" },
  { label: "Viewer", value: "viewer" },
];

const previewRows = [
  { id: 1, name: "Ava Patel", role: "Admin" },
  { id: 2, name: "Liam Kim", role: "Editor" },
];

/** Small, non-interactive previews for the component catalog. */
const componentPreviews: Record<string, ReactNode> = {
  Button: (
    <div className="intro-preview-row">
      <Button size="small">Primary</Button>
      <Button size="small" variant="outline">Outline</Button>
    </div>
  ),
  Input: <Input size="small" label="Email" placeholder="you@company.com" />,
  Dropdown: <Dropdown size="small" label="Role" options={roleOptions} defaultValue="editor" />,
  Checkbox: (
    <div className="intro-preview-column">
      <Checkbox size="small" label="Email updates" defaultChecked />
      <Checkbox size="small" label="Weekly digest" />
    </div>
  ),
  Radio: (
    <div className="intro-preview-column">
      <Radio size="small" name="intro-plan" label="Monthly" defaultChecked />
      <Radio size="small" name="intro-plan" label="Yearly" />
    </div>
  ),
  Typography: (
    <div className="intro-preview-column">
      <Typography variant="h4">Heading</Typography>
      <Typography variant="bodySmall" color="secondary">Body text that reads well.</Typography>
    </div>
  ),
  Icon: (
    <div className="intro-preview-row">
      {sampleIcons.map((name) => (
        <Icon key={name} name={name} size={20} />
      ))}
    </div>
  ),
  Table: (
    <Table
      size="small"
      ariaLabel="Team preview"
      data={previewRows}
      columns={[
        { id: "name", header: "Name", rowHeader: true },
        { id: "role", header: "Role" },
      ]}
    />
  ),
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="intro-copy"
      aria-label={copied ? "Copied" : label}
      title={copied ? "Copied" : label}
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      <Icon name={copied ? "check" : "copy"} size={14} />
      <span>{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function CodeBlock({ code, title }: { code: string; title: string }) {
  return (
    <figure className="intro-code">
      <figcaption>
        <span>{title}</span>
        <CopyButton text={code} label={`Copy ${title}`} />
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

function InstallCommand() {
  const [manager, setManager] = useState<PackageManager>("npm");
  const command = installCommands[manager];

  return (
    <div className="intro-install">
      <div className="intro-install-tabs" role="tablist" aria-label="Package manager">
        {(Object.keys(installCommands) as PackageManager[]).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={manager === item}
            className={manager === item ? "active" : undefined}
            onClick={() => setManager(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="intro-install-command">
        <code>
          <span aria-hidden="true">$ </span>
          {command}
        </code>
        <CopyButton text={command} label="Copy install command" />
      </div>
    </div>
  );
}

const showcaseMembers = employees.slice(0, 5);

const showcaseColumns: TableColumn<Employee>[] = [
  {
    id: "name",
    header: "Member",
    rowHeader: true,
    cell: ({ row }) => (
      <span className="intro-member">
        <span className="intro-avatar" aria-hidden="true">
          {row.name.split(" ").map((part) => part[0]).join("")}
        </span>
        <span>
          <span className="intro-member-name">{row.name}</span>
          <span className="intro-member-role">{row.role}</span>
        </span>
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.status} />,
  },
];

/** A small working screen built only from library components. */
function HeroShowcase() {
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("Ava Patel joined Engineering");
  const query = search.trim().toLowerCase();
  const rows = showcaseMembers.filter((row) =>
    `${row.name} ${row.role}`.toLowerCase().includes(query),
  );

  return (
    <div className="intro-collage" role="group" aria-label="Live example built with InvoLead UI">
      <div className="intro-showcase">
        <div className="intro-showcase-header">
          <div>
            <Typography variant="h5" as="h2">Team members</Typography>
            <Typography variant="caption" color="secondary">Live example. Try searching or selecting.</Typography>
          </div>
          <Button
            size="small"
            leftIcon={<Icon name="plus" size={14} />}
            onClick={() => setToast("Invite sent to a new teammate")}
          >
            Invite
          </Button>
        </div>
        <Input
          size="small"
          fullWidth
          placeholder="Search members"
          aria-label="Search members"
          leftIcon={<Icon name="search" size={14} />}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Table
          size="small"
          hoverable
          sortable
          selectionMode="multiple"
          defaultSelectedRowKeys={[2]}
          ariaLabel="Team members"
          data={rows}
          columns={showcaseColumns}
          labels={{ empty: "No members match your search" }}
        />
      </div>

      <div className="intro-float intro-float-settings" aria-hidden="true" inert>
        <span className="intro-float-title">Notifications</span>
        <Checkbox size="small" label="Email" defaultChecked />
        <Checkbox size="small" label="Weekly digest" />
      </div>

      <div className="intro-float intro-float-toast" role="status">
        <Icon name="check-circle" size={18} color="var(--color-success)" />
        <span>{toast}</span>
      </div>
    </div>
  );
}

export function ExplorerIntro({ groups, onSelectStory }: Props) {
  const storyCount = groups.reduce((total, group) => total + group.items.length, 0);
  const firstGroup = groups[0];
  const stats = [
    { value: String(groups.length), label: "Components" },
    { value: String(storyCount), label: "Live stories" },
    { value: "100%", label: "TypeScript" },
    { value: "0", label: "CSS frameworks needed" },
  ];

  return (
    <div className="docs-page intro-page">
      {/* Hero */}
      <section className="intro-hero" aria-labelledby="intro-title">
        <div className="intro-hero-copy">
          <div className="intro-badges">
            <span className="intro-badge">v{packageJson.version}</span>
            <span className="intro-badge muted">React 19 · TypeScript · Next.js ready</span>
          </div>
          <h1 id="intro-title">Build consistent InvoLead interfaces, faster.</h1>
          <p className="intro-lead">
            <strong>@involead/ui</strong> is a library of accessible, typed React components and design
            tokens. Use it to ship product screens that look and behave the same everywhere.
          </p>
          <div className="intro-cta">
            {firstGroup ? (
              <Button
                rightIcon={<Icon name="arrow-right" size={16} />}
                onClick={() => onSelectStory(firstGroup.title, firstGroup.items[0])}
              >
                Browse components
              </Button>
            ) : null}
            <a className="intro-link-button" href={REPOSITORY_URL} target="_blank" rel="noreferrer">
              View on GitHub
              <Icon name="external-link" size={14} />
            </a>
          </div>
          <InstallCommand />
        </div>
        <HeroShowcase />
      </section>

      <dl className="intro-stats">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.label}</dt>
            <dd>{stat.value}</dd>
          </div>
        ))}
      </dl>

      {/* Getting started */}
      <section className="intro-section" aria-labelledby="intro-start">
        <div className="intro-section-head">
          <div className="docs-eyebrow">Getting started</div>
          <h2 id="intro-start">Up and running in three steps</h2>
        </div>
        <ol className="intro-steps">
          <li>
            <div className="intro-step-text">
              <h3>Install the package</h3>
              <p>
                Add <code>@involead/ui</code> to your project. React and React DOM 19 are peer
                dependencies, so the library uses your app&apos;s copy.
              </p>
            </div>
            <CodeBlock title="Terminal" code={installCommands.npm} />
          </li>
          <li>
            <div className="intro-step-text">
              <h3>Import the stylesheet once</h3>
              <p>
                <code>ui.css</code> holds the design tokens and every component&apos;s styles. Load it
                once, at the root of your app.
              </p>
            </div>
            <CodeBlock title="app/layout.tsx" code={setupCode} />
          </li>
          <li>
            <div className="intro-step-text">
              <h3>Use the components</h3>
              <p>
                Import what you need from one entry point. In the Next.js App Router, interactive
                components go inside a <code>&quot;use client&quot;</code> boundary.
              </p>
            </div>
            <CodeBlock title="InviteForm.tsx" code={usageCode} />
          </li>
        </ol>
      </section>

      {/* How it works */}
      <section className="intro-section" aria-labelledby="intro-how">
        <div className="intro-section-head">
          <div className="docs-eyebrow">How it works</div>
          <h2 id="intro-how">From tokens to your app</h2>
          <p>
            Tokens define the visual language. Components consume the tokens, and one public entry
            point (<code>src/index.ts</code>) bundles them into the package. Internal files are never
            part of the API, so upgrades stay predictable.
          </p>
        </div>
        <ol className="intro-pipeline">
          {pipeline.map((step) => (
            <li key={step.label}>
              <span className="intro-pipeline-label">{step.label}</span>
              <strong>{step.title}</strong>
              <span>{step.body}</span>
            </li>
          ))}
        </ol>
        <div className="intro-table-wrap">
          <table className="docs-table intro-output-table">
            <caption>What the package ships</caption>
            <thead>
              <tr>
                <th scope="col">File</th>
                <th scope="col">Format</th>
                <th scope="col">Used by</th>
              </tr>
            </thead>
            <tbody>
              {packageOutputs.map((output) => (
                <tr key={output.file}>
                  <td>{output.file}</td>
                  <td>{output.format}</td>
                  <td>{output.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Principles */}
      <section className="intro-section" aria-labelledby="intro-principles">
        <div className="intro-section-head">
          <div className="docs-eyebrow">Principles</div>
          <h2 id="intro-principles">Built for production from day one</h2>
        </div>
        <ul className="intro-features">
          {principles.map((item) => (
            <li key={item.title}>
              <span className="intro-feature-icon" aria-hidden="true">
                <Icon name={item.icon} size={18} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Components */}
      <section className="intro-section" aria-labelledby="intro-components">
        <div className="intro-section-head">
          <div className="docs-eyebrow">Components</div>
          <h2 id="intro-components">Explore the library</h2>
          <p>Open a component to try its stories, change props live, and copy the code.</p>
        </div>
        <ul className="intro-catalog">
          {groups.map((group) => {
            const definition = explorerComponents.find((component) => component.name === group.title);
            return (
              <li key={group.title} className="intro-catalog-card">
                <div className="intro-catalog-preview" aria-hidden="true" inert>
                  {componentPreviews[group.title] ?? <span className="intro-monogram">{group.title[0]}</span>}
                </div>
                <div className="intro-catalog-body">
                  <h3>
                    <button
                      type="button"
                      className="intro-catalog-link"
                      onClick={() => onSelectStory(group.title, group.items[0])}
                    >
                      {group.title}
                    </button>
                  </h3>
                  {definition ? <p>{definition.description}</p> : null}
                  <span className="intro-catalog-meta">
                    {group.items.length} {group.items.length === 1 ? "story" : "stories"}
                    <Icon name="arrow-right" size={14} />
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Theming */}
      <section className="intro-section" aria-labelledby="intro-theming">
        <div className="intro-section-head">
          <div className="docs-eyebrow">Theming</div>
          <h2 id="intro-theming">Make it yours with tokens</h2>
          <p>
            Every component reads its colors, spacing, radius, and type from CSS custom properties.
            Override them globally, or on any element to theme just that part of the page. Use the
            typed <code>tokens</code> export to reference the same values from TypeScript.
          </p>
        </div>
        <div className="intro-two-column">
          <CodeBlock title="Override tokens" code={themingCode} />
          <CodeBlock title="Typed tokens" code={tokensCode} />
        </div>
      </section>

      {/* Explorer tour */}
      <section className="intro-section" aria-labelledby="intro-tour">
        <div className="intro-section-head">
          <div className="docs-eyebrow">Using this explorer</div>
          <h2 id="intro-tour">Everything you need on one screen</h2>
        </div>
        <ol className="intro-tour">
          {explorerTour.map((item, index) => (
            <li key={item.title}>
              <span className="intro-tour-index">{index + 1}</span>
              <div>
                <strong>{item.title}</strong>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <footer className="intro-footer">
        <div>
          <strong>InvoLead UI</strong>
          <span>Version {packageJson.version}</span>
        </div>
        <nav aria-label="Project links">
          <a href={REPOSITORY_URL} target="_blank" rel="noreferrer">
            GitHub <Icon name="external-link" size={12} />
          </a>
          <a href={NPM_URL} target="_blank" rel="noreferrer">
            npm <Icon name="external-link" size={12} />
          </a>
        </nav>
      </footer>
    </div>
  );
}
