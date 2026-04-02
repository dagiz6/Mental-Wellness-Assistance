"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export type ActivityType = "journal" | "chat";

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  date: Date;
  link: string;
}

export async function getRecentActivity(): Promise<Activity[]> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const userId = session.user.id;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Fetch Journal Entries
  const journalEntries = await prisma.journalEntry.findMany({
    where: {
      userId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });

  // Fetch Chat Sessions
  // Include the first message to use as a title if possible, or just a generic title
  const chatSessions = await prisma.chatSession.findMany({
    where: {
      userId,
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    include: {
      messages: {
        take: 1,
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const journalActivities: Activity[] = journalEntries.map((entry) => ({
    id: entry.id,
    type: "journal",
    title: entry.title,
    date: entry.createdAt,
    link: "/journal",
  }));

  const chatActivities: Activity[] = chatSessions.map((session) => {
    const firstMessage = session.messages[0]?.content;
    const title = firstMessage 
      ? (firstMessage.length > 40 ? firstMessage.substring(0, 40) + "..." : firstMessage)
      : "New Chat Session";

    return {
      id: session.id,
      type: "chat",
      title,
      date: session.createdAt,
      link: `/chat`, // Adjust if there's a specific page like /chat/[id], but usually it's history
    };
  });

  // Combine and sort
  const allActivities = [...journalActivities, ...chatActivities].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  return allActivities;
}
