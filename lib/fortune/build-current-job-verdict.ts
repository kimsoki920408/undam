import "server-only";

import type {
  CareerContext,
  CareerConcern,
  CareerSatisfaction,
} from "@/types/career-context";

import type {
  CareerCurrentJobVerdict,
  CareerRoleFit,
} from "@/types/career-fortune";

import {
  classifyCareerContext,
} from "@/lib/fortune/classify-career-context";

import {
  buildCareerRealityMetrics,
  type CareerRealityMetrics,
} from "@/lib/fortune/build-career-reality-metrics";

import {
  buildCareerDomainGuidance,
  type CareerDomainGuidance,
} from "@/lib/fortune/build-career-domain-guidance";


type RoleComparison = {
  employee:
    CareerRoleFit;

  specialist:
    CareerRoleFit;

  sales:
    CareerRoleFit;

  business:
    CareerRoleFit;

  leadership:
    CareerRoleFit;
};

type RoleKey =
  keyof RoleComparison;

type RoleMatch = {
  key:
    RoleKey;

  label:
    string;

  matched:
    string[];
};

const roleLabels:
  Record<
    RoleKey,
    string
  > = {
  employee:
    "조직·운영형",

  specialist:
    "전문가형",

  sales:
    "영업·사업개발형",

  business:
    "창업·사업형",

  leadership:
    "리더·관리형",
};

