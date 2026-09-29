import Link from "next/link";

import {
  Container,
} from "@/components/layout/container";

type PaymentFailPageProps = {
  searchParams:
    Promise<{
      code?: string;

      message?: string;

      orderId?: string;
    }>;
};

export default async function PaymentFailPage({
  searchParams,
}: PaymentFailPageProps) {
  const params =
    await searchParams;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mx-auto max-w-lg text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#FAEEEE] text-[25px] font-bold text-[#A9534B]">
            !
          </div>

          <p className="mt-7 text-[11px] font-extrabold tracking-[0.08em] text-[#A27A75]">
            PAYMENT FAILED
          </p>

          <h1 className="mt-3 text-[30px] font-extrabold tracking-[-0.05em] text-[#252525]">
            결제가 완료되지 않았어요
          </h1>

          <p className="mt-4 text-[13px] leading-6 text-[#77736E]">
            {
              params.message ??
              "결제 과정이 취소되었거나 오류가 발생했습니다."
            }
          </p>

          {params.code && (
            <div className="mt-6 rounded-[18px] bg-[#F7F5F2] px-5 py-4">
              <p className="text-[10px] text-[#99948E]">
                오류 코드
              </p>

              <p className="mt-1 break-all text-[12px] font-bold text-[#6D6862]">
                {
                  params.code
                }
              </p>
            </div>
          )}

          <Link
            href="/result"
            className="undam-primary-button mt-7 w-full"
          >
            결과로 돌아가기
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