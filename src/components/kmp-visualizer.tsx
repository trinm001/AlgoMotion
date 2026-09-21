"use client";

import { useState } from "react";
import { CodePanel } from "@/components/algorithm-lab-shared";
import { ActionButton, ConceptGrid, ErrorMessage, LabHeading, TextInput, TraceWorkspace, ValueCells } from "@/components/phase-five-shared";
import { useTracePlayback } from "@/components/use-trace-playback";
import type { Locale } from "@/lib/i18n";
import { runKmp, type KmpTrace } from "@/lib/kmp";

const defaultText = "ababxxxxxxabab";
const defaultPattern = "abab";
const code = ["vector<int> pi(pattern.size());", "for (int i = 1, j = 0; i < pattern.size(); ++i) {", "  while (j && pattern[i] != pattern[j])", "    j = pi[j - 1];", "  if (pattern[i] == pattern[j]) ++j;", "  pi[i] = j;", "}", "vector<int> matches;", "for (int i = 0, j = 0; i < text.size(); ++i) {", "  while (j && text[i] != pattern[j])", "    j = pi[j - 1];", "  if (text[i] == pattern[j]) ++j;", "  if (j == pattern.size()) {", "    matches.push_back(i - j + 1);", "    j = pi[j - 1];", "  }", "}", "// O(n + m) time, O(m) memory"];
const copy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM CHUỖI", title: "Tìm mẫu không quay lại ký tự cũ", intro: "Dựng hàm tiền tố rồi dùng thông tin đã khớp để bỏ qua các phép so sánh thừa.", text: "Văn bản", pattern: "Mẫu", run: "Chạy KMP", invalid: "Văn bản cần 1–40 ký tự và mẫu cần 1–16 ký tự.", source: "Văn bản", prefix: "Bảng tiền tố π", step: "Bước", code: "C++ tương ứng", result: "Khớp", prefixTitle: "Hàm tiền tố", prefixText: "π[i] là độ dài tiền tố riêng dài nhất cũng là hậu tố của pattern[0..i].", fallback: "Lùi có nhớ", fallbackText: "Khi lệch, KMP chuyển về π[j-1] thay vì quét lại văn bản.", complexity: "Độ phức tạp", complexityText: "Dựng bảng và tìm kiếm đều tuyến tính: O(n + m), bộ nhớ O(m)." },
  en: { eyebrow: "STRING LAB", title: "Search without rechecking old characters", intro: "Build the prefix function, then reuse known matches to skip redundant comparisons.", text: "Text", pattern: "Pattern", run: "Run KMP", invalid: "Text must contain 1–40 characters and pattern 1–16 characters.", source: "Text", prefix: "Prefix table π", step: "Step", code: "Matching C++", result: "Matches", prefixTitle: "Prefix function", prefixText: "π[i] is the longest proper prefix that is also a suffix of pattern[0..i].", fallback: "Remembered fallback", fallbackText: "On a mismatch, KMP moves to π[j-1] instead of rescanning the text.", complexity: "Complexity", complexityText: "Table construction and search are linear: O(n + m) time and O(m) memory." },
} as const;

export function KmpVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [text, setText] = useState(defaultText);
  const [pattern, setPattern] = useState(defaultPattern);
  const [trace, setTrace] = useState<KmpTrace>(() => runKmp(defaultText, defaultPattern));
  const [error, setError] = useState("");
  const playback = useTracePlayback(trace.steps.length);
  const current = trace.steps[playback.index];

  function run() {
    try {
      setTrace(runKmp(text, pattern));
      playback.setIndex(0);
      playback.setPlaying(false);
      setError("");
    } catch {
      setError(t.invalid);
    }
  }

  return <section className="mt-12" aria-labelledby="kmp-lab-title"><LabHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} id="kmp-lab-title" /><div className="surface mt-8 overflow-hidden rounded-3xl"><div className="flex flex-wrap items-end gap-3 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6"><TextInput label={t.text} value={text} onChange={setText} id="kmp-text" /><TextInput label={t.pattern} value={pattern} onChange={setPattern} id="kmp-pattern" /><ActionButton onClick={run} primary>{t.run}</ActionButton></div><ErrorMessage error={error} /><TraceWorkspace locale={locale} playback={playback} count={trace.steps.length} stepLabel={t.step} message={current.message[locale]} badge={`${t.result}: ${current.matches.length}`}><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.source}</p><CharCells value={trace.text} active={current.phase === "search" ? current.textIndex : -1} /></div><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.prefix}</p><CharCells value={trace.pattern} active={current.patternIndex} /><div className="mt-2"><ValueCells values={current.pi} active={current.phase === "prefix" ? [current.textIndex] : []} label="π" /></div></div><CodePanel title={t.code} lines={code} activeLine={current.codeLine} /></TraceWorkspace></div><ConceptGrid items={[[t.prefixTitle, t.prefixText], [t.fallback, t.fallbackText], [t.complexity, t.complexityText]]} /></section>;
}

function CharCells({ value, active }: { value: string; active: number }) {
  return <div className="flex flex-wrap gap-2">{[...value].map((character, index) => <div key={`${index}-${character}`} className={`grid h-14 min-w-12 place-items-center rounded-xl border px-2 font-mono font-black ${index === active ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--line)] bg-[var(--surface)]"}`}><span>{character}</span><span className="text-[9px] font-normal opacity-60">[{index}]</span></div>)}</div>;
}
