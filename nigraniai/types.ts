export interface SurveillanceImageData {
  fileName: string;
  fileType: string; // e.g., 'image/jpeg', 'image/png'
  base64Data: string;
  objectURL?: string; // For local preview
}

export interface AnalysisParameters {
  customFocus?: string; // User-defined specific things to look for
}

export type AlertLevel = "Info" | "Low" | "Medium" | "High" | "Critical";

export interface DetectedEvent {
  id: string; // Unique ID for the event
  description: string; // e.g., "Unattended Baggage", "Suspicious Loitering"
  locationInImage: string; // Textual description, e.g., "Lower-left, near red car"
  alertLevel: AlertLevel;
  details: string; // Further AI-generated explanation or context
  timestamp: string; // ISO string when detected/reported
}

// Structure of the entire analysis report from Gemini
export type NigraniAIAnalysisReport = DetectedEvent[];

// Expected structure from Gemini API for each detected event
export interface GeminiNigraniAIEvent {
  description: string;
  locationInImage: string;
  alertLevel: AlertLevel;
  details: string;
}
