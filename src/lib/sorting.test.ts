import { describe, expect, it } from "vitest";
import { runSort, type SortAlgorithm } from "./sorting";

describe("sorting trace engine", () => {
  for (const algorithm of ["bubble", "selection", "insertion"] as SortAlgorithm[]) {
    it(`sorts negatives and duplicates with ${algorithm}`, () => {
      const input = [4, -2, 4, 1, 0];
      const trace = runSort(input, algorithm);
      expect(trace.result).toEqual([-2, 0, 1, 4, 4]);
      expect(input).toEqual([4, -2, 4, 1, 0]);
      expect(trace.steps.at(-1)?.sortedIndices).toHaveLength(input.length);
    });
  }

  it("rejects unsupported input", () => {
    expect(() => runSort([1], "bubble")).toThrow();
    expect(() => runSort([1, 100], "selection")).toThrow();
  });
});
