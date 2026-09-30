type Props = {
    groups: { title: string; items: string[] }[];
    onSelectStory: (component: string, story: string) => void;
  };
  
  export function ExplorerIntro({ groups, onSelectStory }: Props) {
    return (
      <div className="docs-page">
        <div className="docs-eyebrow">Introduction</div>
        <h1>Welcome to InvoLead UI</h1>
        <p>
          Composable, accessible components with thoughtful defaults. Browse each component,
          tweak its props live, and copy the code into your project.
        </p>
  
        <h2>Quick start</h2>
        <h3>1. Install</h3>
        <pre className="docs-code">npm install @involead/ui</pre>
        <h3>2. Use a component</h3>
        <pre className="docs-code">{`import { Button } from "@involead/ui";
  
  export function Example() {
    return <Button variant="primary">Get started</Button>;
  }`}</pre>
  
        <h2>Components</h2>
        <div className="story-grid">
          {groups.map((group) => (
            <button
              key={group.title}
              type="button"
              className="story-card intro-card"
              onClick={() => onSelectStory(group.title, group.items[0])}
            >
              <strong>{group.title}</strong>
              <span>{group.items.length} stories</span>
            </button>
          ))}
        </div>
      </div>
    );
  }