import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  calculateSaju,
} from "@/lib/saju/calculate-saju";

import {
  interpretBasicSaju,
} from "@/lib/fortune/interpret-basic-saju";

import {
  createClient,
} from "@/lib/supabase/server";

import type {
  BirthShichen,
  SajuInput,
} from "@/types/saju";

const validShichen =
  new Set<BirthShichen>([
    "자",
    "축",
    "인",
    "묘",
    "진",
    "사",
    "오",
    "미",
    "신",
    "유",
    "술",
    "해",
  ]);

function isSajuInput(
  value: unknown,
): value is SajuInput {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const input =
    value as Record<
      string,
      unknown
    >;

  const basicValid =
    typeof input.nickname ===
      "string" &&
    input.nickname.trim()
      .length > 0 &&
    input.nickname.trim()
      .length <= 30 &&
    typeof input.birthDate ===
      "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(
      input.birthDate,
    ) &&
    (
      input.calendarType ===
        "solar" ||
      input.calendarType ===
        "lunar"
    ) &&
    (
      input.gender ===
        "male" ||
      input.gender ===
        "female"
    ) &&
    typeof input.isLeapMonth ===
      "boolean" &&
    typeof input.birthRegion ===
      "string" &&
    input.birthRegion.trim()
      .length > 0;

  if (!basicValid) {
    return false;
  }

  if (
    input.birthTimeMode ===
    "exact"
  ) {
    return (
      typeof input.birthTime ===
        "string" &&
      /^\d{2}:\d{2}$/.test(
        input.birthTime,
      ) &&
      input.birthShichen ===
        null
    );
  }

  if (
    input.birthTimeMode ===
    "shichen"
  ) {
    return (
      input.birthTime ===
        null &&
      typeof input.birthShichen ===
        "string" &&
      validShichen.has(
        input.birthShichen as
          BirthShichen,
      )
    );
  }

  if (
    input.birthTimeMode ===
    "unknown"
  ) {
    return (
      input.birthTime ===
        null &&
      input.birthShichen ===
        null
    );
  }

  return false;
}

function normalizeTimeForDb(
  input: SajuInput,
) {
  return input.birthTimeMode ===
    "exact"
    ? input.birthTime
    : null;
}

function normalizeShichenForDb(
  input: SajuInput,
) {
  return input.birthTimeMode ===
    "shichen"
    ? input.birthShichen
    : null;
}

