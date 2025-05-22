export interface ProbeImageData {
  fileName: string;
  fileType: string; // e.g., 'image/jpeg', 'image/png'
  base64Data: string;
  objectURL?: string; // For local preview
}

export interface PotentialMatch {
  id: string; // Unique ID for the match entry, can be same as caseId
  name: string; // Mocked name of the matched person
  matchScore: number; // Similarity score (0.0 to 1.0)
  lastSeenLocation: string; // Mocked location
  caseId: string; // Mocked case/reference ID
  justification: string; // AI-generated explanation for the match
  // mockImageUrl?: string; // Optional: URL to a placeholder image for the match
}

// Structure of the entire analysis report (an array of matches)
export type NetraTraceAnalysisReport = PotentialMatch[];

// Expected structure from Gemini API for each match object
export interface GeminiNetraTraceMatch {
  name: string;
  match_score: number; // Note: API might use snake_case
  last_seen_location: string;
  case_id: string;
  justification: string;
}
