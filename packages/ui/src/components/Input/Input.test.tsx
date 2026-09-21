import { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Input } from "./Input";

describe("Input", () => {
  it("renders a labeled textbox", () => {
    render(<Input label="Email" />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);

    const input = screen.getByLabelText("Email");
    await user.type(input, "hello@example.com");

    expect(input).toHaveValue("hello@example.com");
  });

  it("shows a required indicator and marks the field required", () => {
    render(
      <Input
        label="Email"
        required
      />,
    );

    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
  });

  it("shows helper text and links it via aria-describedby", () => {
    render(
      <Input
        label="Email"
        helperText="We'll never share this."
      />,
    );

    const input = screen.getByLabelText("Email");
    const helper = screen.getByText("We'll never share this.");

    expect(input).toHaveAttribute("aria-describedby", helper.id);
  });

  it("shows an error message, marks the field invalid, and prefers the error over helper text", () => {
    render(
      <Input
        label="Email"
        helperText="We'll never share this."
        error="Email is required"
      />,
    );

    const input = screen.getByLabelText("Email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Email is required")).toBeInTheDocument();
    expect(
      screen.queryByText("We'll never share this."),
    ).not.toBeInTheDocument();
  });

  it("disables the input", () => {
    render(
      <Input
        label="Email"
        disabled
      />,
    );

    expect(screen.getByLabelText("Email")).toBeDisabled();
  });

  it("renders left and right icons for a non-password type", () => {
    render(
      <Input
        label="Search"
        leftIcon={<span data-testid="left-icon" />}
        rightIcon={<span data-testid="right-icon" />}
      />,
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("shows a password toggle instead of a right icon for type=password", () => {
    render(
      <Input
        label="Password"
        type="password"
        rightIcon={<span data-testid="right-icon" />}
      />,
    );

    expect(screen.queryByTestId("right-icon")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show password" }),
    ).toBeInTheDocument();
  });

  it("toggles password visibility when the toggle button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Input
        label="Password"
        type="password"
      />,
    );

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");

    await user.click(
      screen.getByRole("button", { name: "Show password" }),
    );

    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Hide password" }),
    ).toBeInTheDocument();
  });

  it("merges a custom className onto the input element", () => {
    render(
      <Input
        label="Email"
        className="custom-class"
      />,
    );

    expect(screen.getByLabelText("Email")).toHaveClass("custom-class");
  });

  it("forwards the ref to the underlying input element", () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Input
        label="Email"
        ref={ref}
      />,
    );

    expect(ref.current).toBe(screen.getByLabelText("Email"));
  });
});
