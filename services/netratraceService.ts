import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ProbeImageData, NetraTraceAnalysisReport, GeminiNetraTraceMatch, PotentialMatch } from '../types';
import { GLOBAL_GEMINI_MODEL_NAME, NETRATRACE_SYSTEM_INSTRUCTION, DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
}

const parseGeminiNetraTraceResponse = (responseText: string): NetraTraceAnalysisReport => {
  let jsonStr = responseText.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }

  try {
    const parsedDataArray = JSON.parse(jsonStr) as GeminiNetraTraceMatch[];
    
    if (!Array.isArray(parsedDataArray)) {
        throw new Error('Invalid JSON structure from NetraTrace AI: Expected an array.');
    }

    return parsedDataArray.map((item, index): PotentialMatch => {
      if (typeof item.name !== 'string' || typeof item.match_score !== 'number' ||
          typeof item.last_seen_location !== 'string' || typeof item.case_id !== 'string' ||
          typeof item.justification !== 'string') {
        throw new Error(`Invalid structure for NetraTrace match object at index ${index}.`);
      }
      return {
        id: item.case_id + '-' + index, 
        name: item.name,
        matchScore: Math.max(0, Math.min(1, item.match_score)), 
        lastSeenLocation: item.last_seen_location,
        caseId: item.case_id,
        justification: item.justification,
      };
    });
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini for NetraTrace:", e, "Raw:", responseText);
    throw new Error(`Failed to parse AI response for NetraTrace. Raw text: ${responseText.substring(0, 200)}`);
  }
};

export const searchForMatches = async (
  probeImageData: ProbeImageData
): Promise<NetraTraceAnalysisReport> => {
  if (!ai) {
    throw new Error("NetraTrace API client not initialized. API_KEY might be missing.");
  }

  const textPrompt = `Analyze image (filename: ${probeImageData.fileName}) and simulate search for missing persons.`;
  const imagePart = { inlineData: { mimeType: probeImageData.fileType, data: probeImageData.base64Data } };
  const textPart = { text: textPrompt };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GLOBAL_GEMINI_MODEL_NAME,
      contents: { parts: [imagePart, textPart] }, 
      config: {
        systemInstruction: NETRATRACE_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      }
    });
    
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Received empty response from Gemini API for NetraTrace.");
    }
    
    return parseGeminiNetraTraceResponse(responseText);

  } catch (error) {
    console.error("Error in NetraTrace service:", error);
    if (error instanceof Error && error.message.includes("API key not valid")) {
        throw new Error("Invalid Gemini API Key for NetraTrace.");
    }
    throw error; 
  }
};
