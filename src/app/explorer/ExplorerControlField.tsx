import type { ExplorerComponent, ExplorerValue } from "../explorer-config";
import { getBooleanArg } from "./args";
import type { ExplorerArgs } from "../explorer-config";

type Props = {
  control: ExplorerComponent["controls"][number];
  args: ExplorerArgs;
  componentName: string;
  onChange: (name: string, value: ExplorerValue) => void;
};

export function ExplorerControlField({ control, args, componentName, onChange }: Props) {
  const value = args[control.name];
  const ariaLabel = `${componentName} ${control.name}`;

  if (control.kind === "text") {
    const textValue = typeof value === "string" ? value : "";
    return (
      <input
        className="control-input"
        value={textValue}
        onChange={(event) => onChange(control.name, event.target.value)}
        aria-label={ariaLabel}
      />
    );
  }

  if (control.kind === "boolean") {
    return (
      <input
        className="control-checkbox"
        type="checkbox"
        checked={typeof value === "boolean" ? value : false}
        onChange={(event) => onChange(control.name, event.target.checked)}
        aria-label={ariaLabel}
      />
    );
  }

  if (control.kind === "select") {
    const selected = typeof value === "string" ? value : "";
    return (
      <select
        className="control-input"
        value={selected}
        onChange={(event) => onChange(control.name, event.target.value)}
        aria-label={ariaLabel}
      >
        {control.name === "as" ? <option value="">automatic</option> : null}
        {control.options?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  if (control.kind === "json") {
    return (
      <textarea
        className="control-input control-json"
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(control.name, event.target.value)}
        aria-label={ariaLabel}
        spellCheck={false}
      />
    );
  }

  if (!getBooleanArg(args, "multiple")) {
    return (
      <select
        className="control-input"
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(control.name, event.target.value || null)}
        aria-label={ariaLabel}
      >
        <option value="">No selection</option>
        {control.options?.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    );
  }

  const selected = Array.isArray(value) ? value : [];
  return (
    <div className="multi-select-controls" role="group" aria-label={ariaLabel}>
      {control.options?.map((option) => (
        <label key={option}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={(event) => {
              const next = event.target.checked
                ? [...selected, option]
                : selected.filter((item) => item !== option);
              onChange(control.name, next);
            }}
          />
          {option}
        </label>
      ))}
    </div>
  );
}
