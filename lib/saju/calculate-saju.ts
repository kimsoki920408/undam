import {
  calculateFourPillars,
} from "manseryeok";

import {
  SAJU_CALCULATION_POLICY,
  SAJU_ENGINE_VERSION,
} from "@/config/saju-policy";

import type {
  BirthShichen,
  DayMaster,
  FiveElement,
  FiveElementCounts,
  MajorLuck,
  MajorLuckPillar,
  MajorLuckPrecision,
  SajuCalculationResult,
  SajuInput,
  SajuPillar,
  TenGodChart,
  TimePrecision,
  YinYang,
} from "@/types/saju";

const heavenlyStemElementMap:
  Record<string, FiveElement> = {
  갑: "목",
  을: "목",

  병: "화",
  정: "화",

  무: "토",
  기: "토",

  경: "금",
  신: "금",

  임: "수",
  계: "수",
};

const earthlyBranchElementMap:
  Record<string, FiveElement> = {
  인: "목",
  묘: "목",

  사: "화",
  오: "화",

  진: "토",
  술: "토",
  축: "토",
  미: "토",

  신: "금",
  유: "금",

  해: "수",
  자: "수",
};

const heavenlyStemHanjaMap:
  Record<string, string> = {
  갑: "甲",
  을: "乙",
  병: "丙",
  정: "丁",
  무: "戊",
  기: "己",
  경: "庚",
  신: "辛",
  임: "壬",
  계: "癸",
};

const earthlyBranchHanjaMap:
  Record<string, string> = {
  자: "子",
  축: "丑",
  인: "寅",
  묘: "卯",
  진: "辰",
  사: "巳",
  오: "午",
  미: "未",
  신: "申",
  유: "酉",
  술: "戌",
  해: "亥",
};

const heavenlyStemYinYangMap:
  Record<string, YinYang> = {
  갑: "양",
  을: "음",

  병: "양",
  정: "음",

  무: "양",
  기: "음",

  경: "양",
  신: "음",

  임: "양",
  계: "음",
};

type ShichenConfig = {
  label: string;

  start: string;

  end: string;

  representative: string;
};

const shichenConfig:
  Record<
    BirthShichen,
    ShichenConfig
  > = {
  자: {
    label: "자시",
    start: "23:00",
    end: "00:59",
    representative: "00:30",
  },

  축: {
    label: "축시",
    start: "01:00",
    end: "02:59",
    representative: "02:00",
  },

  인: {
    label: "인시",
    start: "03:00",
    end: "04:59",
    representative: "04:00",
  },

  묘: {
    label: "묘시",
    start: "05:00",
    end: "06:59",
    representative: "06:00",
  },

  진: {
    label: "진시",
    start: "07:00",
    end: "08:59",
    representative: "08:00",
  },

  사: {
    label: "사시",
    start: "09:00",
    end: "10:59",
    representative: "10:00",
  },

  오: {
    label: "오시",
    start: "11:00",
    end: "12:59",
    representative: "12:00",
  },

  미: {
    label: "미시",
    start: "13:00",
    end: "14:59",
    representative: "14:00",
  },

  신: {
    label: "신시",
    start: "15:00",
    end: "16:59",
    representative: "16:00",
  },

  유: {
    label: "유시",
    start: "17:00",
    end: "18:59",
    representative: "18:00",
  },

  술: {
    label: "술시",
    start: "19:00",
    end: "20:59",
    representative: "20:00",
  },

  해: {
    label: "해시",
    start: "21:00",
    end: "22:59",
    representative: "22:00",
  },
};

function parseBirthDate(
  value: string,
) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      value,
    );

  if (!match) {
    throw new Error(
      "생년월일 형식이 올바르지 않습니다.",
    );
  }

  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

function parseBirthTime(
  value: string,
) {
  const match =
    /^(\d{2}):(\d{2})$/.exec(
      value,
    );

  if (!match) {
    throw new Error(
      "출생시간 형식이 올바르지 않습니다.",
    );
  }

  const hour =
    Number(match[1]);

  const minute =
    Number(match[2]);

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    throw new Error(
      "출생시간 범위가 올바르지 않습니다.",
    );
  }

  return {
    hour,
    minute,
  };
}

