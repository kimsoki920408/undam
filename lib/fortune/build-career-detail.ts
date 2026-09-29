import "server-only";

import type {
  CareerFortuneDetail,
  CareerFitLevel,
  CareerLuckPeriod,
  CareerRoleFit,
} from "@/types/career-fortune";

import type {
  CareerSignals,
} from "@/lib/fortune/build-career-signals";

import type {
  CareerContext,
} from "@/types/career-context";

import {
  buildCurrentJobVerdict,
} from "@/lib/fortune/build-current-job-verdict";

import {
  classifyCareerContext,
} from "@/lib/fortune/classify-career-context";

import {
  buildCareerMoneyStyle,
} from "@/lib/fortune/build-career-money-style";

import {
  buildCareerRecommendations,
} from "@/lib/fortune/build-career-recommendations";

type Element =
  | "목"
  | "화"
  | "토"
  | "금"
  | "수";

type YinYang =
  | "양"
  | "음";

type TenGod =
  | "비견"
  | "겁재"
  | "식신"
  | "상관"
  | "편재"
  | "정재"
  | "편관"
  | "정관"
  | "편인"
  | "정인";

type StemInfo = {
  korean: string;

  element:
    Element;

  yinYang:
    YinYang;
};

type RoleScore = {
  employee: number;

  specialist: number;

  sales: number;

  business: number;

  leadership: number;
};

const stemInfo:
  Record<
    string,
    StemInfo
  > = {
  갑: {
    korean: "갑",
    element: "목",
    yinYang: "양",
  },

  을: {
    korean: "을",
    element: "목",
    yinYang: "음",
  },

  병: {
    korean: "병",
    element: "화",
    yinYang: "양",
  },

  정: {
    korean: "정",
    element: "화",
    yinYang: "음",
  },

  무: {
    korean: "무",
    element: "토",
    yinYang: "양",
  },

  기: {
    korean: "기",
    element: "토",
    yinYang: "음",
  },

  경: {
    korean: "경",
    element: "금",
    yinYang: "양",
  },

  신: {
    korean: "신",
    element: "금",
    yinYang: "음",
  },

  임: {
    korean: "임",
    element: "수",
    yinYang: "양",
  },

  계: {
    korean: "계",
    element: "수",
    yinYang: "음",
  },
};

const branchElement:
  Record<
    string,
    Element
  > = {
  자: "수",
  축: "토",
  인: "목",
  묘: "목",
  진: "토",
  사: "화",
  오: "화",
  미: "토",
  신: "금",
  유: "금",
  술: "토",
  해: "수",
};

const elementProduces:
  Record<
    Element,
    Element
  > = {
  목: "화",
  화: "토",
  토: "금",
  금: "수",
  수: "목",
};

const elementControls:
  Record<
    Element,
    Element
  > = {
  목: "토",
  화: "금",
  토: "수",
  금: "목",
  수: "화",
};

const elementWorkThemes:
  Record<
    Element,
    {
      headline: string;

      bestDirections:
        string[];

      riskyPattern: string;

      moneyStyle: string;

      opportunity: string;
    }
  > = {
  목: {
    headline:
      "새로운 판을 만들고 키울 때 힘이 살아나는 타입",

    bestDirections: [
      "기획",
      "신사업",
      "사업개발",
      "교육·육성",
      "프로젝트 리딩",
    ],

    riskyPattern:
      "가능성을 너무 많이 벌여놓고 하나를 끝까지 돈과 성과로 만들지 못하는 것",

    moneyStyle:
      "작은 기회를 발견해 키우고 고객·프로젝트·성과를 축적할 때 수입이 커지는 방식",

    opportunity:
      "정체된 것을 개선하거나 새로운 시장·고객·프로젝트를 열 때 기회가 살아납니다.",
  },

  화: {
    headline:
      "사람을 움직이고 반응을 만들어낼 때 존재감이 커지는 타입",

    bestDirections: [
      "영업",
      "마케팅",
      "브랜딩",
      "콘텐츠",
      "리더십",
    ],

    riskyPattern:
      "초반 추진력은 강하지만 흥미가 떨어진 뒤 관리와 마무리가 약해지는 것",

    moneyStyle:
      "표현력·인지도·설득력·성과가 바로 보상으로 연결되는 구조에서 수입을 키우는 방식",

    opportunity:
      "사람 앞에 서거나 결과를 빠르게 보여줄 수 있는 자리에서 기회가 살아납니다.",
  },

  토: {
    headline:
      "흐트러진 판을 정리하고 안정적으로 굴릴 때 강한 타입",

    bestDirections: [
      "운영",
      "관리",
      "재무",
      "조직관리",
      "프로세스 개선",
    ],

    riskyPattern:
      "안정을 지키려다 변화해야 할 시기를 지나치게 늦추는 것",

    moneyStyle:
      "꾸준한 현금흐름과 반복 가능한 구조를 쌓아 장기적으로 수입을 늘리는 방식",

    opportunity:
      "혼란스러운 조직이나 사업을 체계화하고 반복 가능한 시스템으로 만들 때 기회가 살아납니다.",
  },

  금: {
    headline:
      "기준을 세우고 정확한 판단을 내릴 때 가치가 높아지는 타입",

    bestDirections: [
      "전문직",
      "분석",
      "품질관리",
      "재무·법무",
      "전략",
    ],

    riskyPattern:
      "완벽한 답을 찾느라 실행 속도가 떨어지거나 사람에게 지나치게 엄격해지는 것",

    moneyStyle:
      "전문성·정확성·판단력을 희소한 기술로 만들어 높은 단가를 받는 방식",

    opportunity:
      "아무나 하기 어려운 판단과 전문성이 필요한 영역에서 기회가 살아납니다.",
  },

  수: {
    headline:
      "정보와 사람을 연결해 흐름을 읽을 때 강점이 커지는 타입",

    bestDirections: [
      "전략",
      "기획",
      "컨설팅",
      "유통",
      "네트워크 사업",
    ],

    riskyPattern:
      "정보를 너무 많이 모으다가 결정이 늦어지고 방향이 계속 바뀌는 것",

    moneyStyle:
      "정보·관계·유통·연결 능력을 활용해 여러 기회를 하나의 수익 구조로 묶는 방식",

    opportunity:
      "사람과 정보가 많이 오가는 영역에서 남보다 빠르게 흐름을 읽을 때 기회가 살아납니다.",
  },
};

const tenGodRoleEffects:
  Record<
    TenGod,
    RoleScore
  > = {
  비견: {
    employee: 0,
    specialist: 1,
    sales: 1,
    business: 2,
    leadership: 2,
  },

  겁재: {
    employee: -1,
    specialist: 0,
    sales: 2,
    business: 2,
    leadership: 2,
  },

  식신: {
    employee: 1,
    specialist: 2,
    sales: 1,
    business: 1,
    leadership: 0,
  },

  상관: {
    employee: -1,
    specialist: 1,
    sales: 2,
    business: 2,
    leadership: 1,
  },

  편재: {
    employee: 0,
    specialist: 0,
    sales: 3,
    business: 3,
    leadership: 1,
  },

  정재: {
    employee: 2,
    specialist: 1,
    sales: 1,
    business: 1,
    leadership: 1,
  },

  편관: {
    employee: 1,
    specialist: 1,
    sales: 1,
    business: 1,
    leadership: 3,
  },

  정관: {
    employee: 3,
    specialist: 1,
    sales: 0,
    business: -1,
    leadership: 2,
  },

  편인: {
    employee: 0,
    specialist: 3,
    sales: 0,
    business: 1,
    leadership: 0,
  },

  정인: {
    employee: 2,
    specialist: 3,
    sales: 0,
    business: 0,
    leadership: 1,
  },
};

const tenGodHeadline:
  Record<
    TenGod,
    string
  > = {
  비견:
    "남이 정해준 답보다 내가 직접 판단하고 결과를 만드는 힘",

  겁재:
    "경쟁 속에서 밀리지 않고 판을 가져오는 힘",

  식신:
    "꾸준히 결과물을 만들어 실력으로 증명하는 힘",

  상관:
    "기존 방식을 깨고 더 나은 방법을 만들어내는 힘",

  편재:
    "고객·시장·돈이 움직이는 곳에서 기회를 잡는 감각",

  정재:
    "현실적인 성과와 안정적인 수익을 쌓는 힘",

  편관:
    "압박과 경쟁 속에서 결과를 만들어내는 승부 근성",

  정관:
    "책임과 규칙이 있는 조직에서 신뢰를 쌓는 힘",

  편인:
    "남들이 보지 못하는 관점과 전문성을 파고드는 힘",

  정인:
    "배우고 축적한 지식을 신뢰와 전문성으로 만드는 힘",
};

