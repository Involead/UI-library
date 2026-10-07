import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useId, useState } from "react";

import { Tab, TabPanel } from "./";
import type { TabItem } from "./"; // adjust if needed

const meta = {
  title: "Components/Tab",
  component: Tab,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    items: [
      { label: "Tab 1", value: "tab-1" },
      { label: "Tab 2", value: "tab-2" },
      { label: "Tab 3", value: "tab-3" },
    ],
    value: "tab-1",
    onChange: () => {},
    variant: "line",
    size: "medium",
    orientation: "horizontal",
    disabled: false,
    scrollable: false,
    iconOnly: false,
    iconPosition: "start",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["line", "pill"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    iconPosition: {
      control: "select",
      options: ["start", "end", "top", "bottom"],
    },
    disabled: { control: "boolean" },
    scrollable: { control: "boolean" },
    iconOnly: { control: "boolean" },
    onChange: { action: "changed" },
  },
} satisfies Meta<typeof Tab>;

export default meta;

type Story = StoryObj<typeof meta>;
type TabArgs = React.ComponentProps<typeof Tab>;

/* =========================
   SHARED HELPERS
   ========================= */

function useTabState(args: TabArgs) {
  const [activeTab, setActiveTab] = useState(args.value);
  const [prevValue, setPrevValue] = useState(args.value);

  if (args.value !== prevValue) {
    setPrevValue(args.value);
    setActiveTab(args.value);
  }

  const handleChange = (next: string) => {
    setActiveTab(next);
    args.onChange(next);
  };

  return [activeTab, handleChange] as const;
}

const panelStyle = {
  marginTop: "16px",
  padding: "16px",
  minWidth: "220px",
  background: "var(--color-surface-secondary)",
  borderRadius: "var(--radius-md)",
} as const;

const iconNames = ["search", "info", "settings"] as const;

function withIcons(items: TabItem[]): TabItem[] {
  return items.map((item, index) => ({
    ...item,
    icon: iconNames[index % iconNames.length],
  }));
}

const manyItems: TabItem[] = Array.from({ length: 12 }, (_, i) => ({
  label: `Tab ${i + 1}`,
  value: `tab-${i + 1}`,
}));

const InteractiveTab = (args: TabArgs) => {
  const [activeTab, handleChange] = useTabState(args);
  return <Tab {...args} value={activeTab} onChange={handleChange} />;
};

const TabsWithPanels = (args: TabArgs) => {
  const [activeTab, handleChange] = useTabState(args);
  const tabsId = useId();
  const isVertical = args.orientation === "vertical";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isVertical ? "row" : "column",
        alignItems: isVertical ? "flex-start" : "stretch",
        gap: isVertical ? "16px" : 0,
      }}
    >
      <Tab {...args} id={tabsId} value={activeTab} onChange={handleChange} />
      <div>
        {args.items.map((item) => (
          <TabPanel
            key={item.value}
            tabsId={tabsId}
            value={item.value}
            activeValue={activeTab}
          >
            <div
              style={isVertical ? { ...panelStyle, marginTop: 0 } : panelStyle}
            >
              Content for {item.label}
            </div>
          </TabPanel>
        ))}
      </div>
    </div>
  );
};

/* Helper to generate clean source for stories that use panels */
function panelsSource(extraProps = "") {
  return `const [activeTab, setActiveTab] = useState("tab-1");
const tabsId = "demo-tabs";

<Tab
  id={tabsId}
  items={[
    { label: "Tab 1", value: "tab-1" },
    { label: "Tab 2", value: "tab-2" },
    { label: "Tab 3", value: "tab-3" },
  ]}
  value={activeTab}
  onChange={setActiveTab}
  variant="line"
  size="medium"${extraProps}
/>
{/* All panels stay in the DOM; only the active one is visible */}
<TabPanel tabsId={tabsId} value="tab-1" activeValue={activeTab}>
  Content for Tab 1
</TabPanel>
<TabPanel tabsId={tabsId} value="tab-2" activeValue={activeTab}>
  Content for Tab 2
</TabPanel>
<TabPanel tabsId={tabsId} value="tab-3" activeValue={activeTab}>
  Content for Tab 3
</TabPanel>`;
}

/* =========================
   BASIC (pure args → clean Show code)
   ========================= */

export const Default: Story = {};

export const Pill: Story = {
  args: {
    variant: "pill",
  },
};

export const WithPanels: Story = {
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: panelsSource(),
      },
    },
  },
};

/* =========================
   ORIENTATION
   ========================= */

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: panelsSource(`
  orientation="vertical"`),
      },
    },
  },
};

/* =========================
   SIZES (pure args)
   ========================= */

export const Small: Story = {
  args: {
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    size: "large",
  },
};

