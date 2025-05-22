
import React from 'react';
import { ETHICAL_USE_DISCLAIMER_VAANI } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 bg-opacity-75 backdrop-blur-md shadow-xl py-4 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-cyan-400 tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              VaaniShield
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-1">
              VoIP Scam Call Detection (Simulation) | SurakshaNet Initiative
            </p>
        </div>
        <div className="max-w-4xl mx-auto bg-orange-700 bg-opacity-30 border border-orange-600 text-orange-200 p-2.5 rounded-lg shadow-md text-xs">
            <p className="leading-relaxed text-center">{ETHICAL_USE_DISCLAIMER_VAANI}</p>
        </div>
      </div>
    </header>
  );
};
