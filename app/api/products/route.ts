import {
  NextResponse,
} from "next/server";

import {
  getProducts,
} from "@/lib/products/get-products";

export async function GET() {
  try {
    const products =
      await getProducts();

    return NextResponse.json({
      ok: true,

      count:
        products.length,

      products,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,

        message:
          error instanceof Error
            ? error.message
            : "상품을 불러오지 못했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}