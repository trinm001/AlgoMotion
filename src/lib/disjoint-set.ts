export type DsuState = { parent: number[]; size: number[] };
export type DsuStep = {
  parent: number[];
  size: number[];
  activeNodes: number[];
  codeLine: number;
  message: { vi: string; en: string };
};
export type DsuTrace = { steps: DsuStep[]; finalState: DsuState; root: number | null; merged: boolean | null };

export function createDsu(count: number): DsuState {
  if (!Number.isInteger(count) || count < 2 || count > 12) throw new Error("Count must be from 2 through 12.");
  return { parent: Array.from({ length: count }, (_, index) => index), size: Array(count).fill(1) };
}

function validateState(state: DsuState) {
  const n = state.parent.length;
  if (n < 2 || n > 12 || state.size.length !== n || state.parent.some((parent) => !Number.isInteger(parent) || parent < 0 || parent >= n)) throw new Error("Invalid DSU state.");
}

function snap(state: DsuState, activeNodes: number[], codeLine: number, vi: string, en: string): DsuStep {
  return { parent: [...state.parent], size: [...state.size], activeNodes, codeLine, message: { vi, en } };
}

function resolve(state: DsuState, start: number, steps: DsuStep[]) {
  let node = start;
  const path: number[] = [];
  while (state.parent[node] !== node) {
    path.push(node);
    steps.push(snap(state, [node, state.parent[node]], 3, `Đi từ ${node} lên cha ${state.parent[node]}.`, `Follow ${node} to parent ${state.parent[node]}.`));
    node = state.parent[node];
  }
  steps.push(snap(state, [node], 4, `Tìm thấy gốc ${node}.`, `Root ${node} found.`));
  for (const visited of path) {
    if (state.parent[visited] === node) continue;
    state.parent[visited] = node;
    steps.push(snap(state, [visited, node], 5, `Nén đường đi: parent[${visited}] = ${node}.`, `Path compression: parent[${visited}] = ${node}.`));
  }
  return node;
}

export function runFind(input: DsuState, node: number): DsuTrace {
  validateState(input);
  if (!Number.isInteger(node) || node < 0 || node >= input.parent.length) throw new Error("Invalid node.");
  const state = { parent: [...input.parent], size: [...input.size] };
  const steps = [snap(state, [node], 1, `Bắt đầu find(${node}).`, `Start find(${node}).`)];
  const root = resolve(state, node, steps);
  steps.push(snap(state, [node, root], 7, `find(${node}) = ${root}.`, `find(${node}) = ${root}.`));
  return { steps, finalState: state, root, merged: null };
}

export function runUnion(input: DsuState, left: number, right: number): DsuTrace {
  validateState(input);
  if (![left, right].every((node) => Number.isInteger(node) && node >= 0 && node < input.parent.length)) throw new Error("Invalid nodes.");
  const state = { parent: [...input.parent], size: [...input.size] };
  const steps = [snap(state, [left, right], 1, `Bắt đầu union(${left}, ${right}).`, `Start union(${left}, ${right}).`)];
  let rootLeft = resolve(state, left, steps);
  let rootRight = resolve(state, right, steps);
  if (rootLeft === rootRight) {
    steps.push(snap(state, [rootLeft], 10, "Hai nút đã thuộc cùng một tập.", "Both nodes already belong to the same set."));
    return { steps, finalState: state, root: rootLeft, merged: false };
  }
  if (state.size[rootLeft] < state.size[rootRight]) [rootLeft, rootRight] = [rootRight, rootLeft];
  state.parent[rootRight] = rootLeft;
  state.size[rootLeft] += state.size[rootRight];
  steps.push(snap(state, [rootLeft, rootRight], 9, `Gắn gốc ${rootRight} vào gốc lớn hơn ${rootLeft}.`, `Attach root ${rootRight} below larger root ${rootLeft}.`));
  steps.push(snap(state, [rootLeft], 10, `Hợp nhất hoàn tất; kích thước tập là ${state.size[rootLeft]}.`, `Union complete; the set size is ${state.size[rootLeft]}.`));
  return { steps, finalState: state, root: rootLeft, merged: true };
}
