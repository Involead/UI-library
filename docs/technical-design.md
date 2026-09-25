# InvoLead UI Technical Design

**Repository:** `Involead/ui`  
**Package:** `@involead/ui`  
**Status:** Draft baseline  
**Last updated:** September 2026

## Purpose

InvoLead UI is a reusable React component library for consistent, accessible, maintainable frontend experiences across InvoLead products. It provides components, design tokens, utilities, examples, documentation, and quality standards without containing application-specific business logic, data access, authentication, or product workflows.

## Architecture

```text
Design tokens ─┐
Components   ──┼──> Public package: @involead/ui ──> React and Next.js applications
Utilities     ──┘
```

The library is React-first and Next.js-compatible. Next.js is used for the local example application and compatibility validation; consumers should not need Next.js to render a component.

## Repository structure

```text
src/
├── app/                  # Next.js example application
├── components/           # Reusable components, styles, and stories
│   ├── Button/
│   ├── Input/
│   └── Dropdown/
├── stories/              # Storybook examples and assets
├── styles/               # CSS variables and typography
├── theme/                # Typed design-token references
├── utils/                # Shared helpers
├── types/                # Type declarations
└── index.ts              # Controlled public package entry point
.storybook/               # Storybook configuration
docs/                     # Architecture and contribution documentation
```

Each component should keep its implementation, scoped styles, Storybook story, and local export together. The public API is exposed only through `src/index.ts`; internal files are not consumer APIs.

## Styling and tokens

- CSS Modules provide component style isolation.
- CSS custom properties provide shared design tokens.
- TypeScript token exports provide typed references for consumers and tooling.
- Components should consume tokens instead of arbitrary hard-coded design values.
- No Tailwind, Bootstrap, Material UI, or other CSS framework is required.

## Build and package output

Vite Library Mode creates ESM and CommonJS bundles. React and React DOM are peer dependencies and remain external to the bundle. TypeScript emits declarations to `dist/types`.

```text
src/index.ts
    │
    ├── TypeScript declaration build → dist/types/
    └── Vite library build
          ├── dist/index.es.js
          ├── dist/index.cjs.js
          └── dist/ui.css
```

The package currently exports:

```tsx
import { Button, Dropdown, Input } from "@involead/ui";
import "@involead/ui/ui.css";
```

Interactive components must be rendered inside a client boundary in Next.js applications:

```tsx
"use client";

import { Button } from "@involead/ui";
```

## Component definition of done

A component is production-ready only when it has:

- an approved, strongly typed public API;
- design-token-based styling;
- usage documentation and Storybook stories for important states;
- unit tests for rendering, interaction, callbacks, and edge cases;
- keyboard support, visible focus, semantic roles, and accessible labels;
- relevant disabled, loading, error, empty, and responsive states;
- code review and CI validation;
- a changelog entry when the public package changes;
- required visual/TL approval.

## Quality model

Every release must pass type checking, linting, unit tests, package build verification, and Storybook build verification. Accessibility testing, visual regression testing, browser testing, keyboard-only testing, package-size checks, and dependency vulnerability scanning should be included as release gates as the project matures.

## Roadmap

1. Foundation: tokens, typography, icons, Button, Input, Checkbox, Radio, and Select.
2. Interaction: Modal/Dialog, Tooltip, Tabs, Toast, and Dropdown.
3. Data display: Table, Pagination, Badge, Status, Empty State, filters, and search.
4. Advanced components based on demonstrated product reuse.

