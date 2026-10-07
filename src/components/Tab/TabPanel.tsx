import type { ReactNode } from "react";

import { getPanelId, getTabId } from "./tab-ids";

export interface TabPanelProps {
  tabsId: string;
  value: string;
  activeValue: string;
  children: ReactNode;
}

export function TabPanel({
  tabsId,
  value,
  activeValue,
  children,
}: TabPanelProps) {
  const isActive = value === activeValue;

  return (
    <div
      id={getPanelId(tabsId, value)}
      role="tabpanel"
      aria-labelledby={getTabId(tabsId, value)}
      tabIndex={0}
      hidden={!isActive}
    >
      {children}
    </div>
  );
}