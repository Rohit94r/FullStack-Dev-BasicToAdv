import Link from "next/link";

export default function PostNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold">Post not found</h2>
      <Link href="/posts" className="mt-4 inline-block underline">
        Browse all posts
      </Link>
    </div>
  );
}
