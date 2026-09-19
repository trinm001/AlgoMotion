import { describe, expect, it } from "vitest";
import { buildFenwickTree, queryFenwickRange, updateFenwickTree } from "./fenwick-tree";

describe("fenwick tree trace engine", () => {
  it("builds one-based partial sums", () => {
    const trace = buildFenwickTree([2, 1, 5, 3]);
    expect(trace.finalTree).toEqual([0, 2, 3, 5, 11]);
    expect(trace.result).toBe(11);
  });

  it("answers inclusive range queries", () => {
    const built = buildFenwickTree([2, 1, 5, 3, 4]);
    const trace = queryFenwickRange(built.finalTree, built.finalValues, 1, 3);
    expect(trace.result).toBe(9);
    expect(trace.finalTree).toEqual(built.finalTree);
  });

  it("updates a point along its Fenwick path", () => {
    const built = buildFenwickTree([2, 1, 5, 3]);
    const trace = updateFenwickTree(built.finalTree, built.finalValues, 2, 8);
    expect(trace.finalValues).toEqual([2, 1, 8, 3]);
    expect(trace.finalTree).toEqual([0, 2, 3, 8, 14]);
  });

  it("rejects invalid operations", () => {
    const built = buildFenwickTree([1, 2]);
    expect(() => queryFenwickRange(built.finalTree, built.finalValues, 1, 0)).toThrow();
    expect(() => updateFenwickTree(built.finalTree, built.finalValues, 2, 4)).toThrow();
  });
});

