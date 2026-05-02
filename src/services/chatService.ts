import { GoogleGenAI } from "@google/genai";

let genAI: GoogleGenAI | null = null;

function getAI() {
  if (!genAI) {
    let apiKey = process.env.GEMINI_API_KEY;
    let source = "environment";
    
    const USER_PROVIDED_KEY = "AIzaSyCc_UIpX_FyDfwhzmLeNGz9yEvVWME25bM";
    
    // Prioritize the user-provided key if it's known to be the "new" one
    // or if the environment key is missing/short/known-bad
    if (!apiKey || apiKey.length < 30 || apiKey.includes("AIzaSyBlGXX") || apiKey !== USER_PROVIDED_KEY) {
      console.log("[ChatService] Using user-provided key as primary.");
      apiKey = USER_PROVIDED_KEY;
      source = "user-provided (AIzaSyCc...)";
    }
    
    if (apiKey) {
      apiKey = apiKey.trim().replace(/["']/g, ''); // Remove quotes if added by mistake
    }
    
    if (!apiKey) {
      console.error("[ChatService] GEMINI_API_KEY is missing and no fallback provided.");
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    if (!apiKey.startsWith("AIza")) {
      console.warn(`[ChatService] Warning: API Key from ${source} does not start with 'AIza'.`);
    }

    console.log(`[ChatService] Initializing AI with key from ${source}: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
    
    genAI = new GoogleGenAI({ apiKey: apiKey });
  }
  return genAI;
}

const PROFANITY_WORDS = [
  'fuck', 'shit', 'asshole', 'bitch', 'cunt', 'dick', 'pussy', 'bastard', 
  'puta', 'gago', 'tangina', 'ulol', 'kingina', 'pakshet', 'tarantado',
  'stupid', 'idiot', 'dumb', 'ass', 'hell', 'motherfucker', 'jackass',
  'nigga', 'nigger', 'faggot', 'retard', 'bullshit', 'shitty', 'damn',
  'tang ina', 'tanga', 'bobo', 'pakshet', 'tanginamo', 'pokpok', 'kupal'
];

const PROFANITY_REFUSAL_MESSAGES = [
  "I'm sorry, but I cannot respond to messages containing inappropriate language. Let's keep our conversation professional.",
  "I prefer to keep our discussion focused on professional topics. Please use appropriate language so I can assist you better.",
  "I'm here to help with your digital marketing inquiries. Let's maintain a respectful and professional tone during our chat.",
  "I noticed some inappropriate language in your message. Let's move forward with a professional conversation instead.",
  "I'm unable to process messages that include profanity. I'd be happy to chat more if we keep things respectful!",
  "Please maintain a professional tone so we can continue our conversation about marketing and coordination.",
  "I'm dedicated to providing a professional environment. I would appreciate it if you could rephrase your message appropriately.",
  "Let's stick to professional language to ensure our communication remains clear and effective."
];

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

const MODELS = [
  "gemini-3-flash-preview",
  "gemini-3.1-pro-preview",
  "gemini-3.1-flash-lite-preview",
  "gemini-flash-latest",
  "gemini-2.0-flash",
];

export async function handleChatMessage(message: string, history: any[] = []) {
  const lowerMessage = message.toLowerCase();
  const isProfane = PROFANITY_WORDS.some(word => lowerMessage.includes(word));

  if (isProfane) {
    const randomMessage = PROFANITY_REFUSAL_MESSAGES[Math.floor(Math.random() * PROFANITY_REFUSAL_MESSAGES.length)];
    return { text: randomMessage, isProfane: true };
  }

  const chatHistory = history.map((h: any) => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.text }],
  })).slice(-10);

  let lastError: any = null;
  
  // Try to get AI instance
  let ai: GoogleGenAI;
  try {
    ai = getAI();
  } catch (err: any) {
    console.error("[ChatService] CRITICAL: AI Initialization failed:", err.message);
    throw new Error(`Chat configuration error: ${err.message}`);
  }

  for (const modelName of MODELS) {
    try {
      console.log(`[ChatService] Attempting model: ${modelName}`);
      
      const response = await ai.models.generateContent({
        model: modelName,
        contents: [...chatHistory, { role: 'user', parts: [{ text: message }] }],
        config: {
          systemInstruction: SYSTEM_PROMPT,
          temperature: 0.7,
        }
      });

      const responseText = response.text;

      if (!responseText) {
        throw new Error("Received empty response from API");
      }

      console.log(`[ChatService] Successfully generated response with model: ${modelName}`);
      return { text: responseText };
    } catch (error: any) {
      lastError = error;
      let status = 0;
      let errorMsg = "";

      if (error && typeof error === 'object') {
        // SDK error structure inspection
        status = error.status || error.statusCode || error.code || 0;
        errorMsg = error.message || JSON.stringify(error);
      } else {
        errorMsg = String(error);
      }
      
      const lowerError = errorMsg.toLowerCase();
      console.error(`[ChatService] Error with ${modelName}:`, errorMsg.substring(0, 500));

      // Key specific issues
      if (lowerError.includes("api key not valid") || 
          lowerError.includes("invalid api key") || 
          lowerError.includes("expired") || 
          lowerError.includes("api_key_invalid") ||
          lowerError.includes("key_invalid")) {
         
         const fatalMsg = "The Gemini API key is expired or invalid. Please renew it in the Settings menu.";
         console.error("[ChatService] FATAL API KEY ERROR:", fatalMsg);
         genAI = null; // Reset for retry with potentially updated env
         throw new Error(fatalMsg);
      }

      if (status === 404 || lowerError.includes("not found") || lowerError.includes("404")) {
        console.warn(`[ChatService] Model ${modelName} not found or inaccessible. Continuing to next model...`);
        continue;
      }

      if (status === 429 || status === 503 || lowerError.includes("quota") || lowerError.includes("limit") || lowerError.includes("overloaded")) {
        console.warn(`[ChatService] Quota or temporary availability issue with ${modelName}. Trying next...`);
        continue;
      }

      if (lowerError.includes("safety") || lowerError.includes("blocked")) {
        return { text: "I'm sorry, I cannot respond to that message as it might violate safety guidelines or my professional conduct rules." };
      }
    }
  }

  const lastErrorMessage = lastError?.message || String(lastError);
  console.error("[ChatService] ALL MODELS FAILED. Final error:", lastErrorMessage);
  
  throw new Error(`The chat service is temporarily unavailable: ${lastErrorMessage}`);
}

