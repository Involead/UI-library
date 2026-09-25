import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import {
  Controls,
  Description,
  Primary,
  Stories,
  Subtitle,
  Title,
} from "@storybook/addon-docs/blocks";

import { Typography } from "./Typography";

const meta = {
  title: "Components/Typography",
  component: Typography,

  parameters: {
    layout: "padded",

    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle />
          <Description />
          <Primary />
          <Controls />
          <Stories includePrimary={false} />
        </>
      ),
    },
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
        "body",
        "bodySmall",
        "label",
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
      ],
    },

    as: {
      control: "select",
      options: [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "p",
        "span",
        "div",
        "label",
      ],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   ALL VARIANTS
   ========================= */

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-lg)",
      }}
    >
      <Typography variant="h1">Heading 1</Typography>
      <Typography variant="h2">Heading 2</Typography>
      <Typography variant="h3">Heading 3</Typography>
      <Typography variant="h4">Heading 4</Typography>
      <Typography variant="h5">Heading 5</Typography>
      <Typography variant="h6">Heading 6</Typography>
      <Typography variant="body">
        Body — the quick brown fox jumps over the lazy dog.
      </Typography>
      <Typography variant="bodySmall">
        Body small — the quick brown fox jumps over the lazy dog.
      </Typography>
      <Typography variant="label">Label</Typography>
      <Typography variant="caption">Caption</Typography>
    </div>
  ),
};

/* =========================
   HEADINGS
   ========================= */

export const Headings: Story = {
  argTypes: {
    variant: {
      control: false,
    },
  },

  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-lg)",
      }}
    >
      <Typography {...args} variant="h1">
        Heading 1
      </Typography>
      <Typography {...args} variant="h2">
        Heading 2
      </Typography>
      <Typography {...args} variant="h3">
        Heading 3
      </Typography>
      <Typography {...args} variant="h4">
        Heading 4
      </Typography>
      <Typography {...args} variant="h5">
        Heading 5
      </Typography>
      <Typography {...args} variant="h6">
        Heading 6
      </Typography>
    </div>
  ),
};

/* =========================
   BODY
   ========================= */

export const Body: Story = {
  args: {
    variant: "body",
    children:
      "Body text is used for the main content of a page. It should be comfortable to read at length.",
  },
};

export const BodySmall: Story = {
  args: {
    variant: "bodySmall",
    children:
      "Small body text is used for secondary content and dense layouts.",
  },
};

/* =========================
   SUPPORTING TEXT
   ========================= */

export const Label: Story = {
  args: {
    variant: "label",
    children: "Email address",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    children: "Last updated 2 hours ago",
  },
};

/* =========================
   COLORS
   ========================= */

export const Colors: Story = {
  args: {
    variant: "body",
  },

  argTypes: {
    color: {
      control: false,
    },
  },

  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-lg)",
      }}
    >
      <Typography {...args} color="primary">
        Primary text color
      </Typography>
      <Typography {...args} color="secondary">
        Secondary text color
      </Typography>
      <Typography {...args} color="tertiary">
        Tertiary text color
      </Typography>
      <Typography {...args} color="disabled">
        Disabled text color
      </Typography>
    </div>
  ),
};
