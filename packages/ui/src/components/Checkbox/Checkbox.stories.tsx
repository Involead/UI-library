import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import { Checkbox } from "./Checkbox";

const meta = {
  title: "Components/Checkbox",
  component: Checkbox,

  parameters: {
    layout: "padded",

    docs: {
      description: {
        component: `
Usage (controlled):

\`\`\`tsx
import { useState } from "react";
import { Checkbox } from "@involead/ui";

function NewsletterOptIn() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      label="Subscribe to newsletter"
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
    />
  );
}
\`\`\`

Omit \`checked\`/\`onChange\` (use \`defaultChecked\` instead) for an
uncontrolled checkbox. \`indeterminate\` sets the underlying DOM property
(it isn't a settable HTML attribute) and is kept in sync even when you also
pass a \`ref\` — both point at the same \`<input>\`.
        `,
      },
    },
  },

  tags: ["autodocs"],

  argTypes: {
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },

    disabled: {
      control: "boolean",
    },

    indeterminate: {
      control: "boolean",
    },

    required: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  args: {
    label: "Accept terms and conditions",
  },
};

export const Checked: Story = {
  args: {
    label: "Subscribe to newsletter",
    defaultChecked: true,
  },
};

export const Indeterminate: Story = {
  args: {
    label: "Select all",
    indeterminate: true,
  },
};

/* =========================
   SIZES
   ========================= */

export const Small: Story = {
  args: {
    size: "small",
    label: "Small checkbox",
  },
};

export const Medium: Story = {
  args: {
    size: "medium",
    label: "Medium checkbox",
  },
};

export const Large: Story = {
  args: {
    size: "large",
    label: "Large checkbox",
  },
};

/* =========================
   STATES
   ========================= */

export const Required: Story = {
  args: {
    label: "I agree to the terms",
    required: true,
  },
};

export const WithHelperText: Story = {
  args: {
    label: "Enable two-factor authentication",
    helperText: "Recommended for all accounts.",
  },
};

export const WithError: Story = {
  args: {
    label: "Accept terms and conditions",
    error: "You must accept the terms to continue.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Disabled checkbox",
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: "Disabled and checked",
    disabled: true,
    defaultChecked: true,
  },
};
