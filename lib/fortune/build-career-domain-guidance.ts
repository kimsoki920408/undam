import "server-only";

import type {
  CareerClassification,
} from "@/lib/fortune/classify-career-context";

export type CareerDomainGuidance = {
  workMeaning:
    string;

  successEvidence:
    string[];

  risk:
    string;

  nextFocus:
    string;
};

const domainGuidance:
  Record<
    CareerClassification["domain"],
    CareerDomainGuidance
  > = {
  "finance-insurance": {
    workMeaning:
      "신뢰를 만들고 복잡한 정보를 이해하기 쉽게 설명해 실제 선택으로 연결하는 일이 중요합니다.",

    successEvidence: [
      "고객의 상황을 정확히 파악한 상담",
      "계약 이후에도 이어지는 관계",
      "소개나 재상담으로 연결된 경험",
    ],

    risk:
      "단기 실적만 쫓다 보면 관계와 신뢰가 남지 않을 수 있습니다.",

    nextFocus:
      "단순 접촉량보다 상담의 질·전환·유지·소개가 함께 좋아지는 구조를 만드는 것이 중요합니다.",
  },

  tech: {
    workMeaning:
      "복잡한 문제를 구조화하고 실제로 작동하는 해결책을 만드는 능력이 가치로 연결되는 분야입니다.",

    successEvidence: [
      "어려운 문제를 해결한 경험",
      "오류나 반복 작업을 줄인 결과",
      "사용자나 조직의 효율을 높인 결과물",
    ],

    risk:
      "기술 자체에만 집중하면 실제 사용자나 조직이 원하는 결과와 멀어질 수 있습니다.",

    nextFocus:
      "기술의 깊이와 함께 실제 문제를 얼마나 잘 해결했는지 증명할 사례를 쌓는 것이 중요합니다.",
  },

  healthcare: {
    workMeaning:
      "정확성과 숙련도, 사람을 안정적으로 대하는 힘이 함께 요구되는 분야입니다.",

    successEvidence: [
      "더 어려운 업무를 안정적으로 처리한 경험",
      "환자나 보호자에게 신뢰를 얻은 사례",
      "실수나 재작업을 줄인 경험",
    ],

    risk:
      "책임감만으로 버티다 보면 업무 강도와 감정 소진을 놓치기 쉽습니다.",

    nextFocus:
      "숙련도·정확성·환자 대응 능력이 더 큰 역할이나 보상으로 이어지는지를 확인하는 것이 중요합니다.",
  },

  education: {
    workMeaning:
      "내가 많이 아는 것보다 상대가 실제로 이해하고 성장하도록 만드는 능력이 중요합니다.",

    successEvidence: [
      "학습자의 결과가 좋아진 사례",
      "좋은 평가를 받은 설명 방식",
      "재등록이나 추천으로 이어진 경험",
    ],

    risk:
      "준비와 책임은 계속 늘어나는데 교육 결과나 보상으로 연결되지 않을 수 있습니다.",

    nextFocus:
      "교육 결과·설명력·콘텐츠 품질을 반복해서 증명할 수 있는 자신만의 방식을 만드는 것이 중요합니다.",
  },

  "marketing-media": {
    workMeaning:
      "아이디어를 실제 콘텐츠와 캠페인으로 만들고 사람들의 반응을 끌어내는 능력이 중요합니다.",

    successEvidence: [
      "반응이 좋아진 콘텐츠나 캠페인",
      "성과를 만든 기획",
      "포트폴리오로 남길 수 있는 결과물",
    ],

    risk:
      "유행과 요청을 따라가기만 하면 본인의 전문성과 차별점이 남지 않을 수 있습니다.",

    nextFocus:
      "기획력·결과물 품질·시장 반응을 하나의 포트폴리오로 축적하는 것이 중요합니다.",
  },

  "public-admin": {
    workMeaning:
      "정확한 처리와 책임감, 복잡한 절차를 안정적으로 운영하는 능력이 중요합니다.",

    successEvidence: [
      "복잡한 업무를 정확하게 처리한 경험",
      "업무 절차를 개선한 사례",
      "더 큰 책임이나 역할을 맡게 된 경험",
    ],

    risk:
      "맡은 일을 잘하는 것만 반복하면 책임은 늘어도 권한과 성장 체감은 작을 수 있습니다.",

    nextFocus:
      "업무 신뢰도가 더 큰 책임·권한·전문 역할로 이어지고 있는지를 확인하는 것이 중요합니다.",
  },

  hr: {
    workMeaning:
      "사람과 조직 사이의 문제를 파악하고 기준과 구조를 만드는 능력이 중요합니다.",

    successEvidence: [
      "채용이나 인력 운영을 개선한 경험",
      "조직 문제를 해결한 사례",
      "사람과 제도를 연결해 성과를 만든 경험",
    ],

    risk:
      "지원 업무만 반복하면 본인이 만든 조직 성과가 잘 드러나지 않을 수 있습니다.",

    nextFocus:
      "사람을 관리하는 것을 넘어 조직의 문제를 실제로 개선한 사례를 남기는 것이 중요합니다.",
  },

  "retail-food": {
    workMeaning:
      "고객 반응과 운영 효율을 동시에 관리해야 성과가 남는 분야입니다.",

    successEvidence: [
      "잘 팔리는 상품이나 메뉴를 만든 경험",
      "재방문 고객을 늘린 사례",
      "비용이나 운영 효율을 개선한 경험",
    ],

    risk:
      "매출만 보고 실제 남는 이익과 운영 부담을 놓칠 수 있습니다.",

    nextFocus:
      "매출보다 실제 이익·재방문·운영 효율이 함께 좋아지는지를 보는 것이 중요합니다.",
  },

  "construction-realestate": {
    workMeaning:
      "현장 판단과 일정·품질·사람 관리 또는 고객과 거래를 연결하는 실행력이 중요한 분야입니다.",

    successEvidence: [
      "일정이나 공정을 안정적으로 관리한 사례",
      "문제를 현장에서 해결한 경험",
      "거래나 프로젝트를 실제 결과로 만든 경험",
    ],

    risk:
      "문제를 직접 해결하는 능력이 강할수록 책임이 개인에게 지나치게 몰릴 수 있습니다.",

    nextFocus:
      "개인의 노력보다 반복 가능한 관리 기준과 성과 구조를 만드는 것이 중요합니다.",
  },

  "logistics-transport": {
    workMeaning:
      "시간과 동선, 안전과 정확도를 동시에 관리하는 실행력이 중요합니다.",

    successEvidence: [
      "지연이나 오류를 줄인 경험",
      "더 많은 업무를 안정적으로 처리한 사례",
      "동선이나 절차를 개선한 경험",
    ],

    risk:
      "업무량만 늘어나면 숙련도가 높아져도 보상과 경력으로 남지 않을 수 있습니다.",

    nextFocus:
      "처리량뿐 아니라 안전·정확도·운영 효율을 개선한 경험을 경력으로 남기는 것이 중요합니다.",
  },

  "beauty-service": {
    workMeaning:
      "기술력과 고객 경험, 다시 찾게 만드는 신뢰가 함께 중요한 분야입니다.",

    successEvidence: [
      "재방문 고객이 늘어난 경험",
      "특정 기술이나 서비스로 좋은 평가를 받은 사례",
      "소개로 이어진 고객 경험",
    ],

    risk:
      "서비스 시간을 계속 늘리는 방식만으로는 수입과 성장에 한계가 생길 수 있습니다.",

    nextFocus:
      "기술의 차별점·재방문·단가가 함께 좋아지는 구조를 만드는 것이 중요합니다.",
  },

  manufacturing: {
    workMeaning:
      "정확한 생산과 품질, 안전하고 반복 가능한 작업 구조를 만드는 능력이 중요합니다.",

    successEvidence: [
      "불량이나 오류를 줄인 경험",
      "생산성을 개선한 사례",
      "안전이나 공정을 안정화한 경험",
    ],

    risk:
      "숙련도가 높아져도 반복 작업에만 머물면 경력 가치가 충분히 커지지 않을 수 있습니다.",

    nextFocus:
      "단순 숙련을 넘어 품질·공정·기술 개선 경험을 쌓는 것이 중요합니다.",
  },

  "legal-accounting": {
    workMeaning:
      "정확한 판단과 전문 지식으로 복잡한 문제의 위험을 줄이고 해결하는 능력이 중요합니다.",

    successEvidence: [
      "복잡한 문제를 해결한 사례",
      "오류나 위험을 예방한 경험",
      "전문성을 인정받아 더 어려운 업무를 맡은 경험",
    ],

    risk:
      "업무량은 계속 늘어나는데 전문성의 희소성과 보상이 함께 높아지지 않을 수 있습니다.",

    nextFocus:
      "더 어려운 문제를 해결할수록 전문성과 보상 수준도 함께 올라가는지를 확인하는 것이 중요합니다.",
  },

  general: {
    workMeaning:
      "현재 직업명보다 실제로 어떤 문제를 해결하고 어떤 결과를 남기는지가 더 중요합니다.",

    successEvidence: [
      "좋은 평가를 받은 업무",
      "이전보다 더 잘하게 된 일",
      "다른 사람이 믿고 맡기게 된 역할",
    ],

    risk:
      "여러 업무를 두루 맡으면서도 자신의 핵심 강점이 무엇인지 남지 않을 수 있습니다.",

    nextFocus:
      "잘하는 업무와 실제 성과가 반복되는 지점을 찾아 하나의 경력 강점으로 만드는 것이 중요합니다.",
  },
};

export function buildCareerDomainGuidance(
  classification:
    CareerClassification,
): CareerDomainGuidance {
  return domainGuidance[
    classification.domain
  ];
}