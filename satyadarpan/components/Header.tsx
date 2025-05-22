import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 bg-opacity-70 backdrop-blur-md shadow-xl py-5 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-violet-400 tracking-tight">
          SatyaDarpan
        </h1>
        <p className="text-sm md:text-base text-slate-400 mt-1">
          AI-Generated Media Detection | SurakshaNet Initiative
        </p>
      </div>
    </header>
  );
};