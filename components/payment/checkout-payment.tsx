"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  loadTossPayments,
  type TossPaymentsWidgets,
} from "@tosspayments/tosspayments-sdk";

import type {
  ProductCode,
} from "@/types/product";

type CheckoutPaymentProps = {
  product: {
    code:
      ProductCode;

    name:
      string;

    price:
      number;
  };

  profileId:
    string | null;

  customerKey:
    string;

  customerEmail:
    string | null;
};

type OrderResponse = {
  ok:
    boolean;

  message?:
    string;

  order?: {
    orderId:
      string;

    productName:
      string;

    amount:
      number;
  };
};

export function CheckoutPayment({
  product,
  profileId,
  customerKey,
  customerEmail,
}: CheckoutPaymentProps) {
  const [
    widgets,
    setWidgets,
  ] =
    useState<
      TossPaymentsWidgets |
      null
    >(null);

  const [
    ready,
    setReady,
  ] =
    useState(false);

  const [
    processing,
    setProcessing,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState("");

  /*
   * 1.
   * Toss SDK와 Widgets 객체 생성
   */
  useEffect(() => {
    let cancelled =
      false;

    async function initializeToss() {
      try {
        setError("");

        const clientKey =
          process.env
            .NEXT_PUBLIC_TOSS_CLIENT_KEY;

        if (!clientKey) {
          throw new Error(
            "Toss Client Key가 설정되지 않았습니다.",
          );
        }

        const tossPayments =
          await loadTossPayments(
            clientKey,
          );

        if (
          cancelled
        ) {
          return;
        }

        const paymentWidgets =
          tossPayments.widgets({
            customerKey,
          });

        if (
          cancelled
        ) {
          return;
        }

        setWidgets(
          paymentWidgets,
        );
      } catch (
        caughtError
      ) {
        if (
          cancelled
        ) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Toss 결제 SDK를 불러오지 못했습니다.",
        );
      }
    }

    void initializeToss();

    return () => {
      cancelled =
        true;
    };
  }, [
    customerKey,
  ]);

  /*
   * 2.
   * Widgets 객체가 준비된 뒤
   * 금액 설정 + 결제수단 + 약관 렌더링
   */
  useEffect(() => {
    if (!widgets) {
      return;
    }

    let cancelled =
      false;

    async function renderWidgets(
      paymentWidgets:
        TossPaymentsWidgets,
    ) {
      try {
        setReady(
          false,
        );

        setError("");

        await paymentWidgets.setAmount({
          currency:
            "KRW",

          value:
            product.price,
        });

        await Promise.all([
          paymentWidgets
            .renderPaymentMethods({
              selector:
                "#payment-method",

              variantKey:
                "DEFAULT",
            }),

          paymentWidgets
            .renderAgreement({
              selector:
                "#agreement",

              variantKey:
                "AGREEMENT",
            }),
        ]);

        if (
          cancelled
        ) {
          return;
        }

        setReady(
          true,
        );
      } catch (
        caughtError
      ) {
        if (
          cancelled
        ) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "결제수단을 불러오지 못했습니다.",
        );
      }
    }

    void renderWidgets(
      widgets,
    );

    return () => {
      cancelled =
        true;
    };
  }, [
    widgets,
    product.price,
  ]);

  /*
   * 3.
   * 주문 생성 후 Toss 결제 요청
   */
  async function requestPayment() {
    if (
      !widgets ||
      !ready ||
      processing
    ) {
      return;
    }

    const paymentWidgets =
      widgets;

    setProcessing(
      true,
    );

    setError("");

    try {
      const response =
        await fetch(
          "/api/orders",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify({
                productCode:
                  product.code,

                profileId,
              }),
          },
        );

      const data =
        (await response.json()) as
          OrderResponse;

      if (
        !response.ok ||
        !data.ok ||
        !data.order
      ) {
        throw new Error(
          data.message ??
            "주문을 생성하지 못했습니다.",
        );
      }

      /*
       * 서버 DB에서 확정한 금액으로
       * 결제 금액을 다시 설정합니다.
       */
      await paymentWidgets.setAmount({
        currency:
          "KRW",

        value:
          data.order.amount,
      });

      const origin =
        window.location.origin;

      await paymentWidgets.requestPayment({
        orderId:
          data.order.orderId,

        orderName:
          data.order.productName,

        successUrl:
          `${origin}/payment/success`,

        failUrl:
          `${origin}/payment/fail`,

        ...(customerEmail
          ? {
              customerEmail,
            }
          : {}),
      });
    } catch (
      caughtError
    ) {
      setProcessing(
        false,
      );

      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "결제 요청 중 오류가 발생했습니다.",
      );
    }
  }

  return (
    <div className="mt-7">
      <div className="overflow-hidden rounded-[22px] border border-[#ECE8E2] bg-white">
        <div
          id="payment-method"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-[22px] border border-[#ECE8E2] bg-white">
        <div
          id="agreement"
        />
      </div>

      {error && (
        <div className="mt-4 rounded-[16px] bg-[#FAEEEE] px-4 py-4 text-[12px] leading-5 text-[#A9534B]">
          {
            error
          }
        </div>
      )}

      <button
        type="button"
        disabled={
          !ready ||
          processing
        }
        onClick={
          requestPayment
        }
        className="undam-primary-button mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {!ready
          ? "결제수단 불러오는 중..."
          : processing
            ? "결제를 준비하고 있어요..."
            : `${product.price.toLocaleString(
                "ko-KR",
              )}원 결제하기`}
      </button>

      <p className="mt-4 text-center text-[10px] leading-5 text-[#AAA59E]">
        테스트 결제 환경입니다.
        실제 금액은 청구되지 않습니다.
      </p>
    </div>
  );
}