import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Loader } from "./";
import { Icon } from "../Icon"; // Adjust path to your Icon component if needed

const meta = {
  title: "Components/Loader",
  component: Loader,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    variant: "spinner",
    size: "medium",
    color: "primary",
    label: "",
    labelPlacement: "bottom",
    hideVisual: false,
    fullscreen: false,
    delay: 0,
    ariaLabel: "Loading",
    progressVariant: "indeterminate",
    disableShrink: false,
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["spinner", "dots", "bars", "pulse", "ring"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    color: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "error",
        "warning",
        "info",
        "inherit",
      ],
    },
    labelPlacement: {
      control: "select",
      options: ["top", "bottom", "start", "end"],
    },
    progressVariant: {
      control: "select",
      options: ["indeterminate", "determinate"],
    },
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    thickness: { control: "number" },
    hideVisual: { control: "boolean" },
    fullscreen: { control: "boolean" },
    delay: { control: "number" },
    disableShrink: { control: "boolean" },
  },
} as Omit<Meta<typeof Loader>, "args"> & {
  args: Partial<React.ComponentProps<typeof Loader>>;
};

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: "flex", gap: 32, alignItems: "center" } as const;
const column = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  alignItems: "center",
} as const;
const hint = { fontSize: 11, color: "#6b7280" } as const;

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  render: (args) => <Loader {...args} />,
  parameters: { docs: { source: { code: `<Loader />` } } },
};

export const Variants: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      {(["spinner", "dots", "bars", "pulse", "ring"] as const).map((v) => (
        <div key={v} style={column}>
          <Loader variant={v} />
          <span style={hint}>{v}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Loader variant="spinner" />
  <Loader variant="dots" />
  <Loader variant="bars" />
  <Loader variant="pulse" />
  <Loader variant="ring" />
</>`,
      },
    },
  },
};

/* =========================
   SIZES
   ========================= */

export const Sizes: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      {(["small", "medium", "large"] as const).map((s) => (
        <div key={s} style={column}>
          <Loader size={s} />
          <span style={hint}>{s}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Loader size="small" />
  <Loader size="medium" />
  <Loader size="large" />
</>`,
      },
    },
  },
};

export const CustomSize: Story = {
  render: () => (
    <div style={{ ...row, gap: 32 }}>
      {[18, 32, 48, 64].map((n) => (
        <div key={n} style={column}>
          <Loader size={n} />
          <span style={hint}>{n}px</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// size accepts a number for exact pixel control
<Loader size={48} />`,
      },
    },
  },
};

/* =========================
   COLOURS
   ========================= */

export const Colors: Story = {
  render: () => (
    <div style={{ ...row, gap: 24 }}>
      {(
        ["primary", "secondary", "success", "error", "warning", "info"] as const
      ).map((c) => (
        <div key={c} style={column}>
          <Loader color={c} />
          <span style={hint}>{c}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Loader color="primary" />
  <Loader color="secondary" />
  <Loader color="success" />
  <Loader color="error" />
  <Loader color="warning" />
  <Loader color="info" />
</>`,
      },
    },
  },
};

/* =========================
   DETERMINATE (MUI parity)
   ========================= */

export const Determinate: Story = {
  render: () => (
    <div style={{ ...row, gap: 24 }}>
      {[0, 25, 50, 75, 100].map((v) => (
        <div key={v} style={column}>
          <Loader
            variant="spinner"
            progressVariant="determinate"
            value={v}
            size={48}
            thickness={3}
          />
          <span style={hint}>{v}%</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// Set progressVariant="determinate" and pass a value 0–100
<Loader progressVariant="determinate" value={25} size={48} />
<Loader progressVariant="determinate" value={50} size={48} />
<Loader progressVariant="determinate" value={75} size={48} />
<Loader progressVariant="determinate" value={100} size={48} />`,
      },
    },
  },
};

/* =========================
   MUI disableShrink
   ========================= */

export const DisableShrink: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      <div style={column}>
        <Loader variant="spinner" />
        <span style={hint}>default (with shrink)</span>
      </div>
      <div style={column}>
        <Loader variant="spinner" disableShrink />
        <span style={hint}>disableShrink</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// disableShrink turns off the dasharray animation; keeps only rotation
<Loader disableShrink />`,
      },
    },
  },
};

/* =========================
   LABELS
   ========================= */

export const WithLabel: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      <Loader label="Loading" />
      <Loader label="Saving…" color="success" variant="dots" />
      <Loader label="Uploading" color="primary" variant="bars" size="large" />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Loader label="Loading" />
  <Loader label="Saving…" color="success" variant="dots" />
  <Loader label="Uploading" color="primary" variant="bars" size="large" />
</>`,
      },
    },
  },
};

export const LabelPlacement: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      {(["top", "bottom", "start", "end"] as const).map((p) => (
        <div key={p} style={column}>
          <Loader label="Loading…" labelPlacement={p} />
          <span style={hint}>{p}</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Loader label="Loading…" labelPlacement="top" />
  <Loader label="Loading…" labelPlacement="bottom" />
  <Loader label="Loading…" labelPlacement="start" />
  <Loader label="Loading…" labelPlacement="end" />
</>`,
      },
    },
  },
};

