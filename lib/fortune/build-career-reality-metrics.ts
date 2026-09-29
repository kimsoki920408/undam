import "server-only";

import type {
  CareerClassification,
} from "@/lib/fortune/classify-career-context";

export type CareerRealityMetrics = {
  metrics:
    string[];

  evidenceExamples:
    string[];

  growthFocus:
    string[];
};

export function buildCareerRealityMetrics(
  classification:
    CareerClassification,
): CareerRealityMetrics {
  const {
    primaryRole,
    domain,
    patterns,
  } = classification;

  /*
   * 직업군보다 업종 특성이 더 중요한 경우를
   * 먼저 처리합니다.
   */

  if (
    domain ===
    "healthcare"
  ) {
    return {
      metrics: [
        "업무 정확도",
        "환자 응대 품질",
        "숙련도",
        "전문 업무 범위",
      ],

      evidenceExamples: [
        "실수나 재작업이 줄어든 사례",
        "더 어려운 업무를 맡게 된 경험",
        "환자·동료에게 신뢰를 얻은 사례",
      ],

      growthFocus: [
        "전문 숙련도",
        "업무 정확성",
        "책임 범위 확대",
      ],
    };
  }

  if (
    domain ===
    "public-admin"
  ) {
    return {
      metrics: [
        "업무 처리 정확도",
        "처리 속도",
        "책임 범위",
        "조직 내 역할 확대",
      ],

      evidenceExamples: [
        "복잡한 업무를 안정적으로 처리한 사례",
        "업무 절차를 개선한 경험",
        "더 큰 책임이나 역할을 맡게 된 경험",
      ],

      growthFocus: [
        "업무 신뢰도",
        "책임 범위",
        "조직 내 역할 확장",
      ],
    };
  }

  if (
    domain ===
    "education"
  ) {
    return {
      metrics: [
        "학습자 성과",
        "수업 만족도",
        "교육 콘텐츠 품질",
        "재등록·추천",
      ],

      evidenceExamples: [
        "학습자의 이해도나 결과가 좋아진 사례",
        "좋은 평가를 받은 교육 방식",
        "반복적으로 찾는 학생이나 학부모가 늘어난 경험",
      ],

      growthFocus: [
        "교육 전문성",
        "설명 능력",
        "교육 결과의 재현성",
      ],
    };
  }

  if (
    domain ===
    "marketing-media"
  ) {
    return {
      metrics: [
        "콘텐츠·캠페인 성과",
        "반응률",
        "프로젝트 완성도",
        "재의뢰·확장 가능성",
      ],

      evidenceExamples: [
        "이전보다 반응이 좋아진 프로젝트",
        "성과를 만든 기획이나 콘텐츠",
        "포트폴리오로 남길 수 있는 결과물",
      ],

      growthFocus: [
        "기획력",
        "결과물 품질",
        "시장 반응을 읽는 능력",
      ],
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
        metrics: [
          "상담 수",
          "계약 전환율",
          "거래 성사율",
          "소개·재거래",
        ],

        evidenceExamples: [
          "계약으로 이어진 상담 패턴",
          "소개 고객이 발생한 사례",
          "특정 고객군에서 성과가 높았던 경험",
        ],

        growthFocus: [
          "고객 분석",
          "계약 전환",
          "소개·재거래 구조",
        ],
      };
    }

    return {
      metrics: [
        "공정 준수",
        "품질",
        "안전",
        "일정 관리",
      ],

      evidenceExamples: [
        "공정 지연을 줄인 사례",
        "품질이나 안전 문제를 예방한 경험",
        "현장 운영 효율을 높인 사례",
      ],

      growthFocus: [
        "현장 판단력",
        "공정 관리",
        "사람과 일정 관리",
      ],
    };
  }

  if (
    domain ===
    "logistics-transport"
  ) {
    return {
      metrics: [
        "처리량",
        "시간 준수",
        "오류·사고 감소",
        "운영 효율",
      ],

      evidenceExamples: [
        "같은 시간에 더 안정적으로 업무를 처리한 사례",
        "오류나 지연을 줄인 경험",
        "동선이나 업무 절차를 개선한 경험",
      ],

      growthFocus: [
        "업무 효율",
        "안정성",
        "현장 대응력",
      ],
    };
  }

  if (
    domain ===
    "legal-accounting"
  ) {
    return {
      metrics: [
        "업무 정확도",
        "문제 해결 난이도",
        "전문 사례 수",
        "전문성에 따른 보상",
      ],

      evidenceExamples: [
        "복잡한 문제를 해결한 사례",
        "오류나 위험을 예방한 경험",
        "전문성을 인정받아 더 어려운 업무를 맡은 경험",
      ],

      growthFocus: [
        "전문성 깊이",
        "판단 정확성",
        "전문가로서의 시장가치",
      ],
    };
  }

  /*
   * 업종만으로 충분하지 않을 때는
   * 실제 일하는 패턴을 봅니다.
   */

  if (
    patterns.includes(
      "care",
    )
  ) {
    return {
      metrics: [
        "서비스 품질",
        "대상자 만족도",
        "문제 해결",
        "업무 숙련도",
      ],

      evidenceExamples: [
        "상대방의 문제를 실제로 해결한 사례",
        "신뢰를 얻은 경험",
        "더 어려운 상황을 안정적으로 처리한 사례",
      ],

      growthFocus: [
        "대인 대응력",
        "전문 숙련도",
        "신뢰",
      ],
    };
  }

  if (
    patterns.includes(
      "creative",
    )
  ) {
    return {
      metrics: [
        "결과물 품질",
        "완성 속도",
        "반응",
        "포트폴리오 가치",
      ],

      evidenceExamples: [
        "좋은 평가를 받은 결과물",
        "이전보다 완성도가 높아진 작업",
        "재의뢰나 추가 프로젝트로 이어진 경험",
      ],

      growthFocus: [
        "결과물 완성도",
        "차별화",
        "포트폴리오",
      ],
    };
  }

  if (
    patterns.includes(
      "technical",
    )
  ) {
    return {
      metrics: [
        "문제 해결 난이도",
        "정확도",
        "처리 속도",
        "기술 숙련도",
      ],

      evidenceExamples: [
        "어려운 문제를 해결한 사례",
        "반복 오류를 줄인 경험",
        "더 복잡한 업무를 맡게 된 경험",
      ],

      growthFocus: [
        "기술 깊이",
        "문제 해결력",
        "희소한 전문성",
      ],
    };
  }

  /*
   * 마지막으로 역할군 기준 기본값을 사용합니다.
   */

  if (
    primaryRole ===
    "sales"
  ) {
    return {
      metrics: [
        "신규 고객",
        "상담 수",
        "계약 전환율",
        "소개·재구매",
      ],

      evidenceExamples: [
        "계약률이 높은 고객군",
        "성과가 좋았던 상담 방식",
        "소개 고객이 발생한 사례",
      ],

      growthFocus: [
        "고객 이해",
        "전환율",
        "소개 구조",
      ],
    };
  }

  if (
    primaryRole ===
    "business"
  ) {
    return {
      metrics: [
        "매출",
        "실제 이익",
        "반복 매출",
        "고객 획득 비용",
      ],

      evidenceExamples: [
        "수익성이 높은 상품이나 고객군",
        "반복 구매가 발생한 사례",
        "비용을 줄이고 이익을 높인 경험",
      ],

      growthFocus: [
        "수익성",
        "반복 매출",
        "운영 구조",
      ],
    };
  }

  if (
    primaryRole ===
    "specialist"
  ) {
    return {
      metrics: [
        "전문 업무 난이도",
        "결과물 품질",
        "전문성 인정",
        "보상 수준",
      ],

      evidenceExamples: [
        "남보다 잘 해결한 문제",
        "전문성을 인정받은 사례",
        "더 높은 책임이나 보상으로 연결된 경험",
      ],

      growthFocus: [
        "전문성 깊이",
        "증명 가능한 사례",
        "시장가치",
      ],
    };
  }

  if (
    primaryRole ===
    "leadership"
  ) {
    return {
      metrics: [
        "팀 성과",
        "업무 완료율",
        "문제 해결 속도",
        "위임 가능한 업무 비중",
      ],

      evidenceExamples: [
        "팀 전체 성과가 좋아진 사례",
        "반복 문제를 구조적으로 해결한 경험",
        "팀원이 스스로 처리할 수 있게 만든 업무",
      ],

      growthFocus: [
        "의사결정",
        "위임",
        "팀 성과 구조",
      ],
    };
  }

  return {
    metrics: [
      "업무 정확도",
      "처리 속도",
      "성과",
      "책임 범위",
    ],

    evidenceExamples: [
      "이전보다 더 잘하게 된 업무",
      "좋은 평가를 받은 경험",
      "조직에서 더 큰 역할을 맡게 된 사례",
    ],

    growthFocus: [
      "업무 숙련도",
      "성과 증명",
      "역할 확대",
    ],
  };
}