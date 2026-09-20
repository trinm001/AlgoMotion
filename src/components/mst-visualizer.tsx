"use client";

import { useState } from "react";
import { CodePanel } from "@/components/algorithm-lab-shared";
import { GraphDiagram, StatePills } from "@/components/graph-diagram";
import { ActionButton, ConceptGrid, ErrorMessage, LabHeading, NumberInput, TextInput, TraceWorkspace } from "@/components/phase-five-shared";
import { useTracePlayback } from "@/components/use-trace-playback";
import { parseGraph, type Graph } from "@/lib/graph";
import { runKruskal, runPrim, type MstAlgorithm, type MstTrace } from "@/lib/minimum-spanning-tree";
import type { Locale } from "@/lib/i18n";

const defaultEdges = "0-1:4, 0-2:1, 1-2:2, 1-3:5, 2-3:3, 2-4:7, 3-4:2";
const defaultGraph = parseGraph(5, defaultEdges, { weighted: true, directed: false });
const codes = {
  kruskal: ["sort(edges.begin(), edges.end());", "DSU dsu(n);", "for (auto [w, u, v] : edges) {", "  if (dsu.find(u) == dsu.find(v))", "    continue;", "  dsu.unite(u, v);", "  mst.push_back({u, v}); total += w;", "  if (mst.size() == n - 1) break;", "}"],
  prim: ["used[start] = true;", "push_edges(start);", "while (mst.size() < n - 1) {", "  auto [w, u, v] = pq.top(); pq.pop();", "  if (used[v]) continue;", "  used[v] = true;", "  mst.push_back({u, v}); total += w;", "  push_edges(v);", "}"],
};
const copy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM MST", title: "Dựng cây khung nhỏ nhất", intro: "So sánh Kruskal chọn cạnh toàn cục và Prim mở rộng một cây qua lát cắt.", vertices: "Số đỉnh", edges: "Cạnh u-v:w", algorithm: "Thuật toán", run: "Dựng MST", invalid: "Đồ thị phải vô hướng, liên thông, gồm 2–10 đỉnh và cạnh có trọng số hợp lệ.", graph: "Đồ thị vô hướng", selected: "Cạnh đã chọn", total: "Tổng", step: "Bước", code: "C++ tương ứng", cut: "Tính chất lát cắt", cutText: "Cạnh nhẹ nhất băng qua một lát cắt an toàn luôn có thể thuộc một MST.", cycle: "Tránh chu trình", cycleText: "Kruskal dùng DSU để bỏ cạnh nối hai đỉnh đã cùng thành phần.", complexity: "Độ phức tạp", complexityText: "Kruskal O(E log E); Prim với priority queue O(E log V)." },
  en: { eyebrow: "MST LAB", title: "Build a minimum spanning tree", intro: "Compare Kruskal's global edge order with Prim's growth across a cut.", vertices: "Vertex count", edges: "Edges u-v:w", algorithm: "Algorithm", run: "Build MST", invalid: "Use a connected undirected graph with 2–10 vertices and valid weighted edges.", graph: "Undirected graph", selected: "Selected edges", total: "Total", step: "Step", code: "Matching C++", cut: "Cut property", cutText: "A lightest edge crossing a cut is safe for some MST.", cycle: "Avoid cycles", cycleText: "Kruskal uses DSU to reject edges whose endpoints are already connected.", complexity: "Complexity", complexityText: "Kruskal takes O(E log E); Prim with a priority queue takes O(E log V)." },
} as const;

export function MstVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale]; const initial = runKruskal(defaultGraph);
  const [vertexCount, setVertexCount] = useState(5); const [edgeInput, setEdgeInput] = useState(defaultEdges); const [algorithm, setAlgorithm] = useState<MstAlgorithm>("kruskal");
  const [graph, setGraph] = useState<Graph>(defaultGraph); const [trace, setTrace] = useState<MstTrace>(initial); const [error, setError] = useState("");
  const playback = useTracePlayback(trace.steps.length); const current = trace.steps[playback.index];
  function run() { try { const nextGraph = parseGraph(vertexCount, edgeInput, { weighted: true, directed: false }); const nextTrace = algorithm === "kruskal" ? runKruskal(nextGraph) : runPrim(nextGraph); setGraph(nextGraph); setTrace(nextTrace); playback.setIndex(0); playback.setPlaying(false); setError(""); } catch { setError(t.invalid); } }
  const selectedLabels = current.selectedEdgeIds.map((id) => { const edge = graph.edges[id]; return `${edge.from}-${edge.to}:${edge.weight}`; });
  return <section className="mt-12" aria-labelledby="mst-lab-title"><LabHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} id="mst-lab-title" /><div className="surface mt-8 overflow-hidden rounded-3xl"><div className="grid gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6 lg:grid-cols-[.55fr_1.8fr_.65fr_auto]"><NumberInput label={t.vertices} value={vertexCount} onChange={setVertexCount} min={2} max={10} /><TextInput label={t.edges} value={edgeInput} onChange={setEdgeInput} id="mst-edges" /><select aria-label={t.algorithm} value={algorithm} onChange={(event) => setAlgorithm(event.target.value as MstAlgorithm)} className="h-11 self-end rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 font-bold text-[var(--foreground)]"><option value="kruskal">Kruskal</option><option value="prim">Prim</option></select><div className="flex items-end"><ActionButton onClick={run} primary>{t.run}</ActionButton></div></div><ErrorMessage error={error} /><TraceWorkspace locale={locale} playback={playback} count={trace.steps.length} stepLabel={t.step} message={current.message[locale]} badge={`${t.total}: ${current.totalWeight}`}><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.graph}</p><div className="overflow-x-auto"><GraphDiagram graph={graph} activeVertices={current.activeVertices} activeEdgeIds={current.activeEdgeIds} selectedEdgeIds={current.selectedEdgeIds} label={t.graph} /></div></div><StatePills label={t.selected} values={selectedLabels} /><CodePanel title={t.code} lines={codes[trace.algorithm]} activeLine={current.codeLine} /></TraceWorkspace></div><ConceptGrid items={[[t.cut, t.cutText], [t.cycle, t.cycleText], [t.complexity, t.complexityText]]} /></section>;
}