/* =========================
   INHERIT
   ========================= */

export const Inherit: Story = {
  render: () => (
    <div style={{ ...row, gap: 32 }}>
      <span style={{ color: "var(--color-text-primary)" }}>
        <Loader color="inherit" />
      </span>
      <span style={{ color: "var(--color-text-secondary)" }}>
        <Loader color="inherit" />
      </span>
      <span style={{ color: "var(--color-error)" }}>
        <Loader color="inherit" />
      </span>
      <span style={{ color: "var(--color-success)" }}>
        <Loader color="inherit" />
      </span>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// "inherit" picks up the surrounding text colour.
// Wrap the loader in any element that sets a color.

<>
  <span style={{ color: "var(--color-text-primary)" }}>
    <Loader color="inherit" />
  </span>

  <span style={{ color: "var(--color-text-secondary)" }}>
    <Loader color="inherit" />
  </span>

  <span style={{ color: "var(--color-error)" }}>
    <Loader color="inherit" />
  </span>

  <span style={{ color: "var(--color-success)" }}>
    <Loader color="inherit" />
  </span>
</>`,
      },
    },
  },
};

/* =========================
   HIDE VISUAL
   ========================= */

export const HideVisual: Story = {
  render: () => (
    <div style={{ ...column, gap: 12 }}>
      <span style={hint}>Visual hidden, only sr-only text</span>
      <Loader hideVisual ariaLabel="Saving data" />
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Loader hideVisual ariaLabel="Saving data" />`,
      },
    },
  },
};

/* =========================
   DELAY
   ========================= */

