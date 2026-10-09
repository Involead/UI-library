import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  cloneElement,
  isValidElement,
  useState,
  type CSSProperties,
} from "react";

import { Button } from "@/components/Button";
import { Typography } from "@/components/Typography";

import { Modal } from "./";

/* =========================
   META
   ========================= */

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    open: false,
    onClose: () => {},
    maxWidth: "xs",
    fullScreen: false,
    scroll: "paper",
    disableEscapeKeyDown: false,
    disableBackdropClick: false,
  },
  argTypes: {
    maxWidth: {
      control: "select",
      options: ["xs", "sm", "md", "lg", "xl", false],
    },
    fullScreen: { control: "boolean" },
    scroll: {
      control: "select",
      options: ["paper", "body"],
    },
    disableEscapeKeyDown: { control: "boolean" },
    disableBackdropClick: { control: "boolean" },
    open: { control: "boolean" },
    onClose: { action: "closed" },
  },
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof meta>;
type ModalArgs = React.ComponentProps<typeof Modal>;

/* =========================
   SHARED STYLES
   ========================= */

const headerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: "16px 24px",
  flex: "0 0 auto",
};

// scroll="paper": header/footer stay pinned, only the body scrolls.
const bodyStyle: CSSProperties = {
  padding: "0 24px 16px",
  flex: "1 1 auto",
  overflowY: "auto",
};

// scroll="body": no inner scrolling, the whole panel scrolls instead.
const bodyStyleScrollWhole: CSSProperties = {
  padding: "0 24px 16px",
};

const footerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 8,
  padding: "12px 24px 16px",
  borderTop: "1px solid #e5e7eb",
  flex: "0 0 auto",
};

/* =========================
   SHARED CONTENT
   ========================= */

interface ModalContentProps {
  title?: string;
  body?: string;
  onClose?: () => void;
  /** Disable inner body scrolling so the entire panel scrolls (use with scroll="body"). */
  scrollWhole?: boolean;
}

function ModalContent({
  title = "Modal title",
  body = "This is the modal body. Add any content you like — text, forms, tables, or other components.",
  onClose,
  scrollWhole = false,
}: ModalContentProps) {
  // Split on double-newline so numbered paragraphs render one per block.
  const paragraphs = body.split("\n\n");

  return (
    <>
      <div style={headerStyle}>
        <Typography variant="h6" as="h2">
          {title}
        </Typography>
        <Button variant="ghost" size="small" aria-label="Close" onClick={onClose}>
          ✕
        </Button>
      </div>

      <div style={scrollWhole ? bodyStyleScrollWhole : bodyStyle}>
        {paragraphs.map((p, i) => (
          <Typography
            key={i}
            variant="body"
            color="secondary"
            style={{ marginBottom: 12 }}
          >
            {p}
          </Typography>
        ))}
      </div>

      <div style={footerStyle}>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onClose}>
          Confirm
        </Button>
      </div>
    </>
  );
}

/* =========================
   INTERACTIVE WRAPPER
   ========================= */

// The Docs page renders every story at once. Track the currently open story
// modal so opening a new one closes the previous one (one open at a time).
let closeActiveModal: (() => void) | null = null;

const InteractiveModal = (args: ModalArgs) => {
  const [open, setOpen] = useState(args.open);
  const [prevArgOpen, setPrevArgOpen] = useState(args.open);

  const close = () => setOpen(false);
  const openModal = () => {
    closeActiveModal?.();
    closeActiveModal = close;
    setOpen(true);
  };

  // Keep local state in sync with the Controls panel's `open` toggle.
  // Adjusting state during render (instead of in an effect) avoids the extra
  // cascading render: https://react.dev/learn/you-might-not-need-an-effect
  if (args.open !== prevArgOpen) {
    setPrevArgOpen(args.open);
    setOpen(args.open);
  }

  return (
    <>
      <Button onClick={openModal}>Open modal</Button>
      {/* Mount only while open so closed stories never render anything on the Docs page */}
      {open && (
        <Modal
          {...args}
          open
          onClose={() => {
            close();
            args.onClose?.(null, "closeClick");
          }}
        >
          {isValidElement<ModalContentProps>(args.children) ? (
            cloneElement(args.children, { onClose: close })
          ) : (
            <ModalContent onClose={close} />
          )}
        </Modal>
      )}
    </>
  );
};

