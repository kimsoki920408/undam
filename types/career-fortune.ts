export type CareerFitLevel =
  | "very-good"
  | "good"
  | "mixed"
  | "caution";

export type CareerRoleFit = {
  id:
    string;

  title:
    string;

  fit:
    CareerFitLevel;

  oneLine:
    string;

  why:
    string[];

  goodWhen:
    string[];

  cautionWhen:
    string[];
};

export type CareerAvoidEnvironment = {
  title:
    string;

  reason:
    string;

  warningSign:
    string;
};

export type CareerMoneyStyle = {
  headline:
    string;

  description:
    string[];

  goodStructure:
    string[];

  riskyStructure:
    string[];

  moneyAdvice:
    string;
};

export type CareerLuckPeriod = {
  id:
    string;

  ageRange:
    string;

  pillar:
    string;

  headline:
    string;

  overall:
    string;

  opportunities:
    string[];

  money:
    string[];

  career:
    string[];

  caution:
    string[];

  winningMove:
    string;

  prepareNext:
    string;

  intensity:
    | "low"
    | "medium"
    | "high";
};

export type CareerCurrentJobVerdict = {
  available:
    boolean;

  /*
   * 사용자가 가장 먼저 보게 될
   * 명확한 최종 결론
   *
   * 예:
   * 지금은 계속하는 쪽이 좋습니다.
   */
  decision:
    string;

  /*
   * 결론을 실제 행동으로 번역
   *
   * 예:
   * 3~6개월 유지 + 수입 구조 검증
   */
  recommendedAction:
    string;

  /*
   * 언제 다시 판단할지
   */
  reviewPeriod:
    string | null;

  /*
   * 재판단할 때 확인할 현실 지표
   */
  reviewMetrics:
    string[];

  headline:
    string;

  verdict:
    | "keep"
    | "adjust"
    | "explore"
    | "change"
    | "unknown";

  reasons:
    string[];

  keepIf:
    string[];

  changeIf:
    string[];

  nextQuestion:
    string;
};

export type CareerWakeUpCall = {
  headline:
    string;

  message:
    string[];

  stopDoing:
    string[];

  startDoing:
    string[];
};

export type CareerHopePoint = {
  headline:
    string;

  message:
    string[];

  opportunityConditions:
    string[];
};

export type CareerNinetyDayPlan = {
  first30Days: {
    title:
      string;

    actions:
      string[];
  };

  next30Days: {
    title:
      string;

    actions:
      string[];
  };

  final30Days: {
    title:
      string;

    actions:
      string[];
  };
};

export type CareerFortuneDetail = {
  version:
    string;

  verdict: {
    headline:
      string;

    subheadline:
      string;

    strength:
      string;

    weakness:
      string;

    bestDirection:
      string;

    biggestWarning:
      string;
  };

  recommendedRoles:
    CareerRoleFit[];

  avoidEnvironments:
    CareerAvoidEnvironment[];

  roleComparison: {
    employee:
      CareerRoleFit;

    specialist:
      CareerRoleFit;

    sales:
      CareerRoleFit;

    business:
      CareerRoleFit;

    leadership:
      CareerRoleFit;
  };

  moneyStyle:
    CareerMoneyStyle;

  currentJob:
    CareerCurrentJobVerdict;

  luckPeriods:
    CareerLuckPeriod[];

  wakeUpCall:
    CareerWakeUpCall;

  hopePoint:
    CareerHopePoint;

  ninetyDayPlan:
    CareerNinetyDayPlan;

  disclaimer:
    string;
};