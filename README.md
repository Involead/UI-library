# InvoLead UI Library

- Package: `@involead/ui`
- Purpose: shared React component library for InvoLead products
- Stack: React, Next.js, TypeScript, Storybook, Vite, Vitest

## Current state

- Built foundation includes:
  - `Button`
  - `Input`
  - `Dropdown`
- Component capabilities:
  - Button: variants, sizes, loading, disabled, full width, icons
  - Input: labels, helper/error text, validation, passwords, common HTML input types
  - Dropdown: single/multi-select, search, clearable state, keyboard interaction, disabled options
- Design system:
  - CSS variable tokens in `src/styles`
  - typed token exports in `src/theme`
  - active global brand colors:
    - primary blue: `rgb(11, 65, 205)`
    - black/text base: `rgb(33, 32, 31)`
- Tooling:
  - Storybook configured
  - Vitest + Playwright browser tests configured
  - Vite package build configured
  - Type declaration build configured
- Version: `0.1.0`

## Requirements

- Node.js 20+
- npm

## Setup

- Install dependencies:
  ```bash
  npm install
  ```
- Run the example app:
  ```bash
  npm run dev
  ```
- Open: http://localhost:3000

## Storybook

- Start Storybook:
  ```bash
  npm run storybook
  ```
- Open: http://localhost:6006
- Build Storybook:
  ```bash
  npm run build-storybook
  ```

## Usage

- Import from the shared barrel:
  ```tsx
  "use client";

  import { Button, Dropdown, Input } from "@/components";
  ```
- Consumer pattern:
  - `Button`, `Input`, and `Dropdown` are client components
  - add `"use client"` when used across a Next.js server boundary
- Package-level exports also include:
  - component types
  - `cx`
  - token references

## Project structure

- `src/app/` — Next.js example app and global styles
- `src/components/` — reusable components and stories
- `src/styles/` — CSS tokens and typography
- `src/theme/` — typed token references
- `src/utils/` — shared utilities
- `src/index.ts` — public package entry point
- `.storybook/` — Storybook config
- `vite.config.ts` — package build config
- `tsconfig.build.json` — declaration build config

## Scripts

- `npm run dev` — start the example app
- `npm run build` — create Next.js production build
- `npm run start` — serve the Next.js build
- `npm run lint` — run ESLint
- `npm run typecheck` — run TypeScript checks
- `npm run test` — run Vitest / Storybook tests
- `npm run build:types` — generate declaration files
- `npm run build:package` — build declarations and package output
- `npm run storybook` — start Storybook
- `npm run build-storybook` — build Storybook output

## Quality gate before PR

- Run:
  ```bash
  npm run typecheck
  npm run test
  npm run build:package
  npm run build-storybook
  ```
- Update component implementation, styles, and stories together when behavior changes
- Keep public behavior accessible and token-driven
