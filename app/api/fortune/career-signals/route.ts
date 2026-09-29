import {
  NextResponse,
} from "next/server";

import {
  buildCareerSignals,
} from "@/lib/fortune/build-career-signals";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  SajuCalculationResult,
} from "@/types/saju";

export async function GET() {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
    return NextResponse.json(
      {
        ok: false,

        message:
          "로그인이 필요합니다.",
      },
      {
        status: 401,
      },
    );
  }

  const {
    data: result,
    error,
  } =
    await supabase
      .from(
        "fortune_results",
      )
      .select(
        `
        id,
        product_code,
        calculation_data,
        generation_status,
        created_at
        `,
      )
      .eq(
        "user_id",
        user.id,
      )
      .eq(
        "product_code",
        "career",
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        },
      )
      .limit(1)
      .maybeSingle();

  if (
    error
  ) {
    return NextResponse.json(
      {
        ok: false,

        message:
          error.message,
      },
      {
        status: 500,
      },
    );
  }

  if (!result) {
    return NextResponse.json(
      {
        ok: false,

        message:
          "직업·사업운 결과를 찾을 수 없습니다.",
      },
      {
        status: 404,
      },
    );
  }

  const calculation =
    result.calculation_data as
      SajuCalculationResult;

  const signals =
    buildCareerSignals(
      calculation,
    );

  return NextResponse.json({
    ok: true,

    resultId:
      result.id,

    generationStatus:
      result.generation_status,

    signals,
  });
}