export function buildCareerDetail(
  signals:
    CareerSignals,

  careerContext?:
    CareerContext | null,
): CareerFortuneDetail {

  const element =
    signals
      .dayMaster
      .element;

  const workTheme =
    elementWorkThemes[
      element
    ];

  const monthGods =
    [
      signals
        .monthPillar
        .stemTenGod,

      signals
        .monthPillar
        .branchTenGod,
    ].filter(
      (
        value,
      ): value is TenGod =>
        isTenGod(
          value,
        ),
    );

  const roleScore =
    calculateRoleScores(
      monthGods,
      signals,
    );

  const roleComparison = {
    employee:
      createRoleFit(
        "employee",
        roleScore.employee,
        signals,
      ),

    specialist:
      createRoleFit(
        "specialist",
        roleScore.specialist,
        signals,
      ),

    sales:
      createRoleFit(
        "sales",
        roleScore.sales,
        signals,
      ),

    business:
      createRoleFit(
        "business",
        roleScore.business,
        signals,
      ),

    leadership:
      createRoleFit(
        "leadership",
        roleScore.leadership,
        signals,
      ),
  };

  const currentJob =
  buildCurrentJobVerdict(
    careerContext,
    roleComparison,
  );

  const recommendedRoles =
  buildCareerRecommendations(
    careerContext,
    roleComparison,
  );

  const strongestGod =
    monthGods[0] ??
    null;

  const strongestMessage =
    strongestGod
      ? tenGodHeadline[
          strongestGod
        ]
      : signals
          .dayMaster
          .workStyle;

  return {
    version:
      "career-detail-0.7.0",

    verdict: {
      headline:
        workTheme
          .headline,

      subheadline:
        `${strongestMessage}이 커리어의 핵심 무기로 작동하기 쉽습니다.`,

      strength:
        buildStrengthStatement(
          signals,
          monthGods,
        ),

      weakness:
        `가장 조심할 것은 ${workTheme.riskyPattern}입니다.`,

      bestDirection:
        `${workTheme.bestDirections.slice(0, 3).join(" · ")}처럼 결과를 직접 만들고 변화시킬 수 있는 역할을 우선적으로 살펴보는 편이 좋습니다.`,

      biggestWarning:
        buildBiggestWarning(
          signals,
          monthGods,
        ),
    },

    recommendedRoles,

    avoidEnvironments:
      buildAvoidEnvironments(
        signals,
        monthGods,
      ),

    roleComparison,

    moneyStyle:
  buildCareerMoneyStyle(
    buildMoneyStyle(
      signals,
      monthGods,
    ),
    careerContext,
  ),

    currentJob,

    luckPeriods:
      buildLuckPeriods(
        signals,
      ),

    wakeUpCall:
  buildWakeUpCall(
    signals,
    monthGods,
    careerContext,
  ),

hopePoint:
  buildHopePoint(
    signals,
    monthGods,
    careerContext,
  ),

    ninetyDayPlan:
  buildNinetyDayPlan(
    signals,
    careerContext,
  ),

    disclaimer:
      "이 결과는 전통 명리학의 구조를 현대적인 직업·커리어 언어로 해석한 참고 콘텐츠입니다. 특정 직업의 성공이나 특정 시기의 사건을 보장하지 않으며 실제 선택에서는 경력, 소득, 기술, 시장 상황을 함께 판단해야 합니다.",
  };
}

function calculateRoleScores(
  gods:
    TenGod[],

  signals:
    CareerSignals,
): RoleScore {
  const score:
    RoleScore = {
    employee: 1,
    specialist: 1,
    sales: 1,
    business: 1,
    leadership: 1,
  };

  for (
    const god
    of gods
  ) {
    const effect =
      tenGodRoleEffects[
        god
      ];

    score.employee +=
      effect.employee;

    score.specialist +=
      effect.specialist;

    score.sales +=
      effect.sales;

    score.business +=
      effect.business;

    score.leadership +=
      effect.leadership;
  }

  if (
    signals
      .dayMaster
      .yinYang ===
    "양"
  ) {
    score.sales += 1;
    score.business += 1;
    score.leadership += 1;
  } else {
    score.specialist += 1;
    score.employee += 1;
  }

  if (
    signals
      .elementBalance
      .dominant ===
    "목"
  ) {
    score.business += 1;
    score.leadership += 1;
  }

  if (
    signals
      .elementBalance
      .dominant ===
    "화"
  ) {
    score.sales += 1;
    score.leadership += 1;
  }

  if (
    signals
      .elementBalance
      .dominant ===
    "토"
  ) {
    score.employee += 1;
    score.leadership += 1;
  }

  if (
    signals
      .elementBalance
      .dominant ===
    "금"
  ) {
    score.specialist += 1;
    score.employee += 1;
  }

  if (
    signals
      .elementBalance
      .dominant ===
    "수"
  ) {
    score.sales += 1;
    score.specialist += 1;
  }

  return score;
}

function createRoleFit(
  role:
    keyof RoleScore,

  score:
    number,

  signals:
    CareerSignals,
): CareerRoleFit {
  const fit =
    scoreToFit(
      score,
    );

  const element =
    signals
      .dayMaster
      .element;

  const workTheme =
    elementWorkThemes[
      element
    ];

  if (
    role ===
    "employee"
  ) {
    return {
      id:
        "employee",

      title:
        "직장인·조직형",

      fit,

      oneLine:
        fit ===
          "very-good" ||
        fit ===
          "good"
          ? "조직 안에서도 역할과 권한이 분명하면 충분히 강점을 살릴 수 있습니다."
          : "시키는 일을 반복하는 조직형 커리어만으로는 답답함이 커질 수 있습니다.",

      why: [
        "직장 자체가 맞고 틀린 문제가 아니라 결정권과 성과 배분 구조가 중요합니다.",

        signals
          .dayMaster
          .yinYang ===
        "양"
          ? "양의 성향은 역할 안에서도 스스로 움직일 공간이 있을수록 힘이 살아나기 쉽습니다."
          : "음의 성향은 전문성을 깊게 쌓을 수 있는 조직에서 안정적으로 강점을 만들기 쉽습니다.",
      ],

      goodWhen: [
        "담당 영역과 책임이 명확할 때",

        "성과가 승진·보상·경력으로 연결될 때",

        "개선 제안을 실제 업무에 반영할 수 있을 때",
      ],

      cautionWhen: [
        "결정권 없이 책임만 늘어날 때",

        "연차만 쌓이고 실력이 남지 않을 때",

        "성과를 내도 보상 구조가 거의 변하지 않을 때",
      ],
    };
  }

  if (
    role ===
    "specialist"
  ) {
    return {
      id:
        "specialist",

      title:
        "전문직·전문가형",

      fit,

      oneLine:
        "한 분야에서 남이 쉽게 대체하기 어려운 실력을 만들수록 커리어의 값이 올라갑니다.",

      why: [
        `${workTheme.bestDirections[0]} 같은 강점을 깊게 파고들어 전문성으로 만들 수 있습니다.`,

        "전문가형 커리어는 성향보다 실제 기술과 경험을 축적했을 때 가장 강하게 작동합니다.",
      ],

      goodWhen: [
        "경험이 쌓일수록 단가와 영향력이 올라가는 분야",

        "자격·기술·실적이 눈에 보이게 남는 분야",

        "문제를 해결한 경험이 포트폴리오가 되는 분야",
      ],

      cautionWhen: [
        "배우기만 하고 실제 결과물을 만들지 않을 때",

        "시장 수요가 없는 전문성에만 매달릴 때",

        "실력을 설명하거나 판매하는 능력을 전혀 키우지 않을 때",
      ],
    };
  }

  if (
    role ===
    "sales"
  ) {
    return {
      id:
        "sales",

      title:
        "영업·사업개발형",

      fit,

      oneLine:
        "고객의 문제를 읽고 제안과 거래로 연결하는 일에서 가능성을 확인해볼 만합니다.",

      why: [
        "사람과 기회를 연결하고 결과가 바로 숫자로 나타나는 구조는 강점을 빠르게 확인할 수 있습니다.",

        signals
          .monthPillar
          .themes
          .includes(
            "시장 감각",
          )
          ? "월주의 해석 주제에 시장 감각이 포함되어 있어 외부 고객과 기회를 다루는 업무와 연결성이 있습니다."
          : "성과와 고객 반응을 통해 강점을 검증할 수 있다는 점이 장점입니다.",
      ],

      goodWhen: [
        "단순 판매보다 고객 문제를 파악해 제안할 수 있을 때",

        "성과가 인센티브·매출·실적으로 명확하게 남을 때",

        "고객 관계를 장기 자산으로 축적할 수 있을 때",
      ],

      cautionWhen: [
        "콜 수량만 강요하는 소모적인 구조",

        "상품 경쟁력 없이 개인의 인간관계만 소모해야 하는 구조",

        "단기 성과 때문에 신뢰를 훼손하는 방식",
      ],
    };
  }

  if (
    role ===
    "business"
  ) {
    return {
      id:
        "business",

      title:
        "창업·사업형",

      fit,

      oneLine:
        "사업 가능성은 있지만 아이디어보다 고객과 현금흐름을 증명했을 때 움직이는 것이 중요합니다.",

      why: [
        "주도권을 직접 가져갈 수 있다는 점은 강점과 잘 연결될 수 있습니다.",

        "다만 사업 적합성과 사업 성공은 완전히 다른 문제이며 실제 고객 검증과 자금 관리가 반드시 필요합니다.",
      ],

      goodWhen: [
        "이미 돈을 내는 고객이 존재할 때",

        "작게 테스트한 상품이나 서비스에서 반복 수요가 확인될 때",

        "혼자 하지 않아도 돌아갈 구조를 만들 수 있을 때",
      ],

      cautionWhen: [
        "아이디어만 믿고 큰 고정비부터 쓰는 것",

        "여러 사업을 동시에 시작하는 것",

        "매출과 현금흐름을 구분하지 않는 것",
      ],
    };
  }

  return {
    id:
      "leadership",

    title:
      "리더·관리형",

    fit,

    oneLine:
      "직접 잘하는 단계에서 사람과 시스템을 움직이는 단계로 넘어갈수록 영향력이 커질 수 있습니다.",

    why: [
      "리더십은 권한보다 결과를 반복 가능하게 만드는 능력에서 평가하는 것이 좋습니다.",

      "자신의 방식만 밀어붙이기보다 사람마다 다른 동기와 능력을 활용할 때 강점이 커집니다.",
    ],

    goodWhen: [
      "의사결정 권한과 책임이 함께 주어질 때",

      "팀의 성과 기준을 직접 설계할 수 있을 때",

      "사람을 키우고 시스템을 만들 수 있을 때",
    ],

    cautionWhen: [
      "내 방식만 옳다고 생각할 때",

      "모든 업무를 직접 처리하려 할 때",

      "사람 관리보다 결과 압박만 앞세울 때",
    ],
  };
}

