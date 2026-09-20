"use client";

import { useEffect, useState } from "react";
import { CodePanel, ConceptCard, LabControls, LabProgress } from "@/components/algorithm-lab-shared";
import { runBinarySearch, type BinarySearchTrace } from "@/lib/binary-search";
import { buildPrefixSums, queryPrefixSum, type PrefixSumTrace } from "@/lib/prefix-sum";
import { runSort, type SortAlgorithm, type SortTrace } from "@/lib/sorting";
import type { Locale } from "@/lib/i18n";

const DEFAULT_VALUES = [7, 3, 9, 2, 6, 1, 5];
const controlCopy = {
  vi: { reset: "Về đầu", previous: "Lùi", play: "Chạy", pause: "Dừng", next: "Tiếp" },
  en: { reset: "Start over", previous: "Previous", play: "Play", pause: "Pause", next: "Next" },
} as const;

function usePlayback(count: number, initialIndex: number) {
  const [index, setIndex] = useState(initialIndex);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setIndex((current) => {
      if (current >= count - 1) { setPlaying(false); return current; }
      return current + 1;
    }), 700);
    return () => window.clearInterval(timer);
  }, [count, playing]);
  return { index, setIndex, playing, setPlaying };
}

function parseArray(input: string) {
  return input.split(/[\s,]+/).filter(Boolean).map(Number);
}

const sortingCode: Record<SortAlgorithm, string[]> = {
  bubble: ["void bubble_sort(vector<int>& a) {", "  for (int end = a.size() - 1; end > 0; --end)", "    for (int i = 0; i < end; ++i)", "      if (a[i] > a[i + 1])", "        swap(a[i], a[i + 1]);", "}", "", "// O(n²) time, O(1) extra memory"],
  selection: ["void selection_sort(vector<int>& a) {", "  for (int start = 0; start + 1 < a.size(); ++start) {", "    int mn = start;", "    for (int i = start + 1; i < a.size(); ++i)", "      if (a[i] < a[mn]) mn = i;", "    swap(a[start], a[mn]);", "  }", "}"],
  insertion: ["void insertion_sort(vector<int>& a) {", "  for (int i = 1; i < a.size(); ++i) {", "    int key = a[i], j = i - 1;", "    while (j >= 0 && a[j] > key) {", "      a[j + 1] = a[j];", "      --j;", "    }", "    a[j + 1] = key;", "  }", "}"],
};

const sortingCopy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM SẮP XẾP", title: "So sánh ba cách sắp xếp cơ bản", intro: "Đổi thuật toán và theo dõi chính xác từng phép so sánh, dịch chuyển hoặc đổi chỗ.", array: "Mảng đầu vào", algorithm: "Thuật toán", run: "Sắp xếp", invalid: "Nhập từ 2 đến 12 số nguyên, mỗi số từ -99 đến 99.", step: "Bước", code: "C++ tương ứng", bubble: "Bubble Sort", selection: "Selection Sort", insertion: "Insertion Sort", invariant: "Bất biến", invariantText: "Sau mỗi vòng, một phần của mảng đã ở đúng thứ tự và không cần xử lý lại.", complexity: "Độ phức tạp", complexityText: "Ba thuật toán đều có O(n²) ở trường hợp tổng quát và dùng O(1) bộ nhớ phụ.", choice: "Chọn đúng công cụ", choiceText: "Insertion Sort hợp với mảng nhỏ hoặc gần có thứ tự; các thuật toán O(n log n) phù hợp hơn khi dữ liệu lớn." },
  en: { eyebrow: "SORTING LAB", title: "Compare three elementary sorting methods", intro: "Switch algorithms and inspect every comparison, shift, or swap.", array: "Input array", algorithm: "Algorithm", run: "Sort", invalid: "Enter 2 to 12 integers from -99 through 99.", step: "Step", code: "Matching C++", bubble: "Bubble Sort", selection: "Selection Sort", insertion: "Insertion Sort", invariant: "Invariant", invariantText: "After each outer pass, a portion of the array is ordered and no longer needs processing.", complexity: "Complexity", complexityText: "All three take O(n²) time in the general case and O(1) extra memory.", choice: "Choose deliberately", choiceText: "Insertion sort suits small or nearly sorted arrays; O(n log n) algorithms are preferable for larger inputs." },
} as const;

