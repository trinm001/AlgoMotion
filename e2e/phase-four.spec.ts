import { expect, test } from "@playwright/test";

test("sorting lab switches algorithm and produces a verified ordering", async ({ page }) => {
  await page.goto("/vi/algorithms/elementary-sorting");
  await expect(page.getByRole("heading", { name: "So sánh ba cách sắp xếp cơ bản" })).toBeVisible();
  await page.getByLabel("Thuật toán").selectOption("insertion");
  await page.locator("#sorting-array").fill("5, -1, 3, 3");
  await page.getByRole("button", { name: "Sắp xếp" }).click();
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
  await expect(page.getByText("Hoàn tất: -1, 3, 3, 5.")).toBeVisible();
});

test("binary search finds a target and explains discarded halves", async ({ page }) => {
  await page.goto("/vi/algorithms/binary-search");
  await page.getByLabel("Giá trị cần tìm").fill("16");
  await page.getByRole("button", { name: "Tìm kiếm" }).click();
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
  await expect(page.getByText("Tìm thấy 16 tại vị trí 6.")).toBeVisible();
  await expect(page.getByText("Kết quả: vị trí 6")).toBeVisible();
});

test("prefix sum answers an inclusive range", async ({ page }) => {
  await page.goto("/vi/algorithms/prefix-sum");
  await page.getByLabel("Trái").fill("1");
  await page.getByLabel("Phải").fill("4");
  await page.getByRole("button", { name: "Tính tổng đoạn" }).click();
  await page.getByRole("button", { name: "Tiếp" }).click();
  await expect(page.getByText("Kết quả: prefix[5] - prefix[1] = 27 - 7 = 20.")).toBeVisible();
});

test("phase four labs remain usable on mobile in English", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only coverage");
  for (const [slug, button] of [["elementary-sorting", "Sort"], ["binary-search", "Search"], ["prefix-sum", "Build prefix"]]) {
    await page.goto(`/en/algorithms/${slug}`);
    await expect(page.getByRole("button", { name: button })).toBeVisible();
    await expect(page.getByText("Matching C++")).toBeVisible();
  }
});
