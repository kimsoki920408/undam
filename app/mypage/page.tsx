import type {
  Metadata,
} from "next";

import Link from "next/link";

import {
  redirect,
} from "next/navigation";

import {
  Container,
} from "@/components/layout/container";

import {
  DeleteProfileButton,
} from "@/components/mypage/delete-profile-button";

import {
  PaidResultCard,
} from "@/components/mypage/paid-result-card";

import {
  SavedResultActions,
} from "@/components/mypage/saved-result-actions";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  SajuCalculationResult,
  SajuInput,
} from "@/types/saju";

export const metadata:
  Metadata = {
  title:
    "마이페이지",
};

type ProfileRow = {
  id: string;

  label: string;

  nickname: string;

  gender:
    | "male"
    | "female";

  calendar_type:
    | "solar"
    | "lunar";

  is_leap_month:
    boolean;

  birth_date: string;

  birth_time_mode:
    | "exact"
    | "shichen"
    | "unknown";

  birth_time:
    string | null;

  birth_shichen:
    string | null;

  birth_region:
    string;

  created_at:
    string;
};

type ResultRow = {
  id: string;

  profile_id:
    string | null;

  fortune_type:
    string;

  input_data:
    SajuInput;

  calculation_data:
    SajuCalculationResult;

  source_order_id:
    string | null;

  product_code:
    string | null;

  generation_status:
    "PENDING" |
    "GENERATING" |
    "COMPLETED" |
    "FAILED";

  generation_error:
    string | null;

  engine_version:
    string;

  created_at:
    string;
};

type OrderRow = {
  id: string;

  product_name:
    string;

  amount:
    number;

  status:
    string;

  approved_at:
    string | null;
};

