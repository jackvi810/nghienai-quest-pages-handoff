import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Users } from "lucide-react";
import type { CSSProperties } from "react";
import {
  formatLeaderboardXp,
  createLeaderboardTreemap,
  rankLeaderboard,
  type LeaderboardMember,
  type LeaderboardPeriod,
  type RankedLeaderboardMember,
  type LeaderboardTreemapTile,
} from "./leaderboardHeatmap";

type QuestLeaderboardHeatmapProps = {
  members: readonly LeaderboardMember[];
  period: LeaderboardPeriod;
  onPeriodChange: (period: LeaderboardPeriod) => void;
  reduceMotion?: boolean;
};

function getInitials(name: string) {
  return name
    .replace("·", " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function MemberAvatar({ member }: { member: RankedLeaderboardMember }) {
  if (member.avatarUrl) {
    return <img src={member.avatarUrl} alt={member.displayName} />;
  }
  return <span className="hub-leaderboard__avatar-fallback" aria-hidden="true">{getInitials(member.displayName)}</span>;
}

function getTileName(tile: LeaderboardTreemapTile) {
  if (tile.labelMode === "full") return tile.displayName;
  if (tile.labelMode === "compact") {
    return tile.displayName.split(" · ")[0] ?? tile.displayName;
  }
  return "";
}

function TileContent({ tile }: { tile: LeaderboardTreemapTile }) {
  const shortName = getTileName(tile);
  if (tile.labelMode === "rank") {
    return <span aria-hidden="true">{String(tile.rank).padStart(2, "0")}</span>;
  }

  return (
    <span className="hub-leaderboard__tile-content" aria-hidden="true">
      {tile.avatarUrl && <img className="hub-leaderboard__tile-avatar" src={tile.avatarUrl} alt="" />}
      <b>{String(tile.rank).padStart(2, "0")}</b>
      <strong>{shortName}</strong>
      {tile.labelMode === "full" && <small>{formatLeaderboardXp(tile.metricXp)}</small>}
    </span>
  );
}

export function QuestLeaderboardHeatmap({
  members,
  period,
  onPeriodChange,
  reduceMotion = false,
}: QuestLeaderboardHeatmapProps) {
  const rankedMembers = useMemo(() => rankLeaderboard(members, period).slice(0, 100), [members, period]);
  const [selectedId, setSelectedId] = useState(rankedMembers[0]?.id ?? null);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const selectedMember = rankedMembers.find((member) => member.id === selectedId) ?? rankedMembers[0];
  const detailMember = rankedMembers.find((member) => member.id === previewId) ?? selectedMember;
  const totalXp = rankedMembers.reduce((sum, member) => sum + member.metricXp, 0);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const [heatmapSize, setHeatmapSize] = useState({ width: 800, height: 450 });
  const tiles = useMemo(
    () => createLeaderboardTreemap(members, period, heatmapSize.width, heatmapSize.height),
    [heatmapSize.height, heatmapSize.width, members, period],
  );

  useLayoutEffect(() => {
    const element = heatmapRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setHeatmapSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedMember || selectedMember.id === selectedId) return;
    setSelectedId(selectedMember.id);
  }, [selectedId, selectedMember]);

  const selectMember = (member: RankedLeaderboardMember) => setSelectedId(member.id);

  return (
    <section className="quest-hub__sector hub-leaderboard" aria-labelledby="leaderboard-title">
      <div className="hub-heading">
        <div>
          <h2 id="leaderboard-title">Bảng xếp hạng</h2>
          <p className="hub-leaderboard__summary">
            <Users size={15} aria-hidden="true" /> {rankedMembers.length} thành viên · {totalXp.toLocaleString("vi-VN")} XP trong {period.toLowerCase()}
          </p>
        </div>
        <div className="hub-period" aria-label="Khoảng thời gian">
          {(["Toàn campaign", "Tuần này"] as const).map((periodOption) => (
            <button
              key={periodOption}
              type="button"
              className={period === periodOption ? "is-active" : ""}
              aria-pressed={period === periodOption}
              onClick={() => onPeriodChange(periodOption)}
            >
              {periodOption}
            </button>
          ))}
        </div>
      </div>

      <div className="hub-leaderboard__layout">
        <div className="hub-leaderboard__visual">
          <div ref={heatmapRef} className="hub-leaderboard__heatmap" aria-label="Heatmap thứ hạng XP của 100 thành viên">
            {tiles.map((tile) => {
              const style = {
                "--hub-heatmap-color": tile.heatmapColor,
                left: `${(tile.x / heatmapSize.width) * 100}%`,
                top: `${(tile.y / heatmapSize.height) * 100}%`,
                width: `${(tile.width / heatmapSize.width) * 100}%`,
                height: `${(tile.height / heatmapSize.height) * 100}%`,
              } as CSSProperties;
              return (
                <button
                  key={tile.id}
                  type="button"
                  className={`hub-leaderboard__tile hub-leaderboard__tile--${tile.labelMode} hub-leaderboard__tile--level-${tile.heatmapLevel}${selectedMember?.id === tile.id ? " is-selected" : ""}`}
                  style={style}
                  aria-label={`Hạng ${String(tile.rank).padStart(2, "0")}, ${tile.displayName}, ${formatLeaderboardXp(tile.metricXp)}, hoàn thành ${tile.completedQuests} Quest`}
                  aria-pressed={selectedMember?.id === tile.id}
                  title={`${tile.displayName} · ${formatLeaderboardXp(tile.metricXp)}`}
                  onMouseEnter={() => setPreviewId(tile.id)}
                  onMouseLeave={() => setPreviewId(null)}
                  onFocus={() => setPreviewId(tile.id)}
                  onBlur={() => setPreviewId(null)}
                  onClick={() => selectMember(tile)}
                >
                  <TileContent tile={tile} />
                </button>
              );
            })}
          </div>
          <div className="hub-leaderboard__legend" aria-label="Chú thích mức XP">
            <span>Ít XP</span>
            <div aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => <i key={index} style={{ backgroundColor: `var(--hub-heatmap-${index})` }} />)}
            </div>
            <span>Nhiều XP</span>
          </div>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          {detailMember && (
            <motion.aside
              key={detailMember.id}
              className="hub-leaderboard__detail"
              aria-live="polite"
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
            >
              <div className="hub-leaderboard__detail-avatar"><MemberAvatar member={detailMember} /></div>
              <span className="hub-leaderboard__detail-kicker">{previewId ? "Đang xem nhanh" : "Thành viên được chọn"}</span>
              <h3>{detailMember.displayName}</h3>
              <strong>{formatLeaderboardXp(detailMember.metricXp)}</strong>
              <dl>
                <div><dt>Thứ hạng</dt><dd>{String(detailMember.rank).padStart(2, "0")}</dd></div>
                <div><dt>Quest hoàn thành</dt><dd>{detailMember.completedQuests}/9</dd></div>
              </dl>
              <p>Ô màu đậm hơn thể hiện tổng XP cao hơn trong khoảng thời gian đang chọn.</p>
              <button className="hub-leaderboard__detail-action" type="button" onClick={() => selectMember(rankedMembers[0])}>
                Xem người dẫn đầu <ChevronRight size={15} aria-hidden="true" />
              </button>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
