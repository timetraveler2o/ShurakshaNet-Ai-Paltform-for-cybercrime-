

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// Fix: Add DetectedEvent to the import list
import type { SurveillanceImageData, AnalysisParameters, NigraniAIAnalysisReport, GeminiNigraniAIEvent, AlertLevel, DetectedEvent } from '../types';
import { GEMINI_MODEL_NAME, NIGRAANI_AI_SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(
    "Gemini API Key (process.env.API_KEY) is not configured. " +
    "NigraniAI analysis will not function. Please set this environment variable."
  );
}

const parseGeminiNigraniAIResponse = (responseText: string): NigraniAIAnalysisReport => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }

  try {
    const parsedDataArray = JSON.parse(jsonStr) as GeminiNigraniAIEvent[];
    
    if (!Array.isArray(parsedDataArray)) {
        console.error("NigraniAI: Parsed data is not an array:", parsedDataArray);
        throw new Error('Invalid JSON structure: Expected an array of events.');
    }
    const validAlertLevels: AlertLevel[] = ["Info", "Low", "Medium", "High", "Critical"];

    return parsedDataArray.map((item, index): DetectedEvent => {
      if (typeof item.description !== 'string' ||
          typeof item.locationInImage !== 'string' ||
          typeof item.alertLevel !== 'string' || !validAlertLevels.includes(item.alertLevel) ||
          typeof item.details !== 'string') {
        console.error("NigraniAI: Invalid event object structure:", item);
        throw new Error(`Invalid structure for event object at index ${index}.`);
      }
      return {
        id: `event-${Date.now()}-${index}`, // Simple unique ID
        description: item.description,
        locationInImage: item.locationInImage,
        alertLevel: item.alertLevel as AlertLevel,
        details: item.details,
        timestamp: new Date().toISOString(),
      };
    });
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini for NigraniAI:", e);
    console.error("Raw response text for NigraniAI:", responseText);
    throw new Error(`Failed to parse AI response for NigraniAI. Raw text: ${responseText.substring(0, 500)}`);
  }
};

export const analyzeSurveillanceImage = async (
  imageData: SurveillanceImageData,
  params: AnalysisParameters
): Promise<NigraniAIAnalysisReport> => {
  if (!ai) {
    throw new Error("Gemini API client (NigraniAI) is not initialized. API_KEY might be missing.");
  }

  let textPrompt = `
Analyze the provided surveillance image (filename: ${imageData.fileName}).
Identify any suspicious activities or objects as per the system instructions.
`;
  if (params.customFocus) {
    textPrompt += `Pay special attention to: "${params.customFocus}".\n`;
  }
  textPrompt += `Provide your findings in the specified JSON format.`;


  const imagePart = {
    inlineData: {
      mimeType: imageData.fileType,
      data: imageData.base64Data,
    },
  };

  const textPart = {
    text: textPrompt,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: NIGRAANI_AI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received empty response from Gemini API for NigraniAI.");
    }
    
    return parseGeminiNigraniAIResponse(responseText);

  } catch (error) {
    console.error("Error calling Gemini API for NigraniAI:", error);
     if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key for NigraniAI. Please check your API_KEY.");
        }
         if (error.message.toLowerCase().includes("fetch failed") || error.message.toLowerCase().includes("networkerror")) {
            throw new Error("Network error contacting Gemini API for NigraniAI. Check connection.");
        }
    }
    throw error; 
  }
};