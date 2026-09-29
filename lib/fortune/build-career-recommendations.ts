import "server-only";

import type {
  CareerContext,
} from "@/types/career-context";

import type {
  CareerRoleFit,
} from "@/types/career-fortune";

import {
  classifyCareerContext,
} from "@/lib/fortune/classify-career-context";

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


export function buildCareerRecommendations(
  context:
    CareerContext | null | undefined,

  roleComparison:
    RoleComparison,
): CareerRoleFit[] {
  /*
   * 현재 직업정보가 없으면
   * 기존 추천 방식과 비슷하게 반환
   */
  if (
    !context ||
    !context.hasContext
  ) {
    return [
      roleComparison.sales,
      roleComparison.business,
      roleComparison.specialist,
      roleComparison.leadership,
      roleComparison.employee,
    ]
      .filter(
        (
          role,
        ) =>
          role.fit ===
            "very-good" ||
          role.fit ===
            "good",
      )
      .slice(
        0,
        4,
      );
  }

  const jobName =
    context.jobTitle ??
    "현재 직업";

  const classification =
  classifyCareerContext(
    context,
  );

const currentRole =
  classification.primaryRole;

  /*
   * 현재 하는 일이
   * 영업·상담·고객·계약 중심
   */
  if (
    currentRole ===
    "sales"
  ) {
    return buildSalesRecommendations(
      jobName,
      context,
      roleComparison,
    );
  }

  /*
   * 현재 사업·자영업·대표
   */
  if (
    currentRole ===
    "business"
  ) {
    return buildBusinessRecommendations(
      jobName,
      context,
      roleComparison,
    );
  }

  /*
   * 전문직·기술·개발·분석 중심
   */
  if (
    currentRole ===
    "specialist"
  ) {
    return buildSpecialistRecommendations(
      jobName,
      context,
      roleComparison,
    );
  }

  /*
   * 팀장·관리·리딩 중심
   */
  if (
    currentRole ===
    "leadership"
  ) {
    return buildLeadershipRecommendations(
      jobName,
      context,
      roleComparison,
    );
  }

  /*
   * 일반 조직·운영형
   */
  if (
    currentRole ===
    "employee"
  ) {
    return buildEmployeeRecommendations(
      jobName,
      context,
      roleComparison,
    );
  }

  /*
   * 직무 분류가 어려운 경우
   */
  return [
    createCurrentRoleFallback(
      jobName,
      context,
      roleComparison,
    ),

    ...[
      roleComparison.sales,
      roleComparison.specialist,
      roleComparison.business,
      roleComparison.leadership,
      roleComparison.employee,
    ]
      .filter(
        (
          role,
        ) =>
          role.fit ===
            "very-good" ||
          role.fit ===
            "good",
      )
      .slice(
        0,
        3,
      ),
  ];
}

