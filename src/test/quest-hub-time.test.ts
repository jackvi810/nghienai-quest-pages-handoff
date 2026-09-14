import { describe, expect, it } from "vitest";
import {
  formatAccessibleCountdown,
  formatCompactCountdown,
  formatFeaturedCountdown,
  getCountdownParts,
  getCountdownTarget,
  getNextFlipDelay,
  getQuestPhase,
} from "@/features/quests/questHubTime";

const schedule = {
  startsAt: "2026-09-19T03:00:00+07:00",
  endsAt: "2026-10-03T03:00:00+07:00",
};

describe("Quest Hub time", () => {
  it("derives upcoming, active and ended states at exact boundaries", () => {
    expect(getQuestPhase(schedule, Date.parse("2026-09-19T02:59:59+07:00"))).toBe("Sắp mở");
    expect(getQuestPhase(schedule, Date.parse(schedule.startsAt))).toBe("Đang diễn ra");
    expect(getQuestPhase(schedule, Date.parse(schedule.endsAt))).toBe("Đã kết thúc");
  });

  it("uses the opening time before launch and closing time after launch", () => {
    expect(getCountdownTarget(schedule, "Sắp mở")).toBe(Date.parse(schedule.startsAt));
    expect(getCountdownTarget(schedule, "Đang diễn ra")).toBe(Date.parse(schedule.endsAt));
    expect(getCountdownTarget(schedule, "Đã kết thúc")).toBeUndefined();
  });

  it("splits and formats a second-level countdown without negative values", () => {
    const now = Date.parse("2026-09-13T15:00:00+07:00");
    const target = now + (((2 * 24 + 14) * 60 + 23) * 60 + 8) * 1_000;
    const parts = getCountdownParts(target, now);

    expect(parts).toMatchObject({ days: 2, hours: 14, minutes: 23, seconds: 8 });
    expect(formatFeaturedCountdown(parts)).toBe("02d · 14h 23m 08s");
    expect(formatCompactCountdown(parts)).toBe("02d · 14h 23m 08s");
    expect(formatAccessibleCountdown(parts)).toBe("2 ngày, 14 giờ, 23 phút và 8 giây");
    expect(getCountdownParts(target, target + 1_000).totalMs).toBe(0);
  });

  it("supports an active Quest that only has an end time", () => {
    const activeSchedule = { endsAt: "2026-09-18T03:00:00+07:00" };
    expect(getQuestPhase(activeSchedule, Date.parse("2026-09-13T15:00:00+07:00"))).toBe("Đang diễn ra");
  });

  it("synchronizes prize flips to seconds 00 and 30", () => {
    expect(getNextFlipDelay(Date.parse("2026-09-13T15:24:29.250+07:00"))).toBe(750);
    expect(getNextFlipDelay(Date.parse("2026-09-13T15:24:30.000+07:00"))).toBe(30_000);
    expect(getNextFlipDelay(Date.parse("2026-09-13T15:24:59.500+07:00"))).toBe(500);
  });
});
