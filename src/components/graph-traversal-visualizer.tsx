"use client";

import { useState } from "react";
import { CodePanel } from "@/components/algorithm-lab-shared";
import { DirectionSelect, GraphDiagram, StatePills } from "@/components/graph-diagram";
import { ActionButton, ConceptGrid, EdgeListInput, ErrorMessage, LabHeading, NumberInput, TraceWorkspace } from "@/components/phase-five-shared";
import { useTracePlayback } from "@/components/use-trace-playback";
import { parseGraph, type Graph } from "@/lib/graph";
import { runTraversal, type TraversalAlgorithm, type TraversalTrace } from "@/lib/graph-traversal";
import type { Locale } from "@/lib/i18n";

const defaultEdges = "0 1\n0 2\n1 3\n1 4\n2 5";
const defaultGraph = parseGraph(6, defaultEdges, { weighted: false, directed: false });
const codes = {
  bfs: ["queue<int> q;", "visited[start] = true; q.push(start);", "while (!q.empty()) {", "  int v = q.front(); q.pop();", "  order.push_back(v);", "  for (int to : adj[v])", "    if (!visited[to]) {", "      visited[to] = true; q.push(to);", "    }", "}"],
  dfs: ["stack<int> st;", "visited[start] = true; st.push(start);", "while (!st.empty()) {", "  int v = st.top(); st.pop();", "  order.push_back(v);", "  for (int to : reversed(adj[v]))", "    if (!visited[to]) {", "      visited[to] = true; st.push(to);", "    }", "}"],
};
const copy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM DUYỆT ĐỒ THỊ", title: "So sánh BFS và DFS", intro: "Cùng một đồ thị, BFS mở rộng theo lớp bằng queue còn DFS đi sâu bằng stack.", vertices: "Số đỉnh", edges: "Cạnh: u v [w]", start: "Đỉnh bắt đầu", algorithm: "Thuật toán", run: "Chạy duyệt", invalid: "Mỗi dòng nhập u v hoặc u v w; dùng 2–10 đỉnh và 1–24 cạnh.", graph: "Đồ thị", frontier: "Frontier", order: "Thứ tự duyệt", step: "Bước", code: "C++ tương ứng", layers: "BFS theo lớp", layersText: "Queue bảo đảm mọi đỉnh ở khoảng cách cạnh nhỏ hơn được xử lý trước.", depth: "DFS đi sâu", depthText: "Stack ưu tiên nhánh mới nhất; thứ tự phụ thuộc thứ tự danh sách kề.", complexity: "Độ phức tạp", complexityText: "Cả BFS và DFS đều chạy O(V+E) và dùng O(V) bộ nhớ đánh dấu." },
  en: { eyebrow: "GRAPH TRAVERSAL LAB", title: "Compare BFS and DFS", intro: "On the same graph, BFS expands in layers with a queue while DFS dives with a stack.", vertices: "Vertex count", edges: "Edges: u v [w]", start: "Start vertex", algorithm: "Algorithm", run: "Run traversal", invalid: "Enter u v or u v w on each line; use 2–10 vertices and 1–24 edges.", graph: "Graph", frontier: "Frontier", order: "Visit order", step: "Step", code: "Matching C++", layers: "BFS by layers", layersText: "A queue processes every vertex at a smaller edge distance first.", depth: "DFS dives", depthText: "A stack prioritizes the newest branch; order depends on adjacency ordering.", complexity: "Complexity", complexityText: "Both BFS and DFS take O(V+E) time and O(V) marking memory." },
} as const;

export function GraphTraversalVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [vertexCount, setVertexCount] = useState(6);
  const [edgeInput, setEdgeInput] = useState(defaultEdges);
  const [start, setStart] = useState(0);
  const [algorithm, setAlgorithm] = useState<TraversalAlgorithm>("bfs");
  const [directed, setDirected] = useState(false);
  const [graph, setGraph] = useState<Graph>(defaultGraph);
  const [trace, setTrace] = useState<TraversalTrace>(() => runTraversal(defaultGraph, 0, "bfs"));
  const [error, setError] = useState("");
  const playback = useTracePlayback(trace.steps.length);
  const current = trace.steps[playback.index];

  function run() {
    try {
      const nextGraph = parseGraph(vertexCount, edgeInput, { weighted: false, directed });
      const nextTrace = runTraversal(nextGraph, start, algorithm);
      setGraph(nextGraph);
      setTrace(nextTrace);
      playback.setIndex(0);
      playback.setPlaying(false);
      setError("");
    } catch {
      setError(t.invalid);
    }
  }

  return <section className="mt-12" aria-labelledby="traversal-lab-title">
    <LabHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} id="traversal-lab-title" />
    <div className="surface mt-8 overflow-hidden rounded-3xl">
      <div className="grid items-end gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6 lg:grid-cols-[.5fr_1.5fr_.55fr_.7fr_auto]">
        <NumberInput label={t.vertices} value={vertexCount} onChange={setVertexCount} min={2} max={10} />
        <EdgeListInput label={t.edges} value={edgeInput} onChange={setEdgeInput} id="traversal-edges" />
        <NumberInput label={t.start} value={start} onChange={setStart} min={0} max={vertexCount - 1} />
        <DirectionSelect locale={locale} directed={directed} onChange={setDirected} />
        <div className="flex items-end gap-2"><select aria-label={t.algorithm} value={algorithm} onChange={(event) => setAlgorithm(event.target.value as TraversalAlgorithm)} className="h-11 min-w-20 rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 font-bold text-[var(--foreground)]"><option value="bfs">BFS</option><option value="dfs">DFS</option></select><ActionButton onClick={run} primary>{t.run}</ActionButton></div>
      </div>
      <ErrorMessage error={error} />
      <TraceWorkspace locale={locale} playback={playback} count={trace.steps.length} stepLabel={t.step} message={current.message[locale]}>
        <div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.graph}</p><div className="overflow-x-auto"><GraphDiagram graph={graph} locale={locale} activeVertices={current.activeVertex === null ? [] : [current.activeVertex]} visitedVertices={current.visited.flatMap((visited, vertex) => visited ? [vertex] : [])} activeEdgeIds={current.activeEdgeIds} selectedEdgeIds={current.treeEdgeIds} label={t.graph} showWeights={false} /></div></div>
        <div className="grid gap-3 sm:grid-cols-2"><StatePills label={t.frontier} values={current.frontier} /><StatePills label={t.order} values={current.order} /></div>
        <CodePanel title={t.code} lines={codes[trace.algorithm]} activeLine={current.codeLine} />
      </TraceWorkspace>
    </div>
    <ConceptGrid items={[[t.layers, t.layersText], [t.depth, t.depthText], [t.complexity, t.complexityText]]} />
  </section>;
}