function buildAvoidEnvironments(
  signals:
    CareerSignals,

  gods:
    TenGod[],
) {
  const result = [
    {
      title:
        "책임은 큰데 결정권은 없는 자리",

      reason:
        "성과를 요구받으면서도 방식과 우선순위를 스스로 정할 수 없다면 강점보다 답답함이 먼저 커질 가능성이 있습니다.",

      warningSign:
        "문제가 보여도 바꿀 권한이 없고, 결과가 나쁘면 책임만 개인에게 돌아오는 구조",
    },

    {
      title:
        "성과와 보상이 완전히 분리된 환경",

      reason:
        "열심히 해도 경력·수입·권한 중 어느 것도 쌓이지 않는다면 시간이 갈수록 동력이 떨어질 수 있습니다.",

      warningSign:
        "일은 늘어나는데 연봉·역할·실력 중 아무것도 달라지지 않는 상태",
    },

    {
      title:
        "배울 것도 바꿀 것도 없는 반복 업무",

      reason:
        `${signals.dayMaster.workStyle}이라는 기본 흐름과 충돌하기 쉽습니다.`,

      warningSign:
        "1년 뒤에도 지금과 거의 같은 일을 같은 방식으로 하고 있을 것 같은 자리",
    },
  ];

  if (
    gods.includes(
      "편재",
    ) ||
    gods.includes(
      "상관",
    )
  ) {
    result.push({
      title:
        "지나치게 보수적이고 변화가 느린 조직",

      reason:
        "시장·외부 기회·개선과 연결된 성향을 활용하기 어렵고 아이디어가 계속 막히면 소진될 수 있습니다.",

      warningSign:
        "새로운 제안이 내용보다 '원래 안 한다'는 이유로 반복해서 거절되는 환경",
    });
  }

  return result.slice(
    0,
    4,
  );
}

function buildMoneyStyle(
  signals:
    CareerSignals,

  gods:
    TenGod[],
) {
  const theme =
    elementWorkThemes[
      signals
        .dayMaster
        .element
    ];

  const hasWealth =
    gods.includes(
      "편재",
    ) ||
    gods.includes(
      "정재",
    );

  return {
    headline:
      hasWealth
        ? "돈은 기다리는 것보다 결과를 시장과 연결할 때 붙기 쉽습니다."
        : theme.moneyStyle,

    description: [
      theme.moneyStyle,

      hasWealth
        ? "월주의 재성 주제가 보이므로 업무 가치를 고객·매출·보상과 연결하는 감각을 의식적으로 키우는 것이 중요합니다."
        : "사주상의 성향만으로 높은 소득을 보장하지는 않지만, 자신의 강점이 어떤 결과를 만들고 누가 그 결과에 돈을 지불하는지 연결하면 수입 전략이 분명해집니다.",
    ],

    goodStructure: [
      "성과가 숫자·실적·고객·프로젝트로 남는 구조",

      "경험이 쌓일수록 단가나 보상 협상력이 높아지는 구조",

      "고객과 시장의 반응을 직접 확인할 수 있는 구조",
    ],

    riskyStructure: [
      "성과와 보상이 거의 연결되지 않는 구조",

      "수입을 늘리기 위해 노동시간만 계속 늘려야 하는 구조",

      "매출은 커지지만 비용과 현금흐름을 통제하지 못하는 구조",
    ],

    moneyAdvice:
      "지금부터는 '얼마나 열심히 했는가'보다 '내가 만든 어떤 결과에 누가 얼마를 지불하는가'를 기준으로 커리어를 설계해보세요.",
  };
}

export function buildWakeUpCall(
  signals:
    CareerSignals,

  gods:
    TenGod[],

  careerContext?:
    CareerContext | null,
) {
  const theme =
    elementWorkThemes[
      signals
        .dayMaster
        .element
    ];

  const hasPeer =
    gods.includes(
      "비견",
    ) ||
    gods.includes(
      "겁재",
    );

  if (
    !careerContext ||
    !careerContext.hasContext
  ) {
    return {
      headline:
        hasPeer
          ? "능력이 없어서 막히는 것보다, 내 방식에 대한 고집이 기회를 줄일 수 있습니다."
          : `가장 위험한 패턴은 ${theme.riskyPattern}입니다.`,

      message: [
        `당신이 먼저 경계해야 할 것은 ${theme.riskyPattern}입니다.`,

        hasPeer
          ? "스스로 결정하고 싶은 힘은 장점이지만, 상대가 원하는 결과보다 내가 옳다고 생각하는 방식을 앞세우면 커리어가 불필요하게 거칠어질 수 있습니다."
          : "강점은 방향이 맞을 때 무기가 되지만, 방향이 틀린 상태에서 반복하면 같은 강점이 오히려 약점이 됩니다.",

        "좋은 운을 기다리기보다 이미 시작한 것 중 하나를 끝까지 결과로 남기는 사람이 실제 기회를 잡습니다.",
      ],

      stopDoing: [
        "새로운 가능성만 계속 추가하는 것",

        "성과가 나지 않을 때 환경 탓과 자기 탓만 반복하는 것",

        "실제 시장 반응 없이 머릿속 가능성만 크게 키우는 것",
      ],

      startDoing: [
        "하나의 강점을 실제 숫자와 사례로 증명하기",

        "매달 무엇을 배우고 무엇을 벌고 무엇을 남겼는지 기록하기",

        "내 방식보다 고객·조직·시장이 원하는 결과를 먼저 확인하기",
      ],
    };
  }

  const jobName =
    careerContext.jobTitle ??
    "현재 일";

  const classification =
  classifyCareerContext(
    careerContext,
  );

const isSales =
  classification.primaryRole ===
  "sales";

  /*
   * 영업 + 수입 고민
   */
  if (
    isSales &&
    careerContext.primaryConcern ===
      "income"
  ) {
    return {
      headline:
        "지금 부족한 건 적성보다, 잘되는 영업을 반복할 수 있는 구조일 가능성이 큽니다.",

      message: [
        `${jobName}의 고객 상담·제안·계약 업무는 현재 직업운에서 강하게 읽힌 영업·사업개발형 방향과 연결됩니다. 그래서 수입이 낮다는 이유만으로 '나는 이 일이 안 맞는다'고 결론내리기에는 아직 이릅니다.`,

        "하지만 적성에 맞는다는 말이 계속 버티면 된다는 뜻도 아닙니다. 연락을 많이 하는 것과 영업 실력이 쌓이는 것은 다릅니다. 어떤 고객이 계약하는지, 어떤 질문과 제안이 먹히는지, 어느 시점의 후속 연락이 전환을 만드는지를 찾아 반복할 수 있어야 합니다.",

        "앞으로 3~6개월 동안 수입·신규 고객·상담→계약 전환율·소개 비중이 실제로 좋아지지 않는다면 노력 부족으로 몰아붙이지 마세요. 그때는 DB 품질, 조직, 상품 경쟁력, 상담 방식 중 무엇이 막고 있는지 바꿀 근거가 생긴 것입니다.",
      ],

      stopDoing: [
        "연락량만 늘리면 언젠가 수입이 오를 거라고 버티는 것",

        "계약이 안 된 이유를 전부 내 능력 부족으로 받아들이는 것",

        "잘된 상담과 실패한 상담을 기록하지 않은 채 매번 처음부터 다시 영업하는 것",
      ],

      startDoing: [
        "계약된 고객과 미계약 고객의 차이를 매주 기록하기",

        "신규 고객 수보다 상담→계약 전환율과 소개 발생률을 함께 보기",

        "내가 잘하는 고객군·질문·제안 방식을 찾아 반복 가능한 영업 루틴으로 만들기",
      ],
    };
  }

  /*
   * 이직 고민
   */
  if (
    careerContext.primaryConcern ===
    "change-job"
  ) {
    return {
      headline:
        "답답하다는 이유만으로 움직이면 다음 직장에서도 같은 문제가 반복될 수 있습니다.",

      message: [
        `${jobName}에서 힘든 이유가 직업 자체인지, 현재 조직·상사·보상·권한 때문인지 먼저 분리해야 합니다.`,

        "이직은 불편함을 피하는 선택보다 다음 환경에서 무엇을 얻을 것인지가 분명할 때 의미가 커집니다.",

        "지금 직장에서 싫은 조건과 다음 직장에서 반드시 필요한 조건을 실제 사례로 정리한 뒤 외부 시장과 비교하세요.",
      ],

      stopDoing: [
        "현재 회사가 힘들다는 이유만으로 직무 전체가 안 맞다고 결론내리기",

        "채용공고를 보지 않은 채 막연히 다른 일이 더 나을 거라고 생각하기",

        "현재 경험을 경력 자산으로 정리하지 않고 바로 이동하려 하기",
      ],

      startDoing: [
        "현재 회사 문제와 직무 자체의 문제를 분리하기",

        "관심 직무 채용공고 10개에서 공통 요구 역량 찾기",

        "현재 경험을 다음 직장에서 설명할 수 있는 성과 사례로 정리하기",
      ],
    };
  }

  /*
   * 창업 고민
   */
  if (
    careerContext.primaryConcern ===
    "business"
  ) {
    return {
      headline:
        "사업 욕구보다 먼저 확인해야 할 것은, 실제로 돈을 낼 고객이 있는가입니다.",

      message: [
        "주도권을 직접 가져가고 싶다는 성향은 사업과 연결될 수 있지만, 사업 성향과 사업 성공은 같은 말이 아닙니다.",

        "아이디어가 좋아 보이는 것보다 누가 왜 돈을 내는지 확인하는 것이 먼저입니다.",

        "작은 유료 고객과 반복 수요가 확인되기 전에는 큰 비용이나 고정비를 먼저 늘리지 않는 편이 좋습니다.",
      ],

      stopDoing: [
        "아이디어에 대한 주변의 좋은 반응을 실제 수요로 착각하기",

        "고객 검증 전에 큰 비용부터 쓰기",

        "여러 사업 아이디어를 동시에 시작하기",
      ],

      startDoing: [
        "실제로 돈을 낼 고객에게 작은 제안부터 판매하기",

        "매출과 실제 남는 현금흐름을 따로 기록하기",

        "반복 구매가 일어나는 구조를 하나씩 만들기",
      ],
    };
  }

  /*
   * 기타 현실정보가 있는 경우
   */
  return {
    headline:
      `${jobName}이 맞는지 고민하는 것보다, 지금 강점이 실제 결과로 연결되고 있는지를 먼저 보세요.`,

    message: [
      `${jobName}이라는 직업명 자체보다 실제로 맡고 있는 업무와 결과가 더 중요합니다.`,

      `현재 직업운에서는 ${theme.bestDirections.slice(0, 2).join("·")}처럼 스스로 결과를 만들 수 있는 방향을 활용할 때 강점이 살아날 가능성을 살펴볼 수 있습니다.`,

      "몇 달 동안 성과·만족도·보상 중 아무것도 좋아지지 않는다면 무작정 버티기보다 역할이나 환경을 다시 비교해야 합니다.",
    ],

    stopDoing: [
      "직업명 하나만 보고 나와 맞다·안 맞다를 결론내리는 것",

      "성과가 안 나는데 같은 방식만 반복하는 것",

      "현실 데이터를 확인하지 않고 느낌만으로 다음 선택을 결정하는 것",
    ],

    startDoing: [
      "잘한 업무와 지친 업무를 실제 사례로 구분하기",

      "내 강점이 숫자·평가·고객 반응으로 남는지 확인하기",

      "3개월 단위로 유지할 것·바꿀 것·새로 시험할 것을 하나씩 정하기",
    ],
  };
}

