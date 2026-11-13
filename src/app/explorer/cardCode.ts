import type { ExplorerArgs } from "../explorer-config";


export function formatCardCode(args: ExplorerArgs): string {
  const title = getStringArg(args, "title", "Project Alpha");
  const description = getStringArg(args, "description", "Created 2 days ago");
  const withMedia = args.withMedia === true;
  const withAction = args.withAction === true;
  const withFooter = args.withFooter === true;
  const interactive = args.interactive === true;

  const cardProps = [`  style={{ width: 340 }}`];
  if (interactive) cardProps.push(`  interactive\n  onClick={() => alert("Clicked")}`);

  const mediaCode = withMedia ? `  <CardMedia src="..." aspectRatio="16/9" />\n` : "";

  const actionCode = withAction
    ? ` action={<Button variant="ghost" size="small"><Icon name="settings" size={16} /></Button>}`
    : "";

  const footerCode = withFooter
    ? `  <CardFooter>\n    <Button variant="ghost" size="small">Cancel</Button>\n    <Button variant="primary" size="small">Save</Button>\n  </CardFooter>\n`
    : "";

  return `import { Card, CardHeader, CardBody, CardFooter${withMedia ? ", CardMedia" : ""}, Button, Icon, Typography } from "@involead/ui";
import "@involead/ui/ui.css";

<Card
${cardProps.join("\n")}
>
${mediaCode}  <CardHeader
    title="${title}"
    description="${description}"${actionCode}
  />
  <CardBody>
    <Typography variant="body" color="secondary">
      This is the card body content.
    </Typography>
  </CardBody>
${footerCode}</Card>`;
}

// Helper since we can't import it directly in this scope
function getStringArg(args: ExplorerArgs, key: string, fallback: string): string {
  const val = args[key];
  return typeof val === "string" ? val : fallback;
}
