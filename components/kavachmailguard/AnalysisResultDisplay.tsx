import React from 'react';
import type { AnalyzedEmailEntry, PhishingAssessment } from '../../types'; // Adjusted types
import { ThumbsUp, ThumbsDown, AlertOctagon, ShieldCheckIcon, HelpCircle } from 'lucide-react'; // Lucide icons

interface AnalysisResultDisplayProps {
  entry: AnalyzedEmailEntry;
  onProvideFeedback: (feedback: 'correct' | 'incorrect') => void;
}

const getProgressBarColor = (confidence: number, assessment: PhishingAssessment): string => {
  if (assessment === 'Phishing') {
    if (confidence > 0.75) return 'bg-red-500'; if (confidence > 0.5) return 'bg-orange-500'; return 'bg-yellow-500';
  }
  if (assessment === 'Safe') {
    if (confidence > 0.75) return 'bg-green-500'; if (confidence > 0.5) return 'bg-teal-500'; return 'bg-lime-500';
  }
  return 'bg-slate-500'; // Unknown
};

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ entry, onProvideFeedback }) => {
  const { analysisReport, userFeedback } = entry;
  const isPhishing = analysisReport.assessment === 'Phishing';
  const isSafe = analysisReport.assessment === 'Safe';
  
  let cardBorderColor = 'border-slate-600'; let textColor = 'text-slate-100'; let iconSvg: React.ReactNode;

  if (isPhishing) { cardBorderColor = 'border-red-500/70'; textColor = 'text-red-300'; iconSvg = <AlertOctagon className="h-7 w-7 text-red-400" />; }
  else if (isSafe) { cardBorderColor = 'border-green-500/70'; textColor = 'text-green-300'; iconSvg = <ShieldCheckIcon className="h-7 w-7 text-green-400" />; }
  else { cardBorderColor = 'border-yellow-500/70'; textColor = 'text-yellow-300'; iconSvg = <HelpCircle className="h-7 w-7 text-yellow-400" />; }

  const confidencePercentage = Math.round(analysisReport.confidence * 100);
  const feedbackButtonClasses = "px-2.5 py-1 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-75 flex items-center space-x-1 clickable-element";

  return (
    <div className={`p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border-l-4 ${cardBorderColor} shadow-xl animate-fadeIn mb-4`}>
      <div className="flex items-center mb-3">
        {iconSvg}
        <h2 className={`ml-2 text-lg font-semibold ${textColor}`}>Assessment: {analysisReport.assessment}</h2>
        <span className={`ml-auto text-xs font-medium px-1.5 py-0.5 rounded-full ${getProgressBarColor(analysisReport.confidence, analysisReport.assessment)} text-slate-900 shadow-sm`}>
          Conf: {confidencePercentage}%
        </span>
      </div>
      
      <div className="mb-3">
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden"><div className={`h-full rounded-full ${getProgressBarColor(analysisReport.confidence, analysisReport.assessment)}`} style={{ width: `${confidencePercentage}%` }}></div></div>
      </div>

      <div className="mb-3">
        <h3 className="text-xs font-semibold text-slate-300 mb-0.5">AI Explanation:</h3>
        <p className="text-slate-200 text-sm leading-normal bg-slate-700/50 p-2 rounded-md shadow-inner">{analysisReport.explanation}</p>
      </div>

      <div className="mt-3 pt-2 border-t border-slate-700/50">
        <p className="text-xs text-slate-400 mb-1">Help improve: Was this accurate?</p>
        {userFeedback ? (
          <p className="text-xs">Feedback: <span className={`font-semibold ${userFeedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>{userFeedback}</span>.</p>
        ) : (
          <div className="flex space-x-2">
            <button onClick={() => onProvideFeedback('correct')} disabled={!!userFeedback} className={`${feedbackButtonClasses} bg-green-600 hover:bg-green-500 text-white focus:ring-green-400 ${userFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}><ThumbsUp size={12}/><span>Accurate</span></button>
            <button onClick={() => onProvideFeedback('incorrect')} disabled={!!userFeedback} className={`${feedbackButtonClasses} bg-red-600 hover:bg-red-500 text-white focus:ring-red-400 ${userFeedback ? 'opacity-50 cursor-not-allowed' : ''}`}><ThumbsDown size={12}/><span>Inaccurate</span></button>
          </div>
        )}
      </div>
    </div>
  );
};
