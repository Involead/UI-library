import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import type { StepItem } from "./Stepper";

import { Stepper } from "./";

/* =========================
   META
   ========================= */

const meta = {
  title: "Components/Stepper",
  component: Stepper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    activeStep: 1,
    orientation: "horizontal",
    size: "medium",
    alternativeLabel: false,
    nonLinear: false,
    error: false,
  },
  argTypes: {
    activeStep: { control: { type: "number", min: 0, max: 3 } },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    size: {
      control: "select",
      options: ["small", "medium"],
    },
    alternativeLabel: { control: "boolean" },
    nonLinear: { control: "boolean" },
    error: { control: "boolean" },
  },
} as Omit<Meta<typeof Stepper>, "args"> & {
  args: Partial<React.ComponentProps<typeof Stepper>>;
};

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   SHARED DATA
   ========================= */

const baseSteps: StepItem[] = [
  { label: "Account" },
  { label: "Payment" },
  { label: "Review" },
];

const detailedSteps: StepItem[] = [
  { label: "Account", description: "Create your credentials" },
  { label: "Payment", description: "Enter billing details" },
  { label: "Review", description: "Confirm your order" },
];

const iconSteps: StepItem[] = [
  { label: "Account", icon: <Icon name="user" size={16} /> },
  { label: "Search", icon: <Icon name="search" size={16} /> },
  { label: "Review", icon: <Icon name="check-circle" size={16} /> },
];

/* =========================
   LAYOUT HELPERS
   ========================= */

const muted = "var(--color-text-secondary, #6b7280)";
const border = "var(--color-border, #e5e7eb)";

const cardStyle: React.CSSProperties = {
  padding: "44px 56px",
  borderRadius: 16,
  border: `1px solid ${border}`,
  background: "var(--color-surface, #fff)",
  boxShadow: "0 1px 2px rgb(16 24 40 / .04), 0 12px 32px rgb(16 24 40 / .06)",
};

function Card({
  children,
  width = 680,
  title,
  hint,
}: {
  children: React.ReactNode;
  width?: number | string;
  title?: string;
  hint?: string;
}) {
  return (
    <div style={{ width: `min(${typeof width === "number" ? `${width}px` : width}, 90vw)` }}>
      {title && (
        <div style={{ marginBottom: 12, paddingLeft: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{title}</div>
          {hint && (
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
              {hint}
            </div>
          )}
        </div>
      )}
      <div style={cardStyle}>{children}</div>
    </div>
  );
}

/* =========================
   WIZARD DEMO
   ========================= */

function WizardDemo({
  orientation = "horizontal",
  items = detailedSteps,
  nonLinear = false,
  alternativeLabel = false,
  size = "medium",
}: {
  orientation?: "horizontal" | "vertical";
  items?: StepItem[];
  nonLinear?: boolean;
  alternativeLabel?: boolean;
  size?: "small" | "medium";
}) {
  const [active, setActive] = useState(0);

  const total = items.length;
  const finished = active >= total;
  const canBack = active > 0;
  const nextItem = items[active + 1];
  const isLast = active === total - 1;
  const canNext = isLast || (!!nextItem && !nextItem.disabled);

  const go = (index: number) => {
    setActive(index);
  };

  const stepper = (
    <Stepper
      steps={items}
      activeStep={active}
      orientation={orientation}
      alternativeLabel={alternativeLabel}
      size={size}
      nonLinear={nonLinear}
      onStepClick={go}
      ariaLabel="Checkout progress"
    />
  );

  const body = finished ? (
    <div
      style={{
        minHeight: 188,
        display: "grid",
        placeItems: "center",
        textAlign: "center",
      }}
    >
      <div>
        <div style={{ fontSize: 36 }}>🎉</div>
        <h4 style={{ margin: "8px 0 4px", fontSize: 16 }}>Order placed</h4>
        <p style={{ margin: 0, fontSize: 13, color: muted }}>
          All steps are complete.
        </p>
      </div>
    </div>
  ) : (
    <div
      style={{
        minHeight: 188,
        display: "grid",
        placeItems: "center",
        background: "var(--color-surface-secondary)",
        borderRadius: 8,
        border: `1px dashed ${border}`,
      }}
    >
      <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
        Content for {items[active].label}
      </p>
    </div>
  );

  const footer = (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 28,
        paddingTop: 20,
        borderTop: `1px solid ${border}`,
      }}
    >
      {finished ? (
        <Button variant="outline" onClick={() => go(0)}>
          Start over
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => go(active - 1)}
            disabled={!canBack}
          >
            Back
          </Button>

          <Button
            variant="primary"
            onClick={() => go(active + 1)}
            disabled={!canNext}
          >
            {isLast ? "Place order" : "Next"}
          </Button>
        </>
      )}
    </div>
  );

  if (orientation === "vertical") {
    return (
      <div style={{ display: "flex", gap: 56, alignItems: "flex-start" }}>
        <div style={{ width: 210, flex: "none" }}>{stepper}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {body}
          {footer}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 36 }}>{stepper}</div>
      {body}
      {footer}
    </div>
  );
}

/* =========================
   SOURCE HELPER
   ========================= */

function stepperSource(extraProps = "") {
  return `<Stepper
  steps={[
    { label: "Account" },
    { label: "Payment" },
    { label: "Review" },
  ]}
  activeStep={1}${extraProps}
/>`;
}

