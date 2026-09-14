import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QuestLeaderboardHeatmap } from "@/features/quests/QuestLeaderboardHeatmap";
import {
  createSampleLeaderboardMembers,
  createLeaderboardTreemap,
  HEATMAP_COLORS,
  rankLeaderboard,
  type LeaderboardMember,
} from "@/features/quests/leaderboardHeatmap";

describe("Quest Hub XP heatmap", () => {
  it("creates a stable 100-member fixture", () => {
    const first = createSampleLeaderboardMembers();
    const second = createSampleLeaderboardMembers();

    expect(first).toHaveLength(100);
    expect(first).toEqual(second);
    expect(first.slice(0, 3).map((member) => member.displayName)).toEqual([
      "Hoàng Nam",
      "Minh Châu",
      "Linh Nguyễn",
    ]);
  });

  it("ranks campaign XP and assigns five quantile levels", () => {
    const ranked = rankLeaderboard(createSampleLeaderboardMembers(), "Toàn campaign");

    expect(ranked).toHaveLength(100);
    expect(ranked[0]).toMatchObject({ rank: 1, displayName: "Hoàng Nam", metricXp: 1840 });
    expect(ranked[ranked.length - 1]?.rank).toBe(100);
    expect(new Set(ranked.map((member) => member.heatmapLevel))).toEqual(new Set([0, 1, 2, 3, 4]));
    expect(ranked.every((member) => HEATMAP_COLORS.includes(member.heatmapColor))).toBe(true);
  });

  it("uses weekly XP for the weekly view without changing the member count", () => {
    const ranked = rankLeaderboard(createSampleLeaderboardMembers(), "Tuần này");

    expect(ranked).toHaveLength(100);
    expect(ranked[0]).toMatchObject({ displayName: "Hoàng Nam", metricXp: 676 });
    expect(ranked[0].metricXp).not.toBe(ranked[0].totalXp);
  });

  it("keeps equal scores deterministic by member id", () => {
    const members: LeaderboardMember[] = [
      { id: "member-b", displayName: "B", totalXp: 100, weeklyXp: 20, completedQuests: 1 },
      { id: "member-a", displayName: "A", totalXp: 100, weeklyXp: 20, completedQuests: 1 },
      { id: "member-c", displayName: "C", totalXp: 50, weeklyXp: 10, completedQuests: 1 },
    ];

    expect(rankLeaderboard(members, "Toàn campaign").map((member) => member.id)).toEqual([
      "member-a",
      "member-b",
      "member-c",
    ]);
  });

  it("ignores invalid or negative XP records instead of producing broken cells", () => {
    const members: LeaderboardMember[] = [
      { id: "valid", displayName: "Hợp lệ", totalXp: 50, weeklyXp: 10, completedQuests: 1 },
      { id: "negative", displayName: "Âm", totalXp: -1, weeklyXp: 5, completedQuests: 1 },
      { id: "nan", displayName: "Không hợp lệ", totalXp: Number.NaN, weeklyXp: 5, completedQuests: 1 },
    ];

    expect(rankLeaderboard(members, "Toàn campaign").map((member) => member.id)).toEqual(["valid"]);
  });

  it("creates data-proportional tiles inside the requested bounds", () => {
    const tiles = createLeaderboardTreemap(createSampleLeaderboardMembers(), "Toàn campaign", 1000, 560);
    const first = tiles.find((tile) => tile.rank === 1);
    const last = tiles.find((tile) => tile.rank === 100);

    expect(tiles).toHaveLength(100);
    expect(tiles.every((tile) => tile.x >= 0 && tile.y >= 0 && tile.x + tile.width <= 1000 && tile.y + tile.height <= 560)).toBe(true);
    expect(tiles.every((tile) => tile.width > 0 && tile.height > 0)).toBe(true);
    expect((first?.width ?? 0) * (first?.height ?? 0)).toBeGreaterThan((last?.width ?? 0) * (last?.height ?? 0));
    expect(new Set(tiles.map((tile) => tile.labelMode)).size).toBeGreaterThan(1);
  });

  it("changes layout when the selected period changes", () => {
    const campaign = createLeaderboardTreemap(createSampleLeaderboardMembers(), "Toàn campaign", 1000, 560);
    const weekly = createLeaderboardTreemap(createSampleLeaderboardMembers(), "Tuần này", 1000, 560);

    expect(weekly.map((tile) => `${tile.id}:${tile.x}:${tile.y}:${tile.width}:${tile.height}`)).not.toEqual(
      campaign.map((tile) => `${tile.id}:${tile.x}:${tile.y}:${tile.width}:${tile.height}`),
    );
  });

  it("renders 100 keyboard-capable tiles and updates the selected member", async () => {
    const members = createSampleLeaderboardMembers({ "member-002": "/avatar-member-002.png" });
    const { container } = render(createElement(QuestLeaderboardHeatmap, {
      members,
      period: "Toàn campaign",
      onPeriodChange: () => undefined,
      reduceMotion: true,
    }));

    expect(container.querySelectorAll(".hub-leaderboard__tile")).toHaveLength(100);
    expect(screen.getByRole("heading", { name: "Hoàng Nam" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Hạng 02, Minh Châu/ }));
    await waitFor(() => expect(container.querySelector(".hub-leaderboard__detail-avatar img")).toHaveAttribute("src", "/avatar-member-002.png"));

    fireEvent.click(screen.getByRole("button", { name: /Hạng \d+, Nam · Thành viên 51/ }));
    await waitFor(() => expect(screen.getByRole("heading", { name: "Nam · Thành viên 51" })).toBeInTheDocument());
  });
});
