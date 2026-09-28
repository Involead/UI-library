import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import { fn } from "storybook/test";

import { Dropdown } from "./Dropdown";
import type { DropdownOption } from "./Dropdown";

const FRUIT_OPTIONS: DropdownOption[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Grape", value: "grape" },
  { label: "Mango", value: "mango" },
  { label: "Orange", value: "orange" },
  { label: "Pineapple", value: "pineapple", disabled: true },
  { label: "Strawberry", value: "strawberry" },
  { label: "Watermelon", value: "watermelon" },
];

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  args: {
    options: FRUIT_OPTIONS,
    onChange: fn(),
    onOpenChange: fn(),
  },

  argTypes: {
    options: {
      control: "object",
    },

    multiple: {
      control: "boolean",
      description:
        "Allow selecting several options. `value` / `onChange` then use `string[]`.",
    },

    value: {
      control: false,
    },

    defaultValue: {
      control: "object",
    },

    label: {
      control: "text",
    },

    placeholder: {
      control: "text",
    },

    helperText: {
      control: "text",
    },

    error: {
      control: "text",
    },

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

    required: {
      control: "boolean",
    },

    fullWidth: {
      control: "boolean",
    },

    searchable: {
      control: "boolean",
    },

    clearable: {
      control: "boolean",
    },

    name: {
      control: "text",
    },

    id: {
      control: "text",
    },

    className: {
      control: "text",
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  alignItems: "start",
  gap: "var(--spacing-xl)",
  width: "min(820px, 90vw)",
} as const;

/* =========================
   SINGLE SELECT
   ========================= */

export const SingleSelect: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
  },
};

/* =========================
   MULTI SELECT
   ========================= */

export const MultiSelect: Story = {
  args: {
    label: "Favorite fruits",
    placeholder: "Select fruits",
    multiple: true,
    defaultValue: ["apple", "mango"],
  },
};

/* =========================
   SEARCHABLE
   ========================= */

export const Searchable: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    searchable: true,
  },
};

/* =========================
   CLEARABLE
   ========================= */

export const Clearable: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    clearable: true,
    defaultValue: "banana",
  },
};

/* =========================
   STATES
   ========================= */

export const States: Story = {
  argTypes: {
    multiple: { control: false },
    disabled: { control: false },
    error: { control: false },
    helperText: { control: false },
    defaultValue: { control: false },
  },

  render: ({ options, size, searchable, clearable }) => {
    const shared = { options, size, searchable, clearable };

    return (
      <div style={grid}>
        <Dropdown {...shared} label="Default" placeholder="Select a fruit" />
        <Dropdown
          {...shared}
          label="With value"
          defaultValue="cherry"
        />
        <Dropdown
          {...shared}
          label="With helper text"
          placeholder="Select a fruit"
          helperText="You can change this later in settings."
        />
        <Dropdown
          {...shared}
          label="Error"
          placeholder="Select a fruit"
          error="Please select a fruit."
          required
        />
        <Dropdown
          {...shared}
          label="Disabled"
          placeholder="Select a fruit"
          disabled
        />
        <Dropdown
          {...shared}
          label="Disabled with value"
          defaultValue="mango"
          disabled
        />
        <Dropdown
          {...shared}
          multiple
          label="Multi — error"
          placeholder="Select fruits"
          defaultValue={["apple"]}
          error="Select at least two fruits."
        />
        <Dropdown
          {...shared}
          multiple
          label="Multi — disabled"
          defaultValue={["apple", "grape"]}
          disabled
        />
        <Dropdown
          {...shared}
          label="Disabled option (Pineapple)"
          placeholder="Open to see"
          helperText="Disabled options can't be highlighted or selected."
        />
        <Dropdown
          {...shared}
          label="Value not in options"
          placeholder="Select a fruit"
          defaultValue="kiwi"
          helperText="An unmatched value falls back to the placeholder."
        />
      </div>
    );
  },
};

/* =========================
   ALL
   ========================= */

export const All: Story = {
  argTypes: {
    multiple: { control: false },
    size: { control: false },
    searchable: { control: false },
    clearable: { control: false },
    defaultValue: { control: false },
  },

  render: ({ options, disabled }) => {
    const shared = { options, disabled };

    return (
      <div style={grid}>
        <Dropdown {...shared} size="small" label="Small" placeholder="Select a fruit" />
        <Dropdown {...shared} size="medium" label="Medium" placeholder="Select a fruit" />
        <Dropdown {...shared} size="large" label="Large" placeholder="Select a fruit" />

        <Dropdown {...shared} label="Single select" placeholder="Select a fruit" />
        <Dropdown
          {...shared}
          label="Single — searchable & clearable"
          defaultValue="banana"
          searchable
          clearable
        />
        <Dropdown
          {...shared}
          label="Single — error"
          placeholder="Select a fruit"
          error="Please select a fruit."
        />

        <Dropdown
          {...shared}
          multiple
          label="Multi select"
          placeholder="Select fruits"
          defaultValue={["apple", "mango"]}
        />
        <Dropdown
          {...shared}
          multiple
          label="Multi — searchable & clearable"
          placeholder="Select fruits"
          defaultValue={["cherry", "grape"]}
          searchable
          clearable
        />
        <Dropdown
          {...shared}
          multiple
          label="Multi — many selected"
          defaultValue={[
            "apple",
            "banana",
            "cherry",
            "grape",
            "mango",
            "orange",
            "strawberry",
          ]}
          clearable
        />
      </div>
    );
  },
};

/* =========================
   WIDTH
   ========================= */

export const FullWidth: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    fullWidth: true,
  },

  parameters: {
    layout: "padded",
  },
};

export const CustomWidth: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    width: 400,
  },
};