function buildHopePoint(
  signals:
    CareerSignals,

  gods:
    TenGod[],

  careerContext?:
    CareerContext | null,
) {
  const theme =
    elementWorkThemes[
      signals
        .dayMaster
        .element
    ];

  /*
   * 현재 직업정보가 없는 경우
   */
  if (
    !careerContext ||
    !careerContext.hasContext
  ) {
    return {
      headline:
        "지금 자리가 전부가 아닙니다. 강점을 쓰는 방식이 바뀌면 같은 사람도 전혀 다른 평가를 받을 수 있습니다.",

      message: [
        theme.opportunity,

        gods.length >
        0
          ? `${gods
              .map(
                (
                  god,
                ) =>
                  tenGodHeadline[
                    god
                  ],
              )
              .join(
                "과 ",
              )}이 현재 커리어 해석의 중요한 힌트입니다.`
          : "현재 사주 구조에서 읽히는 강점은 실제 경험을 통해 검증할수록 더 선명해집니다.",

        "지금까지의 선택이 완벽하지 않았더라도 다음 선택에서 조건 하나만 바꿔도 커리어의 체감은 크게 달라질 수 있습니다.",
      ],

      opportunityConditions: [
        "내가 직접 결과를 만들 수 있는 역할",

        "성과가 실제 경력이나 수입으로 쌓이는 구조",

        "새로운 경험이 다음 기회를 만드는 환경",
      ],
    };
  }

  const jobName =
    careerContext.jobTitle ??
    "현재 일";

  const workText =
    [
      careerContext.jobTitle,
      careerContext.mainWork,
    ]
      .filter(
        Boolean,
      )
      .join(
        " ",
      )
      .toLowerCase();

  const isSales =
    /영업|보험|상담|고객|계약|판매|세일즈|사업개발|제안|중개/.test(
      workText,
    );

  /*
   * 영업 + 수입 고민
   */
  if (
    isSales &&
    careerContext.primaryConcern ===
      "income"
  ) {
    return {
      headline:
        "지금의 낮은 수입이 앞으로의 한계라는 뜻은 아닙니다. 영업 구조가 잡히면 같은 노력의 가치가 달라질 수 있습니다.",

      message: [
        `${jobName}에서 이미 고객을 만나고 상담하고 계약까지 연결하는 경험을 쌓고 있다는 점 자체가 다음 단계의 재료가 됩니다.`,

        "초기에는 연락량이 수입을 좌우하는 것처럼 보여도 시간이 지나면서 중요한 것은 잘 맞는 고객군, 상담 전환율, 소개 고객, 기존 고객 관리처럼 반복해서 쌓이는 자산입니다.",

        "앞으로의 가능성은 '더 많이 연락하는 사람'이 되는 데 있지 않습니다. 고객을 이해하고 제안하는 방식을 개선해 같은 노력으로 더 높은 전환과 소개를 만드는 사람으로 올라가는 데 있습니다.",
      ],

      opportunityConditions: [
        "나와 잘 맞는 고객군과 상담 패턴을 찾아 반복할 것",

        "계약 건수뿐 아니라 소개·재상담 고객을 장기 자산으로 쌓을 것",

        "성과가 좋아질수록 내 보상과 권한도 커지는 환경을 선택할 것",
      ],
    };
  }

  /*
   * 이직 고민
   */
  if (
    careerContext.primaryConcern ===
    "change-job"
  ) {
    return {
      headline:
        "지금 회사가 맞지 않는 것과, 내 커리어 전체가 막힌 것은 다른 문제입니다.",

      message: [
        "현재 직장에서 얻은 경험은 다른 조직이나 인접 직무에서도 사용할 수 있는 자산이 될 수 있습니다.",

        `${theme.bestDirections
          .slice(
            0,
            3,
          )
          .join(
            "·",
          )} 방향과 연결되는 경험을 찾아 정리하면 다음 선택의 폭을 넓힐 수 있습니다.`,

        "현재 환경에서 막힌 강점이 다른 조직에서는 더 높은 평가를 받을 수도 있으므로, 이동 전 실제 시장 반응을 확인해보세요.",
      ],

      opportunityConditions: [
        "현재 경험을 다른 회사에서도 통하는 성과로 설명할 수 있을 것",

        "다음 직장에서 원하는 역할·권한·보상 조건이 분명할 것",

        "이동 전 외부 시장의 실제 반응을 확인할 것",
      ],
    };
  }

  /*
   * 창업 고민
   */
  if (
    careerContext.primaryConcern ===
    "business"
  ) {
    return {
      headline:
        "사업 가능성은 아이디어의 크기보다 작은 고객을 반복해서 만드는 능력에서 시작됩니다.",

      message: [
        `${theme.bestDirections
          .slice(
            0,
            2,
          )
          .join(
            "·",
          )} 방향의 강점을 사업 기회로 연결해볼 여지는 있습니다.`,

        "다만 사업의 가능성을 사주가 대신 증명해줄 수는 없습니다. 실제 고객과 반복 수요가 가장 중요한 검증 자료입니다.",

        "작게 팔아보고 다시 사는 고객이 생긴다면 그때부터 사업을 키울 구체적인 근거가 만들어집니다.",
      ],

      opportunityConditions: [
        "실제 돈을 내는 첫 고객을 만들 것",

        "반복 수요와 재구매가 확인될 것",

        "매출이 아니라 실제 남는 현금흐름을 관리할 것",
      ],
    };
  }

  /*
   * 기타 현재 직업정보가 있는 경우
   */
  return {
    headline:
      `${jobName} 하나가 당신의 커리어 전체를 결정하지는 않습니다. 강점이 살아나는 조건을 찾으면 같은 경험도 더 높은 가치로 바뀔 수 있습니다.`,

    message: [
      theme.opportunity,

      `현재 ${jobName}에서 얻는 경험 중 ${theme.bestDirections
        .slice(
          0,
          2,
        )
        .join(
          "·",
        )}과 연결되는 부분을 실제 성과로 남겨보세요.`,

      "현재 일이 최종 목적지가 아니더라도 실력·고객·성과·전문성을 남긴다면 다음 선택의 출발점으로 사용할 수 있습니다.",
    ],

    opportunityConditions: [
      "현재 일에서 다음 단계로 가져갈 실력을 남길 것",

      "성과가 숫자·사례·포트폴리오로 축적될 것",

      "몇 달 단위로 실제 성장 여부를 확인하고 방향을 조정할 것",
    ],
  };
}

