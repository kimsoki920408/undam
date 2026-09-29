import type {
  CareerContext,
} from "@/types/career-context";

export type CareerRoleKey =
  | "employee"
  | "specialist"
  | "sales"
  | "business"
  | "leadership";

export type CareerDomain =
  | "finance-insurance"
  | "tech"
  | "healthcare"
  | "education"
  | "marketing-media"
  | "public-admin"
  | "hr"
  | "retail-food"
  | "construction-realestate"
  | "logistics-transport"
  | "beauty-service"
  | "manufacturing"
  | "legal-accounting"
  | "general";

export type CareerWorkPattern =
  | "client-facing"
  | "performance-based"
  | "consulting"
  | "technical"
  | "creative"
  | "care"
  | "operations"
  | "field-work"
  | "regulated"
  | "people-management"
  | "project-based"
  | "entrepreneurial";

export type CareerClassification = {
  primaryRole:
    CareerRoleKey | null;

  secondaryRoles:
    CareerRoleKey[];

  domain:
    CareerDomain;

  patterns:
    CareerWorkPattern[];

  confidence:
    | "high"
    | "medium"
    | "low";

  matchedKeywords:
    string[];
};

type OccupationProfile = {
  aliases:
    string[];

  primaryRole:
    CareerRoleKey;

  secondaryRoles?:
    CareerRoleKey[];

  domain:
    CareerDomain;
};

const occupationProfiles:
  OccupationProfile[] = [
  /*
   * 의료·복지
   */
  {
    aliases: [
      "치위생사",
      "치과위생사",
    ],

    primaryRole:
      "specialist",

    domain:
      "healthcare",
  },

  {
    aliases: [
      "사회복지사",
    ],

    primaryRole:
      "specialist",

    domain:
      "general",
  },

  {
    aliases: [
      "물리치료사",
    ],

    primaryRole:
      "specialist",

    domain:
      "healthcare",
  },

  /*
   * 법률·노무·회계
   */
  {
    aliases: [
      "공인노무사",
      "노무사",
    ],

    primaryRole:
      "specialist",

    domain:
      "legal-accounting",
  },

  {
    aliases: [
      "경리",
      "경리사무원",
    ],

    primaryRole:
      "employee",

    domain:
      "legal-accounting",
  },

  /*
   * 디자인·콘텐츠
   */
  {
    aliases: [
      "웹디자이너",
      "웹 디자이너",
    ],

    primaryRole:
      "specialist",

    domain:
      "general",
  },

  {
    aliases: [
      "영상편집자",
      "영상 편집자",
      "영상에디터",
      "영상 에디터",
    ],

    primaryRole:
      "specialist",

    domain:
      "marketing-media",
  },

  /*
   * 유통·MD
   */
  {
    aliases: [
      "쇼핑몰md",
      "쇼핑몰 md",
      "온라인md",
      "온라인 md",
      "상품md",
      "상품 md",
    ],

    primaryRole:
      "employee",

    domain:
      "general",
  },

  /*
   * 호텔·항공 서비스
   */
  {
    aliases: [
      "호텔리어",
    ],

    primaryRole:
      "employee",

    domain:
      "general",
  },

  {
    aliases: [
      "객실승무원",
      "객실 승무원",
      "항공승무원",
      "항공 승무원",
      "승무원",
    ],

    primaryRole:
      "employee",

    domain:
      "general",
  },

  /*
   * 물류
   */
  {
    aliases: [
      "배달기사",
      "배달 기사",
    ],

    primaryRole:
      "employee",

    domain:
      "logistics-transport",
  },

  /*
   * 기술·현장
   */
  {
    aliases: [
      "전기기사",
      "전기 기사",
    ],

    primaryRole:
      "specialist",

    domain:
      "general",
  },

  {
    aliases: [
      "용접공",
      "용접사",
    ],

    primaryRole:
      "specialist",

    domain:
      "manufacturing",
  },

  /*
   * 스포츠
   */
  {
    aliases: [
      "헬스트레이너",
      "헬스 트레이너",
      "퍼스널트레이너",
      "퍼스널 트레이너",
      "pt트레이너",
      "pt 트레이너",
    ],

    primaryRole:
      "specialist",

    domain:
      "general",
  },

  /*
   * 군·공공
   */
  {
    aliases: [
      "직업군인",
      "직업 군인",
      "군인",
    ],

    primaryRole:
      "employee",

    domain:
      "public-admin",
  },
];

type WeightedKeyword = [
  keyword: string,
  weight: number,
];

