import {
  NextResponse,
} from "next/server";

import {
  buildCurrentJobVerdict,
} from "@/lib/fortune/build-current-job-verdict";

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

    expectedRole:
      "sales",
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

        /*
         * 테스트 핵심:
         *
         * 예상한 역할만 very-good,
         * 나머지 역할은 caution으로 만듭니다.
         *
         * 따라서 현재직업 판정기가
         * 잘못된 역할을 사용하면
         * verdict가 keep이 나오기 어렵습니다.
         */
        const roleComparison =
          createRoleComparison(
            test.expectedRole,
          );

        const classification =
          classifyCareerContext(
            context,
          );

        const verdict =
          buildCurrentJobVerdict(
            context,
            roleComparison,
          );

        const expectedLabel =
          roleLabels[
            test.expectedRole
          ];

        const rolePass =
          classification.primaryRole ===
          test.expectedRole;

        const verdictPass =
          verdict.verdict ===
          "keep";

        const reasonPass =
          verdict.reasons.some(
            (
              reason,
            ) =>
              reason.includes(
                expectedLabel,
              ),
          );

        const pass =
          rolePass &&
          verdictPass &&
          reasonPass;

        return {
          name:
            test.name,

          pass,

          expected: {
            role:
              test.expectedRole,

            label:
              expectedLabel,

            verdict:
              "keep",
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
            verdict:
              verdict.verdict,

            decision:
              verdict.decision,

            headline:
              verdict.headline,

            reasons:
              verdict.reasons,

            reviewMetrics:
              verdict.reviewMetrics,
          },

          checks: {
            rolePass,

            verdictPass,

            reasonPass,
          },
        };
      },
    );

  const failed =
    results.filter(
      (
        result,
      ) =>
        !result.pass,
    );

  return NextResponse.json({
    ok:
      failed.length ===
      0,

    summary: {
      total:
        results.length,

      passed:
        results.length -
        failed.length,

      failed:
        failed.length,

      passRate:
        `${Math.round(
          ((results.length -
            failed.length) /
            results.length) *
            100,
        )}%`,
    },

    failures:
      failed,

    results,
  });
}

function createRoleComparison(
  expectedRole:
    RoleKey,
) {
  return {
    employee:
      createRoleFit(
        "employee",
        expectedRole,
      ),

    specialist:
      createRoleFit(
        "specialist",
        expectedRole,
      ),

    sales:
      createRoleFit(
        "sales",
        expectedRole,
      ),

    business:
      createRoleFit(
        "business",
        expectedRole,
      ),

    leadership:
      createRoleFit(
        "leadership",
        expectedRole,
      ),
  };
}

function createRoleFit(
  role:
    RoleKey,

  expectedRole:
    RoleKey,
): CareerRoleFit {
  const fit:
    CareerFitLevel =
    role ===
      expectedRole
      ? "very-good"
      : "caution";

  return {
    id:
      role,

    title:
      roleLabels[
        role
      ],

    fit,

    oneLine:
      "통합 테스트용 역할입니다.",

    why: [
      "현재 직업 판정기가 올바른 역할을 선택하는지 확인합니다.",
    ],

    goodWhen: [
      "올바른 역할이 선택될 때",
    ],

    cautionWhen: [
      "다른 역할로 잘못 분류될 때",
    ],
  };
}