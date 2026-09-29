"use client";

import {
  useState,
  useTransition,
} from "react";

import Link from "next/link";

import {
  useRouter,
} from "next/navigation";

type GenerationStatus =
  | "PENDING"
  | "GENERATING"
  | "COMPLETED"
  | "FAILED";

type PaidResultCardProps = {
  resultId: string;

  productName: string;

  amount: number | null;

  generationStatus:
    GenerationStatus;

  generationError:
    string | null;

  createdAt: string;
};

export function PaidResultCard({
  resultId,
  productName,
  amount,
  generationStatus,
  generationError,
  createdAt,
}: PaidResultCardProps) {
  const router =
    useRouter();

  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  const [
    error,
    setError,
  ] =
    useState(
      generationError ?? "",
    );

  const generate =
    () => {
      setError("");

      startTransition(
        async () => {
          try {
            const response =
              await fetch(
                "/api/fortune/generate",
                {
                  method:
                    "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body:
                    JSON.stringify({
                      resultId,
                    }),
                },
              );

            const data =
              (await response.json()) as {
                ok:
                  boolean;

                message?:
                  string;
              };

            if (
              !response.ok ||
              !data.ok
            ) {
              throw new Error(
                data.message ??
                  "분석 결과를 생성하지 못했습니다.",
              );
            }

            router.refresh();

            router.push(
              `/fortune/${resultId}`,
            );
          } catch (
            caughtError
          ) {
            setError(
              caughtError instanceof Error
                ? caughtError.message
                : "분석 결과 생성 중 오류가 발생했습니다.",
            );
          }
        },
      );
    };

  const effectiveStatus =
    isPending
      ? "GENERATING"
      : generationStatus;

  return (
    <article className="rounded-[25px] border border-[#E7E3DC] bg-white p-6 shadow-[0_6px_22px_rgba(37,37,37,0.025)]">
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-[11px] font-extrabold tracking-[0.05em] text-[#766D8C]">
            PREMIUM
          </p>

          <h3 className="mt-2 text-[20px] font-extrabold tracking-[-0.04em] text-[#252525]">
            {productName}
          </h3>
        </div>

        <StatusBadge
          status={
            effectiveStatus
          }
        />
      </div>

      <div className="mt-5 rounded-[18px] bg-[#FAFAF8] px-4 py-4">
        {amount !== null && (
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#99948E]">
              결제 금액
            </span>

            <strong className="text-[13px] text-[#45413D]">
              {amount.toLocaleString(
                "ko-KR",
              )}
              원
            </strong>
          </div>
        )}

        <p className="mt-3 text-[10px] text-[#AAA59E]">
          구매일{" "}
          {formatDateTime(
            createdAt,
          )}
        </p>
      </div>

      {effectiveStatus ===
        "COMPLETED" && (
        <Link
          href={`/fortune/${resultId}`}
          className="undam-primary-button mt-5 w-full"
        >
          분석 결과 보기
        </Link>
      )}

      {effectiveStatus ===
        "PENDING" && (
        <button
          type="button"
          onClick={
            generate
          }
          className="undam-primary-button mt-5 w-full"
        >
          분석 결과 만들기
        </button>
      )}

      {effectiveStatus ===
        "GENERATING" && (
        <button
          type="button"
          disabled
          className="undam-primary-button mt-5 w-full cursor-not-allowed opacity-60"
        >
          분석 중...
        </button>
      )}

      {effectiveStatus ===
        "FAILED" && (
        <>
          <div className="mt-5 rounded-[16px] bg-[#FAEEEE] px-4 py-4">
            <p className="text-[11px] leading-5 text-[#A9534B]">
              분석 생성 중 문제가
              발생했어요.
            </p>
          </div>

          <button
            type="button"
            onClick={
              generate
            }
            className="undam-primary-button mt-3 w-full"
          >
            다시 분석하기
          </button>
        </>
      )}

      {error && (
        <p className="mt-3 text-[11px] leading-5 text-[#A9534B]">
          {error}
        </p>
      )}
    </article>
  );
}

function StatusBadge({
  status,
}: {
  status:
    GenerationStatus;
}) {
  if (
    status ===
    "COMPLETED"
  ) {
    return (
      <span className="shrink-0 rounded-full bg-[#EEF3EE] px-3 py-1.5 text-[10px] font-bold text-[#55705F]">
        분석 완료
      </span>
    );
  }

  if (
    status ===
    "FAILED"
  ) {
    return (
      <span className="shrink-0 rounded-full bg-[#FAEEEE] px-3 py-1.5 text-[10px] font-bold text-[#A9534B]">
        재시도 필요
      </span>
    );
  }

  if (
    status ===
    "GENERATING"
  ) {
    return (
      <span className="shrink-0 rounded-full bg-[#F2EFF5] px-3 py-1.5 text-[10px] font-bold text-[#766D8C]">
        분석 중
      </span>
    );
  }

  return (
    <span className="shrink-0 rounded-full bg-[#FFF4DD] px-3 py-1.5 text-[10px] font-bold text-[#96723E]">
      결제 완료
    </span>
  );
}

function formatDateTime(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "ko-KR",
    {
      year:
        "numeric",

      month:
        "long",

      day:
        "numeric",

      timeZone:
        "Asia/Seoul",
    },
  ).format(
    new Date(value),
  );
}