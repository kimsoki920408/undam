import type {
  ProductCode,
} from "@/types/product";

import type {
  CareerFortuneDetail,
} from "@/types/career-fortune";

export type PaidFortuneBasis = {
  label: string;

  value: string;

  description: string;
};

export type PaidFortuneAction = {
  title: string;

  description: string;
};

export type PaidFortuneSection = {
  id: string;

  title: string;

  subtitle?: string;

  summary?: string;

  content: string[];

  keywords?: string[];

  basis?: PaidFortuneBasis[];

  actions?: PaidFortuneAction[];

  caution?: string;
};

export type PaidFortuneInterpretation = {
  generation?: { provider: "rules" | "openai"; model: string | null; promptVersion: string };

  version: string;

  productCode:
    ProductCode;

  headline: string;

  summary: string;

  keyTakeaways:
    string[];

  sections:
    PaidFortuneSection[];

  actionPoints:
    string[];

  caution: string;

  careerDetail?:
  CareerFortuneDetail;

  generatedAt: string;
};