import "@testing-library/jest-dom";
import { describe, expect, test } from "vitest";
import { cn } from "../utils";

describe("Utils Functions", () => {
  test("cn function combines classes correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  test("cn function handles empty classes", () => {
    const result = cn("", "class2");
    expect(result).toBe("class2");
  });

  test("cn function handles undefined classes", () => {
    const result = cn(undefined, "class2");
    expect(result).toBe("class2");
  });

  test("cn function handles null classes", () => {
    const result = cn(null, "class2");
    expect(result).toBe("class2");
  });

  test("cn function handles conditional classes", () => {
    const isActive = true;
    const isDisabled = false;
    const result = cn(isActive && "class1", isDisabled && "class2");
    expect(result).toBe("class1");
  });
});
