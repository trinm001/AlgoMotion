import { describe, expect, it } from "vitest";
import { createDsu, runFind, runUnion } from "./disjoint-set";

describe("disjoint set trace engine", () => {
  it("unites by size", () => {
    let state = createDsu(6);
    state = runUnion(state, 0, 1).finalState;
    state = runUnion(state, 2, 3).finalState;
    const trace = runUnion(state, 0, 2);
    expect(trace.merged).toBe(true);
    expect(trace.finalState.size[trace.root ?? 0]).toBe(4);
  });

  it("compresses a path during find", () => {
    const state = { parent: [0, 0, 1, 2], size: [4, 1, 1, 1] };
    const trace = runFind(state, 3);
    expect(trace.root).toBe(0);
    expect(trace.finalState.parent).toEqual([0, 0, 0, 0]);
    expect(state.parent).toEqual([0, 0, 1, 2]);
  });

  it("does not merge nodes already connected", () => {
    const state = runUnion(createDsu(3), 0, 1).finalState;
    expect(runUnion(state, 1, 0).merged).toBe(false);
  });
});
