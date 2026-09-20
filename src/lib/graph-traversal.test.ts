import { describe, expect, it } from "vitest";
import { parseGraph } from "./graph";
import { runTraversal } from "./graph-traversal";

describe("graph traversals", () => {
    const graph = parseGraph(6, "0 1\n0 2\n1 3\n1 4\n2 5", { weighted: false, directed: false });

  it("runs BFS layer by layer", () => {
    expect(runTraversal(graph, 0, "bfs").order).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it("runs deterministic iterative DFS", () => {
    expect(runTraversal(graph, 0, "dfs").order).toEqual([0, 1, 3, 4, 2, 5]);
  });
});