export function buildNinetyDayPlan(
  signals:
    CareerSignals,

  careerContext?:
    CareerContext | null,
) {
  const theme =
    elementWorkThemes[
      signals
        .dayMaster
        .element
    ];

  /*
   * 현실 직업정보가 없다면
   * 기존 사주 기반 계획을 유지합니다.
   */
  if (
    !careerContext ||
    !careerContext.hasContext
  ) {
    return {
      first30Days: {
        title:
          "첫 30일 — 방향을 하나로 좁히기",

        actions: [
          `현재 하는 일에서 ${theme.bestDirections.slice(0, 2).join("·")} 방향과 가장 가까운 경험을 3개 적습니다.`,

          "최근 1년 안에 가장 좋은 평가나 돈을 받았던 일을 찾아 공통점을 정리합니다.",

          "앞으로 키울 핵심 강점을 하나만 선택합니다.",
        ],
      },

      next30Days: {
        title:
          "다음 30일 — 시장에서 직접 검증하기",

        actions: [
          "선택한 강점을 실제 업무·고객·프로젝트에 최소 3번 적용합니다.",

          "좋았다는 느낌보다 매출·시간 절감·고객 반응·성과 같은 증거를 기록합니다.",

          "외부 시장의 채용공고나 실제 고객 수요와 비교합니다.",
        ],
      },

      final30Days: {
        title:
          "마지막 30일 — 남을지 움직일지 결정하기",

        actions: [
          "현재 조직에서 강점을 더 크게 쓸 수 있다면 역할과 보상을 협상합니다.",

          "환경 자체가 강점을 막고 있다면 이직·부업·프로젝트 중 가장 작은 이동부터 시작합니다.",

          "90일 동안 확보한 결과를 이력서·포트폴리오·영업 자료로 남깁니다.",
        ],
      },
    };
  }

  const jobName =
    careerContext.jobTitle ??
    "현재 일";

  const classification =
  classifyCareerContext(
    careerContext,
  );

const isSales =
  classification.primaryRole ===
  "sales";

const isBusiness =
  classification.primaryRole ===
  "business";

const isSpecialist =
  classification.primaryRole ===
  "specialist";

  const isLeadership =
  classification.primaryRole ===
  "leadership";

const isEmployee =
  classification.primaryRole ===
  "employee";

  /*
   * 수입이 가장 큰 고민
   */
  if (
    careerContext.primaryConcern ===
    "income"
  ) {
    if (isSales) {
      return {
        first30Days: {
          title:
            "첫 30일 — 수입이 막히는 지점을 숫자로 찾기",

          actions: [
            `${jobName} 업무에서 매일 신규 고객 수·상담 수·계약 수·실제 수입을 기록합니다.`,

            "상담→계약 전환율을 계산하고, 계약이 된 고객과 안 된 고객의 차이를 최소 10건 비교합니다.",

            "소개·재상담으로 들어온 고객과 신규 DB 고객의 계약률 차이를 따로 기록합니다.",
          ],
        },

        next30Days: {
          title:
            "다음 30일 — 가장 잘 되는 영업 방식을 반복하기",

          actions: [
            "첫 30일 동안 계약률이 가장 높았던 고객군과 상담 방식을 하나씩 골라 집중합니다.",

            "상담 초반 질문·제안 방식·후속 연락 시점을 하나씩 바꿔 전환율 변화를 비교합니다.",

            "단순 연락량보다 계약률과 소개 발생률이 높은 행동에 시간을 더 배분합니다.",
          ],
        },

        final30Days: {
          title:
            "마지막 30일 — 계속할 근거를 숫자로 결정하기",

          actions: [
            "첫 달과 비교해 월 실제 수입·신규 고객 수·상담→계약 전환율이 좋아졌는지 확인합니다.",

            "소개·재상담 고객 비중이 늘었다면 단기 영업이 아니라 고객 자산이 쌓이고 있는지 확인합니다.",

            "수입과 전환율이 개선됐다면 현재 방향을 유지하고, 거의 변하지 않았다면 조직·DB 품질·영업 방식 중 무엇을 바꿀지 결정합니다.",
          ],
        },
      };
    }

    if (isBusiness) {
      return {
        first30Days: {
          title:
            "첫 30일 — 어디서 돈이 남는지 확인하기",

          actions: [
            `${jobName}에서 매출·비용·실제 남는 금액을 분리해서 기록합니다.`,

            "가장 수익성이 높은 고객·상품·서비스와 가장 낮은 항목을 각각 찾습니다.",

            "시간은 많이 들지만 실제 이익이 거의 남지 않는 업무를 하나 골라냅니다.",
          ],
        },

        next30Days: {
          title:
            "다음 30일 — 잘 팔리는 구조에 집중하기",

          actions: [
            "수익성이 높은 고객군이나 상품에 영업과 운영 시간을 집중합니다.",

            "반복 구매나 재계약이 발생하도록 후속 연락·고객 관리 과정을 정리합니다.",

            "신규 매출보다 기존 고객에서 반복되는 매출 비중이 늘어나는지 확인합니다.",
          ],
        },

        final30Days: {
          title:
            "마지막 30일 — 매출보다 현금흐름으로 판단하기",

          actions: [
            "첫 달과 비교해 실제 남는 현금과 반복 매출 비중이 증가했는지 확인합니다.",

            "수익성이 낮은 상품이나 업무를 줄였을 때 전체 수익성이 좋아졌는지 비교합니다.",

            "숫자가 개선됐다면 확장을 검토하고, 개선되지 않았다면 비용·상품·고객군 중 하나를 다시 설계합니다.",
          ],
        },
      };
    }

    return {
      first30Days: {
        title:
          "첫 30일 — 현재 수입 구조를 분해하기",

        actions: [
          `${jobName}에서 월 수입이 어떤 업무와 성과에서 발생하는지 항목별로 적습니다.`,

          "시간을 가장 많이 쓰는 업무와 실제 보상으로 연결되는 업무를 비교합니다.",

          "수입을 늘리려면 시간·단가·성과량 중 무엇이 바뀌어야 하는지 하나를 정합니다.",
        ],
      },

      next30Days: {
        title:
          "다음 30일 — 보상으로 연결되는 업무 늘리기",

        actions: [
          "보상과 직접 연결되는 업무 비중을 의식적으로 늘립니다.",

          "잘한 결과를 숫자·사례·평가로 남겨 협상 가능한 자료를 만듭니다.",

          "같은 일을 하는 외부 채용시장이나 고객 시장의 보상 수준과 비교합니다.",
        ],
      },

      final30Days: {
        title:
          "마지막 30일 — 현재 일이 수입을 키울 수 있는지 판단하기",

        actions: [
          "첫 달과 비교해 실제 수입과 성과가 개선됐는지 확인합니다.",

          "성과가 좋아져도 보상이 변하지 않는다면 역할이나 보상 구조를 협상합니다.",

          "현재 구조에서 수입을 늘릴 방법이 없다면 같은 강점을 더 잘 보상하는 환경을 탐색합니다.",
        ],
      },
    };
  }

  /*
   * 이직 고민
   */
  if (
    careerContext.primaryConcern ===
    "change-job"
  ) {
    return {
      first30Days: {
        title:
          "첫 30일 — 지금 일이 싫은 이유를 정확히 분리하기",

        actions: [
          `${jobName}에서 힘든 요소를 업무·사람·권한·보상·성장성으로 나눠 적습니다.`,

          "현재 직업 자체가 싫은 것과 현재 회사의 조건이 싫은 것을 구분합니다.",

          "다음 직장에서 반드시 필요한 조건 3개와 절대 피할 조건 3개를 정합니다.",
        ],
      },

      next30Days: {
        title:
          "다음 30일 — 퇴사보다 먼저 시장을 확인하기",

        actions: [
          "관심 있는 직무의 채용공고를 최소 10개 확인해 실제 요구 기술을 정리합니다.",

          "현재 경험 중 다음 직무에서도 사용할 수 있는 성과 사례를 3개 만듭니다.",

          "지원 또는 네트워킹을 통해 외부 시장의 실제 반응을 확인합니다.",
        ],
      },

      final30Days: {
        title:
          "마지막 30일 — 남을지 옮길지 근거로 결정하기",

        actions: [
          "현재 회사에서 바꿀 수 있는 조건과 바꿀 수 없는 조건을 구분합니다.",

          "외부 기회가 현재보다 역할·보상·성장 중 최소 두 가지에서 나은지 비교합니다.",

          "단순한 답답함 때문이 아니라 실제 비교 근거가 생겼을 때 이동 여부를 결정합니다.",
        ],
      },
    };
  }

  /*
   * 창업·독립 고민
   */
  if (
    careerContext.primaryConcern ===
    "business"
  ) {
    return {
      first30Days: {
        title:
          "첫 30일 — 아이디어보다 고객부터 확인하기",

        actions: [
          "내가 해결하려는 문제에 실제 돈을 낼 가능성이 있는 사람을 최소 10명 만납니다.",

          "설명만 하지 말고 작은 상품·서비스를 실제 가격과 함께 제안합니다.",

          "관심 있다고 말한 사람과 실제로 결제한 사람을 분리해서 기록합니다.",
        ],
      },

      next30Days: {
        title:
          "다음 30일 — 작은 매출을 반복해보기",

        actions: [
          "첫 고객이 나온 방식으로 같은 제안을 다시 반복해봅니다.",

          "고객 획득 비용·판매가격·실제 남는 금액을 함께 계산합니다.",

          "내가 직접 모든 일을 하지 않아도 반복할 수 있는 과정을 하나씩 정리합니다.",
        ],
      },

      final30Days: {
        title:
          "마지막 30일 — 사업으로 키울지 판단하기",

        actions: [
          "반복해서 돈을 내는 고객이 생겼는지 확인합니다.",

          "매출보다 실제로 남는 현금흐름과 재구매 가능성을 확인합니다.",

          "검증이 됐다면 단계적으로 확장하고, 아니라면 큰 비용을 쓰기 전에 상품이나 고객군을 다시 바꿉니다.",
        ],
      },
    };
  }

  /*
   * 전문직·전문가 성격이 강한 업무
   */
  if (isSpecialist) {
    return {
      first30Days: {
        title:
          "첫 30일 — 돈이 되는 전문성 하나를 고르기",

        actions: [
          `${jobName}에서 내가 남보다 더 잘 해결할 수 있는 문제를 하나 고릅니다.`,

          "최근 경험 중 그 능력을 증명하는 사례를 3개 정리합니다.",

          "앞으로 90일 동안 깊게 만들 핵심 기술이나 전문 영역을 하나만 선택합니다.",
        ],
      },

      next30Days: {
        title:
          "다음 30일 — 전문성을 결과물로 증명하기",

        actions: [
          "선택한 전문성을 실제 업무나 프로젝트에 최소 3번 적용합니다.",

          "결과를 포트폴리오·문서·사례·수치 중 하나로 남깁니다.",

          "동료·고객·시장으로부터 피드백을 받아 부족한 부분을 수정합니다.",
        ],
      },

      final30Days: {
        title:
          "마지막 30일 — 전문성이 시장가치를 높였는지 확인하기",

        actions: [
          "90일 전보다 더 어려운 문제를 해결할 수 있게 됐는지 확인합니다.",

          "전문성이 더 높은 역할·단가·연봉으로 연결될 가능성이 생겼는지 확인합니다.",

          "시장 반응이 있다면 더 깊게 가져가고, 없다면 전문성의 방향이나 적용 시장을 조정합니다.",
        ],
      },
    };
  }

  /*
   * 기타 고민은
   * 현재 직업정보를 반영한 범용 계획
   */

  /*
 * 리더·관리형
 */
if (isLeadership) {
  return {
    first30Days: {
      title:
        "첫 30일 — 내가 직접 하는 일과 맡겨야 할 일을 구분하기",

      actions: [
        `${jobName}에서 내가 직접 처리하고 있는 업무와 팀이 맡아도 되는 업무를 나눠 적습니다.`,

        "내가 없어도 반복할 수 있는 업무 하나를 골라 기준·순서·완료 조건을 문서로 정리합니다.",

        careerContext.primaryConcern ===
        "promotion"
          ? "현재 책임에 비해 실제 의사결정 권한이 어디까지 있는지 확인합니다."
          : "내 성과와 팀의 성과를 구분해서 기록할 기준을 하나 정합니다.",
      ],
    },

    next30Days: {
      title:
        "다음 30일 — 사람을 관리하기보다 성과 구조 만들기",

      actions: [
        "팀원이 스스로 판단할 수 있도록 목표·권한·완료 기준을 더 명확하게 전달합니다.",

        "반복해서 문제가 생기는 업무 하나를 골라 개인의 능력 문제가 아니라 프로세스 문제인지 확인합니다.",

        "내가 직접 해결한 일보다 팀 전체의 속도·품질·성과가 좋아진 사례를 기록합니다.",
      ],
    },

    final30Days: {
      title:
        "마지막 30일 — 더 큰 책임을 맡을 준비가 됐는지 확인하기",

      actions: [
        "90일 전과 비교해 내가 직접 처리해야 하는 일이 줄고 팀이 스스로 해결하는 일이 늘었는지 확인합니다.",

        "성과가 좋아졌다면 더 큰 권한·직책·보상과 연결할 근거를 정리합니다.",

        "책임만 늘고 권한이나 지원은 그대로라면 현재 조직에서 해결할 문제인지 다른 환경을 탐색할 문제인지 구분합니다.",
      ],
    },
  };
}

/*
 * 조직·운영형
 */
if (isEmployee) {
  return {
    first30Days: {
      title:
        "첫 30일 — 반복 업무 속에서 내 경력 자산 찾기",

      actions: [
        `${jobName}에서 반복적으로 맡는 업무 중 다른 사람보다 안정적으로 처리하는 일을 3개 적습니다.`,

        "단순히 오래 한 일이 아니라 시간 절감·오류 감소·고객 만족·업무 개선처럼 결과가 남은 사례를 찾습니다.",

        careerContext.primaryConcern ===
        "promotion"
          ? "현재 조직에서 다음 직급이나 역할로 올라가기 위해 실제로 요구하는 경험을 확인합니다."
          : "앞으로 90일 동안 경력으로 남길 업무 하나를 선택합니다.",
      ],
    },

    next30Days: {
      title:
        "다음 30일 — 맡은 일을 개선한 증거 만들기",

      actions: [
        "선택한 업무에서 시간·오류·처리량·만족도 중 하나의 지표를 정합니다.",

        "기존 방식에서 개선할 수 있는 부분을 하나 바꾸고 전후 결과를 비교합니다.",

        "혼자만 알고 있던 업무 노하우가 있다면 체크리스트·매뉴얼·문서 중 하나로 남깁니다.",
      ],
    },

    final30Days: {
      title:
        "마지막 30일 — 현재 조직에서 다음 단계가 있는지 판단하기",

      actions: [
        "90일 전보다 업무 범위·전문성·성과 중 실제로 커진 것이 있는지 확인합니다.",

        "결과가 생겼다면 더 큰 업무·권한·보상으로 연결할 수 있는지 상사나 조직의 기준과 비교합니다.",

        "성과를 만들어도 역할과 보상이 계속 그대로라면 같은 경험을 더 높게 평가하는 내부 이동이나 외부 기회를 비교합니다.",
      ],
    },
  };
}
  return {
    first30Days: {
      title:
        "첫 30일 — 지금 일에서 남는 것을 확인하기",

      actions: [
        `${jobName}에서 가장 잘했던 업무 3개와 가장 지쳤던 업무 3개를 적습니다.`,

        `그중 ${theme.bestDirections.slice(0, 2).join("·")} 방향과 연결되는 경험이 무엇인지 찾습니다.`,

        "앞으로 더 키울 업무 하나와 줄일 업무 하나를 정합니다.",
      ],
    },

    next30Days: {
      title:
        "다음 30일 — 강점을 실제 결과로 만들기",

      actions: [
        "선택한 강점을 실제 업무에서 반복적으로 사용합니다.",

        "성과를 느낌이 아니라 숫자·평가·고객 반응·결과물로 기록합니다.",

        "현재 조직에서 그 강점을 더 크게 쓸 수 있는 역할이나 프로젝트를 찾아봅니다.",
      ],
    },

    final30Days: {
      title:
        "마지막 30일 — 다음 선택을 결정하기",

      actions: [
        "90일 동안 실제 성과와 만족도가 함께 좋아졌는지 확인합니다.",

        "강점을 더 쓸 수 있다면 현재 역할을 유지하거나 확장합니다.",

        "환경이 계속 강점을 막는다면 이직·부업·다른 역할 중 가장 작은 이동부터 시작합니다.",
      ],
    },
  };
}

