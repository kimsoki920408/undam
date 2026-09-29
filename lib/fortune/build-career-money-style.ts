import "server-only";

import type {
  CareerContext,
} from "@/types/career-context";

import type {
  CareerMoneyStyle,
} from "@/types/career-fortune";

import {
  classifyCareerContext,
} from "@/lib/fortune/classify-career-context";

export function buildCareerMoneyStyle(
  base:
    CareerMoneyStyle,

  careerContext?:
    CareerContext | null,
): CareerMoneyStyle {
  /*
   * 현재 직업정보가 없으면
   * 기존 사주 기반 결과 유지
   */
  if (
    !careerContext ||
    !careerContext.hasContext
  ) {
    return base;
  }

  const jobName =
    careerContext.jobTitle ??
    "현재 일";

  const classification =
  classifyCareerContext(
    careerContext,
  );

const isSales =
  classification.primaryRole ===
    "sales" ||
  classification.secondaryRoles.includes(
    "sales",
  );

const isBusiness =
  classification.primaryRole ===
    "business" ||
  classification.secondaryRoles.includes(
    "business",
  );

const isSpecialist =
  classification.primaryRole ===
    "specialist" ||
  classification.secondaryRoles.includes(
    "specialist",
  );

  /*
   * 영업 + 수입 고민
   */
  if (
    isSales &&
    careerContext.primaryConcern ===
      "income"
  ) {
    return {
      headline:
        `${jobName}에서 수입을 키울 핵심은 연락량보다 전환율과 고객 자산입니다.`,

      description: [
        "지금처럼 신규 고객을 계속 만나는 경험은 필요하지만, 연락 수가 늘어나는 것만으로는 수입 구조가 안정되기 어렵습니다.",

        "고객을 얼마나 많이 만났는지보다 상담이 계약으로 얼마나 연결되는지, 계약 고객이 소개·재상담으로 다시 이어지는지를 함께 봐야 합니다.",

        "시간이 지날수록 매달 처음부터 다시 영업하는 비중은 줄고, 기존 고객과 소개 고객이 쌓이는 구조가 만들어지는지가 중요합니다.",
      ],

      goodStructure: [
        "신규 고객 → 상담 → 계약 전환율이 숫자로 기록되는 구조",

        "소개·재상담 고객이 쌓여 매달 0에서 다시 시작하지 않는 구조",

        "상담 실력과 고객관리 경험이 장기적인 보상과 고객 자산으로 남는 구조",
      ],

      riskyStructure: [
        "DB 연락량만 늘고 상담→계약 전환율은 계속 그대로인 구조",

        "매달 신규 고객만 쫓고 기존 고객과 소개 고객이 거의 쌓이지 않는 구조",

        "왜 수입이 오르고 떨어지는지 원인을 모른 채 연락량만 조절하는 구조",
      ],

      moneyAdvice:
        "수입 목표만 보지 말고 신규 고객 수 → 상담 수 → 계약률 → 평균 수입 → 소개 비중으로 나눠보세요. 가장 약한 숫자 하나를 개선하는 것이 지금의 수입을 키우는 가장 현실적인 출발점입니다.",
    };
  }

  /*
   * 영업이지만 수입 외 고민
   */
  if (isSales) {
    return {
      headline:
        `${jobName}에서는 많이 파는 것보다 고객을 이해하고 다시 찾게 만드는 능력이 돈이 됩니다.`,

      description: [
        "현재 영업 경험은 고객의 문제를 읽고 제안으로 연결하는 능력으로 발전시킬 수 있습니다.",

        "단기 계약 건수뿐 아니라 상담 품질, 재상담, 소개 고객처럼 시간이 지나도 남는 영업 자산을 함께 키우는 것이 중요합니다.",
      ],

      goodStructure: [
        "고객 상황을 분석하고 맞춤형 제안을 할 수 있는 구조",

        "성과가 실적과 보상으로 직접 연결되는 구조",

        "기존 고객 관계가 소개와 재계약으로 이어지는 구조",
      ],

      riskyStructure: [
        "단순 접촉량만 평가하는 구조",

        "고객 신뢰보다 단기 계약만 우선하는 구조",

        "성과는 요구하지만 고객을 관리할 시간과 권한은 없는 구조",
      ],

      moneyAdvice:
        "영업에서 오래 갈 수입은 계약 한 건보다 '다음 고객이 들어오는 구조'에서 만들어집니다. 계약률과 함께 소개·재상담 비중을 반드시 확인하세요.",
    };
  }

  /*
   * 사업 + 수입 고민
   */
  if (
    isBusiness &&
    careerContext.primaryConcern ===
      "income"
  ) {
    return {
      headline:
        `${jobName}에서는 매출보다 실제로 남는 돈과 반복 매출이 중요합니다.`,

      description: [
        "사업에서 매출이 늘어나는 것과 실제 수입이 늘어나는 것은 다를 수 있습니다.",

        "고객 획득 비용, 운영 비용, 반복 구매를 함께 봐야 어떤 고객과 상품에 집중해야 하는지가 분명해집니다.",
      ],

      goodStructure: [
        "고객 한 명을 얻는 비용보다 남는 이익이 충분한 구조",

        "기존 고객의 반복 구매와 재계약이 늘어나는 구조",

        "대표가 모든 일을 직접 하지 않아도 반복 가능한 운영 구조",
      ],

      riskyStructure: [
        "매출은 늘지만 실제 남는 현금이 거의 없는 구조",

        "신규 고객을 계속 사 와야만 유지되는 구조",

        "시간과 고정비가 매출보다 빠르게 늘어나는 구조",
      ],

      moneyAdvice:
        "매출 하나만 보지 말고 고객 획득 비용·고객당 실제 이익·반복 매출 비중을 함께 기록하세요.",
    };
  }

  /*
   * 전문직 + 수입 고민
   */
  if (
    isSpecialist &&
    careerContext.primaryConcern ===
      "income"
  ) {
    return {
      headline:
        `${jobName}에서는 일하는 시간을 늘리는 것보다 전문성의 값을 높이는 쪽이 중요합니다.`,

      description: [
        "전문가형 커리어에서는 같은 시간을 쓰더라도 더 어려운 문제를 해결할 수 있을수록 시장가치가 달라집니다.",

        "배운 기술이 실제 결과와 사례로 남고, 그 결과가 더 높은 역할이나 보상으로 연결되는지를 확인해야 합니다.",
      ],

      goodStructure: [
        "경험이 쌓일수록 해결할 수 있는 문제의 난도가 높아지는 구조",

        "전문성이 포트폴리오·성과·자격·사례로 남는 구조",

        "실력이 높아질수록 단가나 연봉 협상력이 커지는 구조",
      ],

      riskyStructure: [
        "공부는 늘지만 실제 결과물이 거의 남지 않는 구조",

        "난도가 높은 일을 맡아도 보상이 전혀 달라지지 않는 구조",

        "시장 수요와 관계없는 전문성만 계속 깊어지는 구조",
      ],

      moneyAdvice:
        "수입을 올리려면 근무시간보다 '내가 해결할 수 있는 문제의 가치'를 키워야 합니다. 최근 성과를 시장에서 설명 가능한 사례로 남겨보세요.",
    };
  }

  /*
   * 기타 현재 직업정보가 있는 경우
   */
  return {
    headline:
      `${jobName}에서 돈이 붙는 지점은 더 열심히 하는 곳보다, 성과가 실제 보상으로 연결되는 곳입니다.`,

    description: [
      ...base.description.slice(
        0,
        1,
      ),

      "현재 직업에서는 어떤 업무가 실제 평가·보상·경력으로 이어지는지를 따로 확인할 필요가 있습니다.",
    ],

    goodStructure: [
      "잘한 결과가 숫자·평가·성과로 남는 구조",

      "경험이 쌓일수록 보상이나 선택권이 커지는 구조",

      "현재 업무가 다음 직장에서도 인정받을 경력으로 남는 구조",
    ],

    riskyStructure: [
      "업무량은 늘지만 보상은 거의 달라지지 않는 구조",

      "성과의 기준을 알 수 없어 무엇을 개선해야 할지 모르는 구조",

      "시간이 지나도 새로운 경력 자산이 거의 쌓이지 않는 구조",
    ],

    moneyAdvice:
      "최근 3개월 업무를 돌아보면서 '시간을 많이 쓴 일'과 '실제 보상·평가로 이어진 일'을 나눠보세요. 두 목록이 다르다면 앞으로 시간을 쓰는 방식을 조정할 필요가 있습니다.",
  };
}