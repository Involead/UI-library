import { describe, expect, it } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders a native button element", () => {
    const element = Button({ children: "Save" });

    expect(element.type).toBe("button");
  });
});
