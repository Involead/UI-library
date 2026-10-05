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
} from "@/index";
import Image from "next/image";
import packageJson from "../../../package.json";
import {
  explorerComponents,
  type ExplorerControl,
  type ExplorerValue,
} from "../explorer-config";
import { getComponentDefaults } from "./args";

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

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** How a control's value reads in the props table's Type column. */
function controlType(control: ExplorerControl) {
  if (control.kind === "select" && control.options?.length) {
    return control.options.map((option) => `"${option}"`).join(" | ");
  }
  if (control.kind === "multi-select") return "string[]";
  if (control.kind === "json") return "object[]";
  return control.kind === "boolean" ? "boolean" : "string";
}

function formatDefault(value: ExplorerValue | undefined) {
  if (value === undefined || value === null || value === "") return "—";
  if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
  return String(value);
}

/** A miniature of this explorer: sidebar, Docs tab, props table, and a live story. */
function HeroShowcase({ groups }: { groups: Props["groups"] }) {
  const [active, setActive] = useState(groups[0]?.title ?? "");
  const definition = explorerComponents.find((component) => component.name === active);
  const stories = groups.find((group) => group.title === active)?.items ?? [];
  const defaults = definition ? getComponentDefaults(definition) : {};

  return (
    <div className="intro-app" role="group" aria-label="Preview of the component explorer">
      <aside className="intro-app-sidebar">
        <div className="intro-app-brand">
          <Image src={`${basePath}/involead-logo.jpe`} alt="" width={34} height={18} />
          <span>
            InvoLead
            <small>UI Library</small>
          </span>
        </div>
        <div className="intro-app-search" aria-hidden="true">
          <Icon name="search" size={10} />
          Find components
        </div>
        <div className="intro-app-item muted">
          <Icon name="info" size={10} />
          Introduction
        </div>
        <div className="intro-app-label">Components</div>
        {groups.map((group) => (
          <div key={group.title}>
            <button
              type="button"
              className={`intro-app-item${group.title === active ? " active" : ""}`}
              aria-pressed={group.title === active}
              onClick={() => setActive(group.title)}
            >
              <span className="intro-app-grid" aria-hidden="true" />
              {group.title}
            </button>
            {group.title === active
              ? group.items.slice(0, 5).map((story, index) => (
                  <div key={story} className={`intro-app-story${index === 0 ? " current" : ""}`}>
                    {story}
                  </div>
                ))
              : null}
          </div>
        ))}
      </aside>

      <div className="intro-app-main">
        <div className="intro-app-tabs" aria-hidden="true">
          <span>
            <Icon name="eye" size={10} />
            Canvas
          </span>
          <span className="active">
            <Icon name="edit" size={10} />
            Docs
          </span>
        </div>

        <div className="intro-app-docs" aria-live="polite">
          <h2>{active}</h2>
          {definition ? <p>{definition.description}</p> : null}

          {definition ? (
            <>
              <h3>Props</h3>
              <table className="intro-app-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Type</th>
                    <th scope="col">Default</th>
                  </tr>
                </thead>
                <tbody>
                  {definition.controls.slice(0, 4).map((control) => (
                    <tr key={control.name}>
                      <td><code>{control.name}</code></td>
                      <td>{control.description}</td>
                      <td className="intro-app-type">{controlType(control)}</td>
                      <td>{formatDefault(defaults[control.name])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : null}

          <h3>Stories</h3>
          <div className="intro-app-story-title">{stories[0] ?? active}</div>
          <div className="intro-app-canvas">
            <div className="intro-app-canvas-stage" inert>
              {componentPreviews[active] ?? null}
            </div>
            <div className="intro-app-canvas-actions" aria-hidden="true">
              <span>Show code</span>
              <span>
                <Icon name="copy" size={10} />
                Copy
              </span>
            </div>
          </div>
        </div>
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
        <HeroShowcase groups={groups} />
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
      {/* <section className="intro-section" aria-labelledby="intro-theming">
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
      </section> */}

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
