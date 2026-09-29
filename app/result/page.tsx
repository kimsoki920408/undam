"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  Container,
} from "@/components/layout/container";

import {
  ProductLink,
} from "@/components/payment/product-link";

import {
  SaveResultButton,
} from "@/components/saju/save-result-button";

import {
  interpretBasicSaju,
} from "@/lib/fortune/interpret-basic-saju";

import type {
  BasicSajuInterpretation,
} from "@/types/fortune";

import {
  formatProductPrice,
  type Product,
  type ProductCode,
} from "@/types/product";

import type {
  FiveElement,
  SajuCalculationResult,
  SajuInput,
  SajuPillar,
} from "@/types/saju";

const RESULT_STORAGE_KEY =
  "undam:temporary-saju-result";

type StoredResult = {
  profileId:
    string | null;

  input:
    SajuInput;

  result:
    SajuCalculationResult;

  createdAt:
    string;
};

type ProductsApiResponse = {
  ok: boolean;

  products?: Product[];

  message?: string;
};

const elementOrder:
  FiveElement[] = [
    "목",
    "화",
    "토",
    "금",
    "수",
  ];

const elementLabels:
  Record<
    FiveElement,
    string
  > = {
  목: "목(木)",
  화: "화(火)",
  토: "토(土)",
  금: "금(金)",
  수: "수(水)",
};

