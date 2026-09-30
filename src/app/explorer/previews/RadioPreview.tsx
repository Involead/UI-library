import { useState, type ChangeEvent } from "react";
import { Radio } from "@/index";
import type { ExplorerArgs } from "../../explorer-config";
import { getBooleanArg, getStringArg } from "../args";
import type { PreviewLayout, RadioLabelPosition, RadioSize } from "../types";
import { isChoice, radioGroupOptions } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export function RadioPreview({ args, composition, layout, onChange }: Props) {
  const [groupValue, setGroupValue] = useState(radioGroupOptions[0].value);
  const selectedSize = getStringArg(args, "size", "medium");
  const size: RadioSize = isChoice(selectedSize, ["small", "medium", "large"])
    ? selectedSize
    : "medium";
  const selectedLabelPosition = getStringArg(args, "labelPosition", "right");
  const labelPosition: RadioLabelPosition = isChoice(selectedLabelPosition, ["right", "left"])
    ? selectedLabelPosition
    : "right";
  const checked = getBooleanArg(args, "checked");
  const commonProps = {
    size,
    labelPosition,
    disabled: getBooleanArg(args, "disabled"),
    labelClickable: getBooleanArg(args, "labelClickable", true),
    onChange,
  };
  const stackClass = `preview-stack${layout === "horizontal" ? " horizontal" : ""}`;

  if (composition === "all") {
    return (
      <div className={stackClass}>
        <Radio {...commonProps} label="Unchecked" checked={false} />
        <Radio {...commonProps} label="Checked" checked />
        <Radio {...commonProps} label="Disabled" disabled />
        <Radio {...commonProps} label="Disabled checked" checked disabled />
        <Radio {...commonProps} label="With helper text" helperText="We'll send a summary once a day." />
        <Radio {...commonProps} label="With error" error="Please choose a notification method." />
      </div>
    );
  }

  if (composition === "sizes") {
    return (
      <div className={stackClass}>
        {(["small", "medium", "large"] as RadioSize[]).map((itemSize) => (
          <Radio
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
        <Radio {...commonProps} label="Unchecked" checked={false} />
        <Radio {...commonProps} label="Checked" checked />
        <Radio {...commonProps} label="Disabled" checked={false} disabled />
        <Radio {...commonProps} label="Disabled checked" checked disabled />
        <Radio {...commonProps} label="Error" error="This field is required." />
        <Radio {...commonProps} label="Error checked" checked error />
      </div>
    );
  }

  if (composition === "group") {
    return (
      <div className={stackClass} role="radiogroup" aria-label="Notification method">
        {radioGroupOptions.map((option) => (
          <Radio
            key={option.value}
            {...commonProps}
            name="explorer-radio-group"
            value={option.value}
            label={option.label}
            checked={groupValue === option.value}
            onChange={(event) => {
              setGroupValue(option.value);
              onChange(event);
            }}
          />
        ))}
      </div>
    );
  }

  if (composition === "label-clickable") {
    return (
      <div className={stackClass}>
        <Radio
          {...commonProps}
          label="Clicking this label selects the radio"
          labelClickable
          checked={checked}
        />
        <Radio
          {...commonProps}
          label="Only the circle itself selects"
          labelClickable={false}
          checked={checked}
        />
      </div>
    );
  }

  return (
    <Radio
      {...commonProps}
      label={getStringArg(args, "label")}
      helperText={getStringArg(args, "helperText")}
      error={getStringArg(args, "error")}
      checked={checked}
    />
  );
}
