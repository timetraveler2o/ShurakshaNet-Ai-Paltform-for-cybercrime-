import React from 'react';
import type { NigraniAIAnalysisReport, DetectedEvent, AlertLevel } from '../../types';
import { AlertTriangle, Info, ShieldAlert, BellDot, Siren, VideoIcon } from 'lucide-react'; // Using Lucide icons

interface AnalysisDisplayProps {
  report: NigraniAIAnalysisReport;
  videoPreviewUrl?: string; // Changed from imagePreviewUrl
  videoFileName?: string;   // Changed from imageFileName
}

const AlertIcon: React.FC<{level: AlertLevel, className?: string}> = ({ level, className = "h-4 w-4" }) => {
  switch (level) {
    case 'Critical': return <Siren className={`${className} text-red-400`} />;
    case 'High': return <ShieldAlert className={`${className} text-orange-400`} />;
    case 'Medium': return <AlertTriangle className={`${className} text-yellow-400`} />;
    case 'Low': return <BellDot className={`${className} text-sky-400`} />;
    case 'Info': default: return <Info className={`${className} text-slate-400`} />;
  }
};

const getAlertLevelStyles = (level: AlertLevel): string => {
  switch (level) {
    case 'Critical': return 'bg-red-700/30 border-red-500/70 text-red-200';
    case 'High': return 'bg-orange-600/30 border-orange-500/70 text-orange-200';
    case 'Medium': return 'bg-yellow-600/30 border-yellow-500/70 text-yellow-200';
    case 'Low': return 'bg-sky-700/30 border-sky-500/70 text-sky-200';
    case 'Info': default: return 'bg-slate-700/40 border-slate-600/70 text-slate-300';
  }
};

const EventCard: React.FC<{ event: DetectedEvent }> = ({ event }) => {
  const alertStyles = getAlertLevelStyles(event.alertLevel);
  return (
    <div className={`p-2.5 rounded-lg border ${alertStyles} backdrop-blur-sm shadow-md`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center min-w-0">
          <AlertIcon level={event.alertLevel} />
          <h3 className="ml-1.5 text-sm font-semibold truncate" title={event.description}>{event.description}</h3>
        </div>
        <span className={`px-1.5 py-0.5 text-xs font-bold rounded-full ${getAlertLevelStyles(event.alertLevel).split(' ')[0]} opacity-90`}>{event.alertLevel}</span>
      </div>
      {event.timestampDescription && (
         <p className="text-xs text-amber-300 mb-0.5" title="Timestamp in video">
            <strong className="text-amber-400">Time:</strong> {event.timestampDescription}
        </p>
      )}
      <p className="text-xs text-slate-400 mb-0.5 truncate" title={event.locationInImage}>
        <strong className="text-slate-300">Location:</strong> {event.locationInImage}
      </p>
      <p className="text-xs leading-normal opacity-90">{event.details}</p>
      <p className="text-xs text-slate-500 mt-1 text-right">
        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </div>
  );
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ report, videoPreviewUrl, videoFileName }) => {
  if (!report) return null;

  return (
    <div className="mt-5 w-full animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {videoPreviewUrl && (
          <div className="md:col-span-3 border border-slate-700 rounded-lg p-2 bg-slate-800/40 shadow-lg self-start">
            <p className="text-xs text-slate-400 mb-1 text-center flex items-center justify-center">
              <VideoIcon size={14} className="mr-1 text-amber-400"/>
              Analyzed Video: <span className="font-medium text-slate-300 ml-1">{videoFileName || "Uploaded Video"}</span>
            </p>
            <video 
              src={videoPreviewUrl} 
              controls 
              className="w-full h-auto object-contain rounded shadow-md bg-black"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className={videoPreviewUrl ? "md:col-span-4" : "md:col-span-7"}>
          <h2 className="text-md font-orbitron font-semibold text-amber-400 mb-2">
            {report.length > 0 ? "Detected Events in Video" : "No Specific Events Flagged in Video"}
          </h2>

          {report.length === 0 && (
            <p className="text-slate-300 bg-slate-700/40 p-3 rounded-lg border border-slate-600 text-sm">
              AI analysis complete. No high-priority events flagged in the video based on the analysis parameters.
            </p>
          )}

          {report.length > 0 && (
            <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar-nigraniai-events">
              {report.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
       <p className="text-xs text-slate-600 mt-3 text-center italic">
        All findings are AI-generated simulations for demonstration.
      </p>
      <style>{`
        .custom-scrollbar-nigraniai-events::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-nigraniai-events::-webkit-scrollbar-track { background: #1e293b; }
        .custom-scrollbar-nigraniai-events::-webkit-scrollbar-thumb { background: #b45309; border-radius: 3px; }
        .custom-scrollbar-nigraniai-events::-webkit-scrollbar-thumb:hover { background: #92400e; }
      `}</style>
    </div>
  );
};