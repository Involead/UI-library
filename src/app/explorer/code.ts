import { icons } from "@/icons";
import { iconColors, type ExplorerArgs, type ExplorerComponent, type ExplorerValue } from "../explorer-config";
import { getComponentDefaults } from "./args";
import { formatTableCode } from "./tableCode";
import { iconSizes, radioGroupOptions, typographyColors, typographyVariants, type TypographyVariant } from "./types";

export function formatExplorerCode(
  component: string,
  args: ExplorerArgs,
  composition?: ExplorerComponent["stories"][number]["composition"],
): string {
  if (component === "Table") return formatTableCode(args, composition);
  if (component === "Modal") return formatModalCode(args, composition);
  const componentCode = (nextArgs: ExplorerArgs): string =>
    formatExplorerCode(component, nextArgs).split("\n\n").slice(1).join("\n\n");
  if (component === "Dropdown" && composition) {
    const orientation = args.orientation === "vertical" ? "vertical" : "horizontal";
    let options = "[]";
    try {
      options = JSON.stringify(JSON.parse(typeof args.options === "string" ? args.options : "[]"), null, 2);
    } catch {
      // Invalid options JSON is reported by the preview; keep the code readable.
    }
    const size = typeof args.size === "string" && args.size ? args.size : "medium";
    const stateArgs: ExplorerArgs = {
      size,
      searchable: args.searchable === true,
      clearable: args.clearable === true,
    };
    const allArgs: ExplorerArgs = { disabled: args.disabled === true };
    const examples: ExplorerArgs[] =
      composition === "states"
        ? [
            { label: "Default", placeholder: "Select a fruit", ...stateArgs },
            { label: "With value", defaultValue: "cherry", ...stateArgs },
            { label: "With helper text", placeholder: "Select a fruit", helperText: "You can change this later in settings.", ...stateArgs },
            { label: "Error", placeholder: "Select a fruit", error: "Please select a fruit.", required: true, ...stateArgs },
            { label: "Disabled", placeholder: "Select a fruit", disabled: true, ...stateArgs },
            { label: "Disabled with value", defaultValue: "mango", disabled: true, ...stateArgs },
            { label: "Multi — error", multiple: true, placeholder: "Select fruits", defaultValue: ["apple"], error: "Select at least two fruits.", ...stateArgs },
            { label: "Multi — disabled", multiple: true, defaultValue: ["apple", "grape"], disabled: true, ...stateArgs },
            { label: "Disabled option (Pineapple)", placeholder: "Open to see", helperText: "Disabled options can't be highlighted or selected.", ...stateArgs },
            { label: "Value not in options", placeholder: "Select a fruit", defaultValue: "kiwi", helperText: "An unmatched value falls back to the placeholder.", ...stateArgs },
          ]
        : composition === "all"
          ? [
              { label: "Small", size: "small", placeholder: "Select a fruit", ...allArgs },
              { label: "Medium", size: "medium", placeholder: "Select a fruit", ...allArgs },
              { label: "Large", size: "large", placeholder: "Select a fruit", ...allArgs },
              { label: "Single select", placeholder: "Select a fruit", ...allArgs },
              { label: "Single — searchable & clearable", defaultValue: "banana", searchable: true, clearable: true, ...allArgs },
              { label: "Single — error", placeholder: "Select a fruit", error: "Please select a fruit.", ...allArgs },
              { label: "Multi select", multiple: true, placeholder: "Select fruits", defaultValue: ["apple", "mango"], ...allArgs },
              { label: "Multi — searchable & clearable", multiple: true, placeholder: "Select fruits", defaultValue: ["cherry", "grape"], searchable: true, clearable: true, ...allArgs },
              { label: "Multi — many selected", multiple: true, defaultValue: ["apple", "banana", "cherry", "grape", "mango", "orange", "strawberry"], clearable: true, ...allArgs },
            ]
          : [];
    const wrapperStyle = orientation === "horizontal"
      ? '{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px" }'
      : '{ display: "flex", flexDirection: "column", gap: "16px" }';
    const exampleCode = examples
      .map((example) => componentCode(example).replace("<Dropdown\n", "<Dropdown\n  options={options}\n"))
      .join("\n");
    return `import { Dropdown } from "@involead/ui";\nimport "@involead/ui/ui.css";\n\nconst options = ${options};\n\n<div style={${wrapperStyle}}>\n${exampleCode}\n</div>`;
  }
  if (component === "Checkbox" && composition) {
    const orientation = args.orientation === "vertical" ? "vertical" : "horizontal";
    const componentArgs = Object.fromEntries(
      Object.entries(args).filter(([key]) => key !== "orientation"),
    ) as ExplorerArgs;
    const examples: ExplorerArgs[] =
      composition === "all"
        ? [
            { ...componentArgs, label: "Unchecked", checked: false },
            { ...componentArgs, label: "Checked", checked: true },
            { ...componentArgs, label: "Disabled", checked: false, disabled: true },
            { ...componentArgs, label: "Disabled checked", checked: true, disabled: true },
            { ...componentArgs, label: "With helper text", helperText: "You can change this later in settings." },
            { ...componentArgs, label: "With error", error: "You must accept the terms to continue." },
          ]
        : composition === "sizes"
          ? (["small", "medium", "large"] as const).map((size) => ({
              ...componentArgs,
              size,
              label: size[0].toUpperCase() + size.slice(1),
            }))
          : composition === "states"
            ? [
                { ...componentArgs, label: "Unchecked", checked: false },
                { ...componentArgs, label: "Checked", checked: true },
                { ...componentArgs, label: "Disabled", checked: false, disabled: true },
                { ...componentArgs, label: "Disabled checked", checked: true, disabled: true },
                { ...componentArgs, label: "Error", error: "This field is required." },
              ]
            : composition === "label-clickable"
              ? [
                  { ...componentArgs, label: "Clicking this label toggles the checkbox", labelClickable: true },
                  { ...componentArgs, label: "Only the checkbox itself toggles", labelClickable: false },
                ]
              : [];
    const wrapperStyle = orientation === "horizontal"
      ? '{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px" }'
      : '{ display: "flex", flexDirection: "column", gap: "16px" }';
    return `import { Checkbox } from "@involead/ui";\nimport "@involead/ui/ui.css";\n\n<div style={${wrapperStyle}}>\n${examples.map(componentCode).join("\n")}\n</div>`;
  }
  if (component === "Radio" && composition) {
    const orientation = args.orientation === "vertical" ? "vertical" : "horizontal";
    const componentArgs = Object.fromEntries(
      Object.entries(args).filter(([key]) => key !== "orientation"),
    ) as ExplorerArgs;
    const examples: ExplorerArgs[] =
      composition === "all"
        ? [
            { ...componentArgs, label: "Unchecked", checked: false },
            { ...componentArgs, label: "Checked", checked: true },
            { ...componentArgs, label: "Disabled", checked: false, disabled: true },
            { ...componentArgs, label: "Disabled checked", checked: true, disabled: true },
            { ...componentArgs, label: "With helper text", helperText: "We'll send a summary once a day." },
            { ...componentArgs, label: "With error", error: "Please choose a notification method." },
          ]
        : composition === "sizes"
          ? (["small", "medium", "large"] as const).map((size) => ({
              ...componentArgs,
              size,
              label: size[0].toUpperCase() + size.slice(1),
            }))
          : composition === "states"
            ? [
                { ...componentArgs, label: "Unchecked", checked: false },
                { ...componentArgs, label: "Checked", checked: true },
                { ...componentArgs, label: "Disabled", checked: false, disabled: true },
                { ...componentArgs, label: "Disabled checked", checked: true, disabled: true },
                { ...componentArgs, label: "Error", error: "This field is required." },
                { ...componentArgs, label: "Error checked", checked: true, error: true },
              ]
            : composition === "group"
              ? radioGroupOptions.map((option, index) => ({
                  ...componentArgs,
                  checked: null,
                  name: "notifications",
                  value: option.value,
                  label: option.label,
                  ...(index === 0 ? { defaultChecked: true } : {}),
                }))
              : composition === "label-clickable"
                ? [
                    { ...componentArgs, label: "Clicking this label selects the radio", labelClickable: true },
                    { ...componentArgs, label: "Only the circle itself selects", labelClickable: false },
                  ]
                : [];
    const wrapperStyle = orientation === "horizontal"
      ? '{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px" }'
      : '{ display: "flex", flexDirection: "column", gap: "16px" }';
    const groupAttributes = composition === "group"
      ? ' role="radiogroup" aria-label="Notification method"'
      : "";
    return `import { Radio } from "@involead/ui";\nimport "@involead/ui/ui.css";\n\n<div${groupAttributes} style={${wrapperStyle}}>\n${examples.map(componentCode).join("\n")}\n</div>`;
  }
  if (component === "Typography" && composition) {
    const orientation = args.orientation === "horizontal" ? "horizontal" : "vertical";
    const variants: TypographyVariant[] =
      composition === "headings"
        ? ["h1", "h2", "h3", "h4", "h5", "h6"]
        : typographyVariants;
    const examples: ExplorerArgs[] =
      composition === "all" || composition === "headings"
        ? variants.map((variant) => ({
            ...args,
            variant,
            children:
              variant === "body" || variant === "bodySmall"
                ? "The quick brown fox jumps over the lazy dog."
                : variant === "label"
                  ? "Email address"
                  : variant === "caption"
                    ? "Last updated 2 hours ago"
                    : `Heading ${variant.slice(1)}`,
          }))
        : composition === "colors"
          ? typographyColors.map((color) => ({
              ...args,
              color,
              children: `${color[0].toUpperCase()}${color.slice(1)} text color`,
            }))
          : [];
    const wrapperStyle = orientation === "horizontal"
      ? '{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px" }'
      : '{ display: "flex", flexDirection: "column", gap: "16px" }';
    return `import { Typography } from "@involead/ui";\nimport "@involead/ui/ui.css";\n\n<div style={${wrapperStyle}}>\n${examples.map(componentCode).join("\n")}\n</div>`;
  }
  if (component === "Icon" && composition) {
    const orientation = args.orientation === "vertical" ? "vertical" : "horizontal";
    const componentArgs = Object.fromEntries(
      Object.entries(args).filter(([key]) => key !== "orientation" && key !== "title"),
    ) as ExplorerArgs;
    const wrapperStyle = orientation === "horizontal"
      ? '{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "16px" }'
      : '{ display: "flex", flexDirection: "column", gap: "16px" }';
    const imports = `import { Icon } from "@involead/ui";\nimport "@involead/ui/ui.css";`;
    if (composition === "gallery") {
      // Map over the names rather than listing ~40 near-identical <Icon> tags.
      const tileProps = componentCode(
        Object.fromEntries(Object.entries(componentArgs).filter(([key]) => key !== "name")),
      )
        .split("\n")
        .filter((line) => line.startsWith("  "))
        .map((line) => `    ${line}`)
        .join("\n");
      // Plain JS (no `IconName[]` annotation) so the snippet also pastes into .jsx files.
      return `${imports}\n\nconst names = ${JSON.stringify(Object.keys(icons))};\n\n<div style={${wrapperStyle}}>\n  {names?.map((name) => (\n    <Icon\n      key={name}\n      name={name}\n${tileProps}\n    />\n  ))}\n</div>`;
    }
    const examples: ExplorerArgs[] =
      composition === "sizes"
        ? iconSizes.map((size) => ({ ...componentArgs, size: String(size) }))
        : composition === "colors"
          ? iconColors.map((color) => ({ ...componentArgs, color }))
          : [];
    return `${imports}\n\n<div style={${wrapperStyle}}>\n${examples.map(componentCode).join("\n")}\n</div>`;
  }

  // Icon: `svg` holds custom markup rendered as children (so `name` is unused),
  // and `clickable` stands in for an onClick handler.
  const iconSvg = component === "Icon" && typeof args.svg === "string" ? args.svg.trim() : "";
  const isIconOnlyArg = (key: string, value: ExplorerValue) =>
    component === "Icon" &&
    (key === "svg" ||
      key === "clickable" ||
      (key === "name" && iconSvg !== "") ||
      (key === "disabled" && value === false));
  const props = Object.entries(args)
    .filter(([key, value]) =>
      key !== "children" &&
      key !== "orientation" &&
      !isIconOnlyArg(key, value) &&
      value !== null &&
      value !== ""
    )
    .map(([key, value]) => {
      if (key === "icon" && value === "star") {
        return `  icon={<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" /></svg>}`;
      }
      if (typeof value === "boolean") return `  ${key}={${value}}`;
      if (
        component === "Icon" &&
        (key === "size" || key === "strokeWidth") &&
        typeof value === "string" &&
        Number.isFinite(Number(value))
      ) {
        return `  ${key}={${value}}`;
      }
      if (Array.isArray(value)) return `  ${key}={${JSON.stringify(value)}}`;
      if (key === "options") {
        if (typeof value !== "string") return `  ${key}={[]}`;
        try {
          return `  ${key}={${JSON.stringify(JSON.parse(value), null, 2)}}`;
        } catch {
          return `  ${key}={${value}}`;
        }
      }
      return `  ${key}=${JSON.stringify(value)}`;
    });
  const children = typeof args.children === "string" ? args.children : "";
  if (component === "Icon" && args.clickable === true) {
    props.push('  onClick={() => console.log("icon clicked")}');
  }
  const body = iconSvg
    ? `>\n${iconSvg.split("\n").map((line) => `  ${line}`).join("\n")}\n</${component}>`
    : children
      ? `>\n  {${JSON.stringify(children)}}\n</${component}>`
      : " />";
  return `import { ${component} } from "@involead/ui";\nimport "@involead/ui/ui.css";\n\n<${component}${props.length ? `\n${props.join("\n")}\n` : ""}${body}`;
}

