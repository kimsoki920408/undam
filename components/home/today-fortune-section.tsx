import { Container } from "@/components/layout/container";

const fortunes = [
  {
    icon: "₩",
    title: "재물운",
    description: "오늘 돈의 흐름과 소비 감각",
    tone: "bg-[#F8EEE8] text-[#B56F4E]",
  },
  {
    icon: "♡",
    title: "연애운",
    description: "관계와 마음의 흐름",
    tone: "bg-[#F5EDF0] text-[#A46878]",
  },
  {
    icon: "⌁",
    title: "직장운",
    description: "업무와 선택의 방향",
    tone: "bg-[#EEF0F5] text-[#52617E]",
  },
  {
    icon: "✦",
    title: "건강운",
    description: "오늘 컨디션을 살펴보기",
    tone: "bg-[#EEF3EE] text-[#62806A]",
  },
];

export function TodayFortuneSection() {
  return (
    <section id="today" className="py-14 sm:py-20">
      <Container>
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[12px] font-extrabold tracking-[0.04em] text-[#766D8C]">
              TODAY
            </p>

            <h2 className="mt-2 text-[28px] font-extrabold tracking-[-0.05em] text-[#252525] sm:text-[34px]">
              오늘의 운세
            </h2>

            <p className="mt-3 text-[14px] leading-6 tracking-[-0.02em] text-[#77736E]">
              부담 없이 오늘의 흐름부터 가볍게 확인해보세요.
            </p>
          </div>

          <button
            type="button"
            className="hidden text-[13px] font-bold text-[#77736E] transition hover:text-[#252525] sm:block"
          >
            전체보기 →
          </button>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {fortunes.map((fortune) => (
            <button
              key={fortune.title}
              type="button"
              className="group rounded-[22px] border border-[#E8E5DF] bg-white p-5 text-left shadow-[0_3px_14px_rgba(37,37,37,0.025)] transition duration-200 hover:-translate-y-1 hover:border-[#DCD7CF] hover:shadow-[0_10px_28px_rgba(37,37,37,0.06)] sm:p-6"
            >
              <div
                className={`flex size-11 items-center justify-center rounded-[15px] text-[17px] font-bold ${fortune.tone}`}
              >
                {fortune.icon}
              </div>

              <h3 className="mt-5 text-[16px] font-extrabold tracking-[-0.035em] text-[#252525] sm:text-[17px]">
                {fortune.title}
              </h3>

              <p className="mt-2 text-[12px] leading-5 tracking-[-0.015em] text-[#88837D] sm:text-[13px]">
                {fortune.description}
              </p>

              <div className="mt-5 text-[12px] font-bold text-[#9B9690] transition group-hover:text-[#29354F]">
                확인하기 →
              </div>
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}