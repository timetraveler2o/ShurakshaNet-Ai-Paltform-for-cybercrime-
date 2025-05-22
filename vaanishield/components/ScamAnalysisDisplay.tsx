
import React from 'react';
import type { VoIPScamAnalysisReport, VoIPScamAssessment } from '../types';

interface ScamAnalysisDisplayProps {
  report: VoIPScamAnalysisReport;
  audioPreviewUrl?: string;
}

const getAssessmentStyles = (assessment: VoIPScamAssessment): {
  borderColor: string;
  textColor: string;
  bgColorStrip: string; // For strip/accent
  icon: React.ReactNode;
} => {
  switch (assessment) {
    case 'Likely Scam':
      return {
        borderColor: 'border-red-500', textColor: 'text-red-300', bgColorStrip: 'bg-red-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
      };
    case 'Potentially Suspicious':
      return {
        borderColor: 'border-yellow-500', textColor: 'text-yellow-300', bgColorStrip: 'bg-yellow-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      };
    case 'Likely Safe':
      return {
        borderColor: 'border-green-500', textColor: 'text-green-300', bgColorStrip: 'bg-green-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      };
    default: // Unknown
      return {
        borderColor: 'border-slate-600', textColor: 'text-slate-300', bgColorStrip: 'bg-slate-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.742 0-3.223-.835-3.772-2M12 12H4m4 4H4m4-8H4" /><circle cx="12" cy="12" r="10" /></svg>,
      };
  }
};

export const ScamAnalysisDisplay: React.FC<ScamAnalysisDisplayProps> = ({ report, audioPreviewUrl }) => {
  const { assessment, confidence, detectedIndicators, simulatedTranscriptSummary, recommendation, fileName } = report;
  const styles = getAssessmentStyles(assessment);
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className={`mt-6 p-5 bg-slate-800 bg-opacity-60 backdrop-blur-lg rounded-xl border-l-4 ${styles.borderColor} shadow-2xl animate-fadeIn`}>
      <div className="flex items-center mb-4">
        {styles.icon}
        <h2 className={`ml-3 text-xl font-semibold ${styles.textColor}`}>
          Assessment: {assessment}
        </h2>
        <span className={`ml-auto text-sm font-medium px-2 py-0.5 rounded-full ${styles.bgColorStrip} text-slate-900`}>
          Confidence: {confidencePercentage}%
        </span>
      </div>
      
      {audioPreviewUrl && (
        <div className="mb-4">
          <p className="text-xs text-slate-400 mb-1">Call Audio: <span className="font-medium text-slate-300">{fileName}</span></p>
          <audio controls src={audioPreviewUrl} className="w-full h-10 rounded-md shadow-inner">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-300 mb-1">Simulated Transcript Summary:</h3>
        <p className="text-slate-200 text-sm leading-relaxed bg-slate-700 bg-opacity-50 p-2.5 rounded-md shadow-inner italic">
          "{simulatedTranscriptSummary || 'No summary available.'}"
        </p>
      </div>

      {detectedIndicators && detectedIndicators.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-1.5">Detected Scam Indicators:</h3>
          <ul className="list-none space-y-1 pl-0">
            {detectedIndicators.map((indicator, index) => (
              <li key={index} className="flex items-start text-sm text-slate-300">
                <span className={`mr-2 mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full ${styles.bgColorStrip}`}></span>
                {indicator}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-slate-700">
        <h3 className="text-sm font-semibold text-slate-300 mb-1">Recommendation:</h3>
        <p className={`text-base font-semibold ${styles.textColor}`}>{recommendation}</p>
      </div>
       <p className="text-xs text-slate-500 mt-4 text-right">File: {fileName}</p>
    </div>
  );
};
