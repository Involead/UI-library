import type { ReactNode } from "react";
import { ExplorerPage } from "./ExplorerPage";

export default function ExplorerLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ExplorerPage />
      {children}
    </>
  );
}