const roleKeywords:
  Record<
    CareerRoleKey,
    WeightedKeyword[]
  > = {
  employee: [
    ["사무", 2],
    ["행정", 3],
    ["운영", 2],
    ["지원", 2],
    ["총무", 3],
    ["정산", 2],
    ["구매", 2],
    ["공무원", 6],
    ["공공", 3],
    ["회사원", 3],
    ["직장인", 2],
    ["인사", 2],
    ["생산직", 4],
    ["생산", 2],
    ["물류", 2],
    ["배송", 2],
    ["택배", 3],
    ["운전기사", 4],
    ["경찰관", 8],
    ["경찰", 6],
    ["소방관", 8],
    ["소방", 6],
    ["택시기사", 5],
    ["버스기사", 5],
    ["화물기사", 5],
  ],

  specialist: [
    ["개발자", 6],
    ["개발", 3],
    ["프로그래머", 6],
    ["프론트엔드", 6],
    ["백엔드", 6],
    ["엔지니어", 5],
    ["디자이너", 5],
    ["디자인", 3],
    ["연구원", 5],
    ["연구", 3],
    ["분석", 3],
    ["기술", 2],
    ["회계사", 6],
    ["세무사", 6],
    ["변호사", 6],
    ["법무사", 6],
    ["의사", 6],
    ["간호사", 6],
    ["약사", 6],
    ["치료사", 5],
    ["교사", 6],
    ["강사", 4],
    ["교육", 3],
    ["상담사", 4],
    ["건축사", 6],
    ["설계", 3],
    ["요리사", 5],
    ["셰프", 5],
    ["미용사", 5],
    ["전문직", 6],
    ["컨설팅", 3],
    ["컨설턴트", 5],
    ["기자", 8],
    ["사진작가", 8],
    ["사진가", 7],
    ["상담심리사", 9],
    ["심리상담사", 8],
    ["심리사", 7],
  ],

  sales: [
    ["보험설계사", 8],
    ["영업", 5],
    ["세일즈", 5],
    ["판매", 3],
    ["상담", 2],
    ["고객", 2],
    ["계약", 2],
    ["중개", 4],
    ["공인중개사", 7],
    ["제안", 2],
    ["사업개발", 5],
    ["마케팅", 4],
    ["브랜딩", 2],
    ["제휴", 3],
    ["파트너십", 3],
    ["bd", 4],
    ["사업 개발", 5],
  ],

  business: [
    ["대표", 7],
    ["사장", 7],
    ["자영업", 7],
    ["사업자", 6],
    ["창업", 6],
    ["사업운영", 6],
    ["점주", 6],
    ["쇼핑몰", 5],
    ["스마트스토어", 5],
    ["스토어운영", 5],
    ["브랜드운영", 4],
    ["사업", 2],
    ["사업 운영", 6],
["스토어 운영", 5],
["브랜드 운영", 4],
  ],

  leadership: [
    ["팀장", 8],
    ["리더", 5],
    ["관리자", 5],
    ["매니저", 4],
    ["총괄", 7],
    ["책임자", 6],
    ["현장소장", 8],
    ["소장", 5],
    ["점장", 6],
    ["팀관리", 5],
    ["조직관리", 5],
    ["프로젝트관리", 4],
    ["프로젝트리드", 6],
    ["pm", 4],
    ["프로젝트 관리", 4],
["프로젝트 리드", 6],
["조직 관리", 5],
["팀 관리", 5],
  ],
};