export function buildCurrentJobVerdict(
  context:
    CareerContext | null | undefined,

  roleComparison:
    RoleComparison,
): CareerCurrentJobVerdict {
  if (
    !context ||
    !context.hasContext
  ) {
    return {
      available:
        false,

      decision:
        "지금 정보만으로는 계속할지 말지 결론을 내리기 어렵습니다.",

      recommendedAction:
        "현재 직업과 실제 업무를 먼저 입력해주세요.",

      reviewPeriod:
        null,

      reviewMetrics:
        [],

      headline:
        "현재 직업 정보가 없어 지금 하는 일과의 궁합은 아직 비교하지 않았습니다.",

      verdict:
        "unknown",

      reasons: [
        "사주만으로 현재 직업이 맞다·틀리다고 판정하지 않습니다.",

        "현재 업종과 실제 직무가 들어오면 지금 쓰고 있는 강점과 직업운에서 읽히는 방향을 직접 비교할 수 있습니다.",
      ],

      keepIf: [
        "현재 업무에서 스스로 판단할 여지가 있다.",

        "성과가 경력·보상·고객·실적으로 남는다.",

        "시간이 지날수록 전문성이나 영향력이 쌓인다.",
      ],

      changeIf: [
        "책임은 계속 늘지만 결정권은 거의 없다.",

        "성과를 내도 보상이나 경력으로 남지 않는다.",

        "같은 일을 반복하면서 배울 것과 성장할 것이 거의 없다.",
      ],

      nextQuestion:
        "현재 직업·직무·경력·가장 큰 고민을 입력하면 계속할지, 조정할지, 옮길지까지 더 직접적으로 비교할 수 있습니다.",
    };
  }

  const classification =
  classifyCareerContext(
    context,
  );

const strongestMatch:
  RoleMatch | null =
  classification.primaryRole
    ? {
        key:
          classification.primaryRole,

        label:
  roleLabels[
    classification.primaryRole
  ],

        matched:
          classification.matchedKeywords,
      }
    : null;

      const realityMetrics =
  buildCareerRealityMetrics(
    classification,
  );

  const domainGuidance =
  buildCareerDomainGuidance(
    classification,
  );

  const reasons:
    string[] = [];

  let verdict:
    CareerCurrentJobVerdict["verdict"] =
      "adjust";

  /*
   * 1.
   * 실제 업무 구조와
   * 사주 기반 역할 방향 비교
   */
  if (
    strongestMatch
  ) {
    const role =
      roleComparison[
        strongestMatch.key
      ];

    if (
      role.fit ===
        "very-good" ||
      role.fit ===
        "good"
    ) {
      reasons.push(
        `현재 입력한 업무는 '${strongestMatch.label}' 성격이 강하고, 직업운에서 이 역할은 ${fitToSentence(role.fit)}으로 읽힙니다.`,
      );

      verdict =
        "keep";
    } else if (
      role.fit ===
      "mixed"
    ) {
      reasons.push(
        `현재 입력한 업무는 '${strongestMatch.label}' 성격이 보이지만, 직업운에서는 조건에 따라 만족도와 성과 차이가 커질 수 있는 영역입니다.`,
      );

      verdict =
        "adjust";
    } else {
      reasons.push(
        `현재 입력한 업무는 '${strongestMatch.label}' 성격이 강하지만, 직업운에서는 이 방식만 오래 유지할 경우 답답함을 느낄 가능성을 점검할 필요가 있습니다.`,
      );

      verdict =
        "explore";
    }
  } else {
    reasons.push(
      "입력한 직업명만으로는 어떤 방식으로 일하는지 충분히 분류하기 어렵습니다. 직업명보다 실제 업무 내용과 권한·보상 구조를 더 중요하게 봐야 합니다.",
    );
  }

  /*
   * 2.
   * 현재 만족도
   */
  if (
    context.satisfaction
  ) {
    reasons.push(
      buildSatisfactionReason(
        context.satisfaction,
        context.experienceMonths,
      ),
    );

    if (
      (
        context.satisfaction ===
          "very-low" ||
        context.satisfaction ===
          "low"
      ) &&
      verdict ===
        "keep"
    ) {
      verdict =
        "adjust";
    }

    if (
      context.satisfaction ===
        "very-high" &&
      verdict ===
        "adjust"
    ) {
      verdict =
        "keep";
    }
  }

  /*
   * 3.
   * 현재 일을 유지하고 싶은지
   */
  if (
    context.wantsToStay ===
    false
  ) {
    reasons.push(
      "현재 일을 바꾸고 싶은 의향이 분명합니다. 다만 바로 그만두기보다 현재 불만이 직무 때문인지 조직·보상 구조 때문인지 먼저 분리해서 보는 편이 좋습니다.",
    );

    if (
      verdict ===
      "keep"
    ) {
      verdict =
        "adjust";
    }
  }

  if (
    context.wantsToStay ===
    true
  ) {
    reasons.push(
      "현재 일을 계속하고 싶은 의향도 있습니다. 직업 자체를 버리기보다 지금 역할 안에서 강점이 실제 성과와 수입으로 연결되는지 먼저 검증할 가치가 있습니다.",
    );
  }

  /*
   * 4.
   * 가장 큰 현실 고민
   */
  if (
    context.primaryConcern
  ) {
    reasons.push(
      buildConcernReason(
        context.primaryConcern,
      ),
    );
  }

  /*
   * 5.
   * 경력이 매우 짧다면
   * 너무 빠른 결론을 막습니다.
   */
  if (
    context.experienceMonths !==
      null &&
    context.experienceMonths <
      6
  ) {
    reasons.push(
      "현재 경력이 6개월 미만이라면 직업 전체가 맞지 않는다고 결론내리기보다 고객·업무·조직 방식 중 무엇이 맞고 안 맞는지 경험을 조금 더 분리해서 보는 편이 좋습니다.",
    );
  }

  const jobName =
    context.jobTitle ??
    "현재 일";

  const decision =
    buildDecision(
      verdict,
    );

  const recommendedAction =
    buildRecommendedAction(
      verdict,
      context,
    );

  const reviewPeriod =
    buildReviewPeriod(
      verdict,
      context,
    );

  const reviewMetrics =
  buildReviewMetrics(
    context,
    realityMetrics,
  );

  const headline =
    buildHeadline(
      jobName,
      verdict,
      strongestMatch,
    );

  const keepIf =
  buildKeepConditions(
    strongestMatch,
    roleComparison,
    context,
    realityMetrics,
  );

  const changeIf =
  buildChangeConditions(
    strongestMatch,
    context,
    realityMetrics,
  );

  const nextQuestion =
  buildNextQuestion(
    context,
    strongestMatch,
    realityMetrics,
  );

const conciseReasons =
  buildDecisionReasons(
    context,
    strongestMatch,
    roleComparison,
    realityMetrics,
    domainGuidance,
  );
return {
    available:
      true,

    decision,

    recommendedAction,

    reviewPeriod,

    reviewMetrics,

    headline,

    verdict,

    reasons:
  conciseReasons,

    keepIf,

    changeIf,

    nextQuestion,
  };
}

