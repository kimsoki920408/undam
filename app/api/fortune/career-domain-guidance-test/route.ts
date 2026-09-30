import {
  NextResponse,
} from "next/server";

import {
  buildCareerDomainGuidance,
} from "@/lib/fortune/build-career-domain-guidance";

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

  expectedText:
    string[];

  forbiddenText?:
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

    expectedText: [
      "신뢰",
      "상담의 질",
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

    expectedText: [
      "정확성",
      "숙련도",
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

    expectedText: [
      "정확한 처리",
      "책임",
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

    expectedText: [
      "콘텐츠",
      "시장 반응",
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

    expectedText: [
      "전문 지식",
      "복잡한 문제",
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

    expectedText: [
      "시간",
      "운영 효율",
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

  expectedText: [
    "공정·품질·안전",
    "인력 관리",
  ],

  forbiddenText: [
    "고객의 조건과 매물",
    "거래 성사율",
    "소개·재거래",
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

  expectedText: [
    "고객의 조건과 매물",
    "거래 성사율",
    "소개·재거래",
  ],

  forbiddenText: [
    "공정·품질·안전",
    "인력 관리",
    "현장 판단",
  ],
},

  {
    name:
      "일반 회사원",

    jobTitle:
      "회사원",

    mainWork:
      "사내 업무 지원과 일반 사무",

    expectedDomain:
      "general",

    expectedText: [
      "실제로 어떤 문제",
      "경력 강점",
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
          buildCareerDomainGuidance(
            classification,
          );

        const allText =
          [
            guidance.workMeaning,
            ...guidance.successEvidence,
            guidance.risk,
            guidance.nextFocus,
          ].join(
            " ",
          );

        const domainPass =
          classification.domain ===
          test.expectedDomain;

        const missingText =
          test.expectedText.filter(
            (
              keyword,
            ) =>
              !allText.includes(
                keyword,
              ),
          );

          const forbiddenFound =
  (
    test.forbiddenText ??
    []
  ).filter(
    (
      keyword,
    ) =>
      allText.includes(
        keyword,
      ),
  );

        const pass =
  domainPass &&
  missingText.length ===
    0 &&
  forbiddenFound.length ===
    0;

        return {
          name:
            test.name,

          pass,

          expected: {
            domain:
              test.expectedDomain,
          },

          actual: {
            domain:
              classification.domain,

            workMeaning:
              guidance.workMeaning,

            risk:
              guidance.risk,

            nextFocus:
              guidance.nextFocus,
          },

          checks: {
            domainPass,

            missingText,

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