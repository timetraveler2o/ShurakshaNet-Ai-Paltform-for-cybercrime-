import React, { useState, useCallback } from 'react';
import { TransactionInputForm } from '../components/dhanrakshak/TransactionInputForm';
import { AnalysisResultDisplay } from '../components/dhanrakshak/AnalysisResultDisplay';
import { LoadingSpinner } from '../components/dhanrakshak/LoadingSpinner';
import { analyzeUPITransaction } from '../services/dhanrakshakService';
import type { UPITransactionData, FraudAnalysisReport, GeminiServiceStatus } from '../types';
import { DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE, DHANRAKSHAK_MODULE_NAME } from '../constants';
import { ShieldAlert } from 'lucide-react';


interface DhanRakshakViewProps {
  apiKeyStatus: GeminiServiceStatus;
}

export const DhanRakshakView: React.FC<DhanRakshakViewProps> = ({ apiKeyStatus }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<FraudAnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTransactionSubmit = useCallback(
    async (data: Omit<UPITransactionData, 'timestamp' | 'transactionId'>) => {
      if (!apiKeyStatus.isKeySet) {
        setError(DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE);
        setAnalysisResult(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setAnalysisResult(null);

      const transactionDetails: UPITransactionData = {
        ...data,
        timestamp: new Date().toISOString(),
      };

      try {
        const report = await analyzeUPITransaction(transactionDetails);
        setAnalysisResult(report);
      } catch (err) {
        console.error("Error analyzing transaction in DhanRakshakView:", err);
        if (err instanceof Error) {
          setError(`Analysis failed: ${err.message}.`);
        } else {
          setError("An unknown error occurred during transaction analysis.");
        }
      } finally {
        setIsLoading(false);
      }
    },
    [apiKeyStatus.isKeySet]
  );

  return (
    <div className="animate-contentFadeInUp">
      <div className="flex items-center mb-6">
        <ShieldAlert size={32} className="text-sky-400 mr-3" />
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-sky-400">{DHANRAKSHAK_MODULE_NAME}</h1>
          <p className="text-sm text-slate-400">Intelligent Financial Fraud Detection</p>
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
          Submit UPI transaction details below for a simulated fraud risk assessment.
        </p>
        <TransactionInputForm onSubmit={handleTransactionSubmit} isLoading={isLoading} disabled={!apiKeyStatus.isKeySet} />
        
        {isLoading && <LoadingSpinner />}
        
        {error && !isLoading && (
          <div className="mt-6 p-3 bg-red-600 bg-opacity-50 border border-red-500 text-red-200 rounded-lg animate-fadeIn">
            <h3 className="font-semibold text-md mb-1">Error During Analysis</h3>
            <p className="text-xs">{error}</p>
          </div>
        )}
        
        {analysisResult && !isLoading && !error && (
          <AnalysisResultDisplay report={analysisResult} />
        )}
      </div>
    </div>
  );
};
