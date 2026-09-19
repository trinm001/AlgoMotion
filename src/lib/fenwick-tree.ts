export type FenwickStep = {
  kind: "start" | "visit" | "update" | "complete";
  tree: number[];
  values: number[];
  activeTreeIndices: number[];
  activeArrayIndices: number[];
  result: number | null;
  codeLine: number;
  message: { vi: string; en: string };
};

export type FenwickTrace = {
  operation: "build" | "query" | "update";
  steps: FenwickStep[];
  finalTree: number[];
  finalValues: number[];
  result: number | null;
};

function step(
  kind: FenwickStep["kind"],
  tree: number[],
  values: number[],
  message: FenwickStep["message"],
  options: Partial<Pick<FenwickStep, "activeTreeIndices" | "activeArrayIndices" | "result" | "codeLine">> = {},
): FenwickStep {
  return {
    kind,
    tree: [...tree],
    values: [...values],
    activeTreeIndices: options.activeTreeIndices ?? [],
    activeArrayIndices: options.activeArrayIndices ?? [],
    result: options.result ?? null,
    codeLine: options.codeLine ?? 1,
    message,
  };
}

export function buildFenwickTree(values: number[]): FenwickTrace {
  if (values.length === 0) throw new Error("Fenwick tree requires at least one value.");
  const tree = Array(values.length + 1).fill(0) as number[];
  const steps: FenwickStep[] = [step("start", tree, values, {
    vi: `Khởi tạo cây Fenwick gồm ${values.length} ô bằng 0.`,
    en: `Initialize ${values.length} Fenwick cells with zero.`,
  }, { codeLine: 1 })];

  values.forEach((value, arrayIndex) => {
    for (let index = arrayIndex + 1; index <= values.length; index += index & -index) {
      tree[index] += value;
      steps.push(step("update", tree, values, {
        vi: `Cộng a[${arrayIndex}] = ${value} vào bit[${index}], được ${tree[index]}.`,
        en: `Add a[${arrayIndex}] = ${value} to bit[${index}], producing ${tree[index]}.`,
      }, { activeTreeIndices: [index], activeArrayIndices: [arrayIndex], codeLine: 4 }));
    }
  });

  const total = values.reduce((sum, value) => sum + value, 0);
  steps.push(step("complete", tree, values, {
    vi: `Dựng xong cây. Tổng toàn mảng là ${total}.`,
    en: `Build complete. The whole-array sum is ${total}.`,
  }, { result: total, codeLine: 4 }));

  return { operation: "build", steps, finalTree: [...tree], finalValues: [...values], result: total };
}

export function queryFenwickRange(
  treeInput: number[],
  values: number[],
  left: number,
  right: number,
): FenwickTrace {
  if (left < 0 || right >= values.length || left > right) throw new Error("Invalid query range.");
  const tree = [...treeInput];
  const steps: FenwickStep[] = [step("start", tree, values, {
    vi: `Tính sum(${right}) - sum(${left - 1}) cho đoạn [${left}, ${right}].`,
    en: `Compute sum(${right}) - sum(${left - 1}) for [${left}, ${right}].`,
  }, { activeArrayIndices: Array.from({ length: right - left + 1 }, (_, offset) => left + offset), codeLine: 7 })];

  function prefix(arrayIndex: number, label: string) {
    let result = 0;
    for (let index = arrayIndex + 1; index > 0; index -= index & -index) {
      result += tree[index];
      steps.push(step("visit", tree, values, {
        vi: `${label}: lấy bit[${index}] = ${tree[index]}, tổng tạm thời ${result}.`,
        en: `${label}: take bit[${index}] = ${tree[index]}; running sum ${result}.`,
      }, { activeTreeIndices: [index], result, codeLine: 9 }));
    }
    return result;
  }

  const rightSum = prefix(right, `sum(${right})`);
  const leftSum = prefix(left - 1, `sum(${left - 1})`);
  const result = rightSum - leftSum;
  steps.push(step("complete", tree, values, {
    vi: `Kết quả: ${rightSum} - ${leftSum} = ${result}.`,
    en: `Result: ${rightSum} - ${leftSum} = ${result}.`,
  }, { result, codeLine: 10 }));

  return { operation: "query", steps, finalTree: tree, finalValues: [...values], result };
}

export function updateFenwickTree(
  treeInput: number[],
  valuesInput: number[],
  targetIndex: number,
  nextValue: number,
): FenwickTrace {
  if (targetIndex < 0 || targetIndex >= valuesInput.length) throw new Error("Invalid update index.");
  const tree = [...treeInput];
  const values = [...valuesInput];
  const delta = nextValue - values[targetIndex];
  const steps: FenwickStep[] = [step("start", tree, values, {
    vi: `Đổi a[${targetIndex}] từ ${values[targetIndex]} thành ${nextValue}; delta = ${delta}.`,
    en: `Change a[${targetIndex}] from ${values[targetIndex]} to ${nextValue}; delta = ${delta}.`,
  }, { activeArrayIndices: [targetIndex], codeLine: 2 })];

  values[targetIndex] = nextValue;
  for (let index = targetIndex + 1; index <= values.length; index += index & -index) {
    tree[index] += delta;
    steps.push(step("update", tree, values, {
      vi: `Cộng delta ${delta} vào bit[${index}], được ${tree[index]}.`,
      en: `Add delta ${delta} to bit[${index}], producing ${tree[index]}.`,
    }, { activeTreeIndices: [index], activeArrayIndices: [targetIndex], codeLine: 4 }));
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  steps.push(step("complete", tree, values, {
    vi: `Cập nhật hoàn tất. Tổng mới là ${total}.`,
    en: `Update complete. The new total is ${total}.`,
  }, { result: total, codeLine: 4 }));
  return { operation: "update", steps, finalTree: tree, finalValues: values, result: total };
}
