import React from 'react';
import type { VoIPScamAnalysisReport, VoIPScamAssessment } from '../../types';
import { AlertTriangle, Info, ShieldCheck, Ban, Ear } from 'lucide-react'; // Lucide icons

interface ScamAnalysisDisplayProps {
  report: VoIPScamAnalysisReport;
  audioPreviewUrl?: string;
}

const getAssessmentStyles = (assessment: VoIPScamAssessment): {
  borderColor: string; textColor: string; bgColorStrip: string; icon: React.ReactNode;
} => {
  switch (assessment) {
    case 'Likely Scam': return { borderColor: 'border-red-500/80', textColor: 'text-red-300', bgColorStrip: 'bg-red-500', icon: <Ban className="h-7 w-7 text-red-400" /> };
    case 'Potentially Suspicious': return { borderColor: 'border-yellow-500/80', textColor: 'text-yellow-300', bgColorStrip: 'bg-yellow-500', icon: <AlertTriangle className="h-7 w-7 text-yellow-400" /> };
    case 'Likely Safe': return { borderColor: 'border-green-500/80', textColor: 'text-green-300', bgColorStrip: 'bg-green-500', icon: <ShieldCheck className="h-7 w-7 text-green-400" /> };
    default: return { borderColor: 'border-slate-600/80', textColor: 'text-slate-300', bgColorStrip: 'bg-slate-500', icon: <Info className="h-7 w-7 text-slate-400" /> };
  }
};

export const ScamAnalysisDisplay: React.FC<ScamAnalysisDisplayProps> = ({ report, audioPreviewUrl }) => {
  const { assessment, confidence, detectedIndicators, simulatedTranscriptSummary, recommendation, fileName } = report;
  const styles = getAssessmentStyles(assessment);
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className={`mt-5 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border-l-4 ${styles.borderColor} shadow-xl animate-fadeIn`}>
      <div className="flex items-center mb-3">
        {styles.icon}
        <h2 className={`ml-2.5 text-lg font-semibold ${styles.textColor}`}>{assessment}</h2>
        <span className={`ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full ${styles.bgColorStrip} text-slate-900 shadow-sm`}>
          Conf: {confidencePercentage}%
        </span>
      </div>
      
      {audioPreviewUrl && (
        <div className="mb-3">
          <p className="text-xs text-slate-400 mb-0.5 flex items-center"><Ear size={12} className="mr-1" /> Call Audio: <span className="font-medium text-slate-300 ml-1 truncate">{fileName}</span></p>
          <audio controls src={audioPreviewUrl} className="w-full h-9 rounded-md shadow-inner bg-slate-700/50">
            Your browser does not support audio.
          </audio>
        </div>
      )}

      <div className="mb-3">
        <h3 className="text-xs font-semibold text-slate-300 mb-0.5">Simulated Transcript Summary:</h3>
        <p className="text-slate-200 text-xs leading-normal bg-slate-700/50 p-2 rounded-md shadow-inner italic">
          "{simulatedTranscriptSummary || 'N/A'}"
        </p>
      </div>

      {detectedIndicators && detectedIndicators.length > 0 && (
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-slate-300 mb-1">Detected Indicators:</h3>
          <ul className="list-none space-y-0.5 pl-0">
            {detectedIndicators.map((indicator, index) => (
              <li key={index} className="flex items-start text-xs text-slate-300">
                <span className={`mr-1.5 mt-1 flex-shrink-0 h-1 w-1 rounded-full ${styles.bgColorStrip}`}></span>
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-slate-700/70">
        <h3 className="text-xs font-semibold text-slate-300 mb-0.5">Recommendation:</h3>
        <p className={`text-sm font-semibold ${styles.textColor}`}>{recommendation}</p>
      </div>
    </div>
  );
};
