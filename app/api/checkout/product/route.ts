import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  getProductByCode,
} from "@/lib/products/get-products";

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

export async function GET(
  request: NextRequest,
) {
  const code =
    request.nextUrl.searchParams.get(
      "code",
    );

  if (
    !code ||
    !validProductCodes.has(
      code as ProductCode,
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

  try {
    const product =
      await getProductByCode(
        code as ProductCode,
      );

    if (!product) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "판매 중인 상품이 아닙니다.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      ok: true,

      product: {
        id:
          product.id,

        code:
          product.code,

        name:
          product.name,

        price:
          product.price,

        currency:
          product.currency,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,

        message:
          error instanceof Error
            ? error.message
            : "상품 확인에 실패했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}