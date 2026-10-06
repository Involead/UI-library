import { useEffect, useRef, useState } from "react";
import { Icon, Input, type IconName } from "@/index";
import { icons } from "@/icons";
import { iconColors, type ExplorerArgs } from "../../explorer-config";
import { getBooleanArg, getStringArg } from "../args";
import { iconSizes, isChoice, type PreviewLayout } from "../types";
import { SvgMarkup } from "./SvgMarkup";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onClick: () => void;
};

const iconNames = Object.keys(icons) as IconName[];

// Numeric strings become px numbers; anything else ("1.5rem") passes through as a CSS length.
function toLength(value: string, fallback: number): number | string {
  if (value.trim() === "") return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

function toNumber(value: string, fallback: number): number {
  const number = Number(value);
  return value.trim() !== "" && Number.isFinite(number) ? number : fallback;
}

// Ignore spaces and hyphens so "arrowdown" and "arrow down" both match "arrow-down".
const normalize = (value: string) => value.toLowerCase().replace(/[\s-]/g, "");

export function IconPreview({ args, composition, layout, onClick }: Props) {
  const [query, setQuery] = useState("");
  const [copiedName, setCopiedName] = useState<IconName | null>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const copyIcon = async (item: IconName) => {
    try {
      await navigator.clipboard.writeText(`<Icon name="${item}" />`);
      setCopiedName(item);
      window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopiedName(null), 1600);
    } catch {
      // Clipboard unavailable (plain http) or permission denied; leave the tile unchanged.
    }
  };

  const selectedName = getStringArg(args, "name", "search");
  const name: IconName = isChoice(selectedName, iconNames) ? selectedName : "search";
  const size = toLength(getStringArg(args, "size"), 24);
  const strokeWidth = toNumber(getStringArg(args, "strokeWidth"), 2);
  const color = getStringArg(args, "color") || undefined;
  const title = getStringArg(args, "title") || undefined;
  const ariaLabel = getStringArg(args, "ariaLabel") || undefined;
  const svg = getStringArg(args, "svg");
  // Shared across every composition, so hover/disabled show up everywhere.
  const stateProps = {
    hoverColor: getStringArg(args, "hoverColor") || undefined,
    disabled: getBooleanArg(args, "disabled"),
  };
  const stackClass = `preview-stack${layout === "horizontal" ? " horizontal" : ""}`;

  if (composition === "gallery") {
    const filteredNames = iconNames.filter((item) =>
      normalize(item).includes(normalize(query)),
    );
    return (
      <div className="icon-gallery-shell">
        <Input
          type="search"
          placeholder={`Search ${iconNames.length} icons`}
          aria-label="Search icons"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          leftIcon={<Icon name="search" size={16} />}
          fullWidth
        />
        {filteredNames.length > 0 ? (
          <div className={layout === "horizontal" ? "icon-gallery" : "icon-gallery vertical"}>
            {filteredNames.map((item) => (
              <button
                key={item}
                type="button"
                className="icon-tile"
                title={`Copy <Icon name="${item}" />`}
                aria-label={`Copy ${item} icon code`}
                onClick={() => void copyIcon(item)}
              >
                <Icon name={item} size={size} strokeWidth={strokeWidth} color={color} {...stateProps} />
                <span className="icon-tile-name">{copiedName === item ? "Copied!" : item}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="icon-tile-name">No icons match &ldquo;{query}&rdquo;.</p>
        )}
        {/* One shared live region so screen readers announce only the latest copy. */}
        <span role="status" className="visually-hidden">
          {copiedName ? `Copied ${copiedName} icon code` : ""}
        </span>
      </div>
    );
  }

  if (composition === "sizes") {
    return (
      <div className={`${stackClass} icon-row`}>
        {iconSizes.map((itemSize) => (
          <div key={itemSize} className="icon-tile plain">
            <Icon name={name} size={itemSize} strokeWidth={strokeWidth} color={color} {...stateProps} />
            <span className="icon-tile-name">{itemSize}px</span>
          </div>
        ))}
      </div>
    );
  }

  if (composition === "colors") {
    return (
      <div className="preview-stack">
        <div className={`${stackClass} icon-row`}>
          {iconColors.map((itemColor) => (
            <div key={itemColor} className="icon-tile plain">
              <Icon name={name} size={size} strokeWidth={strokeWidth} color={itemColor} {...stateProps} />
              <span className="icon-tile-name">{itemColor.replace(/var\(--color-|\)/g, "")}</span>
            </div>
          ))}
        </div>
        {/* Default currentColor: the icon inherits the surrounding text color. */}
        <p className="icon-inherit">
          <Icon name="warning" size={16} />
          Inherits text color via currentColor
        </p>
      </div>
    );
  }

  return (
    <Icon
      name={name}
      size={size}
      strokeWidth={strokeWidth}
      color={color}
      title={title}
      ariaLabel={ariaLabel}
      onClick={getBooleanArg(args, "clickable") ? onClick : undefined}
      {...stateProps}
    >
      {svg ? <SvgMarkup markup={svg} /> : undefined}
    </Icon>
  );
}
