"use server";

import { revalidatePath } from "next/cache";

// TODO: Implement project CRUD server actions
// createProject(formData) — validate with Zod, save to DB, handle image upload
// updateProject(id, formData)
// deleteProject(id)
// YOUR IDEA:

export async function createProject(_formData: FormData) {
  // YOUR IDEA
}

export async function updateProject(_id: string, _formData: FormData) {
  // YOUR IDEA
}

export async function deleteProject(_id: string) {
  // YOUR IDEA
}

// ─── ANSWER (only look after trying!) ───
/*
import { z } from "zod";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10),
  content: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  published: z.coerce.boolean().optional(),
});

function slugify(title: string) {
  return title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export async function createProject(formData: FormData) {
  const parsed = ProjectSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    content: formData.get("content"),
    featured: formData.get("featured") === "on",
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // TODO: handle image file from formData.get("image") as File

  const project = await db.project.create({
    data: {
      ...parsed.data,
      slug: slugify(parsed.data.title),
    },
  });

  revalidatePath("/");
  revalidatePath("/projects");
  redirect(`/admin/projects/${project.id}/edit`);
}

export async function deleteProject(id: string) {
  await db.project.delete({ where: { id } });
  revalidatePath("/admin/projects");
  revalidatePath("/");
}
*/
