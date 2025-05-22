import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  
  useEffect(() => {
    const loadingTexts = [
      'Initializing...',
      'Establishing secure connection...',
      'Loading security protocols...',
      'Scanning for threats...',
      'Preparing interface...',
      'Almost ready...'
    ];
    
    let currentTextIndex = 0;
    const textInterval = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
      setLoadingText(loadingTexts[currentTextIndex]);
    }, 1500);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          clearInterval(textInterval);
          setTimeout(() => {
            onLoadingComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 400);
    
    return () => {
      clearInterval(interval);
      clearInterval(textInterval);
    };
  }, [onLoadingComplete]);
  
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center z-50">
      <div className="w-full max-w-md px-8 py-12 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-subtle-grid bg-[length:20px_20px]"></div>
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-blue-500/10 blur-3xl animate-pulse-subtle"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-indigo-500/10 blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-8 text-center">
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
              SurakshaNet
            </span>
          </h1>
          
          <div className="relative w-full h-1.5 bg-slate-700 rounded-full mb-4 overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-500 rounded-full"
              style={{ width: `${progress}%`, transition: 'width 0.4s ease-out' }}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-blue-400 font-medium text-sm">{loadingText}</p>
            <p className="text-blue-300 font-medium">{Math.round(progress)}%</p>
          </div>
          
          <div className="mt-12 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <p className="text-xs text-center text-slate-400">
              <span className="text-blue-400">SYSTEM:</span> Initializing security protocols...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;