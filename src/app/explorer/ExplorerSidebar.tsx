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
  introActive: boolean;
  onSelectIntro: () => void;
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
  introActive,
  onSelectIntro,
}: Props) {
  const isSearching = search.trim() !== '';

  return (
    <aside className="sidebar" aria-label="Component navigation">
      <label className="sidebar-search">
        <svg
          viewBox="0 0 24 24"
          width="12"
          height="12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
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
      <button
        type="button"
        className={`menu-item intro${introActive ? " active" : ""}`}
        onClick={onSelectIntro}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 11v5" strokeLinecap="round" />
          <circle cx="12" cy="7.8" r="0.6" fill="currentColor" />
        </svg>
        Introduction
      </button>


      {groups.map((group) => {
        // while searching, show matching stories even if the group is collapsed
        const isOpen = isSearching || Boolean(expandedGroups[group.title]);

        return (
          <div key={group.title} className="menu-group">
            <button
              type="button"
              className={`menu-item root${group.title === activeComponent ? ' active' : ''}`}
              aria-expanded={isOpen}
              onClick={() => onToggleGroup(group.title)}
            >
              <span className="menu-icon" aria-hidden="true" />
              {group.title}
              <svg
                className={`chevron${isOpen ? ' expanded' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isOpen &&
              group.items.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`menu-item sub${group.title === activeComponent && item === activeStory ? ' active' : ''}`}
                  onClick={() => onSelectStory(group.title, item)}
                >
                  <span className="menu-icon" aria-hidden="true" />
                  {item}
                </button>
              ))}
          </div>
        );
      })}

      {groups.length === 0 ? (
        <div className="sidebar-empty">No components or stories match “{search}”.</div>
      ) : null}
    </aside>
  );
}
