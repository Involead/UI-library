"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

const navGroups = [
  {
    title: "Button",
    items: [
      "Primary",
      "Secondary",
      "Outline",
      "Ghost",
      "Danger",
      "Loading",
      "Disabled",
      "Small",
      "Medium",
      "Large",
      "With Left Icon",
      "With Right Icon",
      "With Both Icons",
      "Full Width",
    ],
  },
];

const propRows = [
  {
    name: "children",
    description: "Button label content",
    defaultValue: "Primary Button",
  },
  {
    name: "variant",
    description: "Visual button style",
    defaultValue: "primary",
  },
  {
    name: "size",
    description: "Button size",
    defaultValue: "medium",
  },
  {
    name: "loading",
    description: "Shows a loading state",
    defaultValue: "false",
  },
  {
    name: "disabled",
    description: "Disables interaction",
    defaultValue: "false",
  },
  {
    name: "fullWidth",
    description: "Fills the available width",
    defaultValue: "false",
  },
];

type Panel = "controls" | "actions" | "code";

function formatButtonCode(
  children: string,
  variant: string,
  size: string,
  loading: boolean,
  disabled: boolean,
  fullWidth: boolean,
) {
  return `<Button
  variant="${variant}"
  size="${size}"
  loading={${loading}}
  disabled={${disabled}}
  fullWidth={${fullWidth}}
>
  "${children}"
</Button>`;
}

