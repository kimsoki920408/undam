export type CalendarType =
  | "solar"
  | "lunar";

export type Gender =
  | "male"
  | "female";

export type FiveElement =
  | "목"
  | "화"
  | "토"
  | "금"
  | "수";

export type YinYang =
  | "양"
  | "음";

export type BirthTimeMode =
  | "exact"
  | "shichen"
  | "unknown";

export type BirthShichen =
  | "자"
  | "축"
  | "인"
  | "묘"
  | "진"
  | "사"
  | "오"
  | "미"
  | "신"
  | "유"
  | "술"
  | "해";

export type TimePrecision =
  | "exact"
  | "approximate"
  | "unknown";

export type MajorLuckPrecision =
  | "exact"
  | "approximate"
  | "sequence-only";

export type SajuInput = {
  nickname: string;

  birthDate: string;

  birthTimeMode: BirthTimeMode;

  birthTime: string | null;

  birthShichen: BirthShichen | null;

  calendarType: CalendarType;

  isLeapMonth: boolean;

  gender: Gender;

  birthRegion: string;
};

export type SajuPillar = {
  korean: string;

  hanja: string;

  heavenlyStem: string;

  earthlyBranch: string;

  heavenlyStemElement: FiveElement;

  earthlyBranchElement: FiveElement;
};

export type FiveElementCounts = {
  목: number;

  화: number;

  토: number;

  금: number;

  수: number;

  total: number;
};

export type DayMaster = {
  korean: string;

  hanja: string;

  element: FiveElement;

  yinYang: YinYang;
};

export type TenGodPosition = {
  stem: string;

  branch: string;
};

export type TenGodChart = {
  year: TenGodPosition;

  month: TenGodPosition;

  day: TenGodPosition;

  hour: TenGodPosition | null;
};

export type MajorLuckPillar = {
  age: number | null;

  korean: string;

  hanja: string;

  heavenlyStem: string;

  earthlyBranch: string;
};

export type MajorLuck = {
  forward: boolean;

  direction:
    | "순행"
    | "역행";

  precision: MajorLuckPrecision;

  startAge: number | null;

  startYears: number | null;

  startMonths: number | null;

  startDays: number | null;

  pillars: MajorLuckPillar[];
};

export type SajuCalculationMetadata = {
  engineVersion: string;

  timezone: string;

  calendarType: CalendarType;

  timeKnown: boolean;

  timePrecision: TimePrecision;

  selectedShichen:
    | BirthShichen
    | null;

  effectiveBirthTime:
    | string
    | null;

  birthRegion: string;

  dayBoundary: "midnight";

  trueSolarTimeApplied: boolean;

  boundaryAmbiguous: boolean;
};

export type SajuCalculationResult = {
  fourPillars: {
    year: SajuPillar;

    month: SajuPillar;

    day: SajuPillar;

    hour: SajuPillar | null;
  };

  dayMaster: DayMaster;

  fiveElements: FiveElementCounts;

  tenGods: TenGodChart;

  voidBranches: string[];

  majorLuck: MajorLuck | null;

  warnings: string[];

  metadata: SajuCalculationMetadata;
};