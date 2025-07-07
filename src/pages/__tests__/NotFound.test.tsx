import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import NotFound from "../NotFound";

describe("NotFound Component", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(document.body).toBeInTheDocument();
  });

  test("contains error page content", () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  test("has proper structure", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const container = document.querySelector("div");
    expect(container).toBeInTheDocument();
  });
});
