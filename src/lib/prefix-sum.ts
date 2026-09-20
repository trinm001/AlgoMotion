export type PrefixSumStep = {
  prefix: number[];
  activeIndex: number | null;
  range: [number, number] | null;
  result: number | null;
  codeLine: number;
  message: { vi: string; en: string };
};

export type PrefixSumTrace = { values: number[]; prefix: number[]; steps: PrefixSumStep[] };

function validate(values: number[]) {
  if (values.length < 2 || values.length > 14 || values.some((value) => !Number.isInteger(value) || Math.abs(value) > 99)) throw new Error("Invalid array.");
}

export function buildPrefixSums(values: number[]): PrefixSumTrace {
  validate(values);
  const prefix = Array(values.length + 1).fill(0) as number[];
  const steps: PrefixSumStep[] = [{ prefix: [...prefix], activeIndex: null, range: null, result: null, codeLine: 1, message: { vi: "Khởi tạo prefix[0] = 0.", en: "Initialize prefix[0] = 0." } }];
  for (let index = 0; index < values.length; index += 1) {
    prefix[index + 1] = prefix[index] + values[index];
    steps.push({ prefix: [...prefix], activeIndex: index, range: null, result: null, codeLine: 3, message: { vi: `prefix[${index + 1}] = ${prefix[index]} + ${values[index]} = ${prefix[index + 1]}.`, en: `prefix[${index + 1}] = ${prefix[index]} + ${values[index]} = ${prefix[index + 1]}.` } });
  }
  steps.push({ prefix: [...prefix], activeIndex: null, range: null, result: null, codeLine: 4, message: { vi: "Đã dựng xong mảng tổng tiền tố.", en: "The prefix-sum array is complete." } });
  return { values: [...values], prefix, steps };
}

export function queryPrefixSum(values: number[], prefix: number[], left: number, right: number): PrefixSumTrace {
  validate(values);
  if (prefix.length !== values.length + 1 || left < 0 || right >= values.length || left > right || !Number.isInteger(left) || !Number.isInteger(right)) throw new Error("Invalid range.");
  const result = prefix[right + 1] - prefix[left];
  return {
    values: [...values], prefix: [...prefix],
    steps: [
      { prefix: [...prefix], activeIndex: null, range: [left, right], result: null, codeLine: 6, message: { vi: `Lấy tổng đoạn [${left}, ${right}] bằng hai tổng tiền tố.`, en: `Use two prefix sums for range [${left}, ${right}].` } },
      { prefix: [...prefix], activeIndex: null, range: [left, right], result, codeLine: 6, message: { vi: `Kết quả: prefix[${right + 1}] - prefix[${left}] = ${prefix[right + 1]} - ${prefix[left]} = ${result}.`, en: `Result: prefix[${right + 1}] - prefix[${left}] = ${prefix[right + 1]} - ${prefix[left]} = ${result}.` } },
    ],
  };
}
