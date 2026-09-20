"use client";

import { useState } from "react";
import { CodePanel } from "@/components/algorithm-lab-shared";
import { ActionButton, BinaryHeapDiagram, ConceptGrid, ErrorMessage, LabHeading, NumberInput, TextInput, TraceWorkspace, ValueCells } from "@/components/phase-five-shared";
import { useTracePlayback } from "@/components/use-trace-playback";
import { buildHeap, popHeap, pushHeap, type HeapKind, type HeapTrace } from "@/lib/heap";
import type { Locale } from "@/lib/i18n";

const defaults = [7, 2, 9, 1, 5, 3, 8];
const code = ["vector<int> heap;", "void sift_down(int i) {", "  while (2 * i + 1 < heap.size()) {", "    int child = better_child(i);", "    if (!better(heap[child], heap[i])) break;", "    swap(heap[i], heap[child]);", "  }", "}", "// push: append + sift up", "// pop: replace root + sift down"];
const copy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM HEAP", title: "Giữ phần tử ưu tiên ở gốc", intro: "Quan sát cùng một heap dưới hai dạng: mảng liên tiếp và cây nhị phân hoàn chỉnh.", array: "Dữ liệu đầu vào", kind: "Loại heap", min: "Min Heap", max: "Max Heap", build: "Dựng heap", value: "Giá trị mới", push: "Thêm", pop: "Xóa gốc", invalid: "Nhập 1–15 số nguyên từ -99 đến 99.", tree: "Biểu diễn cây", storage: "Biểu diễn mảng", step: "Bước", code: "C++ tương ứng", removed: "Đã xóa", invariant: "Bất biến heap", invariantText: "Mỗi nút luôn ưu tiên hơn hoặc bằng các con của nó; cây đồng thời luôn là cây nhị phân hoàn chỉnh.", complexity: "Độ phức tạp", complexityText: "Thêm và xóa gốc mất O(log n); dựng heap từ mảng bằng sift-down mất O(n).", layout: "Hai góc nhìn", layoutText: "Con trái và phải của i nằm tại 2i+1 và 2i+2, nên không cần lưu con trỏ." },
  en: { eyebrow: "HEAP LAB", title: "Keep the priority element at the root", intro: "Inspect the same heap as both a contiguous array and a complete binary tree.", array: "Input values", kind: "Heap kind", min: "Min Heap", max: "Max Heap", build: "Build heap", value: "New value", push: "Push", pop: "Pop root", invalid: "Enter 1–15 integers from -99 through 99.", tree: "Tree representation", storage: "Array representation", step: "Step", code: "Matching C++", removed: "Removed", invariant: "Heap invariant", invariantText: "Every node has at least as much priority as its children, while the shape stays a complete binary tree.", complexity: "Complexity", complexityText: "Push and root removal take O(log n); bottom-up heap construction takes O(n).", layout: "Two views", layoutText: "The children of i are at 2i+1 and 2i+2, so pointers are unnecessary." },
} as const;

export function HeapVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const initial = buildHeap(defaults, "min");
  const [input, setInput] = useState(defaults.join(", "));
  const [kind, setKind] = useState<HeapKind>("min");
  const [values, setValues] = useState(initial.finalValues);
  const [value, setValue] = useState(4);
  const [trace, setTrace] = useState<HeapTrace>(initial);
  const [error, setError] = useState("");
  const playback = useTracePlayback(trace.steps.length);
  const current = trace.steps[playback.index];
  function begin(next: HeapTrace) { setTrace(next); setValues(next.finalValues); setInput(next.finalValues.join(", ")); playback.setIndex(0); playback.setPlaying(false); setError(""); }
  function build() { try { begin(buildHeap(input.split(/[\s,]+/).filter(Boolean).map(Number), kind)); } catch { setError(t.invalid); } }
  function changeKind(nextKind: HeapKind) { try { setKind(nextKind); begin(buildHeap(values, nextKind)); } catch { setError(t.invalid); } }
  function push() { try { begin(pushHeap(values, kind, value)); } catch { setError(t.invalid); } }
  function pop() { try { begin(popHeap(values, kind)); } catch { setError(t.invalid); } }
  const badge = playback.index === trace.steps.length - 1 && trace.removed !== null ? `${t.removed}: ${trace.removed}` : undefined;
  return <section className="mt-12" aria-labelledby="heap-lab-title"><LabHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} id="heap-lab-title" /><div className="surface mt-8 overflow-hidden rounded-3xl"><div className="grid gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6 lg:grid-cols-[1.5fr_auto_1fr]"><div className="flex items-end gap-2"><TextInput label={t.array} value={input} onChange={setInput} id="heap-array" /><ActionButton onClick={build} primary>{t.build}</ActionButton></div><label className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.kind}<select aria-label={t.kind} value={kind} onChange={(event) => changeKind(event.target.value as HeapKind)} className="mt-2 block h-11 rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 text-[var(--foreground)]"><option value="min">{t.min}</option><option value="max">{t.max}</option></select></label><div className="grid grid-cols-2 gap-2"><NumberInput label={t.value} value={value} onChange={setValue} min={-99} max={99} /><div className="flex items-end gap-2"><ActionButton onClick={push}>{t.push}</ActionButton><ActionButton onClick={pop}>{t.pop}</ActionButton></div></div></div><ErrorMessage error={error} /><TraceWorkspace locale={locale} playback={playback} count={trace.steps.length} stepLabel={t.step} message={current.message[locale]} badge={badge}><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.tree}</p><div className="overflow-x-auto"><BinaryHeapDiagram values={current.values} active={current.activeIndices} label={t.tree} /></div></div><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.storage}</p><ValueCells values={current.values} active={current.activeIndices} label="heap" /></div><CodePanel title={t.code} lines={code} activeLine={current.codeLine} /></TraceWorkspace></div><ConceptGrid items={[[t.invariant, t.invariantText], [t.complexity, t.complexityText], [t.layout, t.layoutText]]} /></section>;
}
