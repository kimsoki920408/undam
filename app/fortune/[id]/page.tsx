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
  CareerFitLevel,
  CareerFortuneDetail,
  CareerRoleFit,
} from "@/types/career-fortune";

import type {
  PaidFortuneInterpretation,
} from "@/types/paid-fortune";

type PaidFortunePageProps = {
  params:
    Promise<{
      id: string;
    }>;
};

const displayValueMap:
  Record<
    string,
    string
  > = {
  exact:
    "정확한 시간 기준",

  approximate:
    "대략적인 시간 기준",

  "sequence-only":
    "순서만 확인 가능",

  forward:
    "순행",

  backward:
    "역행",

  male:
    "남성",

  female:
    "여성",

  solar:
    "양력",

  lunar:
    "음력",

  true:
    "예",

  false:
    "아니요",
};

const tenGodLabelMap:
  Record<
    string,
    string
  > = {
  비견:
    "비견(자기주도·동료·경쟁)",

  겁재:
    "겁재(경쟁·추진·주도권)",

  식신:
    "식신(생산·기술·꾸준한 결과)",

  상관:
    "상관(표현·개선·문제 제기)",

  편재:
    "편재(시장·영업·외부 기회)",

  정재:
    "정재(안정적 수익·관리·현실성)",

  편관:
    "편관(책임·압박·성과·실행)",

  정관:
    "정관(규칙·책임·조직 역할)",

  편인:
    "편인(분석·독창성·전문 탐색)",

  정인:
    "정인(학습·지식·전문성)",
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
  input_data,
  interpretation_data,
  interpretation_version,
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

  /*
   * 0.4.0 이후 직업·사업운은
   * 전용 결론형 UI를 사용합니다.
   */
  if (
  result.product_code ===
    "career" &&
  interpretation.careerDetail
) {
  return (
    <CareerFortunePage
      detail={
        interpretation.careerDetail
      }
      currentAge={
        getCurrentAgeFromInput(
          result.input_data,
        )
      }
    />
  );
}

  /*
   * 기존 재물운·연애운·구버전 결과
   */
  return (
    <GenericFortunePage
      interpretation={
        interpretation
      }
    />
  );
}

