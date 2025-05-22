import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { EmailData, PhishingAnalysisReport, PhishingAssessment } from '../types';
import { GLOBAL_GEMINI_MODEL_NAME, KAVACHMAILGUARD_SYSTEM_INSTRUCTION, DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
}

interface GeminiPhishingResponse {
  assessment: PhishingAssessment;
  explanation: string;
  confidence: number;
}

const parseGeminiPhishingResponse = (responseText: string): PhishingAnalysisReport => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) jsonStr = match[2].trim();

  try {
    const parsedData = JSON.parse(jsonStr) as GeminiPhishingResponse;
    if (typeof parsedData.assessment !== 'string' || !['Phishing', 'Safe', 'Unknown'].includes(parsedData.assessment) ||
        typeof parsedData.explanation !== 'string' || typeof parsedData.confidence !== 'number') {
      throw new Error('Invalid JSON structure for phishing analysis.');
    }
    parsedData.confidence = Math.max(0, Math.min(1, parsedData.confidence));
    return parsedData;
  } catch (e) {
    console.error("Failed to parse JSON for phishing analysis:", e, "Raw:", responseText);
    throw new Error(`Failed to parse AI response for phishing. Raw: ${responseText.substring(0, 200)}`);
  }
};

export const analyzeEmailForPhishing = async (emailData: EmailData): Promise<PhishingAnalysisReport> => {
  if (!ai) throw new Error("KavachMailGuard API client not initialized. API_KEY missing?");

  const prompt = `Analyze the following email for phishing indicators:
Sender: ${emailData.sender}
Subject: ${emailData.subject}
Body:
${emailData.body}
---
Provide your assessment.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GLOBAL_GEMINI_MODEL_NAME,
      contents: prompt,
      config: { systemInstruction: KAVACHMAILGUARD_SYSTEM_INSTRUCTION, responseMimeType: "application/json" }
    });
    if (!response.text) throw new Error("Empty response from KavachMailGuard API.");
    return parseGeminiPhishingResponse(response.text);
  } catch (error) {
    console.error("Error in KavachMailGuard service:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key for KavachMailGuard.");
    }
    throw error;
  }
};
