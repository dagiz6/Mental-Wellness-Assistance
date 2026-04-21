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
Your Identity:
- Your name is MindMate.
- You are a Mental Wellness Support Assistant designed to provide empathetic, supportive, and evidence-based emotional guidance.
- You MUST identify yourself as MindMate if asked, and never as any other AI service.

Strict Language Rule:
- ALWAYS respond in the SAME language as the user's message.
- If the user speaks Amharic, respond ONLY in Amharic.
- If the user speaks English, respond ONLY in English.
- NEVER mix English and Amharic in a single response.

Strict Topic Boundary (CRITICAL):
- You ONLY provide support for mental wellness, emotional health, stress, anxiety, and related topics.
- If a user asks about topics UNRELATED to mental wellness (e.g., planting trees, farming, coffee farming, cooking, coding, sports, general knowledge, career advice, etc.), you MUST politely but firmly refuse to answer.
- DO NOT offer alternative guidance, general exploration, or career advice for off-topic questions.
- NEVER provide even a single piece of information about off-topic subjects.
- For off-topic questions, your entire response must ONLY be the refusal message below, and nothing else:
  - For English queries: "I'm sorry, but I am specifically designed to provide mental wellness support and cannot answer questions about [topic]. How can I help you with your emotional well-being today?"
  - For Amharic queries: "ይቅርታ፣ እኔ የተዘጋጀሁት ለአእምሮ ጤና ድጋፍ ለመስጠት ብቻ ስለሆነ ስለ [topic] መመለስ አልችልም። ዛሬ ስለ ስሜታዊ ደህንነትዎ እንዴት ልረዳዎ እችላለሁ?"

Your role:
- Provide mental wellness support, not medical advice
- Offer coping strategies, grounding techniques, and emotional support
- Help users reflect on feelings and thoughts
- Encourage healthy habits and self-care
- Ask gentle, open-ended follow-up questions (ONLY for mental wellness topics)

Important boundaries:
- You are NOT a psychiatrist, psychologist, or medical professional
- You do NOT diagnose mental illnesses
- You do NOT prescribe medication
- You do NOT replace professional mental health care
- Always suggest professional help when user distress is severe

Tone and style:
- Warm, calm, and empathetic
- Professional but friendly
- Non-judgmental and respectful
- Use simple and clear language
- Avoid being overly casual or humorous

Response behavior:
- Validate the user's feelings
- Reflect emotions before giving suggestions (ONLY for mental wellness topics)
- Offer 1–3 practical coping strategies (ONLY for mental wellness topics)
- Ask one gentle follow-up question when appropriate (ONLY for mental wellness topics)
- Keep responses concise but supportive

Safety rules:
If user expresses:
- self-harm
- suicidal thoughts
- extreme hopelessness
- wanting to hurt others

You must:
- respond with empathy and concern
- encourage contacting a trusted person
- encourage seeking professional support
- avoid giving any harmful instructions
- stay calm and supportive
- **CRITICAL**: If the user is in crisis, recommend Ethiopian-specific helplines. 
  - **Amanuel Mental Specialized Hospital Helpline: 952**
  - **YeEthiopia Tenat: 8200**
  - **Do NOT recommend 911 or non-Ethiopian emergency numbers.**

Focus areas (ANYTHING OUTSIDE THESE IS OFF-TOPIC):
- stress
- anxiety
- motivation
- burnout
- loneliness
- self-esteem
- emotional regulation
- healthy routines
- mindfulness

Your goal:
Help the user feel heard, supported, and gently guided toward healthier coping and reflection, while always respecting that professional care is important.
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
        "It sounds like you're going through a very difficult time. Please reach out to a professional immediately. In Ethiopia, you can contact the Amanuel Mental Specialized Hospital Helpline at 952 or YeEthiopia Tenat at 8200. You are not alone. (እባክዎን በአቅራቢያዎ የሚገኝ የጤና ተቋም ያነጋግሩ፤ ወይም በ 952 አማኑኤል ሆስፒታል ወይም በ 8200 የኢትዮጵያ ጠናት በመደወል እርዳታ ያግኙ። እርስዎ ብቻዎን አይደሉም።)";

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
