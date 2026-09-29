import "server-only";

import { generateCareerNarrative, type CareerGeneration } from "./career-provider";

import { buildCareerSignals } from "@/lib/fortune/build-career-signals";

import type {
  PaidFortuneInterpretation,
  PaidFortuneSection,
} from "@/types/paid-fortune";

import type {
  ProductCode,
} from "@/types/product";

import type {
  FiveElement,
  SajuCalculationResult,
  SajuInput,
} from "@/types/saju";

import {
  buildCareerDetail,
} from "@/lib/fortune/build-career-detail";

import type {
  CareerContext,
} from "@/types/career-context";

type GeneratePaidFortuneParams = {
  productCode:
    ProductCode;

  input:
    SajuInput;

  calculation:
    SajuCalculationResult;

  careerContext?:
    CareerContext | null;
};

type ElementBalance = {
  dominant:
    FiveElement;

  dominantCount:
    number;

  weakest:
    FiveElement;

  weakestCount:
    number;
};

const elementTone:
  Record<
    FiveElement,
    {
      strength: string;

      money: string;

      relationship: string;

      career: string;

      workStrength: string;

      workRisk: string;

      environment: string;
    }
  > = {
  목: {
    strength:
      "성장과 확장을 중요하게 생각하는 흐름",

    money:
      "새로운 기회를 발견하고 키워가는 과정",

    relationship:
      "관계를 천천히 키우고 함께 성장하는 방식",

    career:
      "새로운 영역을 개척하고 발전시키는 역할",

    workStrength:
      "처음부터 완성된 답을 따르기보다 가능성을 발견하고 키우는 일",

    workRisk:
      "관심사가 넓어지면서 시작은 많지만 마무리와 우선순위 관리가 약해지는 패턴",

    environment:
      "개선 여지가 있고 스스로 방향을 만들어갈 수 있는 환경",
  },

  화: {
    strength:
      "표현력과 추진력이 빠르게 살아나는 흐름",

    money:
      "기회가 보일 때 빠르게 움직이는 성향",

    relationship:
      "감정과 관심을 비교적 분명하게 표현하는 방식",

    career:
      "사람을 움직이고 결과를 빠르게 만들어내는 역할",

    workStrength:
      "표현·설득·홍보·영업처럼 반응을 만들어내는 일",

    workRisk:
      "속도를 중시하다 판단이나 에너지 소모가 커질 수 있는 패턴",

    environment:
      "성과가 빠르게 확인되고 사람과의 상호작용이 활발한 환경",
  },

  토: {
    strength:
      "안정성과 지속성을 중요하게 여기는 흐름",

    money:
      "급격한 변화보다 축적과 관리에 강점을 두는 방식",

    relationship:
      "신뢰와 안정감을 차곡차곡 쌓아가는 방식",

    career:
      "구조를 만들고 꾸준히 유지하는 역할",

    workStrength:
      "운영·관리·조율처럼 흐름을 안정적으로 유지하는 일",

    workRisk:
      "안정성을 지나치게 중시해 변화 시점을 늦추는 패턴",

    environment:
      "역할과 책임이 비교적 명확하고 장기적으로 축적할 수 있는 환경",
  },

  금: {
    strength:
      "판단 기준과 선택의 선명함이 중요한 흐름",

    money:
      "효율과 손익을 따져 선택하려는 방식",

    relationship:
      "관계에서도 기준과 약속을 중요하게 보는 방식",

    career:
      "정리·판단·관리·전문성을 활용하는 역할",

    workStrength:
      "분석·검수·품질·전문 판단처럼 기준을 세우고 정리하는 일",

    workRisk:
      "완성도와 기준을 중시하면서 타인이나 자신에게 지나치게 엄격해지는 패턴",

    environment:
      "전문성·규칙·성과 기준이 비교적 명확한 환경",
  },

  수: {
    strength:
      "상황을 읽고 유연하게 대응하는 흐름",

    money:
      "정보와 흐름을 살핀 뒤 움직이는 방식",

    relationship:
      "상대의 분위기와 상황을 섬세하게 읽는 방식",

    career:
      "정보·소통·기획·연결을 활용하는 역할",

    workStrength:
      "정보를 모으고 연결해 방향을 찾는 기획·전략·소통 중심의 일",

    workRisk:
      "가능성을 오래 검토하다 결정 시점을 놓치거나 방향이 자주 바뀌는 패턴",

    environment:
      "정보 변화가 많고 다양한 사람·영역을 연결할 수 있는 환경",
  },
};

