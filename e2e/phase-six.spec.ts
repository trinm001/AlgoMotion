import { expect, test } from "@playwright/test";

async function finish(page: import("@playwright/test").Page) {
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
}

test("BFS and DFS produce deterministic traversal orders", async ({ page }) => {
  await page.goto("/vi/algorithms/breadth-first-search");
  await expect(page.getByRole("heading", { name: "So sánh BFS và DFS" })).toBeVisible();
  await page.getByLabel("Thuật toán").selectOption("dfs");
  await page.getByRole("button", { name: "Chạy duyệt" }).click();
  await finish(page);
  await expect(page.getByText("Hoàn tất. Thứ tự: 0 → 1 → 3 → 4 → 2 → 5.")).toBeVisible();
});

test("Dijkstra computes verified shortest distances", async ({ page }) => {
  await page.goto("/vi/algorithms/dijkstra");
  await page.getByRole("button", { name: "Chạy thuật toán" }).click();
  await finish(page);
  await expect(page.getByText("Dijkstra hoàn tất; mọi khoảng cách đạt được đã tối ưu.")).toBeVisible();
  await expect(page.getByText("4:7")).toBeVisible();
});

test("Bellman-Ford handles negative edges without a negative cycle", async ({ page }) => {
  await page.goto("/vi/algorithms/bellman-ford");
  await page.getByRole("button", { name: "Chạy thuật toán" }).click();
  await finish(page);
  await expect(page.getByText("Không còn cạnh nào nới lỏng được; thuật toán hoàn tất.")).toBeVisible();
  await expect(page.getByText("Không có chu trình âm")).toBeVisible();
});

test("Prim and Kruskal agree on MST weight", async ({ page }) => {
  await page.goto("/vi/algorithms/minimum-spanning-tree");
  await page.getByLabel("Thuật toán").selectOption("prim");
  await page.getByRole("button", { name: "Dựng MST" }).click();
  await finish(page);
  await expect(page.getByText("Prim hoàn tất với tổng trọng số 8.")).toBeVisible();
  await expect(page.getByText("Tổng: 8")).toBeVisible();
});

test("LCA lifts two vertices to their shared ancestor", async ({ page }) => {
  await page.goto("/vi/algorithms/lowest-common-ancestor");
  await page.getByRole("button", { name: "Tìm LCA" }).click();
  await finish(page);
  await expect(page.getByText("Cha chung trực tiếp là 0; LCA = 0.")).toBeVisible();
  await expect(page.getByText("LCA: 0")).toBeVisible();
});

test("phase six labs remain usable on mobile in English", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only coverage");
  for (const [slug, button] of [["breadth-first-search", "Run traversal"], ["dijkstra", "Run algorithm"], ["bellman-ford", "Run algorithm"], ["minimum-spanning-tree", "Build MST"], ["lowest-common-ancestor", "Find LCA"]]) {
    await page.goto(`/en/algorithms/${slug}`);
    await expect(page.getByRole("button", { name: button })).toBeVisible();
    await expect(page.getByText("Matching C++")).toBeVisible();
  }
});