function createHanjaGanji(
  heavenlyStem: string,
  earthlyBranch: string,
) {
  const heavenlyStemHanja =
    heavenlyStemHanjaMap[
      heavenlyStem
    ];

  const earthlyBranchHanja =
    earthlyBranchHanjaMap[
      earthlyBranch
    ];

  if (
    !heavenlyStemHanja ||
    !earthlyBranchHanja
  ) {
    throw new Error(
      `한자 간지 데이터를 찾을 수 없습니다: ${heavenlyStem}${earthlyBranch}`,
    );
  }

  return `${heavenlyStemHanja}${earthlyBranchHanja}`;
}

function createPillar(
  korean: string,
): SajuPillar {
  const characters =
    Array.from(korean);

  if (
    characters.length !== 2
  ) {
    throw new Error(
      `간지 데이터 형식이 올바르지 않습니다: ${korean}`,
    );
  }

  const heavenlyStem =
    characters[0];

  const earthlyBranch =
    characters[1];

  const heavenlyStemElement =
    heavenlyStemElementMap[
      heavenlyStem
    ];

  const earthlyBranchElement =
    earthlyBranchElementMap[
      earthlyBranch
    ];

  if (
    !heavenlyStemElement ||
    !earthlyBranchElement
  ) {
    throw new Error(
      `오행 데이터를 찾을 수 없습니다: ${korean}`,
    );
  }

  return {
    korean,

    hanja:
      createHanjaGanji(
        heavenlyStem,
        earthlyBranch,
      ),

    heavenlyStem,

    earthlyBranch,

    heavenlyStemElement,

    earthlyBranchElement,
  };
}

function createDayMaster(
  dayPillar: SajuPillar,
): DayMaster {
  const yinYang =
    heavenlyStemYinYangMap[
      dayPillar.heavenlyStem
    ];

  if (!yinYang) {
    throw new Error(
      `일간 음양 데이터를 찾을 수 없습니다: ${dayPillar.heavenlyStem}`,
    );
  }

  return {
    korean:
      dayPillar.heavenlyStem,

    hanja:
      heavenlyStemHanjaMap[
        dayPillar.heavenlyStem
      ],

    element:
      dayPillar.heavenlyStemElement,

    yinYang,
  };
}

function calculateFiveElements(
  pillars:
    Array<SajuPillar | null>,
): FiveElementCounts {
  const counts:
    FiveElementCounts = {
    목: 0,
    화: 0,
    토: 0,
    금: 0,
    수: 0,
    total: 0,
  };

  for (
    const pillar
    of pillars
  ) {
    if (!pillar) {
      continue;
    }

    counts[
      pillar.heavenlyStemElement
    ] += 1;

    counts[
      pillar.earthlyBranchElement
    ] += 1;

    counts.total += 2;
  }

  return counts;
}

function calculateEngine(
  input: SajuInput,
  hour: number,
  minute: number,
) {
  const {
    year,
    month,
    day,
  } =
    parseBirthDate(
      input.birthDate,
    );

  return calculateFourPillars({
    year,
    month,
    day,
    hour,
    minute,

    isLunar:
      input.calendarType ===
      "lunar",

    isLeapMonth:
      input.calendarType ===
      "lunar"
        ? input.isLeapMonth
        : false,

    gender:
      input.gender,

    dayBoundary:
      SAJU_CALCULATION_POLICY
        .dayBoundary,
  });
}

