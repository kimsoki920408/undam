import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  calculateSaju,
} from "@/lib/saju/calculate-saju";

import type {
  BirthShichen,
  SajuInput,
} from "@/types/saju";

const validShichen =
  new Set<BirthShichen>([
    "자",
    "축",
    "인",
    "묘",
    "진",
    "사",
    "오",
    "미",
    "신",
    "유",
    "술",
    "해",
  ]);

function isDateString(
  value: unknown,
): value is string {
  return (
    typeof value ===
      "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      value,
    )
  );
}

function isTimeString(
  value: unknown,
): value is string {
  if (
    typeof value !==
      "string" ||
    !/^\d{2}:\d{2}$/.test(
      value,
    )
  ) {
    return false;
  }

  const [
    hour,
    minute,
  ] =
    value
      .split(":")
      .map(Number);

  return (
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  );
}

function isSajuInput(
  value: unknown,
): value is SajuInput {
  if (
    !value ||
    typeof value !==
      "object"
  ) {
    return false;
  }

  const input =
    value as Record<
      string,
      unknown
    >;

  const nicknameValid =
    typeof input.nickname ===
      "string" &&
    input.nickname
      .trim().length >
      0 &&
    input.nickname
      .trim().length <=
      30;

  const calendarValid =
    input.calendarType ===
      "solar" ||
    input.calendarType ===
      "lunar";

  const genderValid =
    input.gender ===
      "male" ||
    input.gender ===
      "female";

  const regionValid =
    typeof input.birthRegion ===
      "string" &&
    input.birthRegion
      .trim().length >
      0 &&
    input.birthRegion
      .trim().length <=
      100;

  const modeValid =
    input.birthTimeMode ===
      "exact" ||
    input.birthTimeMode ===
      "shichen" ||
    input.birthTimeMode ===
      "unknown";

  if (
    !nicknameValid ||
    !isDateString(
      input.birthDate,
    ) ||
    !calendarValid ||
    !genderValid ||
    !regionValid ||
    !modeValid ||
    typeof input.isLeapMonth !==
      "boolean"
  ) {
    return false;
  }

  if (
    input.birthTimeMode ===
    "exact"
  ) {
    return (
      isTimeString(
        input.birthTime,
      ) &&
      input.birthShichen ===
        null
    );
  }

  if (
    input.birthTimeMode ===
    "shichen"
  ) {
    return (
      input.birthTime ===
        null &&
      typeof input.birthShichen ===
        "string" &&
      validShichen.has(
        input.birthShichen as
          BirthShichen,
      )
    );
  }

  return (
    input.birthTime ===
      null &&
    input.birthShichen ===
      null
  );
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body:
      unknown =
      await request.json();

    if (
      !isSajuInput(body)
    ) {
      return NextResponse.json(
        {
          ok: false,

          message:
            "입력한 출생정보를 다시 확인해주세요.",
        },
        {
          status: 400,
        },
      );
    }

    const result =
      calculateSaju(body);

    return NextResponse.json(
      {
        ok: true,
        result,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "사주 계산 중 오류가 발생했습니다.";

    return NextResponse.json(
      {
        ok: false,
        message,
      },
      {
        status: 422,
      },
    );
  }
}