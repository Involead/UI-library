import type { ExplorerArgs } from "../explorer-config";

function getString(args: ExplorerArgs, key: string, fallback = ""): string {
  return typeof args[key] === "string" ? args[key] : fallback;
}

export function formatSwitchCode(args: ExplorerArgs, composition?: string): string {
  const label = getString(args, "label", "Enable notifications");
  const helperText = getString(args, "helperText");
  const error = getString(args, "error");
  const size = getString(args, "size", "medium");
  const color = getString(args, "color", "primary");
  const labelPlacement = getString(args, "labelPlacement", "end");
  
  const disabled = args.disabled === true;
  const loading = args.loading === true;
  const defaultChecked = args.defaultChecked === true;

  /* ---------- Composition: colors ---------- */

  if (composition === "colors") {
    return `import { Switch } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Switch color="primary" defaultChecked />
  <Switch color="secondary" defaultChecked />
  <Switch color="success" defaultChecked />
  <Switch color="error" defaultChecked />
  <Switch color="warning" defaultChecked />
</>`;
  }

  /* ---------- Composition: sizes ---------- */

  if (composition === "sizes") {
    return `import { Switch } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Switch size="small" defaultChecked />
  <Switch size="medium" defaultChecked />
  <Switch size="large" defaultChecked />
</>`;
  }

  /* ---------- Composition: states ---------- */

  if (composition === "states") {
    return `import { Switch } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Switch label="Off" />
  <Switch label="On" defaultChecked />
  <Switch label="Disabled" disabled />
  <Switch label="Loading" loading />
</>`;
  }

  /* ---------- Composition: inherit ---------- */

  if (composition === "inherit") {
    return `import { Switch } from "@involead/ui";
import "@involead/ui/ui.css";

// Wrap the Switch in any element that sets a color.
<>
  <span style={{ color: "var(--color-primary)" }}>
    <Switch color="inherit" defaultChecked />
  </span>
  <span style={{ color: "var(--color-error)" }}>
    <Switch color="inherit" defaultChecked />
  </span>
  <span style={{ color: "var(--color-success)" }}>
    <Switch color="inherit" defaultChecked />
  </span>
  <span style={{ color: "var(--color-warning)" }}>
    <Switch color="inherit" defaultChecked />
  </span>
</>`;
  }

  /* ---------- Default ---------- */

  const props: string[] = [];
  if (label) props.push(`  label="${label}"`);
  if (size !== "medium") props.push(`  size="${size}"`);
  if (color !== "primary") props.push(`  color="${color}"`);
  if (labelPlacement !== "end") props.push(`  labelPlacement="${labelPlacement}"`);
  if (defaultChecked) props.push(`  defaultChecked`);
  if (disabled) props.push(`  disabled`);
  if (loading) props.push(`  loading`);
  if (helperText) props.push(`  helperText="${helperText}"`);
  if (error) props.push(`  error="${error}"`);

  return `import { Switch } from "@involead/ui";
import "@involead/ui/ui.css";

<Switch
${props.join("\n")}
/>`;
}