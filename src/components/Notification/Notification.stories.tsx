import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Icon } from "@/components/Icon";
import { Notification } from "./";

/* =========================
   META
   ========================= */

const meta = {
  title: "Components/Notification",
  component: Notification,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    content: 4,
    color: "primary",
    variant: "standard",
    max: 99,
    overlap: "rectangular",
    anchorOrigin: { vertical: "top", horizontal: "right" },
    invisible: false,
    showZero: false,
  },
  argTypes: {
    content: { control: "text" },
    color: {
      control: "select",
      options: ["primary", "secondary", "success", "error", "warning", "info", "default"],
    },
    variant: {
      control: "select",
      options: ["standard", "dot"],
    },
    max: { control: "number" },
    overlap: {
      control: "select",
      options: ["rectangular", "circular"],
    },
    anchorOrigin: { control: "object" },
    invisible: { control: "boolean" },
    showZero: { control: "boolean" },
  },
} as Omit<Meta<typeof Notification>, "args"> & {
  args: Partial<React.ComponentProps<typeof Notification>>;
};

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   STORY HELPERS
   ========================= */

/**
 * Every demo child goes through this wrapper so the shape and size are set
 * in ONE place. If your Icon component uses different props, change it here.
 */
function DemoIcon({ shape = "square" }: { shape?: "square" | "circle" }) {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: 40,
        height: 40,
        borderRadius: shape === "circle" ? "var(--radius-full)" : "var(--radius-lg)",
        background:
          shape === "circle" ? "var(--color-primary)" : "var(--color-surface)",
        border:
          shape === "circle" ? "1px solid transparent" : "1px solid var(--color-border)",
        color:
          shape === "circle"
            ? "var(--color-text-inverse)"
            : "var(--color-text-secondary)",
        fontWeight: shape === "circle" ? "var(--font-weight-semibold)" : undefined,
      }}
    >
      <Icon name="mail" size={18} />
    </span>
  );
}

const row = { display: "flex", gap: 8, alignItems: "center" } as const;

const column = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  alignItems: "center",
} as const;

const hint = {
  fontSize: 11,
  margin: "0 0 6px",
  color: "#6b7280",
} as const;

function notificationSource(extraProps = "") {
  return `<Notification
  content={4}
  color="primary"
  variant="standard"${extraProps}
>
  <MailIcon />
</Notification>`;
}

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  render: (args) => (
    <Notification {...args} content={args.content}>
      <DemoIcon />
    </Notification>
  ),
  parameters: {
    docs: { source: { code: notificationSource() } },
  },
};

export const Dot: Story = {
  args: { variant: "dot", color: "success" },
  render: (args) => (
    <Notification {...args}>
      <DemoIcon />
    </Notification>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Notification variant="dot" color="success">
  <MailIcon />
</Notification>`,
      },
    },
  },
};

/* =========================
   COLORS
   ========================= */

export const Colors: Story = {
  render: () => (
    <div style={{ ...row, gap: 24 }}>
      {(["primary", "secondary", "success", "error", "warning", "default"] as const).map(
        (c) => (
          <Notification key={c} content={4} color={c}>
            <DemoIcon />
          </Notification>
        ),
      )}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Notification content={4} color="primary"><MailIcon /></Notification>
  <Notification content={4} color="secondary"><MailIcon /></Notification>
  <Notification content={4} color="success"><MailIcon /></Notification>
  <Notification content={4} color="error"><MailIcon /></Notification>
  <Notification content={4} color="warning"><MailIcon /></Notification>
  <Notification content={4} color="default"><MailIcon /></Notification>
</>`,
      },
    },
  },
};

/* =========================
   MAX VALUE
   ========================= */