export async function POST(
  request: NextRequest,
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: userError,
  } =
    await supabase.auth.getUser();

  if (
    userError ||
    !user
  ) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "로그인이 필요합니다.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const body =
      (await request.json()) as {
        profileId?: unknown;
        input?: unknown;
      };

    if (
      !isSajuInput(
        body.input,
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "출생정보를 다시 확인해주세요.",
        },
        {
          status: 400,
        },
      );
    }

    const input =
      body.input;

    const requestedProfileId =
      typeof body.profileId ===
        "string" &&
      body.profileId.length > 0
        ? body.profileId
        : null;

    /*
     * 클라이언트 계산 결과를
     * 신뢰하지 않고 서버에서
     * 다시 계산합니다.
     */
    const calculation =
      calculateSaju(
        input,
      );

    const interpretation =
      interpretBasicSaju(
        calculation,
      );

    let profileId:
      string | null =
      null;

    /*
     * 1.
     * 기존 profileId가 넘어왔다면
     * 현재 사용자의 프로필인지 확인.
     */
    if (
      requestedProfileId
    ) {
      const {
        data:
          existingProfile,
        error:
          existingProfileError,
      } =
        await supabase
          .from(
            "saju_profiles",
          )
          .select("id")
          .eq(
            "id",
            requestedProfileId,
          )
          .eq(
            "user_id",
            user.id,
          )
          .maybeSingle();

      if (
        existingProfileError
      ) {
        throw new Error(
          existingProfileError
            .message,
        );
      }

      if (
        existingProfile
      ) {
        const {
          error:
            updateError,
        } =
          await supabase
            .from(
              "saju_profiles",
            )
            .update({
              nickname:
                input.nickname,

              gender:
                input.gender,

              calendar_type:
                input.calendarType,

              is_leap_month:
                input.isLeapMonth,

              birth_date:
                input.birthDate,

              birth_time_mode:
                input.birthTimeMode,

              birth_time:
                normalizeTimeForDb(
                  input,
                ),

              birth_shichen:
                normalizeShichenForDb(
                  input,
                ),

              birth_region:
                input.birthRegion,
            })
            .eq(
              "id",
              existingProfile.id,
            )
            .eq(
              "user_id",
              user.id,
            );

        if (
          updateError
        ) {
          throw new Error(
            updateError.message,
          );
        }

        profileId =
          existingProfile.id;
      }
    }

    /*
     * 2.
     * profileId가 없다면
     * 동일한 출생정보 프로필을 찾습니다.
     */
    if (!profileId) {
      let duplicateQuery =
        supabase
          .from(
            "saju_profiles",
          )
          .select("id")
          .eq(
            "user_id",
            user.id,
          )
          .eq(
            "nickname",
            input.nickname,
          )
          .eq(
            "gender",
            input.gender,
          )
          .eq(
            "calendar_type",
            input.calendarType,
          )
          .eq(
            "is_leap_month",
            input.isLeapMonth,
          )
          .eq(
            "birth_date",
            input.birthDate,
          )
          .eq(
            "birth_time_mode",
            input.birthTimeMode,
          )
          .eq(
            "birth_region",
            input.birthRegion,
          );

      if (
        input.birthTimeMode ===
        "exact"
      ) {
        duplicateQuery =
          duplicateQuery
            .eq(
              "birth_time",
              input.birthTime,
            )
            .is(
              "birth_shichen",
              null,
            );
      } else if (
        input.birthTimeMode ===
        "shichen"
      ) {
        duplicateQuery =
          duplicateQuery
            .is(
              "birth_time",
              null,
            )
            .eq(
              "birth_shichen",
              input.birthShichen,
            );
      } else {
        duplicateQuery =
          duplicateQuery
            .is(
              "birth_time",
              null,
            )
            .is(
              "birth_shichen",
              null,
            );
      }

      const {
        data:
          duplicateProfile,
        error:
          duplicateError,
      } =
        await duplicateQuery
          .limit(1)
          .maybeSingle();

      if (
        duplicateError
      ) {
        throw new Error(
          duplicateError.message,
        );
      }

      if (
        duplicateProfile
      ) {
        profileId =
          duplicateProfile.id;
      }
    }

    /*
     * 3.
     * 기존 프로필이 없을 때만
     * 새 프로필 생성.
     */
    let createdNewProfile =
      false;

    if (!profileId) {
      const {
        data:
          newProfile,
        error:
          profileError,
      } =
        await supabase
          .from(
            "saju_profiles",
          )
          .insert({
            user_id:
              user.id,

            label:
              "내 사주",

            nickname:
              input.nickname,

            gender:
              input.gender,

            calendar_type:
              input.calendarType,

            is_leap_month:
              input.isLeapMonth,

            birth_date:
              input.birthDate,

            birth_time_mode:
              input.birthTimeMode,

            birth_time:
              normalizeTimeForDb(
                input,
              ),

            birth_shichen:
              normalizeShichenForDb(
                input,
              ),

            birth_region:
              input.birthRegion,
          })
          .select("id")
          .single();

      if (
        profileError ||
        !newProfile
      ) {
        throw new Error(
          profileError
            ?.message ??
            "사주 프로필 저장에 실패했습니다.",
        );
      }

      profileId =
        newProfile.id;

      createdNewProfile =
        true;
    }

    /*
     * 4.
     * 기본 사주는 프로필당
     * 최신 결과 1개만 유지.
     */
    const {
      data:
        existingResult,
      error:
        existingResultError,
    } =
      await supabase
        .from(
          "fortune_results",
        )
        .select("id")
        .eq(
          "user_id",
          user.id,
        )
        .eq(
          "profile_id",
          profileId,
        )
        .eq(
          "fortune_type",
          "basic_saju",
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          },
        )
        .limit(1)
        .maybeSingle();

    if (
      existingResultError
    ) {
      throw new Error(
        existingResultError
          .message,
      );
    }

    let savedResultId:
      string;

    if (
      existingResult
    ) {
      const {
        data:
          updatedResult,
        error:
          updateResultError,
      } =
        await supabase
          .from(
            "fortune_results",
          )
          .update({
            input_data:
              input,

            calculation_data:
              calculation,

            interpretation_data:
              interpretation,

            engine_version:
              calculation
                .metadata
                .engineVersion,

            interpretation_version:
              "basic-rule-0.1.0",

            created_at:
              new Date()
                .toISOString(),
          })
          .eq(
            "id",
            existingResult.id,
          )
          .eq(
            "user_id",
            user.id,
          )
          .select("id")
          .single();

      if (
        updateResultError ||
        !updatedResult
      ) {
        throw new Error(
          updateResultError
            ?.message ??
            "사주 결과 업데이트에 실패했습니다.",
        );
      }

      savedResultId =
        updatedResult.id;
    } else {
      const {
        data:
          newResult,
        error:
          newResultError,
      } =
        await supabase
          .from(
            "fortune_results",
          )
          .insert({
            user_id:
              user.id,

            profile_id:
              profileId,

            fortune_type:
              "basic_saju",

            input_data:
              input,

            calculation_data:
              calculation,

            interpretation_data:
              interpretation,

            engine_version:
              calculation
                .metadata
                .engineVersion,

            interpretation_version:
              "basic-rule-0.1.0",
          })
          .select("id")
          .single();

      if (
        newResultError ||
        !newResult
      ) {
        /*
         * 이번 요청에서 새로 만든
         * 프로필일 때만 롤백합니다.
         */
        if (
          createdNewProfile &&
          profileId
        ) {
          await supabase
            .from(
              "saju_profiles",
            )
            .delete()
            .eq(
              "id",
              profileId,
            )
            .eq(
              "user_id",
              user.id,
            );
        }

        throw new Error(
          newResultError
            ?.message ??
            "사주 결과 저장에 실패했습니다.",
        );
      }

      savedResultId =
        newResult.id;
    }

    return NextResponse.json({
      ok: true,

      profileId,

      resultId:
        savedResultId,

      reusedProfile:
        !createdNewProfile,

      updatedExistingResult:
        Boolean(
          existingResult,
        ),

      message:
        existingResult
          ? "기존 기본 사주 결과를 최신 내용으로 업데이트했습니다."
          : createdNewProfile
            ? "새 사주 프로필과 결과를 저장했습니다."
            : "기존 사주 프로필에 결과를 저장했습니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,

        message:
          error instanceof Error
            ? error.message
            : "사주 저장 중 오류가 발생했습니다.",
      },
      {
        status: 500,
      },
    );
  }
}