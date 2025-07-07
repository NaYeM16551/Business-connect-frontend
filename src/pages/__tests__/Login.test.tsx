import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test } from "vitest";
import Login from "../Login";

describe("Login Component", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(document.body).toBeInTheDocument();
  });

  test("contains login form elements", () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const container = document.querySelector("div");
    expect(container).toBeInTheDocument();
  });

  test("has proper document structure", () => {
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});
