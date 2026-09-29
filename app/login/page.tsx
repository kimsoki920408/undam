import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";

import {
  login,
  signup,
} from "./actions";

export const metadata: Metadata = {
  title: "로그인",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const params =
    await searchParams;

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <Container>
        <div className="mx-auto max-w-md">
          <Link
            href="/"
            className="text-[13px] font-bold text-[#8B8680]"
          >
            ← 홈으로
          </Link>

          <div className="mt-8">
            <p className="text-[12px] font-extrabold tracking-[0.06em] text-[#766D8C]">
              UNDAM ACCOUNT
            </p>

            <h1 className="mt-2 text-[34px] font-extrabold tracking-[-0.055em] text-[#252525]">
              운담에 로그인
            </h1>

            <p className="mt-4 text-[14px] leading-7 text-[#77736E]">
              저장한 사주와 구매한 운세를
              언제든 다시 확인할 수 있어요.
            </p>
          </div>

          <div className="mt-8 rounded-[28px] border border-[#E5E1DA] bg-white p-6 shadow-[0_10px_40px_rgba(37,37,37,0.04)] sm:p-8">
            {params.message && (
              <div className="mb-5 rounded-[17px] bg-[#EEF3EE] px-4 py-4 text-[12px] leading-5 text-[#55705F]">
                {params.message}
              </div>
            )}

            {params.error && (
              <div className="mb-5 rounded-[17px] bg-[#FAEEEE] px-4 py-4 text-[12px] leading-5 text-[#A9534B]">
                {params.error}
              </div>
            )}

            <form>
              <div>
                <label
                  htmlFor="email"
                  className="text-[13px] font-bold text-[#56524D]"
                >
                  이메일
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="example@email.com"
                  className="mt-2 h-[54px] w-full rounded-[16px] border border-[#E2DED7] bg-[#FAFAF8] px-4 text-[15px] outline-none placeholder:text-[#B4AFA8] focus:border-[#8C849B] focus:bg-white"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="text-[13px] font-bold text-[#56524D]"
                >
                  비밀번호
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="current-password"
                  placeholder="8자 이상 입력"
                  className="mt-2 h-[54px] w-full rounded-[16px] border border-[#E2DED7] bg-[#FAFAF8] px-4 text-[15px] outline-none placeholder:text-[#B4AFA8] focus:border-[#8C849B] focus:bg-white"
                />
              </div>

              <button
                formAction={login}
                className="undam-primary-button mt-7 w-full"
              >
                로그인
              </button>

              <button
                formAction={signup}
                className="undam-secondary-button mt-3 w-full"
              >
                이메일로 회원가입
              </button>
            </form>

            <div className="mt-7 border-t border-[#ECE8E2] pt-6">
              <p className="text-center text-[11px] leading-5 text-[#99948E]">
                무료 사주는 회원가입 없이도
                이용할 수 있어요.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}