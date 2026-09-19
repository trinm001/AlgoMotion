import { expect, test } from "@playwright/test";

test("segment tree lesson builds, queries, and updates step by step", async ({ page }) => {
  await page.goto("/vi/algorithms/segment-tree");

  await expect(page.getByRole("heading", { name: "Quan sát cây phân đoạn hoạt động" })).toBeVisible();
  await expect(page.getByText(/Đã xuất bản/)).toBeVisible();

  await page.getByRole("button", { name: "Chạy truy vấn" }).click();
  await expect(page.getByText("Truy vấn tổng đoạn [1, 4].")).toBeVisible();
  await page.getByRole("button", { name: "Tiếp" }).click();
  await expect(page.getByText(/So sánh đoạn nút/)).toBeVisible();

  await page.getByRole("button", { name: "Chạy cập nhật" }).click();
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();

  await expect(page.getByText("Cập nhật hoàn tất. Tổng toàn mảng mới là 25.")).toBeVisible();
  await expect(page.getByText("Kết quả: 25")).toBeVisible();
});

test("segment tree lesson remains usable on mobile", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only coverage");
  await page.goto("/en/algorithms/segment-tree");

  await expect(page.getByRole("heading", { name: "Watch a segment tree work" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Run query" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Segment tree diagram" })).toBeVisible();
});
