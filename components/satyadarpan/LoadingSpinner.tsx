import React from 'react';

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Analyzing Media..." }) => {
  return (
    <div className="flex flex-col justify-center items-center py-8" aria-live="polite" aria-busy="true">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-violet-500"></div>
      <p className="ml-0 mt-3 text-md text-slate-300 tracking-wide">
        {message}
      </p>
    </div>
  );
};
