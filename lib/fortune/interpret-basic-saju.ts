import type {
  BasicSajuInterpretation,
} from "@/types/fortune";

import type {
  FiveElement,
  SajuCalculationResult,
} from "@/types/saju";

type ElementProfile = {
  keywords: string[];

  summary: string;

  personality: string;

  wealth: string;

  love: string;

  career: string;
};

const elementProfiles:
  Record<
    FiveElement,
    ElementProfile
  > = {
  목: {
    keywords: [
      "성장",
      "추진",
      "확장",
      "시작",
    ],

    summary:
      "새로운 가능성을 찾고 앞으로 나아가려는 흐름이 비교적 두드러지는 편입니다.",

    personality:
      "전통 명리 해석에서 목의 기운은 성장, 시작, 확장과 연결해서 봅니다. 현재 상태에 머무르기보다 더 나은 방향을 찾으려는 성향으로 표현될 수 있습니다.",

    wealth:
      "재물 역시 한 번에 지키는 방식보다 새로운 기회와 가능성을 만들어가는 과정에서 관심이 커질 수 있습니다.",

    love:
      "관계에서는 서로 함께 성장하고 앞으로 나아갈 수 있다는 느낌을 중요하게 여기는 흐름으로 볼 수 있습니다.",

    career:
      "새로운 일을 시작하거나 발전 가능성이 보이는 환경에서 동력이 생기는 편으로 해석할 수 있습니다.",
  },

  화: {
    keywords: [
      "표현력",
      "속도",
      "열정",
      "직관",
    ],

    summary:
      "생각과 감정을 비교적 빠르게 밖으로 표현하고 움직임을 만들어내는 흐름이 있습니다.",

    personality:
      "전통 명리 해석에서 화의 기운은 표현, 확산, 열정과 연결합니다. 분위기를 빠르게 파악하고 자신의 에너지를 바깥으로 드러내는 모습으로 나타날 수 있습니다.",

    wealth:
      "재물에서는 기회가 보였을 때 빠르게 움직이는 힘이 있지만, 속도가 지나치게 빨라지지 않도록 기준을 세우는 것이 중요하다고 해석합니다.",

    love:
      "관계에서는 감정을 표현하고 상대와 온도를 맞추는 과정을 중요하게 여길 수 있습니다.",

    career:
      "사람들과 소통하거나 자신의 생각을 드러내는 환경에서 강점이 나타나는 흐름으로 볼 수 있습니다.",
  },

  토: {
    keywords: [
      "안정",
      "현실감",
      "지속력",
      "균형",
    ],

    summary:
      "빠르게 변화하기보다 현실적인 기준을 세우고 안정적으로 유지하려는 힘이 나타납니다.",

    personality:
      "전통 명리 해석에서 토의 기운은 중심, 안정, 현실성과 관련해서 봅니다. 급격한 변화보다 상황을 정리하고 지속 가능한 방향을 만드는 성향으로 나타날 수 있습니다.",

    wealth:
      "재물에서는 큰 변동보다 관리와 축적을 중요하게 생각하는 흐름으로 해석할 수 있습니다.",

    love:
      "관계에서는 신뢰와 안정감이 쌓이는 과정을 중요하게 생각하는 경향으로 볼 수 있습니다.",

    career:
      "역할과 기준이 명확하고 꾸준히 성과를 축적할 수 있는 환경에서 안정적으로 힘을 발휘할 수 있습니다.",
  },

  금: {
    keywords: [
      "판단력",
      "기준",
      "결단",
      "정리",
    ],

    summary:
      "상황을 분명하게 구분하고 자신만의 기준에 따라 판단하려는 흐름이 나타납니다.",

    personality:
      "전통 명리 해석에서 금의 기운은 판단, 기준, 정리와 연결합니다. 무엇이 필요한지 빠르게 구분하고 불필요한 것을 덜어내려는 모습으로 나타날 수 있습니다.",

    wealth:
      "재물에서는 감정보다 기준과 효율을 중요하게 보는 흐름으로 해석할 수 있습니다.",

    love:
      "관계에서도 애매한 상태가 오래 지속되는 것보다 서로의 입장과 기준이 명확한 것을 편하게 느낄 수 있습니다.",

    career:
      "판단, 관리, 분석처럼 기준을 세우고 결과를 구분하는 역할에서 장점이 드러날 수 있습니다.",
  },

  수: {
    keywords: [
      "관찰",
      "유연함",
      "정보",
      "통찰",
    ],

    summary:
      "바로 결론을 내리기보다 상황과 사람을 관찰하고 흐름을 읽으려는 성향이 나타납니다.",

    personality:
      "전통 명리 해석에서 수의 기운은 정보, 흐름, 사고와 연결합니다. 한 방향만 고집하기보다 상황에 따라 방법을 바꾸며 판단하는 모습으로 나타날 수 있습니다.",

    wealth:
      "재물에서는 상황과 정보를 충분히 살펴본 뒤 움직이려는 경향으로 해석할 수 있습니다.",

    love:
      "관계에서는 겉으로 드러난 말뿐 아니라 상대의 분위기와 맥락을 중요하게 받아들일 수 있습니다.",

    career:
      "정보를 모으고 분석하거나 상황 변화에 유연하게 대응해야 하는 환경에서 강점을 보일 수 있습니다.",
  },
};

