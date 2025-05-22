import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-800 bg-opacity-80 backdrop-blur-md shadow-lg py-4 border-b border-slate-700 sticky top-0 z-30">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2zM2 16a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 7a1 1 0 100 2 1 1 0 000-2zm7-1a1 1 0 10-2 0v1h2V6z"/>
          </svg>
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400 tracking-tight">
            Sahayak CopBot
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          AI Assistant for Police Personnel | SurakshaNet Initiative
        </p>
      </div>
    </header>
  );
};
