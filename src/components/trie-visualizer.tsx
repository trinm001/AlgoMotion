"use client";

import { useState } from "react";
import { CodePanel } from "@/components/algorithm-lab-shared";
import { ActionButton, ConceptGrid, ErrorMessage, LabHeading, TextInput, TraceWorkspace } from "@/components/phase-five-shared";
import { useTracePlayback } from "@/components/use-trace-playback";
import { buildTrie, runTrieOperation, type TrieNode, type TrieOperation, type TrieState, type TrieTrace } from "@/lib/trie";
import type { Locale } from "@/lib/i18n";

const initialState = buildTrie(["algo", "all", "tree"]);
const initialTrace = runTrieOperation(initialState, "algo", "search");
const code = ["struct Node { map<char, int> next; bool end; };", "int v = 0;", "for (char ch : word) {", "  if (!trie[v].next.count(ch)) create_node();", "  v = trie[v].next[ch];", "}", "trie[v].end = true;          // insert", "return trie[v].end;          // search", "return true;                 // prefix"];
const copy = {
  vi: { eyebrow: "PHÒNG THÍ NGHIỆM TRIE", title: "Đi từng ký tự trên cây tiền tố", intro: "Chèn và tìm chuỗi bằng một đường đi từ gốc; các từ có chung tiền tố dùng chung nút.", word: "Từ / tiền tố", insert: "Chèn từ", search: "Tìm từ", prefix: "Tìm tiền tố", reset: "Khôi phục mẫu", invalid: "Chỉ dùng 1–12 chữ cái tiếng Anh thường; Trie tối đa 80 nút.", diagram: "Cây Trie", step: "Bước", code: "C++ tương ứng", yes: "Có", no: "Không", share: "Chia sẻ tiền tố", shareText: "Các chuỗi cùng bắt đầu giống nhau dùng chung một đường đi, giúp tránh lưu lặp ký tự.", terminal: "Nút kết thúc", terminalText: "Đi hết ký tự chỉ chứng minh tiền tố tồn tại; cờ terminal mới xác nhận cả từ đã được chèn.", complexity: "Độ phức tạp", complexityText: "Chèn, tìm từ và tìm tiền tố đều mất O(L), với L là độ dài chuỗi." },
  en: { eyebrow: "TRIE LAB", title: "Walk one character at a time", intro: "Insert and query strings along root-to-node paths; words with a common prefix share nodes.", word: "Word / prefix", insert: "Insert word", search: "Search word", prefix: "Search prefix", reset: "Restore sample", invalid: "Use 1–12 lowercase English letters; the Trie supports at most 80 nodes.", diagram: "Trie tree", step: "Step", code: "Matching C++", yes: "Yes", no: "No", share: "Shared prefixes", shareText: "Strings beginning the same way share one path, avoiding duplicate character storage.", terminal: "Terminal nodes", terminalText: "Consuming every character only proves a prefix exists; the terminal flag confirms a stored word.", complexity: "Complexity", complexityText: "Insertion, word search, and prefix search each take O(L), where L is the string length." },
} as const;

