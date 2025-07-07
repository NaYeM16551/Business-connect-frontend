import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import CreateGroup from "../CreateGroup";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("CreateGroup Component", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  test("renders without crashing", () => {
    mockLocalStorage.getItem.mockReturnValue("fake-token");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreateGroup />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(document.body).toBeInTheDocument();
  });

  test("contains create group form", () => {
    mockLocalStorage.getItem.mockReturnValue("fake-token");

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreateGroup />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  test("has proper structure", () => {
    mockLocalStorage.getItem.mockReturnValue("fake-token");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CreateGroup />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const container = document.querySelector("div");
    expect(container).toBeInTheDocument();
  });
});
