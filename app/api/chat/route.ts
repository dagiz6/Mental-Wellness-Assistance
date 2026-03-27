import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Groq from "groq-sdk";
import { prisma } from "@/lib/prisma";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

const CRISIS_KEYWORDS = [
  "suicide",
  "kill myself",
  "end my life",
  "jump off",
  "hurt myself",
  "self-harm",
  "ራሴን መግደል",
  "መሞት እፈልጋለሁ",
  "ህይወቴን ማጥፋት",
  "ራሴን ላጥፋ",
  "መሞት",
  "ራሴን ልግደል",
];

const SYSTEM_PROMPT = `
You are a warm, empathetic, and professional Mental Wellness AI Assistant. 
Your goal is to provide emotional support, active listening, and helpful coping strategies.

SAFETY RULES:
1. DO NOT provide medical diagnoses or prescribe medications.
2. DO NOT claim to be a doctor or therapist.
3. If the user expresses self-harm or suicidal thoughts, prioritize safety and suggest professional help.
4. Keep responses supportive and non-judgmental.

COMMUNICATION:
- Be concise but warm.
- Use CBT-based techniques or grounding exercises when appropriate.
- Maintain a supportive tone at all times.
`;

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



export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    const userId = session.user.id;

    // 1. Crisis Keyword Detection
    const lowerMessage = message.toLowerCase();
    const isCrisis = CRISIS_KEYWORDS.some((keyword) =>
      lowerMessage.includes(keyword),
    );

    if (isCrisis) {
      const crisisResponse =
        "It sounds like you're going through a very difficult time. Please reach out to a professional immediately. You can contact a local emergency service or a mental health helpline. You are not alone. (እባክዎን በአቅራቢያዎ የሚገኝ የጤና ተቋም ያነጋግሩ፤ እርስዎ ብቻዎን አይደሉም።)";

      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const newSession = await prisma.chatSession.create({
          data: { userId },
        });
        currentSessionId = newSession.id;
      }

      await prisma.chatMessage.createMany({
        data: [
          { sessionId: currentSessionId, role: "user", content: message },
          {
            sessionId: currentSessionId,
            role: "assistant",
            content: crisisResponse,
          },
        ],
      });

      return NextResponse.json({
        reply: crisisResponse,
        sessionId: currentSessionId,
        isCrisis: true,
      });
    }

    // 2. Language Detection
    const lang = await detectLanguage(message);
    let assistantReply = "";

    if (lang === "am") {
      // 3a. Addis Assistant Chat Completion (Direct Amharic)
      const apiKey = process.env.ADDIS_API_KEY;
      if (!apiKey) {
        return NextResponse.json({ error: "ADDIS_API_KEY is not set" }, { status: 500 });
      }

      let history: any[] = [];
      if (sessionId) {
        const pastMessages = await prisma.chatMessage.findMany({
          where: { sessionId },
          orderBy: { createdAt: "asc" },
          take: 10,
        });
        for (const msg of pastMessages) {
          history.push({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
          });
        }
      }

      const promptWithSystem = `[System Instructions]\n${SYSTEM_PROMPT}\n\n[User Message]\n${message}`;

      const response = await fetch("https://api.addisassistant.com/api/v1/chat_generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": apiKey,
        },
        body: JSON.stringify({
          prompt: promptWithSystem,
          target_language: "am",
          conversation_history: history,
          generation_config: { temperature: 0.5 }
        }),
      });

      if (!response.ok) {
        throw new Error(`Addis API Error: ${response.status}`);
      }

      const returnData = await response.json();
      assistantReply = (returnData.data?.response_text || returnData.response_text)?.trim() || "I'm sorry, I couldn't process that.";
    } else {
      // 3b. Groq Chat Completion (English)
      const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

      if (sessionId) {
        const pastMessages = await prisma.chatMessage.findMany({
          where: { sessionId },
          orderBy: { createdAt: "asc" },
          take: 10, // Fetch last 10 messages (5 exchanges)
        });

        for (const msg of pastMessages) {
          messages.push({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content,
          });
        }
      }

      messages.push({ role: "user", content: message });

      const completion = await groq.chat.completions.create({
        messages: messages,
        model: "llama-3.1-8b-instant",
      });

      assistantReply =
        completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that.";
    }

    // 6. DB Storage
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const newSession = await prisma.chatSession.create({ data: { userId } });
      currentSessionId = newSession.id;
    }

    await prisma.chatMessage.createMany({
      data: [
        { sessionId: currentSessionId, role: "user", content: message },
        {
          sessionId: currentSessionId,
          role: "assistant",
          content: assistantReply,
        },
      ],
    });

    return NextResponse.json({
      reply: assistantReply,
      sessionId: currentSessionId,
    });
  } catch (error: any) {
    console.error("Chat API Detailed Error:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause,
    });
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
