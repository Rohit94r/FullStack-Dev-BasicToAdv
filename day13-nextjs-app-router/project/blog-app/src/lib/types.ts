export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: string;
  likes: number;
};

// TODO: Add CreatePostInput type for server action validation
// YOUR IDEA:


// ─── ANSWER ───
// export type CreatePostInput = Pick<Post, "title" | "content"> & { excerpt?: string };
