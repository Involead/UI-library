import type { ExplorerArgs, ExplorerComponent } from "../explorer-config";

type Composition = ExplorerComponent["stories"][number]["composition"];

export function formatTooltipCode(
  args: ExplorerArgs,
  composition?: Composition,
): string {
  const title =
    typeof args.title === "string" && args.title
      ? args.title
      : "This is a tooltip";

  const placement =
    typeof args.placement === "string" &&
    ["top", "bottom", "left", "right"].includes(args.placement)
      ? args.placement
      : "top";

  const variant =
    typeof args.variant === "string" && ["dark", "light"].includes(args.variant)
      ? args.variant
      : "dark";

  const interactive = args.interactive === true;
  const disabled = args.disabled === true;
  const onlyWhenTruncated = args.onlyWhenTruncated === true;

  /* -------- Composition: placements (4-up) -------- */

  if (composition === "placements") {
    return `import { Button, Tooltip } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Tooltip title="Top" placement="top">
    <Button variant="outline">Top</Button>
  </Tooltip>

  <Tooltip title="Bottom" placement="bottom">
    <Button variant="outline">Bottom</Button>
  </Tooltip>

  <Tooltip title="Left" placement="left">
    <Button variant="outline">Left</Button>
  </Tooltip>

  <Tooltip title="Right" placement="right">
    <Button variant="outline">Right</Button>
  </Tooltip>
</>`;
  }

  /* -------- Composition: variants (dark + light) -------- */

  if (composition === "variants") {
    return `import { Button, Tooltip } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Tooltip title="Dark tooltip — default look" variant="dark">
    <Button variant="outline">Dark</Button>
  </Tooltip>

  <Tooltip
    title="Light tooltip — for richer content and interactive elements."
    variant="light"
    interactive
  >
    <Button variant="outline">Light</Button>
  </Tooltip>
</>`;
  }

  /* -------- Feature: onlyWhenTruncated -------- */

  if (onlyWhenTruncated) {
    return `import { Tooltip } from "@involead/ui";
import "@involead/ui/ui.css";

/* The tooltip only opens if the trigger's text is actually truncated.
   The trigger needs a width cap, plus overflow / white-space rules. */

<Tooltip
  title="${title}"
  onlyWhenTruncated
  placement="${placement}"
>
  <span
    style={{
      display: "inline-block",
      maxWidth: 160,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    ${title}
  </span>
</Tooltip>`;
  }

  /* -------- Feature: light + interactive -------- */

  if (variant === "light" && interactive) {
    return `import { Button, Tooltip } from "@involead/ui";
import "@involead/ui/ui.css";

/* \`interactive\` keeps the tooltip open when the pointer moves into it,
   so links and buttons inside stay clickable. */

<Tooltip
  title={
    <div>
      <strong style={{ display: "block", marginBottom: 4 }}>
        Event details
      </strong>
      <span style={{ fontSize: 12 }}>
        Move your pointer down here and click the link.
      </span>
      <a
        href="#"
        style={{
          display: "inline-block",
          marginTop: 8,
          color: "var(--color-primary)",
          textDecoration: "underline",
        }}
      >
        See details →
      </a>
    </div>
  }
  variant="light"
  interactive
  placement="${placement}"
>
  <Button variant="outline">Hover me</Button>
</Tooltip>`;
  }

  /* -------- Default: single tooltip -------- */

  const props: string[] = [`  title="${title}"`];
  if (placement !== "top") props.push(`  placement="${placement}"`);
  if (variant !== "dark") props.push(`  variant="${variant}"`);
  if (disabled) props.push(`  disabled={true}`);

  return `import { Button, Tooltip } from "@involead/ui";
import "@involead/ui/ui.css";

<Tooltip
${props.join("\n")}
>
  <Button variant="primary">Hover me</Button>
</Tooltip>`;
}