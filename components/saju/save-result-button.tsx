"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  createClient,
} from "@/lib/supabase/client";

import type {
  SajuInput,
} from "@/types/saju";

type SaveResultButtonProps = {
  profileId:
    string | null;

  input:
    SajuInput;
};

type SaveState =
  | "checking"
  | "guest"
  | "ready"
  | "saving"
  | "saved"
  | "error";

export function SaveResultButton({
  profileId,
  input,
}: SaveResultButtonProps) {
  const [
    state,
    setState,
  ] =
    useState<SaveState>(
      "checking",
    );

  const [
    message,
    setMessage,
  ] =
    useState("");

  useEffect(() => {
    const checkUser =
      async () => {
        const supabase =
          createClient();

        const {
          data: {
            user,
          },
        } =
          await supabase.auth.getUser();

        setState(
          user
            ? "ready"
            : "guest",
        );
      };

    void checkUser();
  }, []);

  const saveResult =
    async () => {
      setState(
        "saving",
      );

      setMessage("");

      try {
        const response =
          await fetch(
            "/api/saju/save",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
  JSON.stringify({
    profileId,
    input,
  }),
            },
          );

        const data =
          (await response.json()) as {
            ok: boolean;
            message?: string;
          };

        if (
          !response.ok ||
          !data.ok
        ) {
          throw new Error(
            data.message ||
              "저장에 실패했습니다.",
          );
        }

        setState(
          "saved",
        );

        setMessage(
          "내 계정에 사주 결과를 저장했어요.",
        );
      } catch (
        error
      ) {
        setState(
          "error",
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "저장 중 오류가 발생했습니다.",
        );
      }
    };

  if (
    state ===
    "checking"
  ) {
    return (
      <div className="mt-5 h-[58px] animate-pulse rounded-[18px] bg-[#EEECE8]" />
    );
  }

  if (
    state ===
    "guest"
  ) {
    return (
      <div className="mt-5 rounded-[22px] border border-[#E4E1DB] bg-white p-5">
        <p className="text-[13px] font-bold text-[#45413D]">
          이 결과를 나중에도
          보고 싶나요?
        </p>

        <p className="mt-1.5 text-[12px] leading-5 text-[#88837D]">
          로그인하면 현재 사주를
          내 계정에 저장할 수 있어요.
        </p>

        <Link
          href="/login"
          className="undam-primary-button mt-4 w-full"
        >
          로그인하고 저장하기
        </Link>
      </div>
    );
  }

  if (
    state ===
    "saved"
  ) {
    return (
      <div className="mt-5 rounded-[20px] border border-[#DDE8DF] bg-[#EEF3EE] px-5 py-4">
        <p className="text-[13px] font-bold text-[#55705F]">
          ✓ {message}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={
          saveResult
        }
        disabled={
          state ===
          "saving"
        }
        className="undam-primary-button w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state ===
        "saving"
          ? "저장하고 있어요..."
          : "이 사주 결과 저장하기"}
      </button>

      {state ===
        "error" && (
        <p className="mt-3 text-center text-[12px] text-[#A9534B]">
          {message}
        </p>
      )}
    </div>
  );
}