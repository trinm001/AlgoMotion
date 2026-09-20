import { adjacency, validateVertex, type Graph } from "./graph";

export type TraversalAlgorithm = "bfs" | "dfs";
export type TraversalStep = {
  visited: boolean[];
  activeVertex: number | null;
  frontier: number[];
  activeEdgeIds: number[];
  treeEdgeIds: number[];
  order: number[];
  codeLine: number;
  message: { vi: string; en: string };
};
export type TraversalTrace = { algorithm: TraversalAlgorithm; steps: TraversalStep[]; order: number[] };

function snap(visited: boolean[], activeVertex: number | null, frontier: number[], activeEdgeIds: number[], treeEdgeIds: number[], order: number[], codeLine: number, vi: string, en: string): TraversalStep {
  return { visited: [...visited], activeVertex, frontier: [...frontier], activeEdgeIds, treeEdgeIds: [...treeEdgeIds], order: [...order], codeLine, message: { vi, en } };
}

export function runTraversal(graph: Graph, start: number, algorithm: TraversalAlgorithm): TraversalTrace {
  validateVertex(graph, start);
  const lists = adjacency(graph);
  const visited = Array(graph.vertexCount).fill(false) as boolean[];
  const frontier = [start];
  const order: number[] = [];
  const treeEdgeIds: number[] = [];
  const steps = [snap(visited, start, frontier, [], treeEdgeIds, order, 1, `Bắt đầu ${algorithm.toUpperCase()} từ đỉnh ${start}.`, `Start ${algorithm.toUpperCase()} from vertex ${start}.`)];
  visited[start] = true;

  while (frontier.length > 0) {
    const vertex = algorithm === "bfs" ? frontier.shift()! : frontier.pop()!;
    order.push(vertex);
    steps.push(snap(visited, vertex, frontier, [], treeEdgeIds, order, 4, `Lấy đỉnh ${vertex} khỏi ${algorithm === "bfs" ? "hàng đợi" : "ngăn xếp"}.`, `Take vertex ${vertex} from the ${algorithm === "bfs" ? "queue" : "stack"}.`));
    const neighbors = algorithm === "dfs" ? [...lists[vertex]].reverse() : lists[vertex];
    for (const arc of neighbors) {
      steps.push(snap(visited, vertex, frontier, [arc.edgeId], treeEdgeIds, order, 6, `Xét cạnh ${vertex} → ${arc.to}.`, `Inspect edge ${vertex} → ${arc.to}.`));
      if (visited[arc.to]) continue;
      visited[arc.to] = true;
      frontier.push(arc.to);
      treeEdgeIds.push(arc.edgeId);
      steps.push(snap(visited, arc.to, frontier, [arc.edgeId], treeEdgeIds, order, 8, `Khám phá ${arc.to} và đưa vào ${algorithm === "bfs" ? "hàng đợi" : "ngăn xếp"}.`, `Discover ${arc.to} and add it to the ${algorithm === "bfs" ? "queue" : "stack"}.`));
    }
  }
  steps.push(snap(visited, null, [], [], treeEdgeIds, order, 10, `Hoàn tất. Thứ tự: ${order.join(" → ")}.`, `Complete. Order: ${order.join(" → ")}.`));
  return { algorithm, steps, order };
}
