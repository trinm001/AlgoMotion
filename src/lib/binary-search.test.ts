import { describe, expect, it } from "vitest";
import { runBinarySearch } from "./binary-search";

describe("binary search trace engine", () => {
  it("finds a present target", () => {
    const trace = runBinarySearch([1, 3, 5, 7, 9, 12], 9);
    expect(trace.foundIndex).toBe(4);
    expect(trace.steps.at(-1)?.foundIndex).toBe(4);
  });

  it("reports an absent target", () => {
    const trace = runBinarySearch([1, 3, 5, 7], 4);
    expect(trace.foundIndex).toBeNull();
    expect(trace.steps.at(-1)?.message.en).toContain("not present");
  });

  it("requires sorted input", () => {
    expect(() => runBinarySearch([3, 1, 2], 1)).toThrow();
  });
});