/* =========================
   STATES
   ========================= */

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { label: "Tab 1", value: "tab-1" },
      { label: "Tab 2 (disabled)", value: "tab-2", disabled: true },
      { label: "Tab 3", value: "tab-3" },
    ],
  },
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: `const [activeTab, setActiveTab] = useState("tab-1");
const tabsId = "demo-tabs";

<Tab
  id={tabsId}
  items={[
    { label: "Tab 1", value: "tab-1" },
    { label: "Tab 2 (disabled)", value: "tab-2", disabled: true },
    { label: "Tab 3", value: "tab-3" },
  ]}
  value={activeTab}
  onChange={setActiveTab}
/>
<TabPanel tabsId={tabsId} value="tab-1" activeValue={activeTab}>
  Content for Tab 1
</TabPanel>
<TabPanel tabsId={tabsId} value="tab-2" activeValue={activeTab}>
  Content for Tab 2
</TabPanel>
<TabPanel tabsId={tabsId} value="tab-3" activeValue={activeTab}>
  Content for Tab 3
</TabPanel>`,
      },
    },
  },
};

/* =========================
   SCROLLABLE
   ========================= */

export const Scrollable: Story = {
  args: {
    items: manyItems,
    scrollable: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: `const [activeTab, setActiveTab] = useState("tab-1");
const tabsId = "demo-tabs";

<Tab
  id={tabsId}
  items={Array.from({ length: 12 }, (_, i) => ({
    label: \`Tab \${i + 1}\`,
    value: \`tab-\${i + 1}\`,
  }))}
  value={activeTab}
  onChange={setActiveTab}
  scrollable
/>
{/* + TabPanels for each item */}`,
      },
    },
  },
};

export const ScrollablePill: Story = {
  args: {
    items: manyItems,
    variant: "pill",
    scrollable: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: `const [activeTab, setActiveTab] = useState("tab-1");
const tabsId = "demo-tabs";

<Tab
  id={tabsId}
  items={Array.from({ length: 12 }, (_, i) => ({
    label: \`Tab \${i + 1}\`,
    value: \`tab-\${i + 1}\`,
  }))}
  value={activeTab}
  onChange={setActiveTab}
  variant="pill"
  scrollable
/>
{/* + TabPanels for each item */}`,
      },
    },
  },
};

export const ScrollableVertical: Story = {
  args: {
    items: manyItems,
    orientation: "vertical",
    scrollable: true,
  },
  decorators: [
    (Story) => (
      <div style={{ height: 280 }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: `const [activeTab, setActiveTab] = useState("tab-1");
const tabsId = "demo-tabs";

<Tab
  id={tabsId}
  items={Array.from({ length: 12 }, (_, i) => ({
    label: \`Tab \${i + 1}\`,
    value: \`tab-\${i + 1}\`,
  }))}
  value={activeTab}
  onChange={setActiveTab}
  orientation="vertical"
  scrollable
/>
{/* + TabPanels for each item */}`,
      },
    },
  },
};

/* =========================
   ICONS
   ========================= */

export const IconsStart: Story = {
  args: {
    items: withIcons([
      { label: "Tab 1", value: "tab-1" },
      { label: "Tab 2", value: "tab-2" },
      { label: "Tab 3", value: "tab-3" },
    ]),
    iconPosition: "start",
  },
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: panelsSource(`
  iconPosition="start"
  // items include icon: "search" | "info" | "settings"`),
      },
    },
  },
};

export const IconsEnd: Story = {
  args: {
    items: withIcons([
      { label: "Tab 1", value: "tab-1" },
      { label: "Tab 2", value: "tab-2" },
      { label: "Tab 3", value: "tab-3" },
    ]),
    iconPosition: "end",
  },
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: panelsSource(`
  iconPosition="end"
  // items include icon: "search" | "info" | "settings"`),
      },
    },
  },
};

export const IconsTop: Story = {
  args: {
    items: withIcons([
      { label: "Tab 1", value: "tab-1" },
      { label: "Tab 2", value: "tab-2" },
      { label: "Tab 3", value: "tab-3" },
    ]),
    iconPosition: "top",
  },
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: panelsSource(`
  iconPosition="top"
  // items include icon: "search" | "info" | "settings"`),
      },
    },
  },
};

export const IconsBottom: Story = {
  args: {
    items: withIcons([
      { label: "Tab 1", value: "tab-1" },
      { label: "Tab 2", value: "tab-2" },
      { label: "Tab 3", value: "tab-3" },
    ]),
    iconPosition: "bottom",
  },
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: panelsSource(`
  iconPosition="bottom"
  // items include icon: "search" | "info" | "settings"`),
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    items: withIcons([
      { label: "Search", value: "tab-1" },
      { label: "Info", value: "tab-2" },
      { label: "Settings", value: "tab-3" },
    ]),
    iconOnly: true,
  },
  render: (args) => <TabsWithPanels {...args} />,
  parameters: {
    docs: {
      source: {
        code: panelsSource(`
  iconOnly
  // items include icon + accessible label`),
      },
    },
  },
};