"use client";

import { useState } from "react";
import { Stepper } from "@/components/Stepper";
import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import type { StepItem } from "@/components/Stepper";

import type { ExplorerArgs } from "../../explorer-config";
import { getStringArg } from "../args";
import { isChoice, type PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange: (value: string) => void;
};

type Orientation = "horizontal" | "vertical";
type Size = "small" | "medium";

const containerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  gap: 32,
  padding: 40,
  background: "var(--color-surface-secondary)",
  borderRadius: 8,
  border: "1px solid var(--color-border)",
  width: "100%",
  maxWidth: 800,
  margin: "0 auto",
};

const headerStyle = {
  margin: "0 0 16px",
  fontSize: 14,
  fontWeight: 600,
  color: "var(--color-text-secondary)",
  textTransform: "uppercase" as const,
  letterSpacing: 1,
};

function buildSteps(args: ExplorerArgs): StepItem[] {
  const withIcons = args.withIcons === true;
  const withDescriptions = args.withDescriptions === true;
  const withError = args.withError === true;
  
  const steps: StepItem[] = [
    { 
      label: "Account", 
      description: withDescriptions ? "Create your credentials" : undefined,
      icon: withIcons ? <Icon name="user" size={16} color="currentColor" /> : undefined,
    },
    { 
      label: "Search", 
      description: withDescriptions ? "Searching the data" : undefined,
      optional: args.withOptional === true,
      icon: withIcons ? <Icon name="search" size={16} color="currentColor" /> : undefined,
    },
    { 
      label: "Review", 
      description: withDescriptions ? "Confirm your order" : undefined,
      icon: withIcons ? <Icon name="check-circle" size={16} color="currentColor" /> : undefined,
    },
  ];

  if (withError) {
    steps[1].error = true;
  }

  if (args.disabled === true) {
    return steps.map(s => ({ ...s, disabled: true }));
  }

  return steps;
}

export function StepperPreview({ args, composition, onChange }: Props) {
  // Parse the initial step from args
  const initialStep = typeof args.activeStep === "string" ? parseInt(args.activeStep, 10) : 1;
  const [activeStep, setActiveStep] = useState(isNaN(initialStep) ? 1 : initialStep);

  const rawOrientation = getStringArg(args, "orientation", "horizontal");
  const orientation: Orientation = isChoice(rawOrientation, ["horizontal", "vertical"])
    ? rawOrientation
    : "horizontal";

  // Updated to "small" | "medium"
  const rawSize = getStringArg(args, "size", "medium");
  const size: Size = isChoice(rawSize, ["small", "medium"]) ? rawSize : "medium";

  const alternativeLabel = args.alternativeLabel === true;
  const nonLinear = args.nonLinear === true;
  const clickable = args.clickable === true;

  const steps = buildSteps(args);

  // When clicked, update local state and notify the Explorer
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    onChange(String(index));
  };

  if (composition === "sizes") {
    return (
      <div style={containerStyle}>
        <div>
          <h3 style={headerStyle}>Small</h3>
          <Stepper steps={steps} activeStep={activeStep} size="small" orientation={orientation} alternativeLabel={alternativeLabel} />
        </div>
        <div>
          <h3 style={headerStyle}>Medium</h3>
          <Stepper steps={steps} activeStep={activeStep} size="medium" orientation={orientation} alternativeLabel={alternativeLabel} />
        </div>
      </div>
    );
  }

  if (composition === "orientation") {
    return (
      <div style={containerStyle}>
        <div>
          <h3 style={headerStyle}>Horizontal</h3>
          <Stepper steps={steps} activeStep={activeStep} orientation="horizontal" size={size} alternativeLabel={alternativeLabel} />
        </div>
        <div>
          <h3 style={headerStyle}>Vertical</h3>
          <div style={{ display: "flex", gap: 24 }}>
            <Stepper steps={steps} activeStep={activeStep} orientation="vertical" size={size} />
            <div style={{ padding: 16, border: "1px dashed var(--color-border)", borderRadius: 6, fontSize: 13, color: "var(--color-text-secondary)", flex: 1, display: "grid", placeItems: "center" }}>
              Vertical Step Content
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <Stepper
        steps={steps}
        activeStep={activeStep}
        orientation={orientation}
        size={size}
        alternativeLabel={alternativeLabel}
        nonLinear={nonLinear}
        onStepClick={clickable ? handleStepClick : undefined}
        ariaLabel="Checkout progress"
      />

      {/* Fallback controls ONLY if not clickable */}
      {!clickable && (
        <div style={{ display: "flex", gap: 12, justifyContent: "space-between", marginTop: 32 }}>
          <Button 
            variant="outline" 
            onClick={() => {
              const next = Math.max(0, activeStep - 1);
              setActiveStep(next);
              onChange(String(next));
            }}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              if (activeStep < steps.length - 1) {
                const next = activeStep + 1;
                setActiveStep(next);
                onChange(String(next));
              } else {
                alert("Flow complete!");
              }
            }}
          >
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      )}
    </div>
  );
}