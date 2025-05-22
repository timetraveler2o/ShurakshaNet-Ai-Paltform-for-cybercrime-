import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { UPITransactionData, FraudAnalysisReport, GeminiFraudResponse, FraudAssessment } from '../types'; // Adjusted path
import { GLOBAL_GEMINI_MODEL_NAME, DHANRAKSHAK_SYSTEM_INSTRUCTION, DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE } from '../constants'; // Adjusted path

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
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
    
    parsedData.confidence = Math.max(0, Math.min(1, parsedData.confidence)); 

    return {
      ...parsedData,
      assessment: parsedData.assessment as FraudAssessment,
      transactionId,
    };
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini for fraud analysis:", e, "Raw:", responseText);
    throw new Error(`Failed to parse AI response for fraud analysis. Raw text: ${responseText.substring(0, 200)}`);
  }
};

export const analyzeUPITransaction = async (
  transactionData: UPITransactionData
): Promise<FraudAnalysisReport> => {
  if (!ai) {
    throw new Error("DhanRakshak API client not initialized. API_KEY might be missing.");
  }

  const prompt = `
Analyze UPI transaction:
Sender VPA: ${transactionData.senderVpa}
Receiver VPA: ${transactionData.receiverVpa}
Amount: ${transactionData.amount} INR
Remarks: ${transactionData.remarks || "N/A"}
Timestamp: ${transactionData.timestamp}
---
Provide fraud risk assessment.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GLOBAL_GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: DHANRAKSHAK_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received empty response from Gemini API for DhanRakshak.");
    }
    
    return parseGeminiFraudResponse(responseText, transactionData.timestamp); 

  } catch (error) {
    console.error("Error in DhanRakshak service:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
      throw new Error("Invalid Gemini API Key for DhanRakshak.");
    }
    throw error; 
  }
};
