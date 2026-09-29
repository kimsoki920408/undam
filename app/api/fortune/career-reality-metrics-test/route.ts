import {
  NextResponse,
} from "next/server";

import {
  buildCareerRealityMetrics,
} from "@/lib/fortune/build-career-reality-metrics";

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

  expectedMetrics:
    string[];

  forbiddenMetrics?:
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
      "신규 고객 상담, 보험 설계, 계약 체결, 기존 고객 관리",

    expectedMetrics: [
      "신규 고객",
      "상담 수",
      "계약 전환율",
    ],

    forbiddenMetrics: [
      "공정 준수",
      "환자 응대 품질",
    ],
  },

  {
    name:
      "공인중개사",

    jobTitle:
      "공인중개사",

    mainWork:
      "부동산 고객 상담, 매물 중개, 계약",

    expectedMetrics: [
      "상담 수",
      "계약 전환율",
      "거래 성사율",
    ],

    forbiddenMetrics: [
      "공정 준수",
      "환자 응대 품질",
    ],
  },

  {
    name:
      "공무원",

    jobTitle:
      "공무원",

    mainWork:
      "행정 업무, 민원 처리, 공공 서비스 지원",

    expectedMetrics: [
      "업무 처리 정확도",
      "처리 속도",
      "책임 범위",
    ],

    forbiddenMetrics: [
      "계약 전환율",
      "신규 고객",
    ],
  },

  {
    name:
      "직업군인",

    jobTitle:
      "직업군인",

    mainWork:
      "군 조직 근무, 훈련, 장비 관리, 현장 임무 수행",

    expectedMetrics: [
      "업무 처리 정확도",
      "책임 범위",
      "조직 내 역할 확대",
    ],

    forbiddenMetrics: [
      "계약 전환율",
      "반복 매출",
    ],
  },

  {
    name:
      "치위생사",

    jobTitle:
      "치위생사",

    mainWork:
      "치과 환자 진료 보조, 구강 관리, 환자 상담",

    expectedMetrics: [
      "업무 정확도",
      "환자 응대 품질",
      "숙련도",
    ],

    forbiddenMetrics: [
      "계약 전환율",
      "신규 고객",
    ],
  },

  {
    name:
      "물리치료사",

    jobTitle:
      "물리치료사",

    mainWork:
      "환자 재활 치료, 운동 지도, 치료 계획 수행",

    expectedMetrics: [
      "업무 정확도",
      "환자 응대 품질",
      "숙련도",
    ],

    forbiddenMetrics: [
      "계약 전환율",
      "반복 매출",
    ],
  },

  {
    name:
      "공인노무사",

    jobTitle:
      "공인노무사",

    mainWork:
      "노동법 상담, 노무 자문, 기업 인사 문제 해결",

    expectedMetrics: [
      "업무 정확도",
      "문제 해결 난이도",
      "전문 사례 수",
    ],

    forbiddenMetrics: [
      "계약 전환율",
      "공정 준수",
    ],
  },

  {
    name:
      "영상편집자",

    jobTitle:
      "영상편집자",

    mainWork:
      "영상 콘텐츠 편집, 후반 작업, 콘텐츠 제작",

    expectedMetrics: [
      "콘텐츠·캠페인 성과",
      "반응률",
      "프로젝트 완성도",
    ],

    forbiddenMetrics: [
      "환자 응대 품질",
      "공정 준수",
    ],
  },

  {
    name:
      "건설 현장소장",

    jobTitle:
      "건설 현장소장",

    mainWork:
      "현장 관리, 공정 관리, 작업자 관리, 일정 관리",

    expectedMetrics: [
      "공정 준수",
      "품질",
      "안전",
      "일정 관리",
    ],

    forbiddenMetrics: [
      "계약 전환율",
      "환자 응대 품질",
    ],
  },

  {
    name:
      "카페 사장",

    jobTitle:
      "카페 사장",

    mainWork:
      "카페 운영, 고객 관리, 메뉴 개발, 매출 관리",

    expectedMetrics: [
      "매출",
      "실제 이익",
      "반복 매출",
    ],

    forbiddenMetrics: [
      "공정 준수",
      "환자 응대 품질",
    ],
  },

  {
    name:
      "웹디자이너",

    jobTitle:
      "웹디자이너",

    mainWork:
      "웹 디자인, UI 제작, 시각 콘텐츠 디자인",

    expectedMetrics: [
      "결과물 품질",
      "완성 속도",
      "포트폴리오 가치",
    ],

    forbiddenMetrics: [
      "계약 전환율",
      "공정 준수",
    ],
  },

  {
    name:
      "객실승무원",

    jobTitle:
      "객실승무원",

    mainWork:
      "승객 서비스, 안전 관리, 고객 응대",

    expectedMetrics: [
      "업무 정확도",
      "처리 속도",
      "성과",
    ],

    forbiddenMetrics: [
      "계약 전환율",
      "반복 매출",
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

        const realityMetrics =
          buildCareerRealityMetrics(
            classification,
          );

        const missingMetrics =
          test.expectedMetrics.filter(
            (
              metric,
            ) =>
              !realityMetrics.metrics.includes(
                metric,
              ),
          );

        const unexpectedMetrics =
          (
            test.forbiddenMetrics ??
            []
          ).filter(
            (
              metric,
            ) =>
              realityMetrics.metrics.includes(
                metric,
              ),
          );

        const pass =
          missingMetrics.length ===
            0 &&
          unexpectedMetrics.length ===
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

            patterns:
              classification.patterns,

            confidence:
              classification.confidence,
          },

          actual: {
            metrics:
              realityMetrics.metrics,

            evidenceExamples:
              realityMetrics.evidenceExamples,

            growthFocus:
              realityMetrics.growthFocus,
          },

          checks: {
            missingMetrics,

            unexpectedMetrics,
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