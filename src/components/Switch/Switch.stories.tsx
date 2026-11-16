import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Switch } from "./";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    checked: false,
    size: "medium",
    color: "primary",
    label: "Enable notifications",
    labelPlacement: "end",
    disabled: false,
    loading: false,
  },
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "error",
        "warning",
        "inherit",
      ],
    },
    labelPlacement: { control: "select", options: ["start", "end"] },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
} as Omit<Meta<typeof Switch>, "args"> & {
  args: Partial<React.ComponentProps<typeof Switch>>;
};

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: "flex", gap: 32, alignItems: "center" } as const;
const column = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  alignItems: "center",
} as const;
const hint = { fontSize: 11, color: "#6b7280" } as const;

export const Default: Story = {
  render: (args) => <Switch {...args} />,
  parameters: { docs: { source: { code: `<Switch label="Enable notifications" />` } } },
};

export const Uncontrolled: Story = {
  render: () => <Switch label="Subscribe to newsletter" defaultChecked />,
  parameters: { docs: { source: { code: `<Switch label="Subscribe to newsletter" defaultChecked />` } } },
};

function ControlledSwitchStory() {
  const [on, setOn] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <Switch label="Dark mode" checked={on} onChange={setOn} />
      <span style={hint}>Value: {on ? "on" : "off"}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledSwitchStory />,
  parameters: {
    docs: {
      source: {
        code: `const [on, setOn] = useState(false);\n\n<Switch label="Dark mode" checked={on} onChange={(next) => setOn(next)} />`,
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      {(["small", "medium", "large"] as const).map((s) => (
        <div key={s} style={column}>
          <Switch size={s} defaultChecked />
          <span style={hint}>{s}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: { source: { code: `<>\n  <Switch size="small" />\n  <Switch size="medium" />\n  <Switch size="large" />\n</>` } },
  },
};

export const Colors: Story = {
  render: () => (
    <div style={{ ...row, gap: 24 }}>
      {(["primary", "secondary", "success", "error", "warning"] as const).map((c) => (
        <div key={c} style={column}>
          <Switch color={c} defaultChecked />
          <span style={hint}>{c}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>\n  <Switch color="primary" defaultChecked />\n  <Switch color="secondary" defaultChecked />\n  <Switch color="success" defaultChecked />\n  <Switch color="error" defaultChecked />\n  <Switch color="warning" defaultChecked />\n</>`,
      },
    },
  },
};

export const Inherit: Story = {
  render: () => (
    <>
    <div style={{ ...row, gap: 32 }}>
      <span style={{ color: "#1d4ed8" }}> {/* Blue */}
        <Switch color="inherit" defaultChecked />
      </span>
      <span style={{ color: "#dc2626" }}> {/* Red */}
        <Switch color="inherit" defaultChecked />
      </span>
      <span style={{ color: "#d97706" }}> {/* Orange */}
        <Switch color="inherit" defaultChecked />
      </span>
      <span style={{ color: "#8b5cf6" }}> {/* Violet */}
        <Switch color="inherit" defaultChecked />
      </span>
    </div>
    </>
    
  ),
  parameters: {
    docs: {
      source: {
        code: `// color="inherit" picks up the parent's text color.\n// Any color works — palette token, raw hex, rgb(), hsl().\n\n<>\n  <span style={{ color: "#1d4ed8" }}>\n    <Switch color="inherit" defaultChecked />\n  </span>\n  <span style={{ color: "#dc2626" }}>\n    <Switch color="inherit" defaultChecked />\n  </span>\n  <span style={{ color: "#d97706" }}>\n    <Switch color="inherit" defaultChecked />\n  </span>\n  <span style={{ color: "#8b5cf6" }}>\n    <Switch color="inherit" defaultChecked />\n  </span>\n</>`,
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div style={{ ...row, gap: 32, alignItems: "flex-start" }}>
      <div style={column}>
        <Switch label="Off" />
        <span style={hint}>default</span>
      </div>
      <div style={column}>
        <Switch label="On" defaultChecked />
        <span style={hint}>checked</span>
      </div>
      <div style={column}>
        <Switch label="Disabled" disabled />
        <span style={hint}>disabled off</span>
      </div>
      <div style={column}>
        <Switch label="Disabled on" disabled defaultChecked />
        <span style={hint}>disabled on</span>
      </div>
      <div style={column}>
        <Switch label="Loading" loading />
        <span style={hint}>loading</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>\n  <Switch label="Off" />\n  <Switch label="On" defaultChecked />\n  <Switch label="Disabled" disabled />\n  <Switch label="Disabled on" disabled defaultChecked />\n  <Switch label="Loading" loading />\n</>`,
      },
    },
  },
};

export const LabelPlacement: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Switch label="Label at end (default)" labelPlacement="end" defaultChecked />
      <Switch label="Label at start" labelPlacement="start" defaultChecked />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>\n  <Switch label="Label at end" labelPlacement="end" defaultChecked />\n  <Switch label="Label at start" labelPlacement="start" defaultChecked />\n</>`,
      },
    },
  },
};

export const HelperAndError: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 320 }}>
      <Switch
        label="Enable notifications"
        helperText="We'll send you a summary once a day."
      />
      <Switch
        label="Accept terms"
        error="You must accept the terms to continue."
      />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>\n  <Switch label="Enable notifications" helperText="We'll send you a summary once a day." />\n  <Switch label="Accept terms" error="You must accept the terms to continue." />\n</>`,
      },
    },
  },
};