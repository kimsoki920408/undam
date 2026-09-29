import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  CareerContextForm,
} from "@/components/fortune/career-context-form";

import {
  Container,
} from "@/components/layout/container";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  createCareerContext,
} from "@/types/career-context";

import type {
  CareerContext,
} from "@/types/career-context";

type CareerContextPageProps = {
  params:
    Promise<{
      id: string;
    }>;
};

export default async function CareerContextPage({
  params,
}: CareerContextPageProps) {
  const {
    id,
  } =
    await params;

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
          "직업운 개인화를 위해 로그인해주세요.",
        ),
    );
  }

  const {
    data: result,
    error,
  } =
    await supabase
      .from(
        "fortune_results",
      )
      .select(
        `
        id,
        user_id,
        product_code,
        source_order_id,
        generation_status,
        career_context
        `,
      )
      .eq(
        "id",
        id,
      )
      .eq(
        "user_id",
        user.id,
      )
      .maybeSingle();

  if (
    error ||
    !result
  ) {
    notFound();
  }

  if (
    result.product_code !==
    "career"
  ) {
    notFound();
  }

  if (
    !result.source_order_id
  ) {
    notFound();
  }

  const initialContext =
    result.career_context
      ? createCareerContext(
          result.career_context as
            Partial<CareerContext>,
        )
      : null;

  return (
    <section className="pb-24 pt-8 sm:pt-12">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Link
            href="/mypage"
            className="text-[12px] font-bold text-[#88837D] transition hover:text-[#252525]"
          >
            ← 마이페이지
          </Link>

          <header className="mt-7 overflow-hidden rounded-[30px] bg-[#29354F] px-6 py-9 sm:px-8 sm:py-11">
            <p className="text-[11px] font-extrabold tracking-[0.08em] text-white/45">
              CAREER PERSONALIZATION
            </p>

            <h1 className="mt-3 text-[29px] font-extrabold leading-[1.35] tracking-[-0.05em] text-white sm:text-[36px]">
              사주에 지금의 일을
              <br />
              함께 넣어볼게요
            </h1>

            <p className="mt-5 max-w-xl text-[13px] leading-7 text-white/65">
              사주만으로 직업을 단정하지 않고,
              현재 하는 일과 실제 고민을 함께 비교해
              더 현실적인 직업·사업운을 만들어요.
            </p>
          </header>

          <div className="mt-5 rounded-[22px] border border-[#E6E2DC] bg-[#FAFAF8] px-5 py-4">
            <div className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EEF0F5] text-[11px] font-extrabold text-[#59657D]">
                i
              </span>

              <div>
                <p className="text-[12px] font-extrabold text-[#514C47]">
                  사주 계산값은 바뀌지 않아요
                </p>

                <p className="mt-1 text-[11px] leading-5 text-[#88817A]">
                  아래 정보는 생년월일·출생시간으로 계산한
                  사주 원국과 분리되어 저장되고,
                  직업운 해석 단계에서만 사용됩니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <CareerContextForm
              resultId={
                result.id
              }
              initialContext={
                initialContext
              }
            />
          </div>

          <p className="mt-6 text-center text-[10px] leading-5 text-[#AAA59E]">
            중요한 퇴사·이직·창업 결정은
            사주 결과만으로 결정하지 말고
            실제 경력·소득·시장 상황도 함께 확인해주세요.
          </p>
        </div>
      </Container>
    </section>
  );
}