function buildLuckPeriods(
  signals:
    CareerSignals,
): CareerLuckPeriod[] {
  if (
    !signals
      .majorLuck
      .available
  ) {
    return [];
  }

  return signals
    .majorLuck
    .preview
    .map(
      (
        value,
        index,
      ) =>
        buildLuckPeriod(
          value,
          index,
          signals,
        ),
    )
    .filter(
      (
        value,
      ): value is CareerLuckPeriod =>
        value !==
        null,
    );
}

function buildLuckPeriod(
  value:
    string,

  index:
    number,

  signals:
    CareerSignals,
): CareerLuckPeriod | null {
  const match =
    value.match(
      /(\d+)세\s+([갑을병정무기경신임계])([자축인묘진사오미신유술해])\(([甲乙丙丁戊己庚辛壬癸][子丑寅卯辰巳午未申酉戌亥])\)/,
    );

  if (!match) {
    return null;
  }

  const startAge =
    Number(
      match[1],
    );

  const stem =
    match[2];

  const branch =
    match[3];

  const hanja =
    match[4];

  const stemData =
    stemInfo[
      stem
    ];

  if (!stemData) {
    return null;
  }

  const tenGod =
    getTenGod(
      {
        element:
          signals
            .dayMaster
            .element,

        yinYang:
          signals
            .dayMaster
            .yinYang,
      },
      stemData,
    );

  const branchEl =
    branchElement[
      branch
    ];

  const periodTheme =
    getLuckTheme(
      tenGod,
      branchEl,
    );

  const ageRange =
    `${startAge}~${startAge + 9}세`;

  return {
    id:
      `luck-${index + 1}`,

    ageRange,

    pillar:
      `${stem}${branch}(${hanja})`,

    headline:
      periodTheme.headline,

    overall:
      periodTheme.overall,

    opportunities:
      periodTheme.opportunities,

    money:
      periodTheme.money,

    career:
      periodTheme.career,

    caution:
      periodTheme.caution,

    winningMove:
      periodTheme.winningMove,

    prepareNext:
      periodTheme.prepareNext,

    intensity:
      periodTheme.intensity,
  };
}