function buildDecision(
  verdict:
    CareerCurrentJobVerdict["verdict"],
) {
  switch (
    verdict
  ) {
    case "keep":
      return "지금은 계속하는 쪽이 좋습니다.";

    case "adjust":
      return "직업을 바로 바꾸기보다, 지금 일하는 방식을 먼저 바꿔야 합니다.";

    case "explore":
      return "당장 그만두기보다 다른 선택지를 병행해서 탐색하는 쪽이 좋습니다.";

    case "change":
      return "현재 일을 그대로 유지하는 것보다 이동 준비를 시작하는 쪽이 좋습니다.";

    case "unknown":
      return "지금 정보만으로는 계속할지 말지 결론을 내리기 어렵습니다.";
  }
}

function buildRecommendedAction(
  verdict:
    CareerCurrentJobVerdict["verdict"],

  context:
    CareerContext,
) {
  if (
    verdict ===
      "keep" &&
    context.experienceMonths !==
      null &&
    context.experienceMonths <
      6
  ) {
    return "3~6개월은 유지하면서 실제 성과와 수입이 성장하는지 검증하세요.";
  }

  switch (
    verdict
  ) {
    case "keep":
      return "현재 직업은 유지하되, 강점이 살아나는 업무 비중과 보상 구조를 더 키우세요.";

    case "adjust":
      return "퇴사보다 역할·고객·조직·보상 구조 중 무엇을 바꿀 수 있는지 먼저 실험하세요.";

    case "explore":
      return "현재 수입 기반은 유지하면서 1~3개월 동안 다른 역할이나 회사를 병행 탐색하세요.";

    case "change":
      return "충동적으로 그만두기보다 다음 직장이나 수입원을 확보하는 이동 준비부터 시작하세요.";

    case "unknown":
      return "현재 직업과 실제 업무 정보를 더 입력한 뒤 판단하세요.";
  }
}

function buildReviewPeriod(
  verdict:
    CareerCurrentJobVerdict["verdict"],

  context:
    CareerContext,
) {
  if (
    context.experienceMonths !==
      null &&
    context.experienceMonths <
      6
  ) {
    return "3~6개월 뒤";
  }

  if (
    verdict ===
      "explore" ||
    verdict ===
      "change"
  ) {
    return "1~3개월 뒤";
  }

  if (
    context.satisfaction ===
      "very-low" ||
    context.satisfaction ===
      "low"
  ) {
    return "약 3개월 뒤";
  }

  return "3개월 뒤";
}

function buildReviewMetrics(
  context:
    CareerContext,

  realityMetrics:
    CareerRealityMetrics,
) {
  const metrics:
    string[] = [];

  switch (
    context.primaryConcern
  ) {
    case "income":
      metrics.push(
        "월 실제 수입",
        "성과 대비 보상 증가 여부",
      );
      break;

    case "change-job":
      metrics.push(
        "현재 직무 만족도 변화",
        "외부 채용·이직 탐색 반응",
      );
      break;

    case "promotion":
      metrics.push(
        "책임뿐 아니라 권한이 커졌는지",
        "성과가 승진·연봉·직책으로 연결되는지",
      );
      break;

    case "business":
      metrics.push(
        "실제 돈을 내는 고객 수",
        "반복 구매·반복 수요 여부",
        "매출이 아니라 남는 현금흐름",
      );
      break;

    case "burnout":
      metrics.push(
        "주간 업무 피로도",
        "업무 조정 후 만족도 변화",
        "소진의 원인이 업무인지 조직인지",
      );
      break;

    case "continue":
      metrics.push(
        "현재 일에서 쌓이는 실력",
        "성과가 경력과 보상으로 남는 정도",
      );
      break;

    case "other":
    case null:
      break;
  }

  metrics.push(
  ...realityMetrics.metrics,
);

  if (
    metrics.length ===
    0
  ) {
    metrics.push(
      "업무 만족도",
      "실제 성과",
      "보상 증가 여부",
      "경력으로 남는 결과물",
    );
  }

  return [
    ...new Set(
      metrics,
    ),
  ].slice(
    0,
    5,
  );
}

