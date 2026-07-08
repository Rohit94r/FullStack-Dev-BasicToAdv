import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPost, getPosts } from "@/lib/posts";
import { LikeButton } from "@/components/LikeButton";

type Props = { params: Promise<{ slug: string }> };

// TODO: generateStaticParams from all post slugs
// YOUR IDEA:
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

// TODO: generateMetadata for SEO
// YOUR IDEA:
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <article>
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-muted-foreground mt-1">{post.createdAt}</p>
      <div
        className="prose mt-6"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      {/* TODO: LikeButton client component */}
      <LikeButton postId={post.id} initialLikes={post.likes} />
    </article>
  );
}
