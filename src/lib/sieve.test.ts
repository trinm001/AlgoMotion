import { describe, expect, it } from "vitest";
import { runSieve } from "./sieve";

describe("sieve trace engine", () => {
  it("finds primes up to an inclusive limit", () => {
    const trace = runSieve(20);
    expect(trace.primes).toEqual([2, 3, 5, 7, 11, 13, 17, 19]);
    expect(trace.steps.at(-1)?.kind).toBe("complete");
  });

  it("starts marking from p squared", () => {
    const trace = runSieve(30);
    const firstMarkByFive = trace.steps.find((item) => item.kind === "mark" && item.markedBy[item.activeNumber ?? 0] === 5);
    expect(firstMarkByFive?.activeNumber).toBe(25);
  });

  it("handles the smallest limit", () => {
    expect(runSieve(2).primes).toEqual([2]);
  });

  it("rejects unsupported limits", () => {
    expect(() => runSieve(1)).toThrow();
    expect(() => runSieve(101)).toThrow();
  });
});
