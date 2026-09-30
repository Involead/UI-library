export type ExplorerValue = string | boolean | string[] | null;
export type ExplorerArgs = Record<string, ExplorerValue>;
export type ExplorerControlKind = "text" | "boolean" | "select" | "json" | "multi-select";

export type ExplorerControl = {
  name: string;
  description: string;
  kind: ExplorerControlKind;
  options?: string[];
};

export type ExplorerStory = {
  name: string;
  description: string;
  args: ExplorerArgs;
  composition?: "all" | "sizes" | "states" | "headings" | "colors" | "label-clickable";
};

export type ExplorerComponent = {
  name: string;
  description: string;
  accessibility: string[];
  controls: ExplorerControl[];
  stories: ExplorerStory[];
};

const fruitOptions = JSON.stringify(
  [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Cherry", value: "cherry" },
    { label: "Grape", value: "grape" },
    { label: "Mango", value: "mango" },
    { label: "Orange", value: "orange" },
    { label: "Pineapple", value: "pineapple", disabled: true },
    { label: "Strawberry", value: "strawberry" },
    { label: "Watermelon", value: "watermelon" },
  ],
  null,
);

const text = (name: string, description: string): ExplorerControl => ({
  name,
  description,
  kind: "text",
});
const boolean = (name: string, description: string): ExplorerControl => ({
  name,
  description,
  kind: "boolean",
});
const select = (
  name: string,
  description: string,
  options: string[],
): ExplorerControl => ({ name, description, kind: "select", options });

