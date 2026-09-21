import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import { Typography } from "./Typography";

const meta = {
  title: "Components/Typography",
  component: Typography,

  parameters: {
    layout: "padded",
  },

  tags: ["autodocs"],

  argTypes: {
    variant: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "body-lg",
        "body-md",
        "body-sm",
        "caption",
      ],
    },

    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "disabled",
        "inverse",
        "success",
        "warning",
        "error",
        "info",
      ],
    },

    weight: {
      control: "select",
      options: [
        undefined,
        "regular",
        "medium",
        "semibold",
        "bold",
      ],
    },

    truncate: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  args: {
    children: "The quick brown fox jumps over the lazy dog.",
  },
};

/* =========================
   HEADINGS
   ========================= */

export const Heading1: Story = {
  args: {
    variant: "h1",
    children: "Heading 1",
  },
};

export const Heading2: Story = {
  args: {
    variant: "h2",
    children: "Heading 2",
  },
};

export const Heading3: Story = {
  args: {
    variant: "h3",
    children: "Heading 3",
  },
};

export const Heading4: Story = {
  args: {
    variant: "h4",
    children: "Heading 4",
  },
};

export const Heading5: Story = {
  args: {
    variant: "h5",
    children: "Heading 5",
  },
};

export const Heading6: Story = {
  args: {
    variant: "h6",
    children: "Heading 6",
  },
};

/* =========================
   BODY
   ========================= */

export const BodyLarge: Story = {
  args: {
    variant: "body-lg",
    children: "Body large — for lead paragraphs and intros.",
  },
};

export const BodyMedium: Story = {
  args: {
    variant: "body-md",
    children: "Body medium — the default paragraph text.",
  },
};

export const BodySmall: Story = {
  args: {
    variant: "body-sm",
    children: "Body small — for secondary or dense text.",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "Caption — for labels, timestamps, and metadata.",
  },
};

/* =========================
   COLORS
   ========================= */

export const Colors: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Typography color="primary">Primary text</Typography>
      <Typography color="secondary">Secondary text</Typography>
      <Typography color="tertiary">Tertiary text</Typography>
      <Typography color="disabled">Disabled text</Typography>
      <Typography color="success">Success text</Typography>
      <Typography color="warning">Warning text</Typography>
      <Typography color="error">Error text</Typography>
      <Typography color="info">Info text</Typography>
    </div>
  ),
};

export const CustomColor: Story = {
  name: "Custom color (arbitrary value)",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Typography
        variant="h3"
        color="#ff6600"
      >
        Hex color
      </Typography>
      <Typography color="rebeccapurple">Named CSS color</Typography>
      <Typography color="rgb(10, 200, 90)">RGB color</Typography>
    </div>
  ),
};

/* =========================
   POLYMORPHIC "as"
   ========================= */

export const StyledAsHeadingRenderedAsSpan: Story = {
  name: 'Styled as h3, rendered as <span>',
  args: {
    variant: "h3",
    as: "span",
    children: "Looks like a heading, isn't one semantically",
  },
};

/* =========================
   TRUNCATE
   ========================= */

export const Truncate: Story = {
  args: {
    truncate: true,
    children:
      "This is a very long line of text that will be truncated with an ellipsis instead of wrapping onto a second line.",
  },

  render: (args) => (
    <div style={{ maxWidth: 240 }}>
      <Typography {...args} />
    </div>
  ),
};
