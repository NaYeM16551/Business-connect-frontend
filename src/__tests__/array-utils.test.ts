import { describe, expect, test } from "vitest";

describe("Array Utils Tests", () => {
  test("array creation", () => {
    const arr = [1, 2, 3];
    expect(arr).toHaveLength(3);
  });

  test("array push", () => {
    const arr = [1, 2];
    arr.push(3);
    expect(arr).toEqual([1, 2, 3]);
  });

  test("array pop", () => {
    const arr = [1, 2, 3];
    const popped = arr.pop();
    expect(popped).toBe(3);
    expect(arr).toEqual([1, 2]);
  });

  test("array map", () => {
    const arr = [1, 2, 3];
    const doubled = arr.map((x) => x * 2);
    expect(doubled).toEqual([2, 4, 6]);
  });

  test("array filter", () => {
    const arr = [1, 2, 3, 4, 5];
    const evens = arr.filter((x) => x % 2 === 0);
    expect(evens).toEqual([2, 4]);
  });

  test("array find", () => {
    const arr = [1, 2, 3, 4];
    const found = arr.find((x) => x > 2);
    expect(found).toBe(3);
  });

  test("array includes", () => {
    const arr = ["apple", "banana", "orange"];
    expect(arr.includes("banana")).toBe(true);
  });
});
