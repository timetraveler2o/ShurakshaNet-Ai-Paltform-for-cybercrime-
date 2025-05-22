import React from 'react';
import { ETHICAL_USE_DISCLAIMER_NIGRANI } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 bg-opacity-75 backdrop-blur-md shadow-xl py-4 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-amber-400 tracking-tight" style={{ fontFamily: "'Orbitron', sans-serif" }}>
              NigraniAI
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-1">
              Suspicious Behavior Detection (Simulation) | SurakshaNet Initiative
            </p>
        </div>
        <div className="max-w-4xl mx-auto bg-red-800 bg-opacity-40 border border-red-700 text-red-300 p-2.5 rounded-lg shadow-md text-xs">
            <p className="leading-relaxed text-center">{ETHICAL_USE_DISCLAIMER_NIGRANI}</p>
        </div>
      </div>
    </header>
  );
};