export const explorerComponents: ExplorerComponent[] = [
  {
    name: "Button",
    description: "Buttons communicate actions users can take.",
    accessibility: [
      "Use concise, action-oriented labels.",
      "Loading buttons expose aria-busy and are disabled while busy.",
      "Disabled buttons remain visibly distinct and cannot be activated.",
      "Keyboard focus is visible through the component focus ring.",
    ],
    controls: [
      text("children", "Button label content"),
      select("variant", "Visual button style", [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "danger",
      ]),
      select("size", "Button size", ["small", "medium", "large"]),
      boolean("loading", "Shows a loading state"),
      boolean("disabled", "Disables interaction"),
      boolean("fullWidth", "Fills the available width"),
    ],
    stories: [
      { name: "Primary", description: "Primary action", args: { children: "Primary Button", variant: "primary" } },
      { name: "Secondary", description: "Secondary action", args: { children: "Secondary Button", variant: "secondary" } },
      { name: "Outline", description: "Outlined action", args: { children: "Outline Button", variant: "outline" } },
      { name: "Ghost", description: "Low-emphasis action", args: { children: "Ghost Button", variant: "ghost" } },
      { name: "Danger", description: "Destructive action", args: { children: "Delete", variant: "danger" } },
      { name: "Loading", description: "Busy state", args: { children: "Saving", loading: true } },
      { name: "Disabled", description: "Disabled state", args: { children: "Disabled Button", disabled: true } },
      { name: "Small", description: "Small size", args: { children: "Small Button", size: "small" } },
      { name: "Medium", description: "Medium size", args: { children: "Medium Button", size: "medium" } },
      { name: "Large", description: "Large size", args: { children: "Large Button", size: "large" } },
      { name: "With Left Icon", description: "Leading icon", args: { children: "Download" } },
      { name: "With Right Icon", description: "Trailing icon", args: { children: "Next" } },
      { name: "With Both Icons", description: "Leading and trailing icons", args: { children: "Continue" } },
      { name: "Full Width", description: "Expands to fill its container", args: { children: "Full Width Button", fullWidth: true } },
    ],
  },
  {
    name: "Input",
    description: "Text-entry control with labels, validation, helper text, and input types.",
    accessibility: [
      "Provide a label for every field.",
      "Required fields expose their required state.",
      "Helper and error text are associated with the input.",
      "Invalid values are exposed with aria-invalid.",
    ],
    controls: [
      text("label", "Visible field label"),
      text("value", "Current field value"),
      text("placeholder", "Placeholder text"),
      select("type", "Native input type", ["text", "password", "email", "number", "tel", "url", "search", "date", "datetime-local", "time", "month", "week", "color", "file"]),
      select("size", "Input size", ["small", "medium", "large"]),
      text("helperText", "Supporting field guidance"),
      text("error", "Validation error message"),
      boolean("required", "Marks the field as required"),
      boolean("disabled", "Disables the field"),
      boolean("fullWidth", "Fills the available width"),
    ],
    stories: [
      { name: "Default", description: "Text input with label", args: { label: "Email", value: "", placeholder: "you@example.com" } },
      { name: "Required", description: "Required field", args: { label: "Email", value: "", placeholder: "you@example.com", required: true } },
      { name: "With Helper Text", description: "Supporting guidance", args: { label: "Username", value: "", placeholder: "jane_doe", helperText: "This will be visible to other users." } },
      { name: "Password", description: "Password input with visibility toggle", args: { label: "Password", value: "", type: "password", placeholder: "Enter your password" } },
      { name: "Number Type", description: "Numeric input", args: { label: "Age", value: "", type: "number", placeholder: "18" } },
      { name: "Email Type", description: "Email input", args: { label: "Email", value: "", type: "email", placeholder: "you@example.com" } },
      { name: "Date Type", description: "Date input", args: { label: "Date of birth", value: "", type: "date" } },
      { name: "With Error", description: "Validation error state", args: { label: "Email", value: "not-an-email", placeholder: "you@example.com", error: "Please enter a valid email address." } },
      { name: "Disabled", description: "Disabled input", args: { label: "Email", value: "", placeholder: "you@example.com", disabled: true } },
      { name: "Small", description: "Small input", args: { label: "Small", value: "", size: "small", placeholder: "Small input" } },
      { name: "Medium", description: "Medium input", args: { label: "Medium", value: "", size: "medium", placeholder: "Medium input" } },
      { name: "Large", description: "Large input", args: { label: "Large", value: "", size: "large", placeholder: "Large input" } },
      { name: "Full Width", description: "Fills available width", args: { label: "Full width", value: "", placeholder: "Spans the container", fullWidth: true } },
    ],
  },
  {
    name: "Dropdown",
    description: "Single- and multi-select dropdown with optional search, clearing, and validation.",
    accessibility: [
      "The dropdown trigger exposes combobox and expanded state semantics.",
      "Options use listbox and option roles, including multi-select state.",
      "Keyboard users can open, navigate, select, and dismiss the menu.",
      "Label, required, disabled, and error states are exposed accessibly.",
    ],
    controls: [
      text("label", "Visible dropdown label"),
      select("labelPosition", "Where the label sits relative to the dropdown", ["top", "left", "right"]),
      text("placeholder", "Empty-state prompt"),
      select("size", "Dropdown size", ["small", "medium", "large"]),
      { name: "options", description: "Options as a JSON array", kind: "json" },
      { name: "value", description: "Selected option value(s)", kind: "multi-select", options: ["apple", "banana", "cherry", "grape", "mango", "orange", "strawberry", "watermelon"] },
      text("helperText", "Supporting guidance"),
      text("error", "Validation error message"),
      boolean("multiple", "Allows selecting multiple options"),
      boolean("searchable", "Allows searching options"),
      boolean("clearable", "Allows clearing selection"),
      boolean("required", "Marks the field as required"),
      boolean("disabled", "Disables the dropdown"),
      boolean("fullWidth", "Fills the available width"),
      text("width", "Custom width (for example, 400px)"),
      select("orientation", "Arrange examples in a row or stacked like Storybook", ["horizontal", "vertical"]),
    ],
    stories: [
      { name: "Single Select", description: "Choose one option", args: { label: "Favorite fruit", placeholder: "Select a fruit", options: fruitOptions, value: null } },
      { name: "Multi Select", description: "Choose several options; the value is an array", args: { label: "Favorite fruits", placeholder: "Select fruits", options: fruitOptions, multiple: true, value: ["apple", "mango"] } },
      { name: "Searchable", description: "Filters options as you type", args: { label: "Favorite fruit", placeholder: "Select a fruit", options: fruitOptions, searchable: true, value: null } },
      { name: "Clearable", description: "Clears the selection with one click or Backspace", args: { label: "Favorite fruit", placeholder: "Select a fruit", options: fruitOptions, clearable: true, value: "banana" } },
      { name: "States", description: "Value, helper, error, disabled, disabled option, and unmatched value states", args: { options: fruitOptions, orientation: "horizontal" }, composition: "states" },
      { name: "All", description: "Sizes plus single and multi select variants", args: { options: fruitOptions, orientation: "horizontal" }, composition: "all" },
      { name: "Full Width", description: "Fills available width", args: { label: "Favorite fruit", placeholder: "Select a fruit", options: fruitOptions, fullWidth: true, value: null } },
      { name: "Custom Width", description: "Custom width dropdown", args: { label: "Favorite fruit", placeholder: "Select a fruit", options: fruitOptions, width: "400px", value: null } },
    ],
  },
  {
    name: "Checkbox",
    description: "Accessible checkbox with helper and error messaging, sizing, and custom indicators.",
    accessibility: [
      "Checkboxes use native checkbox inputs and support keyboard interaction.",
      "Labels can be configured to toggle or only describe the control.",
      "Helper and error messages are associated with the checkbox.",
      "Disabled and checked states are communicated to assistive technology.",
    ],
    controls: [
      text("label", "Visible checkbox label"),
      text("helperText", "Supporting guidance"),
      text("error", "Validation error message"),
      select("size", "Checkbox size", ["small", "medium", "large"]),
      select("orientation", "Arrange examples in a row or stacked like Storybook", ["horizontal", "vertical"]),
      boolean("checked", "Checked state"),
      boolean("disabled", "Disables the checkbox"),
      boolean("labelClickable", "Makes the label toggle the checkbox"),
    ],
    stories: [
      { name: "All", description: "Common checkbox states", args: { label: "Option", checked: false, orientation: "horizontal" }, composition: "all" },
      { name: "Sizes", description: "Small, medium, and large sizes", args: { checked: false, orientation: "horizontal" }, composition: "sizes" },
      { name: "States", description: "Checked, disabled, and error states", args: { checked: false, orientation: "horizontal" }, composition: "states" },
      { name: "With Label", description: "Labeled checkbox", args: { label: "Remember me", checked: false } },
      { name: "With Helper Text", description: "Checkbox with supporting guidance", args: { label: "Subscribe to newsletter", helperText: "We'll send you updates once a month.", checked: false } },
      { name: "Label Clickable", description: "Controls whether the label toggles the checkbox", args: { checked: false, orientation: "vertical" }, composition: "label-clickable" },
      { name: "With Icon", description: "Custom checked indicator", args: { label: "Add to favourites", checked: true, icon: "star" } },
    ],
  },
  {
    name: "Typography",
    description: "Consistent semantic text styles with configurable variants, colors, and elements.",
    accessibility: [
      "Choose semantic heading levels in document order.",
      "Use readable contrast and reserve disabled styling for unavailable content.",
      "Use the as prop when the visual variant and semantic element need to differ.",
    ],
    controls: [
      select("variant", "Typography style", ["h1", "h2", "h3", "h4", "h5", "h6", "body", "bodySmall", "label", "caption"]),
      select("color", "Text color", ["primary", "secondary", "tertiary", "disabled"]),
      select("as", "Rendered HTML element", ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "div", "label"]),
      select("orientation", "Arrange examples in a row or stacked like Storybook", ["horizontal", "vertical"]),
      text("children", "Text content"),
    ],
    stories: [
      { name: "All Variants", description: "Every typography variant", args: { orientation: "vertical" }, composition: "all" },
      { name: "Headings", description: "Heading hierarchy", args: { orientation: "vertical" }, composition: "headings" },
      { name: "Body", description: "Body copy", args: { variant: "body", children: "Body text is used for the main content of a page. It should be comfortable to read at length." } },
      { name: "Body Small", description: "Compact supporting copy", args: { variant: "bodySmall", children: "Small body text is used for secondary content and dense layouts." } },
      { name: "Label", description: "Label style", args: { variant: "label", children: "Email address" } },
      { name: "Caption", description: "Caption style", args: { variant: "caption", children: "Last updated 2 hours ago" } },
      { name: "Colors", description: "Available text colors", args: { variant: "body", orientation: "vertical" }, composition: "colors" },
    ],
  },
];
