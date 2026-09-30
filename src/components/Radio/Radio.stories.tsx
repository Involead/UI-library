import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import { Radio } from "./Radio";

const meta = {
  title: "Components/Radio",
  component: Radio,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  args: {
    label: "Email notifications",
    name: "radio-demo",
    value: "email",
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

    disabled: {
      control: "boolean",
    },

    labelClickable: {
      control: "boolean",
    },

    labelPosition: {
      control: "radio",
      options: [
        "right",
        "left",
      ],
    },

    error: {
      control: "text",
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   STATES
   ========================= */

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: "We'll send a summary once a day.",
  },
};

export const WithError: Story = {
  args: {
    error: "Please choose a notification method.",
  },
};

export const ErrorChecked: Story = {
  args: {
    defaultChecked: true,
    error: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

/* =========================
   GROUP
   ========================= */

export const Group: Story = {
  render: (args) => (
    <div
      role="radiogroup"
      aria-label="Notification method"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <Radio {...args} label="Email" value="email" defaultChecked />
      <Radio {...args} label="SMS" value="sms" />
      <Radio {...args} label="Push notification" value="push" />
    </div>
  ),
  args: {
    name: "radio-group",
  },
};

/* =========================
   LABEL CLICKABLE
   ========================= */

export const LabelNotClickable: Story = {
  args: {
    labelClickable: false,
    helperText: "Only the circle selects this option.",
  },
};

/* =========================
   LABEL POSITION
   ========================= */

export const LabelLeft: Story = {
  args: {
    labelPosition: "left",
    helperText: "The label sits to the left of the circle.",
  },
};

/* =========================
   SIZES
   ========================= */

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Radio {...args} size="small" label="Small" value="small" />
      <Radio {...args} size="medium" label="Medium" value="medium" />
      <Radio {...args} size="large" label="Large" value="large" />
    </div>
  ),
  args: {
    name: "radio-sizes",
  },
};