export function SortingVisualizer({ locale }: { locale: Locale }) {
  const t = sortingCopy[locale];
  const [input, setInput] = useState(DEFAULT_VALUES.join(", "));
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>("bubble");
  const [trace, setTrace] = useState<SortTrace>(() => runSort(DEFAULT_VALUES, "bubble"));
  const playback = usePlayback(trace.steps.length, 0);
  const [error, setError] = useState("");
  const current = trace.steps[playback.index];
  function run() {
    try { const next = runSort(parseArray(input), algorithm); setTrace(next); playback.setIndex(0); playback.setPlaying(false); setError(""); }
    catch { setError(t.invalid); }
  }
  return <LessonShell eyebrow={t.eyebrow} title={t.title} intro={t.intro} titleId="sorting-lab-title">
    <div className="flex flex-wrap items-end gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6">
      <TextField label={t.array} value={input} onChange={setInput} id="sorting-array" />
      <label className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.algorithm}<select aria-label={t.algorithm} value={algorithm} onChange={(event) => setAlgorithm(event.target.value as SortAlgorithm)} className="mt-2 block h-11 rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 text-[var(--foreground)]"><option value="bubble">{t.bubble}</option><option value="selection">{t.selection}</option><option value="insertion">{t.insertion}</option></select></label>
      <PrimaryAction onClick={run}>{t.run}</PrimaryAction>
    </div>
    <ErrorMessage error={error} />
    <LabBody locale={locale} traceLength={trace.steps.length} playback={playback} message={current.message[locale]} stepLabel={t.step}>
      <ArrayCells values={current.values} active={current.activeIndices} completed={current.sortedIndices} />
      <CodePanel title={t.code} lines={sortingCode[trace.algorithm]} activeLine={current.codeLine} />
    </LabBody>
    <Concepts items={[[t.invariant, t.invariantText], [t.complexity, t.complexityText], [t.choice, t.choiceText]]} />
  </LessonShell>;
}

const searchCode = ["int binary_search(vector<int>& a, int target) {", "  int low = 0, high = a.size() - 1;", "  while (low <= high) {", "    int mid = low + (high - low) / 2;", "    if (a[mid] == target) return mid;", "    if (a[mid] < target) low = mid + 1;", "    else high = mid - 1;", "  }", "  return -1;", "}"];
const searchCopy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM TÌM KIẾM", title: "Thu hẹp không gian bằng Binary Search", intro: "Mỗi phép so sánh loại bỏ một nửa đoạn còn lại. Điều kiện bắt buộc: mảng phải được sắp xếp.", array: "Mảng đã sắp xếp", target: "Giá trị cần tìm", run: "Tìm kiếm", invalid: "Nhập 2–20 số nguyên tăng dần và một mục tiêu hợp lệ.", step: "Bước", code: "C++ tương ứng", result: "Kết quả", found: "vị trí", missing: "không có", invariant: "Bất biến tìm kiếm", invariantText: "Nếu mục tiêu tồn tại, nó luôn nằm trong đoạn đóng [low, high] chưa bị loại.", complexity: "Độ phức tạp", complexityText: "Mỗi bước giảm ít nhất một nửa không gian nên thời gian là O(log n), bộ nhớ O(1).", boundary: "Tránh tràn số", boundaryText: "Tính mid = low + (high - low) / 2 thay vì (low + high) / 2." },
  en: { eyebrow: "SEARCH LAB", title: "Halve the search space with Binary Search", intro: "Every comparison discards half of the remaining range. The array must already be sorted.", array: "Sorted array", target: "Target", run: "Search", invalid: "Enter 2–20 sorted integers and a valid target.", step: "Step", code: "Matching C++", result: "Result", found: "index", missing: "not found", invariant: "Search invariant", invariantText: "If the target exists, it remains inside the undiscarded closed interval [low, high].", complexity: "Complexity", complexityText: "Each step at least halves the search space: O(log n) time and O(1) memory.", boundary: "Avoid overflow", boundaryText: "Compute mid as low + (high - low) / 2 rather than (low + high) / 2." },
} as const;

