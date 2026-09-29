import Link from "next/link";

import { Container } from "@/components/layout/container";

const popularFortunes = [
  {
    category: "신년운세",
    title: "2027년, 나에게 어떤 흐름이 찾아올까요?",
    description: "한 해의 전체 흐름과 월별 변화를 미리 살펴보세요.",
    icon: "2027",
    color: "bg-[#EEF0F5] text-[#53617C]",
    featured: true,
  },
  {
    category: "재물운",
    title: "나의 돈 버는 방식과 재물의 흐름",
    description: "돈과 기회를 대하는 나의 성향을 살펴보세요.",
    icon: "₩",
    color: "bg-[#F8EEE8] text-[#B56F4E]",
    featured: false,
  },
  {
    category: "연애·결혼운",
    title: "나는 어떤 관계에서 편안할까요?",
    description: "연애 성향과 관계에서 반복되는 패턴을 알아보세요.",
    icon: "♡",
    color: "bg-[#F5EDF0] text-[#A46878]",
    featured: false,
  },
  {
    category: "직업·사업운",
    title: "내게 맞는 일의 방식은 무엇일까요?",
    description: "조직, 리더십, 사업 성향을 함께 살펴보세요.",
    icon: "↗",
    color: "bg-[#EEF3EE] text-[#62806A]",
    featured: false,
  },
  {
    category: "궁합",
    title: "두 사람의 관계를 조금 더 깊이 이해하기",
    description: "단순 점수보다 서로의 차이와 관계 흐름을 읽어보세요.",
    icon: "∞",
    color: "bg-[#F0EDF4] text-[#766D8C]",
    featured: false,
  },
  {
    category: "인생 타임라인",
    title: "내 삶의 큰 흐름을 한눈에",
    description: "연령과 대운의 흐름을 따라 인생의 변화를 살펴보세요.",
    icon: "⌁",
    color: "bg-[#F1F0EC] text-[#726E66]",
    featured: false,
  },
];

const steps = [
  {
    number: "01",
    title: "생년월일 입력",
    description: "생년월일과 태어난 시간을 입력합니다.",
  },
  {
    number: "02",
    title: "사주 계산",
    description: "입력한 정보를 기준으로 사주 구조를 계산합니다.",
  },
  {
    number: "03",
    title: "나만의 결과 확인",
    description: "오행, 성향과 삶의 흐름을 카드로 확인합니다.",
  },
];

export function HomeContent() {
  return (
    <>
      <section className="py-14 sm:py-20">
        <Container>
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.04em] text-[#766D8C]">
              POPULAR
            </p>

            <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.05em] text-[#252525] sm:text-[34px]">
              요즘 많이 보는 운세
            </h2>

            <p className="mt-3 text-[14px] leading-6 tracking-[-0.02em] text-[#77736E]">
              지금 궁금한 이야기부터 하나씩 살펴보세요.
            </p>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {popularFortunes.map((fortune) => (
              <article
                key={fortune.category}
                className={`group relative overflow-hidden rounded-[24px] border p-6 transition duration-200 hover:-translate-y-1 ${
                  fortune.featured
                    ? "border-[#DDE1EA] bg-[#F1F3F7]"
                    : "border-[#E8E5DF] bg-white"
                }`}
              >
                {fortune.featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-[#29354F] px-3 py-1.5 text-[10px] font-extrabold text-white">
                    추천
                  </div>
                )}

                <div
                  className={`flex h-12 min-w-12 w-fit items-center justify-center rounded-[16px] px-3 text-[14px] font-extrabold ${fortune.color}`}
                >
                  {fortune.icon}
                </div>

                <p className="mt-6 text-[11px] font-extrabold tracking-[0.02em] text-[#88837D]">
                  {fortune.category}
                </p>

                <h3 className="mt-2 max-w-[280px] text-[19px] font-extrabold leading-7 tracking-[-0.04em] text-[#252525]">
                  {fortune.title}
                </h3>

                <p className="mt-3 text-[13px] leading-6 tracking-[-0.02em] text-[#77736E]">
                  {fortune.description}
                </p>

                <button
                  type="button"
                  className="mt-6 text-[12px] font-bold text-[#8A857F] transition group-hover:text-[#29354F]"
                >
                  자세히 보기 →
                </button>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="overflow-hidden rounded-[30px] border border-[#E6E2DB] bg-[#F4F2EE] px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
            <div className="max-w-xl">
              <p className="text-[12px] font-extrabold tracking-[0.04em] text-[#766D8C]">
                HOW IT WORKS
              </p>

              <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.05em] text-[#252525] sm:text-[34px]">
                어렵지 않게,
                <br />
                나를 알아가는 세 단계
              </h2>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[22px] border border-white/70 bg-white/75 p-6"
                >
                  <div className="text-[11px] font-extrabold tracking-[0.08em] text-[#9C96A6]">
                    STEP {step.number}
                  </div>

                  <h3 className="mt-4 text-[18px] font-extrabold tracking-[-0.035em] text-[#252525]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-[13px] leading-6 tracking-[-0.02em] text-[#77736E]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="start" className="py-14 sm:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-[30px] bg-[#29354F] px-6 py-12 text-center sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute left-[-80px] top-[-120px] size-72 rounded-full bg-[#766D8C]/30 blur-[70px]" />
            <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] size-72 rounded-full bg-[#C87952]/20 blur-[70px]" />

            <div className="relative mx-auto max-w-2xl">
              <p className="text-[12px] font-extrabold tracking-[0.08em] text-white/55">
                START WITH UNDAM
              </p>

              <h2 className="mt-4 text-[30px] font-extrabold leading-[1.25] tracking-[-0.05em] text-white sm:text-[40px]">
                나에 대해
                <br className="sm:hidden" />
                조금 더 알아볼까요?
              </h2>

              <p className="mx-auto mt-4 max-w-lg text-[14px] leading-7 tracking-[-0.02em] text-white/65 sm:text-[15px]">
                기본 사주는 무료로 확인할 수 있어요.
                <br className="hidden sm:block" />
                입력한 정보의 저장 여부도 직접 선택할 수 있습니다.
              </p>

              <Link
                href="/saju"
                className="mt-8 inline-flex min-h-[54px] items-center justify-center rounded-[17px] bg-white px-7 text-[15px] font-extrabold tracking-[-0.025em] text-[#29354F] transition hover:-translate-y-0.5 hover:bg-[#F7F7F5]"
              >
                무료 사주 시작하기
                <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}