function buildSalesRecommendations(
  jobName:
    string,

  context:
    CareerContext,

  roles:
    RoleComparison,
): CareerRoleFit[] {
  return [
    {
      id:
        "current-sales-growth",

      title:
        `${jobName} · 현재 직업 발전형`,

      fit:
        roles.sales.fit,

      oneLine:
        roles.sales.fit ===
          "very-good" ||
        roles.sales.fit ===
          "good"
          ? "현재 직업을 버리기보다 단순 접촉형 영업에서 고객 분석·제안·관계관리형 영업으로 깊게 가져갈 여지가 있습니다."
          : "현재 직업을 유지하더라도 단순 판매보다 고객 문제를 분석하고 제안하는 역할 비중을 높이는 편이 좋습니다.",

      why: [
        "현재 실제 업무에 고객 상담·제안·계약 요소가 있어 영업·사업개발형 역할과 직접 연결됩니다.",

        context.primaryConcern ===
        "income"
          ? "현재 고민이 수입이라면 직업을 바꾸기 전에 고객 확보·전환율·소개 고객이 개선되는지 먼저 확인하는 것이 중요합니다."
          : "현재 업무에서 상담 품질과 고객 관계가 실제 성과로 연결되는지를 확인하는 것이 중요합니다.",
      ],

      goodWhen: [
        "고객의 상황을 파악하고 직접 제안할 수 있을 때",

        "계약 이후에도 고객 관계를 장기적으로 관리할 수 있을 때",

        "성과가 실적·보상·고객 자산으로 함께 남을 때",
      ],

      cautionWhen: [
        "연락량만 늘고 상담 실력은 쌓이지 않을 때",

        "상품 설명만 반복하고 고객 문제를 분석할 기회가 없을 때",

        "단기 계약 때문에 장기 신뢰를 잃는 방식이 반복될 때",
      ],
    },

    {
      id:
        "adjacent-b2b-sales",

      title:
        "B2B 영업·사업개발",

      fit:
        roles.sales.fit,

      oneLine:
        "현재 영업 경험을 버리지 않고 더 큰 고객·기업·제휴를 다루는 방향으로 확장할 수 있는 인접 선택지입니다.",

      why: [
        "고객 요구를 파악하고 제안해서 계약으로 연결하는 경험을 그대로 활용할 수 있습니다.",

        "개인 고객 중심 영업보다 제안서·협상·장기 거래 경험을 쌓을 수 있습니다.",
      ],

      goodWhen: [
        "단순 판매보다 문제 해결형 제안을 할 수 있을 때",

        "거래 규모가 커질수록 보상과 경력 가치도 커질 때",

        "고객과 장기 관계를 쌓을 수 있을 때",
      ],

      cautionWhen: [
        "콜 수나 접촉량만 평가하는 구조",

        "상품 경쟁력이 약한데 개인 관계만 소모해야 하는 구조",

        "성과는 요구하지만 협상 권한은 거의 없는 자리",
      ],
    },

    {
      id:
        "adjacent-consulting",

      title:
        "고객 컨설팅·관계관리형 역할",

      fit:
        roles.sales.fit,

      oneLine:
        "단순히 파는 사람보다 고객 상황을 이해하고 해결책을 설계하는 사람으로 올라가는 방향입니다.",

      why: [
        "현재 상담 경험을 단순 판매가 아니라 문제 파악·제안·장기관리 능력으로 발전시킬 수 있습니다.",

        "소개와 재상담이 늘수록 신규 고객만 쫓는 구조에서 벗어날 수 있습니다.",
      ],

      goodWhen: [
        "고객별 상황을 깊게 분석할 수 있을 때",

        "기존 고객 관리가 소개·재계약으로 연결될 때",

        "상담 경험이 전문성과 신뢰로 축적될 때",
      ],

      cautionWhen: [
        "전문성 없이 친분과 관계에만 의존할 때",

        "고객 관리 시간이 늘지만 보상 구조는 그대로일 때",

        "고객에게 필요한 것보다 판매 목표가 항상 우선될 때",
      ],
    },

    {
      id:
        "longterm-sales-business",

      title:
        "창업·독립",

      fit:
        roles.business.fit,

      oneLine:
        "당장 1순위라기보다 고객 기반과 반복 수입 구조가 확인된 뒤 검토할 수 있는 장기 확장 방향입니다.",

      why: [
        "현재 영업에서 확보한 고객 이해와 시장 경험은 향후 독립의 기반이 될 수 있습니다.",

        context.interests.includes(
          "창업·사업",
        )
          ? "사용자가 창업·사업에도 관심을 표시했으므로 지금부터 고객·성과·반복 수입을 자산으로 축적해둘 가치가 있습니다."
          : "독립 여부는 성향보다 실제 고객 기반과 현금흐름이 확인된 뒤 판단하는 것이 좋습니다.",
      ],

      goodWhen: [
        "소개와 재구매가 반복되는 고객 기반이 있을 때",

        "나만의 고객 확보 방식이 어느 정도 검증됐을 때",

        "현재 직장을 떠나도 유지할 수 있는 수입 구조가 보일 때",
      ],

      cautionWhen: [
        "현재 수입이 답답하다는 이유만으로 바로 독립할 때",

        "고객 검증 없이 비용부터 늘릴 때",

        "매출과 실제 남는 돈을 구분하지 않을 때",
      ],
    },
  ];
}

