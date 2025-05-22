import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { MediaUploadForm } from './components/MediaUploadForm';
import { DeepfakeResultDisplay } from './components/DeepfakeResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { analyzeMediaForDeepfake } from './services/geminiService';
import type { MediaFileData, DeepfakeAnalysisReport } from './types';
import { GEMINI_API_KEY_CHECK_MESSAGE } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DeepfakeAnalysisReport | null>(null);
  const [currentMediaPreviewUrl, setCurrentMediaPreviewUrl] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setError(GEMINI_API_KEY_CHECK_MESSAGE);
    }
    // Clean up object URLs on unmount or when new preview is set
    return () => {
      if (currentMediaPreviewUrl && currentMediaPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentMediaPreviewUrl);
      }
    };
  }, []); // currentMediaPreviewUrl removed from dependency array to avoid premature revoke

  const handleMediaSubmit = useCallback(
    async (mediaData: MediaFileData) => {
      if (apiKeyMissing) {
        setError(GEMINI_API_KEY_CHECK_MESSAGE);
        setAnalysisResult(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);
      
      // Revoke previous object URL if it exists
      if (currentMediaPreviewUrl && currentMediaPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(currentMediaPreviewUrl);
      }
      setCurrentMediaPreviewUrl(mediaData.objectURL);


      try {
        const report = await analyzeMediaForDeepfake(mediaData);
        setAnalysisResult(report);
      } catch (err) {
        console.error("Error analyzing media:", err);
        if (err instanceof Error) {
          setError(`Analysis failed: ${err.message}. Ensure API key is correct, API is reachable, and the image is suitable for analysis.`);
        } else {
          setError("An unknown error occurred during media analysis.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyMissing, currentMediaPreviewUrl] 
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-850 to-violet-950 text-slate-100 selection:bg-violet-500 selection:text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-xl bg-slate-800 bg-opacity-70 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-10 border border-slate-700">
          {apiKeyMissing && (
            <div className="mb-6 p-4 bg-red-800 bg-opacity-60 border border-red-700 text-red-200 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-1.5">API Key Configuration Issue</h3>
              <p className="text-sm">{GEMINI_API_KEY_CHECK_MESSAGE}</p>
            </div>
          )}
          <p className="text-center text-slate-300 mb-6 text-base leading-relaxed">
            Upload an image to analyze for potential AI generation or deepfake manipulation.
            SatyaDarpan uses AI to provide an authenticity assessment.
          </p>
          <MediaUploadForm onSubmit={handleMediaSubmit} isLoading={isLoading} disabled={apiKeyMissing} />
          
          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && (
            <div className="mt-8 p-4 bg-red-700 bg-opacity-50 border border-red-600 text-red-200 rounded-lg animate-fadeIn shadow-lg" role="alert">
              <h3 className="font-semibold text-lg mb-1">Error During Analysis</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {analysisResult && !isLoading && !error && (
            <DeepfakeResultDisplay report={analysisResult} mediaPreviewUrl={currentMediaPreviewUrl} />
          )}
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default App;