import Link from "next/link";

import { Container } from "@/components/layout/container";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-[-180px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#EEEAF3] blur-[100px] sm:h-[520px] sm:w-[520px]" />

      <Container>
        <div className="relative mx-auto max-w-4xl py-16 text-center sm:py-24 lg:py-28">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E2DEE7] bg-white/75 px-4 py-2 text-[12px] font-bold tracking-[-0.02em] text-[#766D8C] shadow-sm backdrop-blur">
            <span className="size-1.5 rounded-full bg-[#766D8C]" />
            무료 기본 사주부터 시작해보세요
          </div>

          <h1 className="mt-7 text-[38px] font-extrabold leading-[1.16] tracking-[-0.06em] text-[#252525] sm:text-[54px] lg:text-[64px]">
            내가 태어난 순간에
            <br />
            담긴 이야기를 만나보세요.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-[16px] leading-7 tracking-[-0.025em] text-[#6D6A66] sm:text-[18px] sm:leading-8">
            생년월일과 태어난 시간을 기반으로
            <br className="hidden sm:block" />
            나의 성향과 인생의 흐름을 편안하게 살펴보세요.
          </p>

          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              href="/saju"
              className="inline-flex min-h-[54px] items-center justify-center rounded-[17px] bg-[#29354F] px-7 text-[15px] font-bold tracking-[-0.025em] text-white shadow-[0_8px_24px_rgba(41,53,79,0.15)] transition hover:-translate-y-0.5 hover:bg-[#202B43]"
            >
              무료로 내 사주 보기
              <span className="ml-2 text-[17px]">→</span>
            </Link>

            <Link
              href="#today"
              className="inline-flex min-h-[54px] items-center justify-center rounded-[17px] border border-[#E4E0D9] bg-white px-7 text-[15px] font-bold tracking-[-0.025em] text-[#343434] transition hover:bg-[#F7F5F2]"
            >
              오늘의 운세 둘러보기
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[12px] font-medium text-[#8B8781]">
            <span className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#EEF0F5] text-[10px] text-[#29354F]">
                ✓
              </span>
              회원가입 없이 시작
            </span>

            <span className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#EEF0F5] text-[10px] text-[#29354F]">
                ✓
              </span>
              기본 결과 무료
            </span>

            <span className="flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-[#EEF0F5] text-[10px] text-[#29354F]">
                ✓
              </span>
              저장 여부 직접 선택
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}