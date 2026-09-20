import { describe, expect, it } from "vitest";
import { parseGraph } from "./graph";
import { runKruskal, runPrim } from "./minimum-spanning-tree";

describe("minimum spanning tree engines", () => {
  const graph = parseGraph(4, "0-1:4,0-2:1,1-2:2,1-3:5,2-3:3", { weighted: true, directed: false });

  it("finds the same MST with Kruskal and Prim", () => {
    expect(runKruskal(graph).totalWeight).toBe(6);
    expect(runPrim(graph).totalWeight).toBe(6);
    expect(runKruskal(graph).selectedEdgeIds).toHaveLength(3);
  });

  it("rejects disconnected graphs", () => {
    const disconnected = parseGraph(4, "0-1:1,2-3:1", { weighted: true, directed: false });
    expect(() => runKruskal(disconnected)).toThrow();
    expect(() => runPrim(disconnected)).toThrow();
  });
});