function CareerFortunePage({
  detail,
  currentAge,
}: {
  detail:
    CareerFortuneDetail;

  currentAge:
    number | null;
}) {
  const topRoles =
    detail.recommendedRoles.slice(
      0,
      4,
    );

  const currentLuckIndex =
    currentAge === null
      ? -1
      : detail.luckPeriods.findIndex(
          (
            period,
          ) =>
            isAgeInRange(
              period.ageRange,
              currentAge,
            ),
        );

  return (
    <section className="pb-24 pt-8 sm:pt-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/mypage"
            className="text-[12px] font-bold text-[#88837D] transition hover:text-[#252525]"
          >
            ← 마이페이지
          </Link>

          {/* HERO */}
          <header className="mt-7 overflow-hidden rounded-[32px] bg-[#29354F] px-6 py-10 sm:px-9 sm:py-12">
            <p className="text-[11px] font-extrabold tracking-[0.08em] text-white/45">
              CAREER READING
            </p>

            <p className="mt-4 text-[12px] font-extrabold text-[#D2C9E4]">
              결론부터 말하면
            </p>

            <h1 className="mt-2 text-[30px] font-extrabold leading-[1.35] tracking-[-0.055em] text-white sm:text-[40px]">
              {
                detail
                  .verdict
                  .headline
              }
            </h1>

            <p className="mt-5 text-[14px] font-medium leading-7 text-white/70">
              {
                detail
                  .verdict
                  .subheadline
              }
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <HeroMiniCard
                label="가장 큰 무기"
                value={
                  detail
                    .verdict
                    .strength
                }
              />

              <HeroMiniCard
                label="가장 큰 함정"
                value={
                  detail
                    .verdict
                    .weakness
                }
              />
            </div>
          </header>

          {/* 핵심 방향 */}
          <section className="mt-5 rounded-[28px] border border-[#E5E1DA] bg-[#FAFAF8] p-6 sm:p-8">
            <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
              YOUR DIRECTION
            </p>

            <h2 className="mt-2 text-[24px] font-extrabold tracking-[-0.045em] text-[#252525]">
              당신이 먼저 기억할 두 가지
            </h2>

            <div className="mt-6 grid gap-3">
              <ConclusionCard
                icon="↑"
                title="이쪽으로 가세요"
                text={
                  detail
                    .verdict
                    .bestDirection
                }
              />

              <ConclusionCard
                icon="!"
                title="이건 특히 조심하세요"
                text={
                  detail
                    .verdict
                    .biggestWarning
                }
                warning
              />
            </div>
          </section>

          {/* 추천 직업 */}
          <section className="mt-5 rounded-[28px] border border-[#E7E3DC] bg-white p-6 sm:p-8">
            <SectionHeader
  eyebrow="CAREER PATH"
  title="지금부터 확장해볼 커리어 경로"
  description="적성뿐 아니라 현재 경험을 기준으로 지금·다음·장기 방향을 나눠봤어요."
/>

            <div className="mt-6 space-y-4">
              {topRoles.map(
                (
                  role,
                ) => (
                  <RoleCard
  key={
    role.id
  }
  role={
    role
  }
/>
                ),
              )}
            </div>
          </section>

          {/* 피해야 할 환경 */}
          <section className="mt-5 rounded-[28px] border border-[#ECDDD6] bg-[#FFFDFC] p-6 sm:p-8">
            <SectionHeader
              eyebrow="WATCH OUT"
              title="이런 환경에서는 오래 갈수록 지칠 수 있어요"
              description="직업 자체보다 나와 안 맞는 구조를 먼저 걸러내세요."
            />

            <div className="mt-6 space-y-3">
              {detail
                .avoidEnvironments
                .map(
                  (
                    environment,
                    index,
                  ) => (
                    <div
                      key={`${index}-${environment.title}`}
                      className="rounded-[20px] border border-[#F0E5DF] bg-white p-5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F8EDE8] text-[12px] font-extrabold text-[#B76545]">
                          !
                        </span>

                        <div>
                          <h3 className="text-[15px] font-extrabold text-[#3D3935]">
                            {
                              environment.title
                            }
                          </h3>

                          <p className="mt-2 text-[13px] leading-6 text-[#746E68]">
                            {
                              environment.reason
                            }
                          </p>

                          <div className="mt-3 rounded-[14px] bg-[#FAF7F4] px-4 py-3">
                            <p className="text-[10px] font-extrabold text-[#A87B68]">
                              이런 신호가 보이면 주의
                            </p>

                            <p className="mt-1 text-[12px] leading-5 text-[#796E68]">
                              {
                                environment.warningSign
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
            </div>
          </section>

          {/* 역할 비교 */}
          <section className="mt-5 rounded-[28px] border border-[#E7E3DC] bg-white p-6 sm:p-8">
            <SectionHeader
              eyebrow="CAREER TYPE"
              title="직장·전문직·영업·사업, 어디에 더 가까울까요?"
              description="한 가지 직업으로 운명을 정하지 않고 일하는 구조별로 비교합니다."
            />

            <div className="mt-6 space-y-3">
              <RoleComparisonCard
                role={
                  detail
                    .roleComparison
                    .employee
                }
              />

              <RoleComparisonCard
                role={
                  detail
                    .roleComparison
                    .specialist
                }
              />

              <RoleComparisonCard
                role={
                  detail
                    .roleComparison
                    .sales
                }
              />

              <RoleComparisonCard
                role={
                  detail
                    .roleComparison
                    .business
                }
              />

              <RoleComparisonCard
                role={
                  detail
                    .roleComparison
                    .leadership
                }
              />
            </div>
          </section>

          {/* 돈 */}
          <section className="mt-5 overflow-hidden rounded-[28px] bg-[#F4F0E8] p-6 sm:p-8">
            <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#9B754C]">
              MONEY & CAREER
            </p>

            <h2 className="mt-2 text-[24px] font-extrabold leading-[1.4] tracking-[-0.045em] text-[#302B26]">
              {
                detail
                  .moneyStyle
                  .headline
              }
            </h2>

            <div className="mt-5 space-y-3">
              {detail
                .moneyStyle
                .description
                .map(
                  (
                    paragraph,
                    index,
                  ) => (
                    <p
                      key={
                        index
                      }
                      className="text-[13px] leading-6 text-[#6F655B]"
                    >
                      {
                        paragraph
                      }
                    </p>
                  ),
                )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <SimpleListCard
                title="돈이 붙기 쉬운 구조"
                items={
                  detail
                    .moneyStyle
                    .goodStructure
                }
              />

              <SimpleListCard
                title="조심할 돈의 구조"
                items={
                  detail
                    .moneyStyle
                    .riskyStructure
                }
                warning
              />
            </div>

            <div className="mt-5 rounded-[18px] bg-white/70 px-5 py-4">
              <p className="text-[10px] font-extrabold text-[#92714F]">
                핵심 조언
              </p>

              <p className="mt-2 text-[13px] font-bold leading-6 text-[#5D5349]">
                {
                  detail
                    .moneyStyle
                    .moneyAdvice
                }
              </p>
            </div>
          </section>

          {/* 현재 직업 */}
<section className="mt-5 rounded-[28px] border border-[#E7E3DC] bg-white p-6 sm:p-8">
  <SectionHeader
    eyebrow="CURRENT JOB"
    title="지금 하는 일, 계속해도 될까요?"
    description="설명보다 결론부터 확인하고, 그다음 현실적인 판단 기준을 살펴보세요."
  />

  {/* 최종 결론 */}
  <div className="mt-6 overflow-hidden rounded-[24px] bg-[#29354F] p-6 sm:p-7">
    <p className="text-[10px] font-extrabold tracking-[0.08em] text-white/45">
      CONCLUSION
    </p>

    <p className="mt-2 text-[11px] font-extrabold text-[#D2C9E4]">
  직업운 해석 기준
</p>

    <h3 className="mt-2 text-[24px] font-extrabold leading-[1.4] tracking-[-0.045em] text-white sm:text-[28px]">
      {detail.currentJob.decision ??
        detail.currentJob.headline}
    </h3>

    <p className="mt-4 text-[12px] font-medium leading-6 text-white/65">
  {detail.currentJob.headline}
</p>

    <div className="mt-5 rounded-[18px] bg-white/10 px-5 py-4">
      <p className="text-[10px] font-extrabold text-white/45">
        지금 할 일
      </p>

      <p className="mt-2 text-[13px] font-bold leading-6 text-white/80">
        {detail.currentJob.recommendedAction ??
          detail.currentJob.headline}
      </p>
    </div>
  </div>

  {/* 판단 시점 */}
  {detail.currentJob.reviewPeriod && (
    <div className="mt-4 rounded-[20px] border border-[#E5E1DA] bg-[#FAFAF8] px-5 py-5">
      <div className="flex items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#F1EFF5] text-[13px] font-extrabold text-[#766D8C]">
          ⏱
        </span>

        <div>
          <p className="text-[10px] font-extrabold text-[#918A84]">
            다시 판단할 시점
          </p>

          <p className="mt-1 text-[16px] font-extrabold text-[#37322E]">
            {detail.currentJob.reviewPeriod}
          </p>

          <p className="mt-2 text-[11px] leading-5 text-[#8A847E]">
            그때까지 무작정 버티는 것이 아니라 아래 지표가 실제로 좋아지는지 확인하세요.
          </p>
        </div>
      </div>
    </div>
  )}

  {/* 현실 지표 */}
  {(detail.currentJob.reviewMetrics ?? [])
    .length > 0 && (
    <div className="mt-4 rounded-[20px] border border-[#DFE4EC] bg-[#F5F7FA] p-5">
      <p className="text-[10px] font-extrabold tracking-[0.05em] text-[#53617B]">
        CHECK THESE NUMBERS
      </p>

      <h3 className="mt-1 text-[15px] font-extrabold text-[#354056]">
        그때 이것이 좋아졌는지 보세요
      </h3>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {(detail.currentJob.reviewMetrics ?? []).map(
          (
            metric,
            index,
          ) => (
            <div
              key={`${index}-${metric}`}
              className="flex items-center gap-3 rounded-[14px] bg-white px-4 py-3"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#EEF1F6] text-[10px] font-extrabold text-[#53617B]">
                {index + 1}
              </span>

              <p className="text-[12px] font-bold leading-5 text-[#5F697A]">
                {metric}
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  )}

  {/* 상세 이유 */}
  <div className="mt-4 rounded-[20px] bg-[#F7F5F2] p-5 sm:p-6">
    <p className="text-[10px] font-extrabold tracking-[0.05em] text-[#8C837B]">
      WHY
    </p>

    <h3 className="mt-2 text-[16px] font-extrabold leading-6 text-[#3E3935]">
      왜 이런 결론이 나왔을까요?
    </h3>

    <div className="mt-4 space-y-3">
      {detail.currentJob.reasons.map(
        (
          reason,
          index,
        ) => (
          <div
            key={index}
            className="flex gap-3"
          >
            <span className="pt-0.5 text-[11px] font-extrabold text-[#9A928B]">
              {String(
                index + 1,
              ).padStart(
                2,
                "0",
              )}
            </span>

            <p className="text-[12px] leading-6 text-[#736D67]">
              {reason}
            </p>
          </div>
        ),
      )}
    </div>
  </div>

  {/* 유지 / 변화 기준 */}
  <div className="mt-4 grid gap-3 sm:grid-cols-2">
    <SimpleListCard
      title="✅ 계속해도 되는 조건"
      items={
        detail.currentJob.keepIf
      }
    />

    <SimpleListCard
      title="⚠️ 방향을 바꿔야 할 신호"
      items={
        detail.currentJob.changeIf
      }
      warning
    />
  </div>

  {/* 가장 중요한 다음 행동 */}
  <div className="mt-4 rounded-[20px] border border-[#E8D9D1] bg-[#FFF9F6] px-5 py-5">
    <p className="text-[10px] font-extrabold tracking-[0.05em] text-[#B2674C]">
      FIRST CHECK
    </p>

    <p className="mt-1 text-[12px] font-extrabold text-[#57453D]">
      지금 가장 먼저 확인할 것
    </p>

    <p className="mt-2 text-[13px] font-bold leading-6 text-[#74645D]">
      {detail.currentJob.nextQuestion}
    </p>
  </div>
</section>

          {/* 대운 */}
          <section className="mt-5 rounded-[30px] bg-[#29354F] p-6 sm:p-8">
            <p className="text-[11px] font-extrabold tracking-[0.06em] text-white/45">
              CAREER TIMELINE
            </p>

            <h2 className="mt-2 text-[26px] font-extrabold tracking-[-0.05em] text-white">
              대운별 커리어 흐름
            </h2>

            <p className="mt-3 text-[13px] leading-6 text-white/55">
  {currentAge !== null &&
  currentLuckIndex >= 0
    ? `현재 ${currentAge}세 기준으로 지금 지나고 있는 흐름과 다음 흐름을 표시했어요.`
    : "시기별로 무엇을 노리고 무엇을 조심할지 직관적으로 정리했어요."}
</p>

            {detail
              .luckPeriods
              .length >
            0 ? (
              <div className="mt-7 space-y-4">
                {detail
                  .luckPeriods
                  .map(
  (
    period,
    index,
  ) => {
    const isCurrent =
      index ===
      currentLuckIndex;

    const isNext =
      currentLuckIndex >=
        0 &&
      index ===
        currentLuckIndex +
          1;

    return (
      <div
        key={
          period.id
        }
        className={`rounded-[24px] bg-white p-5 sm:p-6 ${
          isCurrent
            ? "ring-2 ring-[#D8B98D]"
            : isNext
              ? "ring-1 ring-white/40"
              : ""
        }`}
      >
                        <div className="flex flex-wrap items-center gap-2">
                            {isCurrent && (
  <span className="rounded-full bg-[#29354F] px-3 py-1.5 text-[10px] font-extrabold text-white">
    지금
  </span>
)}

{isNext && (
  <span className="rounded-full bg-[#EDE8DF] px-3 py-1.5 text-[10px] font-extrabold text-[#746555]">
    다음 흐름
  </span>
)}
                          <span className="rounded-full bg-[#EEF0F5] px-3 py-1.5 text-[11px] font-extrabold text-[#47536A]">
                            {
                              period.ageRange
                            }
                          </span>

                          <span className="text-[11px] font-bold text-[#AAA39D]">
                            {
                              period.pillar
                            }
                          </span>
                        </div>

                        <h3 className="mt-4 text-[20px] font-extrabold leading-[1.4] tracking-[-0.04em] text-[#282522]">
                          {
                            period.headline
                          }
                        </h3>

                        <p className="mt-3 text-[13px] leading-6 text-[#736C66]">
                          {
                            period.overall
                          }
                        </p>

                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                          <LuckMiniCard
                            label="🔥 기회"
                            items={
                              period.opportunities
                            }
                          />

                          <LuckMiniCard
                            label="💰 돈"
                            items={
                              period.money
                            }
                          />

                          <LuckMiniCard
                            label="💼 커리어"
                            items={
                              period.career
                            }
                          />

                          <LuckMiniCard
                            label="⚠️ 조심"
                            items={
                              period.caution
                            }
                            warning
                          />
                        </div>

                        <div className="mt-4 rounded-[17px] bg-[#F2F4F8] px-5 py-4">
                          <p className="text-[10px] font-extrabold text-[#53617B]">
                            🚀 이 시기의 승부수
                          </p>

                          <p className="mt-2 text-[13px] font-extrabold leading-6 text-[#3F4B61]">
                            {
                              period.winningMove
                            }
                          </p>
                        </div>

                        <p className="mt-4 text-[11px] leading-5 text-[#948D87]">
                          다음 흐름을 위한 준비 ·{" "}
                          {
                            period.prepareNext
                          }
                        </p>
                      </div>
                    );
                  },
                  )}
              </div>
            ) : (
              <div className="mt-7 rounded-[20px] bg-white/10 px-5 py-5">
                <p className="text-[13px] leading-6 text-white/65">
                  현재 입력정보만으로는 연령이 포함된 대운 타임라인을 표시하기 어렵습니다.
                </p>
              </div>
            )}
          </section>

          {/* 일침 */}
          <section className="mt-5 rounded-[28px] border border-[#E8D9D1] bg-[#FFF9F6] p-6 sm:p-8">
            <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#B56242]">
              WAKE-UP CALL
            </p>

            <h2 className="mt-2 text-[25px] font-extrabold leading-[1.4] tracking-[-0.045em] text-[#332C28]">
              {
                detail
                  .wakeUpCall
                  .headline
              }
            </h2>

            <div className="mt-5 space-y-3">
              {detail
                .wakeUpCall
                .message
                .map(
                  (
                    message,
                    index,
                  ) => (
                    <p
                      key={
                        index
                      }
                      className="text-[13px] leading-6 text-[#746761]"
                    >
                      {
                        message
                      }
                    </p>
                  ),
                )}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <SimpleListCard
                title="이제 그만할 것"
                items={
                  detail
                    .wakeUpCall
                    .stopDoing
                }
                warning
              />

              <SimpleListCard
                title="대신 시작할 것"
                items={
                  detail
                    .wakeUpCall
                    .startDoing
                }
              />
            </div>
          </section>

          {/* 희망 */}
          <section className="mt-5 rounded-[28px] bg-[#EEF3EE] p-6 sm:p-8">
            <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#5D7B66]">
              YOUR POSSIBILITY
            </p>

            <h2 className="mt-2 text-[25px] font-extrabold leading-[1.4] tracking-[-0.045em] text-[#29352D]">
              {
                detail
                  .hopePoint
                  .headline
              }
            </h2>

            <div className="mt-5 space-y-3">
              {detail
                .hopePoint
                .message
                .map(
                  (
                    message,
                    index,
                  ) => (
                    <p
                      key={
                        index
                      }
                      className="text-[13px] leading-6 text-[#607066]"
                    >
                      {
                        message
                      }
                    </p>
                  ),
                )}
            </div>

            <div className="mt-6 rounded-[20px] bg-white/70 p-5">
              <p className="text-[10px] font-extrabold text-[#688273]">
                기회가 살아나는 조건
              </p>

              <div className="mt-3 space-y-2">
                {detail
                  .hopePoint
                  .opportunityConditions
                  .map(
                    (
                      condition,
                      index,
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="flex gap-2"
                      >
                        <span className="font-bold text-[#65816F]">
                          ✓
                        </span>

                        <p className="text-[12px] leading-5 text-[#5D6E63]">
                          {
                            condition
                          }
                        </p>
                      </div>
                    ),
                  )}
              </div>
            </div>
          </section>

          {/* 90일 */}
          <section className="mt-5 rounded-[28px] border border-[#E2E4E8] bg-[#F5F6F8] p-6 sm:p-8">
            <SectionHeader
              eyebrow="90 DAY PLAN"
              title="앞으로 90일, 이렇게 움직이세요"
              description="결과를 읽고 끝내지 않고 실제 커리어 변화로 연결하는 계획입니다."
            />

            <div className="mt-6 space-y-3">
              <PlanCard
                step="01"
                title={
                  detail
                    .ninetyDayPlan
                    .first30Days
                    .title
                }
                actions={
                  detail
                    .ninetyDayPlan
                    .first30Days
                    .actions
                }
              />

              <PlanCard
                step="02"
                title={
                  detail
                    .ninetyDayPlan
                    .next30Days
                    .title
                }
                actions={
                  detail
                    .ninetyDayPlan
                    .next30Days
                    .actions
                }
              />

              <PlanCard
                step="03"
                title={
                  detail
                    .ninetyDayPlan
                    .final30Days
                    .title
                }
                actions={
                  detail
                    .ninetyDayPlan
                    .final30Days
                    .actions
                }
              />
            </div>
          </section>

          <div className="mt-7 rounded-[20px] bg-[#FAFAF8] px-5 py-5">
            <p className="text-[11px] leading-5 text-[#AAA59E]">
              {
                detail.disclaimer
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

/*
 * 기존 유료 결과용 화면
 */
function GenericFortunePage({
  interpretation,
}: {
  interpretation:
    PaidFortuneInterpretation;
}) {
  const keyTakeaways =
    Array.isArray(
      interpretation.keyTakeaways,
    )
      ? interpretation.keyTakeaways
      : [];

  const actionPoints =
    Array.isArray(
      interpretation.actionPoints,
    )
      ? interpretation.actionPoints
      : [];

  return (
    <section className="pb-24 pt-8 sm:pt-12">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link
            href="/mypage"
            className="text-[12px] font-bold text-[#88837D] transition hover:text-[#252525]"
          >
            ← 마이페이지
          </Link>

          <header className="mt-7 overflow-hidden rounded-[30px] bg-[#29354F] px-6 py-10 sm:px-9 sm:py-12">
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
          </header>

          {keyTakeaways.length >
            0 && (
            <section className="mt-5 rounded-[27px] border border-[#E5E1DA] bg-[#FAFAF8] p-6 sm:p-8">
              <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
                AT A GLANCE
              </p>

              <h2 className="mt-2 text-[23px] font-extrabold tracking-[-0.045em] text-[#252525]">
                먼저 이것부터 기억해두세요
              </h2>

              <div className="mt-6 space-y-3">
                {keyTakeaways.map(
                  (
                    takeaway,
                    index,
                  ) => (
                    <div
                      key={`${index}-${takeaway}`}
                      className="flex gap-3 rounded-[18px] bg-white px-4 py-4"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#F1EFF5] text-[11px] font-extrabold text-[#766D8C]">
                        {
                          index +
                          1
                        }
                      </span>

                      <p className="pt-0.5 text-[13px] leading-6 text-[#625E59]">
                        {
                          takeaway
                        }
                      </p>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

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

                    {section.summary && (
                      <div className="mt-5 rounded-[18px] bg-[#F7F5F2] px-5 py-4">
                        <p className="text-[13px] font-bold leading-6 text-[#5E5954]">
                          {
                            section.summary
                          }
                        </p>
                      </div>
                    )}

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
                                    formatDisplayValue(
                                      keyword,
                                    )
                                  }
                                </span>
                              ),
                            )}
                        </div>
                      )}

                    {section.basis &&
                      section
                        .basis
                        .length >
                        0 && (
                        <div className="mt-6 overflow-hidden rounded-[20px] border border-[#E7E3DC]">
                          <div className="bg-[#FAFAF8] px-5 py-3">
                            <p className="text-[10px] font-extrabold tracking-[0.06em] text-[#8C8680]">
                              분석 근거
                            </p>
                          </div>

                          <div className="divide-y divide-[#EEEAE4]">
                            {section
                              .basis
                              .map(
                                (
                                  basis,
                                ) => (
                                  <div
                                    key={`${basis.label}-${basis.value}`}
                                    className="grid gap-2 px-5 py-4 sm:grid-cols-[120px_1fr]"
                                  >
                                    <div>
                                      <p className="text-[10px] font-bold text-[#A09B95]">
                                        {
                                          formatDisplayLabel(
                                            basis.label,
                                          )
                                        }
                                      </p>

                                      <p className="mt-1 text-[13px] font-extrabold leading-5 text-[#3E3A36]">
                                        {
                                          formatDisplayValue(
                                            basis.value,
                                          )
                                        }
                                      </p>
                                    </div>

                                    <p className="text-[12px] leading-6 text-[#77716B]">
                                      {
                                        basis.description
                                      }
                                    </p>
                                  </div>
                                ),
                              )}
                          </div>
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

          {actionPoints.length >
            0 && (
            <section className="mt-5 rounded-[27px] border border-[#E4E7ED] bg-[#F3F5F8] p-6 sm:p-8">
              <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#52617E]">
                ACTION POINTS
              </p>

              <div className="mt-5 space-y-3">
                {actionPoints.map(
                  (
                    point,
                    index,
                  ) => (
                    <div
                      key={
                        index
                      }
                      className="flex gap-3"
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-[#52617E]">
                        {
                          index +
                          1
                        }
                      </span>

                      <p className="text-[13px] leading-6 text-[#687183]">
                        {
                          point
                        }
                      </p>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

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

function HeroMiniCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[18px] bg-white/8 px-4 py-4">
      <p className="text-[10px] font-extrabold text-white/40">
        {label}
      </p>

      <p className="mt-2 text-[12px] font-bold leading-6 text-white/75">
        {value}
      </p>
    </div>
  );
}

function ConclusionCard({
  icon,
  title,
  text,
  warning = false,
}: {
  icon: string;
  title: string;
  text: string;
  warning?: boolean;
}) {
  return (
    <div className="flex gap-4 rounded-[20px] bg-white p-5">
      <span
        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold ${
          warning
            ? "bg-[#F8EDE8] text-[#B76545]"
            : "bg-[#EEF2EC] text-[#5D7B66]"
        }`}
      >
        {icon}
      </span>

      <div>
        <p className="text-[11px] font-extrabold text-[#918A84]">
          {title}
        </p>

        <p className="mt-1.5 text-[13px] font-bold leading-6 text-[#4E4945]">
          {text}
        </p>
      </div>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <>
      <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-[24px] font-extrabold leading-[1.4] tracking-[-0.045em] text-[#252525]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-[12px] leading-6 text-[#8A847E]">
          {description}
        </p>
      )}
    </>
  );
}

function RoleCard({
  role,
}: {
  role:
    CareerRoleFit;
}) {
  const stage =
    getCareerStage(
      role,
    );

  return (
    <div className="rounded-[20px] border border-[#EBE7E0] p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span
            className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-extrabold ${
              stage.type ===
              "current"
                ? "bg-[#EEF3EE] text-[#5D7B66]"
                : stage.type ===
                    "longterm"
                  ? "bg-[#F5EEE9] text-[#A36C52]"
                  : "bg-[#EEF0F5] text-[#59657D]"
            }`}
          >
            {
              stage.label
            }
          </span>

          <h3 className="mt-3 text-[17px] font-extrabold leading-6 text-[#35312E]">
            {
              role.title
            }
          </h3>

          <p className="mt-1 text-[10px] font-bold text-[#AAA49E]">
            {
              stage.description
            }
          </p>
        </div>

        <FitBadge
          fit={
            role.fit
          }
        />
      </div>

      <p className="mt-4 text-[13px] font-bold leading-6 text-[#5D5752]">
        {
          role.oneLine
        }
      </p>

      <div className="mt-4 space-y-2">
        {role.why.map(
          (
            reason,
            index,
          ) => (
            <p
              key={
                index
              }
              className="text-[12px] leading-5 text-[#7B746E]"
            >
              · {reason}
            </p>
          ),
        )}
      </div>

      <div className="mt-4 rounded-[15px] bg-[#F7F6F3] px-4 py-3">
        <p className="text-[10px] font-extrabold text-[#817A73]">
          이런 조건이면 더 좋습니다
        </p>

        <p className="mt-1 text-[11px] leading-5 text-[#77706A]">
          {
            role.goodWhen.join(
              " · ",
            )
          }
        </p>
      </div>
    </div>
  );
}

function getCareerStage(
  role:
    CareerRoleFit,
) {
  if (
    role.id.startsWith(
      "current-",
    )
  ) {
    return {
      type:
        "current" as const,

      label:
        "지금",

      description:
        "현재 가장 먼저 키울 방향",
    };
  }

  if (
    role.id.includes(
      "longterm",
    ) ||
    role.title.includes(
      "장기 후보",
    )
  ) {
    return {
      type:
        "longterm" as const,

      label:
        "장기 후보",

      description:
        "기반이 만들어진 뒤 검토할 방향",
    };
  }

  return {
    type:
      "next" as const,

    label:
      "다음 확장",

    description:
      "현재 경험을 이어서 넓혀볼 방향",
  };
}

function RoleComparisonCard({
  role,
}: {
  role:
    CareerRoleFit;
}) {
  return (
    <div className="rounded-[19px] border border-[#EBE7E0] px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[14px] font-extrabold text-[#3F3A36]">
          {
            role.title
          }
        </h3>

        <FitBadge
          fit={
            role.fit
          }
        />
      </div>

      <p className="mt-2 text-[12px] leading-5 text-[#756F69]">
        {
          role.oneLine
        }
      </p>
    </div>
  );
}

function FitBadge({
  fit,
}: {
  fit:
    CareerFitLevel;
}) {
  const labels:
    Record<
      CareerFitLevel,
      string
    > = {
    "very-good":
      "강하게 맞는 편",

    good:
      "잘 맞는 편",

    mixed:
      "조건에 따라 달라짐",

    caution:
      "주의가 필요한 편",
  };

  return (
    <span className="shrink-0 rounded-full bg-[#F1EFF5] px-3 py-1.5 text-[10px] font-extrabold text-[#70687A]">
      {
        labels[
          fit
        ]
      }
    </span>
  );
}

function SimpleListCard({
  title,
  items,
  warning = false,
}: {
  title: string;
  items: string[];
  warning?: boolean;
}) {
  return (
    <div className="rounded-[18px] bg-white p-5">
      <p
        className={`text-[11px] font-extrabold ${
          warning
            ? "text-[#B2674C]"
            : "text-[#5E7466]"
        }`}
      >
        {title}
      </p>

      <div className="mt-3 space-y-2">
        {items.map(
          (
            item,
            index,
          ) => (
            <div
              key={
                index
              }
              className="flex gap-2"
            >
              <span
                className={`text-[12px] font-bold ${
                  warning
                    ? "text-[#B2674C]"
                    : "text-[#66806E]"
                }`}
              >
                {warning
                  ? "!"
                  : "✓"}
              </span>

              <p className="text-[12px] leading-5 text-[#746E68]">
                {
                  item
                }
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
}

function LuckMiniCard({
  label,
  items,
  warning = false,
}: {
  label: string;
  items: string[];
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-[17px] p-4 ${
        warning
          ? "bg-[#FFF6F2]"
          : "bg-[#F7F7F5]"
      }`}
    >
      <p
        className={`text-[11px] font-extrabold ${
          warning
            ? "text-[#B46447]"
            : "text-[#53617B]"
        }`}
      >
        {label}
      </p>

      <div className="mt-3 space-y-2">
        {items.map(
          (
            item,
            index,
          ) => (
            <p
              key={
                index
              }
              className="text-[11px] leading-5 text-[#716B65]"
            >
              · {item}
            </p>
          ),
        )}
      </div>
    </div>
  );
}

function PlanCard({
  step,
  title,
  actions,
}: {
  step: string;
  title: string;
  actions: string[];
}) {
  return (
    <div className="rounded-[20px] bg-white p-5">
      <div className="flex gap-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#29354F] text-[10px] font-extrabold text-white">
          {step}
        </span>

        <div className="min-w-0">
          <h3 className="text-[15px] font-extrabold text-[#3A3734]">
            {title}
          </h3>

          <div className="mt-3 space-y-2">
            {actions.map(
              (
                action,
                index,
              ) => (
                <p
                  key={
                    index
                  }
                  className="text-[12px] leading-5 text-[#716C67]"
                >
                  · {action}
                </p>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDisplayValue(
  value: string,
) {
  const trimmed =
    value.trim();

  if (
    displayValueMap[
      trimmed
    ]
  ) {
    return displayValueMap[
      trimmed
    ];
  }

  if (
    tenGodLabelMap[
      trimmed
    ]
  ) {
    return tenGodLabelMap[
      trimmed
    ];
  }

  if (
    trimmed.includes(
      "/",
    )
  ) {
    return trimmed
      .split("/")
      .map(
        (
          item,
        ) =>
          formatSingleValue(
            item.trim(),
          ),
      )
      .join(
        " / ",
      );
  }

  return trimmed;
}

function formatSingleValue(
  value: string,
) {
  if (
    displayValueMap[
      value
    ]
  ) {
    return displayValueMap[
      value
    ];
  }

  if (
    tenGodLabelMap[
      value
    ]
  ) {
    return tenGodLabelMap[
      value
    ];
  }

  return value;
}

function formatDisplayLabel(
  label: string,
) {
  const labels:
    Record<
      string,
      string
    > = {
    "시작 정밀도":
      "대운 시작 기준",

    "대운 방향":
      "대운 진행 방향",

    "월간 십성":
      "월간에서 본 십성",

    "월지 십성":
      "월지에서 본 십성",

    일간:
      "나를 나타내는 일간",

    "일간 오행":
      "일간의 오행",

    "우세 오행":
      "상대적으로 많이 보이는 오행",

    "상대적 약세":
      "상대적으로 적게 보이는 오행",
  };

  return (
    labels[
      label
    ] ??
    label
  );
}

function getCurrentAgeFromInput(
  inputData: unknown,
): number | null {
  if (
    !inputData ||
    typeof inputData !==
      "object" ||
    Array.isArray(
      inputData,
    )
  ) {
    return null;
  }

  const birthDate =
    (
      inputData as
        Record<
          string,
          unknown
        >
    ).birthDate;

  if (
    typeof birthDate !==
    "string"
  ) {
    return null;
  }

  const match =
    birthDate.match(
      /^(\d{4})-(\d{2})-(\d{2})$/,
    );

  if (!match) {
    return null;
  }

  const birthYear =
    Number(
      match[1],
    );

  const birthMonth =
    Number(
      match[2],
    );

  const birthDay =
    Number(
      match[3],
    );

  const parts =
    new Intl.DateTimeFormat(
      "en-CA",
      {
        timeZone:
          "Asia/Seoul",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      },
    ).formatToParts(
      new Date(),
    );

  const values =
    Object.fromEntries(
      parts
        .filter(
          (
            part,
          ) =>
            part.type !==
            "literal",
        )
        .map(
          (
            part,
          ) => [
            part.type,
            Number(
              part.value,
            ),
          ],
        ),
    );

  const currentYear =
    values.year;

  const currentMonth =
    values.month;

  const currentDay =
    values.day;

  if (
    !currentYear ||
    !currentMonth ||
    !currentDay
  ) {
    return null;
  }

  let age =
    currentYear -
    birthYear;

  const birthdayPassed =
    currentMonth >
      birthMonth ||
    (
      currentMonth ===
        birthMonth &&
      currentDay >=
        birthDay
    );

  if (
    !birthdayPassed
  ) {
    age -= 1;
  }

  if (
    age < 0 ||
    age > 120
  ) {
    return null;
  }

  return age;
}

function isAgeInRange(
  ageRange: string,
  age: number,
) {
  const match =
    ageRange.match(
      /^(\d+)~(\d+)세$/,
    );

  if (!match) {
    return false;
  }

  const start =
    Number(
      match[1],
    );

  const end =
    Number(
      match[2],
    );

  return (
    age >= start &&
    age <= end
  );
}