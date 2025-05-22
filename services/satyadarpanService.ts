import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { MediaFileData, DeepfakeAnalysisReport, GeminiDeepfakeResponse, DeepfakeAssessment } from '../types';
import { GLOBAL_GEMINI_MODEL_NAME, SATYADARPAN_SYSTEM_INSTRUCTION, DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
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
      throw new Error('Invalid JSON structure received from API for deepfake analysis.');
    }
    
    parsedData.confidence = Math.max(0, Math.min(1, parsedData.confidence)); 

    return {
      ...parsedData,
      assessment: parsedData.assessment as DeepfakeAssessment,
      fileName,
    };
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini for deepfake:", e, "Raw:", responseText);
    throw new Error(`Failed to parse AI response for deepfake. Raw text: ${responseText.substring(0, 200)}`);
  }
};

export const analyzeMediaForDeepfake = async (
  mediaData: MediaFileData
): Promise<DeepfakeAnalysisReport> => {
  if (!ai) {
    throw new Error("SatyaDarpan API client not initialized. API_KEY might be missing.");
  }

  const textPrompt = `Analyze provided image (filename: ${mediaData.fileName}) for deepfake/manipulation. Focus on visual artifacts.`;

  const imagePart = { inlineData: { mimeType: mediaData.fileType, data: mediaData.base64Data } };
  const textPart = { text: textPrompt };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GLOBAL_GEMINI_MODEL_NAME,
      contents: { parts: [imagePart, textPart] }, 
      config: {
        systemInstruction: SATYADARPAN_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received empty response from Gemini API for SatyaDarpan.");
    }
    
    return parseGeminiDeepfakeResponse(responseText, mediaData.fileName);

  } catch (error) {
    console.error("Error in SatyaDarpan service:", error);
     if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key for SatyaDarpan.");
    }
    throw error; 
  }
};
