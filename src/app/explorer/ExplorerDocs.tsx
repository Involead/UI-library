import type { ReactNode } from "react";
import { Button } from "@/index";
import type { ExplorerComponent, ExplorerValue } from "../explorer-config";
import type { PreviewLayout } from "./types";
import { LayoutToggle } from "./LayoutToggle";

type Props = {
  component: ExplorerComponent;
  code: string;
  preview: ReactNode;
  layout?: PreviewLayout;
  onLayoutChange?: (layout: PreviewLayout) => void;
  showLayoutToggle?: boolean;
};

export function ExplorerDocs({
  component,
  code,
  preview,
  layout,
  onLayoutChange,
  showLayoutToggle,
}: Props) {
  if (component.name === "Button") {
    return (
      <article className="docs-page">
        <div className="docs-eyebrow">Components / Button</div>
        <h1>Button</h1>
        <p>
          Buttons communicate actions that users can take. This documentation
          mirrors the Button Storybook autodocs page and uses the same
          component implementation.
        </p>

        <h2>Import</h2>
        <pre className="docs-code">{`import { Button } from "@involead/ui";
import "@involead/ui/ui.css";`}</pre>

        <h2>Basic usage</h2>
        <div className="docs-example">
          <Button variant="primary">Primary Button</Button>
        </div>
        <pre className="docs-code">{`<Button variant="primary">
  Primary Button
</Button>`}</pre>

        <h2>Props</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>children</td>
              <td>ReactNode</td>
              <td>—</td>
              <td>Content displayed inside the button.</td>
            </tr>
            <tr>
              <td>variant</td>
              <td>primary | secondary | outline | ghost | danger</td>
              <td>primary</td>
              <td>Controls the visual style.</td>
            </tr>
            <tr>
              <td>size</td>
              <td>small | medium | large</td>
              <td>medium</td>
              <td>Controls the button dimensions and typography.</td>
            </tr>
            <tr>
              <td>loading</td>
              <td>boolean</td>
              <td>false</td>
              <td>Shows a spinner and disables the button.</td>
            </tr>
            <tr>
              <td>disabled</td>
              <td>boolean</td>
              <td>false</td>
              <td>Prevents interaction and applies disabled styling.</td>
            </tr>
            <tr>
              <td>fullWidth</td>
              <td>boolean</td>
              <td>false</td>
              <td>Expands the button to the available width.</td>
            </tr>
            <tr>
              <td>leftIcon / rightIcon</td>
              <td>ReactNode</td>
              <td>undefined</td>
              <td>Optional icons rendered beside the content.</td>
            </tr>
          </tbody>
        </table>

        <StoriesSection stories={component.stories} />
        <AccessibilitySection guidelines={component.accessibility} />

        <h2>Examples</h2>
        <div className="docs-example">
          <Button variant="secondary" size="small">Secondary</Button>
          <Button variant="outline" size="medium">Outline</Button>
          <Button variant="danger" size="large">Delete</Button>
        </div>
      </article>
    );
  }

  return (
    <article className="docs-page">
      <div className="docs-eyebrow">Components / {component.name}</div>
      <h1>{component.name}</h1>
      <p>{component.description}</p>

      <h2>Import</h2>
      <pre className="docs-code">{`import { ${component.name} } from "@involead/ui";
import "@involead/ui/ui.css";`}</pre>

      <h2>Live example</h2>
      {showLayoutToggle && layout && onLayoutChange ? (
        <div className="stage-toolbar">
          <LayoutToggle layout={layout} onChange={onLayoutChange} />
        </div>
      ) : null}
      <div className="docs-example">{preview}</div>
      <pre className="docs-code">{code}</pre>

      <h2>Props and controls</h2>
      <table className="docs-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Control</th>
            <th>Options</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {component.controls.map((control) => (
            <tr key={control.name}>
              <td>{control.name}</td>
              <td>{control.kind}</td>
              <td>{control.options?.join(" | ") ?? "—"}</td>
              <td>{control.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <StoriesSection stories={component.stories} />
      <AccessibilitySection guidelines={component.accessibility} />
    </article>
  );
}

function StoriesSection({
  stories,
}: {
  stories: { name: string; description: string }[];
}) {
  return (
    <>
      <h2>Stories</h2>
      <div className="story-grid">
        {stories.map((story) => (
          <div className="story-card" key={story.name}>
            <strong>{story.name}</strong>
            <span>{story.description}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function AccessibilitySection({ guidelines }: { guidelines: string[] }) {
  return (
    <>
      <h2>Accessibility</h2>
      <ul>
        {guidelines.map((guideline) => (
          <li key={guideline}>{guideline}</li>
        ))}
      </ul>
    </>
  );
}

export type ExplorerControlValue = ExplorerValue;
