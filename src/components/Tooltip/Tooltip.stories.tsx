import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/Button";

import { Tooltip } from "./";

/* =========================
   META
   ========================= */

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    title: "This is a tooltip",
    placement: "top",
    variant: "dark",
    interactive: false,
    disabled: false,
    onlyWhenTruncated: false,
    enterDelay: 100,
  },
  argTypes: {
    title: { control: "text" },
    placement: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
    },
    variant: {
      control: "select",
      options: ["dark", "light"],
    },
    interactive: { control: "boolean" },
    disabled: { control: "boolean" },
    onlyWhenTruncated: { control: "boolean" },
    enterDelay: { control: "number" },
    leaveDelay: { control: "number" },
  },
} as Omit<Meta<typeof Tooltip>, "args"> & {
  args: Partial<React.ComponentProps<typeof Tooltip>>;
};

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   STORY HELPERS
   ========================= */

/**
 * Every demo button goes through this wrapper so the size is set in ONE
 * place. If your Button uses a different size name (e.g. "small"), or doesn't
 * accept `style`, change it here only.
 */
function DemoButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="small"
      {...props}
      style={{ fontSize: 12, ...(props.style ?? {}) }}
    />
  );
}

const row = { display: "flex", gap: 8, alignItems: "center" } as const;

const hint = {
  fontSize: 11,
  margin: "0 0 6px",
  color: "#6b7280",
} as const;

const truncatedBox = {
  display: "inline-block",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  border: "1px solid #e5e7eb",
  padding: "4px 10px",
  borderRadius: 6,
  fontSize: 12,
} as const;

function tooltipSource(extraProps = "") {
  return `<Tooltip
  title="This is a tooltip"
  placement="top"
  variant="dark"${extraProps}
>
  <Button size="sm" variant="primary">Hover me</Button>
</Tooltip>`;
}

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args} title={args.title as string}>
      <DemoButton variant="primary">Hover me</DemoButton>
    </Tooltip>
  ),
  parameters: {
    docs: { source: { code: tooltipSource() } },
  },
};

export const Light: Story = {
  args: { variant: "light" },
  render: (args) => (
    <Tooltip {...args} title={args.title as string}>
      <DemoButton variant="primary">Hover me</DemoButton>
    </Tooltip>
  ),
  parameters: {
    docs: { source: { code: tooltipSource('\n  variant="light"') } },
  },
};

/* =========================
   PLACEMENTS
   ========================= */

export const Placements: Story = {
  render: () => (
    <div style={row}>
      <Tooltip title="Top placement" placement="top">
        <DemoButton variant="outline">Top</DemoButton>
      </Tooltip>
      <Tooltip title="Bottom placement" placement="bottom">
        <DemoButton variant="outline">Bottom</DemoButton>
      </Tooltip>
      <Tooltip title="Left placement" placement="left">
        <DemoButton variant="outline">Left</DemoButton>
      </Tooltip>
      <Tooltip title="Right placement" placement="right">
        <DemoButton variant="outline">Right</DemoButton>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Tooltip title="Top" placement="top">
    <Button size="sm" variant="outline">Top</Button>
  </Tooltip>
  <Tooltip title="Bottom" placement="bottom">
    <Button size="sm" variant="outline">Bottom</Button>
  </Tooltip>
  <Tooltip title="Left" placement="left">
    <Button size="sm" variant="outline">Left</Button>
  </Tooltip>
  <Tooltip title="Right" placement="right">
    <Button size="sm" variant="outline">Right</Button>
  </Tooltip>
</>`,
      },
    },
  },
};

/* =========================
   DELAYS
   ========================= */

export const Delays: Story = {
  render: () => (
    <div style={row}>
      <Tooltip title="Opens immediately" enterDelay={0}>
        <DemoButton variant="outline">0ms</DemoButton>
      </Tooltip>
      <Tooltip title="Opens after 500ms" enterDelay={500}>
        <DemoButton variant="outline">500ms</DemoButton>
      </Tooltip>
      <Tooltip title="Opens after 1s" enterDelay={1000}>
        <DemoButton variant="outline">1000ms</DemoButton>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// Pass enterDelay in milliseconds
<Tooltip title="..." enterDelay={500}>
  <Button size="sm" variant="outline">Hover me</Button>
</Tooltip>`,
      },
    },
  },
};

/* =========================
   STATES
   ========================= */

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <Tooltip {...args} title={args.title as string}>
      <DemoButton variant="outline">Disabled tooltip</DemoButton>
    </Tooltip>
  ),
  parameters: {
    docs: { source: { code: tooltipSource("\n  disabled") } },
  },
};

/* =========================
   INTERACTIVE
   ========================= */

export const Interactive: Story = {
  render: () => (
    <div style={{ ...row, gap: 16 }}>
      <Tooltip
        title="Move your pointer down here — it closes before you arrive."
        variant="light"
      >
        <DemoButton variant="outline">Non-interactive</DemoButton>
      </Tooltip>

      <Tooltip
        variant="light"
        interactive
        title={
          <div style={{ fontSize: 12 }}>
            <strong
              style={{ display: "block", marginBottom: 2, fontSize: 13 }}
            >
              Event details
            </strong>
            <span style={{ fontSize: 11 }}>
              Move your pointer down here and click the link.
            </span>
            <a
              href="#"
              style={{
                display: "block",
                marginTop: 6,
                color: "var(--color-primary)",
                textDecoration: "underline",
                fontSize: 12,
              }}
              onClick={(e) => e.preventDefault()}
            >
              See details →
            </a>
          </div>
        }
      >
        <DemoButton variant="outline">Interactive</DemoButton>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Tooltip
  variant="light"
  interactive
  title={
    <div>
      <strong>Event details</strong>
      <p>Move your pointer down here and click the link.</p>
      <a href="#">See details →</a>
    </div>
  }
>
  <Button size="sm" variant="outline">Interactive</Button>
</Tooltip>`,
      },
    },
  },
};

/* =========================
   ONLY WHEN TRUNCATED
   ========================= */

export const Truncated: Story = {
  render: () => {
    const text = "Queen's Hospital - Dietetics Department";

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <p style={hint}>Fits — no tooltip</p>
          <Tooltip title={text} onlyWhenTruncated>
            <span style={{ ...truncatedBox, maxWidth: 320 }}>{text}</span>
          </Tooltip>
        </div>

        <div>
          <p style={hint}>Truncated — tooltip on hover</p>
          <Tooltip title={text} onlyWhenTruncated>
            <span style={{ ...truncatedBox, maxWidth: 140 }}>{text}</span>
          </Tooltip>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `const text = "Queen's Hospital - Dietetics Department";

<Tooltip title={text} onlyWhenTruncated>
  <span
    style={{
      display: "inline-block",
      maxWidth: 140,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    }}
  >
    {text}
  </span>
</Tooltip>`,
      },
    },
  },
};