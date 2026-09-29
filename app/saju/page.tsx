import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { SajuForm } from "@/components/saju/saju-form";
import { createClient } from "@/lib/supabase/server";

import type {
  BirthShichen,
  BirthTimeMode,
  CalendarType,
  Gender,
} from "@/types/saju";

export const metadata: Metadata = {
  title: "무료 사주 보기",
  description:
    "생년월일과 태어난 시간을 입력하고 나의 기본 사주를 확인해보세요.",
};

export type SavedSajuProfile = {
  id: string;

  nickname: string;

  gender: Gender;

  calendarType: CalendarType;

  isLeapMonth: boolean;

  birthDate: string;

  birthTimeMode: BirthTimeMode;

  birthTime: string | null;

  birthShichen: BirthShichen | null;

  birthRegion: string;
};

export default async function SajuPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  let savedProfile:
    | SavedSajuProfile
    | null = null;

  if (user) {
    const {
      data,
    } =
      await supabase
        .from("saju_profiles")
        .select(
          `
          id,
          nickname,
          gender,
          calendar_type,
          is_leap_month,
          birth_date,
          birth_time_mode,
          birth_time,
          birth_shichen,
          birth_region
          `,
        )
        .eq("user_id", user.id)
        .order(
          "created_at",
          {
            ascending: false,
          },
        )
        .limit(1)
        .maybeSingle();

    if (data) {
      savedProfile = {
        id: data.id,

        nickname:
          data.nickname,

        gender:
          data.gender as Gender,

        calendarType:
          data.calendar_type as CalendarType,

        isLeapMonth:
          data.is_leap_month,

        birthDate:
          data.birth_date,

        birthTimeMode:
          data.birth_time_mode as BirthTimeMode,

        birthTime:
          data.birth_time
            ? data.birth_time.slice(
                0,
                5,
              )
            : null,

        birthShichen:
          data.birth_shichen as
            | BirthShichen
            | null,

        birthRegion:
          data.birth_region,
      };
    }
  }

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <Container>
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-[#88837D] transition hover:text-[#252525]"
          >
            <span>←</span>
            홈으로
          </Link>

          <div className="mt-7">
            <p className="text-[12px] font-extrabold tracking-[0.05em] text-[#766D8C]">
              MY SAJU
            </p>

            <h1 className="mt-2 text-[32px] font-extrabold leading-[1.25] tracking-[-0.055em] text-[#252525] sm:text-[40px]">
              나의 이야기를
              <br className="sm:hidden" />
              시작해볼까요?
            </h1>

            <p className="mt-4 text-[14px] leading-7 tracking-[-0.02em] text-[#77736E] sm:text-[15px]">
              {savedProfile
                ? "저장된 출생정보를 불러왔어요. 필요한 부분만 수정하고 다시 계산할 수 있습니다."
                : "입력한 정보를 바탕으로 사주의 기본 구조를 계산합니다."}
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <SajuForm
              savedProfile={
                savedProfile
              }
            />
          </div>
        </div>
      </Container>
    </section>
  );
}