export function BinarySearchVisualizer({ locale }: { locale: Locale }) {
  const t = searchCopy[locale];
  const defaults = [1, 3, 5, 7, 9, 12, 16, 21];
  const [input, setInput] = useState(defaults.join(", "));
  const [target, setTarget] = useState(12);
  const [trace, setTrace] = useState<BinarySearchTrace>(() => runBinarySearch(defaults, 12));
  const playback = usePlayback(trace.steps.length, 0);
  const [error, setError] = useState("");
  const current = trace.steps[playback.index];
  function run() { try { const next = runBinarySearch(parseArray(input), target); setTrace(next); playback.setIndex(0); playback.setPlaying(false); setError(""); } catch { setError(t.invalid); } }
  return <LessonShell eyebrow={t.eyebrow} title={t.title} intro={t.intro} titleId="binary-search-lab-title">
    <div className="flex flex-wrap items-end gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6"><TextField label={t.array} value={input} onChange={setInput} id="binary-search-array" /><NumberField label={t.target} value={target} onChange={setTarget} /><PrimaryAction onClick={run}>{t.run}</PrimaryAction></div><ErrorMessage error={error} />
    <LabBody locale={locale} traceLength={trace.steps.length} playback={playback} message={current.message[locale]} stepLabel={t.step} badge={`${t.result}: ${current.foundIndex !== null ? `${t.found} ${current.foundIndex}` : playback.index === trace.steps.length - 1 ? t.missing : "…"}`}>
      <ArrayCells values={trace.values} active={current.mid === null ? [] : [current.mid]} discarded={current.discardedIndices} completed={current.foundIndex === null ? [] : [current.foundIndex]} indices />
      <CodePanel title={t.code} lines={searchCode} activeLine={current.codeLine} />
    </LabBody>
    <Concepts items={[[t.invariant, t.invariantText], [t.complexity, t.complexityText], [t.boundary, t.boundaryText]]} />
  </LessonShell>;
}

const prefixCode = ["vector<long long> prefix(n + 1, 0);", "for (int i = 0; i < n; ++i)", "  prefix[i + 1] = prefix[i] + a[i];", "", "long long range_sum(int left, int right) {", "  return prefix[right + 1] - prefix[left];", "}"];
const prefixCopy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM TỔNG TIỀN TỐ", title: "Trả lời tổng đoạn trong O(1)", intro: "Tiền xử lý prefix[i] là tổng i phần tử đầu tiên, rồi lấy hiệu của hai mốc để trả lời mọi đoạn.", array: "Mảng đầu vào", build: "Dựng prefix", left: "Trái", right: "Phải", query: "Tính tổng đoạn", invalid: "Nhập 2–14 số nguyên, mỗi số từ -99 đến 99.", invalidRange: "Đoạn truy vấn không hợp lệ.", source: "Mảng gốc", prefix: "Mảng prefix", step: "Bước", code: "C++ tương ứng", result: "Kết quả", definition: "Định nghĩa rõ ràng", definitionText: "prefix[i] lưu tổng của a[0] đến a[i-1]; prefix[0] = 0 giúp công thức không cần trường hợp đặc biệt.", complexity: "Độ phức tạp", complexityText: "Tiền xử lý O(n), mỗi truy vấn O(1), bộ nhớ O(n).", use: "Khi nào nên dùng", useText: "Phù hợp cho nhiều truy vấn tổng trên mảng tĩnh; nếu có cập nhật, cân nhắc Fenwick hoặc Segment Tree." },
  en: { eyebrow: "PREFIX SUM LAB", title: "Answer range sums in O(1)", intro: "Precompute prefix[i] as the sum of the first i values, then subtract two boundaries for any range.", array: "Input array", build: "Build prefix", left: "Left", right: "Right", query: "Query range sum", invalid: "Enter 2–14 integers from -99 through 99.", invalidRange: "The query range is invalid.", source: "Source array", prefix: "Prefix array", step: "Step", code: "Matching C++", result: "Result", definition: "Precise definition", definitionText: "prefix[i] stores a[0] through a[i-1]; prefix[0] = 0 removes boundary special cases.", complexity: "Complexity", complexityText: "O(n) preprocessing, O(1) per query, and O(n) memory.", use: "When to use it", useText: "Ideal for many sums on a static array; consider Fenwick or Segment Tree when updates are required." },
} as const;

