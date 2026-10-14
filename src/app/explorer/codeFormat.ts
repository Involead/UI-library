import { transform } from "sucrase";

export type CodeLanguage = "jsx" | "tsx";

const COMPONENT_NAME = "Example";
const TYPE_IMPORT = 'import type { ReactElement } from "react";';
const HEADER_PATTERN = new RegExp(`^export function ${COMPONENT_NAME}\\(\\)(: ReactElement)? \\{$`);
const IMPORT_END = /(?:\bfrom\s+)?["'][^"']+["'];?\s*$/;

function trimBlankEdges(lines: string[]) {
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start].trim() === "") start += 1;
  while (end > start && lines[end - 1].trim() === "") end -= 1;
  return lines.slice(start, end);
}

function splitDraft(draft: string) {
  const lines = draft.replace(/\r\n/g, "\n").split("\n");
  const imports: string[] = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].trim() === "") {
      i += 1;
    } else if (lines[i].startsWith("import ")) {
      imports.push(lines[i]);
      while (!IMPORT_END.test(lines[i]) && i + 1 < lines.length) {
        i += 1;
        imports.push(lines[i]);
      }
      i += 1;
    } else {
      break;
    }
  }

  const rest = trimBlankEdges(lines.slice(i));
  let jsxStart = -1;
  for (let j = rest.length - 1; j >= 0; j -= 1) {
    if (/^<[A-Za-z>]/.test(rest[j])) {
      jsxStart = j;
      break;
    }
  }
  if (jsxStart === -1) return null;

  return {
    imports,
    setup: trimBlankEdges(rest.slice(0, jsxStart)),
    jsx: rest.slice(jsxStart),
  };
}

function buildTsx(draft: string): string {
  const parts = splitDraft(draft);
  if (!parts) return draft;

  const importBlock = [TYPE_IMPORT, ...parts.imports];
  return [
    ...importBlock,
    "",
    ...(parts.setup.length ? [...parts.setup, ""] : []),
    `export function ${COMPONENT_NAME}(): ReactElement {`,
    "  return (",
    ...parts.jsx.map((line) => (line ? `    ${line}` : line)),
    "  );",
    "}",
  ].join("\n");
}

// Removes the TypeScript syntax and keeps the JSX as written.
function stripTypes(tsx: string): string {
  try {
    const { code } = transform(tsx, {
      transforms: ["typescript", "jsx"],
      jsxRuntime: "preserve",
      disableESTransforms: true,
    });
    return code
      .replace(/^\s*import type [^\n]*\n/gm, "")
      .replace(/\): ReactElement \{/g, ") {")
      .replace(/(import \{[^}]*?),\s*\}/g, "$1 }")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } catch {
    return tsx; // unparsable text: show it unchanged
  }
}

// draft -> text shown in the editor
export function formatCode(draft: string, language: CodeLanguage): string {
  if (draft.includes(`function ${COMPONENT_NAME}(`)) return draft; // already wrapped
  const tsx = buildTsx(draft);
  return language === "tsx" ? tsx : stripTypes(tsx);
}

// TSX editor text -> original draft (removes the wrapper again)
export function unformatCode(text: string): string {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const start = lines.findIndex((line) => HEADER_PATTERN.test(line));
  const end = lines.lastIndexOf("}");

  if (
    start === -1 ||
    lines[start + 1] !== "  return (" ||
    end <= start ||
    lines[end - 1] !== "  );"
  ) {
    return text; // wrapper was edited by hand, keep the text as typed
  }

  const before = trimBlankEdges(lines.slice(0, start).filter((line) => line !== TYPE_IMPORT));
  const body = lines.slice(start + 2, end - 1).map((line) => line.replace(/^ {1,4}/, ""));

  return before.length ? [...before, "", ...body].join("\n") : body.join("\n");
}
