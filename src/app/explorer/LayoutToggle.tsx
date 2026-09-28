import type { PreviewLayout } from "./types";

type Props = {
  layout: PreviewLayout;
  onChange: (layout: PreviewLayout) => void;
};

export function LayoutToggle({ layout, onChange }: Props) {
  return (
    <div className="layout-toggle" role="group" aria-label="Preview layout">
      <span>Layout</span>
      <button
        type="button"
        className={layout === "horizontal" ? "active" : ""}
        aria-pressed={layout === "horizontal"}
        onClick={() => onChange("horizontal")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="3" y="6" width="5" height="12" rx="1" />
          <rect x="10" y="6" width="5" height="12" rx="1" />
          <rect x="17" y="6" width="4" height="12" rx="1" />
        </svg>
        <span className="label">Horizontal</span>
      </button>
      <button
        type="button"
        className={layout === "vertical" ? "active" : ""}
        aria-pressed={layout === "vertical"}
        onClick={() => onChange("vertical")}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="4" y="3" width="16" height="5" rx="1" />
          <rect x="4" y="10" width="16" height="4" rx="1" />
          <rect x="4" y="16" width="16" height="5" rx="1" />
        </svg>
        <span className="label">Vertical</span>
      </button>
    </div>
  );
}
