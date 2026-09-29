"use client";

import {
  useState,
  useTransition,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  deleteSajuProfile,
} from "@/app/mypage/actions";

type DeleteProfileButtonProps = {
  profileId: string;
};

export function DeleteProfileButton({
  profileId,
}: DeleteProfileButtonProps) {
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

  const handleDelete =
    () => {
      const confirmed =
        window.confirm(
          "이 사주 프로필과 연결된 저장 결과를 모두 삭제할까요?",
        );

      if (!confirmed) {
        return;
      }

      setError("");

      startTransition(
        async () => {
          const response =
            await deleteSajuProfile(
              profileId,
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
    <>
      <button
        type="button"
        onClick={
          handleDelete
        }
        disabled={
          isPending
        }
        className="text-[11px] font-bold text-[#A27A75] transition hover:text-[#8F4F49] disabled:opacity-50"
      >
        {isPending
          ? "삭제 중..."
          : "프로필 삭제"}
      </button>

      {error && (
        <p className="mt-2 text-[11px] text-[#A9534B]">
          {error}
        </p>
      )}
    </>
  );
}