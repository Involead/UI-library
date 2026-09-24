# InvoLead UI Library

`@involead/ui` is a React-first, Next.js-compatible component library for consistent, accessible InvoLead product interfaces.

- **Package:** `@involead/ui`
- **Version:** `0.1.5`
- **Stack:** React, Next.js, TypeScript, Storybook, Vite, Vitest
- **Styling:** CSS Modules and CSS custom properties
- **Distribution:** npm package with ESM, CommonJS, CSS, and TypeScript declarations

## Architecture and documentation

- [Technical design](./docs/technical-design.md) — architecture, styling, tokens, package output, and component definition of done.
- [Contributing and release process](./docs/contributing-and-release.md) — implementation, code review, validation, publishing, and consumer verification.

The library is React-first rather than Next.js-specific, so consuming applications do not need Next.js just to render components. The local Next.js app is used for development and compatibility validation.

## Current components

- `Button` — variants, sizes, loading, disabled, full width, and icons.
- `Input` — labels, helper/error text, validation, passwords, and common HTML input types.
- `Dropdown` — single/multi-select, search, clearable state, keyboard interaction, and disabled options.

## Requirements

- Node.js 20+
- npm

## Setup

```bash
npm install
npm run dev
```

Open the example application at [http://localhost:3000](http://localhost:3000).

## Storybook

Storybook is the component development, documentation, accessibility, and visual review environment. It includes the library component stories under `src/components/` and the Storybook documentation and examples under `src/stories/`.

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006). Build the static Storybook output with:

```bash
npm run build-storybook
```

## Usage

Install the published package in a consuming project:

```bash
npm install @involead/ui
```

Interactive components should be used inside a client boundary in Next.js:

```tsx
"use client";

import { Button, Dropdown, Input } from "@involead/ui";
import "@involead/ui/ui.css";
```

The public package entry point exports `Button`, `Input`, `Dropdown`, their public types, `cx`, and typed design tokens. The package stylesheet is available from the `@involead/ui/ui.css` subpath.

## Project structure

```text
src/
├── app/                  # Next.js example application
├── components/           # Component implementation, CSS, and stories
├── stories/              # Storybook documentation, examples, and assets
├── styles/               # CSS variables, typography, and package stylesheet
├── theme/                # Typed token references
├── utils/                # Shared utilities
├── types/                # Type declarations
└── index.ts              # Public package entry point
.storybook/               # Storybook configuration
docs/                     # Architecture and release documentation
dist/                     # Generated package output
```

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js example application |
| `npm run build` | Create the Next.js production build |
| `npm run start` | Serve the Next.js production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript checks |
| `npm run test` | Run Vitest tests |
| `npm run build:types` | Generate TypeScript declarations |
| `npm run build:package` | Generate declarations and Vite package output, including `dist/ui.css` |
| `npm run storybook` | Start Storybook |
| `npm run build-storybook` | Build static Storybook output |

## Making and reviewing changes

For a component change, update the implementation, scoped styles, Storybook stories, tests, and documentation together. Keep public exports deliberate and use design tokens instead of arbitrary values.

Before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run test
npm run build:package
npm run build-storybook
```

The review flow is:

```text
Requirement → API discussion → Implementation + tests + Storybook
→ Accessibility/visual review → Pull request
→ CI quality gates → Core UI team approval → Merge
```

Every component must have a typed API, Storybook coverage, appropriate tests, keyboard and focus behavior, accessible labels/roles/states, and code review. Breaking changes require migration guidance, a changelog entry, and a major version.

## Build and publish

Check the package metadata and npm account:

```bash
npm pkg get name version
npm whoami
```

Build and publish the current public npm package:

```bash
npm run build:package
npm publish --access public
npm view @involead/ui version
```

Publishing must happen only after the quality gates pass. Do not commit credentials, internal screenshots, product data, or proprietary documentation. The target release architecture is an InvoLead-approved private registry; use its protected credentials and registry-specific command once that infrastructure is configured.

## Quality and release principles

- Accessibility is part of the definition of done.
- Public APIs must remain strongly typed and backward-compatible where possible.
- Components must remain reusable and free of application-specific business logic.
- Releases use Semantic Versioning: PATCH for fixes, MINOR for compatible features, and MAJOR for breaking changes.
- Storybook is part of the development workflow, not only a documentation site.
