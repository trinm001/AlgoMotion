import { expect, test } from "@playwright/test";

test("accepts line-based edges and switches graph direction", async ({ page }) => {
  await page.goto("/vi/algorithms/breadth-first-search");
  await page.getByLabel("Cạnh: u v [w]").fill("0 1\n0 2 3\n1 3\n1 4\n2 5");
  await page.getByLabel("Hướng cạnh").selectOption("directed");
  await page.getByRole("button", { name: "Chạy duyệt" }).click();

  const graph = page.getByRole("img", { name: "Đồ thị" });
  await expect(graph.locator("path[marker-end]")).toHaveCount(5);
});

test("arranges, fixes, unfixes, and drags tree nodes", async ({ page }) => {
  await page.goto("/vi/algorithms/lowest-common-ancestor");
  await page.getByRole("button", { name: "Sắp xếp dạng cây" }).click();
  await page.getByRole("button", { name: "Khóa tất cả node", exact: true }).click();
  await expect(page.getByText("Đã khóa")).toBeVisible();

  const firstNode = page.getByRole("img", { name: "Cây" }).locator("circle").first();
  const before = await firstNode.getAttribute("cx");
  const box = await firstNode.boundingBox();
  if (!box) throw new Error("Tree node is not visible");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 20);
  await page.mouse.up();
  await expect(firstNode).toHaveAttribute("cx", before ?? "");

  await page.getByRole("button", { name: "Mở khóa tất cả node" }).click();
  await expect(page.getByText("Có thể kéo node")).toBeVisible();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + 80, box.y + box.height / 2 + 20);
  await page.mouse.up();
  await expect(firstNode).not.toHaveAttribute("cx", before ?? "");
});
