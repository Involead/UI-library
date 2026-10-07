import { useState } from "react";

import { Tab, TabPanel, type TabItem } from "@/components/Tab";
import type { IconName } from "@/icons";

import type { ExplorerArgs } from "../../explorer-config";
import { getStringArg } from "../args";
import { isChoice, type PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange: (value: string) => void;
};

const baseItems: TabItem[] = [
  { label: "Tab 1", value: "tab-1" },
  { label: "Tab 2", value: "tab-2" },
  { label: "Tab 3", value: "tab-3" },
];

// Enough tabs to overflow a narrow container.
const manyItems: TabItem[] = Array.from({ length: 12 }, (_, index) => ({
  label: `Tab ${index + 1}`,
  value: `tab-${index + 1}`,
}));

// Swap in any names from your icon set.
const iconNames: IconName[] = ["search", "info", "settings"];

const TABS_ID = "demo-tabs";

export function TabPreview({ args, composition, layout, onChange }: Props) {
  const [internalValue, setInternalValue] = useState(
    getStringArg(args, "value", "tab-1"),
  );

  const selectedSize = getStringArg(args, "size", "medium");
  const size = isChoice(selectedSize, ["small", "medium", "large"])
    ? selectedSize
    : "medium";

  const selectedVariant = getStringArg(args, "variant", "line");
  const variant = isChoice(selectedVariant, ["line", "pill"])
    ? selectedVariant
    : "line";

  const selectedOrientation = getStringArg(args, "orientation", "horizontal");
  const orientation = isChoice(selectedOrientation, ["horizontal", "vertical"])
    ? selectedOrientation
    : "horizontal";

  const disabled = typeof args.disabled === "boolean" ? args.disabled : false;
  const scrollable = args.scrollable === true;

  const iconOnly = args.iconOnly === true;
  const withIcons = args.withIcons === true || iconOnly;
  const selectedIconPosition = getStringArg(args, "iconPosition", "start");
  const iconPosition = isChoice(selectedIconPosition, [
    "start",
    "end",
    "top",
    "bottom",
  ])
    ? selectedIconPosition
    : "start";

  const value = getStringArg(args, "value", "tab-1");
  const currentValue = value || internalValue;

  // Per-tab disabling: "none" or the value of the tab to disable.
  const disabledTab = getStringArg(args, "disabledTab", "none");
  const items: TabItem[] = (scrollable ? manyItems : baseItems).map(
    (item, index) => ({
      ...item,
      icon: withIcons ? iconNames[index % iconNames.length] : undefined,
      disabled: item.value === disabledTab,
    }),
  );

  const handleChange = (nextValue: string) => {
    setInternalValue(nextValue);
    onChange(nextValue);
  };

  const stackClass = `preview-stack${layout === "horizontal" ? " horizontal" : ""}`;

  const headingStyle = (first: boolean) => ({
    marginTop: first ? 0 : "16px",
    marginBottom: "12px",
    fontSize: "14px",
    fontWeight: 600,
  });

  const contentStyle = {
    padding: "var(--spacing-lg)",
    background: "var(--color-surface-secondary)",
    borderRadius: "var(--radius-md)",
  } as const;

  const renderPanels = () =>
    items.map((item) => (
      <TabPanel
        key={item.value}
        tabsId={TABS_ID}
        value={item.value}
        activeValue={currentValue}
      >
        <div style={contentStyle}>
          <p style={{ margin: 0 }}>
            Content for: <strong>{item.label}</strong>
          </p>
        </div>
      </TabPanel>
    ));

  // Sizes composition - show all three sizes
  if (composition === "sizes") {
    return (
      <div className={stackClass}>
        {(["small", "medium", "large"] as const).map((tabSize, index) => (
          <div key={tabSize}>
            <h3
              style={{
                ...headingStyle(index === 0),
                textTransform: "capitalize",
              }}
            >
              {tabSize}
            </h3>
            <Tab
              id={`${TABS_ID}-${tabSize}`}
              items={items}
              value={currentValue}
              onChange={handleChange}
              size={tabSize}
              variant={variant}
              orientation={orientation}
              disabled={disabled}
              iconPosition={iconPosition}
              iconOnly={iconOnly}
            />
            {/* Note: panels are shared across sizes for simplicity in the explorer */}
            {index === 0 && renderPanels()}
          </div>
        ))}
      </div>
    );
  }

  // Orientation composition - show both horizontal and vertical
  if (composition === "orientation") {
    return (
      <div className={stackClass}>
        <div>
          <h3 style={headingStyle(true)}>Horizontal</h3>
          <Tab
            id={`${TABS_ID}-horizontal`}
            items={items}
            value={currentValue}
            onChange={handleChange}
            size={size}
            variant={variant}
            orientation="horizontal"
            disabled={disabled}
            iconPosition={iconPosition}
            iconOnly={iconOnly}
          />
          <div style={{ marginTop: "12px" }}>{renderPanels()}</div>
        </div>
        <div>
          <h3 style={headingStyle(false)}>Vertical</h3>
          <div style={{ display: "flex", gap: "16px" }}>
            <Tab
              id={`${TABS_ID}-vertical`}
              items={items}
              value={currentValue}
              onChange={handleChange}
              size={size}
              variant={variant}
              orientation="vertical"
              disabled={disabled}
              iconPosition={iconPosition}
              iconOnly={iconOnly}
            />
            <div style={{ minWidth: "200px" }}>{renderPanels()}</div>
          </div>
        </div>
      </div>
    );
  }

  // Default preview with current orientation setting
  return (
    <div
      style={{
        display: "flex",
        flexDirection: orientation === "vertical" ? "row" : "column",
        gap: "16px",
        // A narrow container makes the horizontal overflow visible.
        ...(scrollable && orientation === "horizontal"
          ? { width: "360px", maxWidth: "100%" }
          : {}),
      }}
    >
      <Tab
        id={TABS_ID}
        items={items}
        value={currentValue}
        onChange={handleChange}
        size={size}
        variant={variant}
        orientation={orientation}
        disabled={disabled}
        scrollable={scrollable}
        iconPosition={iconPosition}
        iconOnly={iconOnly}
      />

      {renderPanels()}
    </div>
  );
}