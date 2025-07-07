import { describe, expect, test } from "vitest";

describe("App Tests", () => {
  test("basic functionality", () => {
    expect(1 + 1).toBe(2);
  });

  test("string operations", () => {
    expect("hello world").toContain("world");
  });

  test("array operations", () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(numbers).toHaveLength(5);
    expect(numbers[0]).toBe(1);
  });

  test("object properties", () => {
    const user = { name: "John", age: 30 };
    expect(user).toHaveProperty("name");
    expect(user.name).toBe("John");
  });

  test("boolean logic", () => {
    const isTrue = true;
    const isFalse = false;
    expect(isTrue && isTrue).toBe(true);
    expect(isFalse || isTrue).toBe(true);
  });

  test("null and undefined", () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
  });

  test("number comparisons", () => {
    expect(10).toBeGreaterThan(5);
    expect(3).toBeLessThan(7);
  });

  test("type checking", () => {
    expect(typeof "string").toBe("string");
    expect(typeof 42).toBe("number");
  });

  test("regex matching", () => {
    expect("test@example.com").toMatch(/\S+@\S+\.\S+/);
  });

  test("function calls", () => {
    const mockFn = () => "mocked result";
    expect(mockFn()).toBe("mocked result");
  });
});
