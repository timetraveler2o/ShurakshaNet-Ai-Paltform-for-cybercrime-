import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { MediaFileData, DeepfakeAnalysisReport, GeminiDeepfakeResponse, DeepfakeAssessment } from '../types';
import { GEMINI_MODEL_NAME, DEEPFAKE_ANALYSIS_SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(
    "Gemini API Key (process.env.API_KEY) is not configured. " +
    "SatyaDarpan deepfake analysis will not function. Please set this environment variable."
  );
}

const parseGeminiDeepfakeResponse = (responseText: string, fileName: string): DeepfakeAnalysisReport => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }

  try {
    const parsedData = JSON.parse(jsonStr) as GeminiDeepfakeResponse;
    
    const validAssessments: DeepfakeAssessment[] = ["Authentic", "Likely Manipulated (Deepfake)", "Potentially Altered", "Subtle Anomalies Detected", "Uncertain"];
    if (typeof parsedData.assessment !== 'string' ||
        !validAssessments.includes(parsedData.assessment) ||
        typeof parsedData.explanation !== 'string' ||
        typeof parsedData.confidence !== 'number' ||
        !Array.isArray(parsedData.detectedArtifacts) ||
        !parsedData.detectedArtifacts.every(factor => typeof factor === 'string')) {
      console.error("Invalid JSON structure received from API for deepfake analysis:", parsedData);
      throw new Error('Invalid JSON structure received from API for deepfake analysis.');
    }
    
    parsedData.confidence = Math.max(0, Math.min(1, parsedData.confidence)); // Clamp confidence

    return {
      ...parsedData,
      assessment: parsedData.assessment as DeepfakeAssessment,
      fileName,
    };
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini for deepfake analysis:", e);
    console.error("Raw response text for deepfake:", responseText);
    throw new Error(`Failed to parse AI response for deepfake analysis. Raw text: ${responseText.substring(0, 500)}`);
  }
};

export const analyzeMediaForDeepfake = async (
  mediaData: MediaFileData
): Promise<DeepfakeAnalysisReport> => {
  if (!ai) {
    throw new Error("Gemini API client (SatyaDarpan) is not initialized. API_KEY might be missing.");
  }

  const textPrompt = `
Analyze the provided image (filename: ${mediaData.fileName}) for any signs of deepfake, AI generation, or manipulation.
Provide your assessment based on the system instructions. Focus on visual artifacts and inconsistencies.
  `;

  const imagePart = {
    inlineData: {
      mimeType: mediaData.fileType,
      data: mediaData.base64Data,
    },
  };

  const textPart = {
    text: textPrompt,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: [imagePart, textPart] }, // Multimodal input
      config: {
        systemInstruction: DEEPFAKE_ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received empty response from Gemini API for deepfake analysis.");
    }
    
    return parseGeminiDeepfakeResponse(responseText, mediaData.fileName);

  } catch (error) {
    console.error("Error calling Gemini API for deepfake analysis:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key for SatyaDarpan. Please check your API_KEY.");
        }
         if (error.message.toLowerCase().includes("fetch failed") || error.message.toLowerCase().includes("networkerror")) {
            throw new Error("Network error contacting Gemini API for SatyaDarpan. Check connection and CORS if applicable.");
        }
        // Add more specific error checks if needed
    }
    // Re-throw the error to be caught by the calling function in App.tsx
    throw error; 
  }
};