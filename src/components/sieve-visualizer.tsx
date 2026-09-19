"use client";

import { useEffect, useState } from "react";
import { CodePanel, ConceptCard, LabControls, LabProgress } from "@/components/algorithm-lab-shared";
import { runSieve, type SieveTrace } from "@/lib/sieve";
import type { Locale } from "@/lib/i18n";

const initialTrace = runSieve(40);
const cppLines = [
  "vector<bool> is_prime(n + 1, true);",
  "is_prime[0] = is_prime[1] = false;",
  "for (int p = 2; p * p <= n; ++p) {",
  "  if (!is_prime[p]) continue;",
  "  for (int multiple = p * p; multiple <= n; multiple += p)",
  "    is_prime[multiple] = false;",
  "}",
  "// Remaining true positions are prime.",
];

const copy = {
  vi: {
    eyebrow: "PHÒNG THÍ NGHIỆM SỐ NGUYÊN TỐ", title: "Quan sát Sàng Eratosthenes",
    intro: "Chọn một giới hạn rồi theo dõi từng số nguyên tố gạch các bội của nó. Mỗi hợp số chỉ cần được xét từ p².",
    limit: "Giới hạn n", run: "Chạy sàng", invalid: "Giới hạn phải là số nguyên từ 2 đến 100.",
    candidates: "Bảng số", primes: "Các số chưa bị gạch", result: "số nguyên tố", remaining: "chưa bị gạch", step: "Bước", code: "C++ tương ứng",
    reset: "Về đầu", previous: "Lùi", play: "Chạy", pause: "Dừng", next: "Tiếp",
    active: "Đang xét", composite: "Hợp số đã gạch", prime: "Còn là ứng viên nguyên tố",
    startSquare: "Vì sao bắt đầu từ p²?", startSquareText: "Các bội nhỏ hơn p² đã có một thừa số nhỏ hơn p và đã bị gạch ở lượt trước.",
    complexity: "Độ phức tạp", complexityText: "Thời gian O(n log log n), bộ nhớ O(n). Đây là cách chuẩn để liệt kê mọi số nguyên tố đến n.",
    truth: "Trạng thái có thể kiểm chứng", truthText: "Mỗi ô hợp số ghi lại số nguyên tố đầu tiên đã gạch nó; kết quả không dùng dữ liệu giả lập bên ngoài.",
  },
  en: {
    eyebrow: "PRIME NUMBER LAB", title: "Watch the Sieve of Eratosthenes",
    intro: "Choose a limit and watch each prime cross out its multiples. Composite marking only needs to begin at p².",
    limit: "Limit n", run: "Run sieve", invalid: "The limit must be an integer from 2 through 100.",
    candidates: "Number board", primes: "Numbers still unmarked", result: "primes", remaining: "unmarked", step: "Step", code: "Matching C++",
    reset: "Start over", previous: "Previous", play: "Play", pause: "Pause", next: "Next",
    active: "Active", composite: "Marked composite", prime: "Still a prime candidate",
    startSquare: "Why begin at p²?", startSquareText: "Multiples below p² have a factor smaller than p and were already marked during an earlier pass.",
    complexity: "Complexity", complexityText: "Time O(n log log n), memory O(n). This is the standard way to list every prime through n.",
    truth: "Traceable state", truthText: "Each composite cell records the first prime that marked it; the result uses no invented external data.",
  },
} as const;

