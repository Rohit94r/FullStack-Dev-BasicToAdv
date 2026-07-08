import { login } from "@/app/actions/auth";

// TODO: Admin login form
// YOUR IDEA:

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form action={login} className="border rounded-lg p-6 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">Admin login</h1>
        <input name="email" type="email" placeholder="Email" required className="border p-2 w-full rounded" />
        <input name="password" type="password" placeholder="Password" required className="border p-2 w-full rounded" />
        <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded">
          Sign in
        </button>
      </form>
    </main>
  );
}
