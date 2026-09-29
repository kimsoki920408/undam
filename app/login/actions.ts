"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

function getCredentials(formData: FormData) {
  const email = String(
    formData.get("email") ?? "",
  )
    .trim()
    .toLowerCase();

  const password = String(
    formData.get("password") ?? "",
  );

  return {
    email,
    password,
  };
}

export async function login(
  formData: FormData,
) {
  const { email, password } =
    getCredentials(formData);

  if (!email || !password) {
    redirect(
      "/login?error=" +
        encodeURIComponent(
          "이메일과 비밀번호를 입력해주세요.",
        ),
    );
  }

  const supabase =
    await createClient();

  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    redirect(
      "/login?error=" +
        encodeURIComponent(
          "이메일 또는 비밀번호를 확인해주세요.",
        ),
    );
  }

  redirect("/");
}

export async function signup(
  formData: FormData,
) {
  const { email, password } =
    getCredentials(formData);

  if (!email.includes("@")) {
    redirect(
      "/login?error=" +
        encodeURIComponent(
          "올바른 이메일을 입력해주세요.",
        ),
    );
  }

  if (password.length < 8) {
    redirect(
      "/login?error=" +
        encodeURIComponent(
          "비밀번호는 8자 이상 입력해주세요.",
        ),
    );
  }

  const headerStore =
    await headers();

  const origin =
    headerStore.get("origin") ??
    "http://localhost:3000";

  const supabase =
    await createClient();

  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,

      options: {
        emailRedirectTo:
          `${origin}/auth/callback`,
      },
    });

  if (error) {
    redirect(
      "/login?error=" +
        encodeURIComponent(
          error.message,
        ),
    );
  }

  if (data.session) {
    redirect("/");
  }

  redirect(
    "/login?message=" +
      encodeURIComponent(
        "가입 확인 메일을 보냈어요. 이메일에서 인증을 완료해주세요.",
      ),
  );
}