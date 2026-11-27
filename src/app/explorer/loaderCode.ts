import type { ExplorerArgs } from "../explorer-config";

function getString(args: ExplorerArgs, key: string, fallback = ""): string {
  return typeof args[key] === "string" ? args[key] : fallback;
}

export function formatLoaderCode(args: ExplorerArgs, composition?: string): string {
  const variant = getString(args, "variant", "spinner");
  const size = args.size !== undefined ? Number(args.size) : 50;
  const label = getString(args, "label", "Loading");
  const progress = args.progress !== undefined ? Number(args.progress) : undefined;

  /* ---------- Composition: sizes ---------- */
  if (composition === "sizes") {
    return `import { Loader } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Loader variant="${variant}" size={50} />
  <Loader variant="${variant}" size={60} />
  <Loader variant="${variant}" size={70} />
</>`;
  }

  /* ---------- Composition: variants ---------- */
  if (composition === "variants") {
    return `import { Loader } from "@involead/ui";
import "@involead/ui/ui.css";

<>
  <Loader variant="spinner" />
  <Loader variant="progress" />
  <Loader variant="progress" progress={1} />
</>`;
  }

  /* ---------- Default ---------- */
  const props: string[] = [];
  if (variant !== "spinner") props.push(`  variant="${variant}"`);
  if (size !== 160) props.push(`  size={${size}}`);
  if (label !== "Loading") props.push(`  label="${label}"`);
  if (variant === "progress" && progress !== undefined) {
    props.push(`  progress={${progress}}`);
  }

  return `import { Loader } from "@involead/ui";
import "@involead/ui/ui.css";

<Loader
${props.length ? props.join("\n") : "  // defaults"}
/>`;
}