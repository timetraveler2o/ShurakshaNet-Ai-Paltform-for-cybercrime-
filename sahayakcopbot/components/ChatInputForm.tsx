
import React, { useState } from 'react';

interface ChatInputFormProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
  disabled: boolean;
}

export const ChatInputForm: React.FC<ChatInputFormProps> = ({ onSubmit, isLoading, disabled }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading && !disabled) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form 
        onSubmit={handleSubmit} 
        className="sticky bottom-0 z-10 bg-slate-800 bg-opacity-90 backdrop-blur-md p-3 md:p-4 border-t border-slate-700 shadow-upper"
        aria-label="Chat input form"
    >
      <div className="flex items-center space-x-2 md:space-x-3 max-w-3xl mx-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about IPC, CrPC, SOPs, new laws..."
          className="flex-grow p-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || disabled}
          aria-label="Type your query for Sahayak CopBot"
        />
        <button
          type="button"
          title="Voice input (not yet implemented)"
          className="p-3 bg-slate-700 hover:bg-slate-600 text-slate-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled // Voice input not implemented
          aria-label="Use voice input (feature coming soon)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>
        <button
          type="submit"
          disabled={isLoading || disabled || !inputValue.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 disabled:bg-slate-600 disabled:hover:bg-slate-600 disabled:cursor-not-allowed"
          aria-label={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? (
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};