/* =========================
   INTERACTIVE
   ========================= */

export const Interactive: Story = {
  render: () => (
    <Card width={760}>
      <WizardDemo />
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: `const [activeStep, setActiveStep] = useState(0);

<Stepper
  steps={steps}
  activeStep={activeStep}
  onStepClick={setActiveStep} // completed steps become clickable
/>

{/* Render your own step content, then Back / Next buttons. */}`,
      },
    },
  },
};

export const InteractiveVertical: Story = {
  name: "Interactive (vertical)",
  render: () => (
    <Card width={860}>
      <WizardDemo orientation="vertical" />
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: `<div style={{ display: "flex", gap: 56 }}>
  <Stepper
    orientation="vertical"
    steps={steps}
    activeStep={activeStep}
    onStepClick={setActiveStep}
  />
  <div>{/* current step content + buttons */}</div>
</div>`,
      },
    },
  },
};

export const NonLinear: Story = {
  name: "Non-linear (jump to any step)",
  render: () => (
    <Card
      width={760}
      title="Click any step to jump to it"
      hint="The last step is disabled, so it can't be reached."
    >
      <WizardDemo
        nonLinear
        items={[
          { label: "Account", description: "Create your credentials" },
          { label: "Payment", description: "Enter billing details" },
          { label: "Review", description: "Not available yet", disabled: true },
        ]}
      />
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Stepper
  steps={steps}
  activeStep={activeStep}
  nonLinear
  onStepClick={setActiveStep}
/>`,
      },
    },
  },
};

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  args: { steps: baseSteps },
  render: (args) => (
    <Card>
      <Stepper {...args} />
    </Card>
  ),
  parameters: {
    docs: { source: { code: stepperSource() } },
  },
};

export const WithDescriptions: Story = {
  args: { steps: detailedSteps },
  render: (args) => (
    <Card>
      <Stepper {...args} />
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: stepperSource(`\n  // steps include a description property:
  // { label: "Account", description: "Create your credentials" }`),
      },
    },
  },
};

export const WithOptional: Story = {
  args: {
    steps: [
      { label: "Account" },
      { label: "Payment", optional: true },
      { label: "Review" },
    ],
  },
  render: (args) => (
    <Card>
      <Stepper {...args} />
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: stepperSource(`\n  // steps include optional: true
  // { label: "Payment", optional: true }`),
      },
    },
  },
};

export const WithIcons: Story = {
  args: { steps: iconSteps },
  render: (args) => (
    <Card>
      <Stepper {...args} />
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: stepperSource(`\n  // steps include an icon property:
  // icon: <Icon name="user" size={16} />`),
      },
    },
  },
};

export const IconByStatus: Story = {
  name: "Icon by status",
  args: {
    activeStep: 1,
    steps: ["Account", "Search", "Review"].map((label) => ({
      label,
      icon: (status: string) => (
        <Icon
          name={status === "completed" ? "check-circle" : "user"}
          size={16}
        />
      ),
    })) as StepItem[],
  },
  render: (args) => (
    <Card>
      <Stepper {...args} />
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: `{
  label: "Account",
  icon: (status) => (
    <Icon name={status === "completed" ? "check-circle" : "user"} size={16} />
  ),
}`,
      },
    },
  },
};

/* =========================
   STATES & LAYOUTS
   ========================= */

export const ErrorState: Story = {
  name: "Error state",
  args: { steps: baseSteps, activeStep: 1, error: true },
  render: (args) => (
    <Card>
      <Stepper {...args} />
    </Card>
  ),
  parameters: {
    docs: { source: { code: stepperSource(`\n  error`) } },
  },
};

export const AlternativeLabel: Story = {
  name: "Label below",
  args: { steps: baseSteps, alternativeLabel: true },
  render: (args) => (
    <Card>
      <Stepper {...args} />
    </Card>
  ),
  parameters: {
    docs: { source: { code: stepperSource(`\n  alternativeLabel`) } },
  },
};

export const Vertical: Story = {
  args: { steps: detailedSteps, orientation: "vertical" },
  render: (args) => (
    <Card width={360}>
      <Stepper {...args} />
    </Card>
  ),
  parameters: {
    docs: { source: { code: stepperSource(`\n  orientation="vertical"`) } },
  },
};

export const AllLayouts: Story = {
  name: "All layouts",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Card title="Horizontal" hint="Default layout">
        <Stepper steps={detailedSteps} activeStep={1} />
      </Card>
      <Card title="Label below" hint="alternativeLabel">
        <Stepper steps={baseSteps} activeStep={1} alternativeLabel />
      </Card>
      <Card width={360} title="Vertical" hint='orientation="vertical"'>
        <Stepper steps={detailedSteps} activeStep={1} orientation="vertical" />
      </Card>
    </div>
  ),
};

/* =========================
   SIZES
   ========================= */

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      <Card title="Medium" hint="Default">
        <Stepper steps={detailedSteps} activeStep={1} size="medium" />
      </Card>
      <Card title="Small" hint='size="small"'>
        <Stepper steps={detailedSteps} activeStep={1} size="small" />
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `<Stepper steps={steps} activeStep={1} size="medium" />
<Stepper steps={steps} activeStep={1} size="small" />`,
      },
    },
  },
};