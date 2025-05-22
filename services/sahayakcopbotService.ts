import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GLOBAL_GEMINI_MODEL_NAME, SAHAYAKCOPBOT_SYSTEM_INSTRUCTION, DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
let chatInstance: Chat | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
}

export const initializeChat = (): Chat | null => {
  if (!ai) {
    console.error("SahayakCopBot API client not initialized. API_KEY might be missing.");
    return null;
  }
  // Always create a new chat instance if one doesn't exist or to ensure fresh state for this session
  if (!chatInstance) { 
    chatInstance = ai.chats.create({
      model: GLOBAL_GEMINI_MODEL_NAME,
      config: {
        systemInstruction: SAHAYAKCOPBOT_SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatInstance;
};

export const sendMessageToCopBot = async (messageText: string): Promise<string> => {
  const currentChat = initializeChat(); // Ensures chat is initialized
  if (!currentChat) {
    throw new Error("Sahayak CopBot chat session is not initialized.");
  }

  try {
    const response: GenerateContentResponse = await currentChat.sendMessage({ message: messageText });
    const responseText = response.text;
    
    if (!responseText) {
      throw new Error("Received empty response from Sahayak CopBot.");
    }
    return responseText;
  } catch (error) {
    console.error("Error sending message to Sahayak CopBot:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key for Sahayak CopBot.");
        }
        if (error.message.toLowerCase().includes("fetch") || error.message.toLowerCase().includes("network")) {
             throw new Error("Network error contacting Gemini API for Sahayak CopBot.");
        }
        if (error.message.includes("quota")) {
            throw new Error("API quota exceeded for Sahayak CopBot.");
        }
    } else if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key for Sahayak CopBot.");
        }
        throw new Error(`Sahayak CopBot API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred with Sahayak CopBot.");
  }
};

export const resetChatSession = (): void => {
    chatInstance = null; 
};
