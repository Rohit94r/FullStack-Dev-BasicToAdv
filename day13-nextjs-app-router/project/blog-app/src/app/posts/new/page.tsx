import { createPost } from "@/app/actions/posts";

// TODO: New post form wired to createPost server action
// Consider NewPostForm client wrapper with useFormStatus
// YOUR IDEA:

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Write a post</h1>
      <form action={createPost} className="space-y-4 max-w-lg">
        <input name="title" placeholder="Title" required className="border p-2 w-full" />
        <input name="excerpt" placeholder="Excerpt (optional)" className="border p-2 w-full" />
        <textarea name="content" placeholder="Content" required rows={8} className="border p-2 w-full" />
        <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded">
          Publish
        </button>
      </form>
    </div>
  );
}