function getEffectiveBirthTime(
  input: SajuInput,
) {
  if (
    input.birthTimeMode ===
    "exact"
  ) {
    if (!input.birthTime) {
      throw new Error(
        "정확한 출생시간이 없습니다.",
      );
    }

    const parsed =
      parseBirthTime(
        input.birthTime,
      );

    return {
      hour:
        parsed.hour,

      minute:
        parsed.minute,

      timeKnown: true,

      timePrecision:
        "exact" as TimePrecision,

      selectedShichen:
        null as BirthShichen | null,

      effectiveBirthTime:
        input.birthTime,
    };
  }

  if (
    input.birthTimeMode ===
    "shichen"
  ) {
    if (
      !input.birthShichen
    ) {
      throw new Error(
        "출생 시간대를 선택해주세요.",
      );
    }

    const config =
      shichenConfig[
        input.birthShichen
      ];

    const parsed =
      parseBirthTime(
        config.representative,
      );

    return {
      hour:
        parsed.hour,

      minute:
        parsed.minute,

      timeKnown: true,

      timePrecision:
        "approximate" as TimePrecision,

      selectedShichen:
        input.birthShichen,

      effectiveBirthTime:
        config.representative,
    };
  }

  const parsed =
    parseBirthTime(
      SAJU_CALCULATION_POLICY
        .unknownTimeReference,
    );

  return {
    hour:
      parsed.hour,

    minute:
      parsed.minute,

    timeKnown: false,

    timePrecision:
      "unknown" as TimePrecision,

    selectedShichen:
      null as BirthShichen | null,

    effectiveBirthTime:
      null,
  };
}

function normalizeTenGods(
  result: ReturnType<
    typeof calculateFourPillars
  >,
  timeKnown: boolean,
): TenGodChart {
  return {
    year: {
      stem:
        result.tenGods
          .year.stem,

      branch:
        result.tenGods
          .year.branch,
    },

    month: {
      stem:
        result.tenGods
          .month.stem,

      branch:
        result.tenGods
          .month.branch,
    },

    day: {
      stem:
        result.tenGods
          .day.stem,

      branch:
        result.tenGods
          .day.branch,
    },

    hour:
      timeKnown
        ? {
            stem:
              result.tenGods
                .hour.stem,

            branch:
              result.tenGods
                .hour.branch,
          }
        : null,
  };
}

function normalizeMajorLuck(
  result: ReturnType<
    typeof calculateFourPillars
  >,
  precision:
    MajorLuckPrecision,
): MajorLuck | null {
  const luck =
    result.luckPillars;

  if (!luck) {
    return null;
  }

  const sequenceOnly =
    precision ===
    "sequence-only";

  const pillars:
    MajorLuckPillar[] =
    luck.pillars.map(
      (item) => {
        const heavenlyStem =
          item.pillar
            .heavenlyStem;

        const earthlyBranch =
          item.pillar
            .earthlyBranch;

        return {
          age:
            sequenceOnly
              ? null
              : item.age,

          korean:
            item.korean,

          hanja:
            createHanjaGanji(
              heavenlyStem,
              earthlyBranch,
            ),

          heavenlyStem,

          earthlyBranch,
        };
      },
    );

  return {
    forward:
      luck.forward,

    direction:
      luck.forward
        ? "순행"
        : "역행",

    precision,

    startAge:
      sequenceOnly
        ? null
        : luck.startAge,

    startYears:
      sequenceOnly
        ? null
        : luck.startYears,

    startMonths:
      sequenceOnly
        ? null
        : luck.startMonths,

    startDays:
      sequenceOnly
        ? null
        : luck.startDays,

    pillars,
  };
}

function compareBoundary(
  first: ReturnType<
    typeof calculateFourPillars
  >,
  second: ReturnType<
    typeof calculateFourPillars
  >,
) {
  const a =
    first.toObject();

  const b =
    second.toObject();

  return (
    a.year !== b.year ||
    a.month !== b.month ||
    a.day !== b.day
  );
}

