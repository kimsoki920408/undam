import {
  NextResponse,
} from "next/server";

import {
  classifyCareerContext,
} from "@/lib/fortune/classify-career-context";

import {
  createCareerContext,
} from "@/types/career-context";

import type {
  CareerWorkPattern,
} from "@/lib/fortune/classify-career-context";

type TestCase = {
  name:
    string;

  jobTitle:
    string;

  mainWork:
    string;

  expectedPrimaryRole:
    | "employee"
    | "specialist"
    | "sales"
    | "business"
    | "leadership"
    | null;

  expectedDomain:
    string;

  expectedPatterns?:
    CareerWorkPattern[];

  forbiddenPatterns?:
    CareerWorkPattern[];
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

    expectedPrimaryRole:
      "sales",

    expectedDomain:
      "finance-insurance",

    expectedPatterns: [
      "client-facing",
      "consulting",
      "regulated",
    ],
    forbiddenPatterns: [
  "technical",
  "entrepreneurial",
],
  },

  {
    name:
      "자동차 영업사원",

    jobTitle:
      "자동차 영업",

    mainWork:
      "고객 상담, 차량 제안, 계약, 출고 고객 관리",

    expectedPrimaryRole:
      "sales",

    expectedDomain:
      "general",

    expectedPatterns: [
      "client-facing",
      "performance-based",
    ],
  },

  {
    name:
      "B2B 세일즈",

    jobTitle:
      "B2B 세일즈",

    mainWork:
      "기업 고객 발굴, 제안서 작성, 계약 협상, 거래처 관리",

    expectedPrimaryRole:
      "sales",

    expectedDomain:
      "general",

    expectedPatterns: [
      "client-facing",
      "consulting",
    ],
  },

  {
    name:
      "프론트엔드 개발자",

    jobTitle:
      "프론트엔드 개발자",

    mainWork:
      "웹 서비스 개발, UI 구현, 프로젝트 협업",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "tech",

    expectedPatterns: [
      "technical",
      "project-based",
    ],

    forbiddenPatterns: [
  "entrepreneurial",
  "performance-based",
],
  },

  {
    name:
      "간호사",

    jobTitle:
      "간호사",

    mainWork:
      "병원에서 환자 간호, 의료진 협업, 환자 상태 관리",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "healthcare",

    expectedPatterns: [
      "care",
      "regulated",
    ],
  },

  {
    name:
      "초등학교 교사",

    jobTitle:
      "초등학교 교사",

    mainWork:
      "학생 교육, 수업 준비, 학부모 상담",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "education",

    expectedPatterns: [
      "client-facing",
    ],
  },

  {
    name:
      "카페 사장",

    jobTitle:
      "카페 사장",

    mainWork:
      "카페 운영, 고객 관리, 메뉴 개발, 매출 관리",

    expectedPrimaryRole:
      "business",

    expectedDomain:
      "retail-food",

    expectedPatterns: [
      "entrepreneurial",
      "operations",
    ],

    forbiddenPatterns: [
  "technical",
  "project-based",
],
  },

  {
    name:
      "공무원",

    jobTitle:
      "공무원",

    mainWork:
      "행정 업무, 민원 처리, 공공 서비스 지원",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "public-admin",

    expectedPatterns: [
      "regulated",
      "operations",
    ],

    forbiddenPatterns: [
  "technical",
  "entrepreneurial",
  "performance-based",
],
  },

  {
    name:
      "마케팅 팀장",

    jobTitle:
      "마케팅 팀장",

    mainWork:
      "마케팅 전략, 팀 관리, 광고 기획, 성과 관리",

    expectedPrimaryRole:
      "leadership",

    expectedDomain:
      "marketing-media",

    expectedPatterns: [
      "people-management",
      "creative",
    ],
  },

  {
    name:
      "건설 현장소장",

    jobTitle:
      "건설 현장소장",

    mainWork:
      "건설 현장 관리, 공정 관리, 작업자 관리, 일정 관리",

    expectedPrimaryRole:
      "leadership",

    expectedDomain:
      "construction-realestate",

    expectedPatterns: [
      "people-management",
      "field-work",
    ],
  },

  {
    name:
      "택배기사",

    jobTitle:
      "택배기사",

    mainWork:
      "물류 배송, 고객 물품 전달, 배송 일정 관리",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "logistics-transport",

    expectedPatterns: [
      "field-work",
    ],
  },

  {
    name:
      "요리사",

    jobTitle:
      "요리사",

    mainWork:
      "음식 조리, 메뉴 개발, 주방 운영",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "retail-food",

    expectedPatterns: [
      "technical",
    ],
  },

  {
    name:
      "미용사",

    jobTitle:
      "미용사",

    mainWork:
      "고객 헤어 상담, 시술, 고객 관리",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "beauty-service",

    expectedPatterns: [
      "technical",
      "client-facing",
    ],
  },

  {
    name:
      "회계사",

    jobTitle:
      "회계사",

    mainWork:
      "기업 회계, 재무 분석, 회계 감사",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "legal-accounting",

    expectedPatterns: [
      "technical",
      "regulated",
    ],
  },

  {
    name:
      "공인중개사",

    jobTitle:
      "공인중개사",

    mainWork:
      "부동산 고객 상담, 매물 중개, 계약",

    expectedPrimaryRole:
      "sales",

    expectedDomain:
      "construction-realestate",

    expectedPatterns: [
      "client-facing",
      "consulting",
    ],
  },

  {
    name:
      "인사팀장",

    jobTitle:
      "인사 팀장",

    mainWork:
      "채용, 평가, 조직관리, 팀 관리",

    expectedPrimaryRole:
      "leadership",

    expectedDomain:
      "hr",

    expectedPatterns: [
      "people-management",
      "operations",
    ],
  },

  {
    name:
      "생산직",

    jobTitle:
      "생산직",

    mainWork:
      "공장 생산, 제조 공정, 품질 확인",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "manufacturing",

    expectedPatterns: [
      "field-work",
      "operations",
    ],

    forbiddenPatterns: [
  "creative",
  "consulting",
  "entrepreneurial",
],
  },

  {
    name:
      "UX 디자이너",

    jobTitle:
      "UX 디자이너",

    mainWork:
      "서비스 디자인, 사용자 분석, UI 기획",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "general",

    expectedPatterns: [
      "creative",
      "technical",
    ],
  },

  {
    name:
      "연구원",

    jobTitle:
      "연구원",

    mainWork:
      "연구, 데이터 분석, 실험, 보고서 작성",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "general",

    expectedPatterns: [
      "technical",
    ],
  },

  {
    name:
      "약사",

    jobTitle:
      "약사",

    mainWork:
      "약국 근무, 환자 복약 상담, 의약품 관리",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "healthcare",

    expectedPatterns: [
      "regulated",
      "client-facing",
    ],
  },

  {
    name:
      "식당 사장",

    jobTitle:
      "식당 사장",

    mainWork:
      "음식점 운영, 매출 관리, 직원 관리, 고객 관리",

    expectedPrimaryRole:
      "business",

    expectedDomain:
      "retail-food",

    expectedPatterns: [
      "entrepreneurial",
      "operations",
    ],
  },

  {
    name:
      "건축사",

    jobTitle:
      "건축사",

    mainWork:
      "건축 설계, 프로젝트 관리, 고객 협의",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "construction-realestate",

    expectedPatterns: [
      "technical",
      "project-based",
    ],
  },

  {
    name:
      "공기업 행정직",

    jobTitle:
      "공기업 행정직",

    mainWork:
      "행정, 기획 지원, 공공 업무",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "public-admin",

    expectedPatterns: [
      "operations",
      "regulated",
    ],

    forbiddenPatterns: [
  "creative",
  "technical",
  "entrepreneurial",
],
  },

  /*
   * 여기부터는 일부러 현재 분류기가
   * 놓칠 가능성이 있는 직업도 테스트합니다.
   */

  {
    name:
      "경찰관",

    jobTitle:
      "경찰관",

    mainWork:
      "치안 유지, 현장 출동, 민원 대응",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "public-admin",

    expectedPatterns: [
      "field-work",
      "regulated",
    ],

    forbiddenPatterns: [
  "technical",
  "entrepreneurial",
  "creative",
],
  },

  {
    name:
      "소방관",

    jobTitle:
      "소방관",

    mainWork:
      "화재 진압, 구조, 구급, 현장 출동",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "public-admin",

    expectedPatterns: [
      "field-work",
      "regulated",
    ],
  },

  {
    name:
      "기자",

    jobTitle:
      "기자",

    mainWork:
      "취재, 인터뷰, 기사 작성, 뉴스 콘텐츠 제작",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "marketing-media",

    expectedPatterns: [
      "creative",
    ],

    forbiddenPatterns: [
  "technical",
  "operations",
  "entrepreneurial",
],
  },

  {
    name:
      "사진작가",

    jobTitle:
      "사진작가",

    mainWork:
      "사진 촬영, 편집, 콘텐츠 제작, 고객 프로젝트",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "marketing-media",

    expectedPatterns: [
      "creative",
      "project-based",
    ],
  },

  {
    name:
      "상담심리사",

    jobTitle:
      "상담심리사",

    mainWork:
      "내담자 상담, 심리 상담, 상담 기록",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "general",

    expectedPatterns: [
      "consulting",
      "client-facing",
    ],

    forbiddenPatterns: [
  "performance-based",
  "entrepreneurial",
],
  },

  {
    name:
      "미용실 점장",

    jobTitle:
      "미용실 점장",

    mainWork:
      "직원 관리, 고객 관리, 매장 운영, 헤어 서비스",

    expectedPrimaryRole:
      "leadership",

    expectedDomain:
      "beauty-service",

    expectedPatterns: [
      "people-management",
      "operations",
      "client-facing",
    ],
  },

    {
    name:
      "치위생사",

    jobTitle:
      "치위생사",

    mainWork:
      "치과 환자 진료 보조, 구강 관리, 환자 상담",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "healthcare",

    expectedPatterns: [
      "client-facing",
      "care",
      "regulated",
    ],

    forbiddenPatterns: [
      "sales",
    ] as never,
  },

  {
    name:
      "물리치료사",

    jobTitle:
      "물리치료사",

    mainWork:
      "환자 상태 평가, 재활 치료, 치료 계획 관리",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "healthcare",

    expectedPatterns: [
      "technical",
      "care",
      "regulated",
    ],
  },

  {
    name:
      "사회복지사",

    jobTitle:
      "사회복지사",

    mainWork:
      "복지 대상자 상담, 사례 관리, 복지 서비스 연계",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "general",

    expectedPatterns: [
      "client-facing",
      "consulting",
    ],

    forbiddenPatterns: [
      "performance-based",
      "entrepreneurial",
    ],
  },

  {
    name:
      "보육교사",

    jobTitle:
      "보육교사",

    mainWork:
      "영유아 교육, 보육, 학부모 상담",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "education",

    expectedPatterns: [
      "client-facing",
      "care",
    ],
  },

  {
    name:
      "노무사",

    jobTitle:
      "공인노무사",

    mainWork:
      "노동법 상담, 노무 자문, 기업 인사 문제 해결",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "legal-accounting",

    expectedPatterns: [
      "consulting",
      "regulated",
    ],
  },

  {
    name:
      "경리",

    jobTitle:
      "경리",

    mainWork:
      "회계 처리, 비용 정산, 급여 및 세금 관련 사무",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "legal-accounting",

    expectedPatterns: [
      "operations",
      "regulated",
    ],

    forbiddenPatterns: [
      "entrepreneurial",
    ],
  },

  {
    name:
      "웹디자이너",

    jobTitle:
      "웹디자이너",

    mainWork:
      "웹사이트 UI 디자인, 콘텐츠 디자인, 서비스 화면 제작",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "general",

    expectedPatterns: [
      "technical",
      "creative",
    ],
  },

  {
    name:
      "영상편집자",

    jobTitle:
      "영상편집자",

    mainWork:
      "영상 편집, 콘텐츠 제작, 촬영 영상 후반 작업",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "marketing-media",

    expectedPatterns: [
      "creative",
    ],

    forbiddenPatterns: [
      "sales",
      "entrepreneurial",
    ] as never,
  },

  {
    name:
      "쇼핑몰 MD",

    jobTitle:
      "쇼핑몰 MD",

    mainWork:
      "온라인 상품 기획, 판매 데이터 분석, 프로모션 운영",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "general",

    expectedPatterns: [
      "operations",
    ],

    forbiddenPatterns: [
      "entrepreneurial",
    ],
  },

  {
    name:
      "호텔리어",

    jobTitle:
      "호텔리어",

    mainWork:
      "호텔 고객 응대, 객실 운영, 예약 관리",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "general",

    expectedPatterns: [
      "client-facing",
      "operations",
    ],

    forbiddenPatterns: [
      "sales",
    ] as never,
  },

    {
    name:
      "객실승무원",

    jobTitle:
      "객실승무원",

    mainWork:
      "항공기 승객 서비스, 안전 관리, 고객 응대",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "general",

    expectedPatterns: [
      "client-facing",
    ],
  },

  {
    name:
      "배달기사",

    jobTitle:
      "배달기사",

    mainWork:
      "음식 배달, 배송 경로 이동, 고객에게 주문 전달",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "logistics-transport",

    expectedPatterns: [
      "field-work",
    ],

    forbiddenPatterns: [
      "sales",
    ] as never,
  },

  {
    name:
      "전기기사",

    jobTitle:
      "전기기사",

    mainWork:
      "전기 설비 점검, 기술 유지보수, 현장 작업",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "general",

    expectedPatterns: [
      "technical",
      "field-work",
    ],
  },

  {
    name:
      "용접공",

    jobTitle:
      "용접공",

    mainWork:
      "금속 용접, 설비 제작, 현장 기술 작업",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "manufacturing",

    expectedPatterns: [
      "technical",
      "field-work",
    ],

    forbiddenPatterns: [
      "sales",
      "consulting",
    ] as never,
  },

  {
    name:
      "헬스 트레이너",

    jobTitle:
      "헬스 트레이너",

    mainWork:
      "회원 운동 지도, 체형 상담, 운동 프로그램 설계",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "general",

    expectedPatterns: [
      "client-facing",
      "consulting",
    ],
  },

  {
    name:
      "데이터 분석가",

    jobTitle:
      "데이터 분석가",

    mainWork:
      "데이터 분석, 지표 설계, 서비스 데이터 해석",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "tech",

    expectedPatterns: [
      "technical",
    ],
  },

  {
    name:
      "프리랜서 디자이너",

    jobTitle:
      "프리랜서 디자이너",

    mainWork:
      "고객 프로젝트 디자인, 브랜드 작업, 디자인 납품",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "general",

    expectedPatterns: [
      "client-facing",
      "technical",
      "creative",
      "project-based",
    ],
  },

  {
    name:
      "학원 강사",

    jobTitle:
      "학원 강사",

    mainWork:
      "학생 수업, 교육 콘텐츠 준비, 학부모 상담",

    expectedPrimaryRole:
      "specialist",

    expectedDomain:
      "education",

    expectedPatterns: [
      "client-facing",
    ],
  },

  {
    name:
      "편의점 점장",

    jobTitle:
      "편의점 점장",

    mainWork:
      "매장 운영, 직원 관리, 재고 관리, 고객 응대",

    expectedPrimaryRole:
      "leadership",

    expectedDomain:
      "retail-food",

    expectedPatterns: [
      "client-facing",
      "operations",
      "people-management",
    ],
  },

  {
    name:
      "군인",

    jobTitle:
      "직업군인",

    mainWork:
      "군 조직 근무, 훈련, 장비 관리, 현장 임무 수행",

    expectedPrimaryRole:
      "employee",

    expectedDomain:
      "public-admin",

    expectedPatterns: [
      "field-work",
      "regulated",
    ],

    forbiddenPatterns: [
      "sales",
      "entrepreneurial",
    ] as never,
  },
];