/* ------------------------------------------------------------------ */
/* Modal formatter                                                     */
/* ------------------------------------------------------------------ */

function formatModalCode(
  args: ExplorerArgs,
  composition?: ExplorerComponent["stories"][number]["composition"],
): string {
  const maxWidth =
    typeof args.maxWidth === "string" &&
    ["xs", "sm", "md", "lg", "xl", "false"].includes(args.maxWidth)
      ? args.maxWidth
      : "xs";
  const title = typeof args.title === "string" && args.title ? args.title : "Modal title";
  const body =
    typeof args.body === "string" && args.body
      ? args.body
      : "This is the modal body.";
  const fullScreen = args.fullScreen === true;
  const scroll = args.scroll === "body" ? "body" : "paper";
  const disableEscapeKeyDown = args.disableEscapeKeyDown === true;
  const disableBackdropClick = args.disableBackdropClick === true;

  if (composition === "sizes") {
    const widths = ["xs", "sm", "md", "lg", "xl"] as const;
    return `import { useState } from "react";
import { Modal, Typography, Button } from "@involead/ui";
import "@involead/ui/ui.css";

const [openWidth, setOpenWidth] = useState(null);

${widths
  .map(
    (w) => `<>
  <Button onClick={() => setOpenWidth("${w}")}>Open ${w}</Button>

  <Modal
    open={openWidth === "${w}"}
    onClose={() => setOpenWidth(null)}
    maxWidth="${w}"
    ariaLabel="${title}"
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 24px" }}>
      <Typography variant="h6" as="h2">${title}</Typography>
      <Button variant="ghost" size="small" aria-label="Close" onClick={() => setOpenWidth(null)}>✕</Button>
    </div>

    <div style={{ padding: "0 24px 16px", flex: "1 1 auto", overflowY: "auto" }}>
      <Typography variant="body" color="secondary">${body}</Typography>
    </div>

    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 24px 16px", borderTop: "1px solid #e5e7eb" }}>
      <Button variant="outline" onClick={() => setOpenWidth(null)}>Cancel</Button>
      <Button variant="primary" onClick={() => setOpenWidth(null)}>Confirm</Button>
    </div>
  </Modal>
</>`,
  )
  .join("\n\n")}`;
  }

  const modalProps: string[] = [
    `  open={open}`,
    `  onClose={() => setOpen(false)}`,
  ];
  if (maxWidth !== "xs") modalProps.push(`  maxWidth="${maxWidth}"`);
  if (fullScreen) modalProps.push(`  fullScreen`);
  if (scroll !== "paper") modalProps.push(`  scroll="${scroll}"`);
  if (disableEscapeKeyDown) modalProps.push(`  disableEscapeKeyDown`);
  if (disableBackdropClick) modalProps.push(`  disableBackdropClick`);
  modalProps.push(`  ariaLabel="${title}"`);

  return `import { useState } from "react";
import { Modal, Typography, Button } from "@involead/ui";
import "@involead/ui/ui.css";

const [open, setOpen] = useState(true);

<>
  <Button onClick={() => setOpen(true)}>Open modal</Button>

  <Modal
${modalProps.join("\n")}
  >
    {/* Header */}
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 24px" }}>
      <Typography variant="h6" as="h2">${title}</Typography>
      <Button variant="ghost" size="small" aria-label="Close" onClick={() => setOpen(false)}>✕</Button>
    </div>

    {/* Body */}
    <div style={{ padding: "0 24px 16px", flex: "1 1 auto", overflowY: "auto" }}>
      <Typography variant="body" color="secondary">${body}</Typography>
    </div>

    {/* Footer */}
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 24px 16px", borderTop: "1px solid #e5e7eb" }}>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
    </div>
  </Modal>
</>`;
}

