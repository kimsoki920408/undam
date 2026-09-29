import "server-only";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  Product,
  ProductCode,
} from "@/types/product";

type ProductRow = {
  id: string;

  code: string;

  name: string;

  short_description:
    string;

  fortune_type:
    string;

  price: number;

  currency: string;

  is_active:
    boolean;

  sort_order:
    number;

  metadata:
    Record<
      string,
      unknown
    > | null;
};

function mapProduct(
  row: ProductRow,
): Product {
  return {
    id:
      row.id,

    code:
      row.code as ProductCode,

    name:
      row.name,

    shortDescription:
      row.short_description,

    fortuneType:
      row.fortune_type,

    price:
      row.price,

    currency:
      "KRW",

    isActive:
      row.is_active,

    sortOrder:
      row.sort_order,

    metadata:
      row.metadata ?? {},
  };
}

export async function getProducts() {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .from("products")
      .select(
        `
        id,
        code,
        name,
        short_description,
        fortune_type,
        price,
        currency,
        is_active,
        sort_order,
        metadata
        `,
      )
      .eq(
        "is_active",
        true,
      )
      .order(
        "sort_order",
        {
          ascending: true,
        },
      );

  if (error) {
    throw new Error(
      `상품을 불러오지 못했습니다: ${error.message}`,
    );
  }

  return (
    data as ProductRow[]
  ).map(
    mapProduct,
  );
}

export async function getProductByCode(
  code: ProductCode,
) {
  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .from("products")
      .select(
        `
        id,
        code,
        name,
        short_description,
        fortune_type,
        price,
        currency,
        is_active,
        sort_order,
        metadata
        `,
      )
      .eq(
        "code",
        code,
      )
      .eq(
        "is_active",
        true,
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `상품을 불러오지 못했습니다: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapProduct(
    data as ProductRow,
  );
}