function buildDecisionReasons(
  context:
    CareerContext,

  roleMatch:
    RoleMatch | null,

  roleComparison:
    RoleComparison,

  realityMetrics:
    CareerRealityMetrics,

    domainGuidance:
  CareerDomainGuidance,
) {
  const result:
    string[] = [];

  /*
   * 1.
   * 지금 일이 실제로 맞는 방향인지
   */
  if (
    roleMatch
  ) {
    const role =
      roleComparison[
        roleMatch.key
      ];

    result.push(
  `현재 업무의 핵심은 '${roleMatch.label}' 성격이 강하고, 직업운에서도 이 역할은 ${fitToSentence(role.fit)}으로 읽힙니다. ${domainGuidance.workMeaning}`,
);
  } else {
    result.push(
      "현재 직업명만으로 판단하기보다 실제 업무에서 어떤 역할을 가장 많이 맡는지 확인해야 합니다.",
    );
  }

  /*
   * 2.
   * 지금 결론을 내릴 단계인지
   */
  if (
    context.experienceMonths !==
      null &&
    context.experienceMonths <
      6
  ) {
    result.push(
      "아직 경력이 6개월 미만이므로 지금은 직업 자체를 포기하기보다 앞으로 3~6개월 동안 실제 실력과 성과가 개선되는지 검증할 단계입니다.",
    );
  } else if (
    context.satisfaction
  ) {
    result.push(
      buildSatisfactionReason(
        context.satisfaction,
        context.experienceMonths,
      ),
    );
  } else {
    result.push(
      "지금 일을 계속할지는 시간이 지날수록 경력·전문성·책임·보상 중 무엇이 실제로 남는지를 기준으로 판단하는 것이 좋습니다.",
    );
  }

  /*
   * 3.
   * 지금 가장 큰 현실 문제
   */
  if (
    context.primaryConcern ===
    "income"
  ) {
    result.push(
      `현재 가장 큰 문제는 직업 적합성보다 수입 구조에 가깝습니다. ${realityMetrics.metrics
  .slice(0, 3)
  .join("·")}이 실제 보상 개선으로 이어지는지가 다음 판단의 핵심입니다.`,
    );
  } else if (
    context.primaryConcern
  ) {
    result.push(
      buildConcernReason(
        context.primaryConcern,
      ),
    );
  } else if (
    context.wantsToStay ===
    true
  ) {
    result.push(
      "현재 일을 계속하고 싶은 의향이 있으므로 직업을 바꾸기 전에 지금 역할 안에서 강점을 더 크게 쓸 방법부터 검증할 가치가 있습니다.",
    );
  } else {
    result.push(
      "현재 직업을 유지할지 바꿀지는 사주보다 실제 성과와 만족도가 함께 좋아지는지를 기준으로 다시 판단해야 합니다.",
    );
  }

  return result.slice(
    0,
    3,
  );
}

function fitToSentence(
  fit:
    CareerRoleFit["fit"],
) {
  switch (
    fit
  ) {
    case "very-good":
      return "강하게 맞는 편";

    case "good":
      return "잘 맞는 편";

    case "mixed":
      return "조건에 따라 달라지는 편";

    case "caution":
      return "주의가 필요한 편";
  }
}

