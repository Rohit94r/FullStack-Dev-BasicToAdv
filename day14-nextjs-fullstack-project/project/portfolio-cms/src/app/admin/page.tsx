// TODO: Admin dashboard — Server Component
// Fetch counts: total projects, unread messages
// Display in shadcn Card grid
// YOUR IDEA:

export default async function AdminDashboardPage() {
  // const [projectCount, unreadCount] = await Promise.all([
  //   db.project.count(),
  //   db.message.count({ where: { read: false } }),
  // ]);

  const projectCount = 0;
  const unreadCount = 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="text-3xl font-bold">{projectCount}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Unread messages</p>
          <p className="text-3xl font-bold">{unreadCount}</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-muted-foreground">Published</p>
          <p className="text-3xl font-bold">—</p>
        </div>
      </div>
    </div>
  );
}
