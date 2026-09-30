import { useState, type CSSProperties } from "react";
import type {
  Meta,
  StoryObj,
} from "@storybook/nextjs-vite";

import { icons, type IconName } from "@/icons";

import { Input } from "../Input";

import { Icon } from "./Icon";

const ICON_NAMES = Object.keys(icons) as IconName[];

const meta = {
  title: "Components/Icon",
  component: Icon,

  parameters: {
    layout: "centered",
  },

  tags: ["autodocs"],

  args: {
    name: "search",
    size: 24,
    strokeWidth: 2,
  },

  argTypes: {
    name: {
      control: "select",
      options: ICON_NAMES,
    },

    size: {
      control: { type: "number", min: 8, max: 96, step: 4 },
    },

    color: {
      control: "color",
    },

    hoverColor: {
      control: "color",
    },

    strokeWidth: {
      control: { type: "number", min: 0.5, max: 4, step: 0.25 },
    },

    disabled: {
      control: "boolean",
    },

    title: {
      control: "text",
    },

    ariaLabel: {
      control: "text",
    },

    children: {
      control: false,
    },

    onClick: {
      control: false,
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

const galleryStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "var(--spacing-md)",
  width: "min(90vw, 960px)",
};

const tileStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--spacing-sm)",
  padding: "var(--spacing-lg) var(--spacing-sm)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-md)",
  color: "var(--color-text-primary)",
};

const nameStyle: CSSProperties = {
  fontFamily: "var(--font-family-primary)",
  fontSize: "var(--font-size-xs)",
  color: "var(--color-text-secondary)",
  textAlign: "center",
  wordBreak: "break-word",
};

const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  gap: "var(--spacing-xl)",
  color: "var(--color-text-primary)",
};

/* =========================
   GALLERY
   ========================= */

export const Gallery: Story = {
  parameters: {
    layout: "padded",
  },

  render: function GalleryRender(args) {
    const [query, setQuery] = useState("");

    // Ignore spaces and hyphens so "arrowdown" and "arrow down" both match "arrow-down".
    const normalize = (value: string) => value.toLowerCase().replace(/[\s-]/g, "");
    const filteredNames = ICON_NAMES.filter((name) =>
      normalize(name).includes(normalize(query)),
    );

    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
        <Input
          type="search"
          placeholder={`Search ${ICON_NAMES.length} icons`}
          aria-label="Search icons"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          leftIcon={<Icon name="search" size={16} />}
          fullWidth
        />

        {filteredNames.length > 0 ? (
          <div style={galleryStyle}>
            {filteredNames.map((name) => (
              <div key={name} style={tileStyle}>
                <Icon {...args} name={name} />
                <span style={nameStyle}>{name}</span>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ ...nameStyle, margin: 0, fontSize: "var(--font-size-sm)" }}>
            No icons match &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    );
  },
};

/* =========================
   SIZES
   ========================= */

const SIZES = [12, 16, 20, 24, 32, 48];

export const Sizes: Story = {
  render: (args) => (
    <div style={rowStyle}>
      {SIZES.map((size) => (
        <div key={size} style={{ ...tileStyle, border: "none", padding: 0 }}>
          <Icon {...args} size={size} />
          <span style={nameStyle}>{size}px</span>
        </div>
      ))}
    </div>
  ),
};

/* =========================
   COLOR
   ========================= */

const COLORS = [
  "var(--color-text-primary)",
  "var(--color-primary)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-error)",
  "var(--color-info)",
];

export const Colors: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-lg)" }}>
      <div style={rowStyle}>
        {COLORS.map((color) => (
          <div key={color} style={{ ...tileStyle, border: "none", padding: 0 }}>
            <Icon {...args} name="info" color={color} />
            <span style={nameStyle}>{color.replace(/var\(--color-|\)/g, "")}</span>
          </div>
        ))}
      </div>

      {/* Default currentColor: the icon inherits the surrounding text color. */}
      <p
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--spacing-sm)",
          margin: 0,
          fontFamily: "var(--font-family-primary)",
          color: "var(--color-error)",
        }}
      >
        <Icon name="warning" size={16} />
        Inherits text color via currentColor
      </p>
    </div>
  ),
};

/* =========================
   ACCESSIBILITY
   ========================= */

export const Labelled: Story = {
  args: {
    title: "Search",
  },
};

/* =========================
   STATES
   ========================= */

export const HoverColor: Story = {
  args: {
    name: "heart",
    size: 32,
    hoverColor: "var(--color-error)",
  },
};

export const Disabled: Story = {
  args: {
    name: "settings",
    size: 32,
    hoverColor: "var(--color-primary)",
    disabled: true,
  },
};

/* =========================
   INTERACTIVE
   ========================= */

export const Clickable: Story = {
  render: function ClickableRender(args) {
    const [count, setCount] = useState(0);

    return (
      <div style={{ ...rowStyle, alignItems: "center" }}>
        <Icon
          {...args}
          name="plus"
          title="Add one"
          hoverColor="var(--color-primary)"
          onClick={() => setCount((value) => value + 1)}
        />
        <span style={nameStyle}>Clicked {count} times</span>
      </div>
    );
  },
};

/* =========================
   CUSTOM SVG
   ========================= */

export const CustomSvg: Story = {
  args: {
    name: undefined,
    size: 32,
    color: "var(--color-success)",
    hoverColor: "var(--color-primary)",
    title: "Home",
    // Any svg works as is: its own width/height are overridden by `size`, and
    // `fill="currentColor"` makes it follow `color` / `hoverColor`.
    children: (
      <svg width="800px" height="800px" viewBox="0 0 15 15" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          fill="currentColor"
          d="M7.07926 0.222253C7.31275 -0.007434 7.6873 -0.007434 7.92079 0.222253L14.6708 6.86227C14.907 7.09465 14.9101 7.47453 14.6778 7.71076C14.4454 7.947 14.0655 7.95012 13.8293 7.71773L13 6.90201V12.5C13 12.7761 12.7762 13 12.5 13H2.50002C2.22388 13 2.00002 12.7761 2.00002 12.5V6.90201L1.17079 7.71773C0.934558 7.95012 0.554672 7.947 0.32229 7.71076C0.0899079 7.47453 0.0930283 7.09465 0.32926 6.86227L7.07926 0.222253ZM7.50002 1.49163L12 5.91831V12H10V8.49999C10 8.22385 9.77617 7.99999 9.50002 7.99999H6.50002C6.22388 7.99999 6.00002 8.22385 6.00002 8.49999V12H3.00002V5.91831L7.50002 1.49163ZM7.00002 12H9.00002V8.99999H7.00002V12Z"
        />
      </svg>
    ),
  },
};
