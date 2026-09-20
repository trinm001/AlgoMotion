import { describe, expect, it } from "vitest";
import { algorithms, findAlgorithm } from "./algorithms";

describe("algorithm catalog", () => {
  it("uses unique slugs and bilingual titles", () => {
    expect(new Set(algorithms.map(({ slug }) => slug)).size).toBe(algorithms.length);
    for (const algorithm of algorithms) {
      expect(algorithm.title.vi).toBeTruthy();
      expect(algorithm.title.en).toBeTruthy();
      expect(algorithm.sources.length).toBeGreaterThan(0);
    }
  });

  it("finds a registered algorithm by slug", () => {
    expect(findAlgorithm("segment-tree")?.status).toBe("available");
    expect(findAlgorithm("segment-tree")?.lastReviewed).toBe("2026-09-19");
    expect(findAlgorithm("fenwick-tree")?.status).toBe("available");
    expect(findAlgorithm("sieve-of-eratosthenes")?.status).toBe("available");
    expect(findAlgorithm("elementary-sorting")?.status).toBe("available");
    expect(findAlgorithm("binary-search")?.status).toBe("available");
    expect(findAlgorithm("prefix-sum")?.status).toBe("available");
    expect(findAlgorithm("missing")).toBeUndefined();
  });
});
