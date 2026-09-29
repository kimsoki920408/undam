import "server-only";

import type {
  FiveElement,
  SajuCalculationResult,
} from "@/types/saju";

export type CareerSignal = {
  id: string;

  label: string;

  value: string;

  meaning: string;

  source: string;
};

export type CareerSignals = {
  dayMaster: {
    korean: string;

    hanja: string;

    element:
      FiveElement;

    yinYang:
      "양" | "음";

    workStyle:
      string;
  };

  elementBalance: {
    dominant:
      FiveElement;

    dominantCount:
      number;

    weakest:
      FiveElement;

    weakestCount:
      number;

    note: string;
  };

  monthPillar: {
    stemTenGod:
      string | null;

    branchTenGod:
      string | null;

    themes:
      string[];
  };

  majorLuck: {
    available:
      boolean;

    direction:
      string | null;

    precision:
      string | null;

    startAge:
      number | null;

    preview:
      string[];
  };

  signals:
    CareerSignal[];

  cautions:
    string[];
};

const elementWorkStyle:
  Record<
    FiveElement,
    string
  > = {
  목:
    "새로운 것을 시작하고 성장시키는 과정에서 동력이 생기기 쉬운 편",

  화:
    "사람의 반응을 만들고 빠르게 움직이는 과정에서 강점을 활용하기 쉬운 편",

  토:
    "흐름을 안정시키고 운영·관리하는 과정에서 강점을 활용하기 쉬운 편",

  금:
    "기준을 세우고 판단·정리·전문화하는 과정에서 강점을 활용하기 쉬운 편",

  수:
    "정보를 읽고 연결·기획·조율하는 과정에서 강점을 활용하기 쉬운 편",
};

const tenGodCareerThemes:
  Record<
    string,
    string[]
  > = {
  비견: [
    "자기주도",
    "동료 관계",
    "경쟁과 협업",
  ],

  겁재: [
    "경쟁 환경",
    "추진력",
    "주도권",
  ],

  식신: [
    "기술 숙련",
    "생산성",
    "꾸준한 결과물",
  ],

  상관: [
    "표현력",
    "개선",
    "기존 방식 재검토",
  ],

  편재: [
    "시장 감각",
    "영업",
    "외부 기회",
  ],

  정재: [
    "현실적인 성과",
    "안정적 수익",
    "관리",
  ],

  편관: [
    "성과 압박",
    "책임",
    "실행력",
  ],

  정관: [
    "규칙",
    "조직 역할",
    "책임",
  ],

  편인: [
    "분석",
    "독창적 학습",
    "전문 영역 탐색",
  ],

  정인: [
    "지식 축적",
    "학습",
    "자격·전문성",
  ],
};

function getElementBalance(
  calculation:
    SajuCalculationResult,
) {
  const elements:
    FiveElement[] = [
      "목",
      "화",
      "토",
      "금",
      "수",
    ];

  const values =
    elements.map(
      (element) => ({
        element,

        count:
          calculation
            .fiveElements[
            element
          ],
      }),
    );

  const descending =
    [...values].sort(
      (
        a,
        b,
      ) =>
        b.count -
        a.count,
    );

  const ascending =
    [...values].sort(
      (
        a,
        b,
      ) =>
        a.count -
        b.count,
    );

  return {
    dominant:
      descending[0]
        .element,

    dominantCount:
      descending[0]
        .count,

    weakest:
      ascending[0]
        .element,

    weakestCount:
      ascending[0]
        .count,
  };
}

function unique(
  values: string[],
) {
  return [
    ...new Set(
      values,
    ),
  ];
}

function getMonthThemes(
  calculation:
    SajuCalculationResult,
) {
  const stemTenGod =
    calculation
      .tenGods
      .month
      ?.stem ??
    null;

  const branchTenGod =
    calculation
      .tenGods
      .month
      ?.branch ??
    null;

  const themes =
    unique([
      ...(stemTenGod
        ? tenGodCareerThemes[
            stemTenGod
          ] ?? []
        : []),

      ...(branchTenGod
        ? tenGodCareerThemes[
            branchTenGod
          ] ?? []
        : []),
    ]);

  return {
    stemTenGod,

    branchTenGod,

    themes,
  };
}

function getMajorLuck(
  calculation:
    SajuCalculationResult,
) {
  const luck =
    calculation.majorLuck;

  if (!luck) {
    return {
      available:
        false,

      direction:
        null,

      precision:
        null,

      startAge:
        null,

      preview:
        [],
    };
  }

  return {
    available:
      true,

    direction:
      luck.direction,

    precision:
      luck.precision,

    startAge:
      luck.startAge,

    preview:
      luck.pillars
        .slice(
          0,
          5,
        )
        .map(
          (
            pillar,
            index,
          ) => {
            if (
              pillar.age !==
              null
            ) {
              return `${pillar.age}세 ${pillar.korean}(${pillar.hanja})`;
            }

            return `${index + 1}번째 대운 ${pillar.korean}(${pillar.hanja})`;
          },
        ),
  };
}

