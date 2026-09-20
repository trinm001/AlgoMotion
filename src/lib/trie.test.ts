import { describe, expect, it } from "vitest";
import { buildTrie, createTrie, runTrieOperation } from "./trie";

describe("trie trace engine", () => {
  it("inserts and finds complete words", () => {
    const inserted = runTrieOperation(createTrie(), "algo", "insert");
    expect(inserted.result).toBe(true);
    expect(runTrieOperation(inserted.finalState, "algo", "search").result).toBe(true);
  });

  it("distinguishes a prefix from a stored word", () => {
    const state = buildTrie(["tree", "trie"]);
    expect(runTrieOperation(state, "tr", "prefix").result).toBe(true);
    expect(runTrieOperation(state, "tr", "search").result).toBe(false);
  });

  it("rejects unsupported characters", () => {
    expect(() => runTrieOperation(createTrie(), "cây", "insert")).toThrow();
  });
});
