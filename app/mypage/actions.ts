"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function deleteSavedResult(
  resultId: string,
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message:
        "로그인이 필요합니다.",
    };
  }

  const { error } =
    await supabase
      .from("fortune_results")
      .delete()
      .eq("id", resultId)
      .eq("user_id", user.id);

  if (error) {
    return {
      ok: false,
      message:
        "저장된 결과를 삭제하지 못했습니다.",
    };
  }

  revalidatePath(
    "/mypage",
  );

  return {
    ok: true,
  };
}

export async function deleteSajuProfile(
  profileId: string,
) {
  const supabase =
    await createClient();

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      message:
        "로그인이 필요합니다.",
    };
  }

  /*
   * 프로필과 연결된 결과부터 삭제합니다.
   */
  const {
    error: resultsError,
  } =
    await supabase
      .from("fortune_results")
      .delete()
      .eq(
        "profile_id",
        profileId,
      )
      .eq(
        "user_id",
        user.id,
      );

  if (resultsError) {
    return {
      ok: false,
      message:
        "연결된 사주 결과를 삭제하지 못했습니다.",
    };
  }

  const {
    error: profileError,
  } =
    await supabase
      .from("saju_profiles")
      .delete()
      .eq("id", profileId)
      .eq("user_id", user.id);

  if (profileError) {
    return {
      ok: false,
      message:
        "사주 프로필을 삭제하지 못했습니다.",
    };
  }

  revalidatePath(
    "/mypage",
  );

  return {
    ok: true,
  };
}