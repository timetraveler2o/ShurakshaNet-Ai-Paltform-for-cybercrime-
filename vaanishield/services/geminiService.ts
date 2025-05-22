
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { AudioFileData, VoIPScamAnalysisReport, GeminiVoIPScamResponse, VoIPScamAssessment, ScamCallRecommendation } from '../types';
import { GEMINI_MODEL_NAME, VAANI_SHIELD_SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(
    "Gemini API Key (process.env.API_KEY) is not configured. " +
    "VaaniShield analysis will not function. Please set this environment variable."
  );
}

const parseGeminiVoIPScamResponse = (responseText: string, fileName: string): VoIPScamAnalysisReport => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }

  try {
    const parsedData = JSON.parse(jsonStr) as GeminiVoIPScamResponse;
    
    const validAssessments: VoIPScamAssessment[] = ["Likely Scam", "Potentially Suspicious", "Likely Safe", "Unknown"];
    const validRecommendations: ScamCallRecommendation[] = ["Block Number & Report", "Monitor Number", "Caution Advised", "No Immediate Action Needed"];

    if (typeof parsedData.assessment !== 'string' || !validAssessments.includes(parsedData.assessment) ||
        typeof parsedData.confidence !== 'number' ||
        !Array.isArray(parsedData.detectedIndicators) || !parsedData.detectedIndicators.every(i => typeof i === 'string') ||
        typeof parsedData.simulatedTranscriptSummary !== 'string' ||
        typeof parsedData.recommendation !== 'string' || !validRecommendations.includes(parsedData.recommendation)
        ) {
      console.error("Invalid JSON structure from VaaniShield API:", parsedData);
      throw new Error('Invalid JSON structure received from VaaniShield API.');
    }
    
    parsedData.confidence = Math.max(0, Math.min(1, parsedData.confidence)); // Clamp confidence

    return {
      ...parsedData,
      assessment: parsedData.assessment as VoIPScamAssessment,
      recommendation: parsedData.recommendation as ScamCallRecommendation,
      fileName,
    };
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini for VaaniShield:", e);
    console.error("Raw response text for VaaniShield:", responseText);
    throw new Error(`Failed to parse AI response for VaaniShield. Raw text: ${responseText.substring(0, 500)}`);
  }
};

export const analyzeVoIPCall = async (
  audioData: AudioFileData
): Promise<VoIPScamAnalysisReport> => {
  if (!ai) {
    throw new Error("Gemini API client (VaaniShield) is not initialized. API_KEY might be missing.");
  }

  const textPrompt = `
Analyze the provided audio call recording (filename: ${audioData.fileName}) for indicators of a VoIP scam.
Follow the system instructions to identify scam patterns, keywords, and provide a structured JSON response.
The audio data itself is provided as an inline part.
  `;

  const audioPart = {
    inlineData: {
      mimeType: audioData.fileType, 
      data: audioData.base64Data,
    },
  };

  const textPart = {
    text: textPrompt,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: [audioPart, textPart] }, // Multimodal input
      config: {
        systemInstruction: VAANI_SHIELD_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received empty response from Gemini API for VaaniShield.");
    }
    
    return parseGeminiVoIPScamResponse(responseText, audioData.fileName);

  } catch (error) {
    console.error("Error calling Gemini API for VaaniShield:", error);
     if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key for VaaniShield. Please check your API_KEY.");
        }
         if (error.message.toLowerCase().includes("fetch failed") || error.message.toLowerCase().includes("networkerror")) {
            throw new Error("Network error contacting Gemini API for VaaniShield. Check connection.");
        }
    }
    throw error; 
  }
};
