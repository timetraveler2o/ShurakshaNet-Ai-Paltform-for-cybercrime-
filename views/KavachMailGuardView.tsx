import React, { useState, useCallback, useEffect } from 'react';
import { EmailInputForm } from '../components/kavachmailguard/EmailInputForm';
import { AnalysisResultDisplay } from '../components/kavachmailguard/AnalysisResultDisplay'; // Renamed from AnalysisResult
import { RecentAnalyses } from '../components/kavachmailguard/RecentAnalyses';
import { analyzeEmailForPhishing } from '../services/kavachmailguardService';
import type { EmailData, PhishingAnalysisReport, AnalyzedEmailEntry, GeminiServiceStatus } from '../types';
import { DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE, KAVACHMAILGUARD_MODULE_NAME, KAVACHMAILGUARD_MAX_HISTORY_ITEMS, KAVACHMAILGUARD_INITIAL_MESSAGE } from '../constants';
import { MailCheck } from 'lucide-react';

interface KavachMailGuardViewProps {
  apiKeyStatus: GeminiServiceStatus;
}

export const KavachMailGuardView: React.FC<KavachMailGuardViewProps> = ({ apiKeyStatus }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalyzedEmailEntry | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalyzedEmailEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = useCallback(
    async (data: EmailData) => {
      if (!apiKeyStatus.isKeySet) {
        setError(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
        setCurrentAnalysis(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      setCurrentAnalysis(null);

      try {
        const report = await analyzeEmailForPhishing(data);
        const newEntry: AnalyzedEmailEntry = {
          id: `email-${Date.now()}`,
          emailData: data,
          analysisReport: report,
          userFeedback: null,
          timestamp: new Date().toISOString(),
        };
        setCurrentAnalysis(newEntry);
        setAnalysisHistory(prev => [newEntry, ...prev.slice(0, KAVACHMAILGUARD_MAX_HISTORY_ITEMS - 1)]);
      } catch (err) {
        if (err instanceof Error) setError(`Analysis failed: ${err.message}.`);
        else setError("An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyStatus.isKeySet]
  );
  
  const handleFeedback = useCallback((entryId: string, feedback: 'correct' | 'incorrect') => {
    setAnalysisHistory(prev => prev.map(entry => entry.id === entryId ? { ...entry, userFeedback: feedback } : entry));
    if (currentAnalysis?.id === entryId) {
      setCurrentAnalysis(prev => prev ? { ...prev, userFeedback: feedback } : null);
    }
  }, [currentAnalysis]);

  return (
    <div className="animate-contentFadeInUp">
       <div className="flex items-center mb-6">
        <MailCheck size={32} className="text-lime-400 mr-3" />
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-lime-400">{KAVACHMAILGUARD_MODULE_NAME}</h1>
          <p className="text-sm text-slate-400">Phishing Email Detection</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-slate-800/50 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-slate-700">
            {!apiKeyStatus.isKeySet && (
                <div className="mb-6 p-3 bg-red-700 bg-opacity-60 border border-red-600 text-red-200 rounded-lg">
                  <h3 className="font-semibold text-md mb-1">API Key Issue</h3>
                  <p className="text-xs">{apiKeyStatus.message}</p>
                </div>
            )}
            <p className="text-center text-slate-300 mb-6 text-sm">{KAVACHMAILGUARD_INITIAL_MESSAGE}</p>
            <EmailInputForm onSubmit={handleEmailSubmit} isLoading={isLoading} disabled={!apiKeyStatus.isKeySet} />
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading && <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-lime-500"></div></div>}
          {error && !isLoading && (
            <div className="p-3 bg-red-600/50 border border-red-500 text-red-200 rounded-lg animate-fadeIn">
              <h3 className="font-semibold">Analysis Error</h3><p className="text-xs">{error}</p>
            </div>
          )}
          {currentAnalysis && !isLoading && !error && (
            <AnalysisResultDisplay entry={currentAnalysis} onProvideFeedback={(feedback) => handleFeedback(currentAnalysis.id, feedback)} />
          )}
          <RecentAnalyses history={analysisHistory} onProvideFeedback={handleFeedback} currentAnalysisEntryId={currentAnalysis?.id} />
        </div>
      </div>
    </div>
  );
};
