import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "./Checkbox";

describe("Checkbox", () => {
  it("renders a labeled checkbox", () => {
    render(<Checkbox label="Accept terms" />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  it("toggles checked state on click", async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept terms" />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("respects defaultChecked", () => {
    render(
      <Checkbox
        label="Subscribe"
        defaultChecked
      />,
    );

    expect(
      screen.getByRole("checkbox", { name: "Subscribe" }),
    ).toBeChecked();
  });

  it("sets the indeterminate DOM property", () => {
    render(
      <Checkbox
        label="Select all"
        indeterminate
      />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Select all",
    }) as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);
  });

  it("shows a required indicator and marks the field required", () => {
    render(
      <Checkbox
        label="Accept terms"
        required
      />,
    );

    expect(screen.getByText("*")).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: /accept terms/i }),
    ).toBeRequired();
  });

  it("shows helper text and links it via aria-describedby", () => {
    render(
      <Checkbox
        label="Enable 2FA"
        helperText="Recommended for all accounts."
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Enable 2FA" });
    const helper = screen.getByText("Recommended for all accounts.");

    expect(checkbox).toHaveAttribute("aria-describedby", helper.id);
  });

  it("shows an error message, marks the field invalid, and prefers the error over helper text", () => {
    render(
      <Checkbox
        label="Accept terms"
        helperText="Recommended for all accounts."
        error="You must accept the terms"
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    expect(checkbox).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("You must accept the terms")).toBeInTheDocument();
    expect(
      screen.queryByText("Recommended for all accounts."),
    ).not.toBeInTheDocument();
  });

  it("disables the checkbox", () => {
    render(
      <Checkbox
        label="Accept terms"
        disabled
      />,
    );

    expect(
      screen.getByRole("checkbox", { name: "Accept terms" }),
    ).toBeDisabled();
  });

  it("merges a custom className onto the input element", () => {
    render(
      <Checkbox
        label="Accept terms"
        className="custom-class"
      />,
    );

    expect(
      screen.getByRole("checkbox", { name: "Accept terms" }),
    ).toHaveClass("custom-class");
  });

  it("forwards the ref to the underlying input element, alongside internal indeterminate handling", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Checkbox
        label="Select all"
        ref={ref}
        indeterminate
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Select all" });
    expect(ref.current).toBe(checkbox);
    expect(ref.current?.indeterminate).toBe(true);
  });
});
