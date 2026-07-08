"use server";

// =============================================================================
// Auth server actions — register, login, logout
// =============================================================================

// TODO: registerAction(formData) — validate with Zod, hash password, create user
// TODO: loginAction(formData) — verify credentials, set session cookie / return token
// TODO: logoutAction() — clear session
// YOUR IDEA: write your attempt here first ↓


// ─── ANSWER outline ───
// 1. Parse email, password, name from FormData
// 2. Zod schema validate
// 3. db.user.create / db.user.findUnique
// 4. redirect to /dashboard on success

export async function registerAction(_formData: FormData) {
  throw new Error("Implement registerAction");
}

export async function loginAction(_formData: FormData) {
  throw new Error("Implement loginAction");
}

export async function logoutAction() {
  throw new Error("Implement logoutAction");
}
