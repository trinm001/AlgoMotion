"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildSegmentTree,
  querySegmentTree,
  updateSegmentTree,
  type SegmentTreeNode,
  type SegmentTreeTrace,
} from "@/lib/segment-tree";
import type { Locale } from "@/lib/i18n";

const DEFAULT_VALUES = [2, 1, 5, 3, 4, 7];
const initialTrace = buildSegmentTree(DEFAULT_VALUES);

const copy = {
  vi: {
    eyebrow: "PHÒNG THÍ NGHIỆM TƯƠNG TÁC",
    title: "Quan sát cây phân đoạn hoạt động",
    intro: "Mỗi nút lưu tổng của một đoạn liên tiếp. Chọn một thao tác rồi đi từng bước để xem cây chỉ ghé các nút cần thiết.",
    array: "Mảng đầu vào",
    rebuild: "Dựng lại cây",
    invalidArray: "Nhập từ 2 đến 8 số nguyên, cách nhau bằng dấu phẩy.",
    invalidRange: "Đoạn truy vấn phải nằm trong mảng và có đầu trái không lớn hơn đầu phải.",
    invalidUpdate: "Vị trí cập nhật phải nằm trong mảng.",
    query: "Truy vấn tổng đoạn",
    update: "Cập nhật một phần tử",
    left: "Trái",
    right: "Phải",
    index: "Vị trí",
    value: "Giá trị mới",
    runQuery: "Chạy truy vấn",
    runUpdate: "Chạy cập nhật",
    result: "Kết quả",
    step: "Bước",
    reset: "Về đầu",
    previous: "Lùi",
    play: "Chạy",
    pause: "Dừng",
    next: "Tiếp",
    arrayState: "Trạng thái mảng",
    treeState: "Cây phân đoạn",
    nodeLegend: "Nút đang được xét",
    rangeLegend: "Phần tử đang liên quan",
    invariant: "Bất biến cốt lõi",
    invariantText: "Giá trị tại mỗi nút luôn bằng tổng của toàn bộ đoạn mà nút đó quản lý.",
    complexity: "Độ phức tạp",
    complexityText: "Dựng cây O(n). Truy vấn đoạn và cập nhật điểm đều O(log n). Bộ nhớ O(n).",
    convention: "Quy ước chỉ số",
    conventionText: "Mô phỏng dùng chỉ số từ 0 và đoạn đóng [l, r], nghĩa là gồm cả hai đầu mút.",
  },
  en: {
    eyebrow: "INTERACTIVE LAB",
    title: "Watch a segment tree work",
    intro: "Each node stores the sum of one contiguous range. Choose an operation and step through the nodes the tree actually visits.",
    array: "Input array",
    rebuild: "Rebuild tree",
    invalidArray: "Enter 2 to 8 integers separated by commas.",
    invalidRange: "The query range must stay inside the array and its left endpoint cannot exceed its right endpoint.",
    invalidUpdate: "The update index must stay inside the array.",
    query: "Range-sum query",
    update: "Point update",
    left: "Left",
    right: "Right",
    index: "Index",
    value: "New value",
    runQuery: "Run query",
    runUpdate: "Run update",
    result: "Result",
    step: "Step",
    reset: "Start over",
    previous: "Previous",
    play: "Play",
    pause: "Pause",
    next: "Next",
    arrayState: "Array state",
    treeState: "Segment tree",
    nodeLegend: "Active node",
    rangeLegend: "Relevant value",
    invariant: "Core invariant",
    invariantText: "The value at every node always equals the sum of the complete range that node owns.",
    complexity: "Complexity",
    complexityText: "Build in O(n). Range queries and point updates both take O(log n). Memory is O(n).",
    convention: "Index convention",
    conventionText: "The lab uses zero-based indices and closed ranges [l, r], so both endpoints are included.",
  },
} as const;

