import { adjacency, type Graph } from "./graph";

export type MstAlgorithm = "kruskal" | "prim";
export type MstStep = {
  selectedEdgeIds: number[];
  activeEdgeIds: number[];
  activeVertices: number[];
  totalWeight: number;
  codeLine: number;
  message: { vi: string; en: string };
};
export type MstTrace = { algorithm: MstAlgorithm; steps: MstStep[]; selectedEdgeIds: number[]; totalWeight: number };

function validate(graph: Graph) {
  if (graph.directed) throw new Error("MST requires an undirected graph.");
}
function snap(selectedEdgeIds: number[], activeEdgeIds: number[], activeVertices: number[], totalWeight: number, codeLine: number, vi: string, en: string): MstStep {
  return { selectedEdgeIds: [...selectedEdgeIds], activeEdgeIds, activeVertices, totalWeight, codeLine, message: { vi, en } };
}

export function runKruskal(graph: Graph): MstTrace {
  validate(graph);
  const parent = Array.from({ length: graph.vertexCount }, (_, index) => index);
  const size = Array(graph.vertexCount).fill(1) as number[];
  const find = (start: number) => { let node = start; while (parent[node] !== node) node = parent[node]; return node; };
  const selected: number[] = [];
  let total = 0;
  const sorted = [...graph.edges].sort((left, right) => left.weight - right.weight || left.id - right.id);
  const steps = [snap(selected, [], [], total, 1, "Sắp xếp các cạnh theo trọng số tăng dần.", "Sort edges by nondecreasing weight.")];
  for (const edge of sorted) {
    const rootFrom = find(edge.from);
    const rootTo = find(edge.to);
    steps.push(snap(selected, [edge.id], [edge.from, edge.to], total, 4, `Xét cạnh ${edge.from}–${edge.to} (${edge.weight}).`, `Inspect edge ${edge.from}–${edge.to} (${edge.weight}).`));
    if (rootFrom === rootTo) {
      steps.push(snap(selected, [edge.id], [edge.from, edge.to], total, 5, "Bỏ qua vì cạnh này tạo chu trình.", "Skip it because it would create a cycle."));
      continue;
    }
    let large = rootFrom; let small = rootTo;
    if (size[large] < size[small]) [large, small] = [small, large];
    parent[small] = large; size[large] += size[small];
    selected.push(edge.id); total += edge.weight;
    steps.push(snap(selected, [edge.id], [edge.from, edge.to], total, 7, `Chọn cạnh; tổng hiện tại là ${total}.`, `Select the edge; total weight is now ${total}.`));
    if (selected.length === graph.vertexCount - 1) break;
  }
  if (selected.length !== graph.vertexCount - 1) throw new Error("Graph is disconnected.");
  steps.push(snap(selected, [], [], total, 9, `Kruskal hoàn tất với tổng trọng số ${total}.`, `Kruskal completes with total weight ${total}.`));
  return { algorithm: "kruskal", steps, selectedEdgeIds: selected, totalWeight: total };
}

export function runPrim(graph: Graph, start = 0): MstTrace {
  validate(graph);
  if (start < 0 || start >= graph.vertexCount) throw new Error("Invalid start.");
  const lists = adjacency(graph);
  const included = Array(graph.vertexCount).fill(false) as boolean[];
  included[start] = true;
  const selected: number[] = [];
  let total = 0;
  const steps = [snap(selected, [], [start], total, 1, `Bắt đầu Prim từ đỉnh ${start}.`, `Start Prim from vertex ${start}.`)];
  while (selected.length < graph.vertexCount - 1) {
    const candidates = lists.flatMap((list, from) => included[from] ? list.filter((arc) => !included[arc.to]) : []);
    candidates.sort((left, right) => left.weight - right.weight || left.edgeId - right.edgeId);
    const edge = candidates[0];
    if (!edge) throw new Error("Graph is disconnected.");
    steps.push(snap(selected, [edge.edgeId], [edge.from, edge.to], total, 5, `Cạnh nhẹ nhất qua lát cắt là ${edge.from}–${edge.to} (${edge.weight}).`, `The lightest crossing edge is ${edge.from}–${edge.to} (${edge.weight}).`));
    included[edge.to] = true;
    selected.push(edge.edgeId); total += edge.weight;
    steps.push(snap(selected, [edge.edgeId], [edge.from, edge.to], total, 7, `Thêm đỉnh ${edge.to}; tổng hiện tại là ${total}.`, `Add vertex ${edge.to}; total weight is now ${total}.`));
  }
  steps.push(snap(selected, [], [], total, 9, `Prim hoàn tất với tổng trọng số ${total}.`, `Prim completes with total weight ${total}.`));
  return { algorithm: "prim", steps, selectedEdgeIds: selected, totalWeight: total };
}
