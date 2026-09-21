import type { Locale } from "@/lib/i18n";

export interface KmpStep {
  phase: "prefix" | "search";
  textIndex: number;
  patternIndex: number;
  pi: number[];
  matches: number[];
  codeLine: number;
  message: Record<Locale, string>;
}

export interface KmpTrace {
  text: string;
  pattern: string;
  steps: KmpStep[];
  matches: number[];
}

export function runKmp(rawText: string, rawPattern: string): KmpTrace {
  const text = rawText.trim();
  const pattern = rawPattern.trim();
  if (!text.length || text.length > 40 || !pattern.length || pattern.length > 16) throw new Error("Invalid KMP input.");

  const pi = Array<number>(pattern.length).fill(0);
  const matches: number[] = [];
  const steps: KmpStep[] = [];
  const add = (phase: KmpStep["phase"], textIndex: number, patternIndex: number, codeLine: number, vi: string, en: string) => steps.push({ phase, textIndex, patternIndex, pi: [...pi], matches: [...matches], codeLine, message: { vi, en } });

  add("prefix", -1, 0, 2, "Bắt đầu dựng bảng tiền tố π.", "Start building the prefix table π.");
  for (let i = 1, j = 0; i < pattern.length; i += 1) {
    while (j > 0 && pattern[i] !== pattern[j]) {
      add("prefix", i, j, 4, `Không khớp tại ${i}; lùi j từ ${j} về π[${j - 1}].`, `Mismatch at ${i}; fall j back from ${j} to π[${j - 1}].`);
      j = pi[j - 1];
    }
    if (pattern[i] === pattern[j]) j += 1;
    pi[i] = j;
    add("prefix", i, j, 6, `π[${i}] = ${j}.`, `π[${i}] = ${j}.`);
  }

  add("search", 0, 0, 9, "Bảng π hoàn tất; bắt đầu quét văn bản.", "The π table is ready; start scanning the text.");
  for (let i = 0, j = 0; i < text.length; i += 1) {
    while (j > 0 && text[i] !== pattern[j]) {
      add("search", i, j, 11, `Ký tự ${i} không khớp; lùi j về π[${j - 1}].`, `Character ${i} mismatches; fall j back to π[${j - 1}].`);
      j = pi[j - 1];
    }
    const matched = text[i] === pattern[j];
    if (matched) j += 1;
    add("search", i, j, 13, matched ? `Đã khớp ${j} ký tự.` : `Bỏ qua ký tự ${i}.`, matched ? `${j} characters matched.` : `Skip character ${i}.`);
    if (j === pattern.length) {
      matches.push(i - pattern.length + 1);
      add("search", i, j, 15, `Tìm thấy mẫu tại vị trí ${matches.at(-1)}.`, `Pattern found at index ${matches.at(-1)}.`);
      j = pi[j - 1];
    }
  }
  add("search", text.length, 0, 18, `Hoàn tất KMP; vị trí khớp: ${matches.join(", ") || "không có"}.`, `KMP complete; matches: ${matches.join(", ") || "none"}.`);
  return { text, pattern, steps, matches };
}
