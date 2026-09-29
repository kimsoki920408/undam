export const SAJU_ENGINE_VERSION =
  "undam-saju-0.2.0";

export const SAJU_CALCULATION_POLICY = {
  timezone: "Asia/Seoul",

  yearBoundary: "exact-lichun",

  monthBoundary: "solar-term-jie",

  dayBoundary: "midnight" as const,

  trueSolarTime: false,

  unknownTimeReference: "12:00",

  fiveElementsMethod:
    "principal-stem-branch-count",

  lunarCalendarSource:
    "korean-kasi-based",
} as const;