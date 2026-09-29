export type CareerSatisfaction =
  | "very-low"
  | "low"
  | "neutral"
  | "high"
  | "very-high";

export type CareerConcern =
  | "continue"
  | "change-job"
  | "income"
  | "promotion"
  | "business"
  | "burnout"
  | "other";

export type CareerContext = {
  /*
   * 현재 직업 또는 업종
   * 예:
   * 보험설계사
   * 프론트엔드 개발자
   * 카페 운영
   */
  jobTitle:
    string | null;

  /*
   * 실제로 하는 핵심 업무
   * 직업명보다 개인화에 더 중요한 정보입니다.
   *
   * 예:
   * 신규 고객 상담
   * DB 영업
   * 보험 설계 및 계약 관리
   */
  mainWork:
    string | null;

  /*
   * 현재 직업 또는 유사 직무 경력
   * 숫자 월 단위로 통일합니다.
   *
   * 예:
   * 6개월 -> 6
   * 3년 -> 36
   */
  experienceMonths:
    number | null;

  /*
   * 현재 일에 대한 체감 만족도
   */
  satisfaction:
    CareerSatisfaction | null;

  /*
   * 가장 큰 커리어 고민
   */
  primaryConcern:
    CareerConcern | null;

  /*
   * 사용자가 직접 적는 추가 고민
   *
   * 예:
   * 수입이 생각보다 적어서 계속해야 할지 고민됨
   * 영업은 재미있는데 신규 고객 확보가 너무 힘듦
   */
  concernDetail:
    string | null;

  /*
   * 현재 직업을 유지할 생각이 있는지
   * 필수 값은 아닙니다.
   */
  wantsToStay:
    boolean | null;

  /*
   * 사용자가 관심 있는 다음 방향
   * 여러 개 선택 가능
   *
   * 예:
   * 영업
   * 창업
   * 이직
   * 전문직
   * 관리직
   */
  interests:
    string[];

  /*
   * 서버가 입력값의 존재 여부를
   * 빠르게 확인할 때 사용합니다.
   */
  hasContext:
    boolean;
};

export const EMPTY_CAREER_CONTEXT:
  CareerContext = {
  jobTitle:
    null,

  mainWork:
    null,

  experienceMonths:
    null,

  satisfaction:
    null,

  primaryConcern:
    null,

  concernDetail:
    null,

  wantsToStay:
    null,

  interests:
    [],

  hasContext:
    false,
};

export const CAREER_SATISFACTION_LABELS:
  Record<
    CareerSatisfaction,
    string
  > = {
  "very-low":
    "매우 낮음",

  low:
    "낮음",

  neutral:
    "보통",

  high:
    "높음",

  "very-high":
    "매우 높음",
};

export const CAREER_CONCERN_LABELS:
  Record<
    CareerConcern,
    string
  > = {
  continue:
    "지금 일을 계속할지",

  "change-job":
    "이직",

  income:
    "수입",

  promotion:
    "승진·성장",

  business:
    "창업·독립",

  burnout:
    "업무 소진",

  other:
    "기타",
};

export function createCareerContext(
  value:
    Partial<CareerContext>,
): CareerContext {
  const jobTitle =
    normalizeOptionalText(
      value.jobTitle,
      80,
    );

  const mainWork =
    normalizeOptionalText(
      value.mainWork,
      300,
    );

  const concernDetail =
    normalizeOptionalText(
      value.concernDetail,
      500,
    );

  const experienceMonths =
    normalizeExperienceMonths(
      value.experienceMonths,
    );

  const satisfaction =
    isCareerSatisfaction(
      value.satisfaction,
    )
      ? value.satisfaction
      : null;

  const primaryConcern =
    isCareerConcern(
      value.primaryConcern,
    )
      ? value.primaryConcern
      : null;

  const wantsToStay =
    typeof value.wantsToStay ===
    "boolean"
      ? value.wantsToStay
      : null;

  const interests =
    Array.isArray(
      value.interests,
    )
      ? [
          ...new Set(
            value.interests
              .filter(
                (
                  item,
                ): item is string =>
                  typeof item ===
                  "string",
              )
              .map(
                (
                  item,
                ) =>
                  item
                    .trim(),
              )
              .filter(
                Boolean,
              )
              .slice(
                0,
                10,
              ),
          ),
        ]
      : [];

  const hasContext =
    Boolean(
      jobTitle ||
        mainWork ||
        experienceMonths !==
          null ||
        satisfaction ||
        primaryConcern ||
        concernDetail ||
        wantsToStay !==
          null ||
        interests.length >
          0,
    );

  return {
    jobTitle,

    mainWork,

    experienceMonths,

    satisfaction,

    primaryConcern,

    concernDetail,

    wantsToStay,

    interests,

    hasContext,
  };
}

function normalizeOptionalText(
  value:
    unknown,
  maxLength:
    number,
) {
  if (
    typeof value !==
    "string"
  ) {
    return null;
  }

  const normalized =
    value
      .trim()
      .replace(
        /\s+/g,
        " ",
      )
      .slice(
        0,
        maxLength,
      );

  return (
    normalized ||
    null
  );
}

function normalizeExperienceMonths(
  value:
    unknown,
) {
  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value,
    )
  ) {
    return null;
  }

  const normalized =
    Math.round(
      value,
    );

  if (
    normalized < 0 ||
    normalized > 720
  ) {
    return null;
  }

  return normalized;
}

function isCareerSatisfaction(
  value:
    unknown,
): value is CareerSatisfaction {
  return (
    value ===
      "very-low" ||
    value ===
      "low" ||
    value ===
      "neutral" ||
    value ===
      "high" ||
    value ===
      "very-high"
  );
}

function isCareerConcern(
  value:
    unknown,
): value is CareerConcern {
  return (
    value ===
      "continue" ||
    value ===
      "change-job" ||
    value ===
      "income" ||
    value ===
      "promotion" ||
    value ===
      "business" ||
    value ===
      "burnout" ||
    value ===
      "other"
  );
}