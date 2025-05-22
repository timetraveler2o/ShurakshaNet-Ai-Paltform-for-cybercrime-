export interface MediaFileData {
  fileName: string;
  fileType: string; // e.g., 'image/jpeg', 'image/png'
  base64Data: string;
  objectURL?: string; // For local preview
}

export type DeepfakeAssessment = 
  | "Authentic"
  | "Likely Manipulated (Deepfake)"
  | "Potentially Altered"
  | "Subtle Anomalies Detected"
  | "Uncertain";

export interface DeepfakeAnalysisReport {
  assessment: DeepfakeAssessment;
  explanation: string;
  confidence: number; // 0.0 to 1.0
  detectedArtifacts: string[]; // List of observed manipulation indicators
  fileName: string;
}

// Expected structure from Gemini API for deepfake analysis
export interface GeminiDeepfakeResponse {
  assessment: DeepfakeAssessment;
  explanation: string;
  confidence: number;
  detectedArtifacts: string[];
}
