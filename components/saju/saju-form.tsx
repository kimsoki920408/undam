"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  BirthShichen,
  BirthTimeMode,
  SajuCalculationResult,
  SajuInput,
} from "@/types/saju";

import type {
  SavedSajuProfile,
} from "@/app/saju/page";

type CalendarType =
  "solar" | "lunar";

type LunarType =
  "normal" | "leap";

type Gender =
  "male" | "female" | "";

type FormData = {
  nickname: string;

  calendarType:
    CalendarType;

  lunarType:
    LunarType;

  birthDate: string;

  birthTimeMode:
    BirthTimeMode;

  birthTime: string;

  birthShichen:
    BirthShichen | "";

  gender: Gender;

  birthRegion: string;
};

type CalculationResponse = {
  ok: boolean;

  result?:
    SajuCalculationResult;

  message?: string;
};

const RESULT_STORAGE_KEY =
  "undam:temporary-saju-result";

const shichenOptions: Array<{
  value: BirthShichen;
  label: string;
}> = [
  {
    value: "자",
    label:
      "자시 · 23:00 ~ 00:59",
  },
  {
    value: "축",
    label:
      "축시 · 01:00 ~ 02:59",
  },
  {
    value: "인",
    label:
      "인시 · 03:00 ~ 04:59",
  },
  {
    value: "묘",
    label:
      "묘시 · 05:00 ~ 06:59",
  },
  {
    value: "진",
    label:
      "진시 · 07:00 ~ 08:59",
  },
  {
    value: "사",
    label:
      "사시 · 09:00 ~ 10:59",
  },
  {
    value: "오",
    label:
      "오시 · 11:00 ~ 12:59",
  },
  {
    value: "미",
    label:
      "미시 · 13:00 ~ 14:59",
  },
  {
    value: "신",
    label:
      "신시 · 15:00 ~ 16:59",
  },
  {
    value: "유",
    label:
      "유시 · 17:00 ~ 18:59",
  },
  {
    value: "술",
    label:
      "술시 · 19:00 ~ 20:59",
  },
  {
    value: "해",
    label:
      "해시 · 21:00 ~ 22:59",
  },
];

const initialFormData:
  FormData = {
  nickname: "",

  calendarType:
    "solar",

  lunarType:
    "normal",

  birthDate: "",

  birthTimeMode:
    "exact",

  birthTime: "",

  birthShichen: "",

  gender: "",

  birthRegion: "",
};

const stepLabels = [
  "생년월일",
  "태어난 시간",
  "성별",
  "출생지역",
];

type SajuFormProps = {
  savedProfile?:
    SavedSajuProfile | null;
};