function buildHeadline(
  jobName:
    string,

  verdict:
    CareerCurrentJobVerdict["verdict"],

  roleMatch:
    RoleMatch | null,
) {
  const roleText =
    roleMatch
      ? ` 현재 업무에서는 특히 ${roleMatch.label} 성격이 강하게 잡힙니다.`
      : "";

  switch (
    verdict
  ) {
    case "keep":
      return `${jobName} 자체를 바꿀 이유보다, 지금 강점을 실제 성과와 수입으로 키울 이유가 더 큽니다.${roleText}`;

    case "adjust":
      return `${jobName}이 완전히 안 맞는 문제라기보다 현재 역할이나 보상 구조가 문제일 가능성을 먼저 봐야 합니다.${roleText}`;

    case "explore":
      return `${jobName}만 계속 고집하지 말고 현재 기반을 유지하면서 인접한 역할을 비교해보세요.${roleText}`;

    case "change":
      return `${jobName}을 그대로 유지하는 것보다 다른 방향의 현실적인 가능성을 비교할 필요가 있습니다.${roleText}`;

    case "unknown":
      return `${jobName}의 실제 업무 구조를 조금 더 알아야 방향을 좁힐 수 있습니다.`;
  }
}

function buildSatisfactionReason(
  satisfaction:
    CareerSatisfaction,

  experienceMonths:
    number | null,
) {
  switch (
    satisfaction
  ) {
    case "very-low":
      return "현재 만족도가 매우 낮습니다. 일이 맞는지보다 무엇 때문에 만족도가 떨어지는지 업무·환경·보상으로 나누어 확인해야 합니다.";

    case "low":
      return "현재 만족도가 낮은 편입니다. 같은 직업 안에서도 고객군·조직·권한·보상 구조를 바꾸면 체감이 달라질 수 있습니다.";

    case "neutral":
  return experienceMonths !==
      null &&
    experienceMonths < 6
    ? "현재 만족도는 보통 수준입니다. 앞으로 3~6개월 동안 고객·실적·영업 경험 중 무엇이 실제 자산으로 쌓이는지를 확인하는 편이 좋습니다."
    : "현재 만족도는 보통 수준입니다. 앞으로 몇 달 동안 경력·성과·전문성 중 무엇이 실제 자산으로 쌓이는지를 확인하는 편이 좋습니다.";

    case "high":
      return "현재 만족도가 높은 편입니다. 이미 잘 맞는 요소가 있다는 뜻일 수 있으므로 무엇이 좋은지 구체적으로 찾아 다음 선택에서도 유지할 필요가 있습니다.";

    case "very-high":
      return "현재 만족도가 매우 높습니다. 사주 해석과 다르더라도 실제 만족과 성과가 확인된다면 현실의 경험을 우선해서 판단하는 것이 좋습니다.";
  }
}

function buildConcernReason(
  concern:
    CareerConcern,
) {
  switch (
    concern
  ) {
    case "continue":
      return "핵심 고민이 '계속할지'라면 직업명보다 지금 일이 경력·수입·전문성 중 무엇을 실제로 남기고 있는지를 기준으로 판단해야 합니다.";

    case "change-job":
      return "이직이 가장 큰 고민이라면 현재의 불만이 회사 때문인지 직무 자체 때문인지 먼저 분리해야 같은 문제를 다음 직장에서도 반복하지 않습니다.";

    case "income":
      return "수입이 가장 큰 고민이라면 현재 문제의 핵심은 적성보다 성과가 실제 보상으로 연결되는 구조인지, 고객이나 시장을 직접 확보할 수 있는지에 있습니다.";

    case "promotion":
      return "승진·성장이 고민이라면 일을 많이 하는 것보다 더 큰 책임·권한·전문성이 실제 경력으로 남는지를 확인해야 합니다.";

    case "business":
      return "창업·독립이 고민이라면 사주보다 먼저 실제 고객, 반복 수요, 현금흐름을 작게 검증하는 과정이 필요합니다.";

    case "burnout":
      return "업무 소진이 가장 큰 고민이라면 직업을 바꾸기 전에 업무량·권한·관계·보상 중 에너지를 가장 많이 빼앗는 요소를 먼저 찾아야 합니다.";

    case "other":
      return "입력한 추가 고민을 현재 직업의 실제 업무 내용과 함께 비교해보는 것이 중요합니다.";
  }
}

