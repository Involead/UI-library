import type { ExplorerArgs, ExplorerComponent } from "../explorer-config";

type Composition = ExplorerComponent["stories"][number]["composition"];

export function formatStepperCode(
  args: ExplorerArgs,
  composition?: Composition,
): string {
  const activeStep =
    typeof args.activeStep === "string" && args.activeStep
      ? parseInt(args.activeStep, 10)
      : 1;

  const orientation =
    args.orientation === "vertical" ? "vertical" : "horizontal";
  

  const size = args.size === "small" ? "small" : "medium";
  
  const alternativeLabel = args.alternativeLabel === true;
  const nonLinear = args.nonLinear === true;
  const clickable = args.clickable === true;
  const withIcons = args.withIcons === true;
  const withDescriptions = args.withDescriptions === true;
  const withOptional = args.withOptional === true;
  const withError = args.withError === true;
  const disabled = args.disabled === true;

  const stepsCode = `[
    { 
      label: "Account",${withDescriptions ? '\n      description: "Create your credentials",' : ""}${withIcons ? '\n      icon: <Icon name="user" size={16} />,' : ""}${disabled ? '\n      disabled: true,' : ""}
    },
    { 
      label: "Search",${withDescriptions ? '\n      description: "Searching the data",' : ""}${withOptional ? '\n      optional: true,' : ""}${withIcons ? '\n      icon: <Icon name="search" size={16} />,' : ""}${withError ? '\n      error: true,' : ""}${disabled ? '\n      disabled: true,' : ""}
    },
    { 
      label: "Review",${withDescriptions ? '\n      description: "Confirm your order",' : ""}${withIcons ? '\n      icon: <Icon name="check-circle" size={16} />,' : ""}${disabled ? '\n      disabled: true,' : ""}
    },
  ]`;

  if (composition === "sizes") {
    return `import { Stepper } from "@involead/ui";
import "@involead/ui/ui.css";

const steps = ${stepsCode};

<>
  <Stepper steps={steps} activeStep={${activeStep}} size="small" orientation="${orientation}" />
  <Stepper steps={steps} activeStep={${activeStep}} size="medium" orientation="${orientation}" />
</>`;
  }

  if (composition === "orientation") {
    return `import { Stepper } from "@involead/ui";
import "@involead/ui/ui.css";

const steps = ${stepsCode};

<>
  <Stepper steps={steps} activeStep={${activeStep}} orientation="horizontal" />
  <Stepper steps={steps} activeStep={${activeStep}} orientation="vertical" />
</>`;
  }

  const props = [`  steps={steps}`];
  
  // FIX 2: Use the state variable if clickable, otherwise use the hardcoded number
  if (clickable) {
    props.push(`  activeStep={activeStep}`);
    props.push(`  onStepClick={(step) => setActiveStep(step)}`);
  } else {
    props.push(`  activeStep={${activeStep}}`);
  }

  if (orientation !== "horizontal") props.push(`  orientation="vertical"`);
  props.push(`  size="${size}"`);
  if (alternativeLabel) props.push(`  alternativeLabel`);
  if (nonLinear) props.push(`  nonLinear`);

  const iconImport = withIcons ? `, Icon` : "";
  const stateSetup = clickable ? `const [activeStep, setActiveStep] = useState(${activeStep});\n\n` : "";
  const stateImport = clickable ? `import { useState } from "react";\n` : "";

  return `${stateImport}import { Stepper${iconImport} } from "@involead/ui";
import "@involead/ui/ui.css";

const steps = ${stepsCode};

${stateSetup}<Stepper
${props.join("\n")}
/>`;
}