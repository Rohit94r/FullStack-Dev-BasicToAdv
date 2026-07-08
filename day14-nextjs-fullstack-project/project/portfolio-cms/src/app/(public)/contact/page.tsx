import { submitContact } from "@/app/actions/contact";

// TODO: Contact page with form wired to submitContact server action
// YOUR IDEA:

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <form action={submitContact} className="space-y-4">
        <input name="name" placeholder="Name" required className="border p-2 w-full rounded" />
        <input name="email" type="email" placeholder="Email" required className="border p-2 w-full rounded" />
        <input name="subject" placeholder="Subject" className="border p-2 w-full rounded" />
        <textarea name="body" placeholder="Message" required rows={5} className="border p-2 w-full rounded" />
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Send message
        </button>
      </form>
    </main>
  );
}
