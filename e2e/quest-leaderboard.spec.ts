import { expect, test } from "@playwright/test";

const base = process.env.HUB_URL || "http://127.0.0.1:4173";

test.describe("Quest Hub XP heatmap", () => {
  for (const width of [1440, 1024, 768, 390]) {
    test(`renders a bounded XP treemap at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${base}/quests`);

      const heatmap = page.locator(".hub-leaderboard__heatmap");
      await expect(heatmap).toBeVisible();
      await expect(heatmap.locator(".hub-leaderboard__tile")).toHaveCount(100);

      const geometry = await heatmap.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        const tiles = [...element.querySelectorAll<HTMLElement>(".hub-leaderboard__tile")];
        const boxes = tiles.map((tile) => {
          const box = tile.getBoundingClientRect();
          return { left: box.left, top: box.top, right: box.right, bottom: box.bottom, area: box.width * box.height };
        });
        const overlaps = boxes.some((a, index) => boxes.slice(index + 1).some((b) => {
          const horizontal = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const vertical = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          return horizontal > 1 && vertical > 1;
        }));
        return {
          viewportWidth: window.innerWidth,
          pageWidth: document.documentElement.scrollWidth,
          heatmapWidth: rect.width,
          heatmapHeight: rect.height,
          tileCount: boxes.length,
          hasOverlaps: overlaps,
          smallestTile: Math.min(...boxes.map((box) => box.area)),
          largestTile: Math.max(...boxes.map((box) => box.area)),
        };
      });

      expect(geometry.pageWidth).toBeLessThanOrEqual(width);
      expect(geometry.tileCount).toBe(100);
      expect(geometry.hasOverlaps).toBe(false);
      expect(geometry.largestTile).toBeGreaterThan(geometry.smallestTile);
      expect(geometry.heatmapWidth).toBeGreaterThan(0);
      expect(geometry.heatmapHeight).toBeGreaterThan(0);

      await heatmap.getByRole("button", { name: /Hạng \d+, Nam · Thành viên 51/ }).click();
      await expect(page.getByRole("heading", { name: "Nam · Thành viên 51" })).toBeVisible();
      await page.locator(".hub-period button").nth(1).click();
      await expect(page.locator(".hub-leaderboard__summary")).toContainText("tuần này");
    });
  }

  test("does not add heatmap markup to the Quest detail route", async ({ page }) => {
    await page.goto(`${base}/quests/build-your-first-ai-agent`);
    await expect(page.locator(".quest-page--detail")).toBeVisible();
    await expect(page.locator(".hub-leaderboard__tile")).toHaveCount(0);
  });
});
