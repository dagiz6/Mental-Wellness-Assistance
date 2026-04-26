"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

async function detectLanguage(text: string): Promise<"am" | "en"> {
  try {
    const prompt = `Identify if the following text is in Amharic or English. Reply with ONLY 'am' or 'en'.\n\nText: ${text}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.1-8b-instant",
    });

    const lang = completion.choices[0]?.message?.content?.trim().toLowerCase() || "en";
    return lang.includes("am") ? "am" : "en";
  } catch (error) {
    console.error("Language Detection Error:", error);
    return "en";
  }
}

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

export async function deleteJournalEntry(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Verify the entry belongs to the user
  const entry = await prisma.journalEntry.findUnique({
    where: { id },
  });

  if (!entry || entry.userId !== session.user.id) {
    throw new Error("Entry not found or unauthorized");
  }

  await prisma.journalEntry.delete({
    where: { id },
  });

  revalidatePath("/journal");
}

export async function analyzeJournal(content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const lang = await detectLanguage(content);

  // Fetch previous entries for context
  const previousEntries = await prisma.journalEntry.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const historyContext = previousEntries
    .map((e) => `Title: ${e.title}\nDate: ${e.createdAt.toDateString()}\nContent: ${e.content}`)
    .join("\n\n---\n\n");

  const systemPrompt = `
You are MindMate, a Mental Wellness Support Assistant.
Your task is to analyze the user's current journal entry and provide:
1. Emotional support and validation.
2. Practical wellness advice.
3. An assessment of their progress based on their previous journal entries.

Strict Rule:
- Respond ONLY in the same language as the user's current entry.
- If the entry is in Amharic, respond ONLY in Amharic.
- If the entry is in English, respond ONLY in English.
- Be empathetic, supportive, and non-judgmental.
- Focus on mental wellness and emotional health.
`;

  const userPrompt = `
Historical Context (Previous Entries):
${historyContext || "No previous entries."}

Current Entry for Analysis:
${content}

Please provide your analysis, advice, and progress assessment.
`;

  if (lang === "am") {
    const apiKey = process.env.ADDIS_API_KEY;
    if (!apiKey) {
      throw new Error("ADDIS_API_KEY is not set");
    }

    const response = await fetch("https://api.addisassistant.com/api/v1/chat_generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        prompt: `[System Instructions]\n${systemPrompt}\n\n[User Message]\n${userPrompt}`,
        target_language: "am",
        conversation_history: [],
        generation_config: { temperature: 0.5 }
      }),
    });

    if (!response.ok) {
      throw new Error(`Addis API Error: ${response.status}`);
    }

    const returnData = await response.json();
    return (returnData.data?.response_text || returnData.response_text)?.trim() || "ይቅርታ፣ ትንታኔውን ማካሄድ አልቻልኩም።";
  } else {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.1-8b-instant",
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't process the analysis.";
  }
}