export default async function MyPage() {
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
          "마이페이지를 이용하려면 로그인해주세요.",
        ),
    );
  }

  const [
    profilesQuery,
    resultsQuery,
    ordersQuery,
  ] =
    await Promise.all([
      supabase
        .from(
          "saju_profiles",
        )
        .select(
          "id,label,nickname,gender,calendar_type,is_leap_month,birth_date,birth_time_mode,birth_time,birth_shichen,birth_region,created_at",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        ),

      supabase
        .from(
          "fortune_results",
        )
        .select(
          "id,profile_id,fortune_type,input_data,calculation_data,source_order_id,product_code,generation_status,generation_error,engine_version,created_at",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        ),

      supabase
        .from(
          "orders",
        )
        .select(
          "id,product_name,amount,status,approved_at",
        )
        .eq(
          "status",
          "PAID",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        ),
    ]);

  if (
  profilesQuery.error ||
  resultsQuery.error ||
  ordersQuery.error
) {
  const details = [
    profilesQuery.error
      ? `profiles: ${profilesQuery.error.message}`
      : null,

    resultsQuery.error
      ? `results: ${resultsQuery.error.message}`
      : null,

    ordersQuery.error
      ? `orders: ${ordersQuery.error.message}`
      : null,
  ]
    .filter(Boolean)
    .join(" | ");

  console.error(
    "MyPage Supabase query error:",
    {
      profiles:
        profilesQuery.error,

      results:
        resultsQuery.error,

      orders:
        ordersQuery.error,
    },
  );

  throw new Error(
    `마이페이지 데이터를 불러오지 못했습니다. ${details}`,
  );
}

  const profiles =
    (profilesQuery.data ??
      []) as ProfileRow[];

  const results =
    (resultsQuery.data ??
      []) as unknown as
      ResultRow[];

  const orders =
    (ordersQuery.data ??
      []) as OrderRow[];

  const orderMap =
    new Map(
      orders.map(
        (
          order,
        ) => [
          order.id,
          order,
        ],
      ),
    );

  const freeResults =
    results.filter(
      (
        result,
      ) =>
        !result
          .source_order_id,
    );

  const paidResults =
    results.filter(
      (
        result,
      ) =>
        Boolean(
          result
            .source_order_id,
        ),
    );

  return (
    <section className="pb-24 pt-8 sm:pt-12">
      <Container>
        <div className="mx-auto max-w-5xl">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.06em] text-[#766D8C]">
              MY UNDAM
            </p>

            <h1 className="mt-2 text-[34px] font-extrabold tracking-[-0.055em] text-[#252525] sm:text-[42px]">
              나의 운담
            </h1>

            <p className="mt-3 text-[13px] leading-6 text-[#77736E]">
              저장한 사주와 구매한
              분석 결과를 한곳에서
              확인할 수 있어요.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-3 sm:max-w-xl">
            <SummaryCard
              label="사주 프로필"
              value={
                profiles.length
              }
            />

            <SummaryCard
              label="기본 사주"
              value={
                freeResults.length
              }
            />

            <SummaryCard
              label="구매 분석"
              value={
                paidResults.length
              }
            />
          </div>

          <section className="mt-12">
            <div className="flex items-end justify-between gap-5">
              <div>
                <p className="text-[11px] font-extrabold tracking-[0.05em] text-[#766D8C]">
                  SAJU PROFILES
                </p>

                <h2 className="mt-2 text-[25px] font-extrabold tracking-[-0.045em] text-[#252525]">
                  내 사주 프로필
                </h2>
              </div>

              <Link
                href="/saju"
                className="text-[12px] font-bold text-[#29354F]"
              >
                + 새 사주
              </Link>
            </div>

            {profiles.length ===
            0 ? (
              <EmptyCard
                title="아직 저장한 사주가 없어요."
                description="무료 사주를 확인한 뒤 결과를 저장해보세요."
              />
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {profiles.map(
                  (
                    profile,
                  ) => (
                    <article
                      key={
                        profile.id
                      }
                      className="rounded-[25px] border border-[#E7E3DC] bg-white p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-bold text-[#99948E]">
                            {
                              profile.label
                            }
                          </p>

                          <h3 className="mt-2 text-[20px] font-extrabold text-[#252525]">
                            {
                              profile.nickname
                            }
                          </h3>
                        </div>

                        <DeleteProfileButton
                          profileId={
                            profile.id
                          }
                        />
                      </div>

                      <div className="mt-5 divide-y divide-[#EEEAE4] rounded-[18px] bg-[#FAFAF8] px-4">
                        <InfoRow
                          label="생년월일"
                          value={`${profile.birth_date} · ${
                            profile.calendar_type ===
                            "solar"
                              ? "양력"
                              : profile.is_leap_month
                                ? "음력 · 윤달"
                                : "음력 · 평달"
                          }`}
                        />

                        <InfoRow
                          label="태어난 시간"
                          value={
                            formatBirthTime(
                              profile,
                            )
                          }
                        />

                        <InfoRow
                          label="출생지역"
                          value={
                            profile.birth_region
                          }
                        />
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>

          <section className="mt-14">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.05em] text-[#766D8C]">
                PREMIUM PURCHASES
              </p>

              <h2 className="mt-2 text-[25px] font-extrabold tracking-[-0.045em] text-[#252525]">
                구매한 분석
              </h2>

              <p className="mt-2 text-[12px] leading-5 text-[#99948E]">
                결제가 완료된 분석은
                이곳에서 생성하고 다시
                확인할 수 있어요.
              </p>
            </div>

            {paidResults.length ===
            0 ? (
              <EmptyCard
                title="아직 구매한 분석이 없어요."
                description="기본 사주 결과에서 재물운·연애운·직업운 등 더 깊은 분석을 확인할 수 있어요."
              />
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {paidResults.map(
                  (
                    result,
                  ) => {
                    const order =
                      result
                        .source_order_id
                        ? orderMap.get(
                            result
                              .source_order_id,
                          )
                        : undefined;

                    return (
                      <PaidResultCard
                        key={
                          result.id
                        }
                        resultId={
                          result.id
                        }
                        productName={
                          order
                            ?.product_name ??
                          result
                            .product_code ??
                          "유료 분석"
                        }
                        amount={
                          order
                            ?.amount ??
                          null
                        }
                        generationStatus={
                          result
                            .generation_status
                        }
                        generationError={
                          result
                            .generation_error
                        }
                        createdAt={
                          order
                            ?.approved_at ??
                          result
                            .created_at
                        }
                      />
                    );
                  },
                )}
              </div>
            )}
          </section>

          <section className="mt-14">
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.05em] text-[#766D8C]">
                BASIC SAJU
              </p>

              <h2 className="mt-2 text-[25px] font-extrabold tracking-[-0.045em] text-[#252525]">
                저장한 기본 사주
              </h2>
            </div>

            {freeResults.length ===
            0 ? (
              <EmptyCard
                title="저장된 기본 사주가 없어요."
                description="무료 사주 결과에서 저장하기를 눌러보세요."
              />
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {freeResults.map(
                  (
                    savedResult,
                  ) => (
                    <article
                      key={
                        savedResult.id
                      }
                      className="rounded-[25px] border border-[#E7E3DC] bg-white p-6"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[11px] font-extrabold text-[#766D8C]">
                            기본 사주
                          </p>

                          <h3 className="mt-2 text-[20px] font-extrabold tracking-[-0.04em] text-[#252525]">
                            {
                              savedResult
                                .input_data
                                .nickname
                            }
                            님의 사주
                          </h3>
                        </div>

                        <span className="rounded-full bg-[#F1EFF5] px-3 py-1.5 text-[10px] font-bold text-[#766D8C]">
                          저장됨
                        </span>
                      </div>

                      <div className="mt-5 rounded-[18px] bg-[#FAFAF8] px-4 py-4">
                        <p className="text-[12px] leading-5 text-[#77736E]">
                          일간{" "}
                          <strong className="text-[#343434]">
                            {
                              savedResult
                                .calculation_data
                                .dayMaster
                                .korean
                            }
                            (
                            {
                              savedResult
                                .calculation_data
                                .dayMaster
                                .hanja
                            }
                            )
                          </strong>

                          {" · "}

                          {
                            savedResult
                              .calculation_data
                              .dayMaster
                              .yinYang
                          }

                          {
                            savedResult
                              .calculation_data
                              .dayMaster
                              .element
                          }
                        </p>

                        <p className="mt-2 text-[11px] text-[#AAA59E]">
                          {
                            formatDateTime(
                              savedResult
                                .created_at,
                            )
                          }
                        </p>
                      </div>

                      <SavedResultActions
                        resultId={
                          savedResult.id
                        }
                        input={
                          savedResult
                            .input_data
                        }
                        result={
                          savedResult
                            .calculation_data
                        }
                        createdAt={
                          savedResult
                            .created_at
                        }
                      />
                    </article>
                  ),
                )}
              </div>
            )}
          </section>
        </div>
      </Container>
    </section>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label:
    string;

  value:
    number;
}) {
  return (
    <div className="rounded-[20px] border border-[#E7E3DC] bg-white px-4 py-5 sm:px-5">
      <p className="text-[10px] font-bold text-[#99948E] sm:text-[11px]">
        {label}
      </p>

      <p className="mt-2 text-[24px] font-extrabold text-[#252525] sm:text-[26px]">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label:
    string;

  value:
    string;
}) {
  return (
    <div className="flex items-start justify-between gap-5 py-3.5">
      <span className="text-[11px] font-bold text-[#99948E]">
        {label}
      </span>

      <span className="text-right text-[12px] font-bold text-[#45413D]">
        {value}
      </span>
    </div>
  );
}

function EmptyCard({
  title,
  description,
}: {
  title:
    string;

  description:
    string;
}) {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-[#DCD7CF] bg-[#FAFAF8] px-6 py-10 text-center">
      <p className="text-[15px] font-extrabold text-[#45413D]">
        {title}
      </p>

      <p className="mt-2 text-[12px] leading-5 text-[#99948E]">
        {description}
      </p>
    </div>
  );
}

function formatBirthTime(
  profile:
    ProfileRow,
) {
  if (
    profile.birth_time_mode ===
    "unknown"
  ) {
    return "시간 미상";
  }

  if (
    profile.birth_time_mode ===
    "shichen"
  ) {
    return `${profile.birth_shichen}시 · 대략적인 시간대`;
  }

  return profile.birth_time
    ? profile.birth_time.slice(
        0,
        5,
      )
    : "시간 미상";
}

function formatDateTime(
  value:
    string,
) {
  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year:
        "numeric",

      month:
        "long",

      day:
        "numeric",

      hour:
        "2-digit",

      minute:
        "2-digit",

      timeZone:
        "Asia/Seoul",
    },
  ).format(
    new Date(value),
  );
}