function getLuckTheme(
  tenGod:
    TenGod,

  branchEl:
    Element,
) {
  const branchHint =
    elementWorkThemes[
      branchEl
    ];

  const base:
    Record<
      TenGod,
      {
        headline: string;

        overall: string;

        opportunities:
          string[];

        money:
          string[];

        career:
          string[];

        caution:
          string[];

        winningMove:
          string;

        prepareNext:
          string;

        intensity:
          "low"
          | "medium"
          | "high";
      }
    > = {
    비견: {
      headline:
        "내 이름으로 성과를 증명해야 하는 시기",

      overall:
        "남의 기준보다 자신의 선택과 실력이 중요해지는 흐름입니다. 경쟁도 늘 수 있지만, 그만큼 스스로 만든 결과가 커리어 자산으로 남기 좋은 시기입니다.",

      opportunities: [
        "독립 프로젝트",
        "개인 실적",
        "리더 역할",
        "새로운 도전",
      ],

      money: [
        "자신의 성과가 보상과 직접 연결되는 구조가 유리합니다.",

        "동료·파트너와 돈이나 역할을 섞을 때 기준을 명확히 하는 편이 좋습니다.",
      ],

      career: [
        "내 이름으로 남는 프로젝트와 실적을 만드는 데 집중하세요.",

        "조직 안에서도 독립적으로 책임질 수 있는 영역을 확보할수록 좋습니다.",
      ],

      caution: [
        "쓸데없는 경쟁심",

        "동료와 주도권 충돌",

        "혼자 다 하려는 태도",
      ],

      winningMove:
        "하나의 분야에서 '이 일은 내가 가장 잘한다'고 말할 수 있는 실적을 남기는 것",

      prepareNext:
        `다음 기회를 위해 ${branchHint.bestDirections[0]} 경험을 자산으로 정리하세요.`,

      intensity:
        "high",
    },

    겁재: {
      headline:
        "경쟁 속에서 판을 가져와야 하는 시기",

      overall:
        "사람과 기회가 빠르게 움직이고 경쟁이 강해질 수 있습니다. 주도권을 잡으면 성장 폭이 커지지만 무리한 승부는 손실도 키울 수 있습니다.",

      opportunities: [
        "영업 경쟁",
        "팀 리딩",
        "사업 확장",
        "협상",
      ],

      money: [
        "큰 기회가 보여도 수익 배분과 비용 구조를 먼저 확인하세요.",

        "사람을 통한 기회가 많아질수록 돈 관계는 더 명확하게 해야 합니다.",
      ],

      career: [
        "경쟁을 피하기보다 비교 우위를 만드는 데 집중하세요.",

        "협상력과 사람을 움직이는 능력이 중요해집니다.",
      ],

      caution: [
        "과도한 경쟁",

        "충동적 투자",

        "친분만 믿은 동업",
      ],

      winningMove:
        "싸움을 많이 하는 것이 아니라 내가 이길 수 있는 시장을 골라 집중하는 것",

      prepareNext:
        "성과뿐 아니라 계약·고객·현금흐름을 함께 관리하는 습관을 만드세요.",

      intensity:
        "high",
    },

    식신: {
      headline:
        "실력을 결과물로 바꿀수록 기회가 커지는 시기",

      overall:
        "꾸준히 만든 결과가 평가받기 쉬운 흐름입니다. 크게 한 번 터뜨리는 것보다 반복 가능한 실력과 결과물을 쌓는 전략이 잘 맞습니다.",

      opportunities: [
        "전문성 강화",
        "콘텐츠",
        "기술 축적",
        "서비스 개선",
      ],

      money: [
        "잘하는 일을 상품·서비스·성과로 바꾸면 수익 구조를 만들기 좋습니다.",

        "반복 가능한 결과물을 만들수록 소득 안정성이 높아질 수 있습니다.",
      ],

      career: [
        "포트폴리오와 실제 사례를 꾸준히 쌓으세요.",

        "실력이 보이는 분야에서는 시간이 갈수록 평가가 좋아질 수 있습니다.",
      ],

      caution: [
        "편안함에 머무르는 것",

        "결과물을 공개하지 않는 것",

        "실력은 있지만 판매하지 못하는 것",
      ],

      winningMove:
        "한 가지 실력을 반복 가능한 상품이나 성과로 만드는 것",

      prepareNext:
        `쌓인 실력을 ${branchHint.bestDirections[0]} 영역과 연결해 확장하세요.`,

      intensity:
        "medium",
    },

    상관: {
      headline:
        "기존 방식을 깨고 내 방식을 보여줘야 하는 시기",

      overall:
        "표현력과 개선 욕구가 강해질 수 있는 흐름입니다. 낡은 방식에서 벗어나 새로운 방법을 만들면 기회가 커지지만 조직과의 마찰도 함께 관리해야 합니다.",

      opportunities: [
        "기획",
        "브랜딩",
        "콘텐츠",
        "혁신 프로젝트",
      ],

      money: [
        "차별화된 방식이 시장에서 인정받으면 수입 기회가 커질 수 있습니다.",

        "아이디어 자체보다 고객이 돈을 내는 결과인지 확인해야 합니다.",
      ],

      career: [
        "불만을 말하는 데서 끝내지 말고 개선안을 실제 결과로 증명하세요.",

        "자율성이 높은 환경에서 강점이 살아나기 쉽습니다.",
      ],

      caution: [
        "상사와 정면충돌",

        "말이 행동보다 앞서는 것",

        "규칙을 무시하는 태도",
      ],

      winningMove:
        "남들과 다른 관점을 실제 성과로 증명하는 것",

      prepareNext:
        "표현력에 전문성과 실적을 더해 신뢰를 확보하세요.",

      intensity:
        "high",
    },

    편재: {
      headline:
        "시장과 고객이 움직이는 곳에서 돈과 기회가 커지는 시기",

      overall:
        "외부 활동과 거래, 고객, 시장 기회가 중요해지는 흐름입니다. 사람을 많이 만나는 것보다 실제 거래와 수익으로 연결하는 능력이 핵심입니다.",

      opportunities: [
        "영업",
        "사업개발",
        "고객 확장",
        "유통",
        "신사업",
      ],

      money: [
        "성과형 보상이나 사업 수익처럼 결과와 돈이 연결되는 구조가 유리할 수 있습니다.",

        "매출 확대와 함께 비용·현금흐름을 반드시 관리하세요.",
      ],

      career: [
        "회사 안에만 머무르기보다 시장과 고객을 직접 만나는 경험을 늘리세요.",

        "고객 기반과 네트워크가 중요한 자산이 됩니다.",
      ],

      caution: [
        "무리한 확장",

        "큰 매출만 보고 비용을 놓치는 것",

        "사람을 너무 쉽게 믿는 것",
      ],

      winningMove:
        "고객이 실제로 돈을 내는 문제를 찾아 반복 매출 구조로 만드는 것",

      prepareNext:
        "고객·매출·계약 경험을 시스템과 브랜드로 남기세요.",

      intensity:
        "high",
    },

    정재: {
      headline:
        "안정적인 수익 기반을 만들기 좋은 시기",

      overall:
        "현실적인 성과와 안정적인 현금흐름이 중요해지는 흐름입니다. 큰 한 방보다 꾸준히 쌓이는 수입 구조를 만드는 전략이 잘 맞습니다.",

      opportunities: [
        "안정적 직장",
        "관리",
        "재무",
        "반복 매출",
      ],

      money: [
        "저축·현금흐름·고정 수입 관리가 중요합니다.",

        "무리한 확장보다 수익성을 확인한 뒤 단계적으로 늘리는 편이 좋습니다.",
      ],

      career: [
        "성과를 안정적으로 반복할 수 있는 시스템을 만드세요.",

        "경력의 질과 소득의 안정성을 함께 높이는 것이 중요합니다.",
      ],

      caution: [
        "안정에만 머무르는 것",

        "기회를 지나치게 보수적으로 보는 것",

        "작은 손실을 두려워해 성장을 멈추는 것",
      ],

      winningMove:
        "잘되는 일을 반복 가능한 구조로 만들어 수입의 바닥을 높이는 것",

      prepareNext:
        "안정적인 기반 위에 새로운 성장 기회를 추가하세요.",

      intensity:
        "medium",
    },

    편관: {
      headline:
        "압박이 커질수록 실력과 책임감이 시험받는 시기",

      overall:
        "경쟁과 책임이 강해질 수 있습니다. 부담도 커질 수 있지만 이 시기에 실력을 증명하면 직위와 영향력이 함께 올라갈 가능성을 만들 수 있습니다.",

      opportunities: [
        "승진",
        "리더 역할",
        "고난도 프로젝트",
        "성과 경쟁",
      ],

      money: [
        "책임 증가가 실제 보상으로 연결되는지 반드시 확인하세요.",

        "성과 압박 때문에 무리한 재정 결정을 하지 않는 것이 중요합니다.",
      ],

      career: [
        "어려운 일을 피하기보다 내 경력으로 남길 수 있는 과제를 선택하세요.",

        "책임만 늘어나는 자리는 경계해야 합니다.",
      ],

      caution: [
        "번아웃",

        "과도한 압박",

        "권위와의 충돌",
      ],

      winningMove:
        "어려운 문제를 해결한 경험을 직위와 보상으로 연결하는 것",

      prepareNext:
        "내가 없어도 돌아가는 시스템과 후임 구조를 만들어두세요.",

      intensity:
        "high",
    },

    정관: {
      headline:
        "신뢰와 책임이 커리어를 끌어올리는 시기",

      overall:
        "조직에서 역할과 책임이 분명해지기 쉬운 흐름입니다. 성실함만으로 버티기보다 신뢰를 직위와 권한으로 연결하는 전략이 중요합니다.",

      opportunities: [
        "승진",
        "공식 직책",
        "조직 내 영향력",
        "자격",
      ],

      money: [
        "직위와 전문성이 올라가면서 안정적인 보상을 만들기 좋습니다.",

        "단기 수익보다 장기적인 경력 가치가 중요해집니다.",
      ],

      career: [
        "공식적으로 인정받을 수 있는 직책과 책임을 목표로 하세요.",

        "신뢰를 쌓되 책임만 떠안지 않도록 권한도 함께 요구하세요.",
      ],

      caution: [
        "조직 눈치만 보는 것",

        "책임 과다",

        "안정 때문에 기회를 포기하는 것",
      ],

      winningMove:
        "신뢰를 쌓은 뒤 그것을 직위·권한·보상으로 명확히 바꾸는 것",

      prepareNext:
        "조직 밖에서도 통하는 전문성과 네트워크를 함께 준비하세요.",

      intensity:
        "medium",
    },

    편인: {
      headline:
        "남들이 모르는 전문성을 파고들수록 가치가 커지는 시기",

      overall:
        "분석과 학습, 독특한 관점이 중요해질 수 있습니다. 평범한 경쟁보다 희소한 전문성을 만드는 전략이 잘 맞습니다.",

      opportunities: [
        "전문 연구",
        "신기술",
        "분석",
        "컨설팅",
      ],

      money: [
        "희소한 전문성을 실제 서비스나 고단가 업무로 연결해야 돈이 됩니다.",

        "배움 자체에만 머물지 말고 시장에 판매할 형태로 만들어야 합니다.",
      ],

      career: [
        "남들이 쉽게 대체할 수 없는 영역을 선택하세요.",

        "깊이 있는 전문성을 결과와 사례로 증명하세요.",
      ],

      caution: [
        "고립",

        "과도한 고민",

        "실행 없는 공부",
      ],

      winningMove:
        "깊이 파고든 전문성을 고객이 이해할 수 있는 결과로 번역하는 것",

      prepareNext:
        "전문 지식을 브랜드·콘텐츠·서비스로 확장할 준비를 하세요.",

      intensity:
        "medium",
    },

    정인: {
      headline:
        "배운 것을 경력과 권위로 바꾸기 좋은 시기",

      overall:
        "학습과 자격, 전문성 축적이 커리어 기반을 강화할 수 있는 흐름입니다. 준비 기간을 낭비로 보지 말고 다음 단계의 진입 장벽을 만드는 시간으로 활용하세요.",

      opportunities: [
        "자격 취득",
        "교육",
        "전문직",
        "문서·지식 기반 업무",
      ],

      money: [
        "당장 큰 수입보다 미래 단가를 높이는 공부가 의미를 가질 수 있습니다.",

        "교육비와 시간을 투자할 때 실제 시장 가치와 연결되는지 확인하세요.",
      ],

      career: [
        "배운 것을 증명할 자격·프로젝트·성과를 함께 만드세요.",

        "전문성이 쌓일수록 더 안정적인 역할로 이동하기 좋습니다.",
      ],

      caution: [
        "준비만 계속하는 것",

        "자격증 수집",

        "실전 경험 부족",
      ],

      winningMove:
        "공부를 끝낸 뒤 반드시 실제 프로젝트와 수익으로 연결하는 것",

      prepareNext:
        "전문성을 활용할 시장과 고객을 미리 만들어두세요.",

      intensity:
        "medium",
    },
  };

  const theme =
    base[
      tenGod
    ];

  return {
  ...theme,

  overall:
    `${theme.overall} 지지의 ${branchEl} 기운은 '${branchHint.headline}' 쪽의 보조 테마를 함께 더합니다.`,
};
}

