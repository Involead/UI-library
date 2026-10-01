import { useEffect, useState } from "react";
import "./explorer.css";
import Link from "next/link";
import Image from "next/image";

type Props = {
  activeTab: "canvas" | "docs";
  onTabChange: (tab: "canvas" | "docs") => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  /** Canvas/Docs tabs and the preview toolbar; hidden on pages with no preview. */
  showControls?: boolean;
};

const MIN_ZOOM = 30;
const MAX_ZOOM = 200;
const ZOOM_STEP = 10;
const DEFAULT_ZOOM = 100;

export function ExplorerTopbar({
  activeTab,
  onTabChange,
  zoom,
  onZoomChange,
  showControls = true,
}: Props) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getTarget = () => document.getElementById("preview-fullscreen-target");

  useEffect(() => {
    const sync = () => setIsFullscreen(document.fullscreenElement === getTarget());
    sync();
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await getTarget()?.requestFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen failed:", error);
    }
  };

  const zoomOut = () => onZoomChange(Math.max(MIN_ZOOM, zoom - ZOOM_STEP));
  const zoomIn = () => onZoomChange(Math.min(MAX_ZOOM, zoom + ZOOM_STEP));
  const previewDisabled = activeTab === "docs";
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <header className="topbar">
      <Link href="/" className="brand-region" aria-label="Back to home">
        <Image
          className="brand-mark"
          src="/involead-logo.jpe"
          alt="InvoLead"
          width={67}
          height={36}
          priority
        />{" "}
        <div>
          <div className="brand-name">InvoLead</div>
          <div className="brand-tag">UI LIBRARY</div>
        </div>
      </Link>

      {showControls && (
        <>
          <nav className="topnav" aria-label="Main navigation">
            <button
              type="button"
              className={activeTab === "canvas" ? "active" : ""}
              onClick={() => onTabChange("canvas")}
            >
              <svg
                className="topnav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
                <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
                <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
                <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
              </svg>
              Canvas
            </button>
            <button
              type="button"
              className={activeTab === "docs" ? "active" : ""}
              onClick={() => onTabChange("docs")}
            >
              <svg
                className="topnav-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H8.5A3.5 3.5 0 0 1 5 16V4.5Z" />
                <path d="M5 16a3.5 3.5 0 0 1 3.5-3.5H19" />
                <path d="M8.5 8h6.5M8.5 10.5h4.5" strokeLinecap="round" />
              </svg>
              Docs
            </button>
          </nav>

          <div className="top-actions" aria-label="Editor toolbar">
            <button
              type="button"
              className={`utility${isFullscreen ? " active" : ""}`}
              aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
              aria-pressed={isFullscreen}
              title={isFullscreen ? "Exit full screen" : "Enter full screen"}
              onClick={toggleFullscreen}
              disabled={previewDisabled}
            >
              {isFullscreen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M9 4v5H4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 4v5h5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 20v-5H4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M15 20v-5h5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M4 9V4h5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 9V4h-5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 15v5h5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 15v5h-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            <div className="zoom-group" role="group" aria-label="Preview zoom">
              <button
                type="button"
                className="utility zoom-step"
                aria-label="Zoom out"
                title="Zoom out"
                onClick={zoomOut}
                disabled={previewDisabled || zoom <= MIN_ZOOM}
              >
                −
              </button>

              <button
                type="button"
                className="utility utility-pill zoom-value"
                aria-label="Reset zoom to 100%"
                title="Reset zoom"
                onClick={() => onZoomChange(DEFAULT_ZOOM)}
                disabled={previewDisabled}
              >
                {zoom}%
              </button>

              <button
                type="button"
                className="utility zoom-step"
                aria-label="Zoom in"
                title="Zoom in"
                onClick={zoomIn}
                disabled={previewDisabled || zoom >= MAX_ZOOM}
              >
                +
              </button>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
