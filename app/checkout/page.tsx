import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  CheckoutPayment,
} from "@/components/payment/checkout-payment";

import {
  Container,
} from "@/components/layout/container";

import {
  getProductByCode,
} from "@/lib/products/get-products";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  formatProductPrice,
  type ProductCode,
} from "@/types/product";

export const metadata:
  Metadata = {
  title:
    "결제하기",
};

const validProductCodes =
  new Set<ProductCode>([
    "full_saju",
    "wealth",
    "love",
    "career",
    "annual_2027",
    "compatibility",
  ]);

type CheckoutPageProps = {
  searchParams:
    Promise<{
      product?: string;

      profile?: string;
    }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params =
    await searchParams;

  const productCode =
    params.product;

  if (
    !productCode ||
    !validProductCodes.has(
      productCode as
        ProductCode,
    )
  ) {
    redirect("/");
  }

  const product =
    await getProductByCode(
      productCode as
        ProductCode,
    );

  if (!product) {
    redirect("/");
  }

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  /*
   * 현재는 profile 파라미터가 없다면
   * 사용자의 가장 최근 사주 프로필을
   * 결제 주문과 연결합니다.
   *
   * 이후 여러 사람 프로필을 지원할 때
   * 결과 페이지에서 profile ID를
   * 명시적으로 넘기도록 확장합니다.
   */
  let profileId:
    string | null =
    null;

  if (user) {
    if (
      params.profile
    ) {
      const {
        data:
          requestedProfile,
      } =
        await supabase
          .from(
            "saju_profiles",
          )
          .select("id")
          .eq(
            "id",
            params.profile,
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle();

      profileId =
        requestedProfile?.id ??
        null;
    }

    if (!profileId) {
      const {
        data:
          latestProfile,
      } =
        await supabase
          .from(
            "saju_profiles",
          )
          .select("id")
          .eq(
            "user_id",
            user.id,
          )
          .order(
            "updated_at",
            {
              ascending:
                false,
            },
          )
          .limit(1)
          .maybeSingle();

      profileId =
        latestProfile?.id ??
        null;
    }
  }

  const customerKey =
    user
      ? `undam_${user.id.replaceAll(
          "-",
          "",
        )}`
      : null;

  return (
    <section className="py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-xl">
          <Link
            href="/result"
            className="text-[13px] font-bold text-[#88837D]"
          >
            ← 결과로 돌아가기
          </Link>

          <div className="mt-8">
            <p className="text-[12px] font-extrabold tracking-[0.06em] text-[#766D8C]">
              CHECKOUT
            </p>

            <h1 className="mt-2 text-[34px] font-extrabold tracking-[-0.055em] text-[#252525] sm:text-[40px]">
              분석 결과 구매
            </h1>

            <p className="mt-4 text-[14px] leading-7 text-[#77736E]">
              결제 전 상품과 금액을
              확인해주세요.
            </p>
          </div>

          <div className="mt-8 rounded-[28px] border border-[#E5E1DA] bg-white p-6 shadow-[0_10px_40px_rgba(37,37,37,0.04)] sm:p-8">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-[11px] font-extrabold text-[#766D8C]">
                  PREMIUM ANALYSIS
                </p>

                <h2 className="mt-2 text-[23px] font-extrabold tracking-[-0.04em] text-[#252525]">
                  {
                    product.name
                  }
                </h2>
              </div>

              <div className="shrink-0 rounded-full bg-[#F2EFF5] px-3 py-1.5 text-[11px] font-bold text-[#766D8C]">
                운담
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-6 text-[#77736E]">
              {
                product.shortDescription
              }
            </p>

            <div className="my-7 border-t border-[#ECE8E2]" />

            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#77736E]">
                결제 금액
              </span>

              <strong className="text-[26px] font-extrabold tracking-[-0.04em] text-[#252525]">
                {formatProductPrice(
                  product.price,
                )}
                원
              </strong>
            </div>

            {!user && (
              <div className="mt-6 rounded-[18px] bg-[#F7F5F2] px-4 py-4">
                <p className="text-[12px] leading-5 text-[#77736E]">
                  구매한 결과를
                  저장하려면 로그인이
                  필요해요.
                </p>

                <Link
                  href={`/login?message=${encodeURIComponent(
                    "결제를 진행하려면 먼저 로그인해주세요.",
                  )}`}
                  className="undam-primary-button mt-4 w-full"
                >
                  로그인하고 계속하기
                </Link>
              </div>
            )}

            {user &&
              customerKey && (
                <CheckoutPayment
                  product={{
                    code:
                      product.code,

                    name:
                      product.name,

                    price:
                      product.price,
                  }}
                  profileId={
                    profileId
                  }
                  customerKey={
                    customerKey
                  }
                  customerEmail={
                    user.email ??
                    null
                  }
                />
              )}
          </div>

          <div className="mt-5 rounded-[20px] border border-[#ECE8E2] bg-[#FAFAF8] px-5 py-4">
            <p className="text-[11px] leading-5 text-[#99948E]">
              운담의 사주·운세 콘텐츠는
              전통 명리 해석을 기반으로 한
              참고용 콘텐츠입니다.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}