function getDominantElement(
  result: SajuCalculationResult,
): FiveElement {
  const elements:
    FiveElement[] = [
    "목",
    "화",
    "토",
    "금",
    "수",
  ];

  return elements.reduce(
    (
      current,
      element,
    ) =>
      result.fiveElements[
        element
      ] >
      result.fiveElements[
        current
      ]
        ? element
        : current,
    elements[0],
  );
}

function getWeakElement(
  result: SajuCalculationResult,
): FiveElement | null {
  const elements:
    FiveElement[] = [
    "목",
    "화",
    "토",
    "금",
    "수",
  ];

  const minimum =
    Math.min(
      ...elements.map(
        (element) =>
          result.fiveElements[
            element
          ],
      ),
    );

  const weak =
    elements.filter(
      (element) =>
        result.fiveElements[
          element
        ] === minimum,
    );

  if (
    weak.length !== 1
  ) {
    return null;
  }

  return weak[0];
}

function getYinYangKeyword(
  result: SajuCalculationResult,
) {
  return result.dayMaster
    .yinYang === "양"
    ? "능동적"
    : "섬세함";
}

export function interpretBasicSaju(
  result: SajuCalculationResult,
): BasicSajuInterpretation {
  const dayElement =
    result.dayMaster.element;

  const profile =
    elementProfiles[
      dayElement
    ];

  const dominantElement =
    getDominantElement(
      result,
    );

  const weakElement =
    getWeakElement(
      result,
    );

  const yinYangKeyword =
    getYinYangKeyword(
      result,
    );

  const keywords =
    [
      ...profile.keywords.slice(
        0,
        3,
      ),
      yinYangKeyword,
    ];

  const dominantCount =
    result.fiveElements[
      dominantElement
    ];

  const total =
    result.fiveElements.total;

  const dominantPercentage =
    total > 0
      ? Math.round(
          (
            dominantCount /
            total
          ) *
            100,
        )
      : 0;

  const elementDescription =
    weakElement
      ? `현재 단순 오행 분포에서는 ${dominantElement}의 비중이 가장 높고 ${weakElement}의 비중이 가장 낮습니다. 이는 강약을 확정하는 판단이 아니라 원국의 기본 구성만 보여주는 참고 데이터입니다.`
      : `현재 단순 오행 분포에서는 ${dominantElement}의 비중이 상대적으로 높습니다. 이는 강약을 확정하는 판단이 아니라 원국의 기본 구성만 보여주는 참고 데이터입니다.`;

  return {
    headline:
      `${result.dayMaster.korean}(${result.dayMaster.hanja}) 일간, ${profile.keywords[0]}의 흐름을 가진 사람`,

    summary:
      `${profile.summary} 일간은 ${result.dayMaster.yinYang}${result.dayMaster.element}에 해당하며, 현재 원국에서는 ${dominantElement} 기운이 약 ${dominantPercentage}%로 가장 많이 나타납니다.`,

    keywords,

    personality: {
      title:
        `당신의 기본 성향은 '${profile.keywords[0]}'과 가깝습니다.`,

      description:
        profile.personality,
    },

    wealth: {
      preview:
        profile.wealth,

      lockedTopics: [
        "돈이 들어오는 흐름과 나가는 흐름",
        "직장소득과 사업소득의 차이",
        "재물운의 변화가 커지는 시기",
      ],
    },

    love: {
      preview:
        profile.love,

      lockedTopics: [
        "연애에서 반복되는 관계 패턴",
        "인연이 들어오는 흐름",
        "결혼과 장기 관계에서 중요한 포인트",
      ],
    },

    career: {
      preview:
        profile.career,

      lockedTopics: [
        "조직생활과 독립적인 일의 차이",
        "잘 맞는 역할과 업무 방식",
        "커리어 변화가 커지는 흐름",
      ],
    },

    elementInsight: {
      dominantElement,

      weakElement,

      description:
        elementDescription,
    },
  };
}