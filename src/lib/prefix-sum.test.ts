import { describe, expect, it } from "vitest";
import { buildPrefixSums, queryPrefixSum } from "./prefix-sum";

describe("prefix sum trace engine", () => {
  it("builds sums including negative values", () => {
    expect(buildPrefixSums([3, -2, 5, 1]).prefix).toEqual([0, 3, 1, 6, 7]);
  });

  it("answers an inclusive range in constant-time form", () => {
    const built = buildPrefixSums([3, 2, 5, 1, 4]);
    const trace = queryPrefixSum(built.values, built.prefix, 1, 3);
    expect(trace.steps.at(-1)?.result).toBe(8);
  });

  it("rejects invalid ranges", () => {
    const built = buildPrefixSums([1, 2, 3]);
    expect(() => queryPrefixSum(built.values, built.prefix, 2, 1)).toThrow();
  });
});
