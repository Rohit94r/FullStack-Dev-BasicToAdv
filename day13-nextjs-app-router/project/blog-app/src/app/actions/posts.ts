"use server";

// TODO: Implement createPost server action
// - Read title, content, excerpt from FormData
// - Validate (non-empty title)
// - Call lib/posts.createPost
// - revalidatePath("/") and redirect to new post
// YOUR IDEA:

export async function createPost(_formData: FormData) {
  // YOUR IDEA
}

// TODO: likePost(postId: string) for LikeButton
// YOUR IDEA:

// ─── ANSWER (only look after trying!) ───
/*
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost as save, incrementLikes } from "@/lib/posts";

export async function createPost(formData: FormData) {
  const title = (formData.get("title") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const excerpt = (formData.get("excerpt") as string)?.trim();

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const post = await save({ title, content, excerpt });
  revalidatePath("/");
  revalidatePath("/posts");
  redirect(`/posts/${post.slug}`);
}

export async function likePost(postId: string) {
  const likes = await incrementLikes(postId);
  revalidatePath("/posts/[slug]", "page");
  return { likes };
}
*/