export function SajuForm({
  savedProfile,
}: SajuFormProps) {
  const router =
    useRouter();

  const [
    step,
    setStep,
  ] =
    useState(1);

  const [
    formData,
    setFormData,
  ] =
    useState<FormData>(() => {
  if (!savedProfile) {
    return initialFormData;
  }

  return {
    nickname:
      savedProfile.nickname,

    calendarType:
      savedProfile.calendarType,

    lunarType:
      savedProfile.isLeapMonth
        ? "leap"
        : "normal",

    birthDate:
      savedProfile.birthDate,

    birthTimeMode:
      savedProfile.birthTimeMode,

    birthTime:
      savedProfile.birthTime ?? "",

    birthShichen:
      savedProfile.birthShichen ?? "",

    gender:
      savedProfile.gender,

    birthRegion:
      savedProfile.birthRegion,
  };
});

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    completed,
    setCompleted,
  ] =
    useState(false);

  const [
    calculating,
    setCalculating,
  ] =
    useState(false);

  const updateForm = <
    K extends keyof FormData,
  >(
    key: K,
    value: FormData[K],
  ) => {
    setFormData(
      (previous) => ({
        ...previous,
        [key]: value,
      }),
    );

    setError("");
  };

  const setTimeMode = (
    mode:
      BirthTimeMode,
  ) => {
    setFormData(
      (previous) => ({
        ...previous,

        birthTimeMode:
          mode,

        birthTime:
          mode === "exact"
            ? previous.birthTime
            : "",

        birthShichen:
          mode === "shichen"
            ? previous.birthShichen
            : "",
      }),
    );

    setError("");
  };

  const validateCurrentStep =
    () => {
      if (
        step === 1
      ) {
        if (
          !formData.nickname
            .trim()
        ) {
          setError(
            "이름 또는 닉네임을 입력해주세요.",
          );

          return false;
        }

        if (
          !formData.birthDate
        ) {
          setError(
            "생년월일을 선택해주세요.",
          );

          return false;
        }
      }

      if (
        step === 2
      ) {
        if (
          formData
            .birthTimeMode ===
            "exact" &&
          !formData.birthTime
        ) {
          setError(
            "태어난 시간을 입력해주세요.",
          );

          return false;
        }

        if (
          formData
            .birthTimeMode ===
            "shichen" &&
          !formData.birthShichen
        ) {
          setError(
            "대략적인 시간대를 선택해주세요.",
          );

          return false;
        }
      }

      if (
        step === 3 &&
        !formData.gender
      ) {
        setError(
          "성별을 선택해주세요.",
        );

        return false;
      }

      if (
        step === 4 &&
        !formData.birthRegion
          .trim()
      ) {
        setError(
          "출생지역을 입력해주세요.",
        );

        return false;
      }

      setError("");

      return true;
    };

  const handleNext =
    () => {
      if (
        !validateCurrentStep()
      ) {
        return;
      }

      if (
        step < 4
      ) {
        setStep(
          (current) =>
            current + 1,
        );

        window.scrollTo({
          top: 0,
          behavior:
            "smooth",
        });

        return;
      }

      setCompleted(
        true,
      );

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });
    };

  const handlePrevious =
    () => {
      if (
        step <= 1
      ) {
        return;
      }

      setStep(
        (current) =>
          current - 1,
      );

      setError("");
    };

  const handleEdit =
    () => {
      setCompleted(
        false,
      );

      setStep(1);

      setError("");

      window.scrollTo({
        top: 0,
        behavior:
          "smooth",
      });
    };

  const formatBirthTime =
    () => {
      if (
        formData
          .birthTimeMode ===
        "exact"
      ) {
        return `${formData.birthTime} · 정확한 시간`;
      }

      if (
        formData
          .birthTimeMode ===
          "shichen"
      ) {
        const option =
          shichenOptions.find(
            (item) =>
              item.value ===
              formData.birthShichen,
          );

        return (
          option?.label ||
          "대략적인 시간대"
        );
      }

      return "모름";
    };

  const handleCalculate =
    async () => {
      if (
        !formData.gender
      ) {
        setError(
          "성별 정보가 없습니다.",
        );

        return;
      }

      const input:
        SajuInput = {
        nickname:
          formData.nickname
            .trim(),

        birthDate:
          formData.birthDate,

        birthTimeMode:
          formData
            .birthTimeMode,

        birthTime:
          formData
            .birthTimeMode ===
            "exact"
            ? formData.birthTime
            : null,

        birthShichen:
          formData
            .birthTimeMode ===
            "shichen"
            ? formData
                .birthShichen ||
              null
            : null,

        calendarType:
          formData
            .calendarType,

        isLeapMonth:
          formData
            .calendarType ===
            "lunar" &&
          formData
            .lunarType ===
            "leap",

        gender:
          formData.gender,

        birthRegion:
          formData.birthRegion
            .trim(),
      };

      setCalculating(
        true,
      );

      setError("");

      try {
        const response =
          await fetch(
            "/api/saju/calculate",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  input,
                ),
            },
          );

        const data =
          (await response.json()) as
            CalculationResponse;

        if (
          !response.ok ||
          !data.ok ||
          !data.result
        ) {
          throw new Error(
            data.message ||
              "사주 계산에 실패했습니다.",
          );
        }

        sessionStorage.setItem(
  RESULT_STORAGE_KEY,

  JSON.stringify({
    profileId:
      savedProfile?.id ??
      null,

    input,

    result:
      data.result,

    createdAt:
      new Date()
        .toISOString(),
  }),
);

        router.push(
          "/result",
        );
      } catch (
        caughtError
      ) {
        const message =
          caughtError instanceof
          Error
            ? caughtError.message
            : "사주 계산 중 오류가 발생했습니다.";

        setError(message);

        setCalculating(
          false,
        );
      }
    };

  if (
    calculating
  ) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-[#E5E1DA] bg-white shadow-[0_10px_40px_rgba(37,37,37,0.04)]">
        <div className="px-6 py-16 text-center sm:px-9 sm:py-20">
          <div className="mx-auto flex size-16 items-center justify-center rounded-[22px] bg-[#F1EFF5]">
            <div className="size-7 animate-spin rounded-full border-[3px] border-[#D6D0DD] border-t-[#766D8C]" />
          </div>

          <p className="mt-7 text-[12px] font-extrabold tracking-[0.08em] text-[#766D8C]">
            CALCULATING
          </p>

          <h2 className="mt-3 text-[26px] font-extrabold leading-[1.35] tracking-[-0.045em] text-[#252525] sm:text-[30px]">
            당신이 태어난 순간의
            <br />
            정보를 살펴보고 있어요.
          </h2>

          <p className="mx-auto mt-4 max-w-sm text-[13px] leading-6 tracking-[-0.02em] text-[#88837D]">
            입력한 생년월일과 시간 정보를 기준으로
            사주의 기본 구조를 계산하고 있습니다.
          </p>
        </div>
      </div>
    );
  }

  if (
    completed
  ) {
    return (
      <div className="overflow-hidden rounded-[28px] border border-[#E5E1DA] bg-white shadow-[0_10px_40px_rgba(37,37,37,0.04)]">
        <div className="px-6 py-8 sm:px-9 sm:py-10">
          <div className="flex size-12 items-center justify-center rounded-[17px] bg-[#EEF3EE] text-[20px] text-[#62806A]">
            ✓
          </div>

          <p className="mt-6 text-[12px] font-extrabold tracking-[0.05em] text-[#766D8C]">
            INPUT COMPLETE
          </p>

          <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.05em] text-[#252525]">
            입력이 완료됐어요.
          </h2>

          <p className="mt-3 text-[14px] leading-7 tracking-[-0.02em] text-[#77736E]">
            계산하기 전에 입력한 출생정보를 한 번 확인해주세요.
          </p>

          <div className="mt-7 divide-y divide-[#ECE9E3] rounded-[22px] border border-[#E8E5DF] bg-[#FAFAF8] px-5">
            <SummaryRow
              label="이름"
              value={
                formData.nickname
              }
            />

            <SummaryRow
              label="생년월일"
              value={`${formData.birthDate} · ${
                formData.calendarType ===
                "solar"
                  ? "양력"
                  : "음력"
              }${
                formData.calendarType ===
                "lunar"
                  ? formData.lunarType ===
                    "leap"
                    ? " · 윤달"
                    : " · 평달"
                  : ""
              }`}
            />

            <SummaryRow
              label="태어난 시간"
              value={
                formatBirthTime()
              }
            />

            <SummaryRow
              label="성별"
              value={
                formData.gender ===
                "male"
                  ? "남성"
                  : "여성"
              }
            />

            <SummaryRow
              label="출생지역"
              value={
                formData.birthRegion
              }
            />
          </div>

          {formData
            .birthTimeMode ===
            "unknown" && (
            <div className="mt-5 rounded-[18px] bg-[#F3F1F6] px-5 py-4">
              <p className="text-[13px] leading-6 text-[#6F6878]">
                출생시간이 없어 시주는 제외합니다.
                대운의 흐름은 표시하되 정확한 시작
                나이는 표시하지 않습니다.
              </p>
            </div>
          )}

          {formData
            .birthTimeMode ===
            "shichen" && (
            <div className="mt-5 rounded-[18px] bg-[#F3F1F6] px-5 py-4">
              <p className="text-[13px] leading-6 text-[#6F6878]">
                선택한 시진 안에서는 같은 시주로
                계산됩니다. 대운 시작 시점은 해당
                시간대의 대표시각을 사용한 근사값입니다.
              </p>
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-[16px] bg-[#FAEEEE] px-4 py-3 text-[12px] font-medium text-[#A9534B]">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={
                handleEdit
              }
              className="undam-secondary-button flex-1"
            >
              입력 수정하기
            </button>

            <button
              type="button"
              onClick={
                handleCalculate
              }
              className="undam-primary-button flex-1"
            >
              내 사주 계산하기
              <span className="ml-2">
                →
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-[#E5E1DA] bg-white shadow-[0_10px_40px_rgba(37,37,37,0.04)]">
      <div className="border-b border-[#EEEAE4] px-6 py-6 sm:px-9">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[12px] font-extrabold text-[#766D8C]">
              {step} / 4
            </p>

            <p className="mt-1 text-[13px] font-bold text-[#77736E]">
              {
                stepLabels[
                  step - 1
                ]
              }
            </p>
          </div>

          <p className="text-[12px] font-medium text-[#AAA59E]">
            약 1분
          </p>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className={`h-1.5 rounded-full ${
                  item <=
                  step
                    ? "bg-[#29354F]"
                    : "bg-[#ECE9E3]"
                }`}
              />
            ),
          )}
        </div>
      </div>

      <div className="px-6 py-8 sm:px-9 sm:py-10">
        {step === 1 && (
          <BirthDateStep
            formData={
              formData
            }
            updateForm={
              updateForm
            }
          />
        )}

        {step === 2 && (
          <BirthTimeStep
            formData={
              formData
            }
            updateForm={
              updateForm
            }
            setTimeMode={
              setTimeMode
            }
          />
        )}

        {step === 3 && (
          <GenderStep
            formData={
              formData
            }
            updateForm={
              updateForm
            }
          />
        )}

        {step === 4 && (
          <BirthRegionStep
            formData={
              formData
            }
            updateForm={
              updateForm
            }
          />
        )}

        {error && (
          <div className="mt-6 rounded-[16px] bg-[#FAEEEE] px-4 py-3 text-[12px] font-medium text-[#A9534B]">
            {error}
          </div>
        )}

        <div className="mt-9 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={
                handlePrevious
              }
              className="undam-secondary-button min-w-[96px]"
            >
              이전
            </button>
          )}

          <button
            type="button"
            onClick={
              handleNext
            }
            className="undam-primary-button flex-1"
          >
            {step === 4
              ? "입력 완료"
              : "다음"}

            <span className="ml-2">
              →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

