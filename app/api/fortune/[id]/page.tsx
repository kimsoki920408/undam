import Link from "next/link";

import {
  notFound,
  redirect,
} from "next/navigation";

import {
  Container,
} from "@/components/layout/container";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  PaidFortuneInterpretation,
} from "@/types/paid-fortune";

type PaidFortunePageProps = {
  params:
    Promise<{
      id: string;
    }>;
};

export default async function PaidFortunePage({
  params,
}: PaidFortunePageProps) {
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
          "구매한 분석을 확인하려면 로그인해주세요.",
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
        fortune_type,
        source_order_id,
        generation_status,
        generation_error,
        interpretation_data,
        created_at
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

  /*
   * 무료 결과를 이 페이지에서
   * 열 수 없도록 막습니다.
   */
  if (
    !result.source_order_id
  ) {
    notFound();
  }

  if (
    result.generation_status !==
      "COMPLETED" ||
    !result.interpretation_data
  ) {
    redirect(
      "/mypage",
    );
  }

  const interpretation =
    result.interpretation_data as
      PaidFortuneInterpretation;

  return (
    <section className="pb-24 pt-8 sm:pt-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/mypage"
            className="text-[12px] font-bold text-[#88837D]"
          >
            ← 마이페이지
          </Link>

          <div className="mt-7 overflow-hidden rounded-[30px] bg-[#29354F] px-6 py-10 sm:px-9 sm:py-12">
            <p className="text-[11px] font-extrabold tracking-[0.08em] text-white/50">
              PREMIUM READING
            </p>

            <h1 className="mt-3 text-[30px] font-extrabold leading-[1.3] tracking-[-0.055em] text-white sm:text-[40px]">
              {
                interpretation
                  .headline
              }
            </h1>

            <p className="mt-5 max-w-2xl text-[14px] leading-7 text-white/65">
              {
                interpretation
                  .summary
              }
            </p>
          </div>

          <div className="mt-5 space-y-5">
            {interpretation
              .sections
              .map(
                (
                  section,
                  index,
                ) => (
                  <section
                    key={
                      section.id
                    }
                    className="rounded-[27px] border border-[#E7E3DC] bg-white p-6 sm:p-8"
                  >
                    <p className="text-[10px] font-extrabold tracking-[0.08em] text-[#AAA59E]">
                      {String(
                        index +
                          1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </p>

                    <h2 className="mt-2 text-[23px] font-extrabold tracking-[-0.045em] text-[#252525]">
                      {
                        section.title
                      }
                    </h2>

                    {section.keywords &&
                      section
                        .keywords
                        .length >
                        0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {section
                            .keywords
                            .map(
                              (
                                keyword,
                              ) => (
                                <span
                                  key={
                                    keyword
                                  }
                                  className="rounded-full bg-[#F1EFF5] px-3.5 py-2 text-[11px] font-bold text-[#6F6878]"
                                >
                                  #
                                  {
                                    keyword
                                  }
                                </span>
                              ),
                            )}
                        </div>
                      )}

                    <div className="mt-6 space-y-4">
                      {section
                        .content
                        .map(
                          (
                            paragraph,
                            paragraphIndex,
                          ) => (
                            <p
                              key={
                                paragraphIndex
                              }
                              className="text-[14px] leading-7 tracking-[-0.02em] text-[#6D6862]"
                            >
                              {
                                paragraph
                              }
                            </p>
                          ),
                        )}
                    </div>
                  </section>
                ),
              )}
          </div>

          <section className="mt-5 rounded-[27px] border border-[#E4E7ED] bg-[#F3F5F8] p-6 sm:p-8">
            <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#52617E]">
              ACTION POINTS
            </p>

            <h2 className="mt-2 text-[22px] font-extrabold tracking-[-0.045em] text-[#252525]">
              결과를 이렇게 활용해보세요
            </h2>

            <div className="mt-6 space-y-3">
              {interpretation
                .actionPoints
                .map(
                  (
                    point,
                    index,
                  ) => (
                    <div
                      key={
                        point
                      }
                      className="flex gap-3"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-[#52617E]">
                        {
                          index +
                          1
                        }
                      </span>

                      <p className="pt-0.5 text-[13px] leading-6 text-[#687183]">
                        {
                          point
                        }
                      </p>
                    </div>
                  ),
                )}
            </div>
          </section>

          <div className="mt-7 rounded-[20px] bg-[#FAFAF8] px-5 py-5">
            <p className="text-[11px] leading-5 text-[#AAA59E]">
              {
                interpretation
                  .caution
              }
            </p>
          </div>

          <Link
            href="/mypage"
            className="undam-secondary-button mt-6 w-full"
          >
            마이페이지로 돌아가기
          </Link>
        </div>
      </Container>
    </section>
  );
}