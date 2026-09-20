import { describe, expect, it } from "vitest";
import { buildHeap, isValidHeap, popHeap, pushHeap } from "./heap";

describe("heap trace engine", () => {
  it("builds min and max heaps without mutating input", () => {
    const input = [7, 2, 9, 1, 5, 3];
    const min = buildHeap(input, "min");
    const max = buildHeap(input, "max");
    expect(isValidHeap(min.finalValues, "min")).toBe(true);
    expect(isValidHeap(max.finalValues, "max")).toBe(true);
    expect(input).toEqual([7, 2, 9, 1, 5, 3]);
  });

  it("pushes and pops while preserving the invariant", () => {
    const heap = buildHeap([4, 8, 6, 10, 9], "min").finalValues;
    const pushed = pushHeap(heap, "min", 1);
    expect(pushed.finalValues[0]).toBe(1);
    const popped = popHeap(pushed.finalValues, "min");
    expect(popped.removed).toBe(1);
    expect(isValidHeap(popped.finalValues, "min")).toBe(true);
  });
});
