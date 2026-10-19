"use client";

import { Button } from "@/components/Button";
import { Typography } from "@/components/Typography";
import { Tooltip } from "@/components/Tooltip";

import type { ExplorerArgs } from "../../explorer-config";
import { getStringArg } from "../args";
import { isChoice, type PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange: (value: string) => void;
};

type Placement = "top" | "bottom" | "left" | "right";
type Variant = "dark" | "light";

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

const stageStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  gap: 16,
  padding: 40,
  minHeight: 260,
};

const rowStyle = {
  display: "flex",
  flexDirection: "row" as const,
  gap: 16,
  alignItems: "center" as const,
  flexWrap: "wrap" as const,
  justifyContent: "center" as const,
};

const panelStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 24,
  width: "100%",
  maxWidth: 520,
  padding: 20,
  border: "1px solid var(--color-border)",
  borderRadius: 8,
  background: "var(--color-surface-secondary)",
};

const labelStyle = {
  margin: "0 0 8px",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--color-text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
};

const truncatedTriggerStyle = (maxWidth: number | string) => ({
  display: "inline-block",
  maxWidth,
  whiteSpace: "nowrap" as const,
  overflow: "hidden",
  textOverflow: "ellipsis",
  padding: "8px 12px",
  border: "1px solid var(--color-border)",
  borderRadius: 6,
  background: "#fff",
  fontSize: 14,
});

/* ------------------------------------------------------------------ */
/* Rich content used inside interactive tooltips                       */
/* ------------------------------------------------------------------ */

function RichTooltipContent() {
  return (
    <div>
      <Typography variant="label" as="p" style={{ margin: "0 0 6px" }}>
        Event details
      </Typography>
      <Typography
        variant="bodySmall"
        color="secondary"
        style={{ margin: "0 0 10px", display: "block" }}
      >
        You can move your pointer down here and click the link.
      </Typography>
      <a
        href="#"
        style={{
          color: "var(--color-primary)",
          textDecoration: "underline",
          fontWeight: 500,
          fontSize: 13,
        }}
        onClick={(e) => e.preventDefault()}
      >
        See details →
      </a>
    </div>
  );
}

function PlainRichContent() {
  return (
    <div>
      <strong style={{ display: "block", marginBottom: 4 }}>
        Event details
      </strong>
      <span style={{ fontSize: 12 }}>
        Moving your pointer down here closes the tooltip.
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Preview                                                             */
/* ------------------------------------------------------------------ */

export function TooltipPreview({ args, composition }: Props) {
  const title = getStringArg(args, "title", "This is a tooltip");

  const rawPlacement = getStringArg(args, "placement", "top");
  const placement: Placement = isChoice(rawPlacement, [
    "top",
    "bottom",
    "left",
    "right",
  ])
    ? rawPlacement
    : "top";

  const rawVariant = getStringArg(args, "variant", "dark");
  const variant: Variant = isChoice(rawVariant, ["dark", "light"])
    ? rawVariant
    : "dark";

  const interactive = args.interactive === true;
  const disabled = args.disabled === true;
  const onlyWhenTruncated = args.onlyWhenTruncated === true;

  // Read and coerce the delay controls (the explorer passes strings).
  const rawEnterDelay = getStringArg(args, "enterDelay", "");
  const enterDelay =
    rawEnterDelay && Number.isFinite(Number(rawEnterDelay))
      ? Number(rawEnterDelay)
      : undefined;

  const rawLeaveDelay = getStringArg(args, "leaveDelay", "");
  const leaveDelay =
    rawLeaveDelay && Number.isFinite(Number(rawLeaveDelay))
      ? Number(rawLeaveDelay)
      : undefined;

  /* -------- Composition: placements (4-up) -------- */

  if (composition === "placements") {
    return (
      <div style={stageStyle}>
        <div style={rowStyle}>
          <Tooltip title={`Top — ${title}`} placement="top">
            <Button variant="outline">Top</Button>
          </Tooltip>
          <Tooltip title={`Bottom — ${title}`} placement="bottom">
            <Button variant="outline">Bottom</Button>
          </Tooltip>
          <Tooltip title={`Left — ${title}`} placement="left">
            <Button variant="outline">Left</Button>
          </Tooltip>
          <Tooltip title={`Right — ${title}`} placement="right">
            <Button variant="outline">Right</Button>
          </Tooltip>
        </div>
      </div>
    );
  }

  /* -------- Composition: variants (dark + light) -------- */

  if (composition === "variants") {
    return (
      <div style={stageStyle}>
        <div style={rowStyle}>
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
        </div>
      </div>
    );
  }

  /* -------- Feature: onlyWhenTruncated (two-up) -------- */

  if (onlyWhenTruncated) {
    return (
      <div style={stageStyle}>
        <div style={panelStyle}>
          <div>
            <p style={labelStyle}>Fits — no tooltip</p>
            <Tooltip
              title={title}
              onlyWhenTruncated
              placement="top"
              enterDelay={enterDelay}
              leaveDelay={leaveDelay}
            >
              <span style={truncatedTriggerStyle("100%")}>{title}</span>
            </Tooltip>
          </div>

          <div>
            <p style={labelStyle}>Truncated — tooltip on hover</p>
            <Tooltip
              title="Queen's Hospital - Dietetics Department"
              onlyWhenTruncated
              placement="top"
              enterDelay={enterDelay}
              leaveDelay={leaveDelay}
            >
              <span style={truncatedTriggerStyle(160)}>
                {"Queen's Hospital - Dietetics Department"}
              </span>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }

  /* -------- Feature: light + interactive (two-up) -------- */

  if (variant === "light" && interactive) {
    return (
      <div style={stageStyle}>
        <div style={panelStyle}>
          <div>
            <p style={labelStyle}>
              Non-interactive — closes when you leave the trigger
            </p>
            <Tooltip
              title={<PlainRichContent />}
              variant="light"
              placement="top"
              enterDelay={enterDelay}
              leaveDelay={leaveDelay}
            >
              <Button variant="outline">Hover me</Button>
            </Tooltip>
          </div>

          <div>
            <p style={labelStyle}>
              Interactive — stays open, content is clickable
            </p>
            <Tooltip
              title={<RichTooltipContent />}
              variant="light"
              interactive
              placement="top"
              enterDelay={enterDelay}
              leaveDelay={leaveDelay}
            >
              <Button variant="outline">Hover me</Button>
            </Tooltip>
          </div>
        </div>
      </div>
    );
  }

  /* -------- Default: single tooltip -------- */

  return (
    <div style={stageStyle}>
      <Tooltip
        title={title}
        placement={placement}
        variant={variant}
        interactive={interactive}
        disabled={disabled}
        enterDelay={enterDelay}
        leaveDelay={leaveDelay}
      >
        <Button variant="primary">Hover me</Button>
      </Tooltip>
    </div>
  );
}