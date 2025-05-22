import React from 'react';

export const BotTypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1.5 px-3 py-2">
      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></div>
      <span className="text-xs text-slate-400 ml-1">CopBot is typing...</span>
    </div>
  );
};
