
import { type ReactNode } from "react";
import {
  Notification,
  type NotificationColor,
  type NotificationVariant,
  Icon,
} from "@/index";

import { getBooleanArg, getStringArg } from "../args";
import { isChoice, type PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onClick: () => void;
};

type ExplorerArgs = import("../../explorer-config").ExplorerArgs;

const colorOptions: NotificationColor[] = [
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info",
  "default",
];

const variantOptions: NotificationVariant[] = ["standard", "dot"];
const verticalOptions = ["top", "bottom"] as const;
const horizontalOptions = ["left", "right"] as const;

function toNumber(value: string, fallback: number): number {
  const n = Number(value);
  return value.trim() !== "" && Number.isFinite(n) ? n : fallback;
}

function toContent(value: string): ReactNode {
  if (value.trim() === "") return undefined;

  const n = Number(value);

  return Number.isFinite(n) && /^\d+$/.test(value) ? n : value;
}

function SampleChild({
  shape = "square",
}: {
  shape?: "square" | "circle";
}) {
  return (
    <span
      className="notification-sample-child"
      style={{
        display: "grid",
        placeItems: "center",
        width: 40,
        height: 40,
        borderRadius:
          shape === "circle"
            ? "var(--radius-full)"
            : "var(--radius-lg)",
        background:
          shape === "circle"
            ? "var(--color-primary)"
            : "var(--color-surface)",
        border: "1px solid var(--color-border)",
        color:
          shape === "circle"
            ? "var(--color-text-inverse)"
            : "var(--color-text-secondary)",
        fontWeight:
          shape === "circle"
            ? "var(--font-weight-semibold)"
            : undefined,
      }}
    >
      <Icon name="mail" size={18} />
    </span>
  );
}

function PreviewCell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="notification-preview-cell">
      <div className="notification-preview-demo">
        {children}
      </div>

      <span className="preview-caption">{label}</span>
    </div>
  );
}

export function NotificationPreview({
  args,
  composition,
}: Props) {
  const rawVariant = getStringArg(args, "variant") || "standard";

  const variant: NotificationVariant = isChoice(
    rawVariant,
    variantOptions,
  )
    ? rawVariant
    : "standard";

  const rawColor = getStringArg(args, "color") || "default";

  const color: NotificationColor = isChoice(
    rawColor,
    colorOptions,
  )
    ? rawColor
    : "default";

  const content = toContent(getStringArg(args, "content"));
  const max = toNumber(getStringArg(args, "max"), 99);

  const rawOverlap = getStringArg(args, "overlap") || "rectangular";
  const overlap =
    rawOverlap === "circular" ? "circular" : "rectangular";

  const rawVertical =
    getStringArg(args, "anchorOrigin.vertical") || "top";

  const vertical = isChoice(rawVertical, [...verticalOptions])
    ? rawVertical
    : "top";

  const rawHorizontal =
    getStringArg(args, "anchorOrigin.horizontal") || "right";

  const horizontal = isChoice(rawHorizontal, [...horizontalOptions])
    ? rawHorizontal
    : "right";

  const invisible = getBooleanArg(args, "invisible");
  const showZero = getBooleanArg(args, "showZero");
  const hasChild = args.children !== false;

  const shared = {
    content,
    max,
    color,
    variant,
    overlap,
    anchorOrigin: { vertical, horizontal },
    invisible,
    showZero,
  } as const;

  const styles = (
    <style>{`
      .notification-preview {
        width: 100%;
        box-sizing: border-box;
        padding: 24px;
      }

      .notification-preview-row {
        display: flex;
        align-items: stretch;
        justify-content: center;
        flex-wrap: wrap;
        gap: 20px;
        width: 100%;
      }

      .notification-preview-cell {
        display: flex;
        flex: 1 1 100px;
        min-width: 90px;
        max-width: 150px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
        padding: 20px 12px;
        box-sizing: border-box;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        background: var(--color-surface);
      }

      .notification-preview-demo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 64px;
      }

      .notification-preview .preview-caption {
        font-size: 12px;
        font-weight: var(--font-weight-medium);
        color: var(--color-text-secondary);
        text-align: center;
        text-transform: capitalize;
        line-height: 1.4;
      }

      .notification-preview-default {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 120px;
      }

      @media (max-width: 600px) {
        .notification-preview {
          padding: 16px;
        }

        .notification-preview-row {
          gap: 12px;
        }

        .notification-preview-cell {
          flex: 1 1 85px;
          min-width: 85px;
          padding: 16px 8px;
        }
      }
    `}</style>
  );

  if (composition === "colors") {
    return (
      <>
        {styles}
        <div className="notification-preview">
          <div className="notification-preview-row">
            {colorOptions
              .filter((c) => c !== "info")
              .map((c) => (
                <PreviewCell key={c} label={c}>
                  <Notification {...shared} color={c}>
                    <SampleChild />
                  </Notification>
                </PreviewCell>
              ))}
          </div>
        </div>
      </>
    );
  }

  if (composition === "states") {
    return (
      <>
        {styles}
        <div className="notification-preview">
          <div className="notification-preview-row">
            <PreviewCell label="99">
              <Notification content={99} max={99} color="primary">
                <SampleChild />
              </Notification>
            </PreviewCell>

            <PreviewCell label="150 → 99+">
              <Notification content={150} max={99} color="primary">
                <SampleChild />
              </Notification>
            </PreviewCell>

            <PreviewCell label="showZero">
              <Notification content={0} color="primary" showZero>
                <SampleChild />
              </Notification>
            </PreviewCell>

            <PreviewCell label="invisible">
              <Notification content={4} color="primary" invisible>
                <SampleChild />
              </Notification>
            </PreviewCell>

            <PreviewCell label="dot">
              <Notification variant="dot" color="success">
                <SampleChild />
              </Notification>
            </PreviewCell>
          </div>
        </div>
      </>
    );
  }

  if (composition === "placements") {
    return (
      <>
        {styles}
        <div className="notification-preview">
          <div className="notification-preview-row">
            {verticalOptions.flatMap((v) =>
              horizontalOptions.map((h) => (
                <PreviewCell
                  key={`${v}-${h}`}
                  label={`${v} ${h}`}
                >
                  <Notification
                    content={4}
                    color="error"
                    anchorOrigin={{
                      vertical: v,
                      horizontal: h,
                    }}
                  >
                    <SampleChild />
                  </Notification>
                </PreviewCell>
              )),
            )}
          </div>
        </div>
      </>
    );
  }

  if (composition === "sizes") {
    return (
      <>
        {styles}
        <div className="notification-preview">
          <div className="notification-preview-row">
            <PreviewCell label="standalone">
              <Notification content={4} color="primary" />
            </PreviewCell>

            <PreviewCell label="100 → 99+">
              <Notification content={100} color="error" max={99} />
            </PreviewCell>

            <PreviewCell label="dot">
              <Notification variant="dot" color="success" />
            </PreviewCell>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {styles}
      <div className="notification-preview notification-preview-default">
        <Notification {...shared}>
          {hasChild ? (
            <SampleChild
              shape={overlap === "circular" ? "circle" : "square"}
            />
          ) : undefined}
        </Notification>
      </div>
    </>
  );
}
