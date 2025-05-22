import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 bg-opacity-60 backdrop-blur-sm py-5 text-center border-t border-slate-700 mt-auto">
      <div className="container mx-auto px-4">
        <p className="text-sm text-slate-400">
          &copy; {new Date().getFullYear()} SurakshaNet Initiative. Conceptual AI Security Platform.
        </p>
        <p className="text-xs text-slate-500 mt-1">
          NigraniAI is a PROTOTYPE. All data is simulated. Not for operational use. Use AI responsibly.
        </p>
      </div>
    </footer>
  );
};
