export type GraphEdge = { id: number; from: number; to: number; weight: number };
export type Graph = { vertexCount: number; edges: GraphEdge[]; directed: boolean };
export type GraphArc = GraphEdge & { edgeId: number };

export function parseGraph(vertexCount: number, input: string, options: { weighted: boolean; directed: boolean }): Graph {
  if (!Number.isInteger(vertexCount) || vertexCount < 2 || vertexCount > 10) throw new Error("Use 2 to 10 vertices.");
  const lines = input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 1 || lines.length > 24) throw new Error("Use 1 to 24 edges.");
  const seen = new Set<string>();
  const edges = lines.map((line, id) => {
    const parts = line.split(/\s+/);
    if (parts.length < 2 || parts.length > 3 || parts.some((part) => !/^-?\d+$/.test(part))) throw new Error(`Invalid edge: ${line}`);
    const from = Number(parts[0]);
    const to = Number(parts[1]);
    const weight = parts.length === 3 ? Number(parts[2]) : 1;
    if (from < 0 || from >= vertexCount || to < 0 || to >= vertexCount || from === to) throw new Error(`Invalid endpoints: ${line}`);
    if (!Number.isInteger(weight) || Math.abs(weight) > 99) throw new Error(`Invalid weight: ${line}`);
    const key = options.directed ? `${from}>${to}` : `${Math.min(from, to)}-${Math.max(from, to)}`;
    if (seen.has(key)) throw new Error(`Duplicate edge: ${line}`);
    seen.add(key);
    return { id, from, to, weight };
  });
  return { vertexCount, edges, directed: options.directed };
}

export function graphArcs(graph: Graph): GraphArc[] {
  return graph.edges.flatMap((edge) => graph.directed
    ? [{ ...edge, edgeId: edge.id }]
    : [{ ...edge, edgeId: edge.id }, { id: edge.id, from: edge.to, to: edge.from, weight: edge.weight, edgeId: edge.id }]);
}

export function adjacency(graph: Graph) {
  const lists = Array.from({ length: graph.vertexCount }, () => [] as GraphArc[]);
  for (const arc of graphArcs(graph)) lists[arc.from].push(arc);
  for (const list of lists) list.sort((left, right) => left.to - right.to || left.weight - right.weight);
  return lists;
}

export function validateVertex(graph: Graph, vertex: number) {
  if (!Number.isInteger(vertex) || vertex < 0 || vertex >= graph.vertexCount) throw new Error("Invalid vertex.");
}
