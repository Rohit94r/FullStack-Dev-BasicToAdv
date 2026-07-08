import type { Post } from "./types";

// TODO: Implement data layer — read/write posts.json
// Functions needed:
//   getPosts(): Promise<Post[]>
//   getPost(slug: string): Promise<Post | null>
//   createPost(input): Promise<Post>
//   incrementLikes(id: string): Promise<number>
// YOUR IDEA:


// ─── ANSWER (only look after trying!) ───
/*
import fs from "fs/promises";
import path from "path";

const DATA = path.join(process.cwd(), "data/posts.json");

async function readAll(): Promise<Post[]> {
  const raw = await fs.readFile(DATA, "utf-8");
  return JSON.parse(raw);
}

async function writeAll(posts: Post[]) {
  await fs.writeFile(DATA, JSON.stringify(posts, null, 2));
}

export async function getPosts(): Promise<Post[]> {
  return readAll();
}

export async function getPost(slug: string): Promise<Post | null> {
  const posts = await readAll();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function createPost(input: {
  title: string;
  content: string;
  excerpt?: string;
}): Promise<Post> {
  const posts = await readAll();
  const slug = input.title.toLowerCase().replace(/\s+/g, "-").slice(0, 50);
  const post: Post = {
    id: String(Date.now()),
    slug,
    title: input.title,
    excerpt: input.excerpt ?? input.content.slice(0, 120),
    content: input.content,
    createdAt: new Date().toISOString().slice(0, 10),
    likes: 0,
  };
  posts.unshift(post);
  await writeAll(posts);
  return post;
}

export async function incrementLikes(id: string): Promise<number> {
  const posts = await readAll();
  const post = posts.find((p) => p.id === id);
  if (!post) return 0;
  post.likes += 1;
  await writeAll(posts);
  return post.likes;
}
*/

export async function getPosts(): Promise<Post[]> {
  return [];
}

export async function getPost(_slug: string): Promise<Post | null> {
  return null;
}
