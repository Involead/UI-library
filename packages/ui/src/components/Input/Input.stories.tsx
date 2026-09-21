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

    docs: {
      description: {
        component: `
Usage (controlled):

\`\`\`tsx
import { useState } from "react";
import { Input } from "@involead/ui";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();

  return (
    <Input
      label="Email"
      name="email"
      type="email"
      placeholder="you@company.com"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      error={error}
      required
    />
  );
}
\`\`\`

Omit \`value\`/\`onChange\` (use \`defaultValue\` instead) for an uncontrolled
input. \`ref\` is forwarded to the underlying \`<input>\`, so it works with
\`useRef\` or form libraries like react-hook-form.
        `,
      },
    },
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
