import React from 'react';
import type { AnalyzedEmailEntry, PhishingAssessment } from '../../types';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface RecentAnalysesProps {
  history: AnalyzedEmailEntry[];
  onProvideFeedback: (entryId: string, feedback: 'correct' | 'incorrect') => void;
  currentAnalysisEntryId?: string;
}

const HistoryItem: React.FC<{ 
    item: AnalyzedEmailEntry; 
    onProvideFeedback: (entryId: string, feedback: 'correct' | 'incorrect') => void;
    isCurrentItem: boolean;
}> = ({ item, onProvideFeedback, isCurrentItem }) => {
  const { analysisReport, emailData, userFeedback } = item;
  const confidencePercentage = Math.round(analysisReport.confidence * 100);

  let borderColor = 'border-slate-700/80'; let assessmentColor = 'text-slate-300'; let assessmentBg = 'bg-slate-600';
  if (analysisReport.assessment === 'Phishing') { borderColor = 'border-red-600/60'; assessmentColor = 'text-red-200'; assessmentBg = 'bg-red-500/80';}
  else if (analysisReport.assessment === 'Safe') { borderColor = 'border-green-600/60'; assessmentColor = 'text-green-200'; assessmentBg = 'bg-green-500/80';}
  else { borderColor = 'border-yellow-600/60'; assessmentColor = 'text-yellow-200'; assessmentBg = 'bg-yellow-500/80';}

  const feedbackButtonClasses = "px-2 py-0.5 text-xs font-medium rounded-md transition-colors focus:outline-none focus:ring-1 flex items-center space-x-1 clickable-element";

  return (
    <div className={`bg-slate-800/50 p-3 rounded-lg border ${borderColor} shadow-md ${isCurrentItem ? 'ring-1 ring-lime-500' : ''}`}>
      <div className="flex justify-between items-start mb-1.5">
        <div>
          <p className="text-xs text-slate-400 truncate" title={emailData.sender}>From: {emailData.sender || 'N/A'}</p>
          <p className="text-sm font-semibold text-slate-200 truncate" title={emailData.subject}>{emailData.subject || 'N/A'}</p>
        </div>
        <span className={`px-1.5 py-0.5 text-xs font-semibold rounded-full ${assessmentBg} ${assessmentColor}`}>
          {analysisReport.assessment} ({confidencePercentage}%)
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-1.5 break-all truncate" title={analysisReport.explanation}>
        {analysisReport.explanation}
      </p>
      
      {(!isCurrentItem || userFeedback === null) && ( // Show feedback if not current OR if current but no feedback yet
          <div className="mt-1.5 pt-1.5 border-t border-slate-700/70">
            {userFeedback ? (
              <p className="text-xs text-slate-400">Feedback: <span className={`font-semibold ${userFeedback === 'correct' ? 'text-green-400' : 'text-red-400'}`}>{userFeedback}</span>.</p>
            ) : (
              <div className="flex items-center space-x-1.5">
                <p className="text-xs text-slate-400">Accurate?</p>
                <button onClick={() => onProvideFeedback(item.id, 'correct')} disabled={!!userFeedback} className={`${feedbackButtonClasses} bg-green-700/70 hover:bg-green-600/70 text-white focus:ring-green-500 ${userFeedback ? 'opacity-60 cursor-not-allowed' : ''}`}><ThumbsUp size={10}/><span>Yes</span></button>
                <button onClick={() => onProvideFeedback(item.id, 'incorrect')} disabled={!!userFeedback} className={`${feedbackButtonClasses} bg-red-700/70 hover:bg-red-600/70 text-white focus:ring-red-500 ${userFeedback ? 'opacity-60 cursor-not-allowed' : ''}`}><ThumbsDown size={10}/><span>No</span></button>
              </div>
            )}
          </div>
      )}
       <p className="text-xs text-slate-500 mt-1.5 text-right">
        {new Date(item.timestamp).toLocaleTimeString([], {day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit'})}
      </p>
    </div>
  );
};

export const RecentAnalyses: React.FC<RecentAnalysesProps> = ({ history, onProvideFeedback, currentAnalysisEntryId }) => {
  if (!history || history.length === 0) {
    return <p className="text-xs text-slate-500 mt-4 text-center italic">No recent analyses yet.</p>;
  }

  return (
    <div className="w-full mt-4 animate-fadeIn">
      <h3 className="text-md font-semibold text-lime-400 mb-2">Recent Analyses</h3>
      <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1 custom-scrollbar-kavach">
        {history.map(item => (
          <HistoryItem key={item.id} item={item} onProvideFeedback={onProvideFeedback} isCurrentItem={item.id === currentAnalysisEntryId} />
        ))}
      </div>
      <style>{`
        .custom-scrollbar-kavach::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-kavach::-webkit-scrollbar-track { background: rgba(30,41,59,0.3); }
        .custom-scrollbar-kavach::-webkit-scrollbar-thumb { background: #a3e635; border-radius: 3px; } /* lime-400 */
        .custom-scrollbar-kavach::-webkit-scrollbar-thumb:hover { background: #84cc16; } /* lime-500 */
      `}</style>
    </div>
  );
};
