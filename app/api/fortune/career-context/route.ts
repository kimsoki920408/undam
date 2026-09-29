import {
  NextResponse,
} from "next/server";

import {
  createCareerContext,
} from "@/types/career-context";

import type {
  CareerContext,
} from "@/types/career-context";

import {
  createAdminClient,
} from "@/lib/supabase/admin";

import {
  createClient,
} from "@/lib/supabase/server";

type CareerContextRequest = {
  resultId?:
    unknown;

  context?:
    unknown;
};

export async function POST(
  request:
    Request,
) {
  try {
    /*
     * 1.
     * 현재 로그인 사용자 확인
     */
    const supabase =
      await createClient();

    const {
      data: {
        user,
      },
      error:
        authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !user
    ) {
      return NextResponse.json(
        {
          error:
            "로그인이 필요합니다.",
        },
        {
          status:
            401,
        },
      );
    }

    /*
     * 2.
     * 요청 데이터 읽기
     */
    let body:
      CareerContextRequest;

    try {
      body =
        (await request.json()) as
          CareerContextRequest;
    } catch {
      return NextResponse.json(
        {
          error:
            "요청 내용을 확인해주세요.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      typeof body.resultId !==
        "string" ||
      !body.resultId.trim()
    ) {
      return NextResponse.json(
        {
          error:
            "직업운 결과 정보가 없습니다.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      !body.context ||
      typeof body.context !==
        "object" ||
      Array.isArray(
        body.context,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "직업 정보를 확인해주세요.",
        },
        {
          status:
            400,
        },
      );
    }

    /*
     * 3.
     * 입력값 정규화
     */
    const careerContext =
      createCareerContext(
        body.context as
          Partial<CareerContext>,
      );

    /*
     * 현재 직업명 또는 실제 업무는
     * 최소 하나 필요
     */
    if (
      !careerContext.jobTitle &&
      !careerContext.mainWork
    ) {
      return NextResponse.json(
        {
          error:
            "현재 직업이나 실제로 하는 업무 중 하나는 입력해주세요.",
        },
        {
          status:
            400,
        },
      );
    }

    /*
     * 4.
     * 관리자 클라이언트
     *
     * secret key는 서버에서만 사용
     */
    const admin =
      createAdminClient();

    /*
     * 5.
     * 해당 결과가
     * 현재 사용자의 직업운인지 확인
     */
    const {
      data:
        result,
      error:
        resultError,
    } =
      await admin
        .from(
          "fortune_results",
        )
        .select(
          `
          id,
          user_id,
          product_code,
          source_order_id,
          generation_status
          `,
        )
        .eq(
          "id",
          body.resultId,
        )
        .maybeSingle();

    if (
      resultError
    ) {
      console.error(
        "career_context_result_lookup_error",
        resultError,
      );

      return NextResponse.json(
        {
          error:
            "직업운 결과를 확인하지 못했습니다.",
        },
        {
          status:
            500,
        },
      );
    }

    if (
      !result ||
      result.user_id !==
        user.id
    ) {
      return NextResponse.json(
        {
          error:
            "직업운 결과를 찾을 수 없습니다.",
        },
        {
          status:
            404,
        },
      );
    }

    if (
      result.product_code !==
      "career"
    ) {
      return NextResponse.json(
        {
          error:
            "직업·사업운 결과에서만 사용할 수 있습니다.",
        },
        {
          status:
            400,
        },
      );
    }

    if (
      !result.source_order_id
    ) {
      return NextResponse.json(
        {
          error:
            "구매 정보가 확인되지 않습니다.",
        },
        {
          status:
            403,
        },
      );
    }

    /*
     * 6.
     * 실제 결제 완료 주문인지 확인
     */
    const {
      data:
        order,
      error:
        orderError,
    } =
      await admin
        .from(
          "orders",
        )
        .select(
          `
          id,
          user_id,
          status
          `,
        )
        .eq(
          "id",
          result.source_order_id,
        )
        .maybeSingle();

    if (
      orderError
    ) {
      console.error(
        "career_context_order_lookup_error",
        orderError,
      );

      return NextResponse.json(
        {
          error:
            "구매 정보를 확인하지 못했습니다.",
        },
        {
          status:
            500,
        },
      );
    }

    if (
      !order ||
      order.user_id !==
        user.id ||
      order.status !==
        "PAID"
    ) {
      return NextResponse.json(
        {
          error:
            "결제가 완료된 직업운에서만 사용할 수 있습니다.",
        },
        {
          status:
            403,
        },
      );
    }

    /*
     * 7.
     * 직업정보 저장
     *
     * 기존 결과가 이미 생성되어 있었다면
     * 새 context를 반영하기 위해
     * 다시 PENDING 상태로 돌립니다.
     */
    const {
      error:
        updateError,
    } =
      await admin
        .from(
          "fortune_results",
        )
        .update(
          {
            career_context:
              careerContext,

            generation_status:
              "PENDING",

            generation_error:
              null,

            interpretation_data:
              null,

            interpretation_version:
              null,

            updated_at:
              new Date()
                .toISOString(),
          },
        )
        .eq(
          "id",
          result.id,
        )
        .eq(
          "user_id",
          user.id,
        );

    if (
      updateError
    ) {
      console.error(
        "career_context_update_error",
        updateError,
      );

      return NextResponse.json(
        {
          error:
            "직업 정보를 저장하지 못했습니다.",
        },
        {
          status:
            500,
        },
      );
    }

    return NextResponse.json(
      {
        ok:
          true,

        resultId:
          result.id,

        context:
          careerContext,

        generationStatus:
          "PENDING",
      },
      {
        status:
          200,
      },
    );
  } catch (
    error
  ) {
    console.error(
      "career_context_unexpected_error",
      error,
    );

    return NextResponse.json(
      {
        error:
          "직업 정보를 저장하는 중 문제가 발생했습니다.",
      },
      {
        status:
          500,
      },
    );
  }
}