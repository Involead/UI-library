import { render, screen } from "@testing-library/react";

import { Typography } from "./Typography";

describe("Typography", () => {
  it("renders a <p> by default", () => {
    render(<Typography>Hello</Typography>);

    const element = screen.getByText("Hello");
    expect(element.tagName).toBe("P");
  });

  it("renders the semantic tag matching each heading variant", () => {
    const variants = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

    for (const variant of variants) {
      const { unmount } = render(
        <Typography variant={variant}>{variant}</Typography>,
      );

      expect(screen.getByText(variant).tagName).toBe(
        variant.toUpperCase(),
      );
      unmount();
    }
  });

  it("renders a <span> for the caption variant", () => {
    render(<Typography variant="caption">Caption text</Typography>);

    expect(screen.getByText("Caption text").tagName).toBe("SPAN");
  });

  it("lets the as prop override the rendered element independently of variant", () => {
    render(
      <Typography
        variant="h3"
        as="span"
      >
        Styled like h3, not one semantically
      </Typography>,
    );

    const element = screen.getByText(
      "Styled like h3, not one semantically",
    );
    expect(element.tagName).toBe("SPAN");
    expect(element.className).toContain("h3");
  });

  it("applies the color and variant as data-driven classes", () => {
    render(
      <Typography
        variant="body-lg"
        color="error"
      >
        Error message
      </Typography>,
    );

    const element = screen.getByText("Error message");
    expect(element.className).toContain("body-lg");
    expect(element.className).toContain("error");
  });

  it("applies a weight override class when provided", () => {
    render(
      <Typography
        variant="body-md"
        weight="bold"
      >
        Bold body text
      </Typography>,
    );

    expect(screen.getByText("Bold body text").className).toContain(
      "bold",
    );
  });

  it("applies the truncate class when truncate is set", () => {
    render(<Typography truncate>Truncated text</Typography>);

    expect(screen.getByText("Truncated text").className).toContain(
      "truncate",
    );
  });

  it("merges a custom className with the base classes", () => {
    render(
      <Typography className="custom-class">Custom class text</Typography>,
    );

    expect(screen.getByText("Custom class text")).toHaveClass(
      "custom-class",
    );
  });

  it("forwards native element attributes", () => {
    render(<Typography id="greeting">Hi</Typography>);

    expect(screen.getByText("Hi")).toHaveAttribute("id", "greeting");
  });
});
