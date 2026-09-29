import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  calculateSaju,
} from "@/lib/saju/calculate-saju";

import type {
  BirthShichen,
  BirthTimeMode,
  CalendarType,
  Gender,
  SajuInput,
} from "@/types/saju";

export const runtime =
  "nodejs";

type TossPaymentResponse = {
  paymentKey?:
    string;

  orderId?:
    string;

  method?:
    string | null;

  approvedAt?:
    string | null;

  status?:
    string;

  code?:
    string;

  message?:
    string;

  [key: string]:
    unknown;
};

type OrderRow = {
  id: string;

  order_id: string;

  user_id: string;

  product_id: string;

  profile_id:
    string | null;

  product_code: string;

  amount: number;

  status: string;

  payment_key:
    string | null;
};

function redirectToFail(
  request: NextRequest,
  params: {
    code:
      string;

    message:
      string;

    orderId?:
      string;
  },
) {
  const url =
    new URL(
      "/payment/fail",
      request.url,
    );

  url.searchParams.set(
    "code",
    params.code,
  );

  url.searchParams.set(
    "message",
    params.message,
  );

  if (
    params.orderId
  ) {
    url.searchParams.set(
      "orderId",
      params.orderId,
    );
  }

  return NextResponse.redirect(
    url,
  );
}

function redirectToComplete(
  request: NextRequest,
  orderId: string,
) {
  const url =
    new URL(
      "/payment/complete",
      request.url,
    );

  url.searchParams.set(
    "orderId",
    orderId,
  );

  return NextResponse.redirect(
    url,
  );
}

/*
 * 결제가 완료된 주문에 대해
 * 유료 결과 PENDING 레코드를 보장합니다.
 *
 * source_order_id UNIQUE 제약과 함께
 * 중복 생성을 막습니다.
 */
