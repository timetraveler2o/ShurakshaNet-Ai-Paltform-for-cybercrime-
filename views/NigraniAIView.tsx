
import React, { useState, useCallback, useEffect } from 'react';
import { VideoUploadAndQueryForm } from '../components/nigraniai/ImageUploadAndQueryForm'; 
import { AnalysisDisplay } from '../components/nigraniai/AnalysisDisplay';
import { LoadingSpinner } from '../components/nigraniai/LoadingSpinner';
import { analyzeSurveillanceVideo } from '../services/nigraniaiService'; 
import type { SurveillanceVideoData, AnalysisParameters, NigraniAIAnalysisReport, GeminiServiceStatus } from '../types'; 
import { DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE, NIGRANIAI_MODULE_NAME, NIGRANIAI_ETHICAL_DISCLAIMER } from '../constants';
import { Eye, Video } from 'lucide-react'; 

interface NigraniAIViewProps {
  apiKeyStatus: GeminiServiceStatus;
}

export const NigraniAIView: React.FC<NigraniAIViewProps> = ({ apiKeyStatus }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<NigraniAIAnalysisReport | null>(null);
  const [currentVideo, setCurrentVideo] = useState<{url?: string, fileName?: string} | null>(null); 
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (currentVideo?.url && currentVideo.url.startsWith('blob:')) { 
        URL.revokeObjectURL(currentVideo.url);
      }
    };
  }, [currentVideo]); 

  const handleAnalysisSubmit = useCallback(
    async (videoData: SurveillanceVideoData, params: AnalysisParameters) => { 
      if (!apiKeyStatus.isKeySet) {
        setError(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
        setAnalysisResult(null); return;
      }
      setIsLoading(true); setError(null); setAnalysisResult(null);
      
      if (currentVideo?.url && currentVideo.url.startsWith('blob:')) URL.revokeObjectURL(currentVideo.url); 
      setCurrentVideo({url: videoData.objectURL, fileName: videoData.fileName}); 

      try {
        const report = await analyzeSurveillanceVideo(videoData, params); 
        setAnalysisResult(report);
      } catch (err) {
        if (err instanceof Error) setError(`Analysis failed: ${err.message}.`);
        else setError("An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyStatus.isKeySet, currentVideo] 
  );

  return (
    <div className="animate-contentFadeInUp">
      <div className="flex items-center mb-4">
        <Video size={32} className="text-amber-400 mr-3" /> 
        <div>
            <h1 className="text-2xl font-orbitron font-bold text-amber-400">{NIGRANIAI_MODULE_NAME}</h1>
            <p className="text-sm text-slate-400">Video Surveillance Analysis (Simulation)</p> 
        </div>
      </div>
      <div className="mb-6 bg-red-800/30 border border-red-700/50 text-red-300 p-2.5 rounded-lg shadow-md text-xs">
        <p className="leading-relaxed text-center">{NIGRANIAI_ETHICAL_DISCLAIMER}</p>
      </div>

      <div className="w-full max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-lg shadow-xl rounded-xl p-6 md:p-8 border border-slate-700">
         {!apiKeyStatus.isKeySet && (
            <div className="mb-6 p-3 bg-red-700 bg-opacity-60 border border-red-600 text-red-200 rounded-lg">
              <h3 className="font-semibold text-md mb-1">API Key Issue</h3>
              <p className="text-xs">{apiKeyStatus.message}</p>
            </div>
        )}
        <p className="text-center text-slate-300 mb-6 text-sm">
          Upload a surveillance video and optionally specify focus for simulated AI analysis of events, behaviors, and emotions.
        </p>
        <VideoUploadAndQueryForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} disabled={!apiKeyStatus.isKeySet} /> 
        {isLoading && <LoadingSpinner message="Analyzing Video..." />} 
        {error && !isLoading && (
          <div className="mt-6 p-3 bg-red-600/50 border border-red-500 text-red-200 rounded-lg animate-fadeIn">
            <h3 className="font-semibold">Analysis Error</h3><p className="text-xs">{error}</p>
          </div>
        )}
        {analysisResult && !isLoading && !error && (
             <AnalysisDisplay 
                report={analysisResult} 
                videoPreviewUrl={currentVideo?.url} 
                videoFileName={currentVideo?.fileName} 
            />
        )}
      </div>
    </div>
  );
};