export function SegmentTreeVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [arrayInput, setArrayInput] = useState(DEFAULT_VALUES.join(", "));
  const [values, setValues] = useState(initialTrace.finalValues);
  const [nodes, setNodes] = useState(initialTrace.finalNodes);
  const [trace, setTrace] = useState<SegmentTreeTrace>(initialTrace);
  const [stepIndex, setStepIndex] = useState(initialTrace.steps.length - 1);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const [queryLeft, setQueryLeft] = useState(1);
  const [queryRight, setQueryRight] = useState(4);
  const [updateIndex, setUpdateIndex] = useState(2);
  const [updateValue, setUpdateValue] = useState(8);

  const step = trace.steps[stepIndex];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStepIndex((current) => {
        if (current >= trace.steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 850);
    return () => window.clearInterval(timer);
  }, [playing, trace.steps.length]);

  function startTrace(nextTrace: SegmentTreeTrace) {
    setTrace(nextTrace);
    setStepIndex(0);
    setPlaying(false);
    setError("");
  }

  function rebuild() {
    const parsed = arrayInput
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(Number);
    if (
      parsed.length < 2 ||
      parsed.length > 8 ||
      parsed.some((value) => !Number.isInteger(value) || Math.abs(value) > 99)
    ) {
      setError(t.invalidArray);
      return;
    }
    const nextTrace = buildSegmentTree(parsed);
    setValues(nextTrace.finalValues);
    setNodes(nextTrace.finalNodes);
    setQueryLeft(0);
    setQueryRight(parsed.length - 1);
    setUpdateIndex(0);
    startTrace(nextTrace);
  }

  function runQuery() {
    try {
      startTrace(querySegmentTree(nodes, values, queryLeft, queryRight));
    } catch {
      setError(t.invalidRange);
    }
  }

  function runUpdate() {
    try {
      const nextTrace = updateSegmentTree(nodes, values, updateIndex, updateValue);
      setValues(nextTrace.finalValues);
      setNodes(nextTrace.finalNodes);
      setArrayInput(nextTrace.finalValues.join(", "));
      startTrace(nextTrace);
    } catch {
      setError(t.invalidUpdate);
    }
  }

  return (
    <section className="mt-12" aria-labelledby="segment-tree-lab-title">
      <p className="eyebrow">{t.eyebrow}</p>
      <h2 id="segment-tree-lab-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        {t.title}
      </h2>
      <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">{t.intro}</p>

      <div className="surface mt-8 overflow-hidden rounded-3xl">
        <div className="grid gap-4 border-b border-[var(--line)] bg-[var(--surface)] p-4 lg:grid-cols-[1.35fr_1fr_1fr] lg:p-6">
          <fieldset>
            <label className="text-xs font-black uppercase tracking-wider text-[var(--muted)]" htmlFor="segment-array">
              {t.array}
            </label>
            <div className="mt-2 flex gap-2">
              <input
                id="segment-array"
                value={arrayInput}
                onChange={(event) => setArrayInput(event.target.value)}
                className="min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 py-2 font-mono outline-none focus:border-[var(--brand)]"
              />
              <button type="button" onClick={rebuild} className="rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-black text-white">
                {t.rebuild}
              </button>
            </div>
          </fieldset>

          <OperationPanel title={t.query}>
            <NumberField label={t.left} value={queryLeft} max={values.length - 1} onChange={setQueryLeft} />
            <NumberField label={t.right} value={queryRight} max={values.length - 1} onChange={setQueryRight} />
            <button type="button" onClick={runQuery} className="col-span-2 rounded-xl border border-[var(--brand)] px-3 py-2 text-sm font-black text-[var(--brand)]">
              {t.runQuery}
            </button>
          </OperationPanel>

          <OperationPanel title={t.update}>
            <NumberField label={t.index} value={updateIndex} max={values.length - 1} onChange={setUpdateIndex} />
            <NumberField label={t.value} value={updateValue} min={-99} max={99} onChange={setUpdateValue} />
            <button type="button" onClick={runUpdate} className="col-span-2 rounded-xl border border-[var(--brand)] px-3 py-2 text-sm font-black text-[var(--brand)]">
              {t.runUpdate}
            </button>
          </OperationPanel>
        </div>

        {error ? <p role="alert" className="border-b border-[var(--line)] bg-red-50 px-6 py-3 text-sm font-bold text-[var(--danger)] dark:bg-red-950/20">{error}</p> : null}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.treeState}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  <span className="mr-4"><span className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-[var(--brand)]" />{t.nodeLegend}</span>
                  <span><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-[var(--accent)]" />{t.rangeLegend}</span>
                </p>
              </div>
              {step.result !== null ? (
                <div className="rounded-xl bg-[var(--brand-soft)] px-4 py-2 text-sm font-black text-[var(--brand)]">
                  {t.result}: {step.result}
                </div>
              ) : null}
            </div>

            <TreeDiagram nodes={step.nodes} activeNodeIds={step.activeNodeIds} />

            <div className="mt-5">
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.arrayState}</p>
              <div className="flex flex-wrap gap-2">
                {step.values.map((value, index) => (
                  <div
                    key={index}
                    className={`grid h-12 w-12 place-items-center rounded-xl border font-mono font-black transition ${
                      step.activeIndices.includes(index)
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--line)] bg-[var(--surface)]"
                    }`}
                  >
                    <span>{value}</span>
                    <span className="sr-only">index {index}</span>
                  </div>
                ))}
              </div>
              <div className="mt-1 flex flex-wrap gap-2" aria-hidden="true">
                {step.values.map((_, index) => <span className="w-12 text-center font-mono text-[10px] text-[var(--muted)]" key={index}>{index}</span>)}
              </div>
            </div>
          </div>

          <aside className="border-t border-[var(--line)] bg-[var(--surface)] p-5 lg:border-l lg:border-t-0">
            <p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">
              {t.step} {stepIndex + 1} / {trace.steps.length}
            </p>
            <p className="mt-4 min-h-24 text-lg font-bold leading-7" aria-live="polite">{step.message[locale]}</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-strong)]">
              <div className="h-full rounded-full bg-[var(--brand)] transition-all" style={{ width: `${((stepIndex + 1) / trace.steps.length) * 100}%` }} />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2">
              <Control label={t.reset} onClick={() => { setStepIndex(0); setPlaying(false); }}>↺</Control>
              <Control label={t.previous} disabled={stepIndex === 0} onClick={() => { setStepIndex((index) => Math.max(0, index - 1)); setPlaying(false); }}>←</Control>
              <Control label={playing ? t.pause : t.play} primary onClick={() => {
                if (stepIndex === trace.steps.length - 1) setStepIndex(0);
                setPlaying((value) => !value);
              }}>{playing ? "Ⅱ" : "▶"}</Control>
              <Control label={t.next} disabled={stepIndex === trace.steps.length - 1} onClick={() => { setStepIndex((index) => Math.min(trace.steps.length - 1, index + 1)); setPlaying(false); }}>→</Control>
            </div>
          </aside>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ConceptCard number="01" title={t.invariant}>{t.invariantText}</ConceptCard>
        <ConceptCard number="02" title={t.complexity}>{t.complexityText}</ConceptCard>
        <ConceptCard number="03" title={t.convention}>{t.conventionText}</ConceptCard>
      </div>
    </section>
  );
}