function getTenGod(
  day:
    {
      element:
        Element;

      yinYang:
        YinYang;
    },

  target:
    {
      element:
        Element;

      yinYang:
        YinYang;
    },
): TenGod {
  const samePolarity =
    day.yinYang ===
    target.yinYang;

  if (
    day.element ===
    target.element
  ) {
    return samePolarity
      ? "비견"
      : "겁재";
  }

  if (
    elementProduces[
      day.element
    ] ===
    target.element
  ) {
    return samePolarity
      ? "식신"
      : "상관";
  }

  if (
    elementControls[
      day.element
    ] ===
    target.element
  ) {
    return samePolarity
      ? "편재"
      : "정재";
  }

  if (
    elementControls[
      target.element
    ] ===
    day.element
  ) {
    return samePolarity
      ? "편관"
      : "정관";
  }

  return samePolarity
    ? "편인"
    : "정인";
}

function buildStrengthStatement(
  signals:
    CareerSignals,

  gods:
    TenGod[],
) {
  if (
    gods.length >
    0
  ) {
    return `${gods.map((god) => tenGodHeadline[god]).join("과 ")}을 실제 성과로 연결하는 것이 가장 큰 강점 후보입니다.`;
  }

  return signals
    .dayMaster
    .workStyle;
}

function buildBiggestWarning(
  signals:
    CareerSignals,

  gods:
    TenGod[],
) {
  if (
    gods.includes(
      "편재",
    )
  ) {
    return "기회가 많이 보인다고 전부 잡으려 하지 마세요. 매출보다 남는 돈과 반복 가능한 고객을 먼저 봐야 합니다.";
  }

  if (
    gods.includes(
      "비견",
    ) ||
    gods.includes(
      "겁재",
    )
  ) {
    return "내가 맞다는 것을 증명하는 데 에너지를 쓰기보다 결과로 증명해야 합니다. 고집은 강점과 약점의 경계가 가장 얇은 부분입니다.";
  }

  if (
    gods.includes(
      "상관",
    )
  ) {
    return "답답하다고 바로 판을 깨기보다 내가 더 나은 결과를 만들 수 있다는 증거부터 확보하세요.";
  }

  if (
    gods.includes(
      "정관",
    )
  ) {
    return "안정적인 자리에 오래 있는 것이 성공과 같은 뜻은 아닙니다. 책임이 늘 때 권한과 보상도 함께 늘고 있는지 보세요.";
  }

  return `가장 큰 위험은 ${elementWorkThemes[signals.dayMaster.element].riskyPattern}입니다.`;
}

function scoreToFit(
  score:
    number,
): CareerFitLevel {
  if (
    score >=
    6
  ) {
    return "very-good";
  }

  if (
    score >=
    4
  ) {
    return "good";
  }

  if (
    score >=
    2
  ) {
    return "mixed";
  }

  return "caution";
}

function isTenGod(
  value:
    string | null,
): value is TenGod {
  return (
    value ===
      "비견" ||
    value ===
      "겁재" ||
    value ===
      "식신" ||
    value ===
      "상관" ||
    value ===
      "편재" ||
    value ===
      "정재" ||
    value ===
      "편관" ||
    value ===
      "정관" ||
    value ===
      "편인" ||
    value ===
      "정인"
  );
}