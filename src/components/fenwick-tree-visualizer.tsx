"use client";

import { useEffect, useState } from "react";
import { CodePanel, ConceptCard, LabControls, LabProgress } from "@/components/algorithm-lab-shared";
import { buildFenwickTree, queryFenwickRange, updateFenwickTree, type FenwickTrace } from "@/lib/fenwick-tree";
import type { Locale } from "@/lib/i18n";

const DEFAULT_VALUES = [3, 2, 5, 1, 4, 6, 2, 7];
const initialTrace = buildFenwickTree(DEFAULT_VALUES);
const cppLines = [
  "vector<int> bit(n + 1, 0);",
  "void add(int index, int delta) {",
  "  for (++index; index <= n; index += index & -index)",
  "    bit[index] += delta;",
  "}",
  "int prefix_sum(int index) {",
  "  int result = 0;",
  "  for (++index; index > 0; index -= index & -index)",
  "    result += bit[index];",
  "  return result;",
  "}",
];

const copy = {
  vi: {
    eyebrow: "PHÒNG THÍ NGHIỆM FENWICK",
    title: "Theo dấu lowbit trên cây Fenwick",
    intro: "bit[i] lưu tổng của đoạn kết thúc tại i. lowbit quyết định độ dài đoạn và đường nhảy khi truy vấn hoặc cập nhật.",
    array: "Mảng đầu vào", rebuild: "Dựng lại", invalidArray: "Nhập từ 2 đến 12 số nguyên, mỗi số từ -99 đến 99.",
    query: "Truy vấn tổng đoạn", update: "Cập nhật điểm", left: "Trái", right: "Phải", index: "Vị trí", value: "Giá trị mới",
    runQuery: "Chạy truy vấn", runUpdate: "Chạy cập nhật", invalidRange: "Đoạn truy vấn không hợp lệ.", invalidUpdate: "Vị trí cập nhật không hợp lệ.",
    tree: "Các ô Fenwick (chỉ số từ 1)", arrayState: "Mảng gốc (chỉ số từ 0)", result: "Kết quả", step: "Bước",
    reset: "Về đầu", previous: "Lùi", play: "Chạy", pause: "Dừng", next: "Tiếp", code: "C++ tương ứng",
    invariant: "Đoạn mà bit[i] quản lý", invariantText: "bit[i] chứa tổng từ i - lowbit(i) + 1 đến i theo chỉ số Fenwick bắt đầu từ 1.",
    complexity: "Độ phức tạp", complexityText: "Truy vấn tiền tố và cập nhật điểm đều đi qua tối đa O(log n) ô; bộ nhớ O(n).",
    comparison: "Khi nào nên dùng", comparisonText: "Fenwick Tree ngắn gọn và nhẹ cho tổng tiền tố; Segment Tree linh hoạt hơn với nhiều phép gộp và lazy propagation.",
  },
  en: {
    eyebrow: "FENWICK LAB", title: "Follow lowbit through a Fenwick tree",
    intro: "bit[i] stores a sum ending at i. lowbit determines both its range length and the jumps made by queries and updates.",
    array: "Input array", rebuild: "Rebuild", invalidArray: "Enter 2 to 12 integers from -99 to 99.",
    query: "Range-sum query", update: "Point update", left: "Left", right: "Right", index: "Index", value: "New value",
    runQuery: "Run query", runUpdate: "Run update", invalidRange: "The query range is invalid.", invalidUpdate: "The update index is invalid.",
    tree: "Fenwick cells (one-based)", arrayState: "Source array (zero-based)", result: "Result", step: "Step",
    reset: "Start over", previous: "Previous", play: "Play", pause: "Pause", next: "Next", code: "Matching C++",
    invariant: "The range owned by bit[i]", invariantText: "bit[i] stores the sum from i - lowbit(i) + 1 through i using one-based Fenwick indices.",
    complexity: "Complexity", complexityText: "Prefix queries and point updates each visit at most O(log n) cells; memory is O(n).",
    comparison: "When to use it", comparisonText: "Fenwick trees are compact for prefix sums; segment trees are more flexible for other merges and lazy propagation.",
  },
} as const;

