import { icons } from "@/icons";

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
  composition?: "all" | "sizes" | "states" | "headings" | "colors" | "label-clickable" | "group" | "gallery";
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

export const iconColors = [
  "var(--color-text-primary)",
  "var(--color-primary)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-error)",
  "var(--color-info)",
];

/** Default markup for the Icon "Custom SVG" story; users can paste their own in the code panel. */
export const customIconSvg = `<svg viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
  <path fill-rule="evenodd" clip-rule="evenodd" fill="currentColor" d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z" />
</svg>`;

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
      select("labelPosition", "Which side of the checkbox the label sits on", ["right", "left"]),
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
    name: "Radio",
    description: "Accessible radio button for choosing one option from a group, with helper and error messaging and sizing.",
    accessibility: [
      "Radios use native radio inputs, so arrow keys move the selection within a group.",
      "Give radios in the same group a shared name and wrap them in a radiogroup with a label.",
      "Labels can be configured to select or only describe the control.",
      "Helper and error messages are associated with the radio.",
    ],
    controls: [
      text("label", "Visible radio label"),
      text("helperText", "Supporting guidance"),
      text("error", "Validation error message"),
      select("size", "Radio size", ["small", "medium", "large"]),
      select("labelPosition", "Which side of the radio the label sits on", ["right", "left"]),
      select("orientation", "Arrange examples in a row or stacked like Storybook", ["horizontal", "vertical"]),
      boolean("checked", "Checked state"),
      boolean("disabled", "Disables the radio"),
      boolean("labelClickable", "Makes the label select the radio"),
    ],
    stories: [
      { name: "All", description: "Common radio states", args: { label: "Option", checked: false, orientation: "horizontal" }, composition: "all" },
      { name: "Group", description: "A group of radios sharing one name", args: { orientation: "vertical" }, composition: "group" },
      { name: "Sizes", description: "Small, medium, and large sizes", args: { checked: false, orientation: "horizontal" }, composition: "sizes" },
      { name: "States", description: "Checked, disabled, and error states", args: { checked: false, orientation: "horizontal" }, composition: "states" },
      { name: "Default", description: "Single labeled radio", args: { label: "Email notifications", checked: false } },
      { name: "With Helper Text", description: "Radio with supporting guidance", args: { label: "Email notifications", helperText: "We'll send a summary once a day.", checked: false } },
      { name: "With Error", description: "Validation error state", args: { label: "Email notifications", error: "Please choose a notification method.", checked: false } },
      { name: "Label Clickable", description: "Controls whether the label selects the radio", args: { checked: false, orientation: "vertical" }, composition: "label-clickable" },
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
  {
    name: "Icon",
    description: "Icon wrapper for the built-in set or any custom svg, controlling size, color, hover color, disabled state and clicks.",
    accessibility: [
      "Icons are decorative by default and hidden from assistive technology.",
      "Pass a title or ariaLabel when the icon conveys meaning on its own; it is then announced as an image.",
      "With onClick the icon renders as a native button, so it is focusable and works with Enter and Space; always give it a title or ariaLabel.",
      "Icons inherit the text color, so they keep the contrast of the surrounding content.",
    ],
    controls: [
      select("name", "Built-in icon (ignored when a custom svg is passed as children)", Object.keys(icons)),
      text("size", "Width and height in px (or any CSS length)"),
      select("color", "Icon color", ["currentColor", ...iconColors]),
      text("hoverColor", "Color while hovered, e.g. var(--color-error)"),
      text("strokeWidth", "Stroke width of built-in icons"),
      text("title", "Tooltip, and accessible name when ariaLabel is empty"),
      text("ariaLabel", "Accessible name; leave empty for a decorative icon"),
      boolean("disabled", "Mutes the icon and blocks hover and clicks"),
      boolean("clickable", "Passes onClick, so the icon renders as a button"),
      select("orientation", "Arrange examples in a row or stacked like Storybook", ["horizontal", "vertical"]),
    ],
    stories: [
      { name: "Playground", description: "A single configurable icon", args: { name: "search", size: "24", strokeWidth: "2", color: "currentColor" } },
      { name: "Gallery", description: "Every icon in the set, searchable by name", args: { size: "24", strokeWidth: "2", color: "currentColor", orientation: "horizontal" }, composition: "gallery" },
      { name: "Sizes", description: "Common icon sizes from 12px to 48px", args: { name: "search", strokeWidth: "2", color: "currentColor", orientation: "horizontal" }, composition: "sizes" },
      { name: "Colors", description: "Semantic colors, plus currentColor inheritance", args: { name: "info", size: "24", strokeWidth: "2", orientation: "horizontal" }, composition: "colors" },
      { name: "Labelled", description: "Meaningful icon with an accessible name", args: { name: "search", size: "24", strokeWidth: "2", color: "currentColor", title: "Search" } },
      { name: "Hover Color", description: "Changes color on hover", args: { name: "heart", size: "32", strokeWidth: "2", color: "currentColor", hoverColor: "var(--color-error)" } },
      { name: "Disabled", description: "Muted, with hover and clicks blocked", args: { name: "settings", size: "32", strokeWidth: "2", color: "currentColor", hoverColor: "var(--color-primary)", disabled: true, clickable: true, title: "Settings" } },
      { name: "Clickable", description: "Renders as a keyboard-accessible button", args: { name: "plus", size: "24", strokeWidth: "2", color: "currentColor", hoverColor: "var(--color-primary)", clickable: true, title: "Add" } },
      { name: "Custom SVG", description: "Any svg passed as children, scaled and colored by the wrapper", args: { size: "32", color: "var(--color-success)", hoverColor: "var(--color-primary)", title: "Home", svg: customIconSvg } },
    ],
  },
];
