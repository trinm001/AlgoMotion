export type SparseCell = [level: number, index: number];
export type SparseStep = {
  table: number[][];
  activeCells: SparseCell[];
  range: [number, number] | null;
  result: number | null;
  codeLine: number;
  message: { vi: string; en: string };
};
export type SparseTrace = { values: number[]; table: number[][]; steps: SparseStep[]; result: number | null };

function validateValues(values: number[]) {
  if (values.length < 2 || values.length > 16 || values.some((value) => !Number.isInteger(value) || Math.abs(value) > 99)) throw new Error("Invalid array.");
}

function cloneTable(table: number[][]) { return table.map((row) => [...row]); }
function snap(table: number[][], activeCells: SparseCell[], range: [number, number] | null, result: number | null, codeLine: number, vi: string, en: string): SparseStep {
  return { table: cloneTable(table), activeCells, range, result, codeLine, message: { vi, en } };
}

export function buildSparseTable(values: number[]): SparseTrace {
  validateValues(values);
  const levels = Math.floor(Math.log2(values.length)) + 1;
  const table = Array.from({ length: levels }, () => Array(values.length).fill(Number.NaN)) as number[][];
  table[0] = [...values];
  const steps = [snap(table, values.map((_, index) => [0, index]), null, null, 1, "Tầng 0 lưu trực tiếp từng phần tử.", "Level 0 stores each array value directly.")];
  for (let level = 1; level < levels; level += 1) {
    const length = 1 << level;
    const half = length >> 1;
    for (let index = 0; index + length <= values.length; index += 1) {
      table[level][index] = Math.min(table[level - 1][index], table[level - 1][index + half]);
      steps.push(snap(table, [[level - 1, index], [level - 1, index + half], [level, index]], null, null, 4, `st[${level}][${index}] = min(${table[level - 1][index]}, ${table[level - 1][index + half]}) = ${table[level][index]}.`, `st[${level}][${index}] = min(${table[level - 1][index]}, ${table[level - 1][index + half]}) = ${table[level][index]}.`));
    }
  }
  steps.push(snap(table, [], null, null, 6, `Dựng xong ${levels} tầng Sparse Table.`, `Built all ${levels} Sparse Table levels.`));
  return { values: [...values], table, steps, result: null };
}

export function querySparseTable(values: number[], table: number[][], left: number, right: number): SparseTrace {
  validateValues(values);
  if (!Number.isInteger(left) || !Number.isInteger(right) || left < 0 || right >= values.length || left > right || table.length === 0) throw new Error("Invalid range.");
  const length = right - left + 1;
  const level = Math.floor(Math.log2(length));
  const second = right - (1 << level) + 1;
  const result = Math.min(table[level][left], table[level][second]);
  const activeCells: SparseCell[] = [[level, left], [level, second]];
  const steps = [
    snap(table, activeCells, [left, right], null, 8, `Độ dài ${length}, chọn k = ${level} và hai khối 2^${level}.`, `Length ${length}; choose k = ${level} and two 2^${level} blocks.`),
    snap(table, activeCells, [left, right], result, 9, `min(${table[level][left]}, ${table[level][second]}) = ${result}.`, `min(${table[level][left]}, ${table[level][second]}) = ${result}.`),
  ];
  return { values: [...values], table: cloneTable(table), steps, result };
}
