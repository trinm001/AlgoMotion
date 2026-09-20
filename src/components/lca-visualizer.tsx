"use client";

import { useState } from "react";
import { CodePanel } from "@/components/algorithm-lab-shared";
import { DirectionSelect, GraphDiagram } from "@/components/graph-diagram";
import { ActionButton, ConceptGrid, EdgeListInput, ErrorMessage, LabHeading, NumberInput, TraceWorkspace } from "@/components/phase-five-shared";
import { useTracePlayback } from "@/components/use-trace-playback";
import { parseGraph, type Graph } from "@/lib/graph";
import { runLca, type LcaTrace } from "@/lib/lowest-common-ancestor";
import type { Locale } from "@/lib/i18n";

const defaultEdges = "0 1\n0 2\n1 3\n1 4\n2 5\n2 6";
const defaultTree = parseGraph(7, defaultEdges, { weighted: false, directed: false });
const code = ["dfs(root, root);", "up[0][v] = parent; depth[v] = depth[parent] + 1;", "for (int k = 1; k < LOG; ++k)", "  up[k][v] = up[k-1][up[k-1][v]];", "", "int lca(int a, int b) {", "  if (depth[a] < depth[b]) swap(a, b);", "  lift a to depth[b];", "  if (a == b) return a;", "  for (int k = LOG - 1; k >= 0; --k)", "    if (up[k][a] != up[k][b])", "      a = up[k][a], b = up[k][b];", "  return up[0][a];", "}", "// O(n log n) build, O(log n) query"];
const copy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM LCA", title: "Nâng đỉnh bằng Binary Lifting", intro: "Tiền xử lý tổ tiên 2^k, cân bằng độ sâu rồi nâng đồng thời để tìm tổ tiên chung gần nhất.", vertices: "Số đỉnh", edges: "Cạnh: u v [w]", root: "Gốc", first: "Đỉnh A", second: "Đỉnh B", run: "Tìm LCA", invalid: "Dữ liệu phải là một cây vô hướng liên thông 2–10 đỉnh với đúng V-1 cạnh.", tree: "Cây", table: "Bảng tổ tiên up[k][v]", step: "Bước", code: "C++ tương ứng", result: "LCA", preprocess: "Tiền xử lý", preprocessText: "up[k][v] là tổ tiên cách v đúng 2^k cạnh, dựng từ hai bước 2^(k-1).", lift: "Nâng nhị phân", liftText: "Biểu diễn chênh lệch độ sâu theo bit để cân bằng hai đỉnh trong O(log n).", complexity: "Độ phức tạp", complexityText: "Dựng O(V log V), mỗi truy vấn LCA O(log V), bộ nhớ O(V log V)." },
  en: { eyebrow: "LCA LAB", title: "Lift vertices with Binary Lifting", intro: "Precompute 2^k ancestors, equalize depths, then lift both vertices to find their lowest common ancestor.", vertices: "Vertex count", edges: "Edges: u v [w]", root: "Root", first: "Vertex A", second: "Vertex B", run: "Find LCA", invalid: "Input must be one connected undirected 2–10 vertex tree with exactly V-1 edges.", tree: "Tree", table: "Ancestor table up[k][v]", step: "Step", code: "Matching C++", result: "LCA", preprocess: "Preprocessing", preprocessText: "up[k][v] is the ancestor 2^k edges above v, composed from two 2^(k-1) jumps.", lift: "Binary lifting", liftText: "Use the bits of the depth difference to align both vertices in O(log n).", complexity: "Complexity", complexityText: "O(V log V) preprocessing, O(log V) per query, and O(V log V) memory." },
} as const;

export function LcaVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const initial = runLca(defaultTree, 0, 3, 6);
  const [vertexCount, setVertexCount] = useState(7);
  const [edgeInput, setEdgeInput] = useState(defaultEdges);
  const [root, setRoot] = useState(0);
  const [first, setFirst] = useState(3);
  const [second, setSecond] = useState(6);
  const [directed, setDirected] = useState(false);
  const [graph, setGraph] = useState<Graph>(defaultTree);
  const [trace, setTrace] = useState<LcaTrace>(initial);
  const [error, setError] = useState("");
  const playback = useTracePlayback(trace.steps.length);
  const current = trace.steps[playback.index];

  function run() {
    try {
      const nextGraph = parseGraph(vertexCount, edgeInput, { weighted: false, directed });
      const nextTrace = runLca(nextGraph, root, first, second);
      setGraph(nextGraph);
      setTrace(nextTrace);
      playback.setIndex(0);
      playback.setPlaying(false);
      setError("");
    } catch {
      setError(t.invalid);
    }
  }

  const annotations = current.depth.map((depth) => depth < 0 ? "d=?" : `d=${depth}`);
  return <section className="mt-12" aria-labelledby="lca-lab-title"><LabHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} id="lca-lab-title" /><div className="surface mt-8 overflow-hidden rounded-3xl"><div className="grid items-end gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6 lg:grid-cols-4 xl:grid-cols-[.5fr_1.5fr_.45fr_.45fr_.45fr_.7fr_auto]"><NumberInput label={t.vertices} value={vertexCount} onChange={setVertexCount} min={2} max={10} /><EdgeListInput label={t.edges} value={edgeInput} onChange={setEdgeInput} id="lca-edges" /><NumberInput label={t.root} value={root} onChange={setRoot} min={0} max={vertexCount - 1} /><NumberInput label={t.first} value={first} onChange={setFirst} min={0} max={vertexCount - 1} /><NumberInput label={t.second} value={second} onChange={setSecond} min={0} max={vertexCount - 1} /><DirectionSelect locale={locale} directed={directed} onChange={setDirected} /><div className="flex items-end"><ActionButton onClick={run} primary>{t.run}</ActionButton></div></div><ErrorMessage error={error} /><TraceWorkspace locale={locale} playback={playback} count={trace.steps.length} stepLabel={t.step} message={current.message[locale]} badge={current.result === null ? undefined : `${t.result}: ${current.result}`}><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.tree}</p><div className="overflow-x-auto"><GraphDiagram graph={graph} locale={locale} activeVertices={current.activeVertices} activeEdgeIds={current.activeEdgeIds} annotations={annotations} label={t.tree} showWeights={false} layout="tree" treeRoot={root} /></div></div><AncestorTable up={current.up} active={current.activeVertices} label={t.table} /><CodePanel title={t.code} lines={code} activeLine={current.codeLine} /></TraceWorkspace></div><ConceptGrid items={[[t.preprocess, t.preprocessText], [t.lift, t.liftText], [t.complexity, t.complexityText]]} /></section>;
}

function AncestorTable({ up, active, label }: { up: number[][]; active: number[]; label: string }) {
  return <div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{label}</p><div className="overflow-x-auto rounded-2xl border border-[var(--line)]"><table className="w-full min-w-[36rem] border-collapse font-mono text-sm"><thead><tr className="bg-[var(--surface-strong)]"><th className="p-2 text-left">k / v</th>{up[0].map((_, vertex) => <th key={vertex} className="p-2">{vertex}</th>)}</tr></thead><tbody>{up.map((row, level) => <tr key={level} className="border-t border-[var(--line)]"><th className="p-2 text-left text-[var(--muted)]">{level}</th>{row.map((ancestor, vertex) => <td key={vertex} className={`p-2 text-center font-black ${active.includes(vertex) ? "bg-[var(--accent)] text-white" : ""}`}>{ancestor}</td>)}</tr>)}</tbody></table></div></div>;
}