type StepProps = {
  formData:
    FormData;

  updateForm: <
    K extends keyof FormData,
  >(
    key: K,
    value: FormData[K],
  ) => void;
};

function BirthDateStep({
  formData,
  updateForm,
}: StepProps) {
  return (
    <>
      <StepHeading
        title="생년월일을 알려주세요."
        description="사주의 네 기둥을 계산하기 위한 기본 정보예요."
      />

      <div className="mt-8">
        <Label>
          이름 또는 닉네임
        </Label>

        <input
          type="text"
          value={
            formData.nickname
          }
          onChange={(
            event,
          ) =>
            updateForm(
              "nickname",
              event.target.value,
            )
          }
          placeholder="예: 운담이"
          autoComplete="off"
          maxLength={30}
          className="mt-2 h-[54px] w-full rounded-[16px] border border-[#E2DED7] bg-[#FAFAF8] px-4 text-[15px] font-medium text-[#252525] outline-none focus:border-[#8C849B] focus:bg-white"
        />
      </div>

      <div className="mt-6">
        <Label>
          달력 기준
        </Label>

        <div className="mt-2 grid grid-cols-2 gap-3">
          <ChoiceButton
            selected={
              formData.calendarType ===
              "solar"
            }
            onClick={() =>
              updateForm(
                "calendarType",
                "solar",
              )
            }
          >
            양력
          </ChoiceButton>

          <ChoiceButton
            selected={
              formData.calendarType ===
              "lunar"
            }
            onClick={() =>
              updateForm(
                "calendarType",
                "lunar",
              )
            }
          >
            음력
          </ChoiceButton>
        </div>
      </div>

      {formData.calendarType ===
        "lunar" && (
        <div className="mt-4">
          <Label>
            음력 구분
          </Label>

          <div className="mt-2 grid grid-cols-2 gap-3">
            <ChoiceButton
              selected={
                formData.lunarType ===
                "normal"
              }
              onClick={() =>
                updateForm(
                  "lunarType",
                  "normal",
                )
              }
            >
              평달
            </ChoiceButton>

            <ChoiceButton
              selected={
                formData.lunarType ===
                "leap"
              }
              onClick={() =>
                updateForm(
                  "lunarType",
                  "leap",
                )
              }
            >
              윤달
            </ChoiceButton>
          </div>
        </div>
      )}

      <div className="mt-6">
        <Label>
          생년월일
        </Label>

        <input
          type="date"
          value={
            formData.birthDate
          }
          onChange={(
            event,
          ) =>
            updateForm(
              "birthDate",
              event.target.value,
            )
          }
          min="1900-01-01"
          max="2100-12-31"
          className="mt-2 h-[54px] w-full rounded-[16px] border border-[#E2DED7] bg-[#FAFAF8] px-4 text-[15px] font-medium text-[#252525] outline-none focus:border-[#8C849B] focus:bg-white"
        />
      </div>
    </>
  );
}

