import React from 'react';
import type { DeepfakeAnalysisReport, DeepfakeAssessment } from '../../types';

interface DeepfakeResultDisplayProps {
  report: DeepfakeAnalysisReport;
  mediaPreviewUrl?: string;
}

const getAssessmentStyles = (assessment: DeepfakeAssessment): {
  borderColor: string;
  textColor: string;
  bgColorStrip: string;
  icon: React.ReactNode;
  progressColor: string;
} => {
  switch (assessment) {
    case 'Likely Manipulated (Deepfake)':
      return {
        borderColor: 'border-red-500', textColor: 'text-red-300', bgColorStrip: 'bg-red-500', progressColor: 'bg-red-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
      };
    case 'Potentially Altered':
    case 'Subtle Anomalies Detected':
      return {
        borderColor: 'border-yellow-500', textColor: 'text-yellow-300', bgColorStrip: 'bg-yellow-500', progressColor: 'bg-yellow-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      };
    case 'Authentic':
      return {
        borderColor: 'border-green-500', textColor: 'text-green-300', bgColorStrip: 'bg-green-500', progressColor: 'bg-green-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      };
    default: // Uncertain
      return {
        borderColor: 'border-slate-600', textColor: 'text-slate-300', bgColorStrip: 'bg-slate-500', progressColor: 'bg-slate-500',
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.742 0-3.223-.835-3.772-2M12 12H4m4 4H4m4-8H4" /><circle cx="12" cy="12" r="10" /></svg>,
      };
  }
};

export const DeepfakeResultDisplay: React.FC<DeepfakeResultDisplayProps> = ({ report, mediaPreviewUrl }) => {
  const { assessment, explanation, confidence, detectedArtifacts, fileName } = report;
  const styles = getAssessmentStyles(assessment);
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className={`mt-6 p-5 bg-slate-800/30 backdrop-blur-sm rounded-xl border-l-4 ${styles.borderColor} shadow-xl animate-fadeIn`}>
      {mediaPreviewUrl && (
        <div className="mb-5 border border-slate-700 rounded-lg p-2.5 bg-slate-700 bg-opacity-40 shadow-inner">
          <p className="text-xs text-slate-400 mb-1.5 text-center">Analyzed Image: <span className="font-medium text-slate-300">{fileName}</span></p>
          <img 
            src={mediaPreviewUrl} 
            alt={`Preview of ${fileName}`}
            className="max-w-full h-auto max-h-64 object-contain rounded-md mx-auto shadow-md" 
          />
        </div>
      )}
      
      <div className="flex items-center mb-4">
        {styles.icon}
        <h2 className={`ml-3 text-xl font-semibold ${styles.textColor}`}>
          Assessment: {assessment}
        </h2>
         <span className={`ml-auto text-xs font-medium px-2 py-0.5 rounded-full ${styles.bgColorStrip} text-slate-900 shadow-sm`}>
          Confidence: {confidencePercentage}%
        </span>
      </div>
      
      <div className="mb-4">
        <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden" title={`Confidence: ${confidencePercentage}%`}>
          <div
            className={`h-full rounded-full ${styles.progressColor} transition-all duration-500 ease-out`}
            style={{ width: `${confidencePercentage}%` }}
            role="progressbar"
            aria-valuenow={confidencePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Confidence: ${confidencePercentage}%`}
          ></div>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-1">AI Explanation:</h3>
        <p className="text-slate-200 text-sm leading-relaxed bg-slate-700/60 p-2.5 rounded-md shadow-inner">{explanation}</p>
      </div>

      {detectedArtifacts && detectedArtifacts.length > 0 && (
        <div className="mb-1">
          <h3 className="text-sm font-semibold text-slate-300 mb-1.5">Key Observations / Potential Artifacts:</h3>
          <ul className="list-none space-y-1 pl-0">
            {detectedArtifacts.map((factor, index) => (
              <li key={index} className="flex items-start text-xs text-slate-300">
                <span className={`mr-2 mt-1 flex-shrink-0 h-1.5 w-1.5 rounded-full ${styles.bgColorStrip}`}></span>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
       <p className="text-xs text-slate-500 mt-4 text-right">File: {fileName}</p>
    </div>
  );
};
