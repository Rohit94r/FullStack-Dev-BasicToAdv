import Link from "next/link";

// TODO: Root layout — html/body, nav links, fonts
// YOUR IDEA:

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b px-4 py-3 flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/posts">All posts</Link>
          <Link href="/posts/new">New post</Link>
        </header>
        {children}
      </body>
    </html>
  );
}