function BirthTimeStep({
  formData,
  updateForm,
  setTimeMode,
}: StepProps & {
  setTimeMode: (
    mode:
      BirthTimeMode,
  ) => void;
}) {
  return (
    <>
      <StepHeading
        title="태어난 시간을 얼마나 알고 있나요?"
        description="정확한 시간뿐 아니라 대략적인 시간대만 알아도 괜찮아요."
      />

      <div className="mt-8 space-y-3">
        <TimeModeButton
          selected={
            formData
              .birthTimeMode ===
            "exact"
          }
          title="정확한 시간을 알아요"
          description="시와 분까지 입력할 수 있어요."
          onClick={() =>
            setTimeMode(
              "exact",
            )
          }
        />

        <TimeModeButton
          selected={
            formData
              .birthTimeMode ===
            "shichen"
          }
          title="대략적인 시간대만 알아요"
          description="자시·축시·인시처럼 2시간 단위로 선택해요."
          onClick={() =>
            setTimeMode(
              "shichen",
            )
          }
        />

        <TimeModeButton
          selected={
            formData
              .birthTimeMode ===
            "unknown"
          }
          title="태어난 시간을 몰라요"
          description="시주는 제외하고 확인 가능한 내용만 계산해요."
          onClick={() =>
            setTimeMode(
              "unknown",
            )
          }
        />
      </div>

      {formData
        .birthTimeMode ===
        "exact" && (
        <div className="mt-7">
          <Label>
            태어난 시간
          </Label>

          <input
            type="time"
            value={
              formData.birthTime
            }
            onChange={(
              event,
            ) =>
              updateForm(
                "birthTime",
                event.target.value,
              )
            }
            className="mt-2 h-[58px] w-full rounded-[16px] border border-[#E2DED7] bg-[#FAFAF8] px-4 text-[16px] font-bold text-[#252525] outline-none focus:border-[#8C849B]"
          />
        </div>
      )}

      {formData
        .birthTimeMode ===
        "shichen" && (
        <div className="mt-7">
          <Label>
            대략적인 시간대
          </Label>

          <select
            value={
              formData
                .birthShichen
            }
            onChange={(
              event,
            ) =>
              updateForm(
                "birthShichen",
                event.target
                  .value as
                  | BirthShichen
                  | "",
              )
            }
            className="mt-2 h-[58px] w-full rounded-[16px] border border-[#E2DED7] bg-[#FAFAF8] px-4 text-[15px] font-bold text-[#252525] outline-none focus:border-[#8C849B]"
          >
            <option value="">
              시간대를 선택해주세요
            </option>

            {shichenOptions.map(
              (option) => (
                <option
                  key={
                    option.value
                  }
                  value={
                    option.value
                  }
                >
                  {
                    option.label
                  }
                </option>
              ),
            )}
          </select>

          <div className="mt-4 rounded-[17px] bg-[#F5F3EF] px-4 py-4">
            <p className="text-[12px] leading-5 text-[#88837D]">
              예: 09:00~10:59는 사시,
              11:00~12:59는 오시입니다.
              알고 있는 시간 범위가 정확히 경계에
              걸친다면 현재는 “태어난 시간을 몰라요”를
              선택하는 것이 더 안전합니다.
            </p>
          </div>
        </div>
      )}

      {formData
        .birthTimeMode ===
        "unknown" && (
        <div className="mt-7 rounded-[20px] bg-[#F3F1F6] px-5 py-5">
          <p className="text-[13px] font-bold text-[#56505F]">
            시간 없이도 기본 사주는 확인할 수 있어요.
          </p>

          <p className="mt-2 text-[12px] leading-5 text-[#77717F]">
            년주·월주·일주와 일간, 오행,
            시간과 무관한 십신 정보를 계산합니다.
            대운은 흐름만 표시하고 정확한 시작 나이는
            표시하지 않습니다.
          </p>
        </div>
      )}
    </>
  );
}

