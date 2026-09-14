import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy";
import { scaleQuantile } from "d3-scale";
import { schemeOranges } from "d3-scale-chromatic";

export type LeaderboardPeriod = "Toàn campaign" | "Tuần này";
export type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

export type LeaderboardMember = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  totalXp: number;
  weeklyXp: number;
  completedQuests: number;
};

export type RankedLeaderboardMember = LeaderboardMember & {
  rank: number;
  metricXp: number;
  heatmapLevel: HeatmapLevel;
  heatmapColor: string;
};

export type LeaderboardTileLabelMode = "full" | "compact" | "rank";

export type LeaderboardTreemapTile = RankedLeaderboardMember & {
  x: number;
  y: number;
  width: number;
  height: number;
  labelMode: LeaderboardTileLabelMode;
};

export const HEATMAP_COLORS = schemeOranges[5] as readonly string[];

function getMetricXp(member: LeaderboardMember, period: LeaderboardPeriod) {
  return period === "Tuần này" ? member.weeklyXp : member.totalXp;
}

/**
 * Normalize and rank the public leaderboard without depending on a backend.
 * A future database adapter can provide the same LeaderboardMember shape.
 */
export function rankLeaderboard(
  members: readonly LeaderboardMember[],
  period: LeaderboardPeriod,
): RankedLeaderboardMember[] {
  const sorted = members
    .filter((member) => Number.isFinite(getMetricXp(member, period)) && getMetricXp(member, period) >= 0)
    .map((member) => ({ member, metricXp: getMetricXp(member, period) }))
    .sort((a, b) => b.metricXp - a.metricXp || a.member.id.localeCompare(b.member.id));

  if (!sorted.length) return [];

  const quantile = scaleQuantile<number, HeatmapLevel>()
    .domain(sorted.map(({ metricXp }) => metricXp))
    .range([0, 1, 2, 3, 4]);

  return sorted.map(({ member, metricXp }, index) => {
    const heatmapLevel = quantile(metricXp) as HeatmapLevel;
    return {
      ...member,
      rank: index + 1,
      metricXp,
      heatmapLevel,
      heatmapColor: HEATMAP_COLORS[heatmapLevel],
    };
  });
}

export function formatLeaderboardXp(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")} XP`;
}

type TreemapNodeData = {
  member?: RankedLeaderboardMember;
  children?: TreemapNodeData[];
};

function getTileLabelMode(width: number, height: number): LeaderboardTileLabelMode {
  if (width >= 132 && height >= 76) return "full";
  if (width >= 68 && height >= 42) return "compact";
  return "rank";
}

/**
 * Build a responsive, data-proportional treemap without touching the DOM.
 * Tile area follows the selected XP metric; the one-point floor keeps zero-XP
 * members visible and keyboard reachable in a future database-backed dataset.
 */
export function createLeaderboardTreemap(
  members: readonly LeaderboardMember[],
  period: LeaderboardPeriod,
  width: number,
  height: number,
): LeaderboardTreemapTile[] {
  const rankedMembers = rankLeaderboard(members, period).slice(0, 100);
  if (!rankedMembers.length || width <= 0 || height <= 0) return [];

  const root = hierarchy<TreemapNodeData>({
    children: rankedMembers.map((member) => ({ member })),
  })
    .sum((data) => data.member ? Math.max(data.member.metricXp, 1) : 0)
    .sort((a, b) => {
      const valueDifference = (b.value ?? 0) - (a.value ?? 0);
      if (valueDifference !== 0) return valueDifference;
      return (a.data.member?.rank ?? 0) - (b.data.member?.rank ?? 0);
    });

  treemap<TreemapNodeData>()
    .size([width, height])
    .tile(treemapSquarify)
    .paddingInner(3)
    .round(true)(root);

  return root.leaves().flatMap((node) => {
    const member = node.data.member;
    if (!member) return [];

    const tileWidth = Math.max(0, node.x1 - node.x0);
    const tileHeight = Math.max(0, node.y1 - node.y0);
    return [{
      ...member,
      x: node.x0,
      y: node.y0,
      width: tileWidth,
      height: tileHeight,
      labelMode: getTileLabelMode(tileWidth, tileHeight),
    }];
  });
}

const fixtureFirstNames = [
  "Hoàng", "Minh", "Linh", "Tuấn", "Mai", "An", "Quang", "Thảo", "Duy", "Hà",
  "Nam", "Vy", "Khoa", "Trang", "Đức", "Ngọc", "Huy", "Phương", "Bảo", "Yến",
];

/** Stable V1 fixture: 100 records, deliberately deterministic between reloads. */
export function createSampleLeaderboardMembers(avatarByMemberId: Record<string, string> = {}) {
  return Array.from({ length: 100 }, (_, index): LeaderboardMember => {
    const number = index + 1;
    const id = `member-${String(number).padStart(3, "0")}`;
    const displayName = number === 1
      ? "Hoàng Nam"
      : number === 2
        ? "Minh Châu"
        : number === 3
          ? "Linh Nguyễn"
          : `${fixtureFirstNames[index % fixtureFirstNames.length]} · Thành viên ${String(number).padStart(2, "0")}`;
    const totalXp = number === 1
      ? 1840
      : number === 2
        ? 1620
        : number === 3
          ? 1280
          : Math.max(96, 1230 - (number - 3) * 11 - (number % 7) * 9);
    const weeklyXp = number === 1
      ? 676
      : number === 2
        ? 562
        : number === 3
          ? 432
          : Math.max(18, Math.round(totalXp * (0.24 + (number % 5) * 0.035)));

    return {
      id,
      displayName,
      avatarUrl: avatarByMemberId[id],
      totalXp,
      weeklyXp,
      completedQuests: Math.min(9, Math.max(1, Math.floor(totalXp / 260))),
    };
  });
}
