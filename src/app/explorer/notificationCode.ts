import type { ExplorerArgs, ExplorerComponent } from "../explorer-config";

type Composition = ExplorerComponent["stories"][number]["composition"];

/* ---------- Helpers ---------- */

const colors = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "default",
] as const;

const variants = ["standard", "dot"] as const;
const overlaps = ["rectangular", "circular"] as const;
const verticals = ["top", "bottom"] as const;
const horizontals = ["left", "right"] as const;

/** The explorer passes everything as strings; numbers arrive as "4", "99", etc. */
function readNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

/** "New" stays a string, "4" becomes a number, "" becomes undefined. */
function readContent(value: unknown): string | number | undefined {
  if (typeof value === "number") return value;
  if (typeof value !== "string") return undefined;
  if (value.trim() === "") return undefined;
  return /^\d+$/.test(value) ? Number(value) : value;
}

/** Renders the content value back into source code form. */
function contentLiteral(value: string | number | undefined, fallback = "4"): string {
  if (value === undefined) return `{${fallback}}`;
  if (typeof value === "number") return `{${value}}`;
  return `"${value}"`;
}

/* ---------- The formatter ---------- */

export function formatNotificationCode(
  args: ExplorerArgs,
  composition?: Composition,
): string {
  /* ---------- Read args ---------- */

  const variant =
    typeof args.variant === "string" && (variants as readonly string[]).includes(args.variant)
      ? (args.variant as (typeof variants)[number])
      : "standard";

  const color =
    typeof args.color === "string" && (colors as readonly string[]).includes(args.color)
      ? (args.color as (typeof colors)[number])
      : "default";

  const overlap =
    typeof args.overlap === "string" && (overlaps as readonly string[]).includes(args.overlap)
      ? (args.overlap as (typeof overlaps)[number])
      : "rectangular";

  const vertical =
    typeof args["anchorOrigin.vertical"] === "string" &&
    (verticals as readonly string[]).includes(args["anchorOrigin.vertical"] as string)
      ? (args["anchorOrigin.vertical"] as (typeof verticals)[number])
      : "top";

  const horizontal =
    typeof args["anchorOrigin.horizontal"] === "string" &&
    (horizontals as readonly string[]).includes(args["anchorOrigin.horizontal"] as string)
      ? (args["anchorOrigin.horizontal"] as (typeof horizontals)[number])
      : "right";

  const content = readContent(args.content);
  const max = readNumber(args.max, 99);
  const invisible = args.invisible === true;
  const showZero = args.showZero === true;
  const hasChild = args.children !== false;

  /* ---------- Composition: colors ---------- */

  if (composition === "colors") {
    return `import { Notification } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Notification content={4} color="primary">
    <MailIcon />
  </Notification>
  <Notification content={4} color="secondary">
    <MailIcon />
  </Notification>
  <Notification content={4} color="success">
    <MailIcon />
  </Notification>
  <Notification content={4} color="error">
    <MailIcon />
  </Notification>
  <Notification content={4} color="warning">
    <MailIcon />
  </Notification>
  <Notification content={4} color="default">
    <MailIcon />
  </Notification>
</>`;
  }

  /* ---------- Composition: states ---------- */

  if (composition === "states") {
    return `import { Notification } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  {/* numeric content */}
  <Notification content={99} max={99} color="primary">
    <MailIcon />
  </Notification>

  {/* capped: 150 → "99+" */}
  <Notification content={150} max={99} color="primary">
    <MailIcon />
  </Notification>

  {/* zero hidden by default; showZero keeps it visible */}
  <Notification content={0} color="primary" showZero>
    <MailIcon />
  </Notification>

  {/* invisible animates the badge into the corner */}
  <Notification content={4} color="primary" invisible>
    <MailIcon />
  </Notification>

  {/* dot variant has no content */}
  <Notification variant="dot" color="success">
    <MailIcon />
  </Notification>
</>`;
  }

  /* ---------- Composition: placements (4-up) ---------- */

  if (composition === "placements") {
    return `import { Notification } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Notification
    content={4}
    color="error"
    anchorOrigin={{ vertical: "top", horizontal: "left" }}
  >
    <MailIcon />
  </Notification>

  <Notification
    content={4}
    color="error"
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
  >
    <MailIcon />
  </Notification>

  <Notification
    content={4}
    color="error"
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  >
    <MailIcon />
  </Notification>

  <Notification
    content={4}
    color="error"
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <MailIcon />
  </Notification>
</>`;
  }

  /* ---------- Composition: sizes (standalone) ---------- */

  if (composition === "sizes") {
    return `import { Notification } from "@involead/ui";
import "@involead/ui/ui.css";

/* No child element — a bare count or dot.
   Useful inside filter toolbars, nav links, or chips. */

<>
  <Notification content={4} color="primary" />
  <Notification content={100} max={99} color="error" />
  <Notification variant="dot" color="success" />
</>`;
  }

  /* ---------- Dot variant ---------- */

  if (variant === "dot") {
    const lines: string[] = [
      `  variant="dot"`,
      `  color="${color}"`,
    ];

    if (overlap !== "rectangular") lines.push(`  overlap="${overlap}"`);
    if (vertical !== "top" || horizontal !== "right") {
      lines.push(
        `  anchorOrigin={{ vertical: "${vertical}", horizontal: "${horizontal}" }}`,
      );
    }
    if (invisible) lines.push(`  invisible`);

    return `import { Notification } from "@involead/ui";
import "@involead/ui/ui.css";

<Notification
${lines.join("\n")}
>
  <Avatar src="/me.png" alt="Me" />
</Notification>`;
  }

  /* ---------- Standalone (no child) ---------- */

  if (!hasChild) {
    const lines: string[] = [
      `  content=${contentLiteral(content)}`,
    ];
    if (typeof content === "number" && content > max) lines.push(`  max={${max}}`);
    if (color !== "default") lines.push(`  color="${color}"`);
    if (invisible) lines.push(`  invisible`);

    return `import { Notification } from "@involead/ui";
import "@involead/ui/ui.css";

<Notification
${lines.join("\n")}
/>`;
  }

  /* ---------- Default: single notification ---------- */

  const props: string[] = [`  content=${contentLiteral(content)}`];

  if (typeof content === "number" && content > max) props.push(`  max={${max}}`);
  if (color !== "default") props.push(`  color="${color}"`);
  if (showZero) props.push(`  showZero`);
  if (invisible) props.push(`  invisible`);
  if (overlap !== "rectangular") props.push(`  overlap="${overlap}"`);
  if (vertical !== "top" || horizontal !== "right") {
    props.push(
      `  anchorOrigin={{ vertical: "${vertical}", horizontal: "${horizontal}" }}`,
    );
  }

  return `import { Notification } from "@involead/ui";
import "@involead/ui/ui.css";

<Notification
${props.join("\n")}
>
  <MailIcon />
</Notification>`;
}