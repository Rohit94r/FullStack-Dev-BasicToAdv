// TODO: Home page loading skeleton
// YOUR IDEA:

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="h-8 w-48 bg-muted animate-pulse rounded mb-6" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-muted animate-pulse rounded mb-4" />
      ))}
    </main>
  );
}
