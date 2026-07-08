import Link from "next/link";

// TODO: Public home page — Server Component
// - Fetch featured projects from DB (db.project.findMany({ where: { featured: true } }))
// - Hero section with your name + tagline
// - Grid of ProjectCard components
// YOUR IDEA:

export default async function HomePage() {
  // const projects = await db.project.findMany({ where: { featured: true, published: true } });
  const projects: { id: string; title: string; slug: string; description: string }[] = [];

  return (
    <main>
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">Your Name</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Full-stack developer — portfolio powered by Next.js + Prisma
        </p>
        <Link href="/projects" className="mt-6 inline-block underline">
          View all projects
        </Link>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="text-2xl font-bold mb-6">Featured work</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <p className="text-muted-foreground">No featured projects yet — add some in admin!</p>
          ) : (
            projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="border rounded-lg p-4 hover:shadow-md">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.description}</p>
              </Link>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
