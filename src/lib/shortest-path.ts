import { graphArcs, validateVertex, type Graph } from "./graph";

export type ShortestPathAlgorithm = "dijkstra" | "bellman-ford";
export type ShortestPathStep = {
  distances: number[];
  parents: Array<number | null>;
  parentEdgeIds: Array<number | null>;
  settled: boolean[];
  activeVertex: number | null;
  activeEdgeIds: number[];
  codeLine: number;
  message: { vi: string; en: string };
};
export type ShortestPathTrace = { algorithm: ShortestPathAlgorithm; steps: ShortestPathStep[]; distances: number[]; hasNegativeCycle: boolean };

function snap(distances: number[], parents: Array<number | null>, parentEdgeIds: Array<number | null>, settled: boolean[], activeVertex: number | null, activeEdgeIds: number[], codeLine: number, vi: string, en: string): ShortestPathStep {
  return { distances: [...distances], parents: [...parents], parentEdgeIds: [...parentEdgeIds], settled: [...settled], activeVertex, activeEdgeIds, codeLine, message: { vi, en } };
}

export function runDijkstra(graph: Graph, source: number): ShortestPathTrace {
  validateVertex(graph, source);
  if (graph.edges.some((edge) => edge.weight < 0)) throw new Error("Dijkstra requires non-negative weights.");
  const arcs = graphArcs(graph);
  const distances = Array(graph.vertexCount).fill(Number.POSITIVE_INFINITY) as number[];
  const parents = Array(graph.vertexCount).fill(null) as Array<number | null>;
  const parentEdgeIds = Array(graph.vertexCount).fill(null) as Array<number | null>;
  const settled = Array(graph.vertexCount).fill(false) as boolean[];
  distances[source] = 0;
  const steps = [snap(distances, parents, parentEdgeIds, settled, source, [], 1, `Đặt dist[${source}] = 0.`, `Set dist[${source}] = 0.`)];

  for (let round = 0; round < graph.vertexCount; round += 1) {
    let vertex = -1;
    for (let candidate = 0; candidate < graph.vertexCount; candidate += 1) {
      if (!settled[candidate] && (vertex === -1 || distances[candidate] < distances[vertex])) vertex = candidate;
    }
    if (vertex === -1 || !Number.isFinite(distances[vertex])) break;
    settled[vertex] = true;
    steps.push(snap(distances, parents, parentEdgeIds, settled, vertex, [], 4, `Chốt đỉnh ${vertex} với khoảng cách ${distances[vertex]}.`, `Settle vertex ${vertex} at distance ${distances[vertex]}.`));
    for (const arc of arcs.filter((item) => item.from === vertex)) {
      steps.push(snap(distances, parents, parentEdgeIds, settled, vertex, [arc.edgeId], 6, `Thử nới lỏng cạnh ${arc.from} → ${arc.to} (${arc.weight}).`, `Try relaxing ${arc.from} → ${arc.to} (${arc.weight}).`));
      const candidate = distances[vertex] + arc.weight;
      if (candidate >= distances[arc.to]) continue;
      distances[arc.to] = candidate;
      parents[arc.to] = vertex;
      parentEdgeIds[arc.to] = arc.edgeId;
      steps.push(snap(distances, parents, parentEdgeIds, settled, arc.to, [arc.edgeId], 7, `Cập nhật dist[${arc.to}] = ${candidate}.`, `Update dist[${arc.to}] = ${candidate}.`));
    }
  }
  steps.push(snap(distances, parents, parentEdgeIds, settled, null, [], 10, "Dijkstra hoàn tất; mọi khoảng cách đạt được đã tối ưu.", "Dijkstra complete; every reachable distance is final."));
  return { algorithm: "dijkstra", steps, distances, hasNegativeCycle: false };
}

export function runBellmanFord(graph: Graph, source: number): ShortestPathTrace {
  validateVertex(graph, source);
  const arcs = graphArcs(graph);
  const distances = Array(graph.vertexCount).fill(Number.POSITIVE_INFINITY) as number[];
  const parents = Array(graph.vertexCount).fill(null) as Array<number | null>;
  const parentEdgeIds = Array(graph.vertexCount).fill(null) as Array<number | null>;
  const settled = Array(graph.vertexCount).fill(false) as boolean[];
  distances[source] = 0;
  const steps = [snap(distances, parents, parentEdgeIds, settled, source, [], 1, `Đặt dist[${source}] = 0.`, `Set dist[${source}] = 0.`)];

  for (let pass = 1; pass < graph.vertexCount; pass += 1) {
    let changed = false;
    steps.push(snap(distances, parents, parentEdgeIds, settled, null, [], 3, `Bắt đầu lượt nới lỏng ${pass}.`, `Start relaxation pass ${pass}.`));
    for (const arc of arcs) {
      if (!Number.isFinite(distances[arc.from])) continue;
      steps.push(snap(distances, parents, parentEdgeIds, settled, arc.from, [arc.edgeId], 5, `Xét ${arc.from} → ${arc.to} (${arc.weight}).`, `Inspect ${arc.from} → ${arc.to} (${arc.weight}).`));
      const candidate = distances[arc.from] + arc.weight;
      if (candidate >= distances[arc.to]) continue;
      distances[arc.to] = candidate;
      parents[arc.to] = arc.from;
      parentEdgeIds[arc.to] = arc.edgeId;
      changed = true;
      steps.push(snap(distances, parents, parentEdgeIds, settled, arc.to, [arc.edgeId], 6, `Cập nhật dist[${arc.to}] = ${candidate}.`, `Update dist[${arc.to}] = ${candidate}.`));
    }
    if (!changed) break;
  }

  const cycleArc = arcs.find((arc) => Number.isFinite(distances[arc.from]) && distances[arc.from] + arc.weight < distances[arc.to]);
  const hasNegativeCycle = cycleArc !== undefined;
  steps.push(snap(distances, parents, parentEdgeIds, settled, null, cycleArc ? [cycleArc.edgeId] : [], hasNegativeCycle ? 9 : 10, hasNegativeCycle ? "Phát hiện chu trình âm còn có thể giảm khoảng cách." : "Không còn cạnh nào nới lỏng được; thuật toán hoàn tất.", hasNegativeCycle ? "A reachable negative cycle can still reduce a distance." : "No edge can relax further; the algorithm is complete."));
  return { algorithm: "bellman-ford", steps, distances, hasNegativeCycle };
}
