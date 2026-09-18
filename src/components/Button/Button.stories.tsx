import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "danger",
      ],
    },

    size: {
      control: "select",
      options: [
        "small",
        "medium",
        "large",
      ],
    },

    loading: {
      control: "boolean",
    },

    disabled: {
      control: "boolean",
    },

    fullWidth: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   BASIC
   ========================= */

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Danger: Story = {
  args: {
    children: "Delete",
    variant: "danger",
  },
};

/* =========================
   STATES
   ========================= */

export const Loading: Story = {
  args: {
    children: "Saving",
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

/* =========================
   SIZES
   ========================= */

export const Small: Story = {
  args: {
    children: "Small Button",
    size: "small",
  },
};

export const Medium: Story = {
  args: {
    children: "Medium Button",
    size: "medium",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "large",
  },
};

/* =========================
   ICONS
   ========================= */

export const WithLeftIcon: Story = {
  args: {
    children: "Download",
    variant: "primary",

    leftIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M5 21h14" />
      </svg>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: "Next",
    variant: "primary",

    rightIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),
  },
};

export const WithBothIcons: Story = {
  args: {
    children: "Continue",
    variant: "primary",

    leftIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    ),

    rightIcon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),
  },
};

/* =========================
   FULL WIDTH
   ========================= */

export const FullWidth: Story = {
  args: {
    children: "Full Width Button",
    fullWidth: true,
  },

  parameters: {
    layout: "padded",
  },

  render: (args) => (
    <div style={{ width: "100%" }}>
      <Button {...args} />
    </div>
  ),
};