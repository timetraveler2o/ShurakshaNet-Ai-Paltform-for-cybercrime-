import React, { useState, useCallback, useEffect } from 'react';
import { ProbeImageUploadForm } from '../components/netratrace/ProbeImageUploadForm';
import { MatchResultsDisplay } from '../components/netratrace/MatchResultsDisplay';
import { LoadingSpinner } from '../components/netratrace/LoadingSpinner';
import { searchForMatches } from '../services/netratraceService';
import type { ProbeImageData, NetraTraceAnalysisReport, GeminiServiceStatus } from '../types';
import { DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE, NETRATRACE_MODULE_NAME, NETRATRACE_ETHICAL_DISCLAIMER_TITLE, NETRATRACE_ETHICAL_DISCLAIMER_TEXT } from '../constants';
import { UserSearch } from 'lucide-react';

interface NetraTraceViewProps {
  apiKeyStatus: GeminiServiceStatus;
}

export const NetraTraceView: React.FC<NetraTraceViewProps> = ({ apiKeyStatus }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<NetraTraceAnalysisReport | null>(null);
  const [currentProbeImage, setCurrentProbeImage] = useState<{url?: string, fileName?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (currentProbeImage?.url && currentProbeImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(currentProbeImage.url);
      }
    };
  }, [currentProbeImage]);

  const handleSearchSubmit = useCallback(
    async (probeData: ProbeImageData) => {
      if (!apiKeyStatus.isKeySet) {
        setError(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
        setAnalysisResult(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);
      
      if (currentProbeImage?.url && currentProbeImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(currentProbeImage.url);
      }
      setCurrentProbeImage({url: probeData.objectURL, fileName: probeData.fileName});

      try {
        const report = await searchForMatches(probeData);
        setAnalysisResult(report);
      } catch (err) {
        console.error("Error searching for matches in NetraTraceView:", err);
        if (err instanceof Error) {
          setError(`Search failed: ${err.message}.`);
        } else {
          setError("An unknown error occurred during the search.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyStatus.isKeySet, currentProbeImage] 
  );

  return (
    <div className="animate-contentFadeInUp">
      <div className="flex items-center mb-4">
        <UserSearch size={32} className="text-teal-400 mr-3" />
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-teal-400">{NETRATRACE_MODULE_NAME}</h1>
          <p className="text-sm text-slate-400">Facial Recognition for Missing Persons (Simulation)</p>
        </div>
      </div>
      <div className="mb-6 bg-yellow-700/30 border border-yellow-600/50 text-yellow-200 p-3 rounded-lg shadow-md text-xs">
            <h2 className="font-semibold text-yellow-100 mb-0.5">{NETRATRACE_ETHICAL_DISCLAIMER_TITLE}</h2>
            <p className="leading-relaxed">{NETRATRACE_ETHICAL_DISCLAIMER_TEXT}</p>
      </div>

      <div className="w-full max-w-2xl mx-auto bg-slate-800 bg-opacity-50 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 border border-slate-700">
        {!apiKeyStatus.isKeySet && (
            <div className="mb-6 p-3 bg-red-700 bg-opacity-60 border border-red-600 text-red-200 rounded-lg">
              <h3 className="font-semibold text-md mb-1">API Key Issue</h3>
              <p className="text-xs">{apiKeyStatus.message}</p>
            </div>
        )}
        <p className="text-center text-slate-300 mb-6 text-sm leading-relaxed">
          Upload an image to simulate a search against a hypothetical missing persons database.
        </p>
        <ProbeImageUploadForm onSubmit={handleSearchSubmit} isLoading={isLoading} disabled={!apiKeyStatus.isKeySet} />
        
        {isLoading && <LoadingSpinner />}
        
        {error && !isLoading && (
          <div className="mt-6 p-3 bg-red-600 bg-opacity-50 border border-red-500 text-red-200 rounded-lg animate-fadeIn">
            <h3 className="font-semibold text-md mb-1">Error During Search</h3>
            <p className="text-xs">{error}</p>
          </div>
        )}
        
        {analysisResult && !isLoading && !error && (
             <MatchResultsDisplay 
                report={analysisResult} 
                probeImagePreviewUrl={currentProbeImage?.url}
                probeImageFileName={currentProbeImage?.fileName}
            />
        )}
      </div>
    </div>
  );
};
