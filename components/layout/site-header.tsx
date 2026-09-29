import Link from "next/link";

import { logout } from "@/app/auth/actions";
import { Container } from "@/components/layout/container";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.04] bg-[#FAFAF8]/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between sm:h-[72px]">
          <Link
            href="/"
            className="flex items-center gap-2.5"
            aria-label="운담 홈으로 이동"
          >
            <div className="flex size-9 items-center justify-center rounded-[13px] bg-[#29354F] text-sm font-bold text-white shadow-sm">
              운
            </div>

            <div>
              <div className="text-[17px] font-extrabold tracking-[-0.04em] text-[#252525]">
                운담
              </div>

              <div className="hidden text-[10px] font-medium text-[#99958F] sm:block">
                나를 읽는 새로운 방법
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            {user ? (
  <>
    <Link
      href="/mypage"
      className="px-2 text-[12px] font-bold text-[#77736E] transition hover:text-[#252525] sm:px-3 sm:text-[13px]"
    >
      <span className="sm:hidden">
        마이
      </span>

      <span className="hidden sm:inline">
        마이페이지
      </span>
    </Link>

    <form action={logout}>
      <button
        type="submit"
        className="px-1 text-[11px] font-bold text-[#99958F] transition hover:text-[#252525] sm:px-2 sm:text-[12px]"
      >
        <span className="sm:hidden">
          나가기
        </span>

        <span className="hidden sm:inline">
          로그아웃
        </span>
      </button>
    </form>
  </>
) : (
  <Link
    href="/login"
    className="px-2 text-[12px] font-bold text-[#77736E]"
  >
    로그인
  </Link>
)}

            <Link
              href="/saju"
              className="inline-flex h-10 items-center justify-center rounded-[14px] bg-[#29354F] px-3.5 text-[12px] font-bold text-white transition hover:bg-[#202B43] sm:px-4 sm:text-[13px]"
            >
              내 사주 보기
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}