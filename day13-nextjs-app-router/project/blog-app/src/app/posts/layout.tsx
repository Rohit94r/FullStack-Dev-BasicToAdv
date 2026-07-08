import Link from "next/link";
import { getPosts } from "@/lib/posts";

// TODO: Nested layout — sidebar with recent posts + {children}
// YOUR IDEA:

export default async function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = await getPosts();
  const recent = posts.slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-8 grid md:grid-cols-[240px_1fr] gap-8">
      <aside className="hidden md:block">
        <h2 className="font-semibold mb-3">Recent</h2>
        <ul className="space-y-2 text-sm">
          {recent.map((p) => (
            <li key={p.id}>
              <Link href={`/posts/${p.slug}`} className="hover:underline">
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <div>{children}</div>
    </div>
  );
}
