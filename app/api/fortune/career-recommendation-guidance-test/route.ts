import {
  NextResponse,
} from "next/server";

import {
  buildCareerRecommendationGuidance,
} from "@/lib/fortune/build-career-recommendation-guidance";

import {
  classifyCareerContext,
} from "@/lib/fortune/classify-career-context";

import {
  createCareerContext,
} from "@/types/career-context";

type TestCase = {
  name:
    string;

  jobTitle:
    string;

  mainWork:
    string;

  expectedDomain:
    string;

  expectedTitles:
    string[];

  forbiddenTitles?:
    string[];
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

    expectedDomain:
      "finance-insurance",

    expectedTitles: [
      "법인·B2B 영업",
      "보장·리스크 컨설팅",
      "고객 기반 독립·사업 확장",
    ],

    forbiddenTitles: [
      "전문 실무·임상 영역 강화",
      "공정·품질·안전 전문 역할",
    ],
  },

  {
    name:
      "치위생사",

    jobTitle:
      "치위생사",

    mainWork:
      "치과 진료 보조, 환자 관리, 구강 관리",

    expectedDomain:
      "healthcare",

    expectedTitles: [
      "전문 실무·임상 영역 강화",
      "교육·코디네이션·현장 리딩",
      "전문 관리·교육 역할",
    ],

    forbiddenTitles: [
      "법인·B2B 영업",
      "부동산 분석·상담 강화",
    ],
  },

  {
    name:
      "공무원",

    jobTitle:
      "공무원",

    mainWork:
      "행정 업무, 민원 처리, 공공 서비스",

    expectedDomain:
      "public-admin",

    expectedTitles: [
      "정책·기획·전문 담당",
      "조정·관리 역할",
      "책임·관리 직무",
    ],

    forbiddenTitles: [
      "고객·시장 접점 역할",
      "고객 기반 독립·사업 확장",
    ],
  },

  {
    name:
      "영상편집자",

    jobTitle:
      "영상편집자",

    mainWork:
      "영상 콘텐츠 제작, 편집, 후반 작업",

    expectedDomain:
      "marketing-media",

    expectedTitles: [
      "콘텐츠 전략·전문 제작",
      "프로젝트·크리에이티브 리드",
      "브랜드·콘텐츠 기반 독립",
    ],

    forbiddenTitles: [
      "전문 실무·임상 영역 강화",
      "공정·품질·안전 전문 역할",
    ],
  },

  {
    name:
      "공인노무사",

    jobTitle:
      "공인노무사",

    mainWork:
      "노동법 상담, 노무 자문, 기업 문제 해결",

    expectedDomain:
      "legal-accounting",

    expectedTitles: [
      "전문 자문·고난도 업무",
      "검토·책임자 역할",
      "전문성 기반 독립",
    ],

    forbiddenTitles: [
      "고객·시장 접점 역할",
      "전문 실무·임상 영역 강화",
    ],
  },

  {
    name:
      "공인중개사",

    jobTitle:
      "공인중개사",

    mainWork:
      "부동산 고객 상담, 매물 중개, 계약 체결",

    expectedDomain:
      "construction-realestate",

    expectedTitles: [
      "특정 부동산 분야 전문 중개",
      "부동산 분석·상담 강화",
      "중개 조직·사업 확장",
    ],

    forbiddenTitles: [
      "공정·품질·안전 전문 역할",
      "프로젝트·현장 총괄",
    ],
  },

  {
    name:
      "건설 현장소장",

    jobTitle:
      "건설 현장소장",

    mainWork:
      "공정 관리, 현장 관리, 작업자 관리, 일정 관리",

    expectedDomain:
      "construction-realestate",

    expectedTitles: [
      "공정·품질·안전 전문 역할",
      "프로젝트·현장 총괄",
      "대형 프로젝트 책임 역할",
    ],

    forbiddenTitles: [
      "특정 부동산 분야 전문 중개",
      "부동산 분석·상담 강화",
    ],
  },

  {
    name:
      "배달기사",

    jobTitle:
      "배달기사",

    mainWork:
      "배달 운송, 시간 관리, 이동 경로 관리",

    expectedDomain:
      "logistics-transport",

    expectedTitles: [
      "물류·운송 운영 전문",
      "현장·운영 관리",
      "운영 책임자",
    ],

    forbiddenTitles: [
      "브랜드·콘텐츠 기반 독립",
      "전문 실무·임상 영역 강화",
    ],
  },

  {
    name:
      "생산직",

    jobTitle:
      "생산직",

    mainWork:
      "생산라인 작업, 품질 확인, 설비 관리",

    expectedDomain:
      "manufacturing",

    expectedTitles: [
      "품질·공정 전문",
      "생산·현장 관리",
      "생산 운영 책임",
    ],

    forbiddenTitles: [
      "고객 기반 독립·사업 확장",
      "부동산 분석·상담 강화",
    ],
  },

  {
    name:
      "인사팀장",

    jobTitle:
      "인사팀장",

    mainWork:
      "채용, 인사 운영, 조직관리, 팀 관리",

    expectedDomain:
      "hr",

    expectedTitles: [
      "채용·보상·조직개발 전문",
      "HR 기획·조직 리딩",
      "조직·인사 책임자",
    ],

    forbiddenTitles: [
      "고객·시장 접점 역할",
      "전문 실무·임상 영역 강화",
    ],
  },

  {
    name:
      "요리사",

    jobTitle:
      "요리사",

    mainWork:
      "조리, 메뉴 개발, 주방 운영",

    expectedDomain:
      "retail-food",

    expectedTitles: [
      "전문 기술·서비스 강화",
      "교육·운영 관리",
      "전문성 기반 매장·브랜드 운영",
    ],

    forbiddenTitles: [
      "정책·기획·전문 담당",
      "공정·품질·안전 전문 역할",
    ],
  },

  {
    name:
      "미용사",

    jobTitle:
      "미용사",

    mainWork:
      "고객 상담, 헤어 시술, 고객 관리",

    expectedDomain:
      "beauty-service",

    expectedTitles: [
      "전문 기술·서비스 강화",
      "교육·운영 관리",
      "전문성 기반 매장·브랜드 운영",
    ],

    forbiddenTitles: [
      "정책·기획·전문 담당",
      "물류·운송 운영 전문",
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

        const classification =
          classifyCareerContext(
            context,
          );

        const guidance =
          buildCareerRecommendationGuidance(
            classification,
          );

        const actualTitles = [
          ...guidance.adjacentPaths.map(
            (
              path,
            ) =>
              path.title,
          ),

          guidance.longTermPath.title,
        ];

        const domainPass =
          classification.domain ===
          test.expectedDomain;

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
          (
            test.forbiddenTitles ??
            []
          ).filter(
            (
              title,
            ) =>
              actualTitles.includes(
                title,
              ),
          );

        const pass =
          domainPass &&
          missingTitles.length ===
            0 &&
          forbiddenFound.length ===
            0;

        return {
          name:
            test.name,

          pass,

          classification: {
            primaryRole:
              classification.primaryRole,

            domain:
              classification.domain,

            confidence:
              classification.confidence,
          },

          actual: {
            currentFocus:
              guidance.currentFocus,

            adjacentPaths:
              guidance.adjacentPaths,

            longTermPath:
              guidance.longTermPath,
          },

          checks: {
            domainPass,

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