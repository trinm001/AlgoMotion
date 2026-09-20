export type HeapKind = "min" | "max";

export type HeapStep = {
  values: number[];
  activeIndices: number[];
  codeLine: number;
  message: { vi: string; en: string };
};

export type HeapTrace = {
  kind: HeapKind;
  steps: HeapStep[];
  finalValues: number[];
  removed: number | null;
};

function validateValues(values: number[], allowEmpty = false) {
  if ((!allowEmpty && values.length < 1) || values.length > 15 || values.some((value) => !Number.isInteger(value) || Math.abs(value) > 99)) {
    throw new Error("Use at most 15 integers from -99 through 99.");
  }
}

function better(left: number, right: number, kind: HeapKind) {
  return kind === "min" ? left < right : left > right;
}

function snapshot(values: number[], activeIndices: number[], codeLine: number, vi: string, en: string): HeapStep {
  return { values: [...values], activeIndices, codeLine, message: { vi, en } };
}

function siftDown(values: number[], start: number, kind: HeapKind, steps: HeapStep[]) {
  let parent = start;
  while (true) {
    const left = parent * 2 + 1;
    if (left >= values.length) return;
    const right = left + 1;
    let candidate = left;
    if (right < values.length && better(values[right], values[left], kind)) candidate = right;
    steps.push(snapshot(values, [parent, candidate], 5, `So sánh nút ${values[parent]} với con ưu tiên ${values[candidate]}.`, `Compare ${values[parent]} with its preferred child ${values[candidate]}.`));
    if (!better(values[candidate], values[parent], kind)) return;
    [values[parent], values[candidate]] = [values[candidate], values[parent]];
    steps.push(snapshot(values, [parent, candidate], 6, "Đổi chỗ và tiếp tục sàng xuống.", "Swap and continue sifting down."));
    parent = candidate;
  }
}

export function buildHeap(input: number[], kind: HeapKind): HeapTrace {
  validateValues(input);
  const values = [...input];
  const steps = [snapshot(values, [], 1, `Bắt đầu dựng ${kind === "min" ? "Min Heap" : "Max Heap"}.`, `Start building a ${kind === "min" ? "min" : "max"} heap.`)];
  for (let index = Math.floor(values.length / 2) - 1; index >= 0; index -= 1) {
    steps.push(snapshot(values, [index], 3, `Sàng xuống cây con có gốc tại chỉ số ${index}.`, `Sift down the subtree rooted at index ${index}.`));
    siftDown(values, index, kind, steps);
  }
  steps.push(snapshot(values, [0], 8, `Hoàn tất heap; phần tử ưu tiên là ${values[0]}.`, `Heap complete; the priority element is ${values[0]}.`));
  return { kind, steps, finalValues: [...values], removed: null };
}

export function pushHeap(input: number[], kind: HeapKind, value: number): HeapTrace {
  validateValues(input, true);
  if (!Number.isInteger(value) || Math.abs(value) > 99 || input.length >= 15) throw new Error("Invalid value.");
  const values = [...input, value];
  const steps = [snapshot(values, [values.length - 1], 2, `Thêm ${value} vào cuối mảng.`, `Append ${value} to the array.`)];
  let child = values.length - 1;
  while (child > 0) {
    const parent = Math.floor((child - 1) / 2);
    steps.push(snapshot(values, [parent, child], 4, `So sánh ${values[child]} với cha ${values[parent]}.`, `Compare ${values[child]} with parent ${values[parent]}.`));
    if (!better(values[child], values[parent], kind)) break;
    [values[parent], values[child]] = [values[child], values[parent]];
    steps.push(snapshot(values, [parent, child], 5, "Đổi chỗ và tiếp tục sàng lên.", "Swap and continue sifting up."));
    child = parent;
  }
  steps.push(snapshot(values, [child], 7, `Đã chèn ${value} đúng vị trí.`, `${value} is now in its valid heap position.`));
  return { kind, steps, finalValues: [...values], removed: null };
}

export function popHeap(input: number[], kind: HeapKind): HeapTrace {
  validateValues(input);
  const values = [...input];
  const removed = values[0];
  const steps = [snapshot(values, [0], 1, `Lấy phần tử ưu tiên ${removed}.`, `Remove priority element ${removed}.`)];
  const last = values.pop();
  if (values.length > 0 && last !== undefined) {
    values[0] = last;
    steps.push(snapshot(values, [0], 3, `Đưa ${last} lên gốc rồi sàng xuống.`, `Move ${last} to the root, then sift down.`));
    siftDown(values, 0, kind, steps);
  }
  steps.push(snapshot(values, values.length ? [0] : [], 8, `Xóa hoàn tất. Heap còn ${values.length} phần tử.`, `Removal complete. The heap now has ${values.length} elements.`));
  return { kind, steps, finalValues: [...values], removed };
}

export function isValidHeap(values: number[], kind: HeapKind) {
  return values.every((value, index) => index === 0 || !better(value, values[Math.floor((index - 1) / 2)], kind));
}
