import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { ExplorerArgs, ExplorerComponent, ExplorerValue } from "../explorer-config";
import { getComponentDefaults, getDropdownOptions } from "./args";
import { ExplorerControlField } from "./ExplorerControlField";
import type { ButtonSize, ButtonVariant, Panel } from "./types";

const MIN_HEIGHT = 160;
const MAX_VIEWPORT_RATIO = 0.85;
const DEFAULT_HEIGHT = 340;
const KEY_STEP = 24;
const FALLBACK_TOPBAR_HEIGHT = 58; // only used if .canvas can't be found

const buttonPropRows = [
  { name: "children", description: "Button label content", defaultValue: "Primary Button" },
  { name: "variant", description: "Visual button style", defaultValue: "primary" },
  { name: "size", description: "Button size", defaultValue: "medium" },
  { name: "loading", description: "Shows a loading state", defaultValue: "false" },
  { name: "disabled", description: "Disables interaction", defaultValue: "false" },
  { name: "fullWidth", description: "Fills the available width", defaultValue: "false" },
];

type ButtonState = {
  children: string;
  variant: ButtonVariant;
  size: ButtonSize;
  loading: boolean;
  disabled: boolean;
  fullWidth: boolean;
};

type Props = {
  activePanel: Panel;
  onPanelChange: (panel: Panel) => void;
  activeComponent: string;
  component: ExplorerComponent;
  selectedStory?: ExplorerComponent["stories"][number];
  args: ExplorerArgs;
  button: ButtonState;
  actionLog: string[];
  codeDraft: string;
  codeError: string;
  onButtonControl: (name: string, value: string | boolean) => void;
  onComponentArg: (name: string, value: ExplorerValue) => void;
  onCodeChange: (value: string) => void;
  onApplyCode: () => void;
  onClearActions: () => void;
  onReset: () => void;
};

