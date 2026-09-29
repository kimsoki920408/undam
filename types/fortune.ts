export type BasicSajuInterpretation = {
  headline: string;

  summary: string;

  keywords: string[];

  personality: {
    title: string;

    description: string;
  };

  wealth: {
    preview: string;

    lockedTopics: string[];
  };

  love: {
    preview: string;

    lockedTopics: string[];
  };

  career: {
    preview: string;

    lockedTopics: string[];
  };

  elementInsight: {
    dominantElement: string;

    weakElement: string | null;

    description: string;
  };
};