export function calculateSaju(
  input: SajuInput,
): SajuCalculationResult {
  const effective =
    getEffectiveBirthTime(
      input,
    );

  const result =
    calculateEngine(
      input,
      effective.hour,
      effective.minute,
    );

  const korean =
    result.toObject();

  const yearPillar =
    createPillar(
      korean.year,
    );

  const monthPillar =
    createPillar(
      korean.month,
    );

  const dayPillar =
    createPillar(
      korean.day,
    );

  const hourPillar =
    effective.timeKnown
      ? createPillar(
          korean.hour,
        )
      : null;

  const dayMaster =
    createDayMaster(
      dayPillar,
    );

  let boundaryAmbiguous =
    false;

  const warnings:
    string[] = [];

  if (
    input.birthTimeMode ===
    "unknown"
  ) {
    const startOfDay =
      calculateEngine(
        input,
        0,
        0,
      );

    const endOfDay =
      calculateEngine(
        input,
        23,
        59,
      );

    boundaryAmbiguous =
      compareBoundary(
        startOfDay,
        endOfDay,
      );

    warnings.push(
      "출생시간이 없어 시주를 제외한 해석입니다.",
    );

    warnings.push(
      "대운의 순행·역행과 간지 흐름은 볼 수 있지만 정확한 시작 나이는 표시하지 않습니다.",
    );

    if (
      boundaryAmbiguous
    ) {
      warnings.push(
        "출생일이 절기 경계일에 해당해 실제 출생시간에 따라 연주 또는 월주가 달라질 수 있습니다.",
      );
    }
  }

  if (
    input.birthTimeMode ===
    "shichen" &&
    input.birthShichen
  ) {
    const config =
      shichenConfig[
        input.birthShichen
      ];

    warnings.push(
      `${config.label}(${config.start}~${config.end}) 기준으로 시주를 계산했습니다. 대운 시작 시점은 대표시각 ${config.representative} 기준의 근사값입니다.`,
    );

    if (
      input.birthShichen ===
      "자"
    ) {
      warnings.push(
        "자시는 자정 경계를 포함하므로 실제 출생시각이 23시대인지 0시대인지에 따라 일부 계산 기준이 달라질 수 있습니다.",
      );

      const early =
        calculateEngine(
          input,
          0,
          0,
        );

      const late =
        calculateEngine(
          input,
          23,
          59,
        );

      boundaryAmbiguous =
        compareBoundary(
          early,
          late,
        );
    } else {
      const start =
        parseBirthTime(
          config.start,
        );

      const end =
        parseBirthTime(
          config.end,
        );

      const rangeStart =
        calculateEngine(
          input,
          start.hour,
          start.minute,
        );

      const rangeEnd =
        calculateEngine(
          input,
          end.hour,
          end.minute,
        );

      boundaryAmbiguous =
        compareBoundary(
          rangeStart,
          rangeEnd,
        );

      if (
        boundaryAmbiguous
      ) {
        warnings.push(
          "선택한 시간대 안에 절기 경계가 있어 실제 출생시각에 따라 연주 또는 월주가 달라질 수 있습니다.",
        );
      }
    }
  }

  const fiveElements =
    calculateFiveElements([
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
    ]);

  const tenGods =
    normalizeTenGods(
      result,
      effective.timeKnown,
    );

  const luckPrecision:
    MajorLuckPrecision =
    input.birthTimeMode ===
    "exact"
      ? "exact"
      : input.birthTimeMode ===
          "shichen"
        ? "approximate"
        : "sequence-only";

  const majorLuck =
    normalizeMajorLuck(
      result,
      luckPrecision,
    );

  return {
    fourPillars: {
      year:
        yearPillar,

      month:
        monthPillar,

      day:
        dayPillar,

      hour:
        hourPillar,
    },

    dayMaster,

    fiveElements,

    tenGods,

    voidBranches:
      [
        ...result
          .voidBranches,
      ],

    majorLuck,

    warnings,

    metadata: {
      engineVersion:
        SAJU_ENGINE_VERSION,

      timezone:
        SAJU_CALCULATION_POLICY
          .timezone,

      calendarType:
        input.calendarType,

      timeKnown:
        effective.timeKnown,

      timePrecision:
        effective.timePrecision,

      selectedShichen:
        effective.selectedShichen,

      effectiveBirthTime:
        effective.effectiveBirthTime,

      birthRegion:
        input.birthRegion,

      dayBoundary:
        SAJU_CALCULATION_POLICY
          .dayBoundary,

      trueSolarTimeApplied:
        SAJU_CALCULATION_POLICY
          .trueSolarTime,

      boundaryAmbiguous,
    },
  };
}