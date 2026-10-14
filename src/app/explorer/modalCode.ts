import type { ExplorerArgs, ExplorerComponent } from "../explorer-config";

type Composition = ExplorerComponent["stories"][number]["composition"];

export function formatModalCode(
  args: ExplorerArgs,
  composition?: Composition,
): string {
  const maxWidth =
    typeof args.maxWidth === "string" &&
    ["xs", "sm", "md", "lg", "xl", "false"].includes(args.maxWidth)
      ? args.maxWidth
      : "xs";
  const title =
    typeof args.title === "string" && args.title ? args.title : "Modal title";
  const body =
    typeof args.body === "string" && args.body
      ? args.body
      : "This is the modal body.";
  const longBody = args.longBody === true;
  const resolvedBody = longBody
    ? Array.from(
        { length: 5 },
        (_, i) =>
          `${i + 1}. Paragraph ${i + 1} of the long content demonstration. Add as many paragraphs as you need.`,
      ).join("\\n\\n")
    : body;
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
      <Typography variant="body" color="secondary">${resolvedBody}</Typography>
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

  const bodyOverflowStyle =
    scroll === "body"
      ? `{ padding: "0 24px 16px", flex: "1 1 auto" }`
      : `{ padding: "0 24px 16px", flex: "1 1 auto", overflowY: "auto" }`;

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
    <div style={${bodyOverflowStyle}}>
      <Typography variant="body" color="secondary">${resolvedBody}</Typography>
    </div>

    {/* Footer */}
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 24px 16px", borderTop: "1px solid #e5e7eb" }}>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
    </div>
  </Modal>
</>`;
}