export function SieveVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [limit, setLimit] = useState(40);
  const [trace, setTrace] = useState<SieveTrace>(initialTrace);
  const [stepIndex, setStepIndex] = useState(initialTrace.steps.length - 1);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState("");
  const current = trace.steps[stepIndex];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setStepIndex((index) => {
      if (index >= trace.steps.length - 1) { setPlaying(false); return index; }
      return index + 1;
    }), 650);
    return () => window.clearInterval(timer);
  }, [playing, trace.steps.length]);

  function run() {
    try { const next = runSieve(limit); setTrace(next); setStepIndex(0); setPlaying(false); setError(""); }
    catch { setError(t.invalid); }
  }

  return (
    <section className="mt-12" aria-labelledby="sieve-lab-title">
      <p className="eyebrow">{t.eyebrow}</p><h2 id="sieve-lab-title" className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t.title}</h2><p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">{t.intro}</p>
      <div className="surface mt-8 overflow-hidden rounded-3xl">
        <div className="flex flex-wrap items-end gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6"><label className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.limit}<input aria-label={t.limit} type="number" min={2} max={100} value={limit} onChange={(event) => setLimit(Number(event.target.value))} className="mt-2 block w-32 rounded-xl border border-[var(--line)] bg-[var(--background)] px-3 py-2 font-mono text-base text-[var(--foreground)] outline-none focus:border-[var(--brand)]" /></label><button type="button" onClick={run} className="rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-black text-white">{t.run}</button></div>
        {error ? <p role="alert" className="border-b border-[var(--line)] bg-red-50 px-6 py-3 text-sm font-bold text-[var(--danger)] dark:bg-red-950/20">{error}</p> : null}
        <div className="grid lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="min-w-0 space-y-6 p-4 sm:p-6">
            <div><div className="mb-3 flex flex-wrap items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.candidates}</p><div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]"><Legend color="bg-[var(--accent)]" label={t.active} /><Legend color="bg-red-200 dark:bg-red-950" label={t.composite} /><Legend color="bg-[var(--brand-soft)]" label={t.prime} /></div></div>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-8">{current.isPrime.slice(2).map((prime, offset) => { const number = offset + 2; const active = current.activeNumber === number; const marker = current.markedBy[number]; return <div key={number} className={`relative grid aspect-square place-items-center rounded-xl border font-mono font-black transition ${active ? "border-[var(--accent)] bg-[var(--accent)] text-white" : prime ? "border-[var(--brand-soft)] bg-[var(--brand-soft)] text-[var(--brand)]" : "border-red-200 bg-red-50 text-[var(--muted)] line-through dark:border-red-950 dark:bg-red-950/20"}`}><span>{number}</span>{marker !== null ? <span className="absolute bottom-1 right-1 text-[9px] no-underline opacity-60">×{marker}</span> : null}</div>; })}</div>
            </div>
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4"><p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.primes}</p><p className="mt-3 font-mono font-bold leading-7 text-[var(--brand)]">{current.primes.length ? current.primes.join(", ") : "—"}</p></div>
            <CodePanel title={t.code} lines={cppLines} activeLine={current.codeLine} />
          </div>
          <aside className="border-t border-[var(--line)] bg-[var(--surface)] p-5 lg:border-l lg:border-t-0"><div className="flex items-center justify-between gap-3"><p className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.step} {stepIndex + 1} / {trace.steps.length}</p><span className="rounded-lg bg-[var(--brand-soft)] px-3 py-1 text-sm font-black text-[var(--brand)]">{current.primes.length} {current.kind === "complete" ? t.result : t.remaining}</span></div><p className="mt-4 min-h-28 text-lg font-bold leading-7" aria-live="polite">{current.message[locale]}</p><LabProgress index={stepIndex} count={trace.steps.length} /><div className="mt-6"><LabControls labels={t} index={stepIndex} count={trace.steps.length} playing={playing} onIndex={setStepIndex} onPlaying={setPlaying} /></div></aside>
        </div>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3"><ConceptCard number="01" title={t.startSquare}>{t.startSquareText}</ConceptCard><ConceptCard number="02" title={t.complexity}>{t.complexityText}</ConceptCard><ConceptCard number="03" title={t.truth}>{t.truthText}</ConceptCard></div>
    </section>
  );
}

function Legend({ color, label }: { color: string; label: string }) { return <span><span className={`mr-1 inline-block h-2.5 w-2.5 rounded-sm ${color}`} />{label}</span>; }
