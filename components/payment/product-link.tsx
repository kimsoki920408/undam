import Link from "next/link";

import {
  formatProductPrice,
  type Product,
} from "@/types/product";

type ProductLinkProps = {
  product: Product;

  variant?:
    | "card"
    | "primary";
};

export function ProductLink({
  product,
  variant = "card",
}: ProductLinkProps) {
  if (
    variant ===
    "primary"
  ) {
    return (
      <Link
        href={`/checkout?product=${product.code}`}
        className="undam-primary-button w-full"
      >
        {product.name}
        {" · "}
        {formatProductPrice(
          product.price,
        )}
        원
      </Link>
    );
  }

  return (
    <Link
      href={`/checkout?product=${product.code}`}
      className="mt-5 inline-flex w-full items-center justify-between rounded-[16px] bg-[#F4F2F6] px-4 py-3.5 text-[12px] font-bold text-[#5F5870] transition hover:bg-[#ECE8F0]"
    >
      <span>
        자세히 보기
      </span>

      <span>
        {formatProductPrice(
          product.price,
        )}
        원 →
      </span>
    </Link>
  );
}