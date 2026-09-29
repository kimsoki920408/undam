import {
  NextResponse,
} from "next/server";

import {
  buildWakeUpCall,
  buildNinetyDayPlan,
} from "@/lib/fortune/build-career-detail";

import {
  classifyCareerContext,
} from "@/lib/fortune/classify-career-context";

import {
  createCareerContext,
} from "@/types/career-context";

import type {
  CareerSignals,
} from "@/lib/fortune/build-career-signals";

type RoleKey =
  | "employee"
  | "specialist"
  | "sales"
  | "business"
  | "leadership";

type Concern =
  | "continue"
  | "income";

type TestCase = {
  name:
    string;

  jobTitle:
    string;

  mainWork:
    string;

  concern:
    Concern;

  expectedRole:
    RoleKey;

  expectedFirst30Title:
    string;

  wakeMustInclude?:
    string[];

  wakeMustNotInclude?:
    string[];

  planMustNotInclude?:
    string[];
};

/*
 * 이 테스트에서는 사주 자체를 검증하는 것이 아니라
 * 직업 분류 결과가 Wake-up Call과 90일 계획에
 * 올바르게 전달되는지만 확인합니다.
 *
 * 따라서 두 함수가 실제 사용하는 최소 신호인
 * dayMaster.element만 준비합니다.
 */
const testSignals =
  {
    dayMaster: {
      element:
        "목",
    },
  } as CareerSignals;

