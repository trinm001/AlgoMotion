import { describe, expect, it } from "vitest";
import { buildSparseTable, querySparseTable } from "./sparse-table";

describe("sparse table trace engine", () => {
  it("builds powers-of-two ranges", () => {
    const trace = buildSparseTable([5, 2, 7, 1, 6]);
    expect(trace.table[0].slice(0, 5)).toEqual([5, 2, 7, 1, 6]);
    expect(trace.table[2][0]).toBe(1);
  });

  it("answers range minimum queries with two blocks", () => {
    const built = buildSparseTable([5, 2, 7, 1, 6, 3]);
    expect(querySparseTable(built.values, built.table, 1, 4).result).toBe(1);
    expect(querySparseTable(built.values, built.table, 4, 4).result).toBe(6);
  });

  it("rejects invalid ranges", () => {
    const built = buildSparseTable([1, 2]);
    expect(() => querySparseTable(built.values, built.table, 1, 0)).toThrow();
  });
});
