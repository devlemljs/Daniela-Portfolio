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

const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
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
      return res.status(200).json({
        text: "I prefer to keep our discussion focused on professional topics. Please use appropriate language so I can assist you better.",
        isProfane: true
      });
    }

    // Get API key
    const apiKey = process.env.GEMINI_API_KEY?.trim().replace(/["']/g, '');
    if (!apiKey) {
      console.error('[api/chat] GEMINI_API_KEY is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Build history
    const chatHistory = (history || []).slice(-10).map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    // Try each model
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

        const text = response.text;
        if (!text) throw new Error("Empty response from API");

        console.log(`[api/chat] Success with model: ${modelName}`);
        return res.status(200).json({ text });

      } catch (err: any) {
        lastError = err;
        console.error(`[api/chat] Failed with ${modelName}:`, err.message);

        const msg = err.message?.toLowerCase() || '';
        if (msg.includes('api key not valid') || msg.includes('invalid api key')) {
          return res.status(500).json({ error: 'Invalid API key. Please check your Vercel environment variables.' });
        }
        // 404 = model not found, try next
        // 429/503 = quota, try next
        continue;
      }
    }

    console.error('[api/chat] All models failed:', lastError?.message);
    return res.status(500).json({ error: 'Chat service temporarily unavailable.' });

  } catch (error: any) {
    console.error('[api/chat] Unexpected error:', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}