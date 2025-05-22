import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 bg-opacity-80 backdrop-blur-sm py-3 text-center border-t border-slate-700 mt-auto z-10">
      <div className="container mx-auto px-4">
        <p className="text-xs text-slate-400">
          &copy; {new Date().getFullYear()} SurakshaNet Initiative. AI Chatbot Prototype.
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          Sahayak CopBot is for informational and demonstrative purposes. Always verify with official sources.
        </p>
      </div>
    </footer>
  );
};
