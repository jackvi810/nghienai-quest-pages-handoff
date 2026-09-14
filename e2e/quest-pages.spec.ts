import { expect, test } from "@playwright/test";

test.describe("Nghiên AI Quest pages", () => {
  test("hub renders the featured Quest, discovery controls and 100-member treemap", async ({ page }) => {
    await page.goto("/quests");
    await expect(page.getByRole("heading", { name: "Khám phá Quest" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Build your first AI Agent" })).toBeVisible();
    await expect(page.locator(".hub-leaderboard__tile")).toHaveCount(100);

    await page.getByRole("textbox", { name: "Tìm Quest" }).fill("Agent Territory");
    await expect(page.locator(".hub-catalog")).toContainText("Agent Territory");
    await expect(page.locator(".hub-catalog")).not.toContainText("AI Sales Review");

    await page.getByRole("button", { name: "Xóa bộ lọc" }).count().then(async (count) => {
      if (count > 0) await page.getByRole("button", { name: "Xóa bộ lọc" }).click();
    });
  });

  test("detail route preserves task flow, share action and route isolation", async ({ page }) => {
    await page.goto("/quests/build-your-first-ai-agent");
    await expect(page.locator(".quest-page--detail")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Build your first AI Agent" })).toBeVisible();
    await expect(page.locator(".hub-leaderboard__tile")).toHaveCount(0);

    await page.getByRole("button", { name: "Chia sẻ" }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menuitem", { name: "Sao chép link" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("menu")).toBeHidden();
  });

  test("featured carousel can be controlled by keyboard", async ({ page }) => {
    await page.goto("/quests");
    const carousel = page.locator(".hub-featured__carousel");
    await carousel.focus();
    await expect(carousel).toHaveAttribute("tabindex", "0");
    await page.keyboard.press("ArrowRight");
    await expect(page.locator(".hub-featured__index")).toContainText("/");
  });
});
