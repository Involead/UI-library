type Props = {
  activeTab: "canvas" | "docs";
  onTabChange: (tab: "canvas" | "docs") => void;
};

export function ExplorerTopbar({ activeTab, onTabChange }: Props) {
  return (
    <header className="topbar">
      <div className="brand-region">
        <img className="brand-mark" src="/involead-logo.jpe" alt="InvoLead" />
        <div>
          <div className="brand-name">InvoLead</div>
          <div className="brand-tag">UI LIBRARY</div>
        </div>
      </div>

      <nav className="topnav" aria-label="Main navigation">
        <button
          type="button"
          className={activeTab === "canvas" ? "active" : ""}
          onClick={() => onTabChange("canvas")}
        >
          <svg className="topnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
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
          <svg className="topnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H8.5A3.5 3.5 0 0 1 5 16V4.5Z" />
            <path d="M5 16a3.5 3.5 0 0 1 3.5-3.5H19" />
            <path d="M8.5 8h6.5M8.5 10.5h4.5" strokeLinecap="round" />
          </svg>
          Docs
        </button>
      </nav>

      <div className="top-actions" aria-label="Editor toolbar">
        <button type="button" className="utility" aria-label="Search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="5.5" />
            <path d="M16 16L21 21" strokeLinecap="round" />
          </svg>
        </button>
        <button type="button" className="utility utility-pill">80%</button>
        <button type="button" className="utility" aria-label="Theme">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3.5v7.2" strokeLinecap="round" />
            <path d="M12 20.5v-1.6" strokeLinecap="round" />
            <path d="M18.6 5.4l-5.1 5.1" strokeLinecap="round" />
            <path d="M10.5 13.5L5.4 18.6" strokeLinecap="round" />
            <path d="M20.5 12h-7.2" strokeLinecap="round" />
            <path d="M3.5 12h1.6" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3.6" />
          </svg>
        </button>
        <button type="button" className="utility utility-pill">White</button>
        <button type="button" className="utility utility-pill">Responsive</button>
        <button type="button" className="utility" aria-label="More options">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="19" cy="12" r="1.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}
