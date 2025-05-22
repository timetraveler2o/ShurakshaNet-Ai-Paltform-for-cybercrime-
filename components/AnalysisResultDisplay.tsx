import React from 'react';
import type { FraudAnalysisReport, FraudAssessment } from '../types';

interface AnalysisResultDisplayProps {
  report: FraudAnalysisReport;
}

const getRiskStyles = (assessment: FraudAssessment): {
  borderColor: string;
  textColor: string;
  bgColor: string;
  icon: React.ReactNode;
  progressColor: string;
} => {
  switch (assessment) {
    case 'High Risk':
      return {
        borderColor: 'border-red-500',
        textColor: 'text-red-300',
        bgColor: 'bg-red-500',
        progressColor: 'bg-red-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ),
      };
    case 'Medium Risk':
      return {
        borderColor: 'border-yellow-500',
        textColor: 'text-yellow-300',
        bgColor: 'bg-yellow-500',
        progressColor: 'bg-yellow-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    case 'Low Risk':
      return {
        borderColor: 'border-green-500',
        textColor: 'text-green-300',
        bgColor: 'bg-green-500',
        progressColor: 'bg-green-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      };
    default: // Unknown or other cases
      return {
        borderColor: 'border-slate-600',
        textColor: 'text-slate-300',
        bgColor: 'bg-slate-500',
        progressColor: 'bg-slate-500',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.79 4 4s-1.79 4-4 4c-1.742 0-3.223-.835-3.772-2M12 12H4m4 4H4m4-8H4" />
             <circle cx="12" cy="12" r="10" />
          </svg>
        ),
      };
  }
};

export const AnalysisResultDisplay: React.FC<AnalysisResultDisplayProps> = ({ report }) => {
  const { assessment, explanation, confidence, potentialRiskFactors } = report;
  const styles = getRiskStyles(assessment);
  const confidencePercentage = Math.round(confidence * 100);

  return (
    <div className={`mt-8 p-6 bg-slate-800 bg-opacity-70 backdrop-blur-md rounded-xl border-2 ${styles.borderColor} shadow-2xl animate-fadeIn`}>
      <div className="flex items-center mb-5">
        {styles.icon}
        <h2 className={`ml-4 text-2xl font-semibold ${styles.textColor}`}>
          Assessment: {assessment}
        </h2>
      </div>
      
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1">
            <p className="text-sm text-slate-400">Confidence Score:</p>
            <p className={`text-sm font-medium ${styles.textColor}`}>{confidencePercentage}%</p>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3.5 overflow-hidden">
          <div
            className={`h-full rounded-full ${styles.progressColor} transition-all duration-500 ease-out`}
            style={{ width: `${confidencePercentage}%` }}
            role="progressbar"
            aria-valuenow={confidencePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Confidence: ${confidencePercentage}%`}
          ></div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-slate-300 mb-1.5">Explanation:</h3>
        <p className="text-slate-200 text-base leading-relaxed bg-slate-700 bg-opacity-50 p-3 rounded-md">{explanation}</p>
      </div>

      {potentialRiskFactors && potentialRiskFactors.length > 0 && (
        <div className="mb-2">
          <h3 className="text-md font-semibold text-slate-300 mb-2">Potential Risk Factors:</h3>
          <ul className="list-none space-y-1.5 pl-0">
            {potentialRiskFactors.map((factor, index) => (
              <li key={index} className="flex items-center text-sm text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 flex-shrink-0 ${styles.textColor === 'text-red-300' ? 'text-red-400' : styles.textColor === 'text-yellow-300' ? 'text-yellow-400' : styles.textColor === 'text-green-300' ? 'text-green-400' : 'text-slate-400' }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-xs text-slate-500 mt-6 text-right">Transaction ID (Mock): {report.transactionId.substring(0,8)}...</p>
    </div>
  );
};