function GenderStep({
  formData,
  updateForm,
}: StepProps) {
  return (
    <>
      <StepHeading
        title="성별을 선택해주세요."
        description="사주 계산에 필요한 정보로 사용됩니다."
      />

      <div className="mt-8 grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() =>
            updateForm(
              "gender",
              "male",
            )
          }
          className={`min-h-[150px] rounded-[24px] border p-5 text-left ${
            formData.gender ===
            "male"
              ? "border-[#8F98AA] bg-[#F0F2F6]"
              : "border-[#E5E1DA] bg-white"
          }`}
        >
          <div className="flex size-11 items-center justify-center rounded-[15px] bg-[#EEF0F5] text-lg font-bold text-[#52617E]">
            M
          </div>

          <p className="mt-5 text-[17px] font-extrabold text-[#252525]">
            남성
          </p>
        </button>

        <button
          type="button"
          onClick={() =>
            updateForm(
              "gender",
              "female",
            )
          }
          className={`min-h-[150px] rounded-[24px] border p-5 text-left ${
            formData.gender ===
            "female"
              ? "border-[#CBAFBA] bg-[#F7EFF2]"
              : "border-[#E5E1DA] bg-white"
          }`}
        >
          <div className="flex size-11 items-center justify-center rounded-[15px] bg-[#F5EDF0] text-lg font-bold text-[#A46878]">
            F
          </div>

          <p className="mt-5 text-[17px] font-extrabold text-[#252525]">
            여성
          </p>
        </button>
      </div>
    </>
  );
}

