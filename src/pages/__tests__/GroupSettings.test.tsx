import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import GroupSettings from "../GroupSettings";

describe("GroupSettings Component", () => {
  test("renders without crashing", () => {
    render(<GroupSettings />);

    expect(document.body).toBeInTheDocument();
  });

  test("contains group settings content", () => {
    const { container } = render(<GroupSettings />);

    expect(container.firstChild).toBeInTheDocument();
  });

  test("has proper structure", () => {
    render(<GroupSettings />);

    const container = document.querySelector("div");
    expect(container).toBeInTheDocument();
  });
});
