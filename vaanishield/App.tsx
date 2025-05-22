
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { AudioUploadForm } from './components/AudioUploadForm';
import { ScamAnalysisDisplay } from './components/ScamAnalysisDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Footer } from './components/Footer';
import { analyzeVoIPCall } from './services/geminiService';
import type { AudioFileData, VoIPScamAnalysisReport } from './types';
import { GEMINI_API_KEY_CHECK_MESSAGE } from './constants';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<VoIPScamAnalysisReport | null>(null);
  const [currentAudio, setCurrentAudio] = useState<{url?: string, fileName?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setError(GEMINI_API_KEY_CHECK_MESSAGE);
    }
    return () => {
      if (currentAudio?.url && currentAudio.url.startsWith('blob:')) {
        URL.revokeObjectURL(currentAudio.url);
      }
    };
  }, []); // currentAudio removed from deps, handled on new submit or unmount

  const handleAnalysisSubmit = useCallback(
    async (audioData: AudioFileData) => {
      if (apiKeyMissing) {
        setError(GEMINI_API_KEY_CHECK_MESSAGE);
        setAnalysisResult(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);
      
      if (currentAudio?.url && currentAudio.url.startsWith('blob:')) {
        URL.revokeObjectURL(currentAudio.url);
      }
      setCurrentAudio({url: audioData.objectURL, fileName: audioData.fileName});

      try {
        const report = await analyzeVoIPCall(audioData);
        setAnalysisResult(report);
      } catch (err) {
        console.error("Error analyzing VoIP call:", err);
        if (err instanceof Error) {
          setError(`Analysis failed: ${err.message}. Ensure API key, connectivity, and audio file suitability.`);
        } else {
          setError("An unknown error occurred during call analysis.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyMissing, currentAudio] 
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6 flex flex-col items-center">
        <div className="w-full max-w-xl bg-slate-800 bg-opacity-60 backdrop-blur-lg shadow-2xl rounded-xl p-5 md:p-8 border border-slate-700">
          {apiKeyMissing && (
            <div className="mb-5 p-3 bg-red-800 bg-opacity-70 border border-red-700 text-red-200 rounded-lg shadow-md">
              <h3 className="font-semibold text-base mb-1">API Key Issue</h3>
              <p className="text-sm">{GEMINI_API_KEY_CHECK_MESSAGE}</p>
            </div>
          )}
          <p className="text-center text-slate-300 mb-5 text-sm leading-relaxed">
            Upload a recorded VoIP call audio file. VaaniShield will simulate an AI-powered analysis
            to detect potential scam indicators.
          </p>
          <AudioUploadForm onSubmit={handleAnalysisSubmit} isLoading={isLoading} disabled={apiKeyMissing} />
          
          {isLoading && <LoadingSpinner />}
          
          {error && !isLoading && (
            <div className="mt-6 p-3 bg-red-700 bg-opacity-60 border border-red-600 text-red-200 rounded-lg animate-fadeIn shadow-lg" role="alert">
              <h3 className="font-semibold text-base mb-1">Analysis Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          )}
          
          {analysisResult && !isLoading && !error && (
             <ScamAnalysisDisplay 
                report={analysisResult} 
                audioPreviewUrl={currentAudio?.url}
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
        .font-orbitron { font-family: 'Orbitron', sans-serif; }
      `}</style>
    </div>
  );
};

export default App;