function TreeDiagram({ nodes, activeNodeIds }: { nodes: SegmentTreeNode[]; activeNodeIds: number[] }) {
  const maxDepth = Math.max(1, ...nodes.map((node) => node.depth));
  const maxRight = Math.max(1, ...nodes.map((node) => node.right));
  const positions = useMemo(() => new Map(nodes.map((node) => [node.id, {
    x: 6 + (((node.left + node.right) / 2) / maxRight) * 88,
    y: 10 + (node.depth / maxDepth) * 78,
  }])), [maxDepth, maxRight, nodes]);

  return (
    <div className="grid-paper overflow-x-auto rounded-2xl border border-[var(--line)]">
      <svg viewBox="0 0 900 430" className="min-h-[22rem] min-w-[42rem]" role="img" aria-label="Segment tree diagram">
        {nodes.filter((node) => node.id !== 1).map((node) => {
          const from = positions.get(Math.floor(node.id / 2));
          const to = positions.get(node.id);
          return from && to ? <line key={`edge-${node.id}`} x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`} stroke="var(--line)" strokeWidth="2" /> : null;
        })}
        {nodes.map((node) => {
          const position = positions.get(node.id)!;
          const active = activeNodeIds.includes(node.id);
          return (
            <g key={node.id} transform={`translate(${(position.x / 100) * 900} ${(position.y / 100) * 430})`}>
              <rect x="-42" y="-24" width="84" height="48" rx="14" fill={active ? "var(--brand)" : "var(--surface)"} stroke={active ? "var(--brand)" : "var(--line)"} strokeWidth="2" />
              <text y="-3" textAnchor="middle" fill={active ? "white" : "var(--foreground)"} fontSize="16" fontWeight="800">{node.sum}</text>
              <text y="14" textAnchor="middle" fill={active ? "white" : "var(--muted)"} fontSize="10">[{node.left}, {node.right}]</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function OperationPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <fieldset className="grid grid-cols-2 gap-2"><legend className="col-span-2 mb-2 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{title}</legend>{children}</fieldset>;
}

function NumberField({ label, value, onChange, min = 0, max }: { label: string; value: number; onChange: (value: number) => void; min?: number; max: number }) {
  return <label className="rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--muted)]">{label}<input aria-label={label} type="number" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full bg-transparent font-mono text-base font-black text-[var(--foreground)] outline-none" /></label>;
}

function Control({ label, children, onClick, disabled = false, primary = false }: { label: string; children: React.ReactNode; onClick: () => void; disabled?: boolean; primary?: boolean }) {
  return <button type="button" aria-label={label} onClick={onClick} disabled={disabled} className={`rounded-xl px-3 py-2 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-35 ${primary ? "bg-[var(--brand)] text-white" : "border border-[var(--line)] hover:border-[var(--brand)]"}`}><span aria-hidden="true" className="mr-2">{children}</span>{label}</button>;
}

function ConceptCard({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"><span className="font-mono text-xs font-black text-[var(--brand)]">{number}</span><h3 className="mt-3 font-black">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{children}</p></article>;
}
