import {
  NextResponse,
} from "next/server";

import {
  createClient,
} from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase =
      await createClient();

    const {
      data: profiles,
      error: profilesError,
    } =
      await supabase
        .from("saju_profiles")
        .select("id");

    const {
      data: results,
      error: resultsError,
    } =
      await supabase
        .from("fortune_results")
        .select("id");

    if (
      profilesError ||
      resultsError
    ) {
      return NextResponse.json(
        {
          ok: false,

          profilesError:
            profilesError?.message ??
            null,

          resultsError:
            resultsError?.message ??
            null,
        },

        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,

      databaseConnected: true,

      tables: {
        saju_profiles: {
          accessible: true,

          visibleRows:
            profiles?.length ?? 0,
        },

        fortune_results: {
          accessible: true,

          visibleRows:
            results?.length ?? 0,
        },
      },

      message:
        "운담 DB 테이블과 RLS 연결이 정상입니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,

        message:
          error instanceof Error
            ? error.message
            : "DB 테스트 중 오류가 발생했습니다.",
      },

      {
        status: 500,
      },
    );
  }
}