export default function ResultPage() {
  const [
    storedData,
    setStoredData,
  ] =
    useState<
      StoredResult |
      null |
      undefined
    >(undefined);

  const [
    products,
    setProducts,
  ] =
    useState<Product[]>([]);

  const [
    productsLoaded,
    setProductsLoaded,
  ] =
    useState(false);

  const [
    productsError,
    setProductsError,
  ] =
    useState("");

  useEffect(() => {
    try {
      const raw =
        sessionStorage.getItem(
          RESULT_STORAGE_KEY,
        );

      if (!raw) {
        setStoredData(
          null,
        );

        return;
      }

      setStoredData(
        JSON.parse(
          raw,
        ) as StoredResult,
      );
    } catch {
      setStoredData(
        null,
      );
    }
  }, []);

  useEffect(() => {
    let cancelled =
      false;

    async function loadProducts() {
      try {
        const response =
          await fetch(
            "/api/products",
            {
              cache:
                "no-store",
            },
          );

        const data =
          (await response.json()) as
            ProductsApiResponse;

        if (
          !response.ok ||
          !data.ok ||
          !data.products
        ) {
          throw new Error(
            data.message ??
              "상품 정보를 불러오지 못했습니다.",
          );
        }

        if (!cancelled) {
          setProducts(
            data.products,
          );
        }
      } catch (error) {
        if (!cancelled) {
          setProductsError(
            error instanceof Error
              ? error.message
              : "상품 정보를 불러오지 못했습니다.",
          );
        }
      } finally {
        if (!cancelled) {
          setProductsLoaded(
            true,
          );
        }
      }
    }

    void loadProducts();

    return () => {
      cancelled =
        true;
    };
  }, []);

  const interpretation =
    useMemo(() => {
      if (!storedData) {
        return null;
      }

      return interpretBasicSaju(
        storedData.result,
      );
    }, [
      storedData,
    ]);

  const productMap =
    useMemo(() => {
      return new Map<
        ProductCode,
        Product
      >(
        products.map(
          (product) =>
            [
              product.code,
              product,
            ] as const,
        ),
      );
    }, [
      products,
    ]);

  if (
    storedData ===
    undefined
  ) {
    return (
      <LoadingState />
    );
  }

  if (
    !storedData ||
    !interpretation
  ) {
    return (
      <EmptyState />
    );
  }

  const {
    profileId,
    input,
    result,
  } =
    storedData;

  const wealthProduct =
    productMap.get(
      "wealth",
    );

  const loveProduct =
    productMap.get(
      "love",
    );

  const careerProduct =
    productMap.get(
      "career",
    );

  const fullSajuProduct =
    productMap.get(
      "full_saju",
    );

  return (
    <section className="pb-20 pt-7 sm:pb-28 sm:pt-10">
      <Container>
        <div className="mx-auto max-w-4xl">
          <Link
            href="/saju"
            className="inline-flex items-center gap-2 text-[12px] font-bold text-[#8B8680] transition hover:text-[#252525]"
          >
            ← 출생정보 수정
          </Link>

          <ResultHero
            input={
              input
            }
            interpretation={
              interpretation
            }
          />

          <SaveResultButton
            profileId={
              profileId
            }
            input={
              input
            }
          />

          {result.warnings.length >
            0 && (
            <div className="mt-5 space-y-2">
              {result.warnings.map(
                (
                  warning,
                ) => (
                  <div
                    key={
                      warning
                    }
                    className="rounded-[17px] border border-[#E7E2EB] bg-[#F5F2F7] px-5 py-4 text-[12px] leading-5 text-[#6F6878]"
                  >
                    {
                      warning
                    }
                  </div>
                ),
              )}
            </div>
          )}

          <section className="mt-6 rounded-[28px] border border-[#E7E3DC] bg-white p-5 shadow-[0_8px_32px_rgba(37,37,37,0.035)] sm:p-8">
            <SectionLabel>
              FOUR PILLARS
            </SectionLabel>

            <SectionTitle>
              나의 사주 원국
            </SectionTitle>

            <p className="mt-2 text-[12px] leading-5 text-[#8B8680]">
              생년월일과 태어난 시간을
              기준으로 계산된 네 개의
              기둥입니다.
            </p>

            <div className="mt-7 grid grid-cols-4 gap-2 sm:gap-4">
              <PillarCard
                label="년주"
                pillar={
                  result
                    .fourPillars
                    .year
                }
              />

              <PillarCard
                label="월주"
                pillar={
                  result
                    .fourPillars
                    .month
                }
              />

              <PillarCard
                label="일주"
                highlighted
                pillar={
                  result
                    .fourPillars
                    .day
                }
              />

              <PillarCard
                label="시주"
                pillar={
                  result
                    .fourPillars
                    .hour
                }
              />
            </div>

            <div className="mt-6 rounded-[22px] bg-[#F5F3EF] p-5 sm:p-6">
              <p className="text-[11px] font-extrabold text-[#99948E]">
                나를 나타내는 일간
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-1">
                <span className="text-[30px] font-extrabold tracking-[-0.055em] text-[#252525]">
                  {
                    result
                      .dayMaster
                      .korean
                  }
                  (
                  {
                    result
                      .dayMaster
                      .hanja
                  }
                  )
                </span>

                <span className="pb-1 text-[13px] font-bold text-[#766D8C]">
                  {
                    result
                      .dayMaster
                      .yinYang
                  }

                  {" · "}

                  {
                    result
                      .dayMaster
                      .element
                  }
                </span>
              </div>
            </div>
          </section>

          <section className="mt-5 rounded-[28px] border border-[#E7E3DC] bg-white p-5 sm:p-8">
            <SectionLabel>
              FIVE ELEMENTS
            </SectionLabel>

            <SectionTitle>
              나의 오행
            </SectionTitle>

            <div className="mt-7 space-y-5">
              {elementOrder.map(
                (
                  element,
                ) => {
                  const count =
                    result
                      .fiveElements[
                      element
                    ];

                  const total =
                    result
                      .fiveElements
                      .total;

                  const percentage =
                    total > 0
                      ? Math.round(
                          (
                            count /
                            total
                          ) *
                            100,
                        )
                      : 0;

                  return (
                    <div
                      key={
                        element
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#56524D]">
                          {
                            elementLabels[
                              element
                            ]
                          }
                        </span>

                        <span className="text-[12px] font-bold text-[#99948E]">
                          {
                            count
                          }

                          {" · "}

                          {
                            percentage
                          }
                          %
                        </span>
                      </div>

                      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#EFEBE5]">
                        <div
                          className="h-full rounded-full bg-[#29354F]"
                          style={{
                            width:
                              `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>

            <div className="mt-7 rounded-[20px] bg-[#F7F5F2] px-5 py-5">
              <p className="text-[13px] leading-6 text-[#6D6862]">
                {
                  interpretation
                    .elementInsight
                    .description
                }
              </p>
            </div>

            <p className="mt-4 text-[11px] leading-5 text-[#AAA59E]">
              현재 비율은 천간과 지지의
              본오행을 단순 집계한
              기본 데이터입니다.
            </p>
          </section>

          <section className="mt-5 rounded-[28px] border border-[#E7E3DC] bg-white p-6 sm:p-8">
            <SectionLabel>
              PERSONALITY
            </SectionLabel>

            <SectionTitle>
              나의 기본 성향
            </SectionTitle>

            <div className="mt-6 flex flex-wrap gap-2">
              {interpretation
                .keywords
                .map(
                  (
                    keyword,
                  ) => (
                    <span
                      key={
                        keyword
                      }
                      className="rounded-full bg-[#F1EFF5] px-4 py-2 text-[12px] font-bold text-[#6F6878]"
                    >
                      #
                      {
                        keyword
                      }
                    </span>
                  ),
                )}
            </div>

            <h3 className="mt-7 text-[21px] font-extrabold leading-8 tracking-[-0.04em] text-[#252525]">
              {
                interpretation
                  .personality
                  .title
              }
            </h3>

            <p className="mt-4 text-[14px] leading-7 tracking-[-0.02em] text-[#6D6862]">
              {
                interpretation
                  .personality
                  .description
              }
            </p>

            <div className="mt-6 rounded-[20px] border border-[#E4E7ED] bg-[#F3F5F8] px-5 py-5">
              <p className="text-[11px] font-extrabold text-[#52617E]">
                무료 기본 해석
              </p>

              <p className="mt-2 text-[12px] leading-6 text-[#737B8A]">
                현재 무료 해석은 일간과
                오행의 기본 구조를 중심으로
                제공합니다. 신강·신약,
                용신 등 추가 판단은 별도
                검증 후 확장합니다.
              </p>
            </div>
          </section>

          <section className="mt-5">
            <div className="mb-5">
              <SectionLabel>
                MORE ABOUT YOU
              </SectionLabel>

              <SectionTitle>
                조금 더 깊이 보기
              </SectionTitle>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <PremiumPreviewCard
                category="재물운"
                title="돈을 대하는 나의 방식"
                preview={
                  interpretation
                    .wealth
                    .preview
                }
                topics={
                  interpretation
                    .wealth
                    .lockedTopics
                }
                product={
                  wealthProduct
                }
                productsLoaded={
                  productsLoaded
                }
              />

              <PremiumPreviewCard
                category="연애·결혼운"
                title="관계에서 나타나는 나의 모습"
                preview={
                  interpretation
                    .love
                    .preview
                }
                topics={
                  interpretation
                    .love
                    .lockedTopics
                }
                product={
                  loveProduct
                }
                productsLoaded={
                  productsLoaded
                }
              />

              <PremiumPreviewCard
                category="직업·사업운"
                title="내게 맞는 일의 방식"
                preview={
                  interpretation
                    .career
                    .preview
                }
                topics={
                  interpretation
                    .career
                    .lockedTopics
                }
                product={
                  careerProduct
                }
                productsLoaded={
                  productsLoaded
                }
              />
            </div>

            {productsError && (
              <p className="mt-4 text-[11px] leading-5 text-[#A9534B]">
                상품 정보를
                불러오지 못했어요.
                잠시 후 다시
                시도해주세요.
              </p>
            )}
          </section>

          <section className="mt-5 rounded-[28px] border border-[#E7E3DC] bg-white p-6 sm:p-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionLabel>
                  MAJOR LUCK
                </SectionLabel>

                <SectionTitle>
                  대운의 흐름
                </SectionTitle>
              </div>

              {result
                .majorLuck && (
                <p className="text-[12px] font-bold text-[#8B8680]">
                  {
                    getMajorLuckLabel(
                      result,
                    )
                  }
                </p>
              )}
            </div>

            {result
              .majorLuck ? (
              <>
                <div className="mt-7 flex gap-3 overflow-x-auto pb-3">
                  {result
                    .majorLuck
                    .pillars
                    .map(
                      (
                        pillar,
                        index,
                      ) => (
                        <div
                          key={`${index}-${pillar.korean}`}
                          className="min-w-[88px] rounded-[20px] border border-[#E9E5DE] bg-[#FAFAF8] px-3 py-5 text-center"
                        >
                          <p className="text-[10px] font-bold text-[#AAA59E]">
                            {
                              pillar.age !==
                              null
                                ? `${pillar.age}세`
                                : `${index + 1}대운`
                            }
                          </p>

                          <p className="mt-3 text-[19px] font-extrabold text-[#252525]">
                            {
                              pillar.korean
                            }
                          </p>

                          <p className="mt-1 text-[11px] text-[#88837D]">
                            {
                              pillar.hanja
                            }
                          </p>
                        </div>
                      ),
                    )}
                </div>

                {result
                  .majorLuck
                  .precision ===
                  "sequence-only" && (
                  <p className="mt-3 text-[11px] leading-5 text-[#99948E]">
                    출생시간이 없어
                    대운 간지의 순서만
                    표시합니다.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-6 text-[13px] text-[#77736E]">
                대운 정보를 확인할 수
                없습니다.
              </p>
            )}
          </section>

          <section className="mt-5 overflow-hidden rounded-[28px] bg-[#29354F] px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-[11px] font-extrabold tracking-[0.08em] text-white/50">
              FULL READING
            </p>

            <h2 className="mt-3 text-[27px] font-extrabold tracking-[-0.05em] text-white sm:text-[32px]">
              내 사주를 한 번에{" "}
              <br className="sm:hidden" />
              깊이 살펴보기
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-[13px] leading-6 text-white/65">
              재물·연애·직업·인생의
              흐름과 대운을 하나의
              결과에서 자세하게
              살펴보는 종합 분석입니다.
            </p>

            {fullSajuProduct ? (
              <Link
                href={`/checkout?product=${fullSajuProduct.code}`}
                className="mt-7 inline-flex min-h-[52px] items-center justify-center rounded-[16px] bg-white px-7 text-[14px] font-extrabold text-[#29354F] transition hover:bg-[#F5F3EF]"
              >
                {
                  fullSajuProduct
                    .name
                }

                {" · "}

                {formatProductPrice(
                  fullSajuProduct
                    .price,
                )}

                원
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="mt-7 inline-flex min-h-[52px] cursor-not-allowed items-center justify-center rounded-[16px] bg-white/90 px-7 text-[14px] font-extrabold text-[#29354F] opacity-70"
              >
                {productsLoaded
                  ? "현재 구매할 수 없어요"
                  : "상품 정보를 불러오는 중..."}
              </button>
            )}

            <p className="mt-3 text-[10px] text-white/40">
              결제 전 상품과 금액을
              다시 확인할 수 있어요.
            </p>
          </section>

          <div className="mt-8 text-center">
            <p className="text-[11px] leading-5 text-[#AAA59E]">
              운담의 결과는 전통
              명리학적 해석을 바탕으로
              제공되는 참고·오락성
              콘텐츠입니다.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ResultHero({
  input,
  interpretation,
}: {
  input:
    SajuInput;

  interpretation:
    BasicSajuInterpretation;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-[30px] bg-[#F2F0F5] px-6 py-10 sm:px-9 sm:py-12">
      <p className="text-[11px] font-extrabold tracking-[0.07em] text-[#766D8C]">
        {
          input.nickname
        }
        님의 기본 사주
      </p>

      <h1 className="mt-3 max-w-2xl text-[30px] font-extrabold leading-[1.3] tracking-[-0.055em] text-[#252525] sm:text-[40px]">
        {
          interpretation
            .headline
        }
      </h1>

      <p className="mt-5 max-w-2xl text-[14px] leading-7 tracking-[-0.02em] text-[#6F6A73]">
        {
          interpretation
            .summary
        }
      </p>

      <div className="mt-7 flex flex-wrap gap-2">
        {interpretation
          .keywords
          .map(
            (
              keyword,
            ) => (
              <span
                key={
                  keyword
                }
                className="rounded-full border border-white/80 bg-white/70 px-3.5 py-2 text-[11px] font-bold text-[#625B6C]"
              >
                {
                  keyword
                }
              </span>
            ),
          )}
      </div>
    </div>
  );
}

function PremiumPreviewCard({
  category,
  title,
  preview,
  topics,
  product,
  productsLoaded,
}: {
  category:
    string;

  title:
    string;

  preview:
    string;

  topics:
    string[];

  product:
    Product | undefined;

  productsLoaded:
    boolean;
}) {
  return (
    <article className="flex h-full flex-col rounded-[25px] border border-[#E7E3DC] bg-white p-6">
      <p className="text-[11px] font-extrabold text-[#766D8C]">
        {
          category
        }
      </p>

      <h3 className="mt-3 text-[19px] font-extrabold leading-7 tracking-[-0.04em] text-[#252525]">
        {
          title
        }
      </h3>

      <p className="mt-4 text-[13px] leading-6 text-[#77716B]">
        {
          preview
        }
      </p>

      <div className="my-6 h-px bg-[#ECE8E2]" />

      <div className="space-y-3">
        {topics.map(
          (
            topic,
          ) => (
            <div
              key={
                topic
              }
              className="flex gap-2.5"
            >
              <span className="mt-0.5 text-[11px] text-[#AAA3B1]">
                🔒
              </span>

              <p className="text-[12px] leading-5 text-[#77716B]">
                {
                  topic
                }
              </p>
            </div>
          ),
        )}
      </div>

      <div className="mt-auto pt-2">
        {product ? (
          <ProductLink
            product={
              product
            }
          />
        ) : (
          <div className="mt-5 rounded-[16px] bg-[#F4F2F6] px-4 py-3.5">
            <span className="block text-[12px] font-bold text-[#77736E]">
              {productsLoaded
                ? "현재 구매할 수 없어요"
                : "상품 정보를 불러오는 중..."}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

function getMajorLuckLabel(
  result:
    SajuCalculationResult,
) {
  const luck =
    result.majorLuck;

  if (!luck) {
    return "";
  }

  if (
    luck.precision ===
    "sequence-only"
  ) {
    return `${luck.direction} · 시작 나이 미표시`;
  }

  if (
    luck.precision ===
    "approximate"
  ) {
    return `${luck.direction} · 약 ${luck.startAge}세 시작`;
  }

  return `${luck.direction} · ${luck.startAge}세 전후 시작`;
}

function PillarCard({
  label,
  pillar,
  highlighted = false,
}: {
  label:
    string;

  pillar:
    SajuPillar | null;

  highlighted?:
    boolean;
}) {
  return (
    <div
      className={`rounded-[18px] border px-2 py-5 text-center sm:px-4 ${
        highlighted
          ? "border-[#ABB3C1] bg-[#EEF0F5]"
          : "border-[#E9E5DE] bg-[#FAFAF8]"
      }`}
    >
      <p className="text-[10px] font-bold text-[#99948E]">
        {
          label
        }
      </p>

      {pillar ? (
        <>
          <p className="mt-3 text-[20px] font-extrabold tracking-[-0.04em] text-[#252525] sm:text-[25px]">
            {
              pillar.korean
            }
          </p>

          <p className="mt-1 text-[11px] text-[#88837D]">
            {
              pillar.hanja
            }
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 text-[18px] font-bold text-[#AAA59E]">
            —
          </p>

          <p className="mt-1 text-[10px] text-[#AAA59E]">
            시간 미상
          </p>
        </>
      )}
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <p className="text-[11px] font-extrabold tracking-[0.06em] text-[#766D8C]">
      {
        children
      }
    </p>
  );
}

function SectionTitle({
  children,
}: {
  children:
    React.ReactNode;
}) {
  return (
    <h2 className="mt-2 text-[23px] font-extrabold tracking-[-0.045em] text-[#252525] sm:text-[26px]">
      {
        children
      }
    </h2>
  );
}

function LoadingState() {
  return (
    <section className="py-24">
      <Container>
        <div className="text-center">
          <div className="mx-auto size-8 animate-spin rounded-full border-[3px] border-[#E0DCE5] border-t-[#766D8C]" />

          <p className="mt-5 text-[13px] text-[#77736E]">
            결과를 불러오고
            있어요.
          </p>
        </div>
      </Container>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="py-24">
      <Container>
        <div className="mx-auto max-w-lg rounded-[28px] border border-[#E7E3DC] bg-white p-8 text-center">
          <h1 className="text-[25px] font-extrabold tracking-[-0.045em]">
            확인할 사주 결과가
            없어요.
          </h1>

          <p className="mt-3 text-[13px] leading-6 text-[#77736E]">
            출생정보를 입력한 뒤
            다시 확인해주세요.
          </p>

          <Link
            href="/saju"
            className="undam-primary-button mt-7"
          >
            무료 사주 시작하기
          </Link>
        </div>
      </Container>
    </section>
  );
}