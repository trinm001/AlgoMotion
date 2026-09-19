import { expect, test } from "@playwright/test";

test("Fenwick lesson queries and updates with synchronized steps", async ({ page }) => {
  await page.goto("/vi/algorithms/fenwick-tree");
  await expect(page.getByRole("heading", { name: "Theo dấu lowbit trên cây Fenwick" })).toBeVisible();
  await expect(page.getByText(/Đã xuất bản/)).toBeVisible();

  await page.getByRole("button", { name: "Chạy truy vấn" }).click();
  let next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
  await expect(page.getByText("Kết quả: 23 - 5 = 18.")).toBeVisible();

  await page.getByRole("button", { name: "Chạy cập nhật" }).click();
  next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
  await expect(page.getByText("Cập nhật hoàn tất. Tổng mới là 37.")).toBeVisible();
});

test("Sieve lesson marks composites and reports verified primes", async ({ page }) => {
  await page.goto("/vi/algorithms/sieve-of-eratosthenes");
  await expect(page.getByRole("heading", { name: "Quan sát Sàng Eratosthenes" })).toBeVisible();
  await page.getByLabel("Giới hạn n").fill("20");
  await page.getByRole("button", { name: "Chạy sàng" }).click();
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();

  await expect(page.getByText("Hoàn tất: tìm được 8 số nguyên tố không vượt quá 20.")).toBeVisible();
  await expect(page.getByText("2, 3, 5, 7, 11, 13, 17, 19")).toBeVisible();
});

test("phase three labs remain usable on mobile", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only coverage");

  await page.goto("/en/algorithms/fenwick-tree");
  await expect(page.getByRole("button", { name: "Run query" })).toBeVisible();
  await expect(page.getByText("Matching C++")).toBeVisible();

  await page.goto("/en/algorithms/sieve-of-eratosthenes");
  await expect(page.getByRole("button", { name: "Run sieve" })).toBeVisible();
  await expect(page.getByText("Matching C++")).toBeVisible();
});
