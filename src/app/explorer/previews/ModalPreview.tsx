"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { Typography } from "@/components/Typography";

import type { ExplorerArgs } from "../../explorer-config";
import { getStringArg } from "../args";
import { isChoice, type PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange: (value: string) => void;
};

type MaxWidth = "xs" | "sm" | "md" | "lg" | "xl" | false;

export function ModalPreview({ args, composition, layout, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [openSize, setOpenSize] = useState<MaxWidth | null>(null);

  const maxWidthArg = getStringArg(args, "maxWidth", "xs");
  const maxWidth: MaxWidth =
    maxWidthArg === "false"
      ? false
      : isChoice(maxWidthArg, ["xs", "sm", "md", "lg", "xl"])
        ? maxWidthArg
        : "xs";

  const title = getStringArg(args, "title", "Modal title");

  const longBody = args.longBody === true;
  const body = longBody
    ? Array.from(
        { length: 30 },
        (_, i) =>
          `${i + 1}. This paragraph is here to show how the modal handles long content. Only the designated scroll region moves when the content exceeds the panel height.`,
      ).join("\n\n")
    : getStringArg(
        args,
        "body",
        "This is the modal body. Add any content you like — text, forms, tables, or other components.",
      );

  const disableEscapeKeyDown = args.disableEscapeKeyDown === true;
  const disableBackdropClick = args.disableBackdropClick === true;

  const close = () => {
    setOpen(false);
    onChange("closed");
  };

  const renderModal = (
    modalMaxWidth: MaxWidth,
    modalOpen: boolean,
    modalClose: () => void,
  ) => (
    <Modal
      open={modalOpen}
      onClose={modalClose}
      maxWidth={modalMaxWidth}
      ariaLabel={title}
      disableEscapeKeyDown={disableEscapeKeyDown}
      disableBackdropClick={disableBackdropClick}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "16px 24px",
          borderBottom: "1px solid var(--color-border)",
          flex: "0 0 auto",
        }}
      >
        <Typography variant="h6" as="h2">
          {title}
        </Typography>
        <Button
          variant="ghost"
          size="small"
          aria-label="Close"
          onClick={modalClose}
        >
          ✕
        </Button>
      </div>

      {/* Body */}
      <div
        style={{
          padding: "16px 24px",
          flex: "1 1 auto",
          overflowY: "auto",
          minHeight: 0,
        }}
      >
        {body.split("\n\n").map((paragraph, i) => (
          <Typography
            key={i}
            variant="body"
            color="secondary"
            style={{ marginBottom: 12 }}
          >
            {paragraph}
          </Typography>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 8,
          padding: "12px 24px 16px",
          borderTop: "1px solid var(--color-border)",
          flex: "0 0 auto",
        }}
      >
        <Button variant="outline" onClick={modalClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={modalClose}>
          Confirm
        </Button>
      </div>
    </Modal>
  );

  /* -------- compositions -------- */

  if (composition === "sizes") {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => {
          const isOpen = openSize === s;
          return (
            <div
              key={s}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "stretch",
                gap: 8,
                flex: "1 1 0",
                minWidth: 120,
              }}
            >
              <Typography
                variant="label"
                as="h3"
                style={{ textAlign: "center" }}
              >
                {s.toUpperCase()}
              </Typography>
              <Button fullWidth onClick={() => setOpenSize(s)}>
                Open {s}
              </Button>
              {renderModal(s, isOpen, () => setOpenSize(null))}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open modal</Button>
      {renderModal(maxWidth, open, close)}
    </>
  );
}