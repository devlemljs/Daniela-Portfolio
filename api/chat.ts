import type { VercelRequest, VercelResponse } from '@vercel/node';
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

const FALLBACK_MESSAGES = [
  "I'm sorry, I'm having a bit of trouble right now. Please try again in a moment! 😊",
  "Apologies, I'm temporarily unavailable. Feel free to email me at lacuarindaniela1@gmail.com!",
  "I'm experiencing some technical difficulties. Please try again shortly!",
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Profanity check
    const lowerMessage = message.toLowerCase();
    const isProfane = PROFANITY_WORDS.some(word => lowerMessage.includes(word));
    if (isProfane) {
      const randomMessage = PROFANITY_REFUSAL_MESSAGES[
        Math.floor(Math.random() * PROFANITY_REFUSAL_MESSAGES.length)
      ];
      return res.status(200).json({ text: randomMessage, isProfane: true });
    }

    // Get API key
    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)?.trim().replace(/["']/g, '');
    if (!apiKey) {
      console.error('[api/chat] GEMINI_API_KEY is not set');
      return res.status(200).json({
        text: "I'm sorry, the chat service is not configured properly. Please contact me at lacuarindaniela1@gmail.com!"
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build chat history
    const chatHistory = (history || []).slice(-10).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    let lastError: any = null;

    for (const modelName of MODELS) {
      try {
        console.log(`[api/chat] Trying model: ${modelName}`);

        const response = await ai.models.generateContent({
          model: modelName,
          contents: [...chatHistory, { role: 'user', parts: [{ text: message }] }],
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
          }
        });

        // Extract text safely — SDK structure varies
        const text =
          response.text ??
          (response as any)?.candidates?.[0]?.content?.parts?.[0]?.text ??
          null;

        console.log(`[api/chat] Raw candidates:`, JSON.stringify((response as any)?.candidates?.[0]?.content?.parts));

        if (!text) throw new Error("Empty response from API");

        console.log(`[api/chat] Success with model: ${modelName}`);
        return res.status(200).json({ text });

      } catch (error: any) {
        lastError = error;
        const msg = (error.message || '').toLowerCase();
        console.error(`[api/chat] Error with ${modelName}:`, error.message?.substring(0, 200));

        if (msg.includes('api key not valid') || msg.includes('invalid api key') || msg.includes('api_key_invalid')) {
          return res.status(200).json({
            text: "I'm sorry, I'm having a configuration issue. Please reach out to me at lacuarindaniela1@gmail.com!"
          });
        }

        if (msg.includes('safety') || msg.includes('blocked')) {
          return res.status(200).json({
            text: "I'm sorry, I cannot respond to that message. Let's keep our conversation professional!"
          });
        }

        // Quota / rate limit / model not found — try next model
        if (
          msg.includes('quota') ||
          msg.includes('rate') ||
          msg.includes('limit') ||
          msg.includes('429') ||
          msg.includes('503') ||
          msg.includes('not found') ||
          msg.includes('404') ||
          msg.includes('overloaded') ||
          msg.includes('empty response')
        ) {
          console.warn(`[api/chat] Skipping ${modelName}, trying next...`);
          continue;
        }

        continue;
      }
    }

    // All models failed — return friendly fallback
    console.error('[api/chat] All models failed:', lastError?.message);
    const fallback = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
    return res.status(200).json({ text: fallback });

  } catch (error: any) {
    console.error('[api/chat] Unexpected error:', error.message);
    return res.status(200).json({
      text: "I'm sorry, I'm having a bit of trouble right now. Please try again in a moment! 😊"
    });
  }
}