const domainKeywords:
  Record<
    CareerDomain,
    WeightedKeyword[]
  > = {
  "finance-insurance": [
    ["보험", 7],
    ["보험설계사", 8],
    ["금융", 6],
    ["은행", 6],
    ["증권", 6],
    ["재무", 4],
    ["대출", 4],
  ],

  tech: [
    ["개발자", 7],
    ["개발", 4],
    ["프론트엔드", 8],
    ["백엔드", 8],
    ["프로그래머", 8],
    ["소프트웨어", 7],
    ["데이터", 5],
    ["it", 5],
    ["엔지니어", 4],
  ],

  healthcare: [
    ["간호사", 8],
    ["의사", 8],
    ["병원", 6],
    ["의료", 6],
    ["약사", 8],
    ["치료사", 7],
    ["물리치료", 8],
    ["작업치료", 8],
  ],

  education: [
    ["교사", 8],
    ["강사", 6],
    ["교육", 6],
    ["학교", 5],
    ["학원", 5],
    ["보육", 6],
    ["교수", 8],
  ],

  "marketing-media": [
    ["마케팅", 8],
    ["광고", 7],
    ["콘텐츠", 6],
    ["브랜딩", 7],
    ["미디어", 6],
    ["sns", 5],
    ["홍보", 6],
    ["기자", 9],
["사진작가", 9],
["사진가", 8],
["사진", 4],
["촬영", 5],
["뉴스", 6],
["취재", 6],
  ],

  "public-admin": [
    ["공무원", 9],
    ["공공", 6],
    ["행정", 5],
    ["공기업", 7],
    ["공공기관", 7],
    ["경찰관", 9],
    ["경찰", 7],
    ["소방관", 9],
    ["소방", 7],
  ],

  hr: [
    ["인사", 7],
    ["채용", 6],
    ["hr", 7],
    ["노무", 6],
    ["조직문화", 5],
  ],

  "retail-food": [
    ["카페", 7],
    ["식당", 7],
    ["음식점", 7],
    ["요리사", 7],
    ["셰프", 7],
    ["바리스타", 7],
    ["매장", 4],
    ["외식", 6],
  ],

  "construction-realestate": [
    ["건설", 7],
    ["건축", 7],
    ["현장소장", 8],
    ["현장", 3],
    ["부동산", 8],
    ["공인중개사", 8],
    ["중개", 5],
  ],

  "logistics-transport": [
    ["물류", 8],
    ["택배", 8],
    ["배송", 7],
    ["운전기사", 8],
    ["운송", 7],
    ["배차", 6],
  ],

  "beauty-service": [
    ["미용사", 8],
    ["미용", 7],
    ["헤어", 7],
    ["네일", 7],
    ["피부관리", 7],
    ["뷰티", 6],
  ],

  manufacturing: [
    ["생산직", 8],
    ["생산", 6],
    ["제조", 7],
    ["공장", 6],
    ["품질관리", 6],
    ["품질", 4],
  ],

  "legal-accounting": [
    ["변호사", 8],
    ["법무사", 8],
    ["법무", 6],
    ["회계사", 8],
    ["회계", 6],
    ["세무사", 8],
    ["세무", 6],
  ],

  general: [],
};

export function classifyCareerContext(
  context:
    CareerContext | null | undefined,
): CareerClassification {
  if (
    !context ||
    !context.hasContext
  ) {
    return {
      primaryRole:
        null,

      secondaryRoles:
        [],

      domain:
        "general",

      patterns:
        [],

      confidence:
        "low",

      matchedKeywords:
        [],
    };
  }

  const title =
    normalizeText(
      context.jobTitle ??
        "",
    );

  const work =
    normalizeText(
      context.mainWork ??
        "",
    );

  const allText =
    `${title}${work}`;

    const occupationMatch =
  findOccupationProfile(
    title,
  );

  const matchedKeywords =
    new Set<string>();

  const roleScores:
    Record<
      CareerRoleKey,
      number
    > = {
    employee: 0,
    specialist: 0,
    sales: 0,
    business: 0,
    leadership: 0,
  };

  for (
    const role
    of Object.keys(
      roleKeywords,
    ) as CareerRoleKey[]
  ) {
    roleScores[
      role
    ] += scoreKeywords(
      title,
      roleKeywords[
        role
      ],
      2,
      matchedKeywords,
    );

    roleScores[
      role
    ] += scoreKeywords(
      work,
      roleKeywords[
        role
      ],
      1,
      matchedKeywords,
    );
  }

  /*
   * 직책 자체가 강한 신호인 경우
   * 추가 가중치
   */
  if (
    /팀장|총괄|책임자|현장소장|점장/.test(
      title,
    )
  ) {
    roleScores.leadership +=
      10;
  }

  if (
    /대표|사장|자영업|사업자|점주/.test(
      title,
    )
  ) {
    roleScores.business +=
      10;
  }

  if (
    /보험설계사|공인중개사/.test(
      title,
    )
  ) {
    roleScores.sales +=
      10;
  }

  if (
    /개발자|프로그래머|간호사|의사|약사|교사|회계사|세무사|변호사|법무사|건축사/.test(
      title,
    )
  ) {
    roleScores.specialist +=
      10;
  }

  if (
    /공무원/.test(
      title,
    )
  ) {
    roleScores.employee +=
      10;
  }

  const orderedRoles =
    (
      Object.entries(
        roleScores,
      ) as [
        CareerRoleKey,
        number,
      ][]
    ).sort(
      (
        a,
        b,
      ) =>
        b[1] -
        a[1],
    );

  const [
    topRole,
    topScore,
  ] =
    orderedRoles[0];

  const primaryRole =
  occupationMatch
    ? occupationMatch
        .profile
        .primaryRole
    : topScore >
        0
      ? topRole
      : null;

  const secondaryRoles =
  occupationMatch
    ? occupationMatch
        .profile
        .secondaryRoles ??
      []
    : primaryRole
      ? orderedRoles
          .slice(
            1,
          )
          .filter(
            ([
              ,
              score,
            ]) =>
              score >=
              Math.max(
                3,
                topScore *
                  0.45,
              ),
          )
          .slice(
            0,
            2,
          )
          .map(
            ([
              role,
            ]) =>
              role,
          )
      : [];

  const domain =
  occupationMatch
    ? occupationMatch
        .profile
        .domain
    : detectDomain(
        title,
        work,
      );
  const patterns =
    detectPatterns(
      allText,
      primaryRole,
      domain,
    );

  const confidence =
  occupationMatch
    ? "high"
    : topScore >=
        12
      ? "high"
      : topScore >=
          5
        ? "medium"
        : "low";

if (
  occupationMatch
) {
  matchedKeywords.add(
    occupationMatch
      .matchedAlias,
  );
}

  return {
    primaryRole,

    secondaryRoles,

    domain,

    patterns,

    confidence,

    matchedKeywords:
      [
        ...matchedKeywords,
      ].slice(
        0,
        20,
      ),
  };
}