export default function Home() {
  const [activeTopTab, setActiveTopTab] = useState<"canvas" | "docs">("canvas");
  const [componentSearch, setComponentSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Button: true,
  });
  const [activeStory, setActiveStory] = useState("Primary");
  const [children, setChildren] = useState("Primary Button");
  const [variant, setVariant] = useState<
    "primary" | "secondary" | "outline" | "ghost" | "danger"
  >("primary");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [codeDraft, setCodeDraft] = useState(() =>
    formatButtonCode("Primary Button", "primary", "medium", false, false, false),
  );
  const [buttonClickCount, setButtonClickCount] = useState(0);
  const [activePanel, setActivePanel] = useState<Panel>("controls");
  const [actionLog, setActionLog] = useState<string[]>([]);

  const hasLeftIcon =
    activeStory === "With Left Icon" || activeStory === "With Both Icons";
  const hasRightIcon =
    activeStory === "With Right Icon" || activeStory === "With Both Icons";
  const normalizedSearch = componentSearch.trim().toLowerCase();
  const filteredGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.toLowerCase().includes(normalizedSearch),
      ),
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

  function selectStory(story: string) {
    const defaults: Record<string, {
      children: string;
      variant: typeof variant;
      size: typeof size;
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
    const next = defaults[story];
    if (!next) return;
    setActiveStory(story);
    setChildren(next.children);
    setVariant(next.variant);
    setSize(next.size);
    setLoading(next.loading);
    setDisabled(next.disabled);
    setFullWidth(next.fullWidth);
    setCodeDraft(
      formatButtonCode(
        next.children,
        next.variant,
        next.size,
        next.loading,
        next.disabled,
        next.fullWidth,
      ),
    );
    setButtonClickCount(0);
  }

  function applyCodeDraft() {
    const nextChildren = codeDraft.match(/>\s*"([^"]*)"\s*<\/Button>/)?.[1];
    const nextVariant = codeDraft.match(/variant=["'](primary|secondary|outline|ghost|danger)["']/)?.[1];
    const nextSize = codeDraft.match(/size=["'](small|medium|large)["']/)?.[1];
    const nextLoading = codeDraft.match(/loading=\{(true|false)\}/)?.[1];
    const nextDisabled = codeDraft.match(/disabled=\{(true|false)\}/)?.[1];
    const nextFullWidth = codeDraft.match(/fullWidth=\{(true|false)\}/)?.[1];

    if (nextChildren !== undefined) setChildren(nextChildren);
    if (nextVariant) setVariant(nextVariant as typeof variant);
    if (nextSize) setSize(nextSize as typeof size);
    if (nextLoading) setLoading(nextLoading === "true");
    if (nextDisabled) setDisabled(nextDisabled === "true");
    if (nextFullWidth) setFullWidth(nextFullWidth === "true");
    setActiveStory("Custom");
    recordAction("code: applied changes");
  }

  return (
    <div className={`storybook-page${activeTopTab === "docs" ? " docs-mode" : ""}`}>
      <style jsx>{`
        :global(html, body) {
          margin: 0;
          height: 100%;
          background: #edf0f3;
          font-family: var(--font-family-primary);
        }

        * {
          box-sizing: border-box;
        }

        .storybook-page {
          width: 100%;
          min-height: 100vh;
          background: #eef2f5;
          color: #1f2a37;
        }

        .topbar {
          position: sticky;
          top: 0;
          z-index: 10;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 18px 0 12px;
          background: rgba(246, 248, 250, 0.96);
          border-bottom: 1px solid #dde4eb;
        }

        .brand-region {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 220px;
        }

        .brand-mark {
          width: 44px;
          height: 44px;
          display: block;
          object-fit: contain;
          border-radius: 8px;
        }

        .brand-name {
          font-size: 17px;
          font-weight: 700;
          letter-spacing: -0.04em;
          color: #1d2430;
        }

        .brand-tag {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: #77889a;
          margin-top: 2px;
        }

        .topnav {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-left: 4px;
        }

        .topnav button {
          appearance: none;
          border: none;
          background: transparent;
          color: #6b7a8e;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 14px;
          font-weight: 500;
          padding: 9px 10px 8px;
          border-bottom: 2px solid transparent;
          cursor: pointer;
        }

        .topnav .active {
          color: #1d2a38;
          border-bottom-color: #3c8ce5;
        }

        .topnav-icon {
          width: 15px;
          height: 15px;
          flex: 0 0 auto;
        }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .utility {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 30px;
          min-width: 30px;
          border: 1px solid #d7dde4;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 6px;
          color: #516176;
          padding: 0 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .utility svg {
          width: 12px;
          height: 12px;
        }

        .utility-pill {
          min-width: 52px;
          padding: 0 10px;
        }

        .content {
          display: flex;
          min-height: calc(100vh - 58px);
        }

        .sidebar {
          width: 228px;
          background: rgba(245, 247, 249, 0.62);
          border-right: 1px solid #dde4eb;
          padding: 12px 8px 12px 0;
        }

        .sidebar-search {
          margin: 4px 16px 12px 14px;
          height: 32px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 10px;
          border: 1px solid #dce3eb;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.24);
          color: #7a8290;
          font-size: 13px;
        }

        .sidebar-search input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #485a72;
          font-size: 13px;
        }

        .sidebar-empty {
          padding: 18px 16px;
          color: #7b8b9e;
          font-size: 12px;
          line-height: 1.5;
        }

        .menu-group {
          margin-top: 8px;
        }

        .menu-item {
          display: flex;
          align-items: center;
          width: 100%;
          min-height: 30px;
          padding: 0 12px 0 18px;
          border: 0;
          background: transparent;
          color: #2d3b4d;
          text-align: left;
          font-size: 14px;
          font-weight: 500;
          border-left: 3px solid transparent;
          cursor: pointer;
        }

        .menu-item .menu-icon {
          width: 14px;
          height: 16px;
          margin-right: 9px;
          display: inline-block;
          position: relative;
          background: #607895;
          clip-path: polygon(15% 0, 85% 0, 85% 100%, 50% 76%, 15% 100%);
          opacity: 0.95;
        }

        .menu-item.root .menu-icon {
          width: 14px;
          height: 14px;
          background: transparent;
          clip-path: none;
          border-radius: 0;
          box-shadow: none;
        }

        .menu-item.root .chevron {
          width: 12px;
          height: 12px;
          margin-left: auto;
          color: #728198;
          transition: transform 160ms ease;
        }

        .menu-item.root .chevron.expanded {
          transform: rotate(90deg);
        }

        .menu-item.root .menu-icon::before {
          content: "";
          position: absolute;
          top: 1px;
          left: 1px;
          width: 5px;
          height: 5px;
          border-radius: 1px;
          background: #2a6fde;
          box-shadow: 7px 0 #2a6fde, 0 7px #2a6fde, 7px 7px #2a6fde;
        }

        .menu-item.root.active .menu-icon {
          background: transparent;
        }

        .menu-item.active {
          background: rgba(84, 155, 255, 0.1);
          border-left-color: #2a6fde;
          color: #1f67d4;
          box-shadow: inset 0 0 0 1px rgba(42, 109, 223, 0.05);
        }

        .menu-item.active .menu-icon {
          background: #1f67d4;
        }

        .menu-item.sub {
          padding-left: 42px;
          font-weight: 400;
          color: #485a72;
        }

        .menu-item.sub.active {
          background: rgba(64, 122, 255, 0.12);
          border-left-color: transparent;
          box-shadow: inset 0 0 0 1px rgba(42, 109, 223, 0.08);
          color: #1a5ec7;
          font-weight: 500;
        }

        .canvas {
          flex: 1;
          background: rgba(245, 247, 250, 0.75);
        }

        .stage {
          padding-top: 20px;
          border-bottom: 1px solid #dde4eb;
          background: rgba(242, 245, 247, 0.4);
        }

        .controls {
          margin: 0 auto;
          max-width: 1040px;
          padding: 18px 0 0;
        }

        .tabs {
          display: flex;
          align-items: center;
          gap: 18px;
          border-bottom: 1px solid #dfe6ee;
          padding: 0 0 0 15px;
        }

        .tab {
          position: relative;
          border: none;
          background: transparent;
          padding: 0 0 10px;
          color: #606d7d;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .tab.active {
          color: #1e67d2;
        }

        .tab.active::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 2px;
          background: #2a6fde;
          border-radius: 1px;
        }

        .table-shell {
          margin-top: 8px;
          overflow: hidden;
          border-radius: 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          background: rgba(255, 255, 255, 0.18);
        }

        thead th {
          text-align: left;
          padding: 12px 16px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7d8ca1;
          background: rgba(243, 246, 249, 0.6);
          border-bottom: 1px solid #dfe6ee;
          font-weight: 700;
        }

        tbody td {
          padding: 12px 16px;
          font-size: 13px;
          color: #2f3b4d;
          border-bottom: 1px solid #e6ebf0;
          vertical-align: middle;
          background: rgba(255, 255, 255, 0.12);
        }

        tbody td:first-child {
          font-family: var(--font-family-mono);
          color: #2d3b4d;
        }

        tbody td:nth-child(2) {
          color: #5f707f;
        }

        .control-cell {
          color: #2b3e5b;
          font-weight: 500;
        }

        .default-cell {
          color: #414f63;
        }

        .field-box {
          display: inline-block;
          min-width: 146px;
          height: 32px;
          padding: 0 12px;
          border: 1px solid #d0d9e4;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.2);
          line-height: 30px;
          color: #3b4c63;
          font-size: 12px;
        }

        .control-input {
          width: 100%;
          max-width: 260px;
          height: 32px;
          padding: 0 10px;
          border: 1px solid #d0d9e4;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.7);
          color: #3b4c63;
          font-size: 12px;
        }

        .control-checkbox {
          width: 16px;
          height: 16px;
          accent-color: #1d6fe8;
        }

        .checkbox {
          width: 14px;
          height: 14px;
          border: 1.5px solid #b3becc;
          border-radius: 3px;
          display: inline-block;
          position: relative;
          background: rgba(255, 255, 255, 0.6);
        }

        .checkbox.checked {
          background: #1d6fe8;
          border-color: #1d6fe8;
        }

        .checkbox.checked::after {
          content: "";
          position: absolute;
          left: 4px;
          top: 1px;
          width: 4px;
          height: 8px;
          border-right: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(45deg);
        }

        .reset-btn {
          margin-top: 18px;
          padding: 0 12px;
          height: 30px;
          border: 1px solid #d6dfe8;
          background: rgba(255, 255, 255, 0.45);
          border-radius: 6px;
          color: #1f67d4;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
        }

        .button-preview {
          min-height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 16px;
        }

        .button-preview-status {
          min-height: 20px;
          color: #69788b;
          font-size: 12px;
        }

        .button-preview-full {
          padding: 0 24px;
        }

        .panel-empty {
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #69788b;
          font-size: 13px;
        }

        .action-panel {
          min-height: 150px;
          padding: 10px 16px 16px;
        }

        .action-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #69788b;
          font-size: 12px;
        }

        .clear-actions {
          border: 1px solid #d6dfe8;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.45);
          color: #1f67d4;
          cursor: pointer;
          font-size: 12px;
          padding: 5px 8px;
        }

        .action-list {
          display: grid;
          gap: 6px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .action-list li {
          padding: 8px 10px;
          border: 1px solid #e1e7ee;
          border-radius: 5px;
          background: rgba(255, 255, 255, 0.4);
          color: #405168;
          font-family: var(--font-family-mono);
          font-size: 12px;
        }

        .code-panel {
          width: 100%;
          min-height: 180px;
          margin: 0;
          padding: 16px;
          overflow-x: auto;
          background: #f8fafc;
          color: #405168;
          font-family: var(--font-family-mono);
          font-size: 12px;
          line-height: 1.6;
          white-space: pre;
          border: 0;
          border-bottom: 1px solid #dfe6ee;
          resize: vertical;
          outline: none;
        }

        .code-actions {
          display: flex;
          justify-content: flex-end;
          padding: 10px 16px 0;
        }

        .docs-page {
          max-width: 980px;
          margin: 0 auto;
          padding: 34px 42px 64px;
          color: #2d3b4d;
        }

        .docs-eyebrow {
          color: #1f67d4;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .docs-page h1 {
          margin: 8px 0 12px;
          color: #1d2a38;
          font-size: 32px;
          line-height: 1.2;
        }

        .docs-page h2 {
          margin: 34px 0 12px;
          color: #1d2a38;
          font-size: 20px;
        }

        .docs-page h3 {
          margin: 22px 0 8px;
          color: #2d3b4d;
          font-size: 15px;
        }

        .docs-page p,
        .docs-page li {
          color: #607086;
          font-size: 14px;
          line-height: 1.7;
        }

        .docs-page ul {
          padding-left: 20px;
        }

        .docs-code {
          margin: 14px 0;
          padding: 16px;
          overflow-x: auto;
          border: 1px solid #dfe6ee;
          border-radius: 7px;
          background: #f8fafc;
          color: #405168;
          font-family: var(--font-family-mono);
          font-size: 12px;
          line-height: 1.6;
          white-space: pre;
        }

        .docs-example {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100px;
          margin: 14px 0;
          padding: 22px;
          border: 1px solid #dfe6ee;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.5);
        }

        .docs-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
          border: 1px solid #dfe6ee;
        }

        .docs-table th,
        .docs-table td {
          padding: 11px 13px;
          border-bottom: 1px solid #e4eaf0;
          text-align: left;
          font-size: 13px;
        }

        .docs-table th {
          color: #6f8197;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .docs-table td:first-child {
          color: #2d3b4d;
          font-family: var(--font-family-mono);
        }

        .story-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .story-card {
          padding: 13px;
          border: 1px solid #dfe6ee;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.45);
        }

        .story-card strong {
          display: block;
          color: #2d3b4d;
          font-size: 13px;
        }

        .story-card span {
          display: block;
          margin-top: 4px;
          color: #748399;
          font-size: 12px;
        }

      `}</style>

      <header className="topbar">
        <div className="brand-region">
          <img className="brand-mark" src="/involead-logo.jpe" alt="InvoLead" />
          <div>
            <div className="brand-name">InvoLead</div>
            <div className="brand-tag">UI LIBRARY</div>
          </div>
        </div>

        <nav className="topnav" aria-label="Main navigation">
          <button
            type="button"
            className={activeTopTab === "canvas" ? "active" : ""}
            onClick={() => setActiveTopTab("canvas")}
          >
            <svg className="topnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
            </svg>
            Canvas
          </button>
          <button
            type="button"
            className={activeTopTab === "docs" ? "active" : ""}
            onClick={() => setActiveTopTab("docs")}
          >
            <svg className="topnav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M5 4.5h10.5A3.5 3.5 0 0 1 19 8v11.5H8.5A3.5 3.5 0 0 1 5 16V4.5Z" />
              <path d="M5 16a3.5 3.5 0 0 1 3.5-3.5H19" />
              <path d="M8.5 8h6.5M8.5 10.5h4.5" strokeLinecap="round" />
            </svg>
            Docs
          </button>
        </nav>

        <div className="top-actions" aria-label="Editor toolbar">
          <button type="button" className="utility" aria-label="Search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="5.5" />
              <path d="M16 16L21 21" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" className="utility utility-pill">
            80%
          </button>
          <button type="button" className="utility" aria-label="Theme">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3.5v7.2" strokeLinecap="round" />
              <path d="M12 20.5v-1.6" strokeLinecap="round" />
              <path d="M18.6 5.4l-5.1 5.1" strokeLinecap="round" />
              <path d="M10.5 13.5L5.4 18.6" strokeLinecap="round" />
              <path d="M20.5 12h-7.2" strokeLinecap="round" />
              <path d="M3.5 12h1.6" strokeLinecap="round" />
              <circle cx="12" cy="12" r="3.6" />
            </svg>
          </button>
          <button type="button" className="utility utility-pill">
            White
          </button>
          <button type="button" className="utility utility-pill">
            Responsive
          </button>
          <button type="button" className="utility" aria-label="More options">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </header>

      <div className="content">
        <aside className="sidebar" aria-label="Component navigation">
          <label className="sidebar-search"><svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="5.5" /><path d="M16 16L21 21" strokeLinecap="round" /></svg><input value={componentSearch} onChange={(event) => setComponentSearch(event.target.value)} placeholder="Find components" aria-label="Find components" /></label>
          {filteredGroups.map((group) => <div key={group.title} className="menu-group"><button type="button" className="menu-item root active" aria-expanded={expandedGroups[group.title]} onClick={() => setExpandedGroups((current) => ({ ...current, [group.title]: !current[group.title] }))}><span className="menu-icon" aria-hidden="true" />{group.title}<svg className={`chevron${expandedGroups[group.title] ? " expanded" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg></button>{expandedGroups[group.title] && group.items.map((item) => <button key={item} type="button" className={`menu-item sub${item === activeStory ? " active" : ""}`} onClick={() => selectStory(item)}><span className="menu-icon" aria-hidden="true" />{item}</button>)}</div>)}
          {filteredGroups.length === 0 ? <div className="sidebar-empty">No components or stories match �{componentSearch}�.</div> : null}
        </aside>

        <main className="canvas">
          {activeTopTab === "docs" ? (
            <article className="docs-page">
              <div className="docs-eyebrow">Components / Button</div>
              <h1>Button</h1>
              <p>
                Buttons communicate actions that users can take. This documentation
                mirrors the Button Storybook autodocs page and uses the same
                component implementation.
              </p>

              <h2>Import</h2>
              <pre className="docs-code">{`import { Button } from "@involead/ui";
import "@involead/ui/ui.css";`}</pre>

              <h2>Basic usage</h2>
              <div className="docs-example">
                <Button variant="primary">Primary Button</Button>
              </div>
              <pre className="docs-code">{`<Button variant="primary">
  Primary Button
</Button>`}</pre>

              <h2>Props</h2>
              <table className="docs-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>children</td>
                    <td>ReactNode</td>
                    <td>â€”</td>
                    <td>Content displayed inside the button.</td>
                  </tr>
                  <tr>
                    <td>variant</td>
                    <td>primary | secondary | outline | ghost | danger</td>
                    <td>primary</td>
                    <td>Controls the visual style.</td>
                  </tr>
                  <tr>
                    <td>size</td>
                    <td>small | medium | large</td>
                    <td>medium</td>
                    <td>Controls the button dimensions and typography.</td>
                  </tr>
                  <tr>
                    <td>loading</td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Shows a spinner and disables the button.</td>
                  </tr>
                  <tr>
                    <td>disabled</td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Prevents interaction and applies disabled styling.</td>
                  </tr>
                  <tr>
                    <td>fullWidth</td>
                    <td>boolean</td>
                    <td>false</td>
                    <td>Expands the button to the available width.</td>
                  </tr>
                  <tr>
                    <td>leftIcon / rightIcon</td>
                    <td>ReactNode</td>
                    <td>undefined</td>
                    <td>Optional icons rendered beside the content.</td>
                  </tr>
                </tbody>
              </table>

              <h2>Stories</h2>
              <div className="story-grid">
                {[
                  ["Primary", "Primary action"],
                  ["Secondary", "Secondary action"],
                  ["Outline", "Outlined action"],
                  ["Ghost", "Low-emphasis action"],
                  ["Danger", "Destructive action"],
                  ["Loading", "Busy state"],
                  ["Disabled", "Disabled state"],
                  ["Small / Medium / Large", "Size variants"],
                  ["With Left Icon", "Leading icon"],
                  ["With Right Icon", "Trailing icon"],
                  ["With Both Icons", "Leading and trailing icons"],
                  ["Full Width", "Padded layout story"],
                ].map(([name, description]) => (
                  <div className="story-card" key={name}>
                    <strong>{name}</strong>
                    <span>{description}</span>
                  </div>
                ))}
              </div>

              <h2>States and accessibility</h2>
              <ul>
                <li>Use concise, action-oriented labels.</li>
                <li>Loading buttons expose `aria-busy` and are disabled while busy.</li>
                <li>Disabled buttons remain visibly distinct and cannot be activated.</li>
                <li>Keyboard focus is visible through the component focus ring.</li>
                <li>Icons are decorative when supplied through `leftIcon` or `rightIcon`.</li>
              </ul>

              <h2>Examples</h2>
              <div className="docs-example">
                <Button variant="secondary" size="small">Secondary</Button>
                <Button variant="outline" size="medium">Outline</Button>
                <Button variant="danger" size="large">Delete</Button>
              </div>
            </article>
          ) : (
            <>
          <div className="stage">
            <div className={`button-preview${fullWidth ? " button-preview-full" : ""}`}>
              <Button
                variant={variant}
                size={size}
                loading={loading}
                disabled={disabled}
                fullWidth={fullWidth}
                leftIcon={
                  hasLeftIcon ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v12" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                  ) : undefined
                }
                rightIcon={
                  hasRightIcon ? (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  ) : undefined
                }
                onClick={() => setButtonClickCount((count) => count + 1)}
                onMouseDown={() => recordAction("button: mouse down")}
              >
                {children}
              </Button>
              <span className="button-preview-status" role="status">
                {disabled
                  ? "This button is disabled."
                  : buttonClickCount > 0
                    ? `Clicked ${buttonClickCount} time${buttonClickCount === 1 ? "" : "s"}.`
                    : "Click the button to test its interaction."}
              </span>
            </div>
          </div>

          <div className="controls"><div className="tabs" role="tablist" aria-label="Controls tabs"><button type="button" className={`tab${activePanel === "controls" ? " active" : ""}`} role="tab" aria-selected={activePanel === "controls"} onClick={() => setActivePanel("controls")}>Controls</button><button type="button" className={`tab${activePanel === "actions" ? " active" : ""}`} role="tab" aria-selected={activePanel === "actions"} onClick={() => setActivePanel("actions")}>Actions</button><button type="button" className={`tab${activePanel === "code" ? " active" : ""}`} role="tab" aria-selected={activePanel === "code"} onClick={() => setActivePanel("code")}>Code</button></div>{activePanel === "controls" ? <div className="table-shell"><table><thead><tr><th>Name</th><th>Description</th><th>Default</th><th>Control</th></tr></thead><tbody>{propRows.map((row)=><tr key={row.name}><td>{row.name}</td><td>{row.description}</td><td className="default-cell">{row.defaultValue}</td><td className="control-cell">{row.name === "children" ? <input className="control-input" value={children} onChange={(e)=>setChildren(e.target.value)} aria-label="Button children"/> : row.name === "variant" ? <select className="control-input" value={variant} onChange={(e)=>setVariant(e.target.value as typeof variant)}><option value="primary">primary</option><option value="secondary">secondary</option><option value="outline">outline</option><option value="ghost">ghost</option><option value="danger">danger</option></select> : row.name === "size" ? <select className="control-input" value={size} onChange={(e)=>setSize(e.target.value as typeof size)}><option value="small">small</option><option value="medium">medium</option><option value="large">large</option></select> : <input className="control-checkbox" type="checkbox" checked={row.name === "loading" ? loading : row.name === "disabled" ? disabled : fullWidth} onChange={(e)=>{if(row.name === "loading")setLoading(e.target.checked);if(row.name === "disabled")setDisabled(e.target.checked);if(row.name === "fullWidth")setFullWidth(e.target.checked)}} aria-label={`Button ${row.name}`}/>}</td></tr>)}</tbody></table></div> : null}{activePanel === "actions" ? <div className="action-panel"><div className="action-panel-header"><span>Interaction events</span><button type="button" className="clear-actions" onClick={()=>setActionLog([])}>Clear</button></div>{actionLog.length ? <ul className="action-list">{actionLog.map((v,i)=><li key={v+i}>{v}</li>)}</ul> : <div className="panel-empty">Interact with the preview to see events here.</div>}</div> : null}{activePanel === "code" ? <><textarea className="code-panel" value={codeDraft} onChange={(e)=>setCodeDraft(e.target.value)} aria-label="Editable Button code" spellCheck={false}/><div className="code-actions"><button type="button" className="reset-btn" onClick={applyCodeDraft}>Apply code</button></div></> : null}<button type="button" className="reset-btn" onClick={()=>{selectStory("Primary");setActionLog([]);setActivePanel("controls")}}>Reset controls</button></div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

