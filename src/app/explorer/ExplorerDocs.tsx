import { useState, type ReactNode } from "react";
import { Button, Icon } from "@/index";
import type { ExplorerComponent, ExplorerControl, ExplorerValue } from "../explorer-config";
import { getComponentDefaults } from "./args";
import type { PreviewLayout } from "./types";
import { LayoutToggle } from "./LayoutToggle";

type Props = {
  component: ExplorerComponent;
  code: string;
  preview: ReactNode;
  layout?: PreviewLayout;
  onLayoutChange?: (layout: PreviewLayout) => void;
  showLayoutToggle?: boolean;
  /** Story currently selected in the sidebar, highlighted in the stories grid. */
  activeStory?: string;
  /** Opens a story on the Canvas tab. */
  onOpenStory?: (story: string) => void;
};

type PropRow = { name: string; type: string; defaultValue: string; description: string };

const buttonProps: PropRow[] = [
  { name: "children", type: "ReactNode", defaultValue: "—", description: "Content displayed inside the button." },
  { name: "variant", type: '"primary" | "secondary" | "outline" | "ghost" | "danger"', defaultValue: "primary", description: "Controls the visual style." },
  { name: "size", type: '"small" | "medium" | "large"', defaultValue: "medium", description: "Controls the button dimensions and typography." },
  { name: "loading", type: "boolean", defaultValue: "false", description: "Shows a spinner and disables the button." },
  { name: "disabled", type: "boolean", defaultValue: "false", description: "Prevents interaction and applies disabled styling." },
  { name: "fullWidth", type: "boolean", defaultValue: "false", description: "Expands the button to the available width." },
  { name: "leftIcon / rightIcon", type: "ReactNode", defaultValue: "—", description: "Optional icons rendered beside the content." },
];

const buttonUsageCode = `<Button variant="primary">
  Primary Button
</Button>`;

const buttonExamplesCode = `<Button variant="secondary" size="small">Secondary</Button>
<Button variant="outline" size="medium">Outline</Button>
<Button variant="danger" size="large">Delete</Button>`;

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

function controlRows(component: ExplorerComponent): PropRow[] {
  const defaults = getComponentDefaults(component);
  return component.controls.map((control) => ({
    name: control.name,
    type: controlType(control),
    defaultValue: formatDefault(defaults[control.name]),
    description: control.description,
  }));
}

export function ExplorerDocs({
  component,
  code,
  preview,
  layout,
  onLayoutChange,
  showLayoutToggle,
  activeStory,
  onOpenStory,
}: Props) {
  const isButton = component.name === "Button";
  const importCode = `import { ${component.name} } from "@involead/ui";
import "@involead/ui/ui.css";`;

  return (
    <article className="docs-page">
      <header className="docs-header">
        <div className="docs-eyebrow">Components / {component.name}</div>
        <h1>{component.name}</h1>
        <p className="docs-lead">{component.description}</p>
        <div className="docs-meta">
          <span>
            <Icon name="star" size={12} />
            {component.stories.length} stories
          </span>
          <span>
            <Icon name="check-circle" size={12} />
            Accessible
          </span>
          <span>
            <Icon name="edit" size={12} />
            TypeScript
          </span>
        </div>
      </header>

      <section className="docs-section" aria-labelledby="docs-import">
        <h2 id="docs-import">Import</h2>
        <CodeBlock title="Import" code={importCode} />
      </section>

      <section className="docs-section" aria-labelledby="docs-example">
        <h2 id="docs-example">{isButton ? "Basic usage" : "Live example"}</h2>
        <ExampleCard
          code={isButton ? buttonUsageCode : code}
          toolbar={
            !isButton && showLayoutToggle && layout && onLayoutChange ? (
              <LayoutToggle layout={layout} onChange={onLayoutChange} />
            ) : null
          }
        >
          {isButton ? <Button variant="primary">Primary Button</Button> : preview}
        </ExampleCard>
      </section>

      <section className="docs-section" aria-labelledby="docs-props">
        <h2 id="docs-props">Props</h2>
        <PropsTable rows={isButton ? buttonProps : controlRows(component)} />
      </section>

      <section className="docs-section" aria-labelledby="docs-stories">
        <h2 id="docs-stories">Stories</h2>
        <p className="docs-section-lead">Open a story to try it on the canvas with live controls.</p>
        <div className="story-grid">
          {component.stories.map((story) => (
            <button
              type="button"
              className={`story-card${story.name === activeStory ? " active" : ""}`}
              key={story.name}
              onClick={() => onOpenStory?.(story.name)}
            >
              <span className="story-card-text">
                <strong>{story.name}</strong>
                <span>{story.description}</span>
              </span>
              <Icon name="arrow-right" size={14} />
            </button>
          ))}
        </div>
      </section>

      <section className="docs-section" aria-labelledby="docs-a11y">
        <h2 id="docs-a11y">Accessibility</h2>
        <ul className="docs-a11y">
          {component.accessibility.map((guideline) => (
            <li key={guideline}>
              <Icon name="check" size={14} />
              <span>{guideline}</span>
            </li>
          ))}
        </ul>
      </section>

      {isButton ? (
        <section className="docs-section" aria-labelledby="docs-examples">
          <h2 id="docs-examples">Examples</h2>
          <ExampleCard code={buttonExamplesCode}>
            <Button variant="secondary" size="small">Secondary</Button>
            <Button variant="outline" size="medium">Outline</Button>
            <Button variant="danger" size="large">Delete</Button>
          </ExampleCard>
        </section>
      ) : null}
    </article>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="docs-copy"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
    >
      <Icon name={copied ? "check" : "copy"} size={12} />
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({ title, code }: { title: string; code: string }) {
  return (
    <figure className="docs-codeblock">
      <figcaption>
        <span>{title}</span>
        <CopyButton text={code} />
      </figcaption>
      <pre>
        <code>{code}</code>
      </pre>
    </figure>
  );
}

/** A live preview with its code behind a "Show code" toggle. */
function ExampleCard({
  code,
  toolbar,
  children,
}: {
  code: string;
  toolbar?: ReactNode;
  children: ReactNode;
}) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="docs-example-card">
      {toolbar ? <div className="docs-example-toolbar">{toolbar}</div> : null}
      <div className="docs-example">{children}</div>
      <div className="docs-example-actions">
        <button type="button" aria-expanded={showCode} onClick={() => setShowCode((value) => !value)}>
          <Icon name={showCode ? "chevron-up" : "chevron-down"} size={12} />
          {showCode ? "Hide code" : "Show code"}
        </button>
        <CopyButton text={code} />
      </div>
      {showCode ? (
        <pre className="docs-example-code">
          <code>{code}</code>
        </pre>
      ) : null}
    </div>
  );
}

function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="docs-table-wrap">
      <table className="docs-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>
                <code className="docs-prop-name">{row.name}</code>
              </td>
              <td>
                <code className="docs-prop-type">{row.type}</code>
              </td>
              <td>
                {row.defaultValue === "—" ? (
                  <span className="docs-muted">—</span>
                ) : (
                  <code className="docs-prop-default">{row.defaultValue}</code>
                )}
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type ExplorerControlValue = ExplorerValue;