export function PrefixSumVisualizer({ locale }: { locale: Locale }) {
  const t = prefixCopy[locale];
  const [input, setInput] = useState(DEFAULT_VALUES.join(", "));
  const initial = buildPrefixSums(DEFAULT_VALUES);
  const [values, setValues] = useState(initial.values);
  const [prefix, setPrefix] = useState(initial.prefix);
  const [trace, setTrace] = useState<PrefixSumTrace>(initial);
  const [left, setLeft] = useState(1); const [right, setRight] = useState(5);
  const playback = usePlayback(trace.steps.length, 0); const [error, setError] = useState("");
  const current = trace.steps[playback.index];
  function begin(next: PrefixSumTrace) { setTrace(next); playback.setIndex(0); playback.setPlaying(false); setError(""); }
  function build() { try { const next = buildPrefixSums(parseArray(input)); setValues(next.values); setPrefix(next.prefix); setLeft(0); setRight(next.values.length - 1); begin(next); } catch { setError(t.invalid); } }
  function query() { try { begin(queryPrefixSum(values, prefix, left, right)); } catch { setError(t.invalidRange); } }
  return <LessonShell eyebrow={t.eyebrow} title={t.title} intro={t.intro} titleId="prefix-sum-lab-title">
    <div className="grid gap-4 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6 lg:grid-cols-[1.4fr_1fr]"><div className="flex items-end gap-3"><TextField label={t.array} value={input} onChange={setInput} id="prefix-array" /><PrimaryAction onClick={build}>{t.build}</PrimaryAction></div><div className="grid grid-cols-2 gap-2"><NumberField label={t.left} value={left} onChange={setLeft} /><NumberField label={t.right} value={right} onChange={setRight} /><button type="button" onClick={query} className="col-span-2 rounded-xl border border-[var(--brand)] px-3 py-2 text-sm font-black text-[var(--brand)]">{t.query}</button></div></div><ErrorMessage error={error} />
    <LabBody locale={locale} traceLength={trace.steps.length} playback={playback} message={current.message[locale]} stepLabel={t.step} badge={current.result === null ? undefined : `${t.result}: ${current.result}`}>
      <LabeledCells label={t.source}><ArrayCells values={values} active={current.range ? range(current.range[0], current.range[1] + 1) : current.activeIndex === null ? [] : [current.activeIndex]} indices /></LabeledCells>
      <LabeledCells label={t.prefix}><ArrayCells values={current.prefix} active={current.activeIndex === null ? [] : [current.activeIndex + 1]} indices /></LabeledCells>
      <CodePanel title={t.code} lines={prefixCode} activeLine={current.codeLine} />
    </LabBody>
    <Concepts items={[[t.definition, t.definitionText], [t.complexity, t.complexityText], [t.use, t.useText]]} />
  </LessonShell>;
}

