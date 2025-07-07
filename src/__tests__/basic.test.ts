import { describe, expect, test } from "vitest";

describe("Basic Tests", () => {
  test("simple math test", () => {
    expect(2 + 2).toBe(4);
  });

  test("string test", () => {
    expect("hello").toBe("hello");
  });

  test("boolean test", () => {
    expect(true).toBe(true);
  });

  test("array test", () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
  });

  test("object test", () => {
    const obj = { name: "test" };
    expect(obj).toHaveProperty("name");
  });
});
