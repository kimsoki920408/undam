import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  Container,
} from "@/components/layout/container";

import {
  createClient,
} from "@/lib/supabase/server";

type PaymentCompletePageProps = {
  searchParams:
    Promise<{
      orderId?: string;
    }>;
};

export default async function PaymentCompletePage({
  searchParams,
}: PaymentCompletePageProps) {
  const params =
    await searchParams;

  if (
    !params.orderId
  ) {
    redirect("/");
  }

  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect(
      "/login?message=" +
        encodeURIComponent(
          "결제 내역을 확인하려면 로그인해주세요.",
        ),
    );
  }

  const {
    data: order,
  } =
    await supabase
      .from("orders")
      .select(
        `
        order_id,
        product_name,
        amount,
        status,
        payment_method,
        approved_at
        `,
      )
      .eq(
        "order_id",
        params.orderId,
      )
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  if (
    !order ||
    order.status !==
      "PAID"
  ) {
    redirect("/");
  }

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#EEF3EE] text-[27px] text-[#55705F]">
            ✓
          </div>

          <p className="mt-7 text-[11px] font-extrabold tracking-[0.08em] text-[#766D8C]">
            PAYMENT COMPLETE
          </p>

          <h1 className="mt-3 text-[32px] font-extrabold tracking-[-0.055em] text-[#252525]">
            결제가 완료됐어요
          </h1>

          <p className="mt-4 text-[14px] leading-7 text-[#77736E]">
            구매한 분석 결과를
            이제 운담에서 확인할 수 있어요.
          </p>

          <div className="mt-8 rounded-[26px] border border-[#E5E1DA] bg-white p-6 text-left">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12px] text-[#88837D]">
                상품
              </span>

              <strong className="text-right text-[14px] text-[#252525]">
                {
                  order.product_name
                }
              </strong>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-[12px] text-[#88837D]">
                결제 금액
              </span>

              <strong className="text-[15px] text-[#252525]">
                {order.amount.toLocaleString(
                  "ko-KR",
                )}
                원
              </strong>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <span className="text-[12px] text-[#88837D]">
                결제수단
              </span>

              <strong className="text-[13px] text-[#252525]">
                {
                  order.payment_method ??
                  "결제 완료"
                }
              </strong>
            </div>

            <div className="mt-4 border-t border-[#ECE8E2] pt-4">
              <p className="break-all text-[10px] leading-5 text-[#AAA59E]">
                주문번호{" "}
                {
                  order.order_id
                }
              </p>
            </div>
          </div>

          <Link
            href="/mypage"
            className="undam-primary-button mt-7 w-full"
          >
            구매 내역 확인하기
          </Link>

          <Link
            href="/"
            className="mt-3 inline-flex min-h-[48px] w-full items-center justify-center text-[13px] font-bold text-[#77736E]"
          >
            홈으로
          </Link>
        </div>
      </Container>
    </section>
  );
}