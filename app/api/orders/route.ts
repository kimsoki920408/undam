import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  getProductByCode,
} from "@/lib/products/get-products";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  ProductCode,
} from "@/types/product";

const validProductCodes =
  new Set<ProductCode>([
    "full_saju",
    "wealth",
    "love",
    "career",
    "annual_2027",
    "compatibility",
  ]);

function createOrderId() {
  return `undam_${crypto
    .randomUUID()
    .replaceAll(
      "-",
      "",
    )}`;
}

export async function POST(
  request: NextRequest,
) {
  try {
    /*
     * 1.
     * 현재 로그인 사용자 확인
     */
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

    /*
     * 2.
     * 클라이언트 입력 확인
     */
    const body =
      (await request.json()) as {
        productCode?:
          unknown;

        profileId?:
          unknown;
      };

    const productCode =
      typeof body.productCode ===
        "string"
        ? body.productCode
        : null;

    const profileId =
      typeof body.profileId ===
        "string" &&
      body.profileId.length > 0
        ? body.profileId
        : null;

    if (
      !productCode ||
      !validProductCodes.has(
        productCode as
          ProductCode,
      )
    ) {
      return NextResponse.json(
        {
          ok: false,

          message:
            "올바르지 않은 상품입니다.",
        },
        {
          status: 400,
        },
      );
    }

    /*
     * 3.
     * 서버에서 상품 및 가격 재조회
     */
    const product =
      await getProductByCode(
        productCode as
          ProductCode,
      );

    if (!product) {
      return NextResponse.json(
        {
          ok: false,

          message:
            "현재 판매 중인 상품이 아닙니다.",
        },
        {
          status: 404,
        },
      );
    }

    /*
     * 4.
     * profileId가 있다면
     * 현재 사용자의 프로필인지 검증
     */
    if (profileId) {
      const {
        data: profile,
        error:
          profileError,
      } =
        await supabase
          .from(
            "saju_profiles",
          )
          .select("id")
          .eq(
            "id",
            profileId,
          )
          .eq(
            "user_id",
            user.id,
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
        return NextResponse.json(
          {
            ok: false,

            message:
              "사주 프로필을 확인할 수 없습니다.",
          },
          {
            status: 400,
          },
        );
      }
    }

    /*
     * 5.
     * 주문번호는 서버에서 생성
     */
    const orderId =
      createOrderId();

    /*
     * 6.
     * Admin Client로 주문 생성
     *
     * 금액은 클라이언트 값이 아니라
     * DB의 product.price 사용.
     */
    const admin =
      createAdminClient();

    const {
      data: order,
      error: orderError,
    } =
      await admin
        .from("orders")
        .insert({
          order_id:
            orderId,

          user_id:
            user.id,

          product_id:
            product.id,

          profile_id:
            profileId,

          product_code:
            product.code,

          product_name:
            product.name,

          amount:
            product.price,

          currency:
            product.currency,

          status:
            "READY",
        })
        .select(
          `
          id,
          order_id,
          product_code,
          product_name,
          amount,
          currency,
          status
          `,
        )
        .single();

    if (
      orderError ||
      !order
    ) {
      throw new Error(
        orderError?.message ??
          "주문 생성에 실패했습니다.",
      );
    }

    return NextResponse.json({
      ok: true,

      order: {
        id:
          order.id,

        orderId:
          order.order_id,

        productCode:
          order.product_code,

        productName:
          order.product_name,

        amount:
          order.amount,

        currency:
          order.currency,

        status:
          order.status,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,

        message:
          error instanceof Error
            ? error.message
            : "주문 생성 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}