export function parseExplorerCode(code: string, component: ExplorerComponent): ExplorerArgs | null {
  const componentTag = new RegExp(`<${component.name}\\b([\\s\\S]*?)(?:\\/?>)`);
  const tag = code.match(componentTag);
  if (!tag) return null;

  const args = getComponentDefaults(component);
  const attributes = tag[1];
  for (const control of component.controls) {
    const escapedName = control.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const expression = new RegExp(`\\b${escapedName}\\s*=\\s*`);
    const start = attributes.search(expression);
    if (start < 0) continue;
    const valueStart = start + attributes.slice(start).match(expression)![0].length;
    const quote = attributes[valueStart];
    let raw = "";
    if (quote === '"' || quote === "'") {
      const end = attributes.indexOf(quote, valueStart + 1);
      if (end < 0) return null;
      raw = attributes.slice(valueStart + 1, end);
    } else if (quote === "{") {
      let depth = 0;
      let stringQuote = "";
      let escaped = false;
      let end = -1;
      for (let index = valueStart; index < attributes.length; index += 1) {
        const character = attributes[index];
        if (stringQuote) {
          if (escaped) escaped = false;
          else if (character === "\\") escaped = true;
          else if (character === stringQuote) stringQuote = "";
          continue;
        }
        if (character === '"' || character === "'") stringQuote = character;
        else if (character === "{") depth += 1;
        else if (character === "}") {
          depth -= 1;
          if (depth === 0) {
            end = index;
            break;
          }
        }
      }
      if (end < 0) return null;
      raw = attributes.slice(valueStart + 1, end).trim();
    } else {
      return null;
    }
    // Table: `pagination` may be an options object instead of a boolean.
    if (component.name === "Table" && control.name === "pagination" && raw.startsWith("{")) {
      args.pagination = true;
      args.paginationAlign = /\balign\s*:\s*["']center["']/.test(raw) ? "center" : "between";
      continue;
    }
    // Table: `exportable` may be an options object (`{ fileName }`).
    if (component.name === "Table" && control.name === "exportable" && raw.startsWith("{")) {
      args.exportable = true;
      continue;
    }
    if (control.kind === "boolean") {
      // Table: a state variable (e.g. `loading={refreshing}`) keeps the default value.
      if (component.name === "Table" && /^[A-Za-z_$][\w$]*$/.test(raw)) continue;
      if (raw !== "true" && raw !== "false") return null;
      args[control.name] = raw === "true";
    } else if (control.kind === "json" || control.kind === "multi-select") {
      // A variable reference (e.g. `options={options}`) keeps the default value.
      if (/^[A-Za-z_$][\w$]*$/.test(raw)) continue;
      try {
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) return null;
        if (control.kind === "json") {
          args[control.name] = JSON.stringify(parsed, null, 2);
        } else if (parsed.every((item) => typeof item === "string")) {
          args[control.name] = parsed;
        } else {
          return null;
        }
      } catch {
        return null;
      }
    } else {
      args[control.name] = raw;
    }
  }
  if (component.controls.some((control) => control.name === "orientation")) {
    const direction = code.match(/flexDirection:\s*["'](row|column)["']/)?.[1];
    if (direction) args.orientation = direction === "row" ? "horizontal" : "vertical";
  }
  const children = readComponentBody(code, component.name);
  if (children !== null && component.controls.some((control) => control.name === "children")) {
    args.children = parseTextChild(children);
  }
  if (component.name === "Checkbox" && /\bicon\s*=\s*\{\s*<svg\b/.test(attributes)) {
    args.icon = "star";
  }
  if (component.name === "Table") {
    // Not props: they map to `renderExpandedRow`, and `error` / `data={[]}`.
    args.expandable = /\brenderExpandedRow\s*=/.test(attributes);
    const errorMessage = attributes.match(/\berror\s*=\s*(["'])(.*?)\1/)?.[2];
    args.errorMessage = errorMessage ?? null;
    args.dataState = /\berror\s*=/.test(attributes)
      ? "error"
      : /\bdata\s*=\s*\{\s*\[\s*\]\s*\}/.test(attributes)
        ? "empty"
        : "data";
  }
  if (component.name === "Icon") {
    args.clickable = /\bonClick\s*=/.test(attributes);
    // A custom <svg> child: keep its markup so the preview draws it.
    const body = readComponentBody(code, "Icon");
    args.svg = body && /^<svg\b/.test(body) ? dedent(body) : null;
  }
  if (component.name === "Modal") {
    // The snippet renders title and body via <Typography>, not props.
    const heading = code.match(
      /<Typography[^>]*variant=["']h\d["'][^>]*>([^<]+)<\/Typography>/,
    );
    if (heading) args.title = heading[1].trim();
    const paragraph = code.match(
      /<Typography[^>]*variant=["'](?:body|bodySmall)["'][^>]*>([^<]+)<\/Typography>/,
    );
    if (paragraph) args.body = paragraph[1].trim();
  }
  return args;
}

function dedent(text: string) {
  const lines = text.split("\n");
  const indent = Math.min(
    ...lines.slice(1).filter((line) => line.trim()).map((line) => line.match(/^\s*/)![0].length),
  );
  return Number.isFinite(indent)
    ? [lines[0], ...lines.slice(1).map((line) => line.slice(indent))].join("\n")
    : text;
}

export function readComponentBody(code: string, component: string): string | null {
  const start = code.indexOf(`<${component}`);
  if (start < 0) return null;

  let braceDepth = 0;
  let quote = "";
  let escaped = false;
  let openingTagEnd = -1;
  for (let index = start + component.length + 1; index < code.length; index += 1) {
    const character = code[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === '"' || character === "'") quote = character;
    else if (character === "{") braceDepth += 1;
    else if (character === "}") braceDepth -= 1;
    else if (character === ">" && braceDepth === 0) {
      openingTagEnd = index;
      break;
    }
  }
  if (openingTagEnd < 0 || code[openingTagEnd - 1] === "/") return null;

  const closingTagStart = code.indexOf(`</${component}>`, openingTagEnd + 1);
  if (closingTagStart < 0) return null;
  return code.slice(openingTagEnd + 1, closingTagStart).trim();
}

export function parseTextChild(value: string) {
  const child = value.trim();
  const expression = child.startsWith("{") && child.endsWith("}")
    ? child.slice(1, -1).trim()
    : child;
  if (expression.startsWith('"') && expression.endsWith('"')) {
    try {
      const parsed: unknown = JSON.parse(expression);
      if (typeof parsed === "string") return parsed;
    } catch {
      return child;
    }
  }
  return child;
}

export function formatButtonCode(
  children: string,
  variant: string,
  size: string,
  loading: boolean,
  disabled: boolean,
  fullWidth: boolean,
  leftIcon = false,
  rightIcon = false,
) {
  const leftIconProp = leftIcon
    ? `\n  leftIcon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></svg>}`
    : "";
  const rightIconProp = rightIcon
    ? `\n  rightIcon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>}`
    : "";
  const iconProps = [leftIconProp, rightIconProp].filter(Boolean).join("\n");
  return `import { Button } from "@involead/ui";
import "@involead/ui/ui.css";

<Button
  variant="${variant}"
  size="${size}"
  loading={${loading}}
  disabled={${disabled}}
  fullWidth={${fullWidth}}${iconProps}
>
  {${JSON.stringify(children)}}
</Button>`;
}