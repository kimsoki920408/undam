import {
  NextResponse,
} from "next/server";

import {
  buildCareerRecommendations,
} from "@/lib/fortune/build-career-recommendations";

import {
  createCareerContext,
} from "@/types/career-context";

import type {
  CareerRoleFit,
} from "@/types/career-fortune";

type TestCase = {
  name:
    string;

  jobTitle:
    string;

  mainWork:
    string;

  expectedTitles:
    string[];

  forbiddenTitles:
    string[];
};

function createRole(
  id:
    string,

  title:
    string,
): CareerRoleFit {
  return {
    id,

    title,

    fit:
      "good",

    oneLine:
      `${title} 기본 설명`,

    why: [
      `${title} 테스트 근거`,
    ],

    goodWhen: [
      `${title} 좋은 조건`,
    ],

    cautionWhen: [
      `${title} 주의 조건`,
    ],
  };
}

const roleComparison = {
  employee:
    createRole(
      "employee",
      "조직·운영형",
    ),

  specialist:
    createRole(
      "specialist",
      "전문가형",
    ),

  sales:
    createRole(
      "sales",
      "영업·사업개발형",
    ),

  business:
    createRole(
      "business",
      "창업·사업형",
    ),

  leadership:
    createRole(
      "leadership",
      "리더·관리형",
    ),
};

const testCases:
  TestCase[] = [
  {
    name:
      "보험설계사",

    jobTitle:
      "보험설계사",

    mainWork:
      "보험 상담, 보장 설계, 계약, 고객 관리",

    expectedTitles: [
      "보험설계사 · 현재 직업 발전형",
      "법인·B2B 영업",
      "보장·리스크 컨설팅",
      "고객 기반 독립·사업 확장",
    ],

    forbiddenTitles: [
      "B2B 영업·사업개발",
      "고객 컨설팅·관계관리형 역할",
    ],
  },

  {
    name:
      "공무원",

    jobTitle:
      "공무원",

    mainWork:
      "행정 업무, 민원 처리, 공공 서비스",

    expectedTitles: [
      "공무원 · 현재 직무 성장형",
      "정책·기획·전문 담당",
      "조정·관리 역할",
      "책임·관리 직무",
    ],

    forbiddenTitles: [
      "전문가형 직무 확장",
      "고객·시장 접점 역할",
    ],
  },

  {
    name:
      "치위생사",

    jobTitle:
      "치위생사",

    mainWork:
      "치과 진료 보조, 환자 관리, 구강 관리",

    expectedTitles: [
      "치위생사 · 전문성 강화",
      "전문 실무·임상 영역 강화",
      "교육·코디네이션·현장 리딩",
      "전문 관리·교육 역할",
    ],

    forbiddenTitles: [
      "전문 컨설팅·문제해결형 역할",
      "장기 후보 · 전문성 기반 독립",
    ],
  },

  {
    name:
      "영상편집자",

    jobTitle:
      "영상편집자",

    mainWork:
      "영상 콘텐츠 제작, 편집, 후반 작업",

    expectedTitles: [
      "영상편집자 · 전문성 강화",
      "콘텐츠 전략·전문 제작",
      "프로젝트·크리에이티브 리드",
      "브랜드·콘텐츠 기반 독립",
    ],

    forbiddenTitles: [
      "전문 컨설팅·문제해결형 역할",
      "프로젝트 리드·전문 리더",
    ],
  },

  {
    name:
      "공인중개사",

    jobTitle:
      "공인중개사",

    mainWork:
      "부동산 고객 상담, 매물 중개, 계약 체결",

    expectedTitles: [
      "공인중개사 · 현재 직업 발전형",
      "특정 부동산 분야 전문 중개",
      "부동산 분석·상담 강화",
      "중개 조직·사업 확장",
    ],

    forbiddenTitles: [
      "B2B 영업·사업개발",
      "고객 컨설팅·관계관리형 역할",
    ],
  },

  {
    name:
      "건설 현장소장",

    jobTitle:
      "건설 현장소장",

    mainWork:
      "공정 관리, 현장 관리, 작업자 관리, 일정 관리",

    expectedTitles: [
      "건설 현장소장 · 리더십 고도화",
      "공정·품질·안전 전문 역할",
      "프로젝트·현장 총괄",
      "대형 프로젝트 책임 역할",
    ],

    forbiddenTitles: [
      "프로젝트·사업 리딩",
      "사업개발·대외협력",
    ],
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
              36,

            satisfaction:
              "neutral",

            primaryConcern:
              "continue",

            concernDetail:
              null,

            wantsToStay:
              true,

            interests:
              [],
          });

        const recommendations =
          buildCareerRecommendations(
            context,
            roleComparison,
          );

        const actualTitles =
          recommendations.map(
            (
              recommendation,
            ) =>
              recommendation.title,
          );

        const missingTitles =
          test.expectedTitles.filter(
            (
              title,
            ) =>
              !actualTitles.includes(
                title,
              ),
          );

        const forbiddenFound =
          test.forbiddenTitles.filter(
            (
              title,
            ) =>
              actualTitles.includes(
                title,
              ),
          );

        const countPass =
          recommendations.length ===
          4;

        const orderPass =
          test.expectedTitles.every(
            (
              title,
              index,
            ) =>
              actualTitles[index] ===
              title,
          );

        const pass =
          countPass &&
          orderPass &&
          missingTitles.length ===
            0 &&
          forbiddenFound.length ===
            0;

        return {
          name:
            test.name,

          pass,

          actual: {
            titles:
              actualTitles,

            recommendations:
              recommendations.map(
                (
                  recommendation,
                ) => ({
                  id:
                    recommendation.id,

                  title:
                    recommendation.title,

                  fit:
                    recommendation.fit,

                  oneLine:
                    recommendation.oneLine,
                }),
              ),
          },

          checks: {
            countPass,

            orderPass,

            missingTitles,

            forbiddenFound,
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