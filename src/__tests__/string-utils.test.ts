import { describe, expect, test } from "vitest";

describe("String Utils Tests", () => {
  test("string concatenation", () => {
    expect("Hello" + " " + "World").toBe("Hello World");
  });

  test("string length", () => {
    expect("JavaScript".length).toBe(10);
  });

  test("string includes", () => {
    expect("Frontend Development".includes("Frontend")).toBe(true);
  });

  test("string uppercase", () => {
    expect("hello".toUpperCase()).toBe("HELLO");
  });

  test("string lowercase", () => {
    expect("WORLD".toLowerCase()).toBe("world");
  });

  test("string trim", () => {
    expect("  spaces  ".trim()).toBe("spaces");
  });

  test("string split", () => {
    expect("a,b,c".split(",")).toEqual(["a", "b", "c"]);
  });
});
