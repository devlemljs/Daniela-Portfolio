import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleChatMessage } from '../src/services/chatService';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { message, history } = request.body;

    if (!message) {
      return response.status(400).json({ error: 'Message is required' });
    }

    const result = await handleChatMessage(message, history || []);
    return response.status(200).json(result);
  } catch (error: any) {
    return response.status(500).json({ 
      error: error.message || "Internal Server Error" 
    });
  }
}
