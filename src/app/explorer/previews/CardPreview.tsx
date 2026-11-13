"use client";

import { Card, CardHeader, CardBody, CardFooter, CardMedia, Button, Icon, Typography} from "@/index";
import type { ExplorerArgs } from "../../explorer-config";
import { getStringArg } from "../args";
import { isChoice, type PreviewLayout } from "../types";

type Props = {
  args: ExplorerArgs;
  composition?: string;
  layout: PreviewLayout;
  onChange: (value: string) => void;
};

const containerStyle = {
  display: "flex",
  flexWrap: "wrap" as const,
  gap: 24,
  padding: 40,
  justifyContent: "center" as const,
  width: "100%",
};

export function CardPreview({ args, composition }: Props) {
  const title = getStringArg(args, "title", "Project Alpha");
  const description = getStringArg(args, "description", "Created 2 days ago");
  const withMedia = args.withMedia === true;
  const withFooter = args.withFooter === true;
  const withAction = args.withAction === true;
  const interactive = args.interactive === true;

  const renderCard = () => (
    <Card 
      style={{ width: 340 }} 
      interactive={interactive}
      onClick={interactive ? () => alert("Card clicked!") : undefined}
    >
      {withMedia && (
        <CardMedia 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500&=50" 
          alt="Workspace" 
          aspectRatio="16/9"
        />
      )}
      
      <CardHeader 
        title={title} 
        description={description}
        action={
          withAction ? (
            <Button variant="ghost" size="small" aria-label="Settings">
              <Icon name="settings" size={16} />
            </Button>
          ) : undefined
        }
      />
      
      <CardBody>
        <Typography variant="body" color="secondary">
          This is the card body content. You can put anything here: text, forms, tables, or lists.
        </Typography>
      </CardBody>
      
      {withFooter && (
        <CardFooter>
          <Button variant="ghost" size="small">Cancel</Button>
          <Button variant="primary" size="small">Save</Button>
        </CardFooter>
      )}
    </Card>
  );


  return (
    <div style={containerStyle}>
      {renderCard()}
    </div>
  );
}