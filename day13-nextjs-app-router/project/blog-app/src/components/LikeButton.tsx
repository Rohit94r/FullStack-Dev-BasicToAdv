"use client";

// TODO: Interactive like button — calls likePost server action
// YOUR IDEA:

export function LikeButton({
  postId,
  initialLikes,
}: {
  postId: string;
  initialLikes: number;
}) {
  return (
    <button className="mt-6 flex items-center gap-2 border rounded px-3 py-1">
      🤍 {initialLikes} likes
    </button>
  );
}

// ─── ANSWER (only look after trying!) ───
/*
import { useState, useTransition } from "react";
import { likePost } from "@/app/actions/posts";

export function LikeButton({ postId, initialLikes }: ...) {
  const [likes, setLikes] = useState(initialLikes);
  const [pending, startTransition] = useTransition();

  function handleLike() {
    startTransition(async () => {
      const result = await likePost(postId);
      setLikes(result.likes);
    });
  }

  return (
    <button onClick={handleLike} disabled={pending} className="...">
      ❤️ {likes} likes
    </button>
  );
}
*/
