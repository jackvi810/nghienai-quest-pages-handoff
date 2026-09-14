export type QuestPhase = "Đang diễn ra" | "Sắp mở" | "Đã kết thúc";

export type QuestSchedule = {
  startsAt?: string;
  endsAt?: string;
};

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
};

const SECOND_MS = 1_000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

function timestamp(value?: string) {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getQuestPhase(schedule: QuestSchedule, nowMs: number): QuestPhase {
  const startsAt = timestamp(schedule.startsAt);
  const endsAt = timestamp(schedule.endsAt);

  if (startsAt !== undefined && nowMs < startsAt) return "Sắp mở";
  if (endsAt !== undefined && nowMs >= endsAt) return "Đã kết thúc";
  return "Đang diễn ra";
}

export function getCountdownTarget(schedule: QuestSchedule, phase: QuestPhase) {
  if (phase === "Sắp mở") return timestamp(schedule.startsAt);
  if (phase === "Đang diễn ra") return timestamp(schedule.endsAt);
  return undefined;
}

export function getCountdownParts(targetMs: number | undefined, nowMs: number): CountdownParts {
  const totalMs = Math.max(0, (targetMs ?? nowMs) - nowMs);
  return {
    days: Math.floor(totalMs / DAY_MS),
    hours: Math.floor((totalMs % DAY_MS) / HOUR_MS),
    minutes: Math.floor((totalMs % HOUR_MS) / MINUTE_MS),
    seconds: Math.floor((totalMs % MINUTE_MS) / SECOND_MS),
    totalMs,
  };
}

const pad = (value: number) => String(value).padStart(2, "0");

export function formatFeaturedCountdown(parts: CountdownParts) {
  return `${pad(parts.days)}d · ${pad(parts.hours)}h ${pad(parts.minutes)}m ${pad(parts.seconds)}s`;
}

export function formatCompactCountdown(parts: CountdownParts) {
  return formatFeaturedCountdown(parts);
}

export function formatAccessibleCountdown(parts: CountdownParts) {
  return `${parts.days} ngày, ${parts.hours} giờ, ${parts.minutes} phút và ${parts.seconds} giây`;
}

export function getNextFlipDelay(nowMs: number) {
  const withinMinute = ((nowMs % MINUTE_MS) + MINUTE_MS) % MINUTE_MS;
  const nextBoundary = withinMinute < 30_000 ? 30_000 : MINUTE_MS;
  return nextBoundary - withinMinute;
}
