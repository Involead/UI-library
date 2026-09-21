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
- `Checkbox` component: a native checkbox with a custom-styled box built on
  `:checked`/`:indeterminate`/`:focus-visible`/`:disabled` selectors, a
  `size` prop (`small`/`medium`/`large`), an `indeterminate` prop (synced to
  the underlying DOM property), `label`/`helperText`/`error` props matching
  `Input`'s pattern, and a `required` indicator. Unit tests cover render,
  toggling, `defaultChecked`, indeterminate state, required indicator,
  helper/error text, disabled state, and className merging.
- `mergeRefs` utility (`packages/ui/src/utils`) for combining multiple refs
  to the same DOM node.

### Fixed

- `Button`, `Input`, and `Checkbox` now accept and forward a `ref` to their
  underlying native element (`ButtonProps`/`InputProps`/`CheckboxProps` are
  now typed via `ComponentPropsWithRef`, using React 19's support for `ref`
  as a plain prop — no `forwardRef` wrapper needed). This lets consumers use
  these components with form libraries (e.g. `react-hook-form`) and
  imperative APIs (`.focus()`, etc.) that require a DOM ref. `Checkbox`
  merges the consumer's ref with its own internal ref (used to sync the
  `indeterminate` DOM property) via the new `mergeRefs` utility. Unit tests
  added for ref forwarding on all three components.
- `Button` and `Input` size variants and icon sizing now use spacing tokens
  (`--spacing-8/-10/-12/-4`) instead of hardcoded pixel values.
