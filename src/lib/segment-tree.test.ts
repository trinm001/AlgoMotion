import { describe, expect, it } from "vitest";
import { buildSegmentTree, querySegmentTree, updateSegmentTree } from "./segment-tree";

describe("segment tree trace engine", () => {
  it("builds the correct interval sums", () => {
    const trace = buildSegmentTree([2, 1, 5, 3]);

    expect(trace.result).toBe(11);
    expect(trace.finalNodes.find((node) => node.id === 1)).toMatchObject({ left: 0, right: 3, sum: 11 });
    expect(trace.finalNodes.find((node) => node.id === 2)?.sum).toBe(3);
    expect(trace.steps.at(-1)?.kind).toBe("complete");
  });

  it("queries inclusive ranges without changing the tree", () => {
    const built = buildSegmentTree([2, 1, 5, 3, 4]);
    const trace = querySegmentTree(built.finalNodes, built.finalValues, 1, 3);

    expect(trace.result).toBe(9);
    expect(trace.finalNodes).toEqual(built.finalNodes);
    expect(trace.steps.some((step) => step.kind === "covered")).toBe(true);
    expect(trace.steps.some((step) => step.kind === "outside")).toBe(true);
  });

  it("updates one point and recomputes its ancestors", () => {
    const built = buildSegmentTree([2, 1, 5, 3]);
    const trace = updateSegmentTree(built.finalNodes, built.finalValues, 2, 8);

    expect(trace.finalValues).toEqual([2, 1, 8, 3]);
    expect(trace.result).toBe(14);
    expect(trace.finalNodes.find((node) => node.id === 1)?.sum).toBe(14);
    expect(trace.steps.at(-1)?.result).toBe(14);
  });

  it("rejects invalid ranges and indices", () => {
    const built = buildSegmentTree([1, 2, 3]);

    expect(() => querySegmentTree(built.finalNodes, built.finalValues, 2, 1)).toThrow();
    expect(() => updateSegmentTree(built.finalNodes, built.finalValues, 3, 9)).toThrow();
  });
});