/* Source snippet helper — used by every story's docs.source.code */
function modalSource(extraProps = "") {
  return `const [open, setOpen] = useState(true);

<>
  <Button onClick={() => setOpen(true)}>Open modal</Button>

  <Modal
    open={open}
    onClose={() => setOpen(false)}
    maxWidth="xs"${extraProps}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "16px 24px" }}>
      <Typography variant="h6" as="h2">Modal title</Typography>
      <Button variant="ghost" size="small" aria-label="Close" onClick={() => setOpen(false)}>✕</Button>
    </div>

    <div style={{ padding: "0 24px 16px", flex: "1 1 auto", overflowY: "auto" }}>
      <Typography variant="body" color="secondary">This is the modal body.</Typography>
    </div>

    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "12px 24px 16px", borderTop: "1px solid #e5e7eb" }}>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="primary" onClick={() => setOpen(false)}>Confirm</Button>
    </div>
  </Modal>
</>`;
}

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  render: (args) => <InteractiveModal {...args} />,
  parameters: {
    docs: { source: { code: modalSource() } },
  },
};

/* =========================
   STATES
   ========================= */

export const FullScreen: Story = {
  args: { fullScreen: true },
  render: (args) => <InteractiveModal {...args} />,
  parameters: {
    docs: { source: { code: modalSource(`\n    fullScreen`) } },
  },
};

export const NoEscClose: Story = {
  args: { disableEscapeKeyDown: true },
  render: (args) => <InteractiveModal {...args} />,
  parameters: {
    docs: { source: { code: modalSource(`\n    disableEscapeKeyDown`) } },
  },
};

export const NoBackdropClose: Story = {
  args: { disableBackdropClick: true },
  render: (args) => <InteractiveModal {...args} />,
  parameters: {
    docs: { source: { code: modalSource(`\n    disableBackdropClick`) } },
  },
};

/* =========================
   CONTENT VARIATIONS
   ========================= */

export const CustomWidth: Story = {
  args: { width: 720 },
  render: (args) => <InteractiveModal {...args} />,
  parameters: {
    docs: { source: { code: modalSource(`\n    width={720}`) } },
  },
};

export const FitContent: Story = {
  args: { maxWidth: false },
  render: (args) => <InteractiveModal {...args} />,
  parameters: {
    docs: { source: { code: modalSource(`\n    maxWidth={false}`) } },
  },
};

export const LongBody: Story = {
  args: {
    children: (
      <ModalContent
        title="Scrollable body"
        body={Array.from(
          { length: 30 },
          (_, i) =>
            `${i + 1}. This paragraph is here to show how the modal handles long content. The header and footer stay pinned while only the body scrolls.`,
        ).join("\n\n")}
        onClose={() => {}}
      />
    ),
  },
  render: (args) => <InteractiveModal {...args} />,
  parameters: {
    docs: { source: { code: modalSource() } },
  },
};

export const ScrollBody: Story = {
  args: {
    scroll: "body",
    children: (
      <ModalContent
        scrollWhole
        title="Scroll the whole panel"
        body={Array.from(
          { length: 30 },
          (_, i) =>
            `${i + 1}. With scroll="body", the entire panel scrolls — including the header and the footer. Watch the title disappear as you scroll down.`,
        ).join("\n\n")}
        onClose={() => {}}
      />
    ),
  },
  render: (args) => <InteractiveModal {...args} />,
  parameters: {
    docs: { source: { code: modalSource(`\n    scroll="body"`) } },
  },
};