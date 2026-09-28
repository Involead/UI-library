import type { DropdownOption } from "@/components/Dropdown";
import {
  explorerComponents,
  type ExplorerArgs,
  type ExplorerComponent,
} from "../explorer-config";
import type { PreviewLayout } from "./types";

export function getExplorerComponent(name: string): ExplorerComponent {
  const component = explorerComponents.find((item) => item.name === name);
  if (!component) {
    throw new Error(`Unknown component "${name}" in explorer configuration.`);
  }
  return component;
}

export function getComponentDefaults(component: ExplorerComponent): ExplorerArgs {
  return Object.fromEntries(
    component.controls.map((control) => {
      if (control.name === "options" && component.name === "Dropdown") {
        const options = component.stories[0].args.options;
        return [
          control.name,
          typeof options === "string"
            ? JSON.stringify(JSON.parse(options), null, 2)
            : "[]",
        ];
      }
      if (control.kind === "boolean") {
        return [control.name, control.name === "labelClickable"];
      }
      if (control.kind === "multi-select") return [control.name, []];
      if (control.kind === "select") {
        const defaults: Record<string, string> = {
          variant: "primary",
          size: "medium",
          type: "text",
          color: "primary",
          as: "",
          orientation: "horizontal",
        };
        if (component.name === "Typography" && control.name === "variant") {
          return [control.name, "body"];
        }
        return [
          control.name,
          defaults[control.name] ?? control.options?.[0] ?? "",
        ];
      }
      if (control.name === "value") return [control.name, null];
      return [control.name, ""];
    }),
  );
}

export function getStringArg(args: ExplorerArgs, name: string, fallback = "") {
  const value = args[name];
  return typeof value === "string" ? value : fallback;
}

export function getBooleanArg(args: ExplorerArgs, name: string, fallback = false) {
  const value = args[name];
  return typeof value === "boolean" ? value : fallback;
}

export function getPreviewLayout(args: ExplorerArgs, fallback: PreviewLayout = "vertical"): PreviewLayout {
  return args.orientation === "horizontal" ? "horizontal" : fallback;
}

export function getDropdownOptions(args: ExplorerArgs): DropdownOption[] | null {
  try {
    const parsed: unknown = JSON.parse(getStringArg(args, "options", "[]"));
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (option) =>
          typeof option === "object" &&
          option !== null &&
          "label" in option &&
          typeof option.label === "string" &&
          "value" in option &&
          typeof option.value === "string" &&
          (!("disabled" in option) || typeof option.disabled === "boolean"),
      )
    ) {
      return parsed as DropdownOption[];
    }
    return null;
  } catch {
    return null;
  }
}
