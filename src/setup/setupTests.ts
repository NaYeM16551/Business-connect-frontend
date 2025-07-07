import "@testing-library/jest-dom";

// Mock ResizeObserver for tests
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;
