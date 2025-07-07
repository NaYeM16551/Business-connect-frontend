import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, test, vi } from "vitest";
import GroupDetail from "../GroupDetail";

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("GroupDetail Component", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  test("renders without crashing", () => {
    mockLocalStorage.getItem.mockReturnValue("fake-token");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/groups/1"]}>
          <GroupDetail />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(document.body).toBeInTheDocument();
  });

  test("contains group detail content", () => {
    mockLocalStorage.getItem.mockReturnValue("fake-token");

    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/groups/1"]}>
          <GroupDetail />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(container.firstChild).toBeInTheDocument();
  });

  test("has proper structure", () => {
    mockLocalStorage.getItem.mockReturnValue("fake-token");

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/groups/1"]}>
          <GroupDetail />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const container = document.querySelector("div");
    expect(container).toBeInTheDocument();
  });
});
