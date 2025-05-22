import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { ProbeImageData, NetraTraceAnalysisReport, GeminiNetraTraceMatch, PotentialMatch } from '../types';
import { GEMINI_MODEL_NAME, NETRATRACE_SYSTEM_INSTRUCTION } from '../constants';

const apiKey = process.env.API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn(
    "Gemini API Key (process.env.API_KEY) is not configured. " +
    "NetraTrace analysis will not function. Please set this environment variable."
  );
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
        console.error("Parsed data is not an array:", parsedDataArray);
        throw new Error('Invalid JSON structure: Expected an array of matches.');
    }

    return parsedDataArray.map((item, index): PotentialMatch => {
      if (typeof item.name !== 'string' ||
          typeof item.match_score !== 'number' ||
          typeof item.last_seen_location !== 'string' ||
          typeof item.case_id !== 'string' ||
          typeof item.justification !== 'string') {
        console.error("Invalid match object structure:", item);
        throw new Error(`Invalid structure for match object at index ${index}.`);
      }
      return {
        id: item.case_id + '-' + index, // Ensure unique ID for React keys
        name: item.name,
        matchScore: Math.max(0, Math.min(1, item.match_score)), // Clamp score
        lastSeenLocation: item.last_seen_location,
        caseId: item.case_id,
        justification: item.justification,
      };
    });
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini for NetraTrace:", e);
    console.error("Raw response text for NetraTrace:", responseText);
    throw new Error(`Failed to parse AI response for NetraTrace. Raw text: ${responseText.substring(0, 500)}`);
  }
};

export const searchForMatches = async (
  probeImageData: ProbeImageData
): Promise<NetraTraceAnalysisReport> => {
  if (!ai) {
    throw new Error("Gemini API client (NetraTrace) is not initialized. API_KEY might be missing.");
  }

  const textPrompt = `
Analyze the provided image (filename: ${probeImageData.fileName}) and simulate a search for potential matches from a hypothetical missing persons database.
Provide your response based on the system instructions.
  `;

  const imagePart = {
    inlineData: {
      mimeType: probeImageData.fileType,
      data: probeImageData.base64Data,
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
    console.error("Error calling Gemini API for NetraTrace:", error);
     if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid Gemini API Key for NetraTrace. Please check your API_KEY.");
        }
         if (error.message.toLowerCase().includes("fetch failed") || error.message.toLowerCase().includes("networkerror")) {
            throw new Error("Network error contacting Gemini API for NetraTrace. Check connection and CORS if applicable.");
        }
    }
    throw error; 
  }
};
