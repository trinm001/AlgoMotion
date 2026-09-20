import { describe, expect, it } from "vitest";
import { parseGraph } from "./graph";
import { runBellmanFord, runDijkstra } from "./shortest-path";

describe("shortest path engines", () => {
  it("computes Dijkstra distances", () => {
    const graph = parseGraph(5, "0->1:4,0->2:1,2->1:2,1->3:1,2->3:5,3->4:3", { weighted: true, directed: true });
    expect(runDijkstra(graph, 0).distances).toEqual([0, 3, 1, 4, 7]);
  });

  it("handles negative edges with Bellman-Ford", () => {
    const graph = parseGraph(4, "0->1:4,0->2:5,1->2:-2,2->3:3", { weighted: true, directed: true });
    const trace = runBellmanFord(graph, 0);
    expect(trace.distances).toEqual([0, 4, 2, 5]);
    expect(trace.hasNegativeCycle).toBe(false);
  });

  it("detects a reachable negative cycle", () => {
    const graph = parseGraph(3, "0->1:1,1->2:-2,2->1:-2", { weighted: true, directed: true });
    expect(runBellmanFord(graph, 0).hasNegativeCycle).toBe(true);
  });

  it("rejects negative weights for Dijkstra", () => {
    const graph = parseGraph(2, "0->1:-1", { weighted: true, directed: true });
    expect(() => runDijkstra(graph, 0)).toThrow();
  });
});
