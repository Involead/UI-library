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
   SOURCE HELPER
   ========================= */

function tooltipSource(extraProps = "") {
  return `<Tooltip
  title="This is a tooltip"
  placement="top"
  variant="dark"${extraProps}
>
  <Button variant="primary">Hover me</Button>
</Tooltip>`;
}

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  render: (args) => (
    <Tooltip {...args} title={args.title as string}>
      <Button variant="primary">Hover me</Button>
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
      <Button variant="primary">Hover me</Button>
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
    <div style={{ display: "flex", gap: 16 }}>
      <Tooltip title="Top placement" placement="top">
        <Button variant="outline">Top</Button>
      </Tooltip>
      <Tooltip title="Bottom placement" placement="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
      <Tooltip title="Left placement" placement="left">
        <Button variant="outline">Left</Button>
      </Tooltip>
      <Tooltip title="Right placement" placement="right">
        <Button variant="outline">Right</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Tooltip title="Top" placement="top">
    <Button variant="outline">Top</Button>
  </Tooltip>
  <Tooltip title="Bottom" placement="bottom">
    <Button variant="outline">Bottom</Button>
  </Tooltip>
  <Tooltip title="Left" placement="left">
    <Button variant="outline">Left</Button>
  </Tooltip>
  <Tooltip title="Right" placement="right">
    <Button variant="outline">Right</Button>
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
    <div style={{ display: "flex", gap: 16 }}>
      <Tooltip title="Opens immediately" enterDelay={0}>
        <Button variant="outline">0ms</Button>
      </Tooltip>
      <Tooltip title="Opens after 500ms" enterDelay={500}>
        <Button variant="outline">500ms</Button>
      </Tooltip>
      <Tooltip title="Opens after 1s" enterDelay={1000}>
        <Button variant="outline">1000ms</Button>
      </Tooltip>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// Pass enterDelay in milliseconds
<Tooltip title="..." enterDelay={500}>
  <Button variant="outline">Hover me</Button>
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
      <Button variant="outline">Disabled tooltip</Button>
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
    <div style={{ display: "flex", gap: 24 }}>
      <Tooltip
        title="Move your pointer down here — it closes before you arrive."
        variant="light"
      >
        <Button variant="outline">Non-interactive</Button>
      </Tooltip>

      <Tooltip
        variant="light"
        interactive
        title={
          <div>
            <strong style={{ display: "block", marginBottom: 4 }}>
              Event details
            </strong>
            <span style={{ fontSize: 12 }}>
              Move your pointer down here and click the link.
            </span>
            <a
              href="#"
              style={{
                display: "inline-block",
                marginTop: 8,
                color: "var(--color-primary)",
                textDecoration: "underline",
              }}
              onClick={(e) => e.preventDefault()}
            >
              See details →
            </a>
          </div>
        }
      >
        <Button variant="outline">Interactive</Button>
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
  <Button variant="outline">Interactive</Button>
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
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div>
          <p style={{ fontSize: 12, marginBottom: 8, color: "#6b7280" }}>
            Fits — no tooltip
          </p>
          <Tooltip title={text} onlyWhenTruncated>
            <span
              style={{
                display: "inline-block",
                maxWidth: 400,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                border: "1px solid #e5e7eb",
                padding: "8px 12px",
                borderRadius: 6,
              }}
            >
              {text}
            </span>
          </Tooltip>
        </div>

        <div>
          <p style={{ fontSize: 12, marginBottom: 8, color: "#6b7280" }}>
            Truncated — tooltip on hover
          </p>
          <Tooltip title={text} onlyWhenTruncated>
            <span
              style={{
                display: "inline-block",
                maxWidth: 160,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                border: "1px solid #e5e7eb",
                padding: "8px 12px",
                borderRadius: 6,
              }}
            >
              {text}
            </span>
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
      maxWidth: 160,
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