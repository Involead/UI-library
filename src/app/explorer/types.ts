import type { explorerComponents } from "../explorer-config";

export type Panel = "controls" | "actions" | "code";
export type ComponentName = (typeof explorerComponents)[number]["name"];
export type PreviewLayout = "horizontal" | "vertical";

export type InputSize = "small" | "medium" | "large";
export type InputType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "time"
  | "month"
  | "week"
  | "color"
  | "file";
export type CheckboxSize = "small" | "medium" | "large";
export type RadioSize = "small" | "medium" | "large";
export type RadioLabelPosition = "right" | "left";
export type DropdownSize = "small" | "medium" | "large";
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type ButtonSize = "small" | "medium" | "large";
export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "bodySmall"
  | "label"
  | "caption";
export type TypographyColor = "primary" | "secondary" | "tertiary" | "disabled";
export type TypographyElement =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "div"
  | "label";

export const inputTypes: InputType[] = [
  "text",
  "password",
  "email",
  "number",
  "tel",
  "url",
  "search",
  "date",
  "datetime-local",
  "time",
  "month",
  "week",
  "color",
  "file",
];
export const typographyVariants: TypographyVariant[] = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "body",
  "bodySmall",
  "label",
  "caption",
];
export const typographyElements: TypographyElement[] = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "div",
  "label",
];
export const typographyColors: TypographyColor[] = [
  "primary",
  "secondary",
  "tertiary",
  "disabled",
];

export const radioGroupOptions = [
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "Push notification", value: "push" },
];

export function isChoice<T extends string>(value: string, choices: T[]): value is T {
  return choices.includes(value as T);
}
