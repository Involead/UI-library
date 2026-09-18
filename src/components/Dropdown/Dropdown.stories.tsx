import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

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
];

const meta = {
  title: "Components/Dropdown",
  component: Dropdown,

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
  },
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   BASIC — SINGLE SELECT
   ========================= */

export const Single: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    options: FRUIT_OPTIONS,
  },
};

export const SingleClearable: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    options: FRUIT_OPTIONS,
    clearable: true,
    defaultValue: "banana",
  },
};

/* =========================
   MULTI SELECT
   ========================= */

export const Multiple: Story = {
  args: {
    label: "Favorite fruits",
    placeholder: "Select fruits",
    options: FRUIT_OPTIONS,
    multiple: true,
    defaultValue: ["apple", "mango"],
  },
};

export const MultipleClearable: Story = {
  args: {
    label: "Favorite fruits",
    placeholder: "Select fruits",
    options: FRUIT_OPTIONS,
    multiple: true,
    clearable: true,
    defaultValue: ["apple", "cherry", "grape"],
  },
};

export const ManySelectedWrap: Story = {
  args: {
    label: "Favorite fruits",
    placeholder: "Select fruits",
    options: FRUIT_OPTIONS,
    multiple: true,
    defaultValue: [
      "apple",
      "banana",
      "cherry",
      "grape",
      "mango",
      "orange",
      "strawberry",
    ],
  },
};

/* =========================
   SEARCH
   ========================= */

export const Searchable: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    options: FRUIT_OPTIONS,
    searchable: true,
  },
};

export const SearchableMultiple: Story = {
  args: {
    label: "Favorite fruits",
    placeholder: "Select fruits",
    options: FRUIT_OPTIONS,
    multiple: true,
    searchable: true,
    clearable: true,
  },
};

/* =========================
   STATES
   ========================= */

export const WithHelperText: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    options: FRUIT_OPTIONS,
    helperText: "You can change this later in settings.",
  },
};

export const WithError: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    options: FRUIT_OPTIONS,
    error: "Please select a fruit.",
  },
};

export const Disabled: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    options: FRUIT_OPTIONS,
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
    options: FRUIT_OPTIONS,
  },
};

export const Large: Story = {
  args: {
    label: "Large",
    size: "large",
    options: FRUIT_OPTIONS,
  },
};

/* =========================
   FULL WIDTH
   ========================= */

export const FullWidth: Story = {
  args: {
    label: "Favorite fruit",
    placeholder: "Select a fruit",
    options: FRUIT_OPTIONS,
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
    options: FRUIT_OPTIONS,
    width: 400,
  },
};
