import {
  NextResponse,
} from "next/server";

import {
  buildCurrentJobVerdict,
} from "@/lib/fortune/build-current-job-verdict";

import {
  createCareerContext,
} from "@/types/career-context";

import type {
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

  expectedMetrics:
    string[];

  forbiddenText:
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

    forbiddenText: [
      "환자 응대 품질",
      "공정 준수",
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

    forbiddenText: [
  "계약 전환율",
  "상담 수",
  "신규 고객",
  "소개·재구매",
  "반복 매출",
  "고객 획득 비용",
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

    forbiddenText: [
  "계약 전환율",
  "신규 고객",
  "소개·재구매",
  "반복 매출",
  "고객 획득 비용",
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

    forbiddenText: [
  "계약 전환율",
  "신규 고객",
  "환자 응대 품질",
  "반복 매출",
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
    ],

    forbiddenText: [
  "계약 전환율",
  "신규 고객",
  "환자 응대 품질",
  "소개·재구매",
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
              "neutral",

            primaryConcern:
              "income",

            concernDetail:
              "현재 수입을 더 높이고 싶음",

            wantsToStay:
              true,

            interests:
              [],
          });

        const result =
          buildCurrentJobVerdict(
            context,
            roleComparison,
          );

        const allText =
          [
            result.headline,
            result.decision,
            result.recommendedAction,
            ...result.reviewMetrics,
            ...result.reasons,
            ...result.keepIf,
            ...result.changeIf,
            result.nextQuestion,
          ].join(
            " ",
          );

        const missingMetrics =
          test.expectedMetrics.filter(
            (
              metric,
            ) =>
              !allText.includes(
                metric,
              ),
          );

        const forbiddenFound =
          test.forbiddenText.filter(
            (
              text,
            ) =>
              allText.includes(
                text,
              ),
          );

        const pass =
          missingMetrics.length ===
            0 &&
          forbiddenFound.length ===
            0;

        return {
          name:
            test.name,

          pass,

          actual: {
            headline:
              result.headline,

            decision:
              result.decision,

            reviewMetrics:
              result.reviewMetrics,

            reasons:
              result.reasons,

            nextQuestion:
              result.nextQuestion,
          },

          checks: {
            missingMetrics,

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
  return {
    id:
      role,

    title:
      roleLabels[
        role
      ],

    fit:
      "good",

    oneLine:
      "직업별 현실 문장 통합 테스트",

    why: [
      "현실 직업정보가 현재직업 판정 문장에 제대로 반영되는지 확인합니다.",
    ],

    goodWhen: [
      "현재 강점이 실제 결과로 이어질 때",
    ],

    cautionWhen: [
      "성과와 보상이 연결되지 않을 때",
    ],
  };
}