export const MaxValue: Story = {
  render: () => (
    <div style={{ ...row, gap: 24 }}>
      <Notification content={99} max={99} color="primary">
        <DemoIcon />
      </Notification>
      <Notification content={100} max={99} color="primary">
        <DemoIcon />
      </Notification>
      <Notification content={1000} max={999} color="primary">
        <DemoIcon />
      </Notification>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// Values above max render as "N+"
<>
  <Notification content={99} max={99} color="primary"><MailIcon /></Notification>
  <Notification content={100} max={99} color="primary"><MailIcon /></Notification>
  <Notification content={1000} max={999} color="primary"><MailIcon /></Notification>
</>`,
      },
    },
  },
};

/* =========================
   OVERLAP
   ========================= */

export const Overlap: Story = {
  render: () => (
    <div style={{ ...row, gap: 24 }}>
      <Notification content={4} color="error" overlap="circular">
        <DemoIcon shape="circle" />
      </Notification>
      <Notification content={4} color="error" overlap="rectangular">
        <DemoIcon />
      </Notification>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// circular pulls the badge further inside for round children
<>
  <Notification content={4} color="error" overlap="circular">
    <Avatar src="/me.png" alt="Me" />
  </Notification>
  <Notification content={4} color="error" overlap="rectangular">
    <MailIcon />
  </Notification>
</>`,
      },
    },
  },
};

/* =========================
   ANCHOR ORIGINS
   ========================= */

export const AnchorOrigins: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      {(["top", "bottom"] as const).flatMap((vertical) =>
        (["left", "right"] as const).map((horizontal) => (
          <Notification
            key={`${vertical}-${horizontal}`}
            content={4}
            color="error"
            anchorOrigin={{ vertical, horizontal }}
          >
            <DemoIcon />
          </Notification>
        )),
      )}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Notification
    content={4}
    color="error"
    anchorOrigin={{ vertical: "top", horizontal: "left" }}
  >
    <MailIcon />
  </Notification>
  <Notification
    content={4}
    color="error"
    anchorOrigin={{ vertical: "top", horizontal: "right" }}
  >
    <MailIcon />
  </Notification>
  <Notification
    content={4}
    color="error"
    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
  >
    <MailIcon />
  </Notification>
  <Notification
    content={4}
    color="error"
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
  >
    <MailIcon />
  </Notification>
</>`,
      },
    },
  },
};

/* =========================
   SHOW ZERO
   ========================= */

export const ShowZero: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={hint}>showZero — zero is visible</p>
        <Notification content={0} color="primary" showZero>
          <DemoIcon />
        </Notification>
      </div>
      <div>
        <p style={hint}>Default — zero is hidden</p>
        <Notification content={0} color="primary">
          <DemoIcon />
        </Notification>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// Zero is hidden by default; use showZero to keep it visible
<Notification content={0} color="primary" showZero>
  <MailIcon />
</Notification>`,
      },
    },
  },
};

/* =========================
   INVISIBLE
   ========================= */

export const Invisible: Story = {
  render: () => (
    <div style={{ ...row, gap: 24 }}>
      <Notification content={4} color="primary">
        <DemoIcon />
      </Notification>
      <Notification content={4} color="primary" invisible>
        <DemoIcon />
      </Notification>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// invisible animates the badge toward the anchor corner
<>
  <Notification content={4} color="primary">
    <MailIcon />
  </Notification>
  <Notification content={4} color="primary" invisible>
    <MailIcon />
  </Notification>
</>`,
      },
    },
  },
};

/* =========================
   TEXT CONTENT
   ========================= */

export const TextContent: Story = {
  render: () => (
    <div style={{ ...row, gap: 24 }}>
      <Notification content="New" color="primary">
        <DemoIcon />
      </Notification>
      <Notification content="Beta" color="warning">
        <DemoIcon />
      </Notification>
      <Notification content="99+" color="error">
        <DemoIcon />
      </Notification>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// Strings pass through untouched; max capping only applies to numbers
<>
  <Notification content="New" color="primary"><MailIcon /></Notification>
  <Notification content="Beta" color="warning"><MailIcon /></Notification>
  <Notification content="99+" color="error"><MailIcon /></Notification>
</>`,
      },
    },
  },
};

/* =========================
   STANDALONE
   ========================= */

export const Standalone: Story = {
  render: () => (
    <div style={{ ...row, gap: 32 }}>
      <div style={column}>
        <Notification content={4} color="primary" />
        <span style={hint}>count</span>
      </div>
      <div style={column}>
        <Notification content={100} max={99} color="error" />
        <span style={hint}>capped</span>
      </div>
      <div style={column}>
        <Notification variant="dot" color="success" />
        <span style={hint}>dot</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// No child — a bare count or dot, useful inside toolbars or nav links
<>
  <Notification content={4} color="primary" />
  <Notification content={100} max={99} color="error" />
  <Notification variant="dot" color="success" />
</>`,
      },
    },
  },
};