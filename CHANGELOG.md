# Changelog

All notable changes to `@involead/ui` are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/), and this
project uses [Semantic Versioning](https://semver.org/) once published.

## [Unreleased]

### Added

- Monorepo structure (`packages/ui`, `apps/storybook`) with npm workspaces.
- `@involead/ui` package build (tsup, ESM + CJS + type declarations).
- Initial components: `Button`, `Input`, `Typography`.
- Design tokens: colors, spacing, radius, shadow, z-index, typography,
  breakpoints (`--breakpoint-sm/md/lg/xl`).
- Unit test tooling for `packages/ui` (Vitest + Testing Library + jest-dom).
- Unit tests for `Button` (render, click, disabled, loading, icons,
  className merging, variant/size classes).
- Unit tests for `Input` (render, typing, required, helper/error text,
  disabled, icons, password visibility toggle, className merging).
- `Typography` component: a single component with a `variant` prop
  (`h1`–`h6`, `body-lg/md/sm`, `caption`) mapped to typography tokens, a
  polymorphic `as` prop to control the rendered tag independently of the
  variant, `color`/`weight` props, and a `truncate` option. Unit tests
  cover default/heading/caption tag rendering, the `as` override, color and
  weight classes, truncation, className merging, and attribute forwarding.
- Responsive heading sizes for `Typography`: `h1`–`h4` scale down one step
  below `--breakpoint-md` (768px) so they don't look oversized on mobile —
  the first component to actually use the breakpoint token scale.
- `Typography` `color` prop now also accepts arbitrary CSS color values
  (hex, `rgb()`, named colors, etc.) in addition to the design-token names.
  Token names still resolve to the existing token-based classes; any other
  value is applied via inline `style` instead.

### Fixed

- `Button` and `Input` size variants and icon sizing now use spacing tokens
  (`--spacing-8/-10/-12/-4`) instead of hardcoded pixel values.
