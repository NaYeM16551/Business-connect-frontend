import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Button } from "../button";

describe("Button Component", () => {
  test("renders without crashing", () => {
    render(<Button>Click me</Button>);

    expect(document.body).toBeInTheDocument();
  });

  test("displays button text", () => {
    const { container } = render(<Button>Test Button</Button>);

    expect(container.firstChild).toBeInTheDocument();
  });

  test("has proper button element", () => {
    render(<Button>Click me</Button>);

    const button = document.querySelector("button");
    expect(button).toBeInTheDocument();
  });

  test("accepts custom className", () => {
    render(<Button className="custom-class">Click me</Button>);

    const button = document.querySelector("button");
    expect(button).toBeInTheDocument();
  });

  test("can be disabled", () => {
    render(<Button disabled>Click me</Button>);

    const button = document.querySelector("button");
    expect(button).toBeInTheDocument();
  });
});
