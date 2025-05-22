import React from 'react';
import type { NigraniAIAnalysisReport, DetectedEvent, AlertLevel } from '../types';

interface AnalysisDisplayProps {
  report: NigraniAIAnalysisReport;
  imagePreviewUrl?: string;
  imageFileName?: string;
}

const AlertIcon: React.FC<{level: AlertLevel, className?: string}> = ({ level, className = "h-5 w-5" }) => {
  switch (level) {
    case 'Critical':
      return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-red-400`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
    case 'High':
      return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-orange-400`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.332-.216 3.006-1.742 3.006H4.42c-1.526 0-2.492-1.674-1.742-3.006l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm-1.75-5.5a1.75 1.75 0 00-3.5 0v.25H3.5V6a1.75 1.75 0 013.5 0v1.75zm8 .25V6a1.75 1.75 0 00-3.5 0v1.75h.75v-.25a1.75 1.75 0 013.5 0zM10 13a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>; // Re-using a generic warning, ideally more distinct
    case 'Medium':
      return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-yellow-400`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 102 0V6zm-1 7a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" /></svg>;
    case 'Low':
      return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-sky-400`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
    case 'Info':
    default:
      return <svg xmlns="http://www.w3.org/2000/svg" className={`${className} text-slate-400`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>;
  }
};

const getAlertLevelStyles = (level: AlertLevel): string => {
  switch (level) {
    case 'Critical': return 'bg-red-700 border-red-500 text-red-200';
    case 'High': return 'bg-orange-700 border-orange-500 text-orange-200';
    case 'Medium': return 'bg-yellow-700 border-yellow-500 text-yellow-200';
    case 'Low': return 'bg-sky-700 border-sky-500 text-sky-200';
    case 'Info':
    default: return 'bg-slate-700 border-slate-500 text-slate-200';
  }
};

const EventCard: React.FC<{ event: DetectedEvent }> = ({ event }) => {
  const alertStyles = getAlertLevelStyles(event.alertLevel);
  return (
    <div className={`p-3 rounded-lg border shadow-md ${alertStyles} bg-opacity-40 backdrop-blur-sm`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <AlertIcon level={event.alertLevel} />
          <h3 className="ml-2 text-base font-semibold">{event.description}</h3>
        </div>
        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${alertStyles} opacity-80`}>{event.alertLevel}</span>
      </div>
      <p className="text-xs text-slate-400 mb-1">
        <strong className="text-slate-300">Location:</strong> {event.locationInImage}
      </p>
      <p className="text-sm leading-relaxed">{event.details}</p>
      <p className="text-xs text-slate-500 mt-2 text-right">
        Logged: {new Date(event.timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
};

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ report, imagePreviewUrl, imageFileName }) => {
  if (!report) return null;

  return (
    <div className="mt-6 w-full animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {imagePreviewUrl && (
          <div className="md:col-span-1 border border-slate-700 rounded-lg p-2 bg-slate-800 bg-opacity-50 shadow-lg self-start">
            <p className="text-sm text-slate-400 mb-2 text-center">
              Analyzed Scene: <span className="font-medium text-slate-300">{imageFileName || "Uploaded Image"}</span>
            </p>
            <img 
              src={imagePreviewUrl} 
              alt="Analyzed surveillance scene"
              className="w-full h-auto object-contain rounded-md shadow-md" 
            />
          </div>
        )}

        <div className={imagePreviewUrl ? "md:col-span-2" : "md:col-span-3"}>
          <h2 className="text-xl font-semibold text-amber-400 mb-3" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            {report.length > 0 ? "Detected Events & Observations" : "No Specific Events Flagged"}
          </h2>

          {report.length === 0 && (
            <p className="text-slate-300 bg-slate-700 bg-opacity-50 p-4 rounded-lg border border-slate-600">
              The AI analysis did not flag any high-priority suspicious activities or objects based on the general parameters and your specific focus (if any). Continuous monitoring is advised.
            </p>
          )}

          {report.length > 0 && (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar-nigraniai">
              {report.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
       <p className="text-xs text-slate-600 mt-5 text-center">
        Note: All findings are AI-generated simulations for demonstration.
      </p>
      <style>{`
        .custom-scrollbar-nigraniai::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar-nigraniai::-webkit-scrollbar-track { background: #1e293b; }
        .custom-scrollbar-nigraniai::-webkit-scrollbar-thumb { background: #b45309; border-radius: 3px; } /* amber-700 */
        .custom-scrollbar-nigraniai::-webkit-scrollbar-thumb:hover { background: #92400e; } /* amber-800 */
      `}</style>
    </div>
  );
};
