import { expect, test } from "@playwright/test";

test("redirects to Vietnamese and switches language", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/vi$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Nhìn thấy từng bước");
  await page.getByRole("link", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("See every step");
});

test("filters the algorithm catalog", async ({ page }) => {
  await page.goto("/vi/algorithms");
  await page.getByPlaceholder("Tìm thuật toán...").fill("Fenwick");
  await expect(page.getByRole("heading", { name: "Cây Fenwick" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Cây phân đoạn" })).toBeHidden();
});

test("visualizer preview supports step controls", async ({ page }) => {
  await page.goto("/vi#demo");
  await page.getByRole("button", { name: "Tiếp" }).click();
  await expect(page.getByText("Đọc dữ liệu", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Đặt lại" }).click();
  await expect(page.getByText("Sẵn sàng", { exact: true })).toBeVisible();
});
