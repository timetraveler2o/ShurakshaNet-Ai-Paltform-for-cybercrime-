import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ProbeImageUploadForm } from './components/ProbeImageUploadForm';
import { MatchResultsDisplay } from './components/MatchResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { searchForMatches } from './services/geminiService';
import type { ProbeImageData, NetraTraceAnalysisReport } from './types';
import { GEMINI_API_KEY_CHECK_MESSAGE } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<NetraTraceAnalysisReport | null>(null);
  const [currentProbeImage, setCurrentProbeImage] = useState<{url?: string, fileName?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setError(GEMINI_API_KEY_CHECK_MESSAGE);
    }
    // Clean up object URLs
    return () => {
      if (currentProbeImage?.url && currentProbeImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(currentProbeImage.url);
      }
    };
  }, []); // currentProbeImage removed intentionally

  const handleSearchSubmit = useCallback(
    async (probeData: ProbeImageData) => {
      if (apiKeyMissing) {
        setError(GEMINI_API_KEY_CHECK_MESSAGE);
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
        console.error("Error searching for matches:", err);
        if (err instanceof Error) {
          setError(`Search failed: ${err.message}. Ensure API key is correct, API is reachable, and image is suitable.`);
        } else {
          setError("An unknown error occurred during the search.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyMissing, currentProbeImage] 
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-teal-950 text-slate-100 selection:bg-teal-500 selection:text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-slate-800 bg-opacity-70 backdrop-blur-xl shadow-2xl rounded-xl p-6 md:p-10 border border-slate-700">
          {apiKeyMissing && (
            <div className="mb-6 p-4 bg-red-800 bg-opacity-60 border border-red-700 text-red-200 rounded-lg shadow-md">
              <h3 className="font-semibold text-lg mb-1.5">API Key Configuration Issue</h3>
              <p className="text-sm">{GEMINI_API_KEY_CHECK_MESSAGE}</p>
            </div>
          )}
          <p className="text-center text-slate-300 mb-6 text-base leading-relaxed">
            Upload an image of a person to simulate a search against a hypothetical missing persons database.
            NetraTrace uses AI to generate plausible illustrative matches.
          </p>
          <ProbeImageUploadForm onSubmit={handleSearchSubmit} isLoading={isLoading} disabled={apiKeyMissing} />
          
          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && (
            <div className="mt-8 p-4 bg-red-700 bg-opacity-50 border border-red-600 text-red-200 rounded-lg animate-fadeIn shadow-lg" role="alert">
              <h3 className="font-semibold text-lg mb-1">Error During Search</h3>
              <p className="text-sm">{error}</p>
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
