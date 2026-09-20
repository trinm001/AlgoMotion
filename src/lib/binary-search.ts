export type BinarySearchStep = {
  low: number;
  high: number;
  mid: number | null;
  discardedIndices: number[];
  foundIndex: number | null;
  codeLine: number;
  message: { vi: string; en: string };
};

export type BinarySearchTrace = { values: number[]; target: number; steps: BinarySearchStep[]; foundIndex: number | null };

export function runBinarySearch(values: number[], target: number): BinarySearchTrace {
  if (values.length < 2 || values.length > 20 || values.some((value) => !Number.isInteger(value) || Math.abs(value) > 999)) throw new Error("Invalid array.");
  if (!Number.isInteger(target) || Math.abs(target) > 999) throw new Error("Invalid target.");
  if (values.some((value, index) => index > 0 && value < values[index - 1])) throw new Error("Array must be sorted.");
  let low = 0;
  let high = values.length - 1;
  const discarded = new Set<number>();
  const steps: BinarySearchStep[] = [];
  let foundIndex: number | null = null;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    steps.push(snapshot(low, high, mid, discarded, null, 3, `Xét đoạn [${low}, ${high}], mid = ${mid}, a[mid] = ${values[mid]}.`, `Inspect [${low}, ${high}], mid = ${mid}, a[mid] = ${values[mid]}.`));
    if (values[mid] === target) {
      foundIndex = mid;
      steps.push(snapshot(low, high, mid, discarded, mid, 4, `Tìm thấy ${target} tại vị trí ${mid}.`, `Found ${target} at index ${mid}.`));
      break;
    }
    if (values[mid] < target) {
      for (let index = low; index <= mid; index += 1) discarded.add(index);
      low = mid + 1;
      steps.push(snapshot(low, high, null, discarded, null, 5, `${values[mid]} < ${target}, loại nửa trái.`, `${values[mid]} < ${target}; discard the left half.`));
    } else {
      for (let index = mid; index <= high; index += 1) discarded.add(index);
      high = mid - 1;
      steps.push(snapshot(low, high, null, discarded, null, 6, `${values[mid]} > ${target}, loại nửa phải.`, `${values[mid]} > ${target}; discard the right half.`));
    }
  }
  if (foundIndex === null) steps.push(snapshot(low, high, null, discarded, null, 8, `Không tìm thấy ${target} trong mảng.`, `${target} is not present in the array.`));
  return { values: [...values], target, steps, foundIndex };
}

function snapshot(low: number, high: number, mid: number | null, discarded: Set<number>, foundIndex: number | null, codeLine: number, vi: string, en: string): BinarySearchStep {
  return { low, high, mid, discardedIndices: [...discarded], foundIndex, codeLine, message: { vi, en } };
}
