import Link from "next/link";

import { Container } from "@/components/layout/container";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-[#E8E5DF] bg-[#F6F4F0]">
      <Container>
        <div className="py-10 sm:py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <div className="text-lg font-extrabold tracking-[-0.04em] text-[#252525]">
                운담
              </div>

              <p className="mt-3 max-w-md text-[13px] leading-6 tracking-[-0.02em] text-[#77736E]">
                생년월일과 태어난 시간을 바탕으로 나의 성향과 삶의 흐름을
                살펴보는 사주·운세 서비스입니다.
              </p>
            </div>

            <nav
              aria-label="서비스 정책"
              className="flex flex-wrap gap-x-5 gap-y-3 text-[12px] font-medium text-[#77736E]"
            >
              <Link href="/terms" className="hover:text-[#252525]">
                이용약관
              </Link>

              <Link href="/privacy" className="hover:text-[#252525]">
                개인정보처리방침
              </Link>

              <Link href="/refund-policy" className="hover:text-[#252525]">
                환불정책
              </Link>

              <Link href="/disclaimer" className="hover:text-[#252525]">
                서비스 안내
              </Link>
            </nav>
          </div>

          <div className="mt-8 border-t border-[#E4E0D9] pt-6">
            <p className="text-[11px] leading-5 tracking-[-0.01em] text-[#99958F]">
              운담의 콘텐츠는 전통 명리학적 해석을 바탕으로 제공되는
              참고·오락성 콘텐츠이며, 의료·법률·투자 등 전문적인 판단을
              대체하지 않습니다.
            </p>

            <p className="mt-4 text-[11px] text-[#ABA7A1]">
              © 2026 UNDAM. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}