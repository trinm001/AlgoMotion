"use client";

import { useState } from "react";
import { CodePanel } from "@/components/algorithm-lab-shared";
import { ActionButton, ConceptGrid, ErrorMessage, LabHeading, NumberInput, ParentForestDiagram, TraceWorkspace, ValueCells } from "@/components/phase-five-shared";
import { useTracePlayback } from "@/components/use-trace-playback";
import { createDsu, runFind, runUnion, type DsuState, type DsuTrace } from "@/lib/disjoint-set";
import type { Locale } from "@/lib/i18n";

const code = ["int find(int v) {", "  if (parent[v] == v) return v;", "  int root = find(parent[v]);", "  // root found", "  return parent[v] = root;", "}", "void unite(int a, int b) {", "  a = find(a); b = find(b);", "  if (size[a] < size[b]) swap(a, b);", "  parent[b] = a; size[a] += size[b];", "}"];
const copy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM DSU", title: "Hợp nhất tập và nén đường đi", intro: "Theo dõi rừng đại diện, mảng parent và size khi find/union biến đổi cấu trúc.", count: "Số nút", reset: "Khởi tạo", left: "Nút A", right: "Nút B", union: "Union", node: "Nút cần tìm", find: "Find", invalid: "Chỉ số phải nằm trong số nút hiện tại (2–12 nút).", forest: "Rừng đại diện", parents: "Mảng parent", sizes: "Kích thước tại gốc", step: "Bước", code: "C++ tương ứng", root: "Gốc", invariant: "Đại diện tập", invariantText: "Mỗi tập có đúng một gốc tự trỏ tới chính nó; mọi nút trong tập đều tìm về gốc này.", optimize: "Hai tối ưu", optimizeText: "Union by size giữ cây thấp; path compression nối các nút đã đi qua thẳng tới gốc.", complexity: "Độ phức tạp", complexityText: "Kết hợp hai tối ưu cho chi phí gần như O(1) trung bình, chính xác là O(α(n)) khấu hao." },
  en: { eyebrow: "DSU LAB", title: "Merge sets and compress paths", intro: "Follow the representative forest plus parent and size arrays as find/union transform them.", count: "Node count", reset: "Reset", left: "Node A", right: "Node B", union: "Union", node: "Find node", find: "Find", invalid: "Indices must fit the current set of 2–12 nodes.", forest: "Representative forest", parents: "Parent array", sizes: "Root sizes", step: "Step", code: "Matching C++", root: "Root", invariant: "Set representative", invariantText: "Each set has one root pointing to itself; every member resolves to that root.", optimize: "Two optimizations", optimizeText: "Union by size keeps trees shallow; path compression links visited nodes directly to the root.", complexity: "Complexity", complexityText: "Together they provide near-constant amortized operations: O(α(n))." },
} as const;

export function DisjointSetVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const initialState = createDsu(8);
  const initialTrace = runFind(initialState, 0);
  const [count, setCount] = useState(8); const [state, setState] = useState<DsuState>(initialState);
  const [left, setLeft] = useState(0); const [right, setRight] = useState(1); const [node, setNode] = useState(0);
  const [trace, setTrace] = useState<DsuTrace>(initialTrace); const [error, setError] = useState("");
  const playback = useTracePlayback(trace.steps.length); const current = trace.steps[playback.index];
  function begin(next: DsuTrace) { setTrace(next); setState(next.finalState); playback.setIndex(0); playback.setPlaying(false); setError(""); }
  function reset() { try { const next = createDsu(count); setState(next); setLeft(0); setRight(1); setNode(0); begin(runFind(next, 0)); } catch { setError(t.invalid); } }
  function unite() { try { begin(runUnion(state, left, right)); } catch { setError(t.invalid); } }
  function find() { try { begin(runFind(state, node)); } catch { setError(t.invalid); } }
  const badge = playback.index === trace.steps.length - 1 && trace.root !== null ? `${t.root}: ${trace.root}` : undefined;
  return <section className="mt-12" aria-labelledby="dsu-lab-title"><LabHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} id="dsu-lab-title" /><div className="surface mt-8 overflow-hidden rounded-3xl"><div className="grid gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6 lg:grid-cols-3"><div className="grid grid-cols-2 gap-2"><NumberInput label={t.count} value={count} onChange={setCount} min={2} max={12} /><div className="flex items-end"><ActionButton onClick={reset} primary className="w-full">{t.reset}</ActionButton></div></div><div className="grid grid-cols-3 gap-2"><NumberInput label={t.left} value={left} onChange={setLeft} min={0} max={state.parent.length - 1} /><NumberInput label={t.right} value={right} onChange={setRight} min={0} max={state.parent.length - 1} /><div className="flex items-end"><ActionButton onClick={unite} className="w-full">{t.union}</ActionButton></div></div><div className="grid grid-cols-2 gap-2"><NumberInput label={t.node} value={node} onChange={setNode} min={0} max={state.parent.length - 1} /><div className="flex items-end"><ActionButton onClick={find} className="w-full">{t.find}</ActionButton></div></div></div><ErrorMessage error={error} /><TraceWorkspace locale={locale} playback={playback} count={trace.steps.length} stepLabel={t.step} message={current.message[locale]} badge={badge}><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.forest}</p><div className="overflow-x-auto"><ParentForestDiagram parent={current.parent} active={current.activeNodes} label={t.forest} /></div></div><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.parents}</p><ValueCells values={current.parent} active={current.activeNodes} label="parent" /></div><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.sizes}</p><ValueCells values={current.size} active={current.activeNodes} label="size" /></div><CodePanel title={t.code} lines={code} activeLine={current.codeLine} /></TraceWorkspace></div><ConceptGrid items={[[t.invariant, t.invariantText], [t.optimize, t.optimizeText], [t.complexity, t.complexityText]]} /></section>;
}