function BirthRegionStep({
  formData,
  updateForm,
}: StepProps) {
  return (
    <>
      <StepHeading
        title="어디에서 태어났나요?"
        description="출생지역은 계산 기준을 명확하게 관리하기 위해 받는 정보예요."
      />

      <div className="mt-8">
        <Label>
          출생지역
        </Label>

        <input
          type="text"
          value={
            formData.birthRegion
          }
          onChange={(
            event,
          ) =>
            updateForm(
              "birthRegion",
              event.target.value,
            )
          }
          placeholder="예: 서울특별시"
          autoComplete="off"
          maxLength={100}
          className="mt-2 h-[54px] w-full rounded-[16px] border border-[#E2DED7] bg-[#FAFAF8] px-4 text-[15px] font-medium text-[#252525] outline-none focus:border-[#8C849B]"
        />
      </div>

      <div className="mt-7 rounded-[20px] bg-[#F5F3EF] px-5 py-5">
        <p className="text-[13px] font-bold text-[#45413D]">
          출생정보는 자동 저장하지 않아요.
        </p>

        <p className="mt-1.5 text-[12px] leading-5 text-[#88837D]">
          현재 결과는 이 브라우저 탭에서만
          임시로 사용됩니다.
        </p>
      </div>
    </>
  );
}

function TimeModeButton({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;

  title: string;

  description: string;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-[19px] border px-4 py-4 text-left ${
        selected
          ? "border-[#8E879A] bg-[#F3F1F6]"
          : "border-[#E5E1DA] bg-white"
      }`}
    >
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
          selected
            ? "border-[#766D8C]"
            : "border-[#CBC6BF]"
        }`}
      >
        {selected && (
          <span className="size-3 rounded-full bg-[#766D8C]" />
        )}
      </span>

      <span>
        <span className="block text-[14px] font-bold text-[#343434]">
          {title}
        </span>

        <span className="mt-1 block text-[12px] leading-5 text-[#8B8680]">
          {description}
        </span>
      </span>
    </button>
  );
}

function StepHeading({
  title,
  description,
}: {
  title: string;

  description: string;
}) {
  return (
    <div>
      <h2 className="text-[25px] font-extrabold leading-[1.35] tracking-[-0.045em] text-[#252525] sm:text-[29px]">
        {title}
      </h2>

      <p className="mt-3 text-[13px] leading-6 text-[#77736E] sm:text-[14px]">
        {description}
      </p>
    </div>
  );
}

function Label({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <p className="text-[13px] font-bold text-[#56524D]">
      {children}
    </p>
  );
}

function ChoiceButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;

  onClick: () => void;

  children:
    React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[52px] rounded-[16px] border text-[14px] font-bold ${
        selected
          ? "border-[#29354F] bg-[#29354F] text-white"
          : "border-[#E2DED7] bg-white text-[#56524D]"
      }`}
    >
      {children}
    </button>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 py-4">
      <span className="shrink-0 text-[12px] font-bold text-[#99948E]">
        {label}
      </span>

      <span className="text-right text-[13px] font-bold leading-5 text-[#343434]">
        {value}
      </span>
    </div>
  );
}