"use server";

import { revalidatePath } from "next/cache";

// TODO: submitContact(formData) — validate, save Message to DB
// YOUR IDEA:

export async function submitContact(_formData: FormData) {
  // YOUR IDEA
}

// ─── ANSWER (only look after trying!) ───
/*
import { z } from "zod";
import { db } from "@/lib/db";

const ContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  body: z.string().min(10),
});

export async function submitContact(formData: FormData) {
  const parsed = ContactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    body: formData.get("body"),
  });

  if (!parsed.success) {
    return { error: "Please check your input" };
  }

  await db.message.create({ data: parsed.data });
  revalidatePath("/admin/messages");
  return { success: true };
}
*/