function buildKeepConditions(
  roleMatch:
    RoleMatch | null,

  roleComparison:
    RoleComparison,

  context:
    CareerContext,

    realityMetrics:
  CareerRealityMetrics,
) {
  const conditions = [
    `지금 하는 일이 시간이 갈수록 ${realityMetrics.growthFocus
  .slice(0, 3)
  .join("·")} 중 하나를 분명히 키워준다.`,

    "성과가 커질수록 보상이나 권한도 함께 커질 수 있다.",
  ];

  if (
    roleMatch
  ) {
    conditions.unshift(
      ...roleComparison[
        roleMatch.key
      ].goodWhen.slice(
        0,
        2,
      ),
    );
  }

  if (
    context.primaryConcern ===
    "income"
  ) {
    conditions.push(
      `같은 시간을 써도 ${realityMetrics.metrics
  .slice(0, 3)
  .join("·")}을 개선해 실제 보상을 키울 여지가 있다.`,
    );
  }

  if (
    context.primaryConcern ===
    "promotion"
  ) {
    conditions.push(
      "현재 조직에서 더 큰 역할과 권한으로 올라갈 경로가 실제로 보인다.",
    );
  }

  return [
    ...new Set(
      conditions,
    ),
  ].slice(
    0,
    4,
  );
}

function buildChangeConditions(
  roleMatch:
    RoleMatch | null,

  context:
    CareerContext,

    realityMetrics:
  CareerRealityMetrics,
) {
  const conditions = [
    "성과를 만들어도 보상·경력·전문성 중 아무것도 남지 않는다.",

    "책임은 커지는데 결정권은 계속 작아진다.",

    `시간이 지나도 ${realityMetrics.growthFocus
  .slice(0, 3)
  .join("·")}이 실제로 좋아지지 않는다.`,
  ];

  if (
    roleMatch?.key ===
    "sales"
  ) {
    conditions.push(
      "접촉량만 늘어날 뿐 고객 분석·제안·관계 관리 능력은 쌓이지 않는다.",
    );
  }

  if (
    roleMatch?.key ===
    "business"
  ) {
    conditions.push(
      "매출은 발생하지만 비용과 현금흐름을 통제하지 못한다.",
    );
  }

  if (
    context.satisfaction ===
      "very-low" ||
    context.satisfaction ===
      "low"
  ) {
    conditions.push(
      "조정 가능한 조건을 바꿔봤는데도 만족도와 성과가 계속 낮게 유지된다.",
    );
  }

  return [
    ...new Set(
      conditions,
    ),
  ].slice(
    0,
    4,
  );
}

function buildNextQuestion(
  context:
    CareerContext,

  roleMatch:
    RoleMatch | null,

  realityMetrics:
    CareerRealityMetrics,
) {
  if (
    context.primaryConcern ===
    "income"
  ) {
    const metrics =
  [
    "월 실제 수입",
    ...realityMetrics.metrics,
  ]
    .slice(0, 5)
    .join(" · ");

return `현재 문제의 핵심은 직업 적합성보다 수입 구조에 가깝습니다. 앞으로 ${metrics}을 기록한 뒤 실제로 개선되는지 확인해보세요.`;
  }

  if (
    context.primaryConcern ===
    "change-job"
  ) {
    return "다음 직장을 찾기 전에 지금 회사에서 싫은 것 3개와 다음 회사에서 반드시 필요한 조건 3개를 분리해서 적어보세요.";
  }

  if (
    context.primaryConcern ===
    "business"
  ) {
    return "창업 여부를 결정하기 전에 돈을 낼 고객 3명에게 실제 제안을 해보고 반응을 확인해보세요.";
  }

  if (
    roleMatch?.key ===
    "sales"
  ) {
    return "현재 영업에서 단순 접촉량이 아니라 고객 분석·제안·계약·소개 중 내가 가장 강한 단계가 어디인지 확인해보세요.";
  }

  if (
    roleMatch?.key ===
    "specialist"
  ) {
    return "현재 전문성이 다른 사람보다 더 높은 보상이나 더 큰 책임으로 연결되고 있는지 확인해보세요.";
  }

  return "최근 3개월 동안 가장 잘했던 업무 하나와 가장 지쳤던 업무 하나를 비교해보세요. 두 장면의 차이가 다음 선택의 단서가 됩니다.";
}