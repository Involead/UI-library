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

import { fn } from "storybook/test";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,

  parameters: {
    layout: "centered",

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

  args: {
    onChange: fn(),
  },

  argTypes: {
    size: {
      control: "select",
      options: [
        "small",
        "medium",
        "large",
      ],
    },

    label: {
      control: "text",
    },

    helperText: {
      control: "text",
    },

    error: {
      control: "text",
    },

    defaultChecked: {
      control: "boolean",
    },

    disabled: {
      control: "boolean",
    },

    checked: {
      control: false,
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

const stack = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--spacing-lg)",
} as const;

/* =========================
   ALL
   ========================= */

export const All: Story = {
  render: (args) => (
    <div style={stack}>
      <Checkbox {...args} label="Unchecked" />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Disabled" disabled />
      <Checkbox
        {...args}
        label="Disabled checked"
        defaultChecked
        disabled
      />
      <Checkbox
        {...args}
        label="With helper text"
        helperText="You can change this later in settings."
      />
      <Checkbox
        {...args}
        label="With error"
        error="You must accept the terms to continue."
      />
      <Checkbox
        {...args}
        label="Checked with error"
        error="This option is not available."
        defaultChecked
      />
    </div>
  ),
};

/* =========================
   SIZES
   ========================= */

export const Sizes: Story = {
  argTypes: {
    size: {
      control: false,
    },
  },

  render: (args) => (
    <div style={stack}>
      <Checkbox {...args} size="small" label="Small" />
      <Checkbox {...args} size="medium" label="Medium" />
      <Checkbox {...args} size="large" label="Large" />
    </div>
  ),
};

/* =========================
   STATES
   ========================= */

export const States: Story = {
  argTypes: {
    defaultChecked: {
      control: false,
    },

    disabled: {
      control: false,
    },

    error: {
      control: false,
    },
  },

  render: (args) => (
    <div style={stack}>
      <Checkbox {...args} label="Unchecked" />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Disabled" disabled />
      <Checkbox
        {...args}
        label="Disabled checked"
        defaultChecked
        disabled
      />
      <Checkbox
        {...args}
        label="Error"
        error="This field is required."
      />
    </div>
  ),
};

/* =========================
   WITH LABEL
   ========================= */

export const WithLabel: Story = {
  args: {
    label: "Remember me",
  },
};

/* =========================
   WITH HELPER TEXT
   ========================= */

export const WithHelperText: Story = {
  args: {
    label: "Subscribe to newsletter",
    helperText: "We'll send you updates once a month.",
  },
};
