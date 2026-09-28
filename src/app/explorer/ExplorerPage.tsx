"use client";

import { useState } from "react";
import {
  explorerComponents,
  type ExplorerArgs,
  type ExplorerValue,
} from "../explorer-config";
import { getComponentDefaults, getDropdownOptions, getExplorerComponent } from "./args";
import { formatButtonCode, formatExplorerCode, parseExplorerCode, parseTextChild, readComponentBody } from "./code";
import { ExplorerDocs } from "./ExplorerDocs";
import { ExplorerPanels } from "./ExplorerPanels";
import { ExplorerSidebar } from "./ExplorerSidebar";
import { ExplorerTopbar } from "./ExplorerTopbar";
import { LayoutToggle } from "./LayoutToggle";
import { ButtonPreview } from "./previews/ButtonPreview";
import { CheckboxPreview } from "./previews/CheckboxPreview";
import { DropdownPreview } from "./previews/DropdownPreview";
import { InputPreview } from "./previews/InputPreview";
import { RadioPreview } from "./previews/RadioPreview";
import { TypographyPreview } from "./previews/TypographyPreview";
import {
  isChoice,
  type ButtonSize,
  type ButtonVariant,
  type ComponentName,
  type Panel,
  type PreviewLayout,
} from "./types";
import "./explorer.css";

const navGroups = explorerComponents.map((component) => ({
  title: component.name,
  items: component.stories.map((story) => story.name),
}));

const buttonStoryDefaults: Record<string, {
  children: string;
  variant: ButtonVariant;
  size: ButtonSize;
  loading: boolean;
  disabled: boolean;
  fullWidth: boolean;
}> = {
  Primary: { children: "Primary Button", variant: "primary", size: "medium", loading: false, disabled: false, fullWidth: false },
  Secondary: { children: "Secondary Button", variant: "secondary", size: "medium", loading: false, disabled: false, fullWidth: false },
  Outline: { children: "Outline Button", variant: "outline", size: "medium", loading: false, disabled: false, fullWidth: false },
  Ghost: { children: "Ghost Button", variant: "ghost", size: "medium", loading: false, disabled: false, fullWidth: false },
  Danger: { children: "Delete", variant: "danger", size: "medium", loading: false, disabled: false, fullWidth: false },
  Loading: { children: "Saving", variant: "primary", size: "medium", loading: true, disabled: false, fullWidth: false },
  Disabled: { children: "Disabled Button", variant: "primary", size: "medium", loading: false, disabled: true, fullWidth: false },
  Small: { children: "Small Button", variant: "primary", size: "small", loading: false, disabled: false, fullWidth: false },
  Medium: { children: "Medium Button", variant: "primary", size: "medium", loading: false, disabled: false, fullWidth: false },
  Large: { children: "Large Button", variant: "primary", size: "large", loading: false, disabled: false, fullWidth: false },
  "With Left Icon": { children: "Download", variant: "primary", size: "medium", loading: false, disabled: false, fullWidth: false },
  "With Right Icon": { children: "Next", variant: "primary", size: "medium", loading: false, disabled: false, fullWidth: false },
  "With Both Icons": { children: "Continue", variant: "primary", size: "medium", loading: false, disabled: false, fullWidth: false },
  "Full Width": { children: "Full Width Button", variant: "primary", size: "medium", loading: false, disabled: false, fullWidth: true },
};

function defaultLayoutForStory(
  componentName: string,
  composition?: string,
  args?: ExplorerArgs,
): PreviewLayout {
  if (args?.orientation === "vertical") return "vertical";
  if (args?.orientation === "horizontal") return "horizontal";
  if ((componentName === "Checkbox" || componentName === "Radio") && composition) return "horizontal";
  return "vertical";
}

