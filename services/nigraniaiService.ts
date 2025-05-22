import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { SurveillanceVideoData, AnalysisParameters, NigraniAIAnalysisReport, GeminiNigraniAIEvent, AlertLevel, DetectedEvent } from '../types'; // Updated type
import { GLOBAL_GEMINI_MODEL_NAME, NIGRANIAI_SYSTEM_INSTRUCTION, DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
}

const parseGeminiNigraniAIResponse = (responseText: string): NigraniAIAnalysisReport => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) jsonStr = match[2].trim();

  try {
    const parsedDataArray = JSON.parse(jsonStr) as GeminiNigraniAIEvent[];
    if (!Array.isArray(parsedDataArray)) throw new Error('NigraniAI: Expected an array of events.');
    
    const validAlertLevels: AlertLevel[] = ["Info", "Low", "Medium", "High", "Critical"];
    return parsedDataArray.map((item, index): DetectedEvent => {
      if (typeof item.description !== 'string' || typeof item.locationInImage !== 'string' ||
          typeof item.alertLevel !== 'string' || !validAlertLevels.includes(item.alertLevel) ||
          typeof item.details !== 'string' || 
          (item.timestampDescription !== undefined && typeof item.timestampDescription !== 'string') // timestampDescription is optional
          ) {
        throw new Error(`NigraniAI: Invalid event structure at index ${index}.`);
      }
      return {
        id: `event-${Date.now()}-${index}`, description: item.description, locationInImage: item.locationInImage,
        alertLevel: item.alertLevel as AlertLevel, details: item.details, timestamp: new Date().toISOString(),
        timestampDescription: item.timestampDescription,
      };
    });
  } catch (e) {
    console.error("Failed to parse JSON for NigraniAI:", e, "Raw:", responseText);
    throw new Error(`Failed to parse AI response for NigraniAI. Raw: ${responseText.substring(0, 200)}`);
  }
};

export const analyzeSurveillanceVideo = async ( // Renamed function
  videoData: SurveillanceVideoData, // Updated type
  params: AnalysisParameters
): Promise<NigraniAIAnalysisReport> => {
  if (!ai) throw new Error("NigraniAI API client not initialized. API_KEY missing?");

  let textPrompt = `Analyze the provided surveillance video (filename: ${videoData.fileName}).
Identify general activity, any suspicious activities, objects, faces, emotions, violence, accidents, or theft-like actions as per the system instructions.
Provide descriptions and approximate timestamps for significant events.`;
  if (params.customFocus) {
    textPrompt += ` Pay special attention to: "${params.customFocus}".\n`;
  }
  textPrompt += ` Respond in the specified JSON format.`;

  const videoPart = { // Changed from imagePart
    inlineData: {
      mimeType: videoData.fileType, // Use video MIME type
      data: videoData.base64Data,
    },
  };
  const textPart = { text: textPrompt };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GLOBAL_GEMINI_MODEL_NAME, 
      contents: { parts: [videoPart, textPart] }, // Send video part
      config: { systemInstruction: NIGRANIAI_SYSTEM_INSTRUCTION, responseMimeType: "application/json" }
    });
    if (!response.text) throw new Error("Empty response from NigraniAI API.");
    return parseGeminiNigraniAIResponse(response.text);
  } catch (error) {
    console.error("Error in NigraniAI service:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key for NigraniAI.");
    }
    // Handle other specific errors, e.g., file size limits if API indicates
    if (error instanceof Error && error.message.includes("request payload size")) {
        throw new Error("Video file may be too large for NigraniAI analysis. Try a smaller video.");
    }
    throw error;
  }
};