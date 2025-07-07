import { describe, expect, test } from "vitest";

describe("Math Utils Tests", () => {
  test("addition works correctly", () => {
    expect(5 + 3).toBe(8);
  });

  test("subtraction works correctly", () => {
    expect(10 - 4).toBe(6);
  });

  test("multiplication works correctly", () => {
    expect(6 * 7).toBe(42);
  });

  test("division works correctly", () => {
    expect(20 / 4).toBe(5);
  });

  test("modulo works correctly", () => {
    expect(17 % 5).toBe(2);
  });
});