function buildBusinessRecommendations(
  jobName:
    string,

  context:
    CareerContext,

  roles:
    RoleComparison,
): CareerRoleFit[] {
  return [
    {
      id:
        "current-business-growth",

      title:
        `${jobName} · 현재 사업 고도화`,

      fit:
        roles.business.fit,

      oneLine:
        "새 사업을 계속 추가하기보다 지금 사업에서 반복되는 고객과 이익 구조를 만드는 것이 먼저입니다.",

      why: [
        "현재 이미 사업을 운영하고 있으므로 아이디어보다 실제 고객과 현금흐름이 가장 중요한 판단 자료입니다.",

        "사업 적합성보다 현재 사업이 반복 가능한 구조로 발전하고 있는지를 먼저 확인해야 합니다.",
      ],

      goodWhen:
        roles.business.goodWhen,

      cautionWhen:
        roles.business.cautionWhen,
    },

    {
      ...roles.sales,

      id:
        "business-sales-growth",

      title:
        "사업개발·영업 확장",

      oneLine:
        "상품 자체보다 어떤 고객에게 어떻게 판매할지를 정교하게 만드는 방향입니다.",
    },

    {
      ...roles.employee,

      id:
        "business-operation",

      title:
        "운영·시스템 구축",

      oneLine:
        "대표가 모든 일을 직접 하지 않아도 돌아가도록 운영 구조를 만드는 방향입니다.",
    },

    {
      ...roles.leadership,

      id:
        "business-leadership",

      title:
        "장기 후보 · 조직 리딩",

      oneLine:
        "사업이 커진 뒤에는 직접 일하는 능력보다 사람과 시스템을 움직이는 능력이 중요해집니다.",
    },
  ];
}

function buildSpecialistRecommendations(
  jobName:
    string,

  context:
    CareerContext,

  roles:
    RoleComparison,
): CareerRoleFit[] {
  return [
    {
      id:
        "current-specialist-growth",

      title:
        `${jobName} · 전문성 강화`,

      fit:
        roles.specialist.fit,

      oneLine:
        "현재 직업을 유지한다면 남이 쉽게 대체하기 어려운 전문 영역을 하나 만드는 것이 가장 중요합니다.",

      why: [
        "현재 업무의 기술·분석·전문 경험을 실제 결과물과 사례로 축적할 수 있습니다.",

        context.primaryConcern ===
        "income"
          ? "수입을 높이려면 근무시간보다 전문성의 희소성과 시장가치를 높이는 방향이 중요합니다."
          : "전문성이 쌓일수록 선택 가능한 역할과 협상력이 커질 수 있습니다.",
      ],

      goodWhen:
        roles.specialist.goodWhen,

      cautionWhen:
        roles.specialist.cautionWhen,
    },

    {
      ...roles.specialist,

      id:
        "adjacent-specialist-consulting",

      title:
        "전문 컨설팅·문제해결형 역할",

      oneLine:
        "내가 가진 지식을 직접 문제 해결과 의사결정 지원으로 연결하는 확장 방향입니다.",
    },

    {
      ...roles.leadership,

      id:
        "adjacent-project-lead",

      title:
        "프로젝트 리드·전문 리더",

      oneLine:
        "직접 잘하는 단계를 넘어 전문성을 기준으로 프로젝트와 사람을 이끄는 방향입니다.",
    },

    {
      ...roles.business,

      id:
        "longterm-specialist-business",

      title:
        "장기 후보 · 전문성 기반 독립",

      oneLine:
        "전문성이 시장에서 실제 돈을 받을 수준으로 검증된 뒤 고려할 수 있는 장기 선택지입니다.",
    },
  ];
}

function buildLeadershipRecommendations(
  jobName:
    string,

  context:
    CareerContext,

  roles:
    RoleComparison,
): CareerRoleFit[] {
  return [
    {
      id:
        "current-leadership-growth",

      title:
        `${jobName} · 리더십 고도화`,

      fit:
        roles.leadership.fit,

      oneLine:
        "직접 일을 많이 하는 리더보다 팀이 반복해서 성과를 내게 만드는 리더로 발전하는 방향입니다.",

      why: [
        "현재 관리·리딩 경험을 사람 관리뿐 아니라 성과 시스템을 만드는 경험으로 바꿀 수 있습니다.",

        context.primaryConcern ===
        "promotion"
          ? "승진·성장이 고민이라면 책임 증가뿐 아니라 실제 의사결정 권한이 함께 커지는지 확인해야 합니다."
          : "리더십은 직책보다 다른 사람의 성과를 반복 가능하게 만드는 능력으로 평가하는 편이 좋습니다.",
      ],

      goodWhen:
        roles.leadership.goodWhen,

      cautionWhen:
        roles.leadership.cautionWhen,
    },

    {
      ...roles.leadership,

      id:
        "adjacent-project-leadership",

      title:
        "프로젝트·사업 리딩",

      oneLine:
        "조직관리만 하는 것보다 명확한 목표와 결과가 있는 프로젝트를 책임지는 방향입니다.",
    },

    {
      ...roles.sales,

      id:
        "adjacent-business-development",

      title:
        "사업개발·대외협력",

      oneLine:
        "사람과 조직을 움직이는 능력을 고객·제휴·시장 확장으로 연결하는 선택지입니다.",
    },

    {
      ...roles.business,

      id:
        "longterm-leadership-business",

      title:
        "장기 후보 · 조직 운영·사업 책임",

      oneLine:
        "팀 성과와 사업 숫자를 함께 책임질 경험이 쌓이면 더 큰 조직이나 사업을 맡는 방향으로 확장할 수 있습니다.",
    },
  ];
}