export function buildCareerSignals(
  calculation:
    SajuCalculationResult,
): CareerSignals {
  const dayMaster =
    calculation.dayMaster;

  const balance =
    getElementBalance(
      calculation,
    );

  const month =
    getMonthThemes(
      calculation,
    );

  const majorLuck =
    getMajorLuck(
      calculation,
    );

  const signals:
    CareerSignal[] = [
    {
      id:
        "day-master",

      label:
        "일간",

      value:
        `${dayMaster.korean}(${dayMaster.hanja}) · ${dayMaster.yinYang}${dayMaster.element}`,

      meaning:
        elementWorkStyle[
          dayMaster.element
        ],

      source:
        "사주 계산 결과의 일간",
    },

    {
      id:
        "dominant-element",

      label:
        "상대적으로 많이 보이는 오행",

      value:
        `${balance.dominant} · ${balance.dominantCount}`,

      meaning:
        `${balance.dominant}의 특성이 현재 단순 오행 분포에서 상대적으로 많이 나타납니다.`,

      source:
        "천간과 지지 본오행 단순 집계",
    },

    {
      id:
        "weak-element",

      label:
        "상대적으로 적게 보이는 오행",

      value:
        `${balance.weakest} · ${balance.weakestCount}`,

      meaning:
        `${balance.weakest}의 관점을 실제 업무에서 빠뜨리고 있지 않은지 참고할 수 있습니다.`,

      source:
        "천간과 지지 본오행 단순 집계",
    },
  ];

  if (
    month.stemTenGod
  ) {
    signals.push({
      id:
        "month-stem-ten-god",

      label:
        "월간 십성",

      value:
        month.stemTenGod,

      meaning:
        (
          tenGodCareerThemes[
            month.stemTenGod
          ] ?? []
        ).join(
          " · ",
        ),

      source:
        "월간과 일간의 십성 관계",
    });
  }

  if (
    month.branchTenGod
  ) {
    signals.push({
      id:
        "month-branch-ten-god",

      label:
        "월지 십성",

      value:
        month.branchTenGod,

      meaning:
        (
          tenGodCareerThemes[
            month.branchTenGod
          ] ?? []
        ).join(
          " · ",
        ),

      source:
        "월지와 일간의 십성 관계",
    });
  }

  if (
    majorLuck.available
  ) {
    signals.push({
      id:
        "major-luck",

      label:
        "대운",

      value:
        `${majorLuck.direction ?? ""} · ${
          formatPrecision(
            majorLuck.precision,
          )
        }`,

      meaning:
        "장기간의 선택 환경을 살펴보는 보조 흐름으로 사용합니다.",

      source:
        "대운 계산 결과",
    });
  }

  return {
    dayMaster: {
      korean:
        dayMaster.korean,

      hanja:
        dayMaster.hanja,

      element:
        dayMaster.element,

      yinYang:
        dayMaster.yinYang,

      workStyle:
        elementWorkStyle[
          dayMaster.element
        ],
    },

    elementBalance: {
      dominant:
        balance.dominant,

      dominantCount:
        balance.dominantCount,

      weakest:
        balance.weakest,

      weakestCount:
        balance.weakestCount,

      note:
        "현재 오행 분포는 천간과 지지의 본오행을 단순 집계한 값이며 신강·신약, 용신 판단과 동일한 의미가 아닙니다.",
    },

    monthPillar: {
      stemTenGod:
        month.stemTenGod,

      branchTenGod:
        month.branchTenGod,

      themes:
        month.themes,
    },

    majorLuck,

    signals,

    cautions: [
      "직업운은 특정 직업의 성공 여부를 판정하지 않습니다.",

      "오행 개수만으로 직업 적합도를 단정하지 않습니다.",

      "현재 단계에서는 신강·신약과 용신을 직업 추천 근거로 사용하지 않습니다.",

      "대운은 승진·퇴사·창업 같은 사건을 확정적으로 예측하는 값으로 사용하지 않습니다.",

      "실제 직업 결정은 경력, 기술, 소득, 시장 상황과 함께 판단해야 합니다.",
    ],
  };
}

function formatPrecision(
  value:
    string | null,
) {
  if (
    value ===
    "exact"
  ) {
    return "정확한 시간 기준";
  }

  if (
    value ===
    "approximate"
  ) {
    return "대략적인 시간 기준";
  }

  if (
    value ===
    "sequence-only"
  ) {
    return "순서만 확인 가능";
  }

  return "정밀도 확인 불가";
}