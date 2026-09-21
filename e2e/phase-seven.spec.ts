import { expect, test } from "@playwright/test";

async function finish(page: import("@playwright/test").Page) {
  const next = page.getByRole("button", { name: "Tiếp" });
  while (await next.isEnabled()) await next.click();
}

test("KMP finds every pattern occurrence", async ({ page }) => {
  await page.goto("/vi/algorithms/knuth-morris-pratt");
  await expect(page.getByRole("heading", { name: "Tìm mẫu không quay lại ký tự cũ" })).toBeVisible();
  await page.getByRole("button", { name: "Chạy KMP" }).click();
  await finish(page);
  await expect(page.getByText("Hoàn tất KMP; vị trí khớp: 0, 10.")).toBeVisible();
});

test("phase seven lab remains usable on mobile in English", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.includes("mobile"), "mobile-only coverage");
  await page.goto("/en/algorithms/knuth-morris-pratt");
  await expect(page.getByRole("button", { name: "Run KMP" })).toBeVisible();
  await expect(page.getByText("Matching C++")).toBeVisible();
});
