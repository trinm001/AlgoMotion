import { describe, expect, it } from "vitest";
import { parseGraph } from "./graph";

describe("graph parser", () => {
  it("parses weighted directed edges", () => {
    const graph = parseGraph(4, "0->1:5, 1->2:-2, 2->3:4", { weighted: true, directed: true });
    expect(graph.edges.map((edge) => edge.weight)).toEqual([5, -2, 4]);
  });

  it("rejects duplicate undirected edges", () => {
    expect(() => parseGraph(3, "0-1, 1-0", { weighted: false, directed: false })).toThrow();
  });
});
