import React from 'react';
import { ETHICAL_USE_DISCLAIMER_TITLE, ETHICAL_USE_DISCLAIMER_TEXT } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="bg-slate-900 bg-opacity-70 backdrop-blur-md shadow-xl py-5 border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-3">
            <h1 className="text-3xl md:text-4xl font-bold text-teal-400 tracking-tight">
            NetraTrace
            </h1>
            <p className="text-sm md:text-base text-slate-400 mt-1">
            Facial Recognition for Missing Persons (Simulation) | SurakshaNet Initiative
            </p>
        </div>
        <div className="max-w-3xl mx-auto bg-yellow-700 bg-opacity-30 border border-yellow-600 text-yellow-200 p-3 rounded-lg shadow-md">
            <h2 className="font-semibold text-sm text-yellow-200 mb-1">{ETHICAL_USE_DISCLAIMER_TITLE}</h2>
            <p className="text-xs text-yellow-300 leading-relaxed">{ETHICAL_USE_DISCLAIMER_TEXT}</p>
        </div>
      </div>
    </header>
  );
};
