# Contributing, Code Review, and Release Process

## Ownership

Product teams may propose changes and open pull requests. The core UI team owns merges and releases. Lopamudra Sahoo provides final approval for visual changes and breaking API changes.

## Making a component change

1. Confirm that the requirement is a reusable UI pattern rather than application-specific business logic.
2. Discuss the public API, accessibility behavior, design-token usage, and compatibility impact before implementation.
3. Update the component implementation, scoped styles, Storybook story, tests, and usage documentation together.
4. Keep the public export in `src/index.ts` deliberate; do not expose internal implementation details.
5. Add a changelog entry for a public behavior or API change.

For interactive components, verify the client boundary and test keyboard, focus, disabled, loading, error, and empty states as applicable.

## Local development

Install dependencies and start the example application:

```bash
npm install
npm run dev
```

Run Storybook for component development and visual review:

```bash
npm run storybook
```

The application is available at `http://localhost:3000` and Storybook at `http://localhost:6006`.

## Validation before review

Run the focused checks locally:

```bash
npm run lint
npm run typecheck
npm run test
npm run build:package
npm run build-storybook
```

Review the generated `dist/` output and confirm that only intended package artifacts are included. Do not publish source archives containing credentials, internal screenshots, product data, or proprietary documentation.

## Pull request and code review flow

```text
Requirement
    ↓
Component/API discussion
    ↓
Implementation + tests + Storybook
    ↓
Accessibility and visual review
    ↓
Pull request
    ↓
CI: lint → typecheck → tests → package build → Storybook build
    ↓
Core UI team review and approval
    ↓
Merge
```

Every pull request should explain the behavior change, include screenshots or Storybook references for visual changes, identify accessibility considerations, and describe migration impact. Breaking changes require explicit approval, migration guidance, a changelog entry, and a major version.

## Versioning

Use Semantic Versioning:

- **PATCH:** backward-compatible bug fixes.
- **MINOR:** backward-compatible features.
- **MAJOR:** breaking API or behavior changes.

Releases are intended to follow a regular monthly cadence. Changesets or the equivalent release tooling should be used when enabled by the repository CI configuration.

## Build and publish

Confirm the package version and current npm identity:

```bash
npm pkg get name version
npm whoami
```

Build the package:

```bash
npm run build:package
```

For the current public npm configuration, publish the built package with:

```bash
npm publish --access public
```

Verify the release:

```bash
npm view @involead/ui version
```

The long-term architecture calls for an InvoLead-approved private registry. Use the approved registry and its protected credentials when that infrastructure is configured; do not put registry tokens in source control or commit npm configuration containing credentials. Publishing must occur only after all CI quality gates pass, using provenance or equivalent publishing security where supported.

## Consumer verification

In a representative Next.js consumer:

```bash
npm install @involead/ui
```

Then verify a client component import and the bundled stylesheet:

```tsx
"use client";

import { Button } from "@involead/ui";
import "@involead/ui/ui.css";
```

Check rendering, server/client boundaries, SSR and hydration behavior, CSS loading, and TypeScript IntelliSense before considering a release complete.

