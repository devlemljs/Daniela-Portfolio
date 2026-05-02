import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
You are Daniela Lacuarin, a professional Digital Marketing Specialist. You are chatting with a visitor on your portfolio website.

Your Tone & Personality:
- Professional, helpful, friendly, and expert in digital marketing.
- Enthusiastic about social media strategy and coordination.
- Redirect unrelated questions back to professional topics.

About Me:
Name: Daniela Lacuarin
Location: Philippines

My Experience:
- Social Media Manager at various agencies.
- Expert in Facebook/Instagram Ads.
- Skilled in content creation and community management.
- Background in events coordination.

My Skills: Social Media Management, Facebook Ads, Content Strategy, Influencer Marketing, Event Coordination.

Website & Chatbot Information:
- If someone asks who created this website or the chatbot, explain that it was developed by a programmer who is an acquaintance and known by me.

Guardrails:
- Always stay professional and polite.
- Do not provide personal contact info other than the official email lacuarindaniela1@gmail.com.
- If you don't know something about a specific business inquiry, suggest they email you.
`;

const PROFANITY_WORDS = [
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy', 'bastard',
  'puta', 'gago', 'tangina', 'ulol', 'kingina', 'pakshet', 'tarantado',
  'stupid', 'idiot', 'dumb', 'ass', 'hell', 'motherfucker', 'jackass',
  'nigga', 'nigger', 'faggot', 'retard', 'bullshit', 'shitty', 'damn',
  'tang ina', 'tanga', 'bobo', 'tanginamo', 'pokpok', 'kupal'
];

const PROFANITY_REFUSAL_MESSAGES = [
  "I'm sorry, but I cannot respond to messages containing inappropriate language. Let's keep our conversation professional.",
  "I prefer to keep our discussion focused on professional topics. Please use appropriate language so I can assist you better.",
  "I'm here to help with your digital marketing inquiries. Let's maintain a respectful and professional tone during our chat.",
  "I noticed some inappropriate language in your message. Let's move forward with a professional conversation instead.",
];

const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
];

export async function handleChatMessage(message: string, history: any[] = []) {
  // Profanity check
  const lowerMessage = message.toLowerCase();
  const isProfane = PROFANITY_WORDS.some(word => lowerMessage.includes(word));
  if (isProfane) {
    const randomMessage = PROFANITY_REFUSAL_MESSAGES[Math.floor(Math.random() * PROFANITY_REFUSAL_MESSAGES.length)];
    return { text: randomMessage, isProfane: true };
  }

  // Get API key — reads from .env locally, Vercel env vars in production
  const apiKey = process.env.GEMINI_API_KEY?.trim().replace(/["']/g, '');
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const chatHistory = history.slice(-10).map((h: any) => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }],
  }));

  let lastError: any = null;

  for (const modelName of MODELS) {
    try {
      console.log(`[ChatService] Trying model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [...chatHistory, { role: 'user', parts: [{ text: message }] }],
        config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.7 }
      });

      const text = response.text;
      if (!text) throw new Error("Empty response from API");

      console.log(`[ChatService] Success with model: ${modelName}`);
      return { text };

    } catch (error: any) {
      lastError = error;
      const msg = error.message?.toLowerCase() || '';
      console.error(`[ChatService] Error with ${modelName}:`, error.message);

      if (msg.includes('api key not valid') || msg.includes('invalid api key')) {
        throw new Error("The Gemini API key is invalid. Please check your environment variables.");
      }
      // continue to next model on 404/429/503
    }
  }

  throw new Error(`Chat service temporarily unavailable: ${lastError?.message}`);
}