export type ProductCode =
  | "full_saju"
  | "wealth"
  | "love"
  | "career"
  | "annual_2027"
  | "compatibility";

export type Product = {
  id: string;

  code: ProductCode;

  name: string;

  shortDescription: string;

  fortuneType: string;

  price: number;

  currency: "KRW";

  isActive: boolean;

  sortOrder: number;

  metadata:
    Record<
      string,
      unknown
    >;
};

export function formatProductPrice(
  price: number,
) {
  return new Intl.NumberFormat(
    "ko-KR",
  ).format(price);
}