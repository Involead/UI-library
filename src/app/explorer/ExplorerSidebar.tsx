type NavGroup = {
  title: string;
  items: string[];
};

type Props = {
  groups: NavGroup[];
  search: string;
  onSearchChange: (value: string) => void;
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (title: string) => void;
  activeComponent: string;
  activeStory: string;
  onSelectStory: (component: string, story: string) => void;
};

export function ExplorerSidebar({
  groups,
  search,
  onSearchChange,
  expandedGroups,
  onToggleGroup,
  activeComponent,
  activeStory,
  onSelectStory,
}: Props) {
  return (
    <aside className="sidebar" aria-label="Component navigation">
      <label className="sidebar-search">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="5.5" />
          <path d="M16 16L21 21" strokeLinecap="round" />
        </svg>
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Find components"
          aria-label="Find components"
        />
      </label>
      {groups.map((group) => (
        <div key={group.title} className="menu-group">
          <button
            type="button"
            className={`menu-item root${group.title === activeComponent ? " active" : ""}`}
            aria-expanded={expandedGroups[group.title]}
            onClick={() => onToggleGroup(group.title)}
          >
            <span className="menu-icon" aria-hidden="true" />
            {group.title}
            <svg
              className={`chevron${expandedGroups[group.title] ? " expanded" : ""}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {expandedGroups[group.title] &&
            group.items.map((item) => (
              <button
                key={item}
                type="button"
                className={`menu-item sub${group.title === activeComponent && item === activeStory ? " active" : ""}`}
                onClick={() => onSelectStory(group.title, item)}
              >
                <span className="menu-icon" aria-hidden="true" />
                {item}
              </button>
            ))}
        </div>
      ))}
      {groups.length === 0 ? (
        <div className="sidebar-empty">
          No components or stories match “{search}”.
        </div>
      ) : null}
    </aside>
  );
}
