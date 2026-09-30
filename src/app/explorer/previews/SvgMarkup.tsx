import { useMemo } from "react";

type Props = {
  /** `<svg>…</svg>` as typed in the code panel: JSX or plain SVG attribute syntax. */
  markup: string;
};

// JSX spells these in camelCase; the SVG parser only knows the kebab-case names.
const JSX_TO_SVG_ATTRIBUTES: Record<string, string> = {
  className: "class",
  clipPath: "clip-path",
  clipRule: "clip-rule",
  fillOpacity: "fill-opacity",
  fillRule: "fill-rule",
  stopColor: "stop-color",
  stopOpacity: "stop-opacity",
  strokeDasharray: "stroke-dasharray",
  strokeDashoffset: "stroke-dashoffset",
  strokeLinecap: "stroke-linecap",
  strokeLinejoin: "stroke-linejoin",
  strokeMiterlimit: "stroke-miterlimit",
  strokeOpacity: "stroke-opacity",
  strokeWidth: "stroke-width",
  xlinkHref: "href",
};

function jsxToSvg(markup: string) {
  return markup
    // attr={2} / attr={"x"} → attr="2" / attr="x"
    .replace(/(\s[\w:-]+)=\{\s*(?:"([^"]*)"|'([^']*)'|(-?[\d.]+))\s*\}/g,
      (_, name: string, double?: string, single?: string, number?: string) =>
        `${name}="${double ?? single ?? number}"`)
    .replace(/(\s)([a-zA-Z]+)(?==)/g, (match, space: string, name: string) =>
      JSX_TO_SVG_ATTRIBUTES[name] ? `${space}${JSX_TO_SVG_ATTRIBUTES[name]}` : match);
}

/** Parses, sanitizes and re-serializes the markup; `null` if it isn't a valid svg. */
function toSafeSvg(markup: string): string | null {
  if (typeof DOMParser === "undefined") return null;

  let source = jsxToSvg(markup.trim());
  if (!/^<svg\b[^>]*\sxmlns=/.test(source)) {
    source = source.replace(/^<svg\b/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const doc = new DOMParser().parseFromString(source, "image/svg+xml");
  const svg = doc.documentElement;
  if (svg.nodeName !== "svg" || doc.getElementsByTagName("parsererror").length > 0) {
    return null;
  }

  // Code-panel input is untrusted: drop anything that can run script.
  svg.querySelectorAll("script, foreignObject").forEach((node) => node.remove());
  for (const element of [svg, ...Array.from(svg.querySelectorAll("*"))]) {
    for (const attribute of Array.from(element.attributes)) {
      const isHandler = attribute.name.toLowerCase().startsWith("on");
      const isScriptUrl =
        /href$/i.test(attribute.name) && /^\s*javascript:/i.test(attribute.value);
      if (isHandler || isScriptUrl) element.removeAttribute(attribute.name);
    }
  }

  return new XMLSerializer().serializeToString(svg);
}

/** Renders svg markup typed in the code panel, scaled to fill its Icon. */
export function SvgMarkup({ markup }: Props) {
  const safeSvg = useMemo(() => toSafeSvg(markup), [markup]);

  if (safeSvg === null) {
    return (
      <span className="icon-markup-error" role="alert" title="This svg couldn't be parsed">
        !
      </span>
    );
  }

  return (
    <span
      className="icon-markup"
      // Sanitized in toSafeSvg: no scripts, event handlers or javascript: URLs.
      dangerouslySetInnerHTML={{ __html: safeSvg }}
    />
  );
}
