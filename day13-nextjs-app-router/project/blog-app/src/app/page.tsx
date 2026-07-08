import Link from "next/link";
import { getPosts } from "@/lib/posts";

// TODO: Server Component — fetch posts, render list
// Optional: read searchParams.q for filtering
// YOUR IDEA:

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const posts = await getPosts();

  // TODO: filter by q if provided
  const filtered = posts;

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <ul className="space-y-4">
        {filtered.map((post) => (
          <li key={post.id} className="border rounded-lg p-4">
            <Link href={`/posts/${post.slug}`} className="text-xl font-semibold hover:underline">
              {post.title}
            </Link>
            <p className="text-muted-foreground mt-1">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}

// ─── ANSWER hint ───
// filtered = q ? posts.filter(p => p.title.toLowerCase().includes(q.toLowerCase())) : posts;