function detectDomain(
  title:
    string,

  work:
    string,
): CareerDomain {

    if (
  /연구원|연구직/.test(
    title,
  )
) {
  return "general";
}

if (
  /ux디자이너|ui디자이너|프로덕트디자이너/.test(
    title.replace(
      /\s+/g,
      "",
    ),
  )
) {
  return "general";
}

  const scores =
    {} as Record<
      CareerDomain,
      number
    >;

  for (
    const domain
    of Object.keys(
      domainKeywords,
    ) as CareerDomain[]
  ) {
    scores[
      domain
    ] =
      scoreKeywords(
        title,
        domainKeywords[
          domain
        ],
        2,
      ) +
      scoreKeywords(
        work,
        domainKeywords[
          domain
        ],
        1,
      );
  }

  const ordered =
    (
      Object.entries(
        scores,
      ) as [
        CareerDomain,
        number,
      ][]
    ).sort(
      (
        a,
        b,
      ) =>
        b[1] -
        a[1],
    );

  if (
    !ordered.length ||
    ordered[0][1] <=
      0
  ) {
    return "general";
  }

  return ordered[0][0];
}

function findOccupationProfile(
  title:
    string,
) {
  const compactTitle =
    compactOccupationText(
      title,
    );

  let bestMatch:
    {
      profile:
        OccupationProfile;

      matchedAlias:
        string;

      length:
        number;
    } | null =
    null;

  for (
    const profile
    of occupationProfiles
  ) {
    for (
      const alias
      of profile.aliases
    ) {
      const compactAlias =
        compactOccupationText(
          alias,
        );

      if (
        !compactAlias ||
        !compactTitle.includes(
          compactAlias,
        )
      ) {
        continue;
      }

      /*
       * 여러 직업명이 동시에 잡히는 경우
       * 가장 구체적인 긴 직업명을 우선합니다.
       *
       * 예:
       * "직업군인" > "군인"
       */
      if (
        !bestMatch ||
        compactAlias.length >
          bestMatch.length
      ) {
        bestMatch = {
          profile,

          matchedAlias:
            alias,

          length:
            compactAlias.length,
        };
      }
    }
  }

  return bestMatch;
}

function compactOccupationText(
  value:
    string,
) {
  return value
    .toLowerCase()
    .replace(
      /[^a-z0-9가-힣]/g,
      "",
    );
}

