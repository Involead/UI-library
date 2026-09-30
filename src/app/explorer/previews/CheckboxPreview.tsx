import type { ChangeEvent } from "react";
import { Checkbox } from "@/index";
import type { ExplorerArgs } from "../../explorer-config";
import { getBooleanArg, getStringArg } from "../args";
import type { CheckboxSize, PreviewLayout } from "../types";
import { isChoice } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const StarIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
  </svg>
);

export function CheckboxPreview({ args, composition, layout, onChange }: Props) {
  const selectedSize = getStringArg(args, "size", "medium");
  const size: CheckboxSize = isChoice(selectedSize, ["small", "medium", "large"])
    ? selectedSize
    : "medium";
  const checked = getBooleanArg(args, "checked");
  const commonProps = {
    size,
    disabled: getBooleanArg(args, "disabled"),
    labelClickable: getBooleanArg(args, "labelClickable", true),
    onChange,
  };
  const stackClass = `preview-stack${layout === "horizontal" ? " horizontal" : ""}`;

  if (composition === "all") {
    return (
      <div className={stackClass}>
        <Checkbox {...commonProps} label="Unchecked" checked={false} />
        <Checkbox {...commonProps} label="Checked" checked />
        <Checkbox {...commonProps} label="Disabled" disabled />
        <Checkbox {...commonProps} label="Disabled checked" checked disabled />
        <Checkbox {...commonProps} label="With helper text" helperText="You can change this later in settings." />
        <Checkbox {...commonProps} label="With error" error="You must accept the terms to continue." />
      </div>
    );
  }

  if (composition === "sizes") {
    return (
      <div className={stackClass}>
        {(["small", "medium", "large"] as CheckboxSize[]).map((itemSize) => (
          <Checkbox
            key={itemSize}
            {...commonProps}
            size={itemSize}
            label={itemSize[0].toUpperCase() + itemSize.slice(1)}
            checked={checked}
          />
        ))}
      </div>
    );
  }

  if (composition === "states") {
    return (
      <div className={stackClass}>
        <Checkbox {...commonProps} label="Unchecked" checked={false} />
        <Checkbox {...commonProps} label="Checked" checked />
        <Checkbox {...commonProps} label="Disabled" checked={false} disabled />
        <Checkbox {...commonProps} label="Disabled checked" checked disabled />
        <Checkbox {...commonProps} label="Error" error="This field is required." />
      </div>
    );
  }

  if (composition === "label-clickable") {
    return (
      <div className={stackClass}>
        <Checkbox
          {...commonProps}
          label="Clicking this label toggles the checkbox"
          labelClickable
          checked={checked}
        />
        <Checkbox
          {...commonProps}
          label="Only the checkbox itself toggles"
          labelClickable={false}
          checked={checked}
        />
      </div>
    );
  }

  return (
    <Checkbox
      {...commonProps}
      label={getStringArg(args, "label")}
      helperText={getStringArg(args, "helperText")}
      error={getStringArg(args, "error")}
      checked={checked}
      icon={getStringArg(args, "icon") === "star" ? StarIcon : undefined}
    />
  );
}