export function ExplorerPanels({
  activePanel,
  onPanelChange,
  activeComponent,
  component,
  selectedStory,
  args,
  button,
  actionLog,
  codeDraft,
  codeError,
  onButtonControl,
  onComponentArg,
  onCodeChange,
  onApplyCode,
  onClearActions,
  onReset,
}: Props) {
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startY: number; startHeight: number } | null>(null);

  const clampHeight = useCallback((value: number) => {
    const canvasHeight =
      panelRef.current?.closest<HTMLElement>(".canvas")?.clientHeight ??
      window.innerHeight - FALLBACK_TOPBAR_HEIGHT;
    return Math.min(Math.max(value, MIN_HEIGHT), canvasHeight * MAX_VIEWPORT_RATIO);
  }, []);

  const handleResizeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragRef.current = { startY: event.clientY, startHeight: height };
    setIsDragging(true);
  };

  // While dragging, listen on window so the resize keeps working
  // wherever the pointer goes, and always clean up.
  useEffect(() => {
    if (!isDragging) return;

    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      // dragging up (smaller clientY) => taller panel
      setHeight(clampHeight(drag.startHeight + (drag.startY - event.clientY)));
    };
    const stop = () => {
      dragRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    document.body.classList.add("is-resizing");

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
      document.body.classList.remove("is-resizing");
    };
  }, [isDragging, clampHeight]);

  const handleResizeKey = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHeight((h) => clampHeight(h + KEY_STEP));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setHeight((h) => clampHeight(h - KEY_STEP));
    }
  };

  return (
    <div className="controls" ref={panelRef} style={{ height }}>
      <div
        className="resize-handle"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize controls panel"
        aria-valuenow={Math.round(height)}
        aria-valuemin={MIN_HEIGHT}
        tabIndex={0}
        onPointerDown={handleResizeStart}
        onKeyDown={handleResizeKey}
      />

      <div className="controls-body">
        <div className="tabs" role="tablist" aria-label="Controls tabs">
          {(["controls", "actions", "code"] as Panel[]).map((panel) => (
            <button
              key={panel}
              type="button"
              className={`tab${activePanel === panel ? " active" : ""}`}
              role="tab"
              aria-selected={activePanel === panel}
              onClick={() => onPanelChange(panel)}
            >
              {panel[0].toUpperCase() + panel.slice(1)}
            </button>
          ))}
        </div>

        {activePanel === "controls" ? (
          <div className="table-shell">
            <table className="controls-table">
              <colgroup>
                <col />
                <col />
                <col />
                <col />
              </colgroup>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Default</th>
                  <th>Control</th>
                </tr>
              </thead>
              <tbody>
                {activeComponent === "Button"
                  ? buttonPropRows.map((row) => (
                      <tr key={row.name}>
                        <td>{row.name}</td>
                        <td>{row.description}</td>
                        <td className="default-cell">{row.defaultValue}</td>
                        <td className="control-cell">
                          {row.name === "children" ? (
                            <input
                              className="control-input"
                              value={button.children}
                              onChange={(event) => onButtonControl(row.name, event.target.value)}
                              aria-label="Button children"
                            />
                          ) : row.name === "variant" ? (
                            <select
                              className="control-input"
                              value={button.variant}
                              onChange={(event) => onButtonControl(row.name, event.target.value)}
                              aria-label="Button variant"
                            >
                              {["primary", "secondary", "outline", "ghost", "danger"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : row.name === "size" ? (
                            <select
                              className="control-input"
                              value={button.size}
                              onChange={(event) => onButtonControl(row.name, event.target.value)}
                              aria-label="Button size"
                            >
                              {["small", "medium", "large"].map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              className="control-checkbox"
                              type="checkbox"
                              checked={
                                row.name === "loading"
                                  ? button.loading
                                  : row.name === "disabled"
                                    ? button.disabled
                                    : button.fullWidth
                              }
                              onChange={(event) => onButtonControl(row.name, event.target.checked)}
                              aria-label={`Button ${row.name}`}
                            />
                          )}
                        </td>
                      </tr>
                    ))
                  : component.controls
                      .filter((control) => control.name !== "orientation" || selectedStory?.composition)
                      .map((control) => {
                        const defaultArgs = {
                          ...getComponentDefaults(component),
                          ...selectedStory?.args,
                        };
                        const defaultValue = defaultArgs[control.name];
                        const formattedDefault = Array.isArray(defaultValue)
                          ? defaultValue.join(", ")
                          : defaultValue === null
                            ? "None"
                            : typeof defaultValue === "string" && control.kind === "json"
                              ? `${getDropdownOptions(defaultArgs)?.length ?? 0} options`
                              : String(defaultValue ?? "");
                        return (
                          <tr key={control.name}>
                            <td>{control.name}</td>
                            <td>{control.description}</td>
                            <td className="default-cell">{formattedDefault || "—"}</td>
                            <td className="control-cell">
                              <ExplorerControlField
                                control={control}
                                args={args}
                                componentName={activeComponent}
                                onChange={onComponentArg}
                              />
                            </td>
                          </tr>
                        );
                      })}
              </tbody>
            </table>
          </div>
        ) : null}

        {activePanel === "actions" ? (
          <div className="action-panel">
            <div className="action-panel-header">
              <span>Interaction events</span>
              <button type="button" className="clear-actions" onClick={onClearActions}>
                Clear
              </button>
            </div>
            {actionLog.length ? (
              <ul className="action-list">
                {actionLog.map((action, index) => (
                  <li key={`${action}-${index}`}>{action}</li>
                ))}
              </ul>
            ) : (
              <div className="panel-empty">
                Interact with the preview to see events here.
              </div>
            )}
          </div>
        ) : null}

        {activePanel === "code" ? (
          <>
            <textarea
              className="code-panel"
              value={codeDraft}
              onChange={(event) => onCodeChange(event.target.value)}
              aria-label={`Editable ${activeComponent} code`}
              spellCheck={false}
            />
            {codeError ? <div className="code-error" role="alert">{codeError}</div> : null}
            <div className="code-actions">
              <button type="button" className="reset-btn" onClick={onApplyCode}>
                Apply code
              </button>
            </div>
          </>
        ) : null}

        <button type="button" className="reset-btn" onClick={onReset}>
          Reset controls
        </button>
      </div>
    </div>
  );
}