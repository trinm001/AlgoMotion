export type SegmentTreeNode = {
  id: number;
  left: number;
  right: number;
  sum: number;
  depth: number;
};

export type SegmentTreeStepKind =
  | "start"
  | "visit"
  | "leaf"
  | "merge"
  | "outside"
  | "covered"
  | "complete";

export type SegmentTreeStep = {
  kind: SegmentTreeStepKind;
  nodes: SegmentTreeNode[];
  values: number[];
  activeNodeIds: number[];
  activeIndices: number[];
  result: number | null;
  message: { vi: string; en: string };
};

export type SegmentTreeTrace = {
  operation: "build" | "query" | "update";
  steps: SegmentTreeStep[];
  finalNodes: SegmentTreeNode[];
  finalValues: number[];
  result: number | null;
};

function copyNodes(nodes: Map<number, SegmentTreeNode>) {
  return [...nodes.values()]
    .sort((a, b) => a.id - b.id)
    .map((node) => ({ ...node }));
}

function makeStep(
  kind: SegmentTreeStepKind,
  nodes: Map<number, SegmentTreeNode>,
  values: number[],
  message: SegmentTreeStep["message"],
  options: Partial<Pick<SegmentTreeStep, "activeNodeIds" | "activeIndices" | "result">> = {},
): SegmentTreeStep {
  return {
    kind,
    nodes: copyNodes(nodes),
    values: [...values],
    activeNodeIds: options.activeNodeIds ?? [],
    activeIndices: options.activeIndices ?? [],
    result: options.result ?? null,
    message,
  };
}

export function buildSegmentTree(values: number[]): SegmentTreeTrace {
  if (values.length === 0) throw new Error("Segment tree requires at least one value.");

  const nodes = new Map<number, SegmentTreeNode>();
  const steps: SegmentTreeStep[] = [
    makeStep(
      "start",
      nodes,
      values,
      {
        vi: `Bắt đầu dựng cây cho ${values.length} phần tử.`,
        en: `Start building the tree for ${values.length} values.`,
      },
    ),
  ];

  function build(id: number, left: number, right: number, depth: number): number {
    nodes.set(id, { id, left, right, sum: 0, depth });
    steps.push(
      makeStep(
        "visit",
        nodes,
        values,
        {
          vi: `Xét nút quản lý đoạn [${left}, ${right}].`,
          en: `Visit the node covering [${left}, ${right}].`,
        },
        { activeNodeIds: [id] },
      ),
    );

    if (left === right) {
      nodes.set(id, { id, left, right, sum: values[left], depth });
      steps.push(
        makeStep(
          "leaf",
          nodes,
          values,
          {
            vi: `Lá [${left}] nhận giá trị ${values[left]}.`,
            en: `Leaf [${left}] stores ${values[left]}.`,
          },
          { activeNodeIds: [id], activeIndices: [left] },
        ),
      );
      return values[left];
    }

    const middle = Math.floor((left + right) / 2);
    const leftSum = build(id * 2, left, middle, depth + 1);
    const rightSum = build(id * 2 + 1, middle + 1, right, depth + 1);
    const sum = leftSum + rightSum;
    nodes.set(id, { id, left, right, sum, depth });
    steps.push(
      makeStep(
        "merge",
        nodes,
        values,
        {
          vi: `Gộp ${leftSum} + ${rightSum} = ${sum} cho đoạn [${left}, ${right}].`,
          en: `Merge ${leftSum} + ${rightSum} = ${sum} for [${left}, ${right}].`,
        },
        { activeNodeIds: [id, id * 2, id * 2 + 1] },
      ),
    );
    return sum;
  }

  const total = build(1, 0, values.length - 1, 0);
  steps.push(
    makeStep(
      "complete",
      nodes,
      values,
      {
        vi: `Dựng xong cây. Tổng toàn mảng là ${total}.`,
        en: `Build complete. The whole-array sum is ${total}.`,
      },
      { activeNodeIds: [1], result: total },
    ),
  );

  return {
    operation: "build",
    steps,
    finalNodes: copyNodes(nodes),
    finalValues: [...values],
    result: total,
  };
}

function nodeMap(nodes: SegmentTreeNode[]) {
  return new Map(nodes.map((node) => [node.id, { ...node }]));
}

