"use client";

import { useState } from "react";
import { Switch } from "@/index";
import { getBooleanArg, getStringArg } from "../args";
import type { ExplorerArgs } from "../../explorer-config";
import type { PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange?: (checked: boolean) => void;
};

const row = {
  display: "flex",
  gap: 32,
  alignItems: "center",
  flexWrap: "wrap",
} as const;

const column = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  alignItems: "center",
} as const;

const hint = { 
  fontSize: 11, 
  color: "var(--color-text-secondary)" 
} as const;

export function SwitchPreview({ args, composition, layout, onChange }: Props) {
  const isControlled = args.checked !== undefined;
  
  const [internalChecked, setInternalChecked] = useState(
    args.checked === true || args.defaultChecked === true
  );

  const size = getStringArg(args, "size", "medium") as "small" | "medium" | "large";
  const color = getStringArg(args, "color", "primary") as
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "inherit";
   const labelPlacement = getStringArg(args, "labelPlacement", "end") as
    | "start"
    | "end"
    | "top"
    | "bottom";

  const label = getStringArg(args, "label", "Enable notifications");
  const helperText = getStringArg(args, "helperText");
  const error = getStringArg(args, "error");
  
  const disabled = getBooleanArg(args, "disabled");
  const loading = getBooleanArg(args, "loading");
  const defaultChecked = getBooleanArg(args, "defaultChecked");

  const handleToggle = (checked: boolean) => {
    if (!isControlled) setInternalChecked(checked);
    onChange?.(checked);
  };

  const sharedProps = {
    size,
    color,
    labelPlacement,
    helperText: helperText || undefined,
    error: error || undefined,
    disabled,
    loading,
    onChange: handleToggle,
    checked: isControlled ? (args.checked as boolean) : undefined,
    defaultChecked: !isControlled ? defaultChecked : undefined,
  };

  const containerStyle = {
    ...row,
    flexDirection: layout === "horizontal" ? ("row" as const) : ("column" as const),
  };

  /* ============================================================
     Compositions
     ============================================================ */

  if (composition === "colors") {
    return (
      <div style={containerStyle}>
        {(["primary", "secondary", "success", "error", "warning"] as const).map((c) => (
          <div key={c} style={column}>
            <Switch {...sharedProps} color={c} defaultChecked />
            <span style={hint}>{c}</span>
          </div>
        ))}
      </div>
    );
  }

  if (composition === "sizes") {
    return (
      <div style={containerStyle}>
        {(["small", "medium", "large"] as const).map((s) => (
          <div key={s} style={column}>
            <Switch {...sharedProps} size={s} defaultChecked />
            <span style={hint}>{s}</span>
          </div>
        ))}
      </div>
    );
  }

  if (composition === "states") {
    return (
      <div style={containerStyle}>
        <div style={column}>
          <Switch label="Off" />
          <span style={hint}>Off</span>
        </div>
        <div style={column}>
          <Switch label="On" defaultChecked />
          <span style={hint}>On</span>
        </div>
        <div style={column}>
          <Switch label="Disabled" disabled />
          <span style={hint}>Disabled</span>
        </div>
        <div style={column}>
          <Switch label="Disabled On" disabled defaultChecked />
          <span style={hint}>Disabled On</span>
        </div>
        <div style={column}>
          <Switch label="Loading" loading />
          <span style={hint}>Loading</span>
        </div>
      </div>
    );
  }

  if (composition === "inherit") {
    return (
      <div style={containerStyle}>
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
      </div>
    );
  }

  /* ============================================================
     Default
     ============================================================ */

  return <Switch {...sharedProps} label={label} />;
}