async function ensurePaidFortuneResult(
  admin:
    ReturnType<
      typeof createAdminClient
    >,

  order:
    OrderRow,
) {
  /*
   * 이미 이 주문으로 만들어진 결과가
   * 있다면 아무 것도 하지 않습니다.
   */
  const {
    data:
      existingResult,
    error:
      existingResultError,
  } =
    await admin
      .from(
        "fortune_results",
      )
      .select("id")
      .eq(
        "source_order_id",
        order.id,
      )
      .maybeSingle();

  if (
    existingResultError
  ) {
    throw new Error(
      existingResultError.message,
    );
  }

  if (
    existingResult
  ) {
    return;
  }

  /*
   * 유료 사주 결과는
   * 어떤 사주 프로필에 대한 구매인지
   * 반드시 알아야 합니다.
   */
  if (
    !order.profile_id
  ) {
    throw new Error(
      "주문과 연결된 사주 프로필이 없습니다.",
    );
  }

  /*
   * 주문에 연결된 상품의
   * fortune_type을 DB에서 확인합니다.
   */
  const {
    data:
      product,
    error:
      productError,
  } =
    await admin
      .from("products")
      .select(
        `
        code,
        fortune_type
        `,
      )
      .eq(
        "id",
        order.product_id,
      )
      .maybeSingle();

  if (
    productError
  ) {
    throw new Error(
      productError.message,
    );
  }

  if (!product) {
    throw new Error(
      "구매한 상품 정보를 찾을 수 없습니다.",
    );
  }

  /*
   * 해당 주문 사용자의 프로필을
   * 서버에서 직접 읽습니다.
   */
  const {
    data:
      profile,
    error:
      profileError,
  } =
    await admin
      .from(
        "saju_profiles",
      )
      .select(
        `
        id,
        nickname,
        gender,
        calendar_type,
        is_leap_month,
        birth_date,
        birth_time_mode,
        birth_time,
        birth_shichen,
        birth_region
        `,
      )
      .eq(
        "id",
        order.profile_id,
      )
      .eq(
        "user_id",
        order.user_id,
      )
      .maybeSingle();

  if (
    profileError
  ) {
    throw new Error(
      profileError.message,
    );
  }

  if (!profile) {
    throw new Error(
      "구매 대상 사주 프로필을 찾을 수 없습니다.",
    );
  }

  /*
   * DB 프로필을 현재 SajuInput 구조로 변환.
   */
  const input:
    SajuInput = {
    nickname:
      profile.nickname,

    gender:
      profile.gender as Gender,

    calendarType:
      profile.calendar_type as CalendarType,

    isLeapMonth:
      profile.is_leap_month,

    birthDate:
      profile.birth_date,

    birthTimeMode:
      profile.birth_time_mode as
        BirthTimeMode,

    birthTime:
      profile.birth_time
        ? profile.birth_time.slice(
            0,
            5,
          )
        : null,

    birthShichen:
      profile.birth_shichen as
        | BirthShichen
        | null,

    birthRegion:
      profile.birth_region,
  };

  /*
   * 사주 계산 데이터는
   * 클라이언트 값을 사용하지 않고
   * 서버에서 다시 계산합니다.
   */
  const calculation =
    calculateSaju(
      input,
    );

  /*
   * 유료 해석은 아직 생성하지 않습니다.
   *
   * 다음 STEP에서:
   * PENDING
   * → GENERATING
   * → COMPLETED
   *
   * 흐름으로 실제 해석을 생성합니다.
   */
  const {
    error:
      resultInsertError,
  } =
    await admin
      .from(
        "fortune_results",
      )
      .insert({
        user_id:
          order.user_id,

        profile_id:
          order.profile_id,

        fortune_type:
          product.fortune_type,

        input_data:
          input,

        calculation_data:
          calculation,

        interpretation_data:
          null,

        engine_version:
          calculation
            .metadata
            .engineVersion,

        interpretation_version:
          null,

        source_order_id:
          order.id,

        product_code:
          order.product_code,

        generation_status:
          "PENDING",

        generation_error:
          null,
      });

  if (
    resultInsertError
  ) {
    /*
     * 동시에 요청이 들어와 UNIQUE 제약에
     * 걸린 경우 실제로 이미 생성됐는지
     * 마지막으로 확인합니다.
     */
    const {
      data:
        retryExisting,
    } =
      await admin
        .from(
          "fortune_results",
        )
        .select("id")
        .eq(
          "source_order_id",
          order.id,
        )
        .maybeSingle();

    if (
      retryExisting
    ) {
      return;
    }

    throw new Error(
      resultInsertError.message,
    );
  }
}

