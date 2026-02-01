"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createJournalEntry(data: {
  title: string;
  content: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { title, content } = data;

  if (!title || !content) {
    throw new Error("Title and content are required");
  }

  await prisma.journalEntry.create({
    data: {
      title,
      content,
      userId: session.user.id,
    },
  });

  revalidatePath("/journal");
}

export async function getJournalEntries() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return entries;
}