const testCases:
  TestCase[] = [
  {
    name:
      "보험설계사 · 수입 고민",

    jobTitle:
      "보험설계사",

    mainWork:
      "신규 고객 상담, 보험 설계, 계약 체결, 기존 고객 관리",

    concern:
      "income",

    expectedRole:
      "sales",

    expectedFirst30Title:
      "첫 30일 — 수입이 막히는 지점을 숫자로 찾기",

    wakeMustInclude: [
      "잘되는 영업",
    ],
  },

  {
    name:
      "공인중개사 · 수입 고민",

    jobTitle:
      "공인중개사",

    mainWork:
      "부동산 고객 상담, 매물 중개, 계약",

    concern:
      "income",

    expectedRole:
      "sales",

    expectedFirst30Title:
      "첫 30일 — 수입이 막히는 지점을 숫자로 찾기",

    wakeMustInclude: [
      "잘되는 영업",
    ],
  },

  {
    name:
      "사회복지사 · 수입 고민",

    jobTitle:
      "사회복지사",

    mainWork:
      "복지 대상자 상담, 사례 관리, 복지 서비스 연계",

    concern:
      "income",

    expectedRole:
      "specialist",

    expectedFirst30Title:
      "첫 30일 — 현재 수입 구조를 분해하기",

    wakeMustNotInclude: [
      "잘되는 영업",
      "계약된 고객",
    ],

    planMustNotInclude: [
      "상담→계약",
      "신규 DB",
    ],
  },

  {
    name:
      "사회복지사 · 계속할지 고민",

    jobTitle:
      "사회복지사",

    mainWork:
      "복지 대상자 상담, 사례 관리, 복지 서비스 연계",

    concern:
      "continue",

    expectedRole:
      "specialist",

    expectedFirst30Title:
      "첫 30일 — 돈이 되는 전문성 하나를 고르기",

    wakeMustNotInclude: [
      "잘되는 영업",
    ],

    planMustNotInclude: [
      "상담→계약",
      "신규 DB",
    ],
  },

  {
    name:
      "치위생사 · 계속할지 고민",

    jobTitle:
      "치위생사",

    mainWork:
      "치과 환자 진료 보조, 구강 관리, 환자 상담",

    concern:
      "continue",

    expectedRole:
      "specialist",

    expectedFirst30Title:
      "첫 30일 — 돈이 되는 전문성 하나를 고르기",

    wakeMustNotInclude: [
      "잘되는 영업",
    ],

    planMustNotInclude: [
      "상담→계약",
      "신규 DB",
    ],
  },

  {
    name:
      "카페 사장 · 수입 고민",

    jobTitle:
      "카페 사장",

    mainWork:
      "카페 운영, 고객 관리, 메뉴 개발, 매출 관리",

    concern:
      "income",

    expectedRole:
      "business",

    expectedFirst30Title:
      "첫 30일 — 어디서 돈이 남는지 확인하기",

    wakeMustNotInclude: [
      "잘되는 영업",
    ],
  },

  {
    name:
      "쇼핑몰 MD · 수입 고민",

    jobTitle:
      "쇼핑몰 MD",

    mainWork:
      "상품 기획, 판매 데이터 분석, 프로모션 운영",

    concern:
      "income",

    expectedRole:
      "employee",

    expectedFirst30Title:
      "첫 30일 — 현재 수입 구조를 분해하기",

    planMustNotInclude: [
      "매출·비용·실제 남는 금액",
      "반복 매출 비중",
    ],
  },

  {
    name:
      "객실승무원 · 계속할지 고민",

    jobTitle:
      "객실승무원",

    mainWork:
      "승객 서비스, 안전 관리, 고객 응대",

    concern:
      "continue",

    expectedRole:
      "employee",

    expectedFirst30Title:
  "첫 30일 — 반복 업무 속에서 내 경력 자산 찾기",

    wakeMustNotInclude: [
      "잘되는 영업",
    ],

    planMustNotInclude: [
      "상담→계약",
      "신규 DB",
    ],
  },
  {
    name:
      "공무원 · 계속할지 고민",

    jobTitle:
      "공무원",

    mainWork:
      "행정 업무, 민원 처리, 공공 서비스 지원",

    concern:
      "continue",

    expectedRole:
      "employee",

    expectedFirst30Title:
      "첫 30일 — 반복 업무 속에서 내 경력 자산 찾기",

    wakeMustNotInclude: [
      "잘되는 영업",
    ],

    planMustNotInclude: [
      "상담→계약",
      "신규 DB",
      "돈이 되는 전문성 하나",
    ],
  },

  {
    name:
      "직업군인 · 계속할지 고민",

    jobTitle:
      "직업군인",

    mainWork:
      "군 조직 근무, 훈련, 장비 관리, 현장 임무 수행",

    concern:
      "continue",

    expectedRole:
      "employee",

    expectedFirst30Title:
      "첫 30일 — 반복 업무 속에서 내 경력 자산 찾기",

    wakeMustNotInclude: [
      "잘되는 영업",
    ],

    planMustNotInclude: [
      "상담→계약",
      "신규 DB",
    ],
  },

  {
    name:
      "마케팅 팀장 · 계속할지 고민",

    jobTitle:
      "마케팅 팀장",

    mainWork:
      "마케팅 전략, 광고 기획, 팀 관리, 성과 관리",

    concern:
      "continue",

    expectedRole:
      "leadership",

    expectedFirst30Title:
      "첫 30일 — 내가 직접 하는 일과 맡겨야 할 일을 구분하기",

    wakeMustNotInclude: [
      "잘되는 영업",
    ],

    planMustNotInclude: [
      "상담→계약",
      "신규 DB",
      "돈이 되는 전문성 하나",
    ],
  },

  {
    name:
      "건설 현장소장 · 계속할지 고민",

    jobTitle:
      "건설 현장소장",

    mainWork:
      "현장 관리, 공정 관리, 작업자 관리, 일정 관리",

    concern:
      "continue",

    expectedRole:
      "leadership",

    expectedFirst30Title:
      "첫 30일 — 내가 직접 하는 일과 맡겨야 할 일을 구분하기",

    wakeMustNotInclude: [
      "잘되는 영업",
    ],

    planMustNotInclude: [
      "상담→계약",
      "신규 DB",
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
              test.concern,

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

        const wakeUpCall =
          buildWakeUpCall(
            testSignals,
            [],
            context,
          );

        const ninetyDayPlan =
          buildNinetyDayPlan(
            testSignals,
            context,
          );

        const wakeText =
          [
            wakeUpCall.headline,
            ...wakeUpCall.message,
            ...wakeUpCall.stopDoing,
            ...wakeUpCall.startDoing,
          ].join(
            " ",
          );

        const planText =
          JSON.stringify(
            ninetyDayPlan,
          );

        const rolePass =
          classification.primaryRole ===
          test.expectedRole;

        const first30TitlePass =
          ninetyDayPlan
            .first30Days
            .title ===
          test.expectedFirst30Title;

        const wakeRequiredPass =
          (
            test.wakeMustInclude ??
            []
          ).every(
            (
              text,
            ) =>
              wakeText.includes(
                text,
              ),
          );

        const wakeForbiddenPass =
          (
            test.wakeMustNotInclude ??
            []
          ).every(
            (
              text,
            ) =>
              !wakeText.includes(
                text,
              ),
          );

        const planForbiddenPass =
          (
            test.planMustNotInclude ??
            []
          ).every(
            (
              text,
            ) =>
              !planText.includes(
                text,
              ),
          );

        const pass =
          rolePass &&
          first30TitlePass &&
          wakeRequiredPass &&
          wakeForbiddenPass &&
          planForbiddenPass;

        return {
          name:
            test.name,

          pass,

          expected: {
            role:
              test.expectedRole,

            first30Title:
              test.expectedFirst30Title,
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
            wakeHeadline:
              wakeUpCall.headline,

            first30Title:
              ninetyDayPlan
                .first30Days
                .title,

            first30Actions:
              ninetyDayPlan
                .first30Days
                .actions,
          },

          checks: {
            rolePass,

            first30TitlePass,

            wakeRequiredPass,

            wakeForbiddenPass,

            planForbiddenPass,
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