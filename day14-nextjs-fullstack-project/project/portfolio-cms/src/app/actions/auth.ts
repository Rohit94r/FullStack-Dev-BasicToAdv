"use server";

// TODO: login(formData) — verify email/password with bcrypt, set session cookie
// TODO: logout() — clear session cookie
// YOUR IDEA:

export async function login(_formData: FormData) {
  // YOUR IDEA
}

export async function logout() {
  // YOUR IDEA
}

// ─── ANSWER (only look after trying!) ───
/*
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return { error: "Invalid credentials" };
  }

  cookies().set("session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/admin");
}

export async function logout() {
  cookies().delete("session");
  redirect("/admin/login");
}
*/
