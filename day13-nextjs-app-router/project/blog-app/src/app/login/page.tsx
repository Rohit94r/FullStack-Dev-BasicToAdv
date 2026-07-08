// TODO: Fake login — form sets session cookie, redirects to ?from=
// Hint: use a server action or route handler to set cookie
// YOUR IDEA:

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  return (
    <main className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <p className="text-sm text-muted-foreground mb-4">
        Demo auth: any password works. Sets a fake session cookie.
      </p>
      {/* TODO: form action={loginAction} */}
      <form>
        <input name="email" placeholder="Email" className="border p-2 w-full mb-2" />
        <input name="password" type="password" placeholder="Password" className="border p-2 w-full mb-4" />
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Sign in
        </button>
      </form>
    </main>
  );
}

// ─── ANSWER hint — create app/actions/auth.ts ───
// "use server"
// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// export async function login(formData: FormData) {
//   cookies().set("session", "demo-user", { httpOnly: true, path: "/" });
//   redirect(formData.get("from") as string || "/posts/new");
// }