function buildEmployeeRecommendations(
  jobName:
    string,

  context:
    CareerContext,

  roles:
    RoleComparison,
): CareerRoleFit[] {
  return [
    {
      id:
        "current-employee-growth",

      title:
        `${jobName} · 현재 직무 성장형`,

      fit:
        roles.employee.fit,

      oneLine:
        "현재 조직에 남더라도 반복 업무만 늘리기보다 책임·전문성·성과가 함께 커지는 자리를 만드는 것이 중요합니다.",

      why: [
        "직장 자체보다 지금 역할에서 무엇이 경력으로 남는지가 더 중요합니다.",

        context.primaryConcern ===
        "promotion"
          ? "승진을 원한다면 업무량보다 더 큰 책임과 의사결정 경험을 확보해야 합니다."
          : "현재 업무를 다음 단계에서도 설명할 수 있는 결과물로 남길 필요가 있습니다.",
      ],

      goodWhen:
        roles.employee.goodWhen,

      cautionWhen:
        roles.employee.cautionWhen,
    },

    {
      ...roles.specialist,

      id:
        "adjacent-employee-specialist",

      title:
        "전문가형 직무 확장",

      oneLine:
        "조직 안에서 특정 문제를 잘 해결하는 사람으로 포지션을 만드는 방향입니다.",
    },

    {
      ...roles.leadership,

      id:
        "adjacent-employee-leadership",

      title:
        "프로젝트·관리 역할",

      oneLine:
        "실무 경험을 바탕으로 더 큰 책임과 의사결정 경험을 쌓는 방향입니다.",
    },

    {
      ...roles.sales,

      id:
        "adjacent-market-role",

      title:
        "고객·시장 접점 역할",

      oneLine:
        "내부 업무만 반복하기보다 고객과 시장의 반응을 직접 확인할 수 있는 방향입니다.",
    },
  ];
}

function createCurrentRoleFallback(
  jobName:
    string,

  context:
    CareerContext,

  roles:
    RoleComparison,
): CareerRoleFit {
  const strongest =
    getStrongestRole(
      roles,
    );

  return {
    ...strongest,

    id:
      "current-role-fallback",

    title:
      `${jobName} · 현재 직업 점검`,

    oneLine:
      context.wantsToStay ===
      true
        ? "현재 직업을 바로 버리기보다 강점이 살아나는 업무가 실제로 있는지 먼저 확인해보세요."
        : "현재 직업명보다 실제로 맡고 있는 업무를 기준으로 다음 방향을 좁혀보세요.",

    why: [
      "직업 이름만으로는 실제 일하는 방식을 충분히 알 수 없습니다.",

      "현재 업무에서 성과가 잘 나는 장면과 가장 지치는 장면을 비교하면 다음 방향을 더 정확하게 좁힐 수 있습니다.",
    ],
  };
}

function getStrongestRole(
  roles:
    RoleComparison,
) {
  const values =
    Object.values(
      roles,
    );

  return [...values].sort(
    (
      a,
      b,
    ) =>
      fitWeight(
        b.fit,
      ) -
      fitWeight(
        a.fit,
      ),
  )[0];
}

function fitWeight(
  fit:
    CareerRoleFit["fit"],
) {
  switch (
    fit
  ) {
    case "very-good":
      return 4;

    case "good":
      return 3;

    case "mixed":
      return 2;

    case "caution":
      return 1;
  }
}