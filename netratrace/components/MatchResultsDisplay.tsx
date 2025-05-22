import React from 'react';
import type { NetraTraceAnalysisReport, PotentialMatch } from '../types';

interface MatchResultsDisplayProps {
  report: NetraTraceAnalysisReport;
  probeImagePreviewUrl?: string;
  probeImageFileName?: string;
}

const GenericUserIcon: React.FC<{ className?: string }> = ({ className = "h-16 w-16 text-slate-500" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);


const MatchCard: React.FC<{ match: PotentialMatch }> = ({ match }) => {
  const matchScorePercentage = Math.round(match.matchScore * 100);
  let scoreColor = 'text-green-400';
  let scoreBgColor = 'bg-green-500';
  if (matchScorePercentage < 80) {
    scoreColor = 'text-yellow-400';
    scoreBgColor = 'bg-yellow-500';
  }
  if (matchScorePercentage < 70) {
    scoreColor = 'text-orange-400';
    scoreBgColor = 'bg-orange-500';
  }

  return (
    <div className="bg-slate-800 bg-opacity-70 backdrop-blur-sm p-4 rounded-lg border border-slate-700 shadow-lg hover:shadow-teal-900/30 transition-shadow duration-300">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
            <GenericUserIcon className="h-12 w-12 text-slate-400" />
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-baseline">
            <h3 className="text-lg font-semibold text-teal-300">{match.name}</h3>
            <span className={`text-sm font-bold ${scoreColor}`}>Score: {matchScorePercentage}%</span>
          </div>
          <p className="text-xs text-slate-500">Case ID: {match.caseId}</p>
          <div className="w-full bg-slate-700 rounded-full h-2 my-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${scoreBgColor}`}
              style={{ width: `${matchScorePercentage}%` }}
              role="progressbar"
              aria-valuenow={matchScorePercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Match Score: ${matchScorePercentage}%`}
            ></div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm text-slate-400">
            <strong className="text-slate-300">Last Seen:</strong> {match.lastSeenLocation}
        </p>
        <p className="text-sm text-slate-400 mt-1">
            <strong className="text-slate-300">AI Justification (Simulated):</strong> {match.justification}
        </p>
      </div>
    </div>
  );
};

export const MatchResultsDisplay: React.FC<MatchResultsDisplayProps> = ({ report, probeImagePreviewUrl, probeImageFileName }) => {
  if (!report) return null;

  return (
    <div className="mt-8 w-full animate-fadeIn">
      {probeImagePreviewUrl && (
        <div className="mb-6 border border-slate-700 rounded-lg p-3 bg-slate-700 bg-opacity-40 shadow-inner">
          <p className="text-sm text-slate-400 mb-2 text-center">
            Probe Image: <span className="font-medium text-slate-300">{probeImageFileName || "Uploaded Image"}</span>
          </p>
          <img 
            src={probeImagePreviewUrl} 
            alt="Probe image"
            className="max-w-full h-auto max-h-48 object-contain rounded-md mx-auto shadow-lg" 
          />
        </div>
      )}

      <h2 className="text-xl font-semibold text-teal-400 mb-4">
        {report.length > 0 ? "Potential Matches Found (Simulated)" : "No Significant Matches Found (Simulated)"}
      </h2>

      {report.length === 0 && (
        <p className="text-slate-300 bg-slate-800 p-4 rounded-lg border border-slate-700">
          The simulated search did not yield any high-confidence matches from the hypothetical database based on the provided image.
          Remember, this is a conceptual tool and results are illustrative.
        </p>
      )}

      {report.length > 0 && (
        <div className="space-y-4">
          {report.map((match) => (
            <MatchCard key={match.id || match.caseId} match={match} />
          ))}
        </div>
      )}
       <p className="text-xs text-slate-600 mt-6 text-center">
        Note: All match data is AI-generated for demonstration and does not represent real individuals or cases.
      </p>
    </div>
  );
};
