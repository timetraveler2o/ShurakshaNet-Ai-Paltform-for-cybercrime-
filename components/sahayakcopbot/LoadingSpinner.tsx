import React from 'react';

export const BotTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 px-2 py-1.5">
      <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce"></div>
      <span className="text-xs text-slate-400 ml-0.5">CopBot is typing...</span>
    </div>
  );
};
