
export interface AudioFileData {
  fileName: string;
  fileType: string; // e.g., 'audio/mpeg', 'audio/wav'
  base64Data: string;
  objectURL?: string; // For local preview in <audio> player
}

export type VoIPScamAssessment = 
  | "Likely Scam"
  | "Potentially Suspicious"
  | "Likely Safe"
  | "Unknown";

export type ScamCallRecommendation = 
  | "Block Number & Report"
  | "Monitor Number"
  | "Caution Advised"
  | "No Immediate Action Needed";

export interface VoIPScamAnalysisReport {
  assessment: VoIPScamAssessment;
  confidence: number; // 0.0 to 1.0
  detectedIndicators: string[]; // e.g., "OTP Request", "Phishing Link Mentioned"
  simulatedTranscriptSummary: string; // AI-generated summary/highlights of the call
  recommendation: ScamCallRecommendation;
  fileName: string;
}

// Expected structure from Gemini API for VoIP scam analysis
export interface GeminiVoIPScamResponse {
  assessment: VoIPScamAssessment;
  confidence: number;
  detectedIndicators: string[];
  simulatedTranscriptSummary: string;
  recommendation: ScamCallRecommendation;
}
