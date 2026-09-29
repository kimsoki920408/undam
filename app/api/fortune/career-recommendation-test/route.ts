import {
  NextResponse,
} from "next/server";

import {
  buildCareerRecommendations,
} from "@/lib/fortune/build-career-recommendations";

import {
  classifyCareerContext,
} from "@/lib/fortune/classify-career-context";

import {
  createCareerContext,
} from "@/types/career-context";

import type {
  CareerFitLevel,
  CareerRoleFit,
} from "@/types/career-fortune";

type RoleKey =
  | "employee"
  | "specialist"
  | "sales"
  | "business"
  | "leadership";

type TestCase = {
  name:
    string;

  jobTitle:
    string;

  mainWork:
    string;

  expectedRole:
    RoleKey;

  expectedRecommendationIds:
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

const recommendationIds:
  Record<
    RoleKey,
    string[]
  > = {
  sales: [
    "current-sales-growth",
    "adjacent-b2b-sales",
    "adjacent-consulting",
    "longterm-sales-business",
  ],

  business: [
    "current-business-growth",
    "business-sales-growth",
    "business-operation",
    "business-leadership",
  ],

  specialist: [
    "current-specialist-growth",
    "adjacent-specialist-consulting",
    "adjacent-project-lead",
    "longterm-specialist-business",
  ],

  leadership: [
    "current-leadership-growth",
    "adjacent-project-leadership",
    "adjacent-business-development",
    "longterm-leadership-business",
  ],

  employee: [
    "current-employee-growth",
    "adjacent-employee-specialist",
    "adjacent-employee-leadership",
    "adjacent-market-role",
  ],
};

const testCases:
  TestCase[] = [
  {
    name:
      "보험설계사",

    jobTitle:
      "보험설계사",

    mainWork:
      "신규 고객 상담, 보험 설계, 계약 체결, 기존 고객 관리",

    expectedRole:
      "sales",

    expectedRecommendationIds:
      recommendationIds.sales,
  },

  {
    name:
      "공인중개사",

    jobTitle:
      "공인중개사",

    mainWork:
      "부동산 고객 상담, 매물 중개, 계약",

    expectedRole:
      "sales",

    expectedRecommendationIds:
      recommendationIds.sales,
  },

  {
    name:
      "사회복지사",

    jobTitle:
      "사회복지사",

    mainWork:
      "복지 대상자 상담, 사례 관리, 복지 서비스 연계",

    expectedRole:
      "specialist",

    expectedRecommendationIds:
      recommendationIds.specialist,
  },

  {
    name:
      "치위생사",

    jobTitle:
      "치위생사",

    mainWork:
      "치과 환자 진료 보조, 구강 관리, 환자 상담",

    expectedRole:
      "specialist",

    expectedRecommendationIds:
      recommendationIds.specialist,
  },

  {
    name:
      "공인노무사",

    jobTitle:
      "공인노무사",

    mainWork:
      "노동법 상담, 노무 자문, 기업 인사 문제 해결",

    expectedRole:
      "specialist",

    expectedRecommendationIds:
      recommendationIds.specialist,
  },

  {
    name:
      "공무원",

    jobTitle:
      "공무원",

    mainWork:
      "행정 업무, 민원 처리, 공공 서비스 지원",

    expectedRole:
      "employee",

    expectedRecommendationIds:
      recommendationIds.employee,
  },

  {
    name:
      "객실승무원",

    jobTitle:
      "객실승무원",

    mainWork:
      "승객 서비스, 안전 관리, 고객 응대",

    expectedRole:
      "employee",

    expectedRecommendationIds:
      recommendationIds.employee,
  },

  {
    name:
      "쇼핑몰 MD",

    jobTitle:
      "쇼핑몰 MD",

    mainWork:
      "상품 기획, 판매 데이터 분석, 프로모션 운영",

    expectedRole:
      "employee",

    expectedRecommendationIds:
      recommendationIds.employee,
  },

  {
    name:
      "직업군인",

    jobTitle:
      "직업군인",

    mainWork:
      "군 조직 근무, 훈련, 장비 관리, 현장 임무 수행",

    expectedRole:
      "employee",

    expectedRecommendationIds:
      recommendationIds.employee,
  },

  {
    name:
      "마케팅 팀장",

    jobTitle:
      "마케팅 팀장",

    mainWork:
      "마케팅 전략, 광고 기획, 팀 관리, 성과 관리",

    expectedRole:
      "leadership",

    expectedRecommendationIds:
      recommendationIds.leadership,
  },

  {
    name:
      "건설 현장소장",

    jobTitle:
      "건설 현장소장",

    mainWork:
      "현장 관리, 공정 관리, 작업자 관리, 일정 관리",

    expectedRole:
      "leadership",

    expectedRecommendationIds:
      recommendationIds.leadership,
  },

  {
    name:
      "카페 사장",

    jobTitle:
      "카페 사장",

    mainWork:
      "카페 운영, 고객 관리, 메뉴 개발, 매출 관리",

    expectedRole:
      "business",

    expectedRecommendationIds:
      recommendationIds.business,
  },

  {
    name:
      "식당 사장",

    jobTitle:
      "식당 사장",

    mainWork:
      "식당 운영, 직원 관리, 고객 관리, 매출 관리",

    expectedRole:
      "business",

    expectedRecommendationIds:
      recommendationIds.business,
  },
];

export async function GET() {
  if (
    process.env.NODE_ENV !==
    "development"
  ) {
    return NextResponse.json(
      {
        ok: false,
      },
      {
        status: 404,
      },
    );
  }

  const roleComparison =
    createRoleComparison();

  const results =
    testCases.map(
      (
        test,
      ) => {
        const context =
          createCareerContext({
            jobTitle:
              test.jobTitle,

            mainWork:
              test.mainWork,

            experienceMonths:
              24,

            satisfaction:
              null,

            primaryConcern:
              "continue",

            concernDetail:
              null,

            wantsToStay:
              null,

            interests:
              [],
          });

        const classification =
          classifyCareerContext(
            context,
          );

        const recommendations =
          buildCareerRecommendations(
            context,
            roleComparison,
          );

        const actualIds =
          recommendations.map(
            (
              recommendation,
            ) =>
              recommendation.id,
          );

        const rolePass =
          classification.primaryRole ===
          test.expectedRole;

        const firstRecommendationPass =
          actualIds[0] ===
          test
            .expectedRecommendationIds[0];

        const recommendationCountPass =
          actualIds.length ===
          test
            .expectedRecommendationIds
            .length;

        const recommendationIdsPass =
          test
            .expectedRecommendationIds
            .every(
              (
                id,
                index,
              ) =>
                actualIds[index] ===
                id,
            );

        const pass =
          rolePass &&
          firstRecommendationPass &&
          recommendationCountPass &&
          recommendationIdsPass;

        return {
          name:
            test.name,

          pass,

          expected: {
            role:
              test.expectedRole,

            recommendationIds:
              test
                .expectedRecommendationIds,
          },

          classification: {
            primaryRole:
              classification.primaryRole,

            domain:
              classification.domain,

            confidence:
              classification.confidence,
          },

          actual: {
            recommendationIds:
              actualIds,

            recommendationTitles:
              recommendations.map(
                (
                  recommendation,
                ) =>
                  recommendation.title,
              ),
          },

          checks: {
            rolePass,

            firstRecommendationPass,

            recommendationCountPass,

            recommendationIdsPass,
          },
        };
      },
    );

  const failures =
    results.filter(
      (
        result,
      ) =>
        !result.pass,
    );

  return NextResponse.json({
    ok:
      failures.length ===
      0,

    summary: {
      total:
        results.length,

      passed:
        results.length -
        failures.length,

      failed:
        failures.length,

      passRate:
        `${Math.round(
          ((results.length -
            failures.length) /
            results.length) *
            100,
        )}%`,
    },

    failures,

    results,
  });
}

function createRoleComparison() {
  return {
    employee:
      createRoleFit(
        "employee",
      ),

    specialist:
      createRoleFit(
        "specialist",
      ),

    sales:
      createRoleFit(
        "sales",
      ),

    business:
      createRoleFit(
        "business",
      ),

    leadership:
      createRoleFit(
        "leadership",
      ),
  };
}

function createRoleFit(
  role:
    RoleKey,
): CareerRoleFit {
  const fit:
    CareerFitLevel =
    "good";

  return {
    id:
      role,

    title:
      roleLabels[
        role
      ],

    fit,

    oneLine:
      "추천 경로 통합 테스트용 역할입니다.",

    why: [
      "공통 직업 분류 결과가 올바른 추천 경로로 연결되는지 확인합니다.",
    ],

    goodWhen: [
      "현재 역할에서 강점이 실제 성과로 이어질 때",
    ],

    cautionWhen: [
      "현재 역할과 실제 업무가 일치하지 않을 때",
    ],
  };
}