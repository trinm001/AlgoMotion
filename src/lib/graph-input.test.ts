import { describe, expect, it } from "vitest";
import { parseGraph } from "./graph";

describe("line-based graph input", () => {
  it("parses u v and optional u v w lines", () => {
    const graph = parseGraph(4, "0 1\n0 2 7\n1 3 -2", { weighted: true, directed: true });
    expect(graph.edges).toEqual([
      { id: 0, from: 0, to: 1, weight: 1 },
      { id: 1, from: 0, to: 2, weight: 7 },
      { id: 2, from: 1, to: 3, weight: -2 },
    ]);
  });

  it("rejects the legacy punctuation format", () => {
    expect(() => parseGraph(3, "0-1, 1-2", { weighted: false, directed: false })).toThrow();
  });
});
