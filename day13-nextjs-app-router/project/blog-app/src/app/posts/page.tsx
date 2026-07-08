import Link from "next/link";
import { getPosts } from "@/lib/posts";

// TODO: All posts page with SearchBar (client component)
// YOUR IDEA:

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">All posts</h1>
      {/* TODO: <SearchBar /> */}
      <ul className="space-y-3">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
