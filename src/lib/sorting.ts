export type SortAlgorithm = "bubble" | "selection" | "insertion";

export type SortStep = {
  values: number[];
  activeIndices: number[];
  sortedIndices: number[];
  codeLine: number;
  message: { vi: string; en: string };
};

export type SortTrace = {
  algorithm: SortAlgorithm;
  steps: SortStep[];
  result: number[];
};

function validate(values: number[]) {
  if (values.length < 2 || values.length > 12 || values.some((value) => !Number.isInteger(value) || Math.abs(value) > 99)) {
    throw new Error("Use 2 to 12 integers from -99 through 99.");
  }
}

function step(values: number[], activeIndices: number[], sortedIndices: number[], codeLine: number, vi: string, en: string): SortStep {
  return { values: [...values], activeIndices, sortedIndices, codeLine, message: { vi, en } };
}

export function runSort(values: number[], algorithm: SortAlgorithm): SortTrace {
  validate(values);
  const data = [...values];
  const steps: SortStep[] = [step(data, [], [], 1, "Bắt đầu với mảng ban đầu.", "Start with the original array.")];

  if (algorithm === "bubble") {
    for (let end = data.length - 1; end > 0; end -= 1) {
      let swapped = false;
      for (let index = 0; index < end; index += 1) {
        steps.push(step(data, [index, index + 1], range(end + 1, data.length), 4, `So sánh ${data[index]} và ${data[index + 1]}.`, `Compare ${data[index]} and ${data[index + 1]}.`));
        if (data[index] > data[index + 1]) {
          [data[index], data[index + 1]] = [data[index + 1], data[index]];
          swapped = true;
          steps.push(step(data, [index, index + 1], range(end + 1, data.length), 5, "Đổi chỗ vì cặp đang sai thứ tự.", "Swap because the pair is out of order."));
        }
      }
      if (!swapped) break;
    }
  } else if (algorithm === "selection") {
    for (let start = 0; start < data.length - 1; start += 1) {
      let minimum = start;
      for (let index = start + 1; index < data.length; index += 1) {
        steps.push(step(data, [minimum, index], range(0, start), 4, `So sánh ứng viên nhỏ nhất ${data[minimum]} với ${data[index]}.`, `Compare current minimum ${data[minimum]} with ${data[index]}.`));
        if (data[index] < data[minimum]) minimum = index;
      }
      [data[start], data[minimum]] = [data[minimum], data[start]];
      steps.push(step(data, [start, minimum], range(0, start + 1), 6, `Đặt ${data[start]} vào vị trí ${start}.`, `Place ${data[start]} at index ${start}.`));
    }
  } else {
    for (let index = 1; index < data.length; index += 1) {
      const key = data[index];
      let cursor = index - 1;
      steps.push(step(data, [index], range(0, index), 3, `Chọn ${key} để chèn vào đoạn đã sắp xếp.`, `Choose ${key} for insertion into the sorted prefix.`));
      while (cursor >= 0 && data[cursor] > key) {
        data[cursor + 1] = data[cursor];
        steps.push(step(data, [cursor, cursor + 1], range(0, index), 5, `Dịch ${data[cursor]} sang phải.`, `Shift ${data[cursor]} one position right.`));
        cursor -= 1;
      }
      data[cursor + 1] = key;
      steps.push(step(data, [cursor + 1], range(0, index + 1), 7, `Chèn ${key} vào vị trí ${cursor + 1}.`, `Insert ${key} at index ${cursor + 1}.`));
    }
  }

  steps.push(step(data, [], range(0, data.length), algorithm === "insertion" ? 8 : 8, `Hoàn tất: ${data.join(", ")}.`, `Complete: ${data.join(", ")}.`));
  return { algorithm, steps, result: [...data] };
}

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
}
