import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useState } from "react";

import { Loader, type LoaderProps } from "./Loader";

const meta = {
  title: "Components/Loader",
  component: Loader,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  args: {
    variant: "spinner",
    size: 50,
    label: "Loading",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["spinner", "progress"],
      description: "The visual style of the loader.",
    },
    size: {
      control: { type: "range", min: 50, max: 400, step: 10 },
      description: "Width of the loader in pixels.",
    },
    label: {
      control: "text",
      description: "Accessible name for screen readers (aria-label).",
    },
    progress: {
      control: { type: "range", min: 0, max: 1, step: 0.01 },
      description: "Only for the progress variant. 0 to 1.",
    },
  },
} satisfies Meta<LoaderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: "flex", gap: 48, alignItems: "center", flexWrap: "wrap" } as const;
const column = {
  display: "flex",
  flexDirection: "column",
  gap: 16,
  alignItems: "center",
} as const;
const hint = { fontSize: 11, color: "var(--color-text-secondary)" } as const;

/* =========================
   BASIC VARIANTS
   ========================= */

export const Spinner: Story = {
  render: (args) => <Loader {...args} />,
  parameters: {
    docs: {
      source: {
        code: `<Loader variant="spinner" />`,
      },
    },
  },
};

export const Progress: Story = {
  args: {
    variant: "progress",
  },
  render: (args) => <Loader {...args} />,
  parameters: {
    docs: {
      source: {
        code: `<Loader variant="progress" />`,
      },
    },
  },
};

/* =========================
   AUTO-LOOPING PROGRESS
   ========================= */

function AutoLoopingProgressDemo() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increase progress every 30ms
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          // When it hits 100%, hold for a moment, then reset
          // We do this by returning 0 after a brief timeout
          setTimeout(() => setProgress(0), 800); 
          return 1;
        }
        // Increment by a random amount to make it feel natural
        return Math.min(1, prev + 0.02);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ ...column, gap: 24 }}>
      <Loader variant="progress" progress={progress} size={50} />
      <span style={hint}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

export const AutoLoopingProgress: Story = {
  render: () => <AutoLoopingProgressDemo />,
  parameters: {
    docs: {
      description: {
        story: "Simulates a real-world loading state that fills to 100%, pauses, and then restarts.",
      },
      source: {
        code: `const [progress, setProgress] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setProgress((prev) => {
      if (prev >= 1) {
        setTimeout(() => setProgress(0), 800);
        return 1;
      }
      return Math.min(1, prev + 0.02);
    });
  }, 50);
  return () => clearInterval(interval);
}, []);

<Loader variant="progress" progress={progress} size={50} />`,
      },
    },
  },
};

/* =========================
   MANUAL CONTROL
   ========================= */

function ControlledProgressDemo() {
  const [progress, setProgress] = useState(0);

  return (
    <div style={{ ...column, gap: 24 }}>
      <Loader variant="progress" progress={progress} size={50} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={progress}
        onChange={(e) => setProgress(parseFloat(e.target.value))}
        style={{ width: 200 }}
      />
      <span style={hint}>{Math.round(progress * 100)}%</span>
    </div>
  );
}

export const ControlledProgress: Story = {
  render: () => <ControlledProgressDemo />,
  parameters: {
    docs: {
      source: {
        code: `const [progress, setProgress] = useState(0);

<Loader variant="progress" progress={progress} size={50} />`,
      },
    },
  },
};

/* =========================
   SIZES
   ========================= */

export const Sizes: Story = {
  render: () => (
    <div style={row}>
      {[50, 60, 70].map((s) => (
        <div key={s} style={column}>
          <Loader size={s} />
          <span style={hint}>{s}px</span>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Loader size={50} />
  <Loader size={60} />
  <Loader size={70} />
</>`,
      },
    },
  },
};

/* =========================
   SIDE BY SIDE
   ========================= */

export const AllVariants: Story = {
  render: () => (
    <div style={row}>
      <div style={column}>
        <Loader variant="spinner" size={50} />
        <span style={hint}>Spinner</span>
      </div>
      <div style={column}>
        <Loader variant="progress" size={50} />
        <span style={hint}>Progress (Trickle)</span>
      </div>
      <div style={column}>
        <Loader variant="progress" progress={1} size={50} />
        <span style={hint}>Progress (100%)</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<>
  <Loader variant="spinner" />
  <Loader variant="progress" />
  <Loader variant="progress" progress={1} />
</>`,
      },
    },
  },
};