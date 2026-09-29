import {
  NextResponse,
} from "next/server";

import {
  calculateSaju,
} from "@/lib/saju/calculate-saju";

export async function GET() {
  const exact =
    calculateSaju({
      nickname:
        "정확한 시간",

      birthDate:
        "1992-10-24",

      birthTimeMode:
        "exact",

      birthTime:
        "05:30",

      birthShichen:
        null,

      calendarType:
        "solar",

      isLeapMonth:
        false,

      gender:
        "male",

      birthRegion:
        "서울특별시",
    });

  const approximate =
    calculateSaju({
      nickname:
        "묘시 테스트",

      birthDate:
        "1992-10-24",

      birthTimeMode:
        "shichen",

      birthTime:
        null,

      birthShichen:
        "묘",

      calendarType:
        "solar",

      isLeapMonth:
        false,

      gender:
        "male",

      birthRegion:
        "서울특별시",
    });

  const unknown =
    calculateSaju({
      nickname:
        "시간 미상",

      birthDate:
        "1992-10-24",

      birthTimeMode:
        "unknown",

      birthTime:
        null,

      birthShichen:
        null,

      calendarType:
        "solar",

      isLeapMonth:
        false,

      gender:
        "male",

      birthRegion:
        "서울특별시",
    });

  const approximateMatches =
    exact.fourPillars.year.korean ===
      approximate.fourPillars.year.korean &&
    exact.fourPillars.month.korean ===
      approximate.fourPillars.month.korean &&
    exact.fourPillars.day.korean ===
      approximate.fourPillars.day.korean &&
    exact.fourPillars.hour?.korean ===
      approximate.fourPillars.hour?.korean;

  const unknownCorrect =
    unknown.fourPillars.hour ===
      null &&
    unknown.tenGods.hour ===
      null &&
    unknown.majorLuck?.precision ===
      "sequence-only" &&
    unknown.majorLuck.startAge ===
      null;

  const approximateLuckCorrect =
    approximate.majorLuck?.precision ===
      "approximate";

  const exactLuckCorrect =
    exact.majorLuck?.precision ===
      "exact";

  return NextResponse.json({
    validation: {
      allPassed:
        approximateMatches &&
        unknownCorrect &&
        approximateLuckCorrect &&
        exactLuckCorrect,

      approximateMatches,

      unknownCorrect,

      approximateLuckCorrect,

      exactLuckCorrect,
    },

    exact,

    approximate,

    unknown,
  });
}