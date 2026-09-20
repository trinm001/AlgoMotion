import { adjacency, validateVertex, type Graph } from "./graph";

export type LcaStep = {
  depth: number[];
  up: number[][];
  activeVertices: number[];
  activeEdgeIds: number[];
  result: number | null;
  codeLine: number;
  message: { vi: string; en: string };
};
export type LcaTrace = { steps: LcaStep[]; result: number; depth: number[]; up: number[][] };

function snap(depth: number[], up: number[][], activeVertices: number[], activeEdgeIds: number[], result: number | null, codeLine: number, vi: string, en: string): LcaStep {
  return { depth: [...depth], up: up.map((row) => [...row]), activeVertices, activeEdgeIds, result, codeLine, message: { vi, en } };
}

export function runLca(graph: Graph, root: number, first: number, second: number): LcaTrace {
  if (graph.directed || graph.edges.length !== graph.vertexCount - 1) throw new Error("LCA input must be a tree.");
  validateVertex(graph, root); validateVertex(graph, first); validateVertex(graph, second);
  const lists = adjacency(graph);
  const levels = Math.floor(Math.log2(graph.vertexCount)) + 1;
  const depth = Array(graph.vertexCount).fill(-1) as number[];
  const up = Array.from({ length: levels }, () => Array(graph.vertexCount).fill(root)) as number[][];
  const parentEdge = Array(graph.vertexCount).fill(null) as Array<number | null>;
  depth[root] = 0; up[0][root] = root;
  const queue = [root];
  const steps = [snap(depth, up, [root], [], null, 1, `Chọn ${root} làm gốc của cây.`, `Choose ${root} as the tree root.`)];
  while (queue.length) {
    const vertex = queue.shift()!;
    for (const arc of lists[vertex]) {
      if (depth[arc.to] !== -1) continue;
      depth[arc.to] = depth[vertex] + 1;
      up[0][arc.to] = vertex;
      parentEdge[arc.to] = arc.edgeId;
      queue.push(arc.to);
      steps.push(snap(depth, up, [vertex, arc.to], [arc.edgeId], null, 4, `parent[${arc.to}] = ${vertex}, depth = ${depth[arc.to]}.`, `parent[${arc.to}] = ${vertex}, depth = ${depth[arc.to]}.`));
    }
  }
  if (depth.some((value) => value === -1)) throw new Error("Tree is disconnected.");
  for (let level = 1; level < levels; level += 1) {
    for (let vertex = 0; vertex < graph.vertexCount; vertex += 1) up[level][vertex] = up[level - 1][up[level - 1][vertex]];
    steps.push(snap(depth, up, [], [], null, 6, `Dựng tầng tổ tiên 2^${level}.`, `Build the 2^${level} ancestor level.`));
  }

  let left = first; let right = second;
  steps.push(snap(depth, up, [left, right], [], null, 8, `Bắt đầu truy vấn LCA(${first}, ${second}).`, `Start query LCA(${first}, ${second}).`));
  if (depth[left] < depth[right]) [left, right] = [right, left];
  let difference = depth[left] - depth[right];
  for (let level = levels - 1; level >= 0; level -= 1) {
    if ((difference & (1 << level)) === 0) continue;
    const previous = left; left = up[level][left]; difference -= 1 << level;
    steps.push(snap(depth, up, [previous, left], parentEdge[previous] === null ? [] : [parentEdge[previous]!], null, 10, `Nâng đỉnh sâu hơn từ ${previous} lên ${left}.`, `Lift the deeper vertex from ${previous} to ${left}.`));
  }
  if (left === right) {
    steps.push(snap(depth, up, [left], [], left, 12, `Hai đỉnh gặp nhau tại ${left}; đây là LCA.`, `Both vertices meet at ${left}; this is the LCA.`));
    return { steps, result: left, depth, up };
  }
  for (let level = levels - 1; level >= 0; level -= 1) {
    if (up[level][left] === up[level][right]) continue;
    const oldLeft = left; const oldRight = right;
    left = up[level][left]; right = up[level][right];
    steps.push(snap(depth, up, [oldLeft, oldRight, left, right], [], null, 14, `Nâng đồng thời lên ${left} và ${right}.`, `Lift both vertices to ${left} and ${right}.`));
  }
  const result = up[0][left];
  steps.push(snap(depth, up, [left, right, result], [], result, 16, `Cha chung trực tiếp là ${result}; LCA = ${result}.`, `Their shared parent is ${result}; LCA = ${result}.`));
  return { steps, result, depth, up };
}
