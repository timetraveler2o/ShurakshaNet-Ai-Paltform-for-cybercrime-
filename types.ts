// Global Dashboard Types
export type ActiveView = 
  | 'dashboard' 
  | 'dhanrakshak' 
  | 'satyadarpan' 
  | 'netratrace' 
  | 'sahayakcopbot'
  | 'nigraniai'
  | 'vaanishield'
  | 'kavachmailguard'
  | 'analytics'
  | 'reports'
  | 'settings' 
  | 'profile';

// --- DhanRakshak (Financial Fraud Detection) Types ---
export interface UPITransactionData {
  senderVpa: string;
  receiverVpa: string;
  amount: number;
  remarks?: string;
  timestamp: string; // ISO string
}
export type FraudAssessment = "Low Risk" | "Medium Risk" | "High Risk" | "Unknown";
export interface FraudAnalysisReport {
  assessment: FraudAssessment;
  explanation: string;
  confidence: number; // 0.0 to 1.0
  potentialRiskFactors: string[];
  transactionId: string; 
}
export interface GeminiFraudResponse {
  assessment: FraudAssessment;
  explanation: string;
  confidence: number;
  potentialRiskFactors: string[];
}

// --- SatyaDarpan (Deepfake Detection) Types ---
export interface MediaFileData { // Used by SatyaDarpan, NetraTrace
  fileName: string;
  fileType: string; 
  base64Data: string;
  objectURL?: string; 
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
  confidence: number; 
  detectedArtifacts: string[]; 
  fileName: string;
}
export interface GeminiDeepfakeResponse {
  assessment: DeepfakeAssessment;
  explanation: string;
  confidence: number;
  detectedArtifacts: string[];
}

// --- NetraTrace (Facial Recognition) Types ---
export interface ProbeImageData extends MediaFileData {} // Alias for clarity
export interface PotentialMatch {
  id: string; 
  name: string; 
  matchScore: number; 
  lastSeenLocation: string; 
  caseId: string; 
  justification: string; 
}
export type NetraTraceAnalysisReport = PotentialMatch[];
export interface GeminiNetraTraceMatch {
  name: string;
  match_score: number; 
  last_seen_location: string;
  case_id: string;
  justification: string;
}

// --- SahayakCopBot (Police Chatbot) Types ---
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string; // ISO string
  isError?: boolean;
}

// --- NigraniAI (Suspicious Behavior Detection) Types ---
export interface SurveillanceVideoData { // Renamed from SurveillanceImageData
  fileName: string;
  fileType: string; // e.g., 'video/mp4'
  base64Data: string;
  objectURL?: string; // For local preview in <video> player
}
export interface AnalysisParameters {
  customFocus?: string; 
}
export type AlertLevel = "Info" | "Low" | "Medium" | "High" | "Critical";
export interface DetectedEvent {
  id: string; 
  description: string; 
  locationInImage: string; // General location description, could be "scene-wide" for video
  alertLevel: AlertLevel;
  details: string; 
  timestamp: string; // ISO string when detected/reported
  timestampDescription?: string; // e.g., "around 0:15", "mid-video", "towards the end"
}
export type NigraniAIAnalysisReport = DetectedEvent[];
export interface GeminiNigraniAIEvent {
  description: string;
  locationInImage: string; // For video, this might be more general or refer to keyframes
  alertLevel: AlertLevel;
  details: string;
  timestampDescription?: string; // When in the video the event is perceived
}

// --- VaaniShield (VoIP Scam Detection) Types ---
export interface AudioFileDataInput { // Renamed to avoid conflict if MediaFileData is too generic
  fileName: string;
  fileType: string; 
  base64Data: string;
  objectURL?: string; 
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
  confidence: number; 
  detectedIndicators: string[]; 
  simulatedTranscriptSummary: string; 
  recommendation: ScamCallRecommendation;
  fileName: string;
}
export interface GeminiVoIPScamResponse {
  assessment: VoIPScamAssessment;
  confidence: number;
  detectedIndicators: string[];
  simulatedTranscriptSummary: string;
  recommendation: ScamCallRecommendation;
}

// --- KavachMailGuard (Phishing Email Detection) Types ---
export interface EmailData {
  sender: string;
  subject: string;
  body: string;
}
export type PhishingAssessment = "Phishing" | "Safe" | "Unknown"; // Renamed from EmailAssessment
export interface PhishingAnalysisReport { // Renamed from EmailAnalysisReport
  assessment: PhishingAssessment;
  explanation: string;
  confidence: number; // 0.0 to 1.0
}
export interface AnalyzedEmailEntry {
  id: string;
  emailData: EmailData;
  analysisReport: PhishingAnalysisReport;
  userFeedback: 'correct' | 'incorrect' | null;
  timestamp: string; // ISO string
}

// For Gemini service initialization status
export interface GeminiServiceStatus {
    isKeySet: boolean;
    message: string;
}