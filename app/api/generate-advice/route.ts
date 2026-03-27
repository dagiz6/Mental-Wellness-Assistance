import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { systemPrompt, userMessage, language } = await req.json();

    if (!userMessage) {
      return NextResponse.json({ error: "User message is required" }, { status: 400 });
    }

    if (language === "am") {
      const apiKey = process.env.ADDIS_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "ADDIS_API_KEY is not set" }, { status: 500 });
      }

      const promptWithSystem = `[System Instructions]\n${systemPrompt || "You are a helpful wellness assistant."}\n\n[User Message]\n${userMessage}`;

      const response = await fetch("https://api.addisassistant.com/api/v1/chat_generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          prompt: promptWithSystem,
          target_language: "am",
          conversation_history: [],
          generation_config: { temperature: 0.5 }
        }),
      });

      if (!response.ok) {
        throw new Error(`Addis API Error: ${response.status}`);
      }

      const returnData = await response.json();
      const assistantReply = (returnData.data?.response_text || returnData.response_text)?.trim() || "ይቅርታ፣ ያንን ማካሄድ አልቻልኩም።";
      return NextResponse.json({ reply: assistantReply });
    } else {
      const messages: any[] = [];
      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }
      messages.push({ role: "user", content: userMessage });

      const completion = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.1-8b-instant",
      });

      const assistantReply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
      return NextResponse.json({ reply: assistantReply });
    }
  } catch (error: any) {
    console.error("Generate Advice API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
