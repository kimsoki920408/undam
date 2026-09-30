import "server-only";

import type {
  CareerClassification,
  CareerRoleKey,
} from "@/lib/fortune/classify-career-context";

export type CareerPathSuggestion = {
  role:
    CareerRoleKey;

  title:
    string;

  oneLine:
    string;
};

export type CareerRecommendationGuidance = {
  currentFocus:
    string;

  adjacentPaths:
    CareerPathSuggestion[];

  longTermPath:
    CareerPathSuggestion;
};

export function buildCareerRecommendationGuidance(
  classification:
    CareerClassification,
): CareerRecommendationGuidance {
  const {
    primaryRole,
    domain,
  } = classification;

  if (
    domain ===
    "finance-insurance"
  ) {
    return {
      currentFocus:
        "고객 상담·설계·사후관리 중 자신이 가장 강한 단계를 전문 영역으로 키우는 방향이 좋습니다.",

      adjacentPaths: [
        {
          role:
            "sales",

          title:
            "법인·B2B 영업",

          oneLine:
            "개인 고객 상담 경험을 기업·사업자 대상 제안과 관계 관리로 확장하는 방향입니다.",
        },

        {
          role:
            "specialist",

          title:
            "보장·리스크 컨설팅",

          oneLine:
            "판매 자체보다 복잡한 위험과 보장 구조를 분석하고 설명하는 전문성을 키우는 방향입니다.",
        },
      ],

      longTermPath: {
        role:
          "business",

        title:
          "고객 기반 독립·사업 확장",

        oneLine:
          "안정적인 고객 관계와 소개 구조가 만들어진 뒤 조직 운영이나 독립을 검토할 수 있습니다.",
      },
    };
  }

  if (
    domain ===
    "healthcare"
  ) {
    return {
      currentFocus:
        "현재 의료 현장에서 숙련도와 정확성을 높이고, 자신만의 전문 업무 영역을 만드는 것이 우선입니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
  "전문 실무·임상 영역 강화",

          oneLine:
            "현재 자격과 경험을 바탕으로 더 높은 숙련도가 필요한 전문 업무를 맡는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "교육·코디네이션·현장 리딩",

          oneLine:
            "임상 경험을 후배 교육, 환자 관리, 업무 조정과 같은 책임 역할로 확장하는 방향입니다.",
        },
      ],

      longTermPath: {
        role:
          "leadership",

        title:
          "전문 관리·교육 역할",

        oneLine:
          "충분한 현장 경험이 쌓인 뒤 교육·품질관리·팀 운영처럼 경험을 다른 사람에게 전달하는 역할로 확장할 수 있습니다.",
      },
    };
  }

  if (
    domain ===
    "public-admin"
  ) {
    return {
      currentFocus:
        "반복 행정보다 특정 업무 분야의 전문성과 책임 범위를 키우는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "정책·기획·전문 담당",

          oneLine:
            "일반 행정 경험을 특정 정책이나 전문 업무를 깊게 다루는 방향으로 확장할 수 있습니다.",
        },

        {
          role:
            "leadership",

          title:
            "조정·관리 역할",

          oneLine:
            "실무 처리 경험을 여러 사람과 업무를 조율하고 책임지는 역할로 발전시키는 방향입니다.",
        },
      ],

      longTermPath: {
        role:
          "leadership",

        title:
          "책임·관리 직무",

        oneLine:
          "업무 신뢰도와 전문성을 바탕으로 더 큰 책임과 의사결정 범위를 맡는 방향입니다.",
      },
    };
  }

  if (
    domain ===
    "marketing-media"
  ) {
    return {
      currentFocus:
        "단순 제작량보다 결과물의 완성도와 시장 반응을 함께 증명할 수 있는 포트폴리오를 만드는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "콘텐츠 전략·전문 제작",

          oneLine:
            "제작 경험을 특정 콘텐츠 분야의 전문성과 전략 능력으로 확장하는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "프로젝트·크리에이티브 리드",

          oneLine:
            "직접 만드는 역할에서 여러 결과물과 사람을 조율하는 역할로 확장할 수 있습니다.",
        },
      ],

      longTermPath: {
        role:
          "business",

        title:
          "브랜드·콘텐츠 기반 독립",

        oneLine:
          "포트폴리오와 반복 의뢰가 충분히 검증된 뒤 프리랜스나 독립 사업을 검토할 수 있습니다.",
      },
    };
  }

  if (
    domain ===
    "legal-accounting"
  ) {
    return {
      currentFocus:
        "반복적인 처리 업무보다 더 복잡한 문제를 해결한 사례와 전문 분야를 축적하는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "전문 자문·고난도 업무",

          oneLine:
            "현재 전문지식을 더 복잡한 판단과 문제 해결이 필요한 업무로 확장하는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "검토·책임자 역할",

          oneLine:
            "직접 처리하는 단계를 넘어 다른 사람의 결과를 검토하고 책임지는 역할로 확장할 수 있습니다.",
        },
      ],

      longTermPath: {
        role:
          "business",

        title:
          "전문성 기반 독립",

        oneLine:
          "전문 분야와 고객 기반이 충분히 검증된 뒤 독립이나 전문 사무소 운영을 고려할 수 있습니다.",
      },
    };
  }

  if (
    domain ===
    "construction-realestate"
  ) {
    if (
      primaryRole ===
      "sales"
    ) {
      return {
        currentFocus:
          "매물 수보다 고객 조건을 정확히 이해하고 거래 성사와 소개로 이어지는 구조를 만드는 것이 중요합니다.",

        adjacentPaths: [
          {
            role:
              "sales",

            title:
              "특정 부동산 분야 전문 중개",

            oneLine:
              "지역·주거·상업용 등 특정 시장에서 전문성을 쌓아 고객 선택 이유를 만드는 방향입니다.",
          },

          {
            role:
              "specialist",

            title:
              "부동산 분석·상담 강화",

            oneLine:
              "단순 매물 소개보다 시장과 조건을 분석해 고객의 의사결정을 돕는 방향입니다.",
          },
        ],

        longTermPath: {
          role:
            "business",

          title:
            "중개 조직·사업 확장",

          oneLine:
            "거래와 소개가 반복되는 기반이 만들어진 뒤 조직 운영이나 사업 확장을 검토할 수 있습니다.",
        },
      };
    }

    return {
      currentFocus:
        "현장을 직접 해결하는 능력뿐 아니라 공정·품질·안전·인력을 안정적으로 관리한 경험을 경력으로 남기는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "공정·품질·안전 전문 역할",

          oneLine:
            "현장 경험을 특정 관리 분야의 전문성으로 더 깊게 가져가는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "프로젝트·현장 총괄",

          oneLine:
            "개별 문제 해결보다 전체 일정과 사람, 품질을 책임지는 범위로 확장하는 방향입니다.",
        },
      ],

      longTermPath: {
        role:
          "leadership",

        title:
          "대형 프로젝트 책임 역할",

        oneLine:
          "다양한 현장을 안정적으로 운영한 경험이 쌓이면 더 큰 프로젝트와 조직을 책임지는 방향으로 갈 수 있습니다.",
      },
    };
  }

  if (
    domain ===
    "logistics-transport"
  ) {
    return {
      currentFocus:
        "업무량만 늘리기보다 시간·동선·안전·정확도를 개선한 경험을 경력 자산으로 만드는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "물류·운송 운영 전문",

          oneLine:
            "현장 경험을 배차·동선·물류 효율을 개선하는 전문성으로 확장하는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "현장·운영 관리",

          oneLine:
            "직접 수행 경험을 사람과 일정, 운영을 관리하는 역할로 발전시키는 방향입니다.",
        },
      ],

      longTermPath: {
        role:
          "leadership",

        title:
          "운영 책임자",

        oneLine:
          "현장 경험과 운영 효율화 경험이 쌓이면 더 큰 물류·운송 운영을 책임지는 역할로 확장할 수 있습니다.",
      },
    };
  }

  if (
    domain ===
    "manufacturing"
  ) {
    return {
      currentFocus:
        "반복 작업 숙련뿐 아니라 품질·생산성·안전·공정 개선 경험을 쌓는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "품질·공정 전문",

          oneLine:
            "생산 경험을 불량 감소와 공정 개선을 담당하는 전문 역할로 확장하는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "생산·현장 관리",

          oneLine:
            "개인 작업 능력을 사람·품질·생산 계획을 관리하는 역할로 발전시키는 방향입니다.",
        },
      ],

      longTermPath: {
        role:
          "leadership",

        title:
          "생산 운영 책임",

        oneLine:
          "현장과 공정을 충분히 이해한 뒤 전체 생산성과 품질을 책임지는 방향으로 확장할 수 있습니다.",
      },
    };
  }

  if (
    domain ===
    "hr"
  ) {
    return {
      currentFocus:
        "지원 업무를 많이 하는 것보다 조직의 문제를 실제로 개선한 사례를 만드는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "채용·보상·조직개발 전문",

          oneLine:
            "인사 업무 중 특정 분야를 깊게 다뤄 전문성을 만드는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "HR 기획·조직 리딩",

          oneLine:
            "개별 지원 업무를 넘어 제도와 조직 전체를 설계하고 조율하는 방향입니다.",
        },
      ],

      longTermPath: {
        role:
          "leadership",

        title:
          "조직·인사 책임자",

        oneLine:
          "사람과 제도를 연결해 조직 성과를 만든 경험이 쌓이면 더 큰 인사 책임 역할로 확장할 수 있습니다.",
      },
    };
  }

  if (
    domain ===
    "education"
  ) {
    return {
      currentFocus:
        "수업량보다 학습자의 실제 변화와 자신만의 교육 방식을 증명하는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "교육 콘텐츠·커리큘럼 전문",

          oneLine:
            "교육 경험을 반복 가능한 콘텐츠와 교육 방식으로 만드는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "교육 기획·운영",

          oneLine:
            "직접 가르치는 경험을 교육 프로그램과 사람을 관리하는 역할로 확장할 수 있습니다.",
        },
      ],

      longTermPath: {
        role:
          "business",

        title:
          "교육 전문성 기반 독립",

        oneLine:
          "교육 결과와 콘텐츠 경쟁력이 검증된 뒤 독립 프로그램이나 교육 사업으로 확장할 수 있습니다.",
      },
    };
  }

  if (
    domain ===
      "retail-food" ||
    domain ===
      "beauty-service"
  ) {
    return {
      currentFocus:
        "기술이나 서비스 제공량보다 재방문과 좋은 평가로 이어지는 자신만의 강점을 만드는 것이 중요합니다.",

      adjacentPaths: [
        {
          role:
            "specialist",

          title:
            "전문 기술·서비스 강화",

          oneLine:
            "고객이 다시 찾는 특정 기술이나 서비스를 자신의 전문 영역으로 만드는 방향입니다.",
        },

        {
          role:
            "leadership",

          title:
            "교육·운영 관리",

          oneLine:
            "직접 서비스하는 역할에서 다른 사람을 교육하고 운영을 관리하는 역할로 확장할 수 있습니다.",
        },
      ],

      longTermPath: {
        role:
          "business",

        title:
          "전문성 기반 매장·브랜드 운영",

        oneLine:
          "재방문 고객과 운영 경험이 충분히 쌓인 뒤 자신의 매장이나 브랜드를 검토할 수 있습니다.",
      },
    };
  }

  return {
    currentFocus:
      "현재 직업에서 반복적으로 잘하는 업무와 실제 성과가 남는 지점을 먼저 하나의 강점으로 만드는 것이 중요합니다.",

    adjacentPaths: [
      {
        role:
          "specialist",

        title:
          "전문성 강화",

        oneLine:
          "현재 경험 중 특정 문제를 더 잘 해결하는 능력을 전문 영역으로 만드는 방향입니다.",
      },

      {
        role:
          "leadership",

        title:
          "프로젝트·관리 역할",

        oneLine:
          "실무 경험을 바탕으로 더 큰 책임과 의사결정 범위를 맡는 방향입니다.",
      },
    ],

    longTermPath: {
      role:
        primaryRole ===
        "business"
          ? "leadership"
          : "business",

      title:
        "장기 확장 방향",

      oneLine:
        "현재 강점이 충분히 검증된 뒤 더 큰 책임이나 독립 가능성을 검토하는 장기 방향입니다.",
    },
  };
}