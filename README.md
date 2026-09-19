# InvoLead UI Library

InvoLead UI Library is a reusable React component and design-token library
built with Next.js, TypeScript, and Storybook. It provides consistent,
accessible building blocks for InvoLead products and keeps common interaction
patterns in one place.

This repository is an **npm-workspaces monorepo**:

```text
packages/ui/          # @involead/ui — the published component library
apps/storybook/        # Storybook + a small Next.js app that consumes @involead/ui
```

## What is included?

- **Button** - primary, secondary, outline, ghost, and danger variants; three
  sizes; loading, disabled, full-width, and icon states.
- **Input** - labels, helper and error text, validation states, common HTML
  input types, password visibility toggling, icons, and three sizes.
- **Typography** - a single `variant`-driven component (headings, body
  sizes, caption) with a polymorphic `as` prop, color and weight overrides,
  and truncation.
- **Design tokens** - shared color, spacing, radius, shadow, z-index,
  breakpoint, and typography variables in `packages/ui/src/styles`.
- **Storybook** - interactive stories and autodocs for developing and
  reviewing components in isolation.

More components (Icon, and others from the project charter) are in progress
— see `CHANGELOG.md` for what's shipped so far.

## Why use it?

Using shared components helps product teams:

- deliver a consistent visual and interaction language;
- avoid duplicating form, loading, and validation behavior;
- make accessibility improvements available across the application;
- develop UI states quickly with Storybook controls; and
- keep styling decisions centralized in reusable design tokens.

## Requirements

- Node.js 20 or newer
- npm (the repository includes `package-lock.json` and uses npm workspaces)

## Getting started

All commands below are run from the **repository root**, not from inside
`packages/ui` or `apps/storybook` — npm's `-w` workspace flag routes them to
the right place.

1. Clone the repository and enter the project directory:

   ```bash
   git clone <repository-url>
   cd temp-main
   ```

2. Install dependencies for every workspace:

   ```bash
   npm install
   ```

3. Build the component library once (the demo app's global styles import the
   compiled token CSS from `@involead/ui`, so this has to exist before the
   app or Storybook can pick up tokens):

   ```bash
   npm run build:ui
   ```

4. Start the Next.js demo app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).

## Storybook

Use Storybook to browse components, adjust props, and review states without
running the demo app:

```bash
npm run storybook
```

Open [http://localhost:6006](http://localhost:6006). Storybook reads stories
directly from `packages/ui/src`, so `npm run build:ui` isn't required first
for this command.

To create a static Storybook build:

```bash
npm run build-storybook
```

## Using the components

Consumers import from the published package name, `@involead/ui` — inside
this repo, `apps/storybook` does exactly this as a real workspace dependency
(npm symlinks it to `packages/ui`, no publish step needed for local
development):

```tsx
"use client";

import { Button, Input } from "@involead/ui";

export function ExampleForm() {
  return (
    <form>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="you@example.com"
        helperText="We will never share your email."
        fullWidth
      />

      <Button
        type="submit"
        variant="primary"
        loading={false}
      >
        Save changes
      </Button>
    </form>
  );
}
```

`Button` and `Input` are client components. Add `"use client"` to
the consuming component when it uses these components directly from a Next.js
Server Component boundary. `Typography` has no hooks or browser APIs, so it
works directly inside a Server Component.

Global styles (in a Next.js app, `app/globals.css`) load the design tokens
from the package itself:

```css
@import "@involead/ui/styles/token.css";
@import "@involead/ui/styles/typography.css";
```

### Component API overview

#### Button

| Prop | Values / type | Default |
| --- | --- | --- |
| `variant` | `primary`, `secondary`, `outline`, `ghost`, `danger` | `primary` |
| `size` | `small`, `medium`, `large` | `medium` |
| `loading` | `boolean` | `false` |
| `fullWidth` | `boolean` | `false` |
| `leftIcon`, `rightIcon` | `ReactNode` | - |

Button also accepts native `HTMLButtonElement` props such as `onClick`,
`disabled`, `aria-label`, and `type`.

#### Input

```tsx
<Input
  label="Password"
  type="password"
  error="Password is required."
  required
  onChange={(event) => console.log(event.target.value)}
/>
```

Input supports `text`, `password`, `email`, `number`, `tel`, `url`, `search`,
`date`, `datetime-local`, `time`, `month`, `week`, `color`, `file`, and
`hidden` types. It also accepts native input props such as `value`,
`defaultValue`, `onChange`, and `name`.

#### Typography

```tsx
<Typography variant="h2">Section title</Typography>
<Typography variant="body-md" color="secondary">
  Supporting paragraph text.
</Typography>
<Typography variant="h3" as="span">
  Styled like a heading, rendered as an inline span
</Typography>
```

| Prop | Values / type | Default |
| --- | --- | --- |
| `variant` | `h1`–`h6`, `body-lg`, `body-md`, `body-sm`, `caption` | `body-md` |
| `color` | `primary`, `secondary`, `tertiary`, `disabled`, `inverse`, `success`, `warning`, `error`, `info` | `primary` |
| `weight` | `regular`, `medium`, `semibold`, `bold` | variant's default |
| `truncate` | `boolean` | `false` |
| `as` | any element/component type | tag matching `variant` (e.g. `h1`→`<h1>`, `body-*`→`<p>`, `caption`→`<span>`) |

`as` only changes the rendered tag — it doesn't affect the applied styles,
which always follow `variant`. Use it to keep semantic HTML correct without
changing the visual style (e.g. one `<h1>` per page, styled as `h1` even
where a smaller heading is semantically required).

## Project structure

```text
package.json               # workspace root ("workspaces": ["packages/*", "apps/*"])
CHANGELOG.md

packages/ui/                 # @involead/ui
  package.json
  tsup.config.ts              # library build (ESM + CJS + type declarations)
  vitest.config.ts            # unit test config
  src/
    index.ts                  # public entry point
    components/                # each component: Name.tsx, Name.module.css,
                                # Name.stories.tsx, Name.test.tsx, index.ts
    styles/                     # design tokens and typography variables
    utils/

apps/storybook/               # storybook-app
  package.json
  next.config.ts
  .storybook/                  # Storybook configuration
  src/
    app/                        # Next.js demo app and global styles
    stories/                    # Introduction.mdx and other standalone docs
```

Full contribution rules (how to add a component, styling/token conventions,
testing requirements, responsive rules) live in Storybook's **Introduction**
page (`apps/storybook/src/stories/Introduction.mdx`) — read that before
adding or modifying a component; this README stays focused on setup and
usage.

## Available scripts

Run from the repository root:

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies for every workspace |
| `npm run dev` | Start the Next.js demo app (`apps/storybook`) |
| `npm run build:ui` | Build `@involead/ui` (`packages/ui/dist`) |
| `npm run storybook` | Start Storybook on port 6006 |
| `npm run build-storybook` | Build a static Storybook site |
| `npm run test` | Run `@involead/ui`'s unit tests (Vitest) |
| `npm run lint` | Run ESLint across every workspace |

Before opening a pull request, run `npm run test`, `npm run lint`, and the
relevant Storybook build. Add or update a story and a unit test when
changing a component's visual states or public behavior.

## Contributing

1. Create a branch for your change.
2. Update the component, styles, stories, and unit tests together when
   behavior changes (see Storybook's Introduction page for the full rules).
3. Run `npm run test`, `npm run lint`, and `npm run build:ui`.
4. Ensure keyboard, disabled, and error states remain usable.
5. Add an entry to `CHANGELOG.md` under `[Unreleased]`.
6. Open a pull request describing the change and its user-facing impact.
