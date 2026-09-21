import { describe, expect, it } from "vitest";
import { runKmp } from "./kmp";

describe("KMP", () => {
  it("finds overlapping matches", () => {
    expect(runKmp("ababa", "aba").matches).toEqual([0, 2]);
  });
});
