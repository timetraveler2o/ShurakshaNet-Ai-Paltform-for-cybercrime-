import React, { useState, useCallback, useEffect } from 'react';
import { MediaUploadForm } from '../components/satyadarpan/MediaUploadForm';
import { DeepfakeResultDisplay } from '../components/satyadarpan/DeepfakeResultDisplay';
import { LoadingSpinner } from '../components/satyadarpan/LoadingSpinner';
import { analyzeMediaForDeepfake } from '../services/satyadarpanService';
import type { MediaFileData, DeepfakeAnalysisReport, GeminiServiceStatus } from '../types';
import { DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE, SATYADARPAN_MODULE_NAME } from '../constants';
import { ScanSearch } from 'lucide-react';

interface SatyaDarpanViewProps {
  apiKeyStatus: GeminiServiceStatus;
}

export const SatyaDarpanView: React.FC<SatyaDarpanViewProps> = ({ apiKeyStatus }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DeepfakeAnalysisReport | null>(null);
  const [currentMediaPreviewUrl, setCurrentMediaPreviewUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Clean up object URLs on unmount
    return () => {
      if (currentMediaPreviewUrl && currentMediaPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentMediaPreviewUrl);
      }
    };
  }, [currentMediaPreviewUrl]);

  const handleMediaSubmit = useCallback(
    async (mediaData: MediaFileData) => {
      if (!apiKeyStatus.isKeySet) {
        setError(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
        setAnalysisResult(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);
      
      if (currentMediaPreviewUrl && currentMediaPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentMediaPreviewUrl);
      }
      setCurrentMediaPreviewUrl(mediaData.objectURL);

      try {
        const report = await analyzeMediaForDeepfake(mediaData);
        setAnalysisResult(report);
      } catch (err) {
        console.error("Error analyzing media in SatyaDarpanView:", err);
        if (err instanceof Error) {
          setError(`Analysis failed: ${err.message}.`);
        } else {
          setError("An unknown error occurred during media analysis.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyStatus.isKeySet, currentMediaPreviewUrl] 
  );

  return (
    <div className="animate-contentFadeInUp">
      <div className="flex items-center mb-6">
        <ScanSearch size={32} className="text-violet-400 mr-3" />
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-violet-400">{SATYADARPAN_MODULE_NAME}</h1>
          <p className="text-sm text-slate-400">AI-Generated Media Detection</p>
        </div>
      </div>

      <div className="w-full max-w-xl mx-auto bg-slate-800 bg-opacity-50 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 border border-slate-700">
        {!apiKeyStatus.isKeySet && (
            <div className="mb-6 p-3 bg-red-700 bg-opacity-60 border border-red-600 text-red-200 rounded-lg">
              <h3 className="font-semibold text-md mb-1">API Key Issue</h3>
              <p className="text-xs">{apiKeyStatus.message}</p>
            </div>
        )}
        <p className="text-center text-slate-300 mb-6 text-sm leading-relaxed">
          Upload an image to analyze for potential AI generation or deepfake manipulation.
        </p>
        <MediaUploadForm onSubmit={handleMediaSubmit} isLoading={isLoading} disabled={!apiKeyStatus.isKeySet} />
        
        {isLoading && <LoadingSpinner />}
        
        {error && !isLoading && (
          <div className="mt-6 p-3 bg-red-600 bg-opacity-50 border border-red-500 text-red-200 rounded-lg animate-fadeIn">
            <h3 className="font-semibold text-md mb-1">Error During Analysis</h3>
            <p className="text-xs">{error}</p>
          </div>
        )}
        
        {analysisResult && !isLoading && !error && (
          <DeepfakeResultDisplay report={analysisResult} mediaPreviewUrl={currentMediaPreviewUrl} />
        )}
      </div>
    </div>
  );
};
