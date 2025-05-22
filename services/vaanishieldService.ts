

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { AudioFileDataInput, VoIPScamAnalysisReport, GeminiVoIPScamResponse, VoIPScamAssessment, ScamCallRecommendation } from '../types';
// Fix: Correct typo in VAANISHIELD_SYSTEM_INSTRUCTION import.
import { GLOBAL_GEMINI_MODEL_NAME, VAANISHIELD_SYSTEM_INSTRUCTION, DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
}

const parseGeminiVoIPScamResponse = (responseText: string, fileName: string): VoIPScamAnalysisReport => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) jsonStr = match[2].trim();

  try {
    const parsedData = JSON.parse(jsonStr) as GeminiVoIPScamResponse;
    const validAssessments: VoIPScamAssessment[] = ["Likely Scam", "Potentially Suspicious", "Likely Safe", "Unknown"];
    const validRecs: ScamCallRecommendation[] = ["Block Number & Report", "Monitor Number", "Caution Advised", "No Immediate Action Needed"];

    if (typeof parsedData.assessment !== 'string' || !validAssessments.includes(parsedData.assessment) ||
        typeof parsedData.confidence !== 'number' || !Array.isArray(parsedData.detectedIndicators) ||
        !parsedData.detectedIndicators.every(i => typeof i === 'string') ||
        typeof parsedData.simulatedTranscriptSummary !== 'string' ||
        typeof parsedData.recommendation !== 'string' || !validRecs.includes(parsedData.recommendation)) {
      throw new Error('Invalid JSON from VaaniShield API.');
    }
    parsedData.confidence = Math.max(0, Math.min(1, parsedData.confidence));
    return { ...parsedData, assessment: parsedData.assessment, recommendation: parsedData.recommendation, fileName };
  } catch (e) {
    console.error("Failed to parse JSON for VaaniShield:", e, "Raw:", responseText);
    throw new Error(`Failed to parse AI response for VaaniShield. Raw: ${responseText.substring(0, 200)}`);
  }
};

export const analyzeVoIPCall = async (audioData: AudioFileDataInput): Promise<VoIPScamAnalysisReport> => {
  if (!ai) throw new Error("VaaniShield API client not initialized. API_KEY missing?");

  const textPrompt = `Analyze audio call (${audioData.fileName}) for VoIP scam indicators.`;
  const audioPart = { inlineData: { mimeType: audioData.fileType, data: audioData.base64Data } };
  const textPart = { text: textPrompt };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GLOBAL_GEMINI_MODEL_NAME, contents: { parts: [audioPart, textPart] },
// Fix: Use the corrected constant for system instruction.
      config: { systemInstruction: VAANISHIELD_SYSTEM_INSTRUCTION, responseMimeType: "application/json" }
    });
    if (!response.text) throw new Error("Empty response from VaaniShield API.");
    return parseGeminiVoIPScamResponse(response.text, audioData.fileName);
  } catch (error) {
    console.error("Error in VaaniShield service:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      throw new Error("Invalid Gemini API Key for VaaniShield.");
    }
    throw error;
  }
};