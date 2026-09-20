import { expect, test } from "@playwright/test";

test("heap lab builds, pushes, and restores its invariant", async ({ page }) => {
  await page.goto("/vi/algorithms/binary-heap");
  await expect(page.getByRole("heading", { name: "Giữ phần tử ưu tiên ở gốc" })).toBeVisible();
  await page.getByLabel("Loại heap").selectOption("max");
  await expect(page.getByText("Bắt đầu dựng Max Heap.")).toBeVisible();
  await page.getByLabel("Loại heap").selectOption("min");
  await page.getByLabel("Giá trị mới").fill("0");
  await page.getByRole("button", { name: "Thêm", exact: true }).click();
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
  await expect(page.getByText("Đã chèn 0 đúng vị trí.")).toBeVisible();
  await expect(page.getByRole("img", { name: "Biểu diễn cây" })).toBeVisible();
});

test("DSU lab merges sets and reports the representative", async ({ page }) => {
  await page.goto("/vi/algorithms/disjoint-set-union");
  await page.getByRole("button", { name: "Union" }).click();
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
  await expect(page.getByText("Hợp nhất hoàn tất; kích thước tập là 2.")).toBeVisible();
  await expect(page.getByText("Gốc: 0")).toBeVisible();
});

test("Trie distinguishes prefixes from complete words", async ({ page }) => {
  await page.goto("/vi/algorithms/trie");
  await page.locator("#trie-word").fill("alg");
  await page.getByRole("button", { name: "Tìm tiền tố" }).click();
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
  await expect(page.getByText("Tìm thấy tiền tố “alg”.")).toBeVisible();
  await expect(page.getByText("prefix: Có")).toBeVisible();
});

test("Sparse Table answers RMQ with two blocks", async ({ page }) => {
  await page.goto("/vi/algorithms/sparse-table");
  await page.getByRole("button", { name: "Truy vấn min" }).click();
  await page.getByRole("button", { name: "Tiếp" }).click();
  await expect(page.getByText("Min: 1")).toBeVisible();
  await expect(page.getByText(/min\(1, 1\) = 1/)).toBeVisible();
});

test("phase five labs remain usable on mobile in English", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only coverage");
  for (const [slug, button] of [["binary-heap", "Build heap"], ["disjoint-set-union", "Union"], ["trie", "Insert word"], ["sparse-table", "Build table"]]) {
    await page.goto(`/en/algorithms/${slug}`);
    await expect(page.getByRole("button", { name: button })).toBeVisible();
    await expect(page.getByText("Matching C++")).toBeVisible();
  }
});