function findElementBalance(
  calculation:
    SajuCalculationResult,
): ElementBalance {
  const elements:
    FiveElement[] = [
      "목",
      "화",
      "토",
      "금",
      "수",
    ];

  const counts =
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
    [...counts].sort(
      (
        a,
        b,
      ) =>
        b.count -
        a.count,
    );

  const ascending =
    [...counts].sort(
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

function createWealthSections(
  input:
    SajuInput,

  calculation:
    SajuCalculationResult,
): PaidFortuneSection[] {
  const dayMaster =
    calculation.dayMaster;

  const tone =
    elementTone[
      dayMaster.element
    ];

  const {
    dominant,
    weakest,
  } =
    findElementBalance(
      calculation,
    );

  return [
    {
      id:
        "money-style",

      title:
        "돈을 대하는 기본 방식",

      content: [
        `${input.nickname}님의 일간은 ${dayMaster.korean}(${dayMaster.hanja}), ${dayMaster.yinYang}${dayMaster.element}의 성향으로 계산됩니다.`,

        `기본적으로 ${tone.money}이 재물 문제에서 두드러질 수 있습니다.`,

        "다만 이것은 수익 규모를 예언하는 의미가 아니라, 재정적 선택에서 어떤 방식이 편하게 느껴질 수 있는지를 살펴보는 참고 자료입니다.",
      ],

      keywords: [
        dayMaster.element,
        dominant,
        "재물 성향",
      ],
    },

    {
      id:
        "balance",

      title:
        "재물 흐름에서 살펴볼 균형",

      content: [
        `현재 단순 오행 분포에서는 ${dominant} 기운이 상대적으로 많이 나타나고, ${weakest} 기운은 비교적 적게 나타납니다.`,

        `따라서 ${dominant}의 장점을 활용하되 한 방향으로만 판단하지 않는 것이 중요합니다.`,

        `${weakest}의 성격에 해당하는 관점은 의식적으로 보완해보는 방식으로 참고할 수 있습니다.`,
      ],
    },

    {
      id:
        "major-luck",

      title:
        "큰 흐름을 볼 때의 관점",

      content:
        calculation.majorLuck
          ? [
              `대운은 ${calculation.majorLuck.direction}으로 계산됩니다.`,

              calculation
                .majorLuck
                .precision ===
              "sequence-only"
                ? "출생시간이 없어 정확한 시작 나이는 특정하지 않고 대운 간지의 순서만 참고합니다."
                : `현재 계산에서는 첫 대운이 약 ${calculation.majorLuck.startAge}세 전후에 시작하는 흐름으로 나타납니다.`,

              "대운은 특정 시기에 반드시 돈이 생기거나 손실이 난다는 의미가 아니라, 장기간의 선택 환경을 해석하는 보조 지표로 사용하는 것이 적절합니다.",
            ]
          : [
              "현재 입력정보로는 대운 정보를 충분히 계산하지 못했습니다.",

              "재물 판단은 현재 확인 가능한 사주 구조를 중심으로 참고해주세요.",
            ],
    },
  ];
}

function createLoveSections(
  input:
    SajuInput,

  calculation:
    SajuCalculationResult,
): PaidFortuneSection[] {
  const dayMaster =
    calculation.dayMaster;

  const tone =
    elementTone[
      dayMaster.element
    ];

  const {
    dominant,
    weakest,
  } =
    findElementBalance(
      calculation,
    );

  return [
    {
      id:
        "relationship-style",

      title:
        "관계에서 나타나는 기본 방식",

      content: [
        `${input.nickname}님의 일간은 ${dayMaster.korean}(${dayMaster.hanja})으로, 관계에서는 ${tone.relationship}이 나타날 수 있습니다.`,

        "친밀한 관계일수록 자신의 기준뿐 아니라 상대의 속도와 표현 방식을 함께 살펴보는 것이 중요합니다.",
      ],
    },

    {
      id:
        "relationship-balance",

      title:
        "관계의 균형 포인트",

      content: [
        `단순 오행 분포에서는 ${dominant} 기운이 상대적으로 두드러지고 ${weakest} 기운이 비교적 적습니다.`,

        "강하게 드러나는 성향은 매력이 될 수 있지만, 반복되면 상대에게는 부담으로 느껴질 수도 있습니다.",

        `특히 ${weakest}의 성격에 해당하는 소통 방식은 관계에서 의식적으로 보완해볼 만한 지점입니다.`,
      ],
    },

    {
      id:
        "relationship-guide",

      title:
        "관계를 오래 이어가기 위한 관점",

      content: [
        "사주의 궁합이나 연애운은 상대방과의 실제 관계를 대신 판단하는 도구가 아닙니다.",

        "서로의 대화 방식, 생활 가치관, 갈등 해결 방식처럼 현실적인 요소와 함께 참고하는 것이 좋습니다.",
      ],
    },
  ];
}

export async function generatePaidFortune({
  productCode,
  input,
  calculation,
  careerContext,
}: GeneratePaidFortuneParams): Promise<PaidFortuneInterpretation> {
  let career: CareerGeneration | undefined;

  let sections:
    PaidFortuneSection[];

  let headline:
    string;

  let summary:
    string;

  let keyTakeaways:
    string[];

  let version:
    string;

  if (
    productCode ===
    "wealth"
  ) {
    sections =
      createWealthSections(
        input,
        calculation,
      );

    headline =
      `${input.nickname}님의 재물 흐름을 구조부터 살펴봤어요`;

    summary =
      "재물운은 단순히 돈이 들어오는 시기를 맞히는 것이 아니라, 돈을 대하는 성향과 선택의 패턴을 이해하는 데 초점을 맞춥니다.";

    keyTakeaways = [
      "돈을 버는 방식뿐 아니라 돈을 판단하고 관리하는 습관을 함께 살펴보는 것이 중요합니다.",

      "강하게 나타나는 오행의 장점은 활용하되 한 방향으로 판단이 치우치지 않는지 확인해볼 필요가 있습니다.",

      "대운은 수익을 보장하는 시기가 아니라 장기적인 선택 환경을 읽는 참고 흐름으로 활용하는 것이 적절합니다.",
    ];

    version =
      "paid-rule-0.1.0";
  } else if (
    productCode ===
    "love"
  ) {
    sections =
      createLoveSections(
        input,
        calculation,
      );

    headline =
      `${input.nickname}님의 관계 방식에는 이런 특징이 있어요`;

    summary =
      "연애·결혼운은 관계에서 자연스럽게 나타나는 성향과 균형 포인트를 중심으로 살펴봅니다.";

    keyTakeaways = [
      "관계에서 자연스럽게 드러나는 표현 방식과 상대가 받아들이는 방식을 함께 살펴보는 것이 중요합니다.",

      "강하게 나타나는 성향은 매력이 될 수 있지만 반복될 경우 관계의 부담 요소가 될 수도 있습니다.",

      "연애와 결혼은 실제 가치관과 소통 방식이 중요하므로 사주 결과는 관계를 이해하는 참고 자료로 활용하는 것이 좋습니다.",
    ];

    version =
      "paid-rule-0.1.0";
  } else if (
    productCode ===
    "career"
  ) {
    const signals = buildCareerSignals(calculation);
    career = await generateCareerNarrative(signals);
    sections = career.sections;

    headline = `${input.nickname}님의 일하는 방식과 커리어 흐름을 깊이 살펴봤어요`;
    summary = "어떤 일을 맡을 때 강점이 살아나는지, 지금의 커리어를 어떻게 점검할지, 다음 기회를 위해 무엇을 준비할지 열 가지 이야기로 풀어봅니다.";
    keyTakeaways = [
  sections[0].summary ??
    signals.dayMaster.workStyle,

  signals.monthPillar.themes.length
    ? `월주의 참고 주제: ${signals.monthPillar.themes.join(" · ")}`
    : "월주의 해석 주제는 현재 확인할 수 없습니다.",

  careerContext?.hasContext
    ? `현재 ${
        careerContext.jobTitle ??
        "입력한 직업"
      }의 실제 업무와 고민을 함께 비교해 해석합니다.`
    : "해석은 실제 업무 경험과 비교하고, 커리어 선택은 경력·기술·보상 조건을 함께 확인하세요.",
];
    version = career.version;
  } else if (
    productCode ===
    "full_saju"
  ) {
    career = await generateCareerNarrative(buildCareerSignals(calculation));
    sections = [...createWealthSections(input, calculation), ...createLoveSections(input, calculation), ...career.sections];

    headline =
      `${input.nickname}님의 사주를 여러 방향에서 깊이 살펴봤어요`;

    summary =
      "기본 성향과 재물, 관계, 직업 흐름을 하나의 구조 안에서 함께 살펴보는 종합 분석입니다.";

    keyTakeaways = [
      "재물·관계·직업은 서로 분리된 영역이 아니라 기본 성향과 선택 방식에서 서로 연결되어 나타날 수 있습니다.",

      "강하게 드러나는 특징과 상대적으로 부족한 관점을 함께 보는 것이 전체 사주를 균형 있게 이해하는 데 도움이 됩니다.",

      "대운을 포함한 장기 흐름은 미래를 확정하는 예측보다 삶의 선택 환경을 점검하는 참고 자료로 활용하는 것이 적절합니다.",
    ];

    version =
      `paid-full-0.2.0+${career.version}`;
  } else {
    throw new Error(
      "아직 유료 해석 생성이 지원되지 않는 상품입니다.",
    );
  }

  return {
    ...(career ? { generation: career.generation } : {}),
    version,

    productCode,

    headline,

    summary,

    keyTakeaways,

    sections,

    actionPoints: productCode === "career" ? ["후보 직업 두 개의 실제 업무와 요구 기술을 비교하고, 내 경험으로 설명할 수 있는 사례를 고르세요.", "현재 일에서 유지할 조건·협상할 조건·탐색할 조건을 하나씩 정하세요.", "이번 주에 완성할 결과물과 피드백을 받을 날짜를 달력에 넣으세요."] : [
      "결과를 미래의 확정된 사건이 아니라 자신의 선택 패턴을 점검하는 참고 자료로 활용해보세요.",

      "강하게 나타나는 특징만큼 상대적으로 적게 나타나는 관점도 함께 살펴보는 것이 좋습니다.",

      "중요한 재정·직업·관계 결정은 실제 상황과 객관적인 정보도 함께 검토해주세요.",
    ],

    caution:
      "운담의 사주·운세 분석은 전통 명리 해석을 바탕으로 한 참고·오락성 콘텐츠이며 미래의 결과를 보장하지 않습니다.",

    careerDetail:
  productCode === "career"
    ? buildCareerDetail(
        buildCareerSignals(
          calculation,
        ),
        careerContext,
      )
    : undefined,

    generatedAt:
      new Date()
        .toISOString(),
  };
}