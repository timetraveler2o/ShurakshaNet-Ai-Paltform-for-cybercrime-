
// Fix: Correct imported constant names for Gemini model and system instruction.
// 'GEMINI_MODEL_NAME' should be 'GLOBAL_GEMINI_MODEL_NAME'.
// 'FRAUD_ANALYSIS_SYSTEM_INSTRUCTION' should be 'DHANRAKSHAK_SYSTEM_INSTRUCTION'.
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { UPITransactionData, FraudAnalysisReport, GeminiFraudResponse, FraudAssessment } from '../types';
import { GLOBAL_GEMINI_MODEL_NAME, DHANRAKSHAK_SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(
    "Gemini API Key (process.env.API_KEY) is not configured. " +
    "DhanRakshak fraud analysis will not function. Please set this environment variable."
  );
}

const parseGeminiFraudResponse = (responseText: string, transactionId: string): FraudAnalysisReport => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }

  try {
    const parsedData = JSON.parse(jsonStr) as GeminiFraudResponse;

    if (typeof parsedData.assessment !== 'string' ||
        !['Low Risk', 'Medium Risk', 'High Risk', 'Unknown'].includes(parsedData.assessment) ||
        typeof parsedData.explanation !== 'string' ||
        typeof parsedData.confidence !== 'number' ||
        !Array.isArray(parsedData.potentialRiskFactors) ||
        !parsedData.potentialRiskFactors.every(factor => typeof factor === 'string')) {
      throw new Error('Invalid JSON structure received from API for fraud analysis.');
    }
    
    parsedData.confidence = Math.max(0, Math.min(1, parsedData.confidence)); // Clamp confidence

    return {
      ...parsedData,
      assessment: parsedData.assessment as FraudAssessment,
      transactionId,
    };
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini for fraud analysis:", e);
    console.error("Raw response text:", responseText);
    throw new Error(`Failed to parse AI response for fraud analysis. Raw text: ${responseText.substring(0, 500)}`);
  }
};

export const analyzeUPITransaction = async (
  transactionData: UPITransactionData
): Promise<FraudAnalysisReport> => {
  if (!ai) {
    throw new Error("Gemini API client (DhanRakshak) is not initialized. API_KEY might be missing.");
  }

  const prompt = `
Analyze the following UPI transaction for potential fraud:
Sender VPA: ${transactionData.senderVpa}
Receiver VPA: ${transactionData.receiverVpa}
Amount: ${transactionData.amount} INR
Remarks: ${transactionData.remarks || "N/A"}
Timestamp: ${transactionData.timestamp}
---
Provide your fraud risk assessment based on the system instructions.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
// Fix: Use the corrected constant for model name.
      model: GLOBAL_GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
// Fix: Use the corrected constant for system instruction.
        systemInstruction: DHANRAKSHAK_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received empty response from Gemini API for fraud analysis.");
    }
    
    return parseGeminiFraudResponse(responseText, transactionData.timestamp); // Using timestamp as a mock ID

  } catch (error) {
    console.error("Error calling Gemini API for fraud analysis:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key for DhanRakshak. Please check your API_KEY.");
        }
        if (error.message.includes("fetch")) {
            throw new Error("Network error contacting Gemini API for DhanRakshak. Check connection.");
        }
    }
    throw error; 
  }
};