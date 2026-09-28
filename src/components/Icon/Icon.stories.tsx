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

    strokeWidth: {
      control: { type: "number", min: 0.5, max: 4, step: 0.25 },
    },

    title: {
      control: "text",
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
   PLAYGROUND
   ========================= */

export const Playground: Story = {};

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