export async function GET() {
  /*
   * 운영 서버에서는
   * 내부 테스트 API를 공개하지 않습니다.
   */
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
              null,

            interests:
              [],
          });

        const actual =
          classifyCareerContext(
            context,
          );

        const rolePass =
          actual.primaryRole ===
          test.expectedPrimaryRole;

        const domainPass =
          actual.domain ===
          test.expectedDomain;

        const missingPatterns =
          (
            test.expectedPatterns ??
            []
          ).filter(
            (
              pattern,
            ) =>
              !actual.patterns.includes(
                pattern,
              ),
          );

        const unexpectedPatterns =
  (
    test.forbiddenPatterns ??
    []
  ).filter(
    (
      pattern,
    ) =>
      actual.patterns.includes(
        pattern,
      ),
  );

const patternPass =
  missingPatterns.length ===
    0 &&
  unexpectedPatterns.length ===
    0;

const pass =
  rolePass &&
  domainPass &&
  patternPass;

        return {
          name:
            test.name,

          pass,

          expected: {
            primaryRole:
              test.expectedPrimaryRole,

            domain:
              test.expectedDomain,

            patterns:
              test.expectedPatterns ??
              [],

              forbiddenPatterns:
  test.forbiddenPatterns ??
  [],
          },

          actual,

          checks: {
            rolePass,

            domainPass,

            patternPass,

            missingPatterns,

            unexpectedPatterns,
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

  const lowConfidence =
    results.filter(
      (
        result,
      ) =>
        result.actual
          .confidence ===
        "low",
    );

  return NextResponse.json(
    {
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

        lowConfidence:
          lowConfidence.length,

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

      lowConfidenceCases:
        lowConfidence.map(
          (
            result,
          ) => ({
            name:
              result.name,

            actual:
              result.actual,
          }),
        ),

      results,
    },
    {
      status:
        200,
    },
  );
}