export function ExplorerPage() {
  const [activeTopTab, setActiveTopTab] = useState<"canvas" | "docs">("canvas");
  const [componentSearch, setComponentSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    ...Object.fromEntries(explorerComponents.map((component) => [component.name, true])),
  });
  const [activeComponent, setActiveComponent] = useState<ComponentName>("Button");
  const [activeStory, setActiveStory] = useState("Primary");
  const [componentArgs, setComponentArgs] = useState<ExplorerArgs>({});
  const [children, setChildren] = useState("Primary Button");
  const [buttonLeftIcon, setButtonLeftIcon] = useState(false);
  const [buttonRightIcon, setButtonRightIcon] = useState(false);
  const [variant, setVariant] = useState<ButtonVariant>("primary");
  const [size, setSize] = useState<ButtonSize>("medium");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [codeDraft, setCodeDraft] = useState(() =>
    formatButtonCode("Primary Button", "primary", "medium", false, false, false),
  );
  const [buttonClickCount, setButtonClickCount] = useState(0);
  const [activePanel, setActivePanel] = useState<Panel>("controls");
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [codeError, setCodeError] = useState("");

  const normalizedSearch = componentSearch.trim().toLowerCase();
  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.title.toLowerCase().includes(normalizedSearch)
        ? group.items
        : group.items.filter((item) => item.toLowerCase().includes(normalizedSearch)),
    }))
    .filter(
      (group) =>
        group.title.toLowerCase().includes(normalizedSearch) ||
        group.items.length > 0 ||
        normalizedSearch === "",
    );

  function recordAction(action: string) {
    setActionLog((current) => [action, ...current].slice(0, 8));
  }

  function selectStory(componentName: string, story: string) {
    const component = getExplorerComponent(componentName);
    const selectedStory = component.stories.find((item) => item.name === story);
    if (!selectedStory) {
      throw new Error(`Unknown ${componentName} story "${story}".`);
    }
    setActiveComponent(componentName as ComponentName);
    setActiveStory(story);
    setActionLog([]);
    setCodeError("");

    if (componentName !== "Button") {
      setButtonLeftIcon(false);
      setButtonRightIcon(false);
      const nextArgs = {
        ...getComponentDefaults(component),
        ...selectedStory.args,
        orientation: defaultLayoutForStory(
          componentName,
          selectedStory.composition,
          selectedStory.args,
        ),
      };
      setComponentArgs(nextArgs);
      setCodeDraft(formatExplorerCode(componentName, nextArgs, selectedStory.composition));
      setButtonClickCount(0);
      return;
    }

    const next = buttonStoryDefaults[story];
    if (!next) throw new Error(`Missing Button defaults for story "${story}".`);
    setChildren(next.children);
    setVariant(next.variant);
    setSize(next.size);
    setLoading(next.loading);
    setDisabled(next.disabled);
    setFullWidth(next.fullWidth);
    setButtonLeftIcon(story === "With Left Icon" || story === "With Both Icons");
    setButtonRightIcon(story === "With Right Icon" || story === "With Both Icons");
    setCodeDraft(
      formatButtonCode(
        next.children,
        next.variant,
        next.size,
        next.loading,
        next.disabled,
        next.fullWidth,
        story === "With Left Icon" || story === "With Both Icons",
        story === "With Right Icon" || story === "With Both Icons",
      ),
    );
    setButtonClickCount(0);
  }

  function applyCodeDraft() {
    if (activeComponent !== "Button") {
      const component = getExplorerComponent(activeComponent);
      const nextArgs = parseExplorerCode(codeDraft, component);
      if (!nextArgs) {
        setCodeError(`Code must contain a valid <${activeComponent}> example.`);
        return;
      }
      setCodeError("");
      setComponentArgs(nextArgs);
      setActiveStory("Custom");
      recordAction(`${activeComponent.toLowerCase()}: code applied`);
      return;
    }
    const nextChildren = readComponentBody(codeDraft, "Button");
    const nextVariant = codeDraft.match(/variant=["'](primary|secondary|outline|ghost|danger)["']/)?.[1];
    const nextSize = codeDraft.match(/size=["'](small|medium|large)["']/)?.[1];
    const nextLoading = codeDraft.match(/loading=\{(true|false)\}/)?.[1];
    const nextDisabled = codeDraft.match(/disabled=\{(true|false)\}/)?.[1];
    const nextFullWidth = codeDraft.match(/fullWidth=\{(true|false)\}/)?.[1];

    if (nextChildren !== null) setChildren(parseTextChild(nextChildren));
    if (nextVariant && isChoice(nextVariant, ["primary", "secondary", "outline", "ghost", "danger"])) {
      setVariant(nextVariant);
    }
    if (nextSize && isChoice(nextSize, ["small", "medium", "large"])) setSize(nextSize);
    if (nextLoading) setLoading(nextLoading === "true");
    if (nextDisabled) setDisabled(nextDisabled === "true");
    if (nextFullWidth) setFullWidth(nextFullWidth === "true");
    setButtonLeftIcon(/\bleftIcon\s*=/.test(codeDraft));
    setButtonRightIcon(/\brightIcon\s*=/.test(codeDraft));
    setActiveStory("Custom");
    setCodeError("");
    recordAction("code: applied changes");
  }

  const activeDefinition = getExplorerComponent(activeComponent);
  const selectedExplorerStory = activeDefinition.stories.find(
    (story) => story.name === activeStory,
  );
  const composition = selectedExplorerStory?.composition;
  const previewLayout: PreviewLayout =
    componentArgs.orientation === "horizontal" ? "horizontal" : "vertical";
  const showLayoutToggle = Boolean(composition);

  function updateComponentArg(name: string, value: ExplorerValue) {
    let nextValue = value;
    if (activeComponent === "Dropdown" && name === "multiple") {
      const currentValue = componentArgs.value;
      nextValue = value === true
        ? typeof currentValue === "string" ? [currentValue] : []
        : Array.isArray(currentValue) ? currentValue[0] ?? null : currentValue;
    }
    const nextArgs = { ...componentArgs, [name]: nextValue };
    setComponentArgs(nextArgs);
    setCodeDraft(
      formatExplorerCode(activeComponent, nextArgs, selectedExplorerStory?.composition),
    );
  }

  function setPreviewLayout(layout: PreviewLayout) {
    updateComponentArg("orientation", layout);
  }

  function renderOtherPreview() {
    if (activeComponent === "Input") {
      return (
        <InputPreview
          args={componentArgs}
          onChange={(value) => {
            updateComponentArg("value", value);
            recordAction("input: change");
          }}
        />
      );
    }
    if (activeComponent === "Dropdown") {
      return (
        <DropdownPreview
          args={componentArgs}
          onChange={(next) => {
            updateComponentArg("value", next);
            recordAction("dropdown: selection changed");
          }}
          onOpenChange={(isOpen) => {
            if (isOpen) recordAction("dropdown: opened");
          }}
        />
      );
    }
    if (activeComponent === "Checkbox") {
      return (
        <CheckboxPreview
          args={componentArgs}
          composition={composition}
          layout={previewLayout}
          onChange={(event) => {
            updateComponentArg("checked", event.currentTarget.checked);
            recordAction("checkbox: change");
          }}
        />
      );
    }
    if (activeComponent === "Radio") {
      return (
        <RadioPreview
          args={componentArgs}
          composition={composition}
          layout={previewLayout}
          onChange={(event) => {
            if (composition !== "group") updateComponentArg("checked", event.currentTarget.checked);
            recordAction(`radio: change (${event.currentTarget.value})`);
          }}
        />
      );
    }
    if (activeComponent === "Typography") {
      return (
        <TypographyPreview
          args={componentArgs}
          composition={composition}
          layout={previewLayout}
        />
      );
    }
    return null;
  }

  function updateButtonControl(name: string, value: string | boolean) {
    let nextChildren = children;
    let nextVariant = variant;
    let nextSize = size;
    let nextLoading = loading;
    let nextDisabled = disabled;
    let nextFullWidth = fullWidth;
    if (name === "children" && typeof value === "string") {
      nextChildren = value;
      setChildren(value);
    }
    if (name === "variant" && typeof value === "string" && isChoice(value, ["primary", "secondary", "outline", "ghost", "danger"])) {
      nextVariant = value;
      setVariant(value);
    }
    if (name === "size" && typeof value === "string" && isChoice(value, ["small", "medium", "large"])) {
      nextSize = value;
      setSize(value);
    }
    if (name === "loading" && typeof value === "boolean") {
      nextLoading = value;
      setLoading(value);
    }
    if (name === "disabled" && typeof value === "boolean") {
      nextDisabled = value;
      setDisabled(value);
    }
    if (name === "fullWidth" && typeof value === "boolean") {
      nextFullWidth = value;
      setFullWidth(value);
    }
    setCodeDraft(
      formatButtonCode(
        nextChildren,
        nextVariant,
        nextSize,
        nextLoading,
        nextDisabled,
        nextFullWidth,
        buttonLeftIcon,
        buttonRightIcon,
      ),
    );
  }

  function resetSelectedStory() {
    const resetStory = activeDefinition.stories.find(
      (story) => story.name === activeStory,
    ) ?? activeDefinition.stories[0];
    selectStory(activeComponent, resetStory.name);
    setActivePanel("controls");
  }

  return (
    <div className={`storybook-page${activeTopTab === "docs" ? " docs-mode" : ""}`}>
      <ExplorerTopbar activeTab={activeTopTab} onTabChange={setActiveTopTab} />
      <div className="content">
        <ExplorerSidebar
          groups={filteredGroups}
          search={componentSearch}
          onSearchChange={setComponentSearch}
          expandedGroups={expandedGroups}
          onToggleGroup={(title) =>
            setExpandedGroups((current) => ({ ...current, [title]: !current[title] }))
          }
          activeComponent={activeComponent}
          activeStory={activeStory}
          onSelectStory={selectStory}
        />
        <main className="canvas">
          {activeTopTab === "docs" ? (
            <ExplorerDocs
              component={activeDefinition}
              code={codeDraft}
              preview={renderOtherPreview()}
              layout={previewLayout}
              onLayoutChange={setPreviewLayout}
              showLayoutToggle={showLayoutToggle}
            />
          ) : (
            <>
              <div className="stage">
                {showLayoutToggle ? (
                  <div className="stage-toolbar">
                    <LayoutToggle layout={previewLayout} onChange={setPreviewLayout} />
                  </div>
                ) : null}
                <div className={`button-preview${activeComponent === "Button" && fullWidth ? " button-preview-full" : ""}`}>
                  {activeComponent === "Button" ? (
                    <ButtonPreview
                      variant={variant}
                      size={size}
                      loading={loading}
                      disabled={disabled}
                      fullWidth={fullWidth}
                      leftIcon={buttonLeftIcon}
                      rightIcon={buttonRightIcon}
                      clickCount={buttonClickCount}
                      onClick={() => setButtonClickCount((count) => count + 1)}
                      onMouseDown={() => recordAction("button: mouse down")}
                    >
                      {children}
                    </ButtonPreview>
                  ) : (
                    <>
                      {renderOtherPreview()}
                      {activeComponent === "Dropdown" && !getDropdownOptions(componentArgs) ? (
                        <span className="button-preview-status" role="alert">
                          Fix the options JSON in Controls before using this preview.
                        </span>
                      ) : (
                        <span className="button-preview-status" role="status">
                          {activeStory} · {activeComponent}
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <ExplorerPanels
                activePanel={activePanel}
                onPanelChange={setActivePanel}
                activeComponent={activeComponent}
                component={activeDefinition}
                selectedStory={selectedExplorerStory}
                args={componentArgs}
                button={{ children, variant, size, loading, disabled, fullWidth }}
                actionLog={actionLog}
                codeDraft={codeDraft}
                codeError={codeError}
                onButtonControl={updateButtonControl}
                onComponentArg={updateComponentArg}
                onCodeChange={setCodeDraft}
                onApplyCode={applyCodeDraft}
                onClearActions={() => setActionLog([])}
                onReset={resetSelectedStory}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
}