export function FenwickTreeVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [arrayInput, setArrayInput] = useState(DEFAULT_VALUES.join(", "));
  const [values, setValues] = useState(initialTrace.finalValues);
  const [tree, setTree] = useState(initialTrace.finalTree);
  const [trace, setTrace] = useState<FenwickTrace>(initialTrace);
  const [stepIndex, setStepIndex] = useState(initialTrace.steps.length - 1);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const [left, setLeft] = useState(2);
  const [right, setRight] = useState(6);
  const [target, setTarget] = useState(3);
  const [nextValue, setNextValue] = useState(8);
  const current = trace.steps[stepIndex];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setStepIndex((index) => {
      if (index >= trace.steps.length - 1) { setPlaying(false); return index; }
      return index + 1;
    }), 800);
    return () => window.clearInterval(timer);
  }, [playing, trace.steps.length]);

  function begin(next: FenwickTrace) { setTrace(next); setStepIndex(0); setPlaying(false); setError(""); }
  function rebuild() {
    const parsed = arrayInput.split(/[\s,]+/).filter(Boolean).map(Number);
    if (parsed.length < 2 || parsed.length > 12 || parsed.some((value) => !Number.isInteger(value) || Math.abs(value) > 99)) { setError(t.invalidArray); return; }
    const next = buildFenwickTree(parsed);
    setValues(next.finalValues); setTree(next.finalTree); setLeft(0); setRight(parsed.length - 1); setTarget(0); begin(next);
  }
  function query() { try { begin(queryFenwickRange(tree, values, left, right)); } catch { setError(t.invalidRange); } }
  function update() { try { const next = updateFenwickTree(tree, values, target, nextValue); setValues(next.finalValues); setTree(next.finalTree); setArrayInput(next.finalValues.join(", ")); begin(next); } catch { setError(t.invalidUpdate); } }

  return (
    <section className="mt-12" aria-labelledby="fenwick-lab-title">
      <p className="eyebrow">{t.eyebrow}</p><h2 id="fenwick-lab-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t.title}</h2>
      <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">{t.intro}</p>
      <div className="surface mt-8 overflow-hidden rounded-3xl">
        <div className="grid gap-4 border-b border-[var(--line)] bg-[var(--surface)] p-4 lg:grid-cols-[1.35fr_1fr_1fr] lg:p-6">
          <fieldset><label htmlFor="fenwick-array" className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.array}</label><div className="mt-2 flex gap-2"><input id="fenwick-array" value={arrayInput} onChange={(event) => setArrayInput(event.target.value)} className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 py-2 font-mono outline-none focus:border-[var(--brand)]" /><button type="button" onClick={rebuild} className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-black text-white">{t.rebuild}</button></div></fieldset>
          <Operation title={t.query}><NumberField label={t.left} value={left} max={values.length - 1} setValue={setLeft} /><NumberField label={t.right} value={right} max={values.length - 1} setValue={setRight} /><Action onClick={query}>{t.runQuery}</Action></Operation>
          <Operation title={t.update}><NumberField label={t.index} value={target} max={values.length - 1} setValue={setTarget} /><NumberField label={t.value} value={nextValue} min={-99} max={99} setValue={setNextValue} /><Action onClick={update}>{t.runUpdate}</Action></Operation>
        </div>
        {error ? <p role="alert" className="border-b border-[var(--line)] bg-red-50 px-6 py-3 text-sm font-bold text-[var(--danger)] dark:bg-red-950/20">{error}</p> : null}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-6 p-4 sm:p-6">
            <div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.tree}</p><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {current.tree.slice(1).map((value, offset) => { const index = offset + 1; const active = current.activeTreeIndices.includes(index); return <div key={index} className={`rounded-xl border p-3 transition ${active ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--line)] bg-[var(--surface)]"}`}><div className="flex items-center justify-between font-mono text-xs opacity-70"><span>bit[{index}]</span><span>[{index - (index & -index) + 1}, {index}]</span></div><p className="mt-2 text-center font-mono text-xl font-black">{value}</p></div>; })}
            </div></div>
            <div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.arrayState}</p><div className="flex flex-wrap gap-2">{current.values.map((value, index) => <div key={index} className={`grid h-12 w-12 place-items-center rounded-xl border font-mono font-black ${current.activeArrayIndices.includes(index) ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--line)] bg-[var(--surface)]"}`}><span>{value}</span><span className="sr-only">index {index}</span></div>)}</div></div>
            <CodePanel title={t.code} lines={cppLines} activeLine={current.codeLine} />
          </div>
          <aside className="border-t border-[var(--line)] bg-[var(--surface)] p-5 lg:border-l lg:border-t-0"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.step} {stepIndex + 1} / {trace.steps.length}</p>{current.result !== null ? <span className="rounded-lg bg-[var(--brand-soft)] px-3 py-1 text-sm font-black text-[var(--brand)]">{t.result}: {current.result}</span> : null}</div><p className="mt-4 min-h-28 text-lg font-bold leading-7" aria-live="polite">{current.message[locale]}</p><LabProgress index={stepIndex} count={trace.steps.length} /><div className="mt-6"><LabControls labels={t} index={stepIndex} count={trace.steps.length} playing={playing} onIndex={setStepIndex} onPlaying={setPlaying} /></div></aside>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3"><ConceptCard number="01" title={t.invariant}>{t.invariantText}</ConceptCard><ConceptCard number="02" title={t.complexity}>{t.complexityText}</ConceptCard><ConceptCard number="03" title={t.comparison}>{t.comparisonText}</ConceptCard></div>
    </section>
  );
}

function Operation({ title, children }: { title: string; children: React.ReactNode }) { return <fieldset className="grid grid-cols-2 gap-2"><legend className="col-span-2 mb-2 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{title}</legend>{children}</fieldset>; }
function NumberField({ label, value, setValue, min = 0, max }: { label: string; value: number; setValue: (value: number) => void; min?: number; max: number }) { return <label className="rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--muted)]">{label}<input aria-label={label} type="number" min={min} max={max} value={value} onChange={(event) => setValue(Number(event.target.value))} className="mt-1 w-full bg-transparent font-mono text-base font-black text-[var(--foreground)] outline-none" /></label>; }
function Action({ children, onClick }: { children: React.ReactNode; onClick: () => void }) { return <button type="button" onClick={onClick} className="col-span-2 rounded-xl border border-[var(--brand)] px-3 py-2 text-sm font-black text-[var(--brand)]">{children}</button>; }

