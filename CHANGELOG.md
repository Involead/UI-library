# Changelog

All notable changes to `@involead/ui` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/), and this
project uses [Semantic Versioning](https://semver.org/) once published.

## [Unreleased]

### Added

- Monorepo structure (`packages/ui`, `apps/storybook`) with npm workspaces.
- `@involead/ui` package build (tsup, ESM + CJS + type declarations).
- Initial components: `Button`, `Input`.
- Design tokens: colors, spacing, radius, shadow, z-index, typography,
  breakpoints (`--breakpoint-sm/md/lg/xl`).
- Unit test tooling for `packages/ui` (Vitest + Testing Library + jest-dom).
- Unit tests for `Button` (render, click, disabled, loading, icons,
  className merging, variant/size classes).
- Unit tests for `Input` (render, typing, required, helper/error text,
  disabled, icons, password visibility toggle, className merging).

### Fixed

- `Button` and `Input` size variants and icon sizing now use spacing tokens
  (`--spacing-8/-10/-12/-4`) instead of hardcoded pixel values.
