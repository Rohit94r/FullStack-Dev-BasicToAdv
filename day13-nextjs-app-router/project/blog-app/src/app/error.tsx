"use client";

// TODO: Error boundary — must be client component
// YOUR IDEA:

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-xl font-bold">Something went wrong</h2>
      <p className="text-muted-foreground mt-2">{error.message}</p>
      <button onClick={reset} className="mt-4 underline">
        Try again
      </button>
    </main>
  );
}
