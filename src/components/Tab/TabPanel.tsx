import { useEffect } from "react";
import type { ReactNode } from "react";

import { getPanelId, getTabId } from "./tab-ids";

export interface TabPanelProps {
  tabsId: string;
  value: string;
  activeValue: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({
  tabsId,
  value,
  activeValue,
  children,
  className,
}: TabPanelProps) {
  const isActive = value === activeValue;

  // Dev-only: warn when the matching <TabButton> can't be found in the DOM.
  // Catches the common footgun of forgetting to pass `id` to <TabList> or
  // passing a different value to `tabsId`.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const tabId = getTabId(tabsId, value);
    if (!document.getElementById(tabId)) {
      console.warn(
        `[TabPanel] No tab button found for tabsId="${tabsId}" value="${value}". ` +
          `Make sure <TabList id="${tabsId}"> is rendered with a ` +
          `<TabButton value="${value}">.`,
      );
    }
  }, [tabsId, value]);

  return (
    <div
      id={getPanelId(tabsId, value)}
      role="tabpanel"
      aria-labelledby={getTabId(tabsId, value)}
      tabIndex={0}
      hidden={!isActive}
      className={className}
    >
      {children}
    </div>
  );
}