type Playback = ReturnType<typeof usePlayback>;
function LessonShell({ eyebrow, title, intro, titleId, children }: { eyebrow: string; title: string; intro: string; titleId: string; children: React.ReactNode }) { return <section className="mt-12" aria-labelledby={titleId}><p className="eyebrow">{eyebrow}</p><h2 id={titleId} className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{title}</h2><p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">{intro}</p><div className="surface mt-8 overflow-hidden rounded-3xl">{children}</div></section>; }
function LabBody({ locale, traceLength, playback, message, stepLabel, badge, children }: { locale: Locale; traceLength: number; playback: Playback; message: string; stepLabel: string; badge?: string; children: React.ReactNode }) { return <><div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]"><div className="min-w-0 space-y-6 p-4 sm:p-6">{children}</div><aside className="border-t border-[var(--line)] bg-[var(--surface)] p-5 lg:border-l lg:border-t-0"><div className="flex items-center justify-between gap-2"><p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{stepLabel} {playback.index + 1} / {traceLength}</p>{badge ? <span className="rounded-lg bg-[var(--brand-soft)] px-2 py-1 text-xs font-black text-[var(--brand)]">{badge}</span> : null}</div><p className="mt-4 min-h-28 text-lg font-bold leading-7" aria-live="polite">{message}</p><LabProgress index={playback.index} count={traceLength} /><div className="mt-6"><LabControls labels={controlCopy[locale]} index={playback.index} count={traceLength} playing={playback.playing} onIndex={playback.setIndex} onPlaying={playback.setPlaying} /></div></aside></div></>; }
function ArrayCells({ values, active = [], completed = [], discarded = [], indices = false }: { values: number[]; active?: number[]; completed?: number[]; discarded?: number[]; indices?: boolean }) { return <div className="flex flex-wrap gap-2">{values.map((value, index) => <div key={index} className={`grid min-h-14 min-w-14 place-items-center rounded-xl border px-2 font-mono font-black transition ${active.includes(index) ? "border-[var(--accent)] bg-[var(--accent)] text-white" : completed.includes(index) ? "border-[var(--brand)] bg-[var(--brand)] text-white" : discarded.includes(index) ? "border-[var(--line)] bg-[var(--surface-strong)] text-[var(--muted)] opacity-40" : "border-[var(--line)] bg-[var(--surface)]"}`}><span>{value}</span>{indices ? <span className="text-[9px] font-normal opacity-60">[{index}]</span> : null}</div>)}</div>; }
function TextField({ label, value, onChange, id }: { label: string; value: string; onChange: (value: string) => void; id: string }) { return <label htmlFor={id} className="min-w-52 flex-1 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{label}<input id={id} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 block h-11 w-full rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 font-mono text-base text-[var(--foreground)] outline-none focus:border-[var(--brand)]" /></label>; }
function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label className="rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 py-2 text-xs font-bold text-[var(--muted)]">{label}<input aria-label={label} type="number" value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-1 w-full bg-transparent font-mono text-base font-black text-[var(--foreground)] outline-none" /></label>; }
function PrimaryAction({ onClick, children }: { onClick: () => void; children: React.ReactNode }) { return <button type="button" onClick={onClick} className="h-11 rounded-xl bg-[var(--brand)] px-5 text-sm font-black text-white">{children}</button>; }
function ErrorMessage({ error }: { error: string }) { return error ? <p role="alert" className="border-b border-[var(--line)] bg-red-50 px-6 py-3 text-sm font-bold text-[var(--danger)] dark:bg-red-950/20">{error}</p> : null; }
function Concepts({ items }: { items: Array<readonly [string, string]> }) { return <div className="mt-8 grid gap-4 md:grid-cols-3">{items.map(([title, text], index) => <ConceptCard key={title} number={`0${index + 1}`} title={title}>{text}</ConceptCard>)}</div>; }
function LabeledCells({ label, children }: { label: string; children: React.ReactNode }) { return <div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{label}</p>{children}</div>; }
function range(start: number, end: number) { return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index); }
