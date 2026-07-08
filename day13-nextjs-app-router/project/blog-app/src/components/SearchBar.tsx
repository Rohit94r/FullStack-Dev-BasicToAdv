"use client";

import { useRouter, useSearchParams } from "next/navigation";

// TODO: Search input that updates URL ?q= (server reads searchParams)
// YOUR IDEA:

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  return (
    <input
      type="search"
      placeholder="Search posts..."
      defaultValue={q}
      onChange={(e) => {
        // YOUR IDEA: router.push(`/posts?q=${e.target.value}`)
      }}
      className="border rounded px-3 py-2 w-full max-w-sm mb-4"
    />
  );
}

// ─── ANSWER ───
// const params = new URLSearchParams(searchParams);
// params.set("q", e.target.value);
// router.push(`/posts?${params.toString()}`);