export function TrieVisualizer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [state, setState] = useState<TrieState>(initialState); const [word, setWord] = useState("algo");
  const [trace, setTrace] = useState<TrieTrace>(initialTrace); const [error, setError] = useState("");
  const playback = useTracePlayback(trace.steps.length); const current = trace.steps[playback.index];
  function begin(operation: TrieOperation) { try { const next = runTrieOperation(state, word, operation); setTrace(next); setState(next.finalState); playback.setIndex(0); playback.setPlaying(false); setError(""); } catch { setError(t.invalid); } }
  function reset() { const next = buildTrie(["algo", "all", "tree"]); setState(next); const sample = runTrieOperation(next, "algo", "search"); setTrace(sample); setWord("algo"); playback.setIndex(0); playback.setPlaying(false); setError(""); }
  const badge = playback.index === trace.steps.length - 1 ? `${trace.operation}: ${trace.result ? t.yes : t.no}` : undefined;
  return <section className="mt-12" aria-labelledby="trie-lab-title"><LabHeading eyebrow={t.eyebrow} title={t.title} intro={t.intro} id="trie-lab-title" /><div className="surface mt-8 overflow-hidden rounded-3xl"><div className="flex flex-wrap items-end gap-2 border-b border-[var(--line)] bg-[var(--surface)] p-4 sm:p-6"><TextInput label={t.word} value={word} onChange={setWord} id="trie-word" /><ActionButton onClick={() => begin("insert")} primary>{t.insert}</ActionButton><ActionButton onClick={() => begin("search")}>{t.search}</ActionButton><ActionButton onClick={() => begin("prefix")}>{t.prefix}</ActionButton><ActionButton onClick={reset}>{t.reset}</ActionButton></div><ErrorMessage error={error} /><TraceWorkspace locale={locale} playback={playback} count={trace.steps.length} stepLabel={t.step} message={current.message[locale]} badge={badge}><div><p className="mb-3 text-xs font-black uppercase tracking-wider text-[var(--muted)]">{t.diagram}</p><div className="overflow-x-auto"><TrieDiagram nodes={current.nodes} path={current.path} active={current.activeNode} label={t.diagram} /></div></div><CodePanel title={t.code} lines={code} activeLine={current.codeLine} /></TraceWorkspace></div><ConceptGrid items={[[t.share, t.shareText], [t.terminal, t.terminalText], [t.complexity, t.complexityText]]} /></section>;
}

function TrieDiagram({ nodes, path, active, label }: { nodes: TrieNode[]; path: number[]; active: number; label: string }) {
  const depth = Array(nodes.length).fill(0) as number[];
  for (const node of nodes) {
    for (const child of Object.values(node.children)) depth[child] = depth[node.id] + 1;
  }

  const maxDepth = Math.max(...depth);
  const levels = Array.from(
    { length: maxDepth + 1 },
    (_, level) => nodes.filter((node) => depth[node.id] === level),
  );
  const positions = new Map<number, { x: number; y: number }>();
  for (const [level, row] of levels.entries()) {
    row.forEach((node, index) => positions.set(node.id, {
      x: ((index + 1) * 720) / (row.length + 1),
      y: 42 + level * 82,
    }));
  }

  const height = Math.max(110, (maxDepth + 1) * 82);
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 720 ${height}`} className="w-full min-w-[40rem] rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
      <g>
        {nodes.flatMap((node) => Object.entries(node.children).map(([character, child]) => {
          const from = positions.get(node.id)!;
          const to = positions.get(child)!;
          const labelX = (from.x + to.x) / 2;
          const labelY = (from.y + to.y) / 2;
          const highlighted = path.includes(node.id) && path.includes(child);
          return (
            <g key={`${node.id}-${character}`}>
              <line x1={from.x} y1={from.y + 22} x2={to.x} y2={to.y - 22} stroke={highlighted ? "var(--accent)" : "var(--line)"} strokeWidth="2" />
              <rect x={labelX - 12} y={labelY - 10} width="24" height="20" rx="6" fill="var(--surface)" stroke={highlighted ? "var(--accent)" : "var(--line)"} />
              <text x={labelX} y={labelY + 4} textAnchor="middle" fill="var(--foreground)" className="font-mono text-[11px] font-medium">{character}</text>
            </g>
          );
        }))}
      </g>
      {nodes.map((node) => {
        const position = positions.get(node.id)!;
        const highlighted = path.includes(node.id);
        return (
          <g key={node.id}>
            <circle cx={position.x} cy={position.y} r="23" fill={node.id === active ? "var(--accent)" : highlighted ? "var(--brand)" : "var(--brand-soft)"} stroke="var(--brand)" strokeWidth={node.terminal ? 4 : 2} />
            <text x={position.x} y={position.y + 5} textAnchor="middle" fill={node.id === active || highlighted ? "white" : "var(--foreground)"} className="font-mono text-xs font-black">{node.id}</text>
            {node.terminal ? <text x={position.x + 20} y={position.y - 18} fill="var(--brand)" className="text-xs font-black">●</text> : null}
          </g>
        );
      })}
    </svg>
  );
}
