import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME, COP_BOT_SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;
let chatInstance: Chat | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(
    "Gemini API Key (process.env.API_KEY) is not configured. " +
    "Sahayak CopBot will not function. Please set this environment variable."
  );
}

export const initializeChat = (): Chat | null => {
  if (!ai) {
    console.error("Gemini API client (Sahayak CopBot) is not initialized. API_KEY might be missing.");
    return null;
  }
  if (!chatInstance) {
    chatInstance = ai.chats.create({
      model: GEMINI_MODEL_NAME,
      config: {
        systemInstruction: COP_BOT_SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatInstance;
};

export const sendMessageToCopBot = async (messageText: string): Promise<string> => {
  const currentChat = initializeChat();
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
            throw new Error("Invalid Gemini API Key for Sahayak CopBot. Please check your API_KEY.");
        }
        if (error.message.toLowerCase().includes("fetch") || error.message.toLowerCase().includes("network")) {
             throw new Error("Network error contacting Gemini API for Sahayak CopBot. Check connection.");
        }
         if (error.message.includes("quota")) {
            throw new Error("API quota exceeded for Sahayak CopBot. Please check your Gemini API plan.");
        }
         // It's possible the error from SDK is not an Error instance, but has a message
    } else if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key for Sahayak CopBot. Please check your API_KEY.");
        }
        throw new Error(`Sahayak CopBot API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while communicating with Sahayak CopBot.");
  }
};

// Function to clear chat history (optional, if needed for a "new chat" button)
export const resetChatSession = (): void => {
    chatInstance = null; // This will cause initializeChat to create a new one on next call
};
