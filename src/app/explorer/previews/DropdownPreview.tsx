import { Dropdown } from "@/index";
import type { ExplorerArgs } from "../../explorer-config";
import { getBooleanArg, getDropdownOptions, getStringArg } from "../args";
import { isChoice, type DropdownSize } from "../types";

type Props = {
  args: ExplorerArgs;
  onChange: (value: string | string[] | null) => void;
  onOpenChange: (isOpen: boolean) => void;
};

export function DropdownPreview({ args, onChange, onOpenChange }: Props) {
  const options = getDropdownOptions(args);
  if (!options) {
    return (
      <div className="preview-error" role="alert">
        Dropdown options must be a valid JSON array of options.
      </div>
    );
  }

  const selectedSize = getStringArg(args, "size", "medium");
  const size: DropdownSize = isChoice(selectedSize, ["small", "medium", "large"])
    ? selectedSize
    : "medium";
  const commonProps = {
    options,
    label: getStringArg(args, "label"),
    helperText: getStringArg(args, "helperText"),
    error: getStringArg(args, "error"),
    placeholder: getStringArg(args, "placeholder", "Select…"),
    size,
    disabled: getBooleanArg(args, "disabled"),
    required: getBooleanArg(args, "required"),
    fullWidth: getBooleanArg(args, "fullWidth"),
    width: getStringArg(args, "width") || undefined,
    searchable: getBooleanArg(args, "searchable"),
    clearable: getBooleanArg(args, "clearable"),
    onOpenChange,
  };

  if (getBooleanArg(args, "multiple")) {
    const value = args.value;
    return (
      <Dropdown
        {...commonProps}
        multiple
        value={Array.isArray(value) ? value : []}
        onChange={onChange}
      />
    );
  }

  const value = args.value;
  return (
    <Dropdown
      {...commonProps}
      value={typeof value === "string" ? value : null}
      onChange={onChange}
    />
  );
}
