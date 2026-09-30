import { Input } from "@/index";
import type { ExplorerArgs } from "../../explorer-config";
import { getBooleanArg, getStringArg } from "../args";
import { inputTypes, isChoice, type InputLabelPosition, type InputSize, type InputType } from "../types";

type Props = {
  args: ExplorerArgs;
  onChange: (value: string) => void;
};

export function InputPreview({ args, onChange }: Props) {
  const selectedSize = getStringArg(args, "size", "medium");
  const size: InputSize = isChoice(selectedSize, ["small", "medium", "large"])
    ? selectedSize
    : "medium";
  const selectedType = getStringArg(args, "type", "text");
  const type: InputType = isChoice(selectedType, inputTypes) ? selectedType : "text";
  const selectedLabelPosition = getStringArg(args, "labelPosition", "top");
  const labelPosition: InputLabelPosition = isChoice(selectedLabelPosition, ["top", "left", "right"])
    ? selectedLabelPosition
    : "top";

  return (
    <Input
      label={getStringArg(args, "label")}
      labelPosition={labelPosition}
      value={getStringArg(args, "value")}
      placeholder={getStringArg(args, "placeholder")}
      type={type}
      size={size}
      helperText={getStringArg(args, "helperText")}
      error={getStringArg(args, "error")}
      required={getBooleanArg(args, "required")}
      disabled={getBooleanArg(args, "disabled")}
      fullWidth={getBooleanArg(args, "fullWidth")}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
