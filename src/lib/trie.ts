export type TrieNode = { id: number; children: Record<string, number>; terminal: boolean };
export type TrieState = { nodes: TrieNode[] };
export type TrieOperation = "insert" | "search" | "prefix";
export type TrieStep = {
  nodes: TrieNode[];
  activeNode: number;
  path: number[];
  result: boolean | null;
  codeLine: number;
  message: { vi: string; en: string };
};
export type TrieTrace = { operation: TrieOperation; word: string; steps: TrieStep[]; finalState: TrieState; result: boolean };

export function createTrie(): TrieState {
  return { nodes: [{ id: 0, children: {}, terminal: false }] };
}

function cloneState(state: TrieState): TrieState {
  return { nodes: state.nodes.map((node) => ({ ...node, children: { ...node.children } })) };
}

function validate(state: TrieState, word: string) {
  if (state.nodes.length < 1 || state.nodes.length > 80 || !/^[a-z]{1,12}$/.test(word)) throw new Error("Use 1 to 12 lowercase English letters.");
}

function snap(state: TrieState, activeNode: number, path: number[], result: boolean | null, codeLine: number, vi: string, en: string): TrieStep {
  return { nodes: cloneState(state).nodes, activeNode, path: [...path], result, codeLine, message: { vi, en } };
}

export function runTrieOperation(input: TrieState, word: string, operation: TrieOperation): TrieTrace {
  const normalized = word.trim().toLowerCase();
  validate(input, normalized);
  const state = cloneState(input);
  const steps: TrieStep[] = [snap(state, 0, [0], null, 1, `Bắt đầu ${operation} “${normalized}” từ gốc.`, `Start ${operation} “${normalized}” at the root.`)];
  let current = 0;
  const path = [0];
  for (const character of normalized) {
    let next = state.nodes[current].children[character];
    if (next === undefined) {
      if (operation !== "insert") {
        steps.push(snap(state, current, path, false, 5, `Không có cạnh “${character}”; truy vấn thất bại.`, `No “${character}” edge; the query fails.`));
        return { operation, word: normalized, steps, finalState: state, result: false };
      }
      if (state.nodes.length >= 80) throw new Error("Trie is full.");
      next = state.nodes.length;
      state.nodes.push({ id: next, children: {}, terminal: false });
      state.nodes[current].children[character] = next;
      steps.push(snap(state, current, path, null, 4, `Tạo cạnh “${character}” tới nút ${next}.`, `Create “${character}” edge to node ${next}.`));
    }
    current = next;
    path.push(current);
    steps.push(snap(state, current, path, null, 5, `Đi theo ký tự “${character}” tới nút ${current}.`, `Follow “${character}” to node ${current}.`));
  }
  if (operation === "insert") {
    state.nodes[current].terminal = true;
    steps.push(snap(state, current, path, true, 7, `Đánh dấu kết thúc từ “${normalized}”.`, `Mark the end of word “${normalized}”.`));
    return { operation, word: normalized, steps, finalState: state, result: true };
  }
  const result = operation === "prefix" || state.nodes[current].terminal;
  steps.push(snap(state, current, path, result, operation === "prefix" ? 9 : 8, result ? `Tìm thấy ${operation === "prefix" ? "tiền tố" : "từ"} “${normalized}”.` : `“${normalized}” chỉ là tiền tố, chưa phải một từ đã lưu.`, result ? `${operation === "prefix" ? "Prefix" : "Word"} “${normalized}” found.` : `“${normalized}” is only a prefix, not a stored word.`));
  return { operation, word: normalized, steps, finalState: state, result };
}

export function buildTrie(words: string[]) {
  return words.reduce((state, word) => runTrieOperation(state, word, "insert").finalState, createTrie());
}
