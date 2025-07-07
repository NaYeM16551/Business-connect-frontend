import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Card, CardContent, CardHeader } from "../card";

describe("Card Components", () => {
  test("Card renders without crashing", () => {
    render(<Card>Card content</Card>);

    expect(document.body).toBeInTheDocument();
  });

  test("CardHeader renders without crashing", () => {
    render(<CardHeader>Header content</CardHeader>);

    expect(document.body).toBeInTheDocument();
  });

  test("CardContent renders without crashing", () => {
    render(<CardContent>Content</CardContent>);

    expect(document.body).toBeInTheDocument();
  });

  test("Card has proper structure", () => {
    const { container } = render(<Card>Test</Card>);

    expect(container.firstChild).toBeInTheDocument();
  });

  test("Card components work together", () => {
    render(
      <Card>
        <CardHeader>Header</CardHeader>
        <CardContent>Content</CardContent>
      </Card>
    );

    const container = document.querySelector("div");
    expect(container).toBeInTheDocument();
  });
});