export function querySegmentTree(
  nodesInput: SegmentTreeNode[],
  values: number[],
  queryLeft: number,
  queryRight: number,
): SegmentTreeTrace {
  if (queryLeft < 0 || queryRight >= values.length || queryLeft > queryRight) {
    throw new Error("Invalid query range.");
  }

  const nodes = nodeMap(nodesInput);
  const steps: SegmentTreeStep[] = [
    makeStep(
      "start",
      nodes,
      values,
      {
        vi: `Truy vấn tổng đoạn [${queryLeft}, ${queryRight}].`,
        en: `Query the sum over [${queryLeft}, ${queryRight}].`,
      },
      { activeIndices: Array.from({ length: queryRight - queryLeft + 1 }, (_, index) => queryLeft + index) },
    ),
  ];

  function query(id: number): number {
    const node = nodes.get(id);
    if (!node) return 0;

    steps.push(
      makeStep(
        "visit",
        nodes,
        values,
        {
          vi: `So sánh đoạn nút [${node.left}, ${node.right}] với đoạn cần tìm.`,
          en: `Compare node [${node.left}, ${node.right}] with the query range.`,
        },
        { activeNodeIds: [id] },
      ),
    );

    if (node.right < queryLeft || queryRight < node.left) {
      steps.push(
        makeStep(
          "outside",
          nodes,
          values,
          {
            vi: `Đoạn [${node.left}, ${node.right}] nằm ngoài, đóng góp 0.`,
            en: `[${node.left}, ${node.right}] is outside, so it contributes 0.`,
          },
          { activeNodeIds: [id], result: 0 },
        ),
      );
      return 0;
    }

    if (queryLeft <= node.left && node.right <= queryRight) {
      steps.push(
        makeStep(
          "covered",
          nodes,
          values,
          {
            vi: `Đoạn [${node.left}, ${node.right}] được phủ hoàn toàn, lấy ${node.sum}.`,
            en: `[${node.left}, ${node.right}] is fully covered; take ${node.sum}.`,
          },
          { activeNodeIds: [id], result: node.sum },
        ),
      );
      return node.sum;
    }

    const leftSum = query(id * 2);
    const rightSum = query(id * 2 + 1);
    const sum = leftSum + rightSum;
    steps.push(
      makeStep(
        "merge",
        nodes,
        values,
        {
          vi: `Cộng hai nhánh: ${leftSum} + ${rightSum} = ${sum}.`,
          en: `Combine both branches: ${leftSum} + ${rightSum} = ${sum}.`,
        },
        { activeNodeIds: [id, id * 2, id * 2 + 1], result: sum },
      ),
    );
    return sum;
  }

  const result = query(1);
  steps.push(
    makeStep(
      "complete",
      nodes,
      values,
      {
        vi: `Kết quả truy vấn [${queryLeft}, ${queryRight}] là ${result}.`,
        en: `The result for [${queryLeft}, ${queryRight}] is ${result}.`,
      },
      { activeNodeIds: [1], result },
    ),
  );

  return {
    operation: "query",
    steps,
    finalNodes: copyNodes(nodes),
    finalValues: [...values],
    result,
  };
}

export function updateSegmentTree(
  nodesInput: SegmentTreeNode[],
  valuesInput: number[],
  targetIndex: number,
  nextValue: number,
): SegmentTreeTrace {
  if (targetIndex < 0 || targetIndex >= valuesInput.length) {
    throw new Error("Invalid update index.");
  }

  const nodes = nodeMap(nodesInput);
  const values = [...valuesInput];
  const previousValue = values[targetIndex];
  const steps: SegmentTreeStep[] = [
    makeStep(
      "start",
      nodes,
      values,
      {
        vi: `Cập nhật a[${targetIndex}] từ ${previousValue} thành ${nextValue}.`,
        en: `Update a[${targetIndex}] from ${previousValue} to ${nextValue}.`,
      },
      { activeIndices: [targetIndex] },
    ),
  ];

  function update(id: number): void {
    const node = nodes.get(id);
    if (!node || targetIndex < node.left || targetIndex > node.right) return;

    steps.push(
      makeStep(
        "visit",
        nodes,
        values,
        {
          vi: `Đi qua nút [${node.left}, ${node.right}].`,
          en: `Follow node [${node.left}, ${node.right}].`,
        },
        { activeNodeIds: [id], activeIndices: [targetIndex] },
      ),
    );

    if (node.left === node.right) {
      values[targetIndex] = nextValue;
      nodes.set(id, { ...node, sum: nextValue });
      steps.push(
        makeStep(
          "leaf",
          nodes,
          values,
          {
            vi: `Đổi lá [${targetIndex}] thành ${nextValue}.`,
            en: `Set leaf [${targetIndex}] to ${nextValue}.`,
          },
          { activeNodeIds: [id], activeIndices: [targetIndex] },
        ),
      );
      return;
    }

    update(targetIndex <= Math.floor((node.left + node.right) / 2) ? id * 2 : id * 2 + 1);
    const leftSum = nodes.get(id * 2)?.sum ?? 0;
    const rightSum = nodes.get(id * 2 + 1)?.sum ?? 0;
    const sum = leftSum + rightSum;
    nodes.set(id, { ...node, sum });
    steps.push(
      makeStep(
        "merge",
        nodes,
        values,
        {
          vi: `Tính lại nút [${node.left}, ${node.right}]: ${leftSum} + ${rightSum} = ${sum}.`,
          en: `Recompute [${node.left}, ${node.right}]: ${leftSum} + ${rightSum} = ${sum}.`,
        },
        { activeNodeIds: [id, id * 2, id * 2 + 1], activeIndices: [targetIndex] },
      ),
    );
  }

  update(1);
  steps.push(
    makeStep(
      "complete",
      nodes,
      values,
      {
        vi: `Cập nhật hoàn tất. Tổng toàn mảng mới là ${nodes.get(1)?.sum ?? 0}.`,
        en: `Update complete. The new whole-array sum is ${nodes.get(1)?.sum ?? 0}.`,
      },
      { activeNodeIds: [1], activeIndices: [targetIndex], result: nodes.get(1)?.sum ?? 0 },
    ),
  );

  return {
    operation: "update",
    steps,
    finalNodes: copyNodes(nodes),
    finalValues: [...values],
    result: nodes.get(1)?.sum ?? 0,
  };
}

