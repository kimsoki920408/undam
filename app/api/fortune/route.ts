export const maxDuration = 120;

import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  generatePaidFortune,
} from "@/lib/ai/generate-paid-fortune";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  PaidFortuneInterpretation,
} from "@/types/paid-fortune";

import type {
  ProductCode,
} from "@/types/product";

import type {
  SajuCalculationResult,
  SajuInput,
} from "@/types/saju";

const supportedProducts =
  new Set<ProductCode>([
    "wealth",
    "love",
    "career",
    "full_saju",
  ]);

export async function POST(
  request: NextRequest,
) {
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

  try {
    const body =
      (await request.json()) as {
        resultId?:
          unknown;
      };

    if (
      typeof body.resultId !==
        "string" ||
      !body.resultId
    ) {
      return NextResponse.json(
        {
          ok: false,

          message:
            "결과 ID가 필요합니다.",
        },
        {
          status: 400,
        },
      );
    }

    const admin =
      createAdminClient();

    /*
     * 유료 결과를 찾고
     * 현재 로그인한 사용자의 것인지 확인.
     */
    const {
      data: result,
      error: resultError,
    } =
      await admin
        .from(
          "fortune_results",
        )
        .select(
          `
          id,
          user_id,
          source_order_id,
          product_code,
          generation_status,
          input_data,
          calculation_data,
          interpretation_data
          `,
        )
        .eq(
          "id",
          body.resultId,
        )
        .eq(
          "user_id",
          user.id,
        )
        .maybeSingle();

    if (
      resultError
    ) {
      throw new Error(
        resultError.message,
      );
    }

    if (!result) {
      return NextResponse.json(
        {
          ok: false,

          message:
            "구매한 결과를 찾을 수 없습니다.",
        },
        {
          status: 404,
        },
      );
    }

    if (
      !result.source_order_id
    ) {
      return NextResponse.json(
        {
          ok: false,

          message:
            "유료 결과가 아닙니다.",
        },
        {
          status: 400,
        },
      );
    }

    const productCode =
      result.product_code as
        ProductCode | null;

    if (
      !productCode ||
      !supportedProducts.has(
        productCode,
      )
    ) {
      return NextResponse.json(
        {
          ok: false,

          message:
            "현재 이 상품의 유료 해석 생성은 지원하지 않습니다.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * 실제 PAID 주문인지 서버에서 재확인.
     */
    const {
      data: order,
      error: orderError,
    } =
      await admin
        .from("orders")
        .select(
          `
          id,
          status,
          user_id
          `,
        )
        .eq(
          "id",
          result.source_order_id,
        )
        .eq(
          "user_id",
          user.id,
        )
        .maybeSingle();

    if (
      orderError
    ) {
      throw new Error(
        orderError.message,
      );
    }

    if (
      !order ||
      order.status !==
        "PAID"
    ) {
      return NextResponse.json(
        {
          ok: false,

          message:
            "결제가 완료된 주문을 확인할 수 없습니다.",
        },
        {
          status: 403,
        },
      );
    }

    /*
     * 이미 완성됐다면 다시 생성하지 않고
     * 기존 결과를 반환.
     */
    if (
      result.generation_status ===
        "COMPLETED" &&
      result.interpretation_data
    ) {
      return NextResponse.json({
        ok: true,

        alreadyGenerated:
          true,

        resultId:
          result.id,

        interpretation:
          result.interpretation_data as
            PaidFortuneInterpretation,
      });
    }

    /*
     * 생성 시작
     */
    const {
      error:
        generatingError,
    } =
      await admin
        .from(
          "fortune_results",
        )
        .update({
          generation_status:
            "GENERATING",

          generation_error:
            null,
        })
        .eq(
          "id",
          result.id,
        );

    if (
      generatingError
    ) {
      throw new Error(
        generatingError.message,
      );
    }

    try {
      const interpretation =
        await generatePaidFortune({
          productCode,

          input:
            result.input_data as
              SajuInput,

          calculation:
            result.calculation_data as
              SajuCalculationResult,
        });

      const {
        error:
          completedError,
      } =
        await admin
          .from(
            "fortune_results",
          )
          .update({
            interpretation_data:
              interpretation,

            interpretation_version:
              interpretation.version,

            generation_status:
              "COMPLETED",

            generation_error:
              null,
          })
          .eq(
            "id",
            result.id,
          );

      if (
        completedError
      ) {
        throw new Error(
          completedError.message,
        );
      }

      return NextResponse.json({
        ok: true,

        alreadyGenerated:
          false,

        resultId:
          result.id,

        interpretation,
      });
    } catch (
      generationError
    ) {
      const message =
        generationError instanceof Error
          ? generationError.message
          : "유료 해석 생성 중 오류가 발생했습니다.";

      await admin
        .from(
          "fortune_results",
        )
        .update({
          generation_status:
            "FAILED",

          generation_error:
            message,
        })
        .eq(
          "id",
          result.id,
        );

      return NextResponse.json(
        {
          ok: false,

          message,
        },
        {
          status: 500,
        },
      );
    }
  } catch (
    error
  ) {
    return NextResponse.json(
      {
        ok: false,

        message:
          error instanceof Error
            ? error.message
            : "유료 해석 처리 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}