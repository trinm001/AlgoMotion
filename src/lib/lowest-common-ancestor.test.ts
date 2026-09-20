import { describe, expect, it } from "vitest";
import { parseGraph } from "./graph";
import { runLca } from "./lowest-common-ancestor";

describe("lowest common ancestor engine", () => {
    const tree = parseGraph(7, "0 1\n0 2\n1 3\n1 4\n2 5\n2 6", { weighted: false, directed: false });

  it("answers sibling and cross-subtree queries", () => {
    expect(runLca(tree, 0, 3, 4).result).toBe(1);
    expect(runLca(tree, 0, 3, 6).result).toBe(0);
  });

  it("handles an ancestor as one endpoint", () => {
    expect(runLca(tree, 0, 1, 4).result).toBe(1);
  });
});
