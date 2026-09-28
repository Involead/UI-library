import { Dropdown } from "@/index";
import type { ExplorerArgs } from "../../explorer-config";
import { getBooleanArg, getDropdownOptions, getStringArg } from "../args";
import { isChoice, type DropdownSize, type PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange: (value: string | string[] | null) => void;
  onOpenChange: (isOpen: boolean) => void;
};

export function DropdownPreview({ args, composition, layout, onChange, onOpenChange }: Props) {
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
  const stackClass = `preview-stack${layout === "horizontal" ? " horizontal" : ""}`;
  // Composition examples are uncontrolled (defaultValue), like the Storybook stories.
  const exampleProps = { options, onChange, onOpenChange };

  if (composition === "states") {
    const stateProps = {
      ...exampleProps,
      size,
      searchable: getBooleanArg(args, "searchable"),
      clearable: getBooleanArg(args, "clearable"),
    };
    return (
      <div className={stackClass}>
        <Dropdown {...stateProps} label="Default" placeholder="Select a fruit" />
        <Dropdown {...stateProps} label="With value" defaultValue="cherry" />
        <Dropdown {...stateProps} label="With helper text" placeholder="Select a fruit" helperText="You can change this later in settings." />
        <Dropdown {...stateProps} label="Error" placeholder="Select a fruit" error="Please select a fruit." required />
        <Dropdown {...stateProps} label="Disabled" placeholder="Select a fruit" disabled />
        <Dropdown {...stateProps} label="Disabled with value" defaultValue="mango" disabled />
        <Dropdown {...stateProps} label="Multi — error" multiple placeholder="Select fruits" defaultValue={["apple"]} error="Select at least two fruits." />
        <Dropdown {...stateProps} label="Multi — disabled" multiple defaultValue={["apple", "grape"]} disabled />
        <Dropdown {...stateProps} label="Disabled option (Pineapple)" placeholder="Open to see" helperText="Disabled options can't be highlighted or selected." />
        <Dropdown {...stateProps} label="Value not in options" placeholder="Select a fruit" defaultValue="kiwi" helperText="An unmatched value falls back to the placeholder." />
      </div>
    );
  }

  if (composition === "all") {
    const allProps = { ...exampleProps, disabled: getBooleanArg(args, "disabled") };
    return (
      <div className={stackClass}>
        <Dropdown {...allProps} label="Small" size="small" placeholder="Select a fruit" />
        <Dropdown {...allProps} label="Medium" size="medium" placeholder="Select a fruit" />
        <Dropdown {...allProps} label="Large" size="large" placeholder="Select a fruit" />
        <Dropdown {...allProps} label="Single select" placeholder="Select a fruit" />
        <Dropdown {...allProps} label="Single — searchable & clearable" defaultValue="banana" searchable clearable />
        <Dropdown {...allProps} label="Single — error" placeholder="Select a fruit" error="Please select a fruit." />
        <Dropdown {...allProps} label="Multi select" multiple placeholder="Select fruits" defaultValue={["apple", "mango"]} />
        <Dropdown {...allProps} label="Multi — searchable & clearable" multiple placeholder="Select fruits" defaultValue={["cherry", "grape"]} searchable clearable />
        <Dropdown
          {...allProps}
          label="Multi — many selected"
          multiple
          defaultValue={["apple", "banana", "cherry", "grape", "mango", "orange", "strawberry"]}
          clearable
        />
      </div>
    );
  }
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