function detectPatterns(
  text:
    string,

  primaryRole:
    CareerRoleKey | null,

  domain:
    CareerDomain,
): CareerWorkPattern[] {
  const result =
    new Set<CareerWorkPattern>();

  /*
   * 고객·사람을 직접 상대하는 업무
   */
  if (
    /고객|상담|판매|영업|계약|중개|환자|학부모|수강생|민원|내담자/.test(
      text,
    )
  ) {
    result.add(
      "client-facing",
    );
  }

  /*
   * 성과가 매출·수수료·실적에
   * 직접 연결되는 업무
   */
  if (
    /인센티브|수수료|매출|실적|성과급|영업|판매/.test(
      text,
    )
  ) {
    result.add(
      "performance-based",
    );
  }

  /*
   * 상담·진단·제안형 업무
   *
   * 보험 설계처럼 '설계'라는 단어가 있어도
   * technical로 분류하지 않고
   * consulting에만 반영할 수 있습니다.
   */
  if (
    /상담|컨설팅|컨설턴트|제안|진단/.test(
      text,
    ) ||
    (
      primaryRole ===
        "specialist" &&
      /분석|설계/.test(
        text,
      )
    )
  ) {
    result.add(
      "consulting",
    );
  }

  /*
   * 전문 기술형
   *
   * '개발', '설계', '관리' 같은 단어 하나만으로
   * technical 판정하지 않습니다.
   *
   * 전문직 역할로 분류된 경우에만
   * 전문 기술 키워드를 적용합니다.
   */
  if (
    primaryRole ===
      "specialist" &&
    /개발자|프로그래머|프론트엔드|백엔드|엔지니어|디자이너|디자인|연구|분석|기술|회계|세무|법무|의료|간호|약사|치료|요리|셰프|미용|건축|설계/.test(
      text,
    )
  ) {
    result.add(
      "technical",
    );
  }

  /*
 * 창작·기획
 *
 * "기획"은 행정·공공·운영 업무에서도
 * 흔히 사용되므로 단어 하나만으로
 * creative 판정하지 않습니다.
 */
const hasStrongCreativeKeyword =
  /디자인|콘텐츠|브랜딩|광고|창작|사진|촬영|취재|기사 작성/.test(
    text,
  );

const hasCreativePlanning =
  /기획/.test(
    text,
  ) &&
  domain !==
    "public-admin" &&
  domain !==
    "manufacturing" &&
  domain !==
    "logistics-transport";

if (
  hasStrongCreativeKeyword ||
  hasCreativePlanning
) {
  result.add(
    "creative",
  );
}
  /*
   * 돌봄·케어
   */
  if (
    /간호|의료|치료|보육|돌봄|환자|복약|구급/.test(
      text,
    )
  ) {
    result.add(
      "care",
    );
  }

  /*
   * 운영형 업무
   *
   * '고객 관리'만으로 operations가 붙는 것을
   * 방지하기 위해 단순 '관리'는 제외합니다.
   */
  if (
  /운영|행정|생산|물류|정산|구매|공정|배차|배송|재고/.test(
    text,
  ) ||
  (
    (
      primaryRole ===
        "employee" ||
      primaryRole ===
        "leadership"
    ) &&
    /업무 ?관리|일정 ?관리|공정 ?관리|매장 ?관리/.test(
      text,
    )
  ) ||
  (
    domain ===
      "hr" &&
    /채용|평가|인사|조직 ?관리|인력 ?관리/.test(
      text,
    )
  )
) {
  result.add(
    "operations",
  );
}

  /*
   * 현장 업무
   */
  if (
    /현장|배송|택배|운전|건설|생산직|출동|화재|구조|구급/.test(
      text,
    )
  ) {
    result.add(
      "field-work",
    );
  }

  /*
   * 규제·자격·공공 성격이 강한 산업
   */
  if (
    domain ===
      "finance-insurance" ||
    domain ===
      "healthcare" ||
    domain ===
      "legal-accounting" ||
    domain ===
      "public-admin"
  ) {
    result.add(
      "regulated",
    );
  }

  /*
   * 사람 관리
   */
  if (
    primaryRole ===
      "leadership" ||
    /직원 관리|팀 관리|조직 관리|작업자 관리/.test(
      text,
    )
  ) {
    result.add(
      "people-management",
    );
  }

  /*
   * 프로젝트 기반
   *
   * 예전처럼 '개발'이라는 단어만으로
   * 프로젝트형이 붙지 않게 합니다.
   */
  if (
    /프로젝트|프로젝트 관리|프로젝트 리드|공정 관리/.test(
      text,
    )
  ) {
    result.add(
      "project-based",
    );
  }

  /*
   * 사업 운영
   */
  if (
    primaryRole ===
      "business"
  ) {
    result.add(
      "entrepreneurial",
    );
  }

  return [
    ...result,
  ];
}

function scoreKeywords(
  text:
    string,

  keywords:
    WeightedKeyword[],

  multiplier:
    number,

  matchedKeywords?:
    Set<string>,
) {
  let score =
    0;

  for (
    const [
      keyword,
      weight,
    ]
    of keywords
  ) {
    const normalizedKeyword =
      normalizeText(
        keyword,
      );

    if (
      normalizedKeyword &&
      text.includes(
        normalizedKeyword,
      )
    ) {
      score +=
        weight *
        multiplier;

      matchedKeywords?.add(
        keyword,
      );
    }
  }

  return score;
}

function normalizeText(
  value:
    string,
) {
  return value
    .toLowerCase()
    .replace(
      /[·,/()\-_.]/g,
      " ",
    )
    .replace(
      /\s+/g,
      " ",
    )
    .trim();
}