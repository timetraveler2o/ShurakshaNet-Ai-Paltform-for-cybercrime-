import React, { useState, useCallback, useEffect } from 'react';
import { AudioUploadForm } from '../components/vaanishield/AudioUploadForm';
import { ScamAnalysisDisplay } from '../components/vaanishield/ScamAnalysisDisplay';
import { LoadingSpinner } from '../components/vaanishield/LoadingSpinner';
import { analyzeVoIPCall } from '../services/vaanishieldService';
import type { AudioFileDataInput, VoIPScamAnalysisReport, GeminiServiceStatus } from '../types';
import { DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE, VAANISHIELD_MODULE_NAME, VAANISHIELD_ETHICAL_DISCLAIMER } from '../constants';
import { PhoneIncoming } from 'lucide-react';

interface VaaniShieldViewProps {
  apiKeyStatus: GeminiServiceStatus;
}

export const VaaniShieldView: React.FC<VaaniShieldViewProps> = ({ apiKeyStatus }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<VoIPScamAnalysisReport | null>(null);
  const [currentAudio, setCurrentAudio] = useState<{url?: string, fileName?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (currentAudio?.url && currentAudio.url.startsWith('blob:')) {
        URL.revokeObjectURL(currentAudio.url);
      }
    };
  }, [currentAudio]);

  const handleAnalysisSubmit = useCallback(
    async (audioData: AudioFileDataInput) => {
      if (!apiKeyStatus.isKeySet) {
        setError(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
        setAnalysisResult(null); return;
      }
      setIsLoading(true); setError(null); setAnalysisResult(null);
      
      if (currentAudio?.url && currentAudio.url.startsWith('blob:')) URL.revokeObjectURL(currentAudio.url);
      setCurrentAudio({url: audioData.objectURL, fileName: audioData.fileName});

      try {
        const report = await analyzeVoIPCall(audioData);
        setAnalysisResult(report);
      } catch (err) {
        if (err instanceof Error) setError(`Analysis failed: ${err.message}.`);
        else setError("An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyStatus.isKeySet, currentAudio] 
  );

  return (
    <div className="animate-contentFadeInUp">
      <div className="flex items-center mb-4">
        <PhoneIncoming size={30} className="text-cyan-400 mr-3" />
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-cyan-400">{VAANISHIELD_MODULE_NAME}</h1>
          <p className="text-sm text-slate-400">VoIP Scam Call Detection (Simulation)</p>
        </div>
      </div>
       <div className="mb-6 bg-orange-700/30 border border-orange-600/50 text-orange-200 p-2.5 rounded-lg shadow-md text-xs">
            <p className="leading-relaxed text-center">{VAANISHIELD_ETHICAL_DISCLAIMER}</p>
        </div>

      <div className="w-full max-w-xl mx-auto bg-slate-800/50 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 border border-slate-700">
        {!apiKeyStatus.isKeySet && (
            <div className="mb-6 p-3 bg-red-700 bg-opacity-60 border border-red-600 text-red-200 rounded-lg">
              <h3 className="font-semibold text-md mb-1">API Key Issue</h3>
              <p className="text-xs">{apiKeyStatus.message}</p>
            </div>
        )}
        <p className="text-center text-slate-300 mb-6 text-sm">
          Upload recorded VoIP call audio for simulated AI-powered scam detection.
        </p>
        <AudioUploadForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} disabled={!apiKeyStatus.isKeySet} />
        {isLoading && <LoadingSpinner />}
        {error && !isLoading && (
          <div className="mt-6 p-3 bg-red-600/50 border border-red-500 text-red-200 rounded-lg animate-fadeIn">
            <h3 className="font-semibold">Analysis Error</h3><p className="text-xs">{error}</p>
          </div>
        )}
        {analysisResult && !isLoading && !error && (
             <ScamAnalysisDisplay report={analysisResult} audioPreviewUrl={currentAudio?.url} />
        )}
      </div>
    </div>
  );
};
