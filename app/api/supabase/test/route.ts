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
      data,
      error,
    } =
      await supabase.auth.getSession();

    if (error) {
      return NextResponse.json(
        {
          ok: false,

          message:
            error.message,
        },

        {
          status: 500,
        },
      );
    }

    return NextResponse.json({
      ok: true,

      connected: true,

      authenticated:
        Boolean(
          data.session,
        ),

      message:
        "Supabase 연결이 정상입니다.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,

        connected: false,

        message:
          error instanceof Error
            ? error.message
            : "Supabase 연결에 실패했습니다.",
      },

      {
        status: 500,
      },
    );
  }
}