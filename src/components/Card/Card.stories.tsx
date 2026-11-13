import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { Typography } from "@/components/Typography";

import { Card, CardHeader, CardBody, CardFooter, CardMedia } from "./";

/* =========================
   META
   ========================= */

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    interactive: false,
  },
  argTypes: {
    interactive: { control: "boolean" },
  },
} as Omit<Meta<typeof Card>, "args"> & {
  args: Partial<React.ComponentProps<typeof Card>>;
};

export default meta;

type Story = StoryObj<typeof meta>;

/* =========================
   SHARED DATA
   ========================= */

const imageUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80";
const avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&q=80";
const codeUrl = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80";

/* =========================
   BASIC
   ========================= */

export const Default: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardHeader
        title="Project Alpha"
        description="Created 2 days ago"
      />
      <CardBody>
        <Typography variant="body" color="secondary">
          This is a standard card layout. It uses the compound API to
          structure the header, body, and footer cleanly.
        </Typography>
      </CardBody>
      <CardFooter>
        <Button variant="ghost" size="small">Cancel</Button>
        <Button variant="primary" size="small">View Project</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardHeader
        title="Notifications"
        description="You have 3 unread messages"
        action={
          <Button variant="ghost" size="small" aria-label="Settings">
            <Icon name="settings" size={16} />
          </Button>
        }
      />
      <CardBody>
        <Typography variant="body" color="secondary">
          Check your inbox to see the latest updates.
        </Typography>
      </CardBody>
    </Card>
  ),
};

export const WithMedia: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardMedia src={imageUrl} alt="Workspace" aspectRatio="16/9" />
      <CardHeader
        title="Design System"
        description="A guide to scalable UI"
      />
      <CardBody>
        <Typography variant="body" color="secondary">
          Learn how to architect, build, and document a component library from scratch.
        </Typography>
      </CardBody>
      <CardFooter>
        <Button variant="primary" size="small">Read Article</Button>
      </CardFooter>
    </Card>
  ),
};

export const Minimal: Story = {
  render: (args) => (
    <Card {...args} style={{ width: 340 }}>
      <CardBody>
        <Typography variant="body" color="secondary">
          A minimal card with only a body. Ideal for simple metric widgets or
          dashboard summary blocks.
        </Typography>
      </CardBody>
    </Card>
  ),
};

/* =========================
   REAL-WORLD EXAMPLES
   ========================= */

export const ProfileCard: Story = {
  name: "Profile Card",
  render: (args) => (
    <Card {...args} style={{ width: 320 }}>
      <CardMedia src={avatarUrl} alt="Alex Johnson" aspectRatio="1/1" />
      <CardBody>
        <Typography variant="h6" as="h3" style={{ margin: "0 0 4px" }}>
          Alex Johnson
        </Typography>
        <Typography variant="bodySmall" color="secondary" style={{ marginBottom: 16 }}>
          Senior Product Designer at InvoLead.
        </Typography>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="primary" size="small" style={{ flex: 1 }}>
            Follow
          </Button>
          <Button variant="outline" size="small" style={{ flex: 1 }}>
            Message
          </Button>
        </div>
      </CardBody>
    </Card>
  ),
};

export const HorizontalCard: Story = {
  name: "Horizontal Article",
  render: (args) => (
    <Card {...args} style={{ display: "flex", flexDirection: "row", width: 400, height: "fit-content" }}>
      <div style={{ width: 140, flexShrink: 0 }}>
        <CardMedia 
          src={codeUrl} 
          alt="Code on a screen" 
          aspectRatio="1/1" 

        />
      </div>
      <CardBody>
        <Typography 
          variant="label" 
          color="primary" 
          style={{ textTransform: "uppercase", letterSpacing: 1, fontSize: 10 }}
        >
          Engineering
        </Typography>
        <Typography 
          variant="h6" 
          as="h4" 
          style={{ margin: "8px 0", fontSize: 15, lineHeight: 1.3 }}
        >
          How we built the InvoLead Design System
        </Typography>
        <Typography variant="caption" color="tertiary">
          5 min read
        </Typography>
      </CardBody>
    </Card>
  ),
};

/* =========================
   LAYOUT GALLERY
   ========================= */

export const AllLayouts: Story = {
  name: "All layouts",
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 32, justifyContent: "center", maxWidth: 1200 }}>
      
      <Card style={{ width: 300 }}>
        <CardMedia src={imageUrl} alt="Workspace" aspectRatio="16/9" />
        <CardHeader title="Full Card" description="Media + Header + Footer" action={<Icon name="settings" size={16} />} />
        <CardBody><Typography variant="body" color="secondary">Complete layout with image and actions.</Typography></CardBody>
        <CardFooter><Button variant="primary" size="small">View</Button></CardFooter>
      </Card>

      <Card style={{ width: 300 }}>
        <CardBody>
          <Typography variant="body" color="secondary">
            Minimal card with just a body. Good for simple content blocks, dashboard widgets, or metrics.
          </Typography>
        </CardBody>
      </Card>

      <Card interactive style={{ width: 300 }}>
        <CardHeader title="Interactive" description="Hover or Tab to focus" />
        <CardBody><Typography variant="body" color="secondary">This card has role=&quot;button&quot; and responds to clicks.</Typography></CardBody>
      </Card>

    </div>
  ),
};