export async function GET(
  request: NextRequest,
) {
  const paymentKey =
    request.nextUrl
      .searchParams
      .get(
        "paymentKey",
      );

  const orderId =
    request.nextUrl
      .searchParams
      .get(
        "orderId",
      );

  const amountParam =
    request.nextUrl
      .searchParams
      .get(
        "amount",
      );

  if (
    !paymentKey ||
    !orderId ||
    !amountParam
  ) {
    return redirectToFail(
      request,
      {
        code:
          "INVALID_PAYMENT_CALLBACK",

        message:
          "결제 정보를 확인할 수 없습니다.",

        orderId:
          orderId ??
          undefined,
      },
    );
  }

  const amount =
    Number(
      amountParam,
    );

  if (
    !Number.isInteger(
      amount,
    ) ||
    amount <= 0
  ) {
    return redirectToFail(
      request,
      {
        code:
          "INVALID_AMOUNT",

        message:
          "결제 금액이 올바르지 않습니다.",

        orderId,
      },
    );
  }

  try {
    const admin =
      createAdminClient();

    /*
     * 우리 DB의 주문 확인.
     */
    const {
      data:
        orderData,
      error:
        orderError,
    } =
      await admin
        .from("orders")
        .select(
          `
          id,
          order_id,
          user_id,
          product_id,
          profile_id,
          product_code,
          amount,
          status,
          payment_key
          `,
        )
        .eq(
          "order_id",
          orderId,
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
      !orderData
    ) {
      return redirectToFail(
        request,
        {
          code:
            "ORDER_NOT_FOUND",

          message:
            "주문 정보를 찾을 수 없습니다.",

          orderId,
        },
      );
    }

    const order =
      orderData as
        OrderRow;

    /*
     * 이미 결제 승인된 주문이라면
     * Toss에 중복 승인 요청을 하지 않습니다.
     *
     * 대신 유료 결과 레코드가 없는 경우
     * 여기에서 복구 생성합니다.
     */
    if (
      order.status ===
      "PAID"
    ) {
      await ensurePaidFortuneResult(
        admin,
        order,
      );

      return redirectToComplete(
        request,
        orderId,
      );
    }

    /*
     * 브라우저 callback 금액과
     * 우리 주문 DB 금액 확인.
     */
    if (
      amount !==
      order.amount
    ) {
      await admin
        .from("orders")
        .update({
          status:
            "FAILED",

          toss_response: {
            code:
              "AMOUNT_MISMATCH",

            callbackAmount:
              amount,

            orderAmount:
              order.amount,
          },
        })
        .eq(
          "id",
          order.id,
        );

      return redirectToFail(
        request,
        {
          code:
            "AMOUNT_MISMATCH",

          message:
            "주문 금액과 결제 금액이 일치하지 않습니다.",

          orderId,
        },
      );
    }

    const secretKey =
      process.env
        .TOSS_SECRET_KEY;

    if (
      !secretKey
    ) {
      throw new Error(
        "TOSS_SECRET_KEY가 설정되지 않았습니다.",
      );
    }

    const authorization =
      Buffer.from(
        `${secretKey}:`,
      ).toString(
        "base64",
      );

    /*
     * Toss 최종 승인.
     */
    const confirmResponse =
      await fetch(
        "https://api.tosspayments.com/v1/payments/confirm",
        {
          method:
            "POST",

          headers: {
            Authorization:
              `Basic ${authorization}`,

            "Content-Type":
              "application/json",

            "Idempotency-Key":
              order.id,
          },

          body:
            JSON.stringify({
              paymentKey,

              orderId:
                order.order_id,

              amount:
                order.amount,
            }),

          cache:
            "no-store",
        },
      );

    const payment =
      (await confirmResponse.json()) as
        TossPaymentResponse;

    if (
      !confirmResponse.ok
    ) {
      await admin
        .from("orders")
        .update({
          status:
            "FAILED",

          toss_response:
            payment,
        })
        .eq(
          "id",
          order.id,
        );

      return redirectToFail(
        request,
        {
          code:
            payment.code ??
            "PAYMENT_CONFIRM_FAILED",

          message:
            payment.message ??
            "결제 승인에 실패했습니다.",

          orderId,
        },
      );
    }

    /*
     * 결제 승인 성공.
     */
    const {
      error:
        updateError,
    } =
      await admin
        .from("orders")
        .update({
          status:
            "PAID",

          payment_key:
            payment.paymentKey ??
            paymentKey,

          payment_method:
            typeof payment.method ===
            "string"
              ? payment.method
              : null,

          toss_response:
            payment,

          approved_at:
            typeof payment.approvedAt ===
            "string"
              ? payment.approvedAt
              : new Date()
                  .toISOString(),
        })
        .eq(
          "id",
          order.id,
        );

    if (
      updateError
    ) {
      throw new Error(
        updateError.message,
      );
    }

    /*
     * PAID 상태가 확정된 뒤에만
     * 유료 결과 PENDING 생성.
     */
    const paidOrder:
      OrderRow = {
      ...order,

      status:
        "PAID",

      payment_key:
        payment.paymentKey ??
        paymentKey,
    };

    await ensurePaidFortuneResult(
      admin,
      paidOrder,
    );

    return redirectToComplete(
      request,
      orderId,
    );
  } catch (
    error
  ) {
    return redirectToFail(
      request,
      {
        code:
          "PAYMENT_SERVER_ERROR",

        message:
          error instanceof Error
            ? error.message
            : "결제 처리 중 오류가 발생했습니다.",

        orderId,
      },
    );
  }
}