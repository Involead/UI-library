import { Typography } from "@/index";
import type { ExplorerArgs } from "../../explorer-config";
import { getStringArg } from "../args";
import {
  isChoice,
  typographyColors,
  typographyElements,
  typographyVariants,
  type PreviewLayout,
  type TypographyColor,
  type TypographyElement,
  type TypographyVariant,
} from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
};

export function TypographyPreview({ args, composition, layout }: Props) {
  const selectedVariant = getStringArg(args, "variant", "body");
  const variant: TypographyVariant = isChoice(selectedVariant, typographyVariants)
    ? selectedVariant
    : "body";
  const selectedColor = getStringArg(args, "color", "primary");
  const color: TypographyColor = isChoice(selectedColor, typographyColors)
    ? selectedColor
    : "primary";
  const selectedElement = getStringArg(args, "as");
  const as: TypographyElement | undefined = isChoice(selectedElement, typographyElements)
    ? selectedElement
    : undefined;
  const stackClass = `preview-stack${layout === "horizontal" ? " horizontal" : ""}`;

  if (composition === "all" || composition === "headings") {
    const variants: TypographyVariant[] =
      composition === "headings"
        ? ["h1", "h2", "h3", "h4", "h5", "h6"]
        : typographyVariants;
    return (
      <div className={stackClass}>
        {variants.map((item) => (
          <Typography key={item} variant={item} color={color}>
            {item === "body" || item === "bodySmall"
              ? "The quick brown fox jumps over the lazy dog."
              : item === "label"
                ? "Email address"
                : item === "caption"
                  ? "Last updated 2 hours ago"
                  : `Heading ${item.slice(1)}`}
          </Typography>
        ))}
      </div>
    );
  }

  if (composition === "colors") {
    return (
      <div className={stackClass}>
        {typographyColors.map((item) => (
          <Typography key={item} variant={variant} color={item}>
            {item[0].toUpperCase() + item.slice(1)} text color
          </Typography>
        ))}
      </div>
    );
  }

  return (
    <Typography variant={variant} color={color} as={as}>
      {getStringArg(args, "children")}
    </Typography>
  );
}
