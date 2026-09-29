"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  deleteSavedResult,
} from "@/app/mypage/actions";

import type {
  SajuCalculationResult,
  SajuInput,
} from "@/types/saju";

const RESULT_STORAGE_KEY =
  "undam:temporary-saju-result";

type SavedResultActionsProps = {
  resultId: string;

  input: SajuInput;

  result:
    SajuCalculationResult;

  createdAt: string;
};

export function SavedResultActions({
  resultId,
  input,
  result,
  createdAt,
}: SavedResultActionsProps) {
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
    useState("");

  const openResult =
    () => {
      sessionStorage.setItem(
        RESULT_STORAGE_KEY,

        JSON.stringify({
          input,
          result,
          createdAt,
        }),
      );

      router.push(
        "/result",
      );
    };

  const handleDelete =
    () => {
      const confirmed =
        window.confirm(
          "저장된 사주 결과를 삭제할까요?",
        );

      if (!confirmed) {
        return;
      }

      setError("");

      startTransition(
        async () => {
          const response =
            await deleteSavedResult(
              resultId,
            );

          if (
            !response.ok
          ) {
            setError(
              response.message ??
                "삭제에 실패했습니다.",
            );

            return;
          }

          router.refresh();
        },
      );
    };

  return (
    <div className="mt-5">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={
            openResult
          }
          className="undam-primary-button flex-1"
        >
          다시 보기
        </button>

        <button
          type="button"
          onClick={
            handleDelete
          }
          disabled={
            isPending
          }
          className="inline-flex min-h-[52px] items-center justify-center rounded-[16px] border border-[#E5E1DA] bg-white px-5 text-[13px] font-bold text-[#8A625E] transition hover:bg-[#FAF3F2] disabled:opacity-50"
        >
          {isPending
            ? "삭제 중"
            : "삭제"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-[12px] text-[#A9534B]">
          {error}
        </p>
      )}
    </div>
  );
}