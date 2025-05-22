import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploadAndQueryForm } from './components/ImageUploadAndQueryForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { analyzeSurveillanceImage } from './services/geminiService';
import type { SurveillanceImageData, AnalysisParameters, NigraniAIAnalysisReport } from './types';
import { GEMINI_API_KEY_CHECK_MESSAGE } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<NigraniAIAnalysisReport | null>(null);
  const [currentImage, setCurrentImage] = useState<{url?: string, fileName?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setError(GEMINI_API_KEY_CHECK_MESSAGE);
    }
    return () => {
      if (currentImage?.url && currentImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage.url);
      }
    };
  }, []); // currentImage removed, revoke handled on new submit or unmount

  const handleAnalysisSubmit = useCallback(
    async (imageData: SurveillanceImageData, params: AnalysisParameters) => {
      if (apiKeyMissing) {
        setError(GEMINI_API_KEY_CHECK_MESSAGE);
        setAnalysisResult(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);
      
      if (currentImage?.url && currentImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage.url);
      }
      setCurrentImage({url: imageData.objectURL, fileName: imageData.fileName});

      try {
        const report = await analyzeSurveillanceImage(imageData, params);
        setAnalysisResult(report);
      } catch (err) {
        console.error("Error analyzing surveillance image:", err);
        if (err instanceof Error) {
          setError(`Analysis failed: ${err.message}. Ensure API key, connectivity, and image suitability.`);
        } else {
          setError("An unknown error occurred during scene analysis.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyMissing, currentImage] 
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-slate-100 selection:bg-amber-500 selection:text-black">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-slate-800 bg-opacity-60 backdrop-blur-lg shadow-2xl rounded-xl p-5 md:p-8 border border-slate-700">
          {apiKeyMissing && (
            <div className="mb-5 p-3 bg-red-800 bg-opacity-70 border border-red-700 text-red-200 rounded-lg shadow-md">
              <h3 className="font-semibold text-base mb-1">API Key Issue</h3>
              <p className="text-sm">{GEMINI_API_KEY_CHECK_MESSAGE}</p>
            </div>
          )}
          <p className="text-center text-slate-300 mb-5 text-sm leading-relaxed">
            Upload a surveillance image and optionally specify elements to focus on. 
            NigraniAI will simulate an analysis for suspicious activities or objects.
          </p>
          <ImageUploadAndQueryForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} disabled={apiKeyMissing} />
          
          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && (
            <div className="mt-6 p-3 bg-red-700 bg-opacity-60 border border-red-600 text-red-200 rounded-lg animate-fadeIn shadow-lg" role="alert">
              <h3 className="font-semibold text-base mb-1">Analysis Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {analysisResult && !isLoading && !error && (
             <AnalysisDisplay 
                report={analysisResult} 
                imagePreviewUrl={currentImage?.url}
                imageFileName={currentImage?.fileName}
            />
          )}
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        /* Add Orbitron font for specific elements if needed in App.tsx directly if not globally applied */
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
};

export default App;
