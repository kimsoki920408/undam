"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  CareerConcern,
  CareerContext,
  CareerSatisfaction,
} from "@/types/career-context";

import {
  CAREER_CONCERN_LABELS,
  CAREER_SATISFACTION_LABELS,
} from "@/types/career-context";

type CareerContextFormProps = {
  resultId:
    string;

  initialContext?:
    CareerContext | null;
};

const interestOptions = [
  "현재 직업 유지",
  "이직",
  "영업",
  "전문직",
  "관리·리더",
  "창업·사업",
  "부업",
] as const;

const satisfactionOptions:
  CareerSatisfaction[] = [
    "very-low",
    "low",
    "neutral",
    "high",
    "very-high",
  ];

const concernOptions:
  CareerConcern[] = [
    "continue",
    "change-job",
    "income",
    "promotion",
    "business",
    "burnout",
    "other",
  ];

export function CareerContextForm({
  resultId,
  initialContext,
}: CareerContextFormProps) {
  const router =
    useRouter();

  const initialYears =
    initialContext?.experienceMonths
      ? Math.floor(
          initialContext.experienceMonths /
            12,
        )
      : 0;

  const initialMonths =
    initialContext?.experienceMonths
      ? initialContext.experienceMonths %
        12
      : 0;

  const [
    jobTitle,
    setJobTitle,
  ] = useState(
    initialContext?.jobTitle ??
      "",
  );

  const [
    mainWork,
    setMainWork,
  ] = useState(
    initialContext?.mainWork ??
      "",
  );

  const [
    experienceYears,
    setExperienceYears,
  ] = useState(
    initialYears,
  );

  const [
    experienceMonths,
    setExperienceMonths,
  ] = useState(
    initialMonths,
  );

  const [
    satisfaction,
    setSatisfaction,
  ] =
    useState<CareerSatisfaction | null>(
      initialContext?.satisfaction ??
        null,
    );

  const [
    primaryConcern,
    setPrimaryConcern,
  ] =
    useState<CareerConcern | null>(
      initialContext?.primaryConcern ??
        null,
    );

  const [
    concernDetail,
    setConcernDetail,
  ] = useState(
    initialContext?.concernDetail ??
      "",
  );

  const [
    wantsToStay,
    setWantsToStay,
  ] = useState<
    boolean | null
  >(
    initialContext?.wantsToStay ??
      null,
  );

  const [
    interests,
    setInterests,
  ] = useState<string[]>(
    initialContext?.interests ??
      [],
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(
    false,
  );

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(
    null,
  );

  const totalExperienceMonths =
    useMemo(
      () =>
        Math.max(
          0,
          experienceYears,
        ) *
          12 +
        Math.max(
          0,
          experienceMonths,
        ),
      [
        experienceYears,
        experienceMonths,
      ],
    );

  function toggleInterest(
    value:
      string,
  ) {
    setInterests(
      (
        current,
      ) =>
        current.includes(
          value,
        )
          ? current.filter(
              (
                item,
              ) =>
                item !==
                value,
            )
          : [
              ...current,
              value,
            ],
    );
  }

  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErrorMessage(
      null,
    );

    if (
      !jobTitle.trim() &&
      !mainWork.trim()
    ) {
      setErrorMessage(
        "현재 직업이나 실제로 하는 업무 중 하나는 입력해주세요.",
      );

      return;
    }

    setIsSubmitting(
      true,
    );

    try {
      const response =
        await fetch(
          "/api/fortune/career-context",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                {
                  resultId,

                  context: {
                    jobTitle:
                      jobTitle.trim(),

                    mainWork:
                      mainWork.trim(),

                    experienceMonths:
                      totalExperienceMonths,

                    satisfaction,

                    primaryConcern,

                    concernDetail:
                      concernDetail.trim(),

                    wantsToStay,

                    interests,
                  },
                },
              ),
          },
        );

      const data:
        unknown =
        await response.json();

      if (
        !response.ok
      ) {
        const message =
          data &&
          typeof data ===
            "object" &&
          "error" in data &&
          typeof (
            data as {
              error?: unknown;
            }
          ).error ===
            "string"
            ? (
                data as {
                  error:
                    string;
                }
              ).error
            : "직업 정보를 저장하지 못했습니다.";

        throw new Error(
          message,
        );
      }

      router.push(
        "/mypage?careerContext=saved",
      );

      router.refresh();
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof
          Error
          ? error.message
          : "직업 정보를 저장하지 못했습니다.",
      );
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-5"
    >
      {/* 현재 직업 */}
      <section className="undam-card p-6 sm:p-8">
        <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
          CURRENT WORK
        </p>

        <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#252525]">
          지금 어떤 일을 하고 있나요?
        </h2>

        <p className="mt-2 text-[12px] leading-6 text-[#8A847E]">
          직업 이름보다 실제로 어떤 일을 하는지가 더 중요해요.
        </p>

        <div className="mt-6 space-y-5">
          <label className="block">
            <span className="text-[12px] font-extrabold text-[#5E5954]">
              현재 직업·업종
            </span>

            <input
              type="text"
              value={
                jobTitle
              }
              onChange={(
                event,
              ) =>
                setJobTitle(
                  event
                    .target
                    .value,
                )
              }
              maxLength={
                80
              }
              placeholder="예: 보험설계사, 개발자, 카페 운영"
              className="mt-2 h-12 w-full rounded-[15px] border border-[#E2DED8] bg-white px-4 text-[13px] text-[#35312E] outline-none transition placeholder:text-[#B5B0AA] focus:border-[#766D8C]"
            />
          </label>

          <label className="block">
            <span className="text-[12px] font-extrabold text-[#5E5954]">
              실제로 하는 주요 업무
            </span>

            <textarea
              value={
                mainWork
              }
              onChange={(
                event,
              ) =>
                setMainWork(
                  event
                    .target
                    .value,
                )
              }
              maxLength={
                300
              }
              rows={
                4
              }
              placeholder="예: 신규 고객 상담, DB 영업, 보험 설계, 계약 후 고객 관리"
              className="mt-2 w-full resize-none rounded-[15px] border border-[#E2DED8] bg-white px-4 py-3 text-[13px] leading-6 text-[#35312E] outline-none transition placeholder:text-[#B5B0AA] focus:border-[#766D8C]"
            />

            <p className="mt-1 text-right text-[10px] text-[#AAA59E]">
              {
                mainWork.length
              }
              /300
            </p>
          </label>
        </div>
      </section>

      {/* 경력 */}
      <section className="undam-card p-6 sm:p-8">
        <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
          EXPERIENCE
        </p>

        <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#252525]">
          이 일을 얼마나 해왔나요?
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <label>
            <span className="text-[11px] font-bold text-[#77716B]">
              년
            </span>

            <input
              type="number"
              min={
                0
              }
              max={
                60
              }
              value={
                experienceYears
              }
              onChange={(
                event,
              ) =>
                setExperienceYears(
                  Number(
                    event
                      .target
                      .value,
                  ) ||
                    0,
                )
              }
              className="mt-2 h-12 w-full rounded-[15px] border border-[#E2DED8] bg-white px-4 text-[13px] font-bold text-[#35312E] outline-none focus:border-[#766D8C]"
            />
          </label>

          <label>
            <span className="text-[11px] font-bold text-[#77716B]">
              개월
            </span>

            <input
              type="number"
              min={
                0
              }
              max={
                11
              }
              value={
                experienceMonths
              }
              onChange={(
                event,
              ) =>
                setExperienceMonths(
                  Math.min(
                    11,
                    Math.max(
                      0,
                      Number(
                        event
                          .target
                          .value,
                      ) ||
                        0,
                    ),
                  ),
                )
              }
              className="mt-2 h-12 w-full rounded-[15px] border border-[#E2DED8] bg-white px-4 text-[13px] font-bold text-[#35312E] outline-none focus:border-[#766D8C]"
            />
          </label>
        </div>
      </section>

      {/* 만족도 */}
      <section className="undam-card p-6 sm:p-8">
        <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
          SATISFACTION
        </p>

        <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#252525]">
          지금 일에 얼마나 만족하나요?
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {satisfactionOptions.map(
            (
              option,
            ) => {
              const selected =
                satisfaction ===
                option;

              return (
                <button
                  key={
                    option
                  }
                  type="button"
                  onClick={
                    () =>
                      setSatisfaction(
                        option,
                      )
                  }
                  className={`min-h-11 rounded-[14px] border px-3 py-2 text-[11px] font-bold transition ${
                    selected
                      ? "border-[#29354F] bg-[#29354F] text-white"
                      : "border-[#E5E1DA] bg-white text-[#77716B] hover:border-[#B7B0C1]"
                  }`}
                >
                  {
                    CAREER_SATISFACTION_LABELS[
                      option
                    ]
                  }
                </button>
              );
            },
          )}
        </div>
      </section>

      {/* 고민 */}
      <section className="undam-card p-6 sm:p-8">
        <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
          YOUR CONCERN
        </p>

        <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#252525]">
          지금 가장 알고 싶은 건 무엇인가요?
        </h2>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {concernOptions.map(
            (
              option,
            ) => {
              const selected =
                primaryConcern ===
                option;

              return (
                <button
                  key={
                    option
                  }
                  type="button"
                  onClick={
                    () =>
                      setPrimaryConcern(
                        option,
                      )
                  }
                  className={`rounded-[15px] border px-4 py-3 text-left text-[12px] font-bold transition ${
                    selected
                      ? "border-[#29354F] bg-[#F0F2F6] text-[#29354F]"
                      : "border-[#E5E1DA] bg-white text-[#6F6963] hover:border-[#B7B0C1]"
                  }`}
                >
                  {
                    CAREER_CONCERN_LABELS[
                      option
                    ]
                  }
                </button>
              );
            },
          )}
        </div>

        <label className="mt-5 block">
          <span className="text-[12px] font-extrabold text-[#5E5954]">
            조금 더 자세히 알려주세요
            <span className="ml-1 font-medium text-[#AAA59E]">
              선택
            </span>
          </span>

          <textarea
            value={
              concernDetail
            }
            onChange={(
              event,
            ) =>
              setConcernDetail(
                event
                  .target
                  .value,
              )
            }
            maxLength={
              500
            }
            rows={
              4
            }
            placeholder="예: 영업은 재미있는데 수입이 생각보다 적어서 계속해야 할지 고민돼요."
            className="mt-2 w-full resize-none rounded-[15px] border border-[#E2DED8] bg-white px-4 py-3 text-[13px] leading-6 text-[#35312E] outline-none transition placeholder:text-[#B5B0AA] focus:border-[#766D8C]"
          />

          <p className="mt-1 text-right text-[10px] text-[#AAA59E]">
            {
              concernDetail.length
            }
            /500
          </p>
        </label>
      </section>

      {/* 유지 의향 */}
      <section className="undam-card p-6 sm:p-8">
        <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
          NEXT MOVE
        </p>

        <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#252525]">
          지금 일을 계속하고 싶은 마음은 어떤가요?
        </h2>

        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <ChoiceButton
            selected={
              wantsToStay ===
              true
            }
            onClick={
              () =>
                setWantsToStay(
                  true,
                )
            }
          >
            계속하고 싶어요
          </ChoiceButton>

          <ChoiceButton
            selected={
              wantsToStay ===
              null
            }
            onClick={
              () =>
                setWantsToStay(
                  null,
                )
            }
          >
            아직 모르겠어요
          </ChoiceButton>

          <ChoiceButton
            selected={
              wantsToStay ===
              false
            }
            onClick={
              () =>
                setWantsToStay(
                  false,
                )
            }
          >
            바꾸고 싶어요
          </ChoiceButton>
        </div>
      </section>

      {/* 관심 방향 */}
      <section className="undam-card p-6 sm:p-8">
        <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
          INTERESTS
        </p>

        <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.04em] text-[#252525]">
          관심 있는 다음 방향이 있나요?
        </h2>

        <p className="mt-2 text-[12px] leading-6 text-[#8A847E]">
          여러 개 선택해도 괜찮아요.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {interestOptions.map(
            (
              option,
            ) => {
              const selected =
                interests.includes(
                  option,
                );

              return (
                <button
                  key={
                    option
                  }
                  type="button"
                  onClick={
                    () =>
                      toggleInterest(
                        option,
                      )
                  }
                  className={`rounded-full border px-4 py-2.5 text-[11px] font-bold transition ${
                    selected
                      ? "border-[#766D8C] bg-[#F1EFF5] text-[#625B6D]"
                      : "border-[#E5E1DA] bg-white text-[#77716B]"
                  }`}
                >
                  {selected
                    ? "✓ "
                    : ""}
                  {
                    option
                  }
                </button>
              );
            },
          )}
        </div>
      </section>

      {errorMessage && (
        <div className="rounded-[17px] border border-[#F0D9D1] bg-[#FFF8F5] px-5 py-4">
          <p className="text-[12px] font-bold leading-5 text-[#B05E43]">
            {
              errorMessage
            }
          </p>
        </div>
      )}

      <div className="pt-1">
        <button
          type="submit"
          disabled={
            isSubmitting
          }
          className="undam-primary-button w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "저장하고 있어요..."
            : "이 정보로 직업운 분석 준비하기"}
        </button>

        <p className="mt-3 text-center text-[10px] leading-5 text-[#AAA59E]">
          입력한 직업정보는 사주 원국 계산을 바꾸지 않고,
          직업·커리어 해석 단계에서만 사용합니다.
        </p>
      </div>
    </form>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected:
    boolean;

  onClick:
    () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`rounded-[15px] border px-4 py-3 text-[12px] font-bold transition ${
        selected
          ? "border-[#29354F] bg-[#F0F2F6] text-[#29354F]"
          : "border-[#E5E1DA] bg-white text-[#716B65]"
      }`}
    >
      {children}
    </button>
  );
}