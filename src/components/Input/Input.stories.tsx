import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  argTypes: {
    size: {
      control: "select",
      options: [
        "small",
        "medium",
        "large",
      ],
    },

    type: {
      control: "select",
      options: [
        "text",
        "password",
        "email",
        "number",
        "tel",
        "url",
        "search",
        "date",
        "datetime-local",
        "time",
        "month",
        "week",
        "color",
        "file",
      ],
    },

    disabled: {
      control: "boolean",
    },

    required: {
      control: "boolean",
    },

    fullWidth: {
      control: "boolean",
    },

    labelPosition: {
      control: "radio",
      options: [
        "top",
        "left",
        "right",
      ],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
  },
};

export const Required: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Username",
    placeholder: "jane_doe",
    helperText: "This will be visible to other users.",
  },
};

/* =========================
   LABEL POSITION
   ========================= */

export const LabelPositions: Story = {
  argTypes: {
    labelPosition: {
      control: false,
    },
  },

  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xl)" }}>
      <Input {...args} labelPosition="top" label="Label on top" placeholder="you@example.com" />
      <Input {...args} labelPosition="left" label="Label on left" placeholder="you@example.com" />
      <Input
        {...args}
        labelPosition="right"
        label="Label on right"
        placeholder="you@example.com"
        helperText="Helper text stays under the input."
      />
    </div>
  ),
};

/* =========================
   TYPES
   ========================= */

export const Password: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
};

export const NumberType: Story = {
  args: {
    label: "Age",
    type: "number",
    placeholder: "18",
  },
};

export const EmailType: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
  },
};

export const DateType: Story = {
  args: {
    label: "Date of birth",
    type: "date",
  },
};

/* =========================
   STATES
   ========================= */

export const WithError: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    error: "Please enter a valid email address.",
    defaultValue: "not-an-email",
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    placeholder: "you@example.com",
    disabled: true,
  },
};

/* =========================
   SIZES
   ========================= */

export const Small: Story = {
  args: {
    label: "Small",
    size: "small",
    placeholder: "Small input",
  },
};

export const Medium: Story = {
  args: {
    label: "Medium",
    size: "medium",
    placeholder: "Medium input",
  },
};

export const Large: Story = {
  args: {
    label: "Large",
    size: "large",
    placeholder: "Large input",
  },
};

/* =========================
   FULL WIDTH
   ========================= */

export const FullWidth: Story = {
  args: {
    label: "Full width",
    placeholder: "Spans the container",
    fullWidth: true,
  },

  parameters: {
    layout: "padded",
  },
};
