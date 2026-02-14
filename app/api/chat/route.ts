import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const prompt = `Identify if the following text is in Amharic or English. Reply with ONLY 'am' or 'en'.\n\nText: ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const lang = response.text().trim().toLowerCase();
    return lang.includes("am") ? "am" : "en";
  } catch (error) {
    console.error("Language Detection Error:", error);
    return "en";
  }
}

async function translateText(
  text: string,
  targetLang: "am" | "en",
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const systemPrompt =
      targetLang === "en"
        ? "Translate the following Amharic text to English. Maintain the emotional tone."
        : "Translate the following English text to Amharic. Maintain the emotional tone and use natural sounding Amharic (Geez script).";

    const prompt = `${systemPrompt}\n\nText: ${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim() || text;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
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
    let processedMessage = message;

    // 3. Translate if Amharic
    if (lang === "am") {
      processedMessage = await translateText(message, "en");
    }

    // 4. Gemini Chat Completion
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    let history: { role: string; parts: { text: string }[] }[] = [];

    if (sessionId) {
      const pastMessages = await prisma.chatMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: "asc" },
        take: 10, // Fetch last 10 messages (5 exchanges)
      });

      history = pastMessages.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      }));
    }

    const chat = model.startChat({
      history: history,
    });

    const result = await chat.sendMessage(processedMessage);
    const response = await result.response;
    let assistantReply =
      response.text() || "I'm sorry, I couldn't process that.";

    // 5. Translate back if original was Amharic
    if (lang === "am") {
      assistantReply = await translateText(assistantReply, "am");
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
