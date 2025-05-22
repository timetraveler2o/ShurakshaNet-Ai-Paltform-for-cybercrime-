import React from 'react';
import type { NetraTraceAnalysisReport, PotentialMatch } from '../../types';
import { UserSquare2 } from 'lucide-react'; // Using a different icon

const GenericUserIcon: React.FC<{ className?: string }> = ({ className = "h-14 w-14 text-slate-500" }) => ( // Slightly larger
  <UserSquare2 strokeWidth={1.5} className={className} />
);

const MatchCard: React.FC<{ match: PotentialMatch }> = ({ match }) => {
  const matchScorePercentage = Math.round(match.matchScore * 100);
  let scoreColor = 'text-green-400';
  let scoreBgColor = 'bg-green-500/80'; // Added opacity
  if (matchScorePercentage < 80) { scoreColor = 'text-yellow-400'; scoreBgColor = 'bg-yellow-500/80'; }
  if (matchScorePercentage < 70) { scoreColor = 'text-orange-400'; scoreBgColor = 'bg-orange-500/80'; }

  return (
    <div className="bg-slate-800 bg-opacity-60 backdrop-blur-sm p-3.5 rounded-lg border border-slate-700 shadow-lg hover:border-teal-500/50 transition-all duration-300 group">
      <div className="flex items-start space-x-3.5">
        <div className="flex-shrink-0 w-16 h-16 bg-slate-700 rounded-md flex items-center justify-center overflow-hidden border border-slate-600 group-hover:border-teal-600 transition-colors">
            <GenericUserIcon />
        </div>
        <div className="flex-grow min-w-0"> {/* Added min-w-0 for better truncation */}
          <div className="flex justify-between items-baseline">
            <h3 className="text-md font-semibold text-teal-300 truncate group-hover:text-teal-200 transition-colors" title={match.name}>{match.name}</h3>
            <span className={`text-xs font-bold ${scoreColor}`}>Score: {matchScorePercentage}%</span>
          </div>
          <p className="text-xs text-slate-500 truncate" title={match.caseId}>Case ID: {match.caseId}</p>
          <div className="w-full bg-slate-600 rounded-full h-1.5 my-1 overflow-hidden">
            <div className={`h-full rounded-full ${scoreBgColor}`} style={{ width: `${matchScorePercentage}%` }} role="progressbar" aria-valuenow={matchScorePercentage} aria-label={`Match Score: ${matchScorePercentage}%`}></div>
          </div>
        </div>
      </div>
      <div className="mt-2.5">
        <p className="text-xs text-slate-400">
            <strong className="text-slate-300">Last Seen:</strong> {match.lastSeenLocation}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
            <strong className="text-slate-300">AI Justification:</strong> <span className="italic opacity-90">{match.justification}</span>
        </p>
      </div>
    </div>
  );
};

export const MatchResultsDisplay: React.FC<{ report: NetraTraceAnalysisReport; probeImagePreviewUrl?: string; probeImageFileName?: string; }> = ({ report, probeImagePreviewUrl, probeImageFileName }) => {
  if (!report) return null;

  return (
    <div className="mt-6 w-full animate-fadeIn">
      {probeImagePreviewUrl && (
        <div className="mb-5 border border-slate-700 rounded-lg p-2.5 bg-slate-700 bg-opacity-40 shadow-inner">
          <p className="text-xs text-slate-400 mb-1.5 text-center">
            Probe Image: <span className="font-medium text-slate-300">{probeImageFileName || "Uploaded Image"}</span>
          </p>
          <img src={probeImagePreviewUrl} alt="Probe image" className="max-w-full h-auto max-h-40 object-contain rounded-md mx-auto shadow-md" />
        </div>
      )}

      <h2 className="text-lg font-orbitron font-semibold text-teal-400 mb-3">
        {report.length > 0 ? "Potential Matches Found (Simulated)" : "No Significant Matches Found (Simulated)"}
      </h2>

      {report.length === 0 && (
        <p className="text-slate-300 bg-slate-700/50 p-3 rounded-lg border border-slate-600 text-sm">
          The simulated search did not yield high-confidence matches. This is illustrative.
        </p>
      )}

      {report.length > 0 && (
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar-netratrace">
          {report.map((match) => (
            <MatchCard key={match.id || match.caseId} match={match} />
          ))}
        </div>
      )}
       <p className="text-xs text-slate-600 mt-4 text-center italic">
        All match data is AI-generated for demonstration.
      </p>
       <style>{`
        .custom-scrollbar-netratrace::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-netratrace::-webkit-scrollbar-track { background: #1e293b; } /* slate-800 */
        .custom-scrollbar-netratrace::-webkit-scrollbar-thumb { background: #0d9488; border-radius: 3px; } /* teal-600 */
        .custom-scrollbar-netratrace::-webkit-scrollbar-thumb:hover { background: #0f766e; } /* teal-700 */
      `}</style>
    </div>
  );
};