const DelayedRender = () => {
  const [key, setKey] = useState(0);

  return (
      <div style={{ ...column, gap: 24 }}>
        <button
          type="button"
          onClick={() => setKey((k) => k + 1)}
          style={{
            padding: "6px 14px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
            fontFamily: "var(--font-family-primary)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Restart
        </button>

        <div style={{ ...row, gap: 48 }}>
          <div style={column}>
            <Loader key={`a-${key}`} delay={0} variant="dots" />
            <span style={hint}>delay=0</span>
          </div>
          <div style={column}>
            <Loader key={`b-${key}`} delay={1000} variant="dots" />
            <span style={hint}>delay=1000</span>
          </div>
          <div style={column}>
            <Loader key={`c-${key}`} delay={2000} variant="dots" />
            <span style={hint}>delay=2000</span>
          </div>
        </div>
      </div>
  );
};

export const Delayed: Story = {
  render: () => <DelayedRender />,
  parameters: {
    docs: {
      source: {
        code: `// Fast operations finish before the delay → no flash
<Loader delay={300} />`,
      },
    },
  },
};

/* =========================
   CUSTOM ICONS (Images, GIFs, Library Icons)
   ========================= */

export const CustomIcons: Story = {
  render: () => (
    <div style={{ ...row, gap: 48 }}>
      <div style={column}>
        <Loader
          color="primary"
          label="Saving changes…"
          customIcon={
            <span style={{ display: "inline-flex", animation: "spin 2s linear infinite" }}>
              <Icon name="settings" />
            </span>
          }
        />
        <span style={hint}>Library Icon (Inherits Color)</span>
      </div>

      <div style={column}>
        <Loader
          size={48}
          label="Processing..."
          customIcon={
            /* Note: Using a public GIF URL for demonstration */
            <img 
              src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" 
              alt="" 
            />
          }
        />
        <span style={hint}>Custom GIF (Auto-scales)</span>
      </div>

      <div style={column}>
        <Loader
          color="success"
          label="Uploading..."
          customIcon={
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ animation: "bounce 1s infinite" }}>
              <circle cx="12" cy="12" r="8"></circle>
            </svg>
          }
        />
        <span style={hint}>Custom SVG</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `// You can pass any ReactNode into customIcon.
// Images and GIFs scale automatically to the \`size\` prop.

<>
  {/* Using your own UI library Icon */}
  <Loader
    color="primary"
    label="Saving changes…"
    customIcon={
      <Icon 
        name="settings" 
        style={{ animation: "spin 2s linear infinite" }} 
      />
    }
  />

  {/* Using an Image or GIF */}
  <Loader
    size={48}
    label="Processing..."
    customIcon={<img src="/loading.gif" alt="" />}
  />

  {/* Using a custom animated SVG */}
  <Loader
    color="success"
    label="Uploading..."
    customIcon={
      <svg viewBox="0 0 24 24" fill="currentColor" style={{ animation: "bounce 1s infinite" }}>
        <circle cx="12" cy="12" r="8"></circle>
      </svg>
    }
  />
</>`,
      },
    },
  },
};

/* =========================
   FULLSCREEN
   ========================= */

const FullscreenStory = () => {
  const [open, setOpen] = useState(false);

  return (
      <div style={column}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: "6px 14px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
            fontFamily: "var(--font-family-primary)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Show fullscreen loader
        </button>
        {open && (
          <Loader
            fullscreen
            variant="dots"
            size="large"
            label="Loading…"
            ariaLabel="Loading application"
            delay={300}
          />
        )}
      </div>
    );
};

export const Fullscreen: Story = {
  render: () => <FullscreenStory />,
  parameters: {
    docs: {
      source: {
        code: `<Loader
  fullscreen
  variant="dots"
  size="large"
  label="Loading…"
  ariaLabel="Loading application"
  delay={300}
/>`,
      },
    },
  },
};

const FullscreenCustomStory = () => {
  const [open, setOpen] = useState(false);

  return (
      <div style={column}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          style={{
            padding: "6px 14px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface)",
            fontFamily: "var(--font-family-primary)",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Show fullscreen custom loader
        </button>
        {open && (
          <Loader
            fullscreen
            size={64}
            label="Signing you in…"
            ariaLabel="Authenticating"
            delay={300}
            customIcon={
              <img 
                src="https://i.gifer.com/origin/34/34338d26023e5515f6cc8969aa027bca_w200.gif" 
                alt="" 
              />
            }
          />
        )}
      </div>
    );
};

export const FullscreenCustom: Story = {
  render: () => <FullscreenCustomStory />,
  parameters: {
    docs: {
      source: {
        code: `<Loader
  fullscreen
  size={64}
  label="Signing you in…"
  ariaLabel="Authenticating"
  delay={300}
  customIcon={<img src="/brand-loader.gif" alt="" />}
/>`,
      },
    },
  },
};