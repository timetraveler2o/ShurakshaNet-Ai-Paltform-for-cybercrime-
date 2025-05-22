import React, { useState } from 'react';
import { Mic, SendHorizonal, LoaderCircle } from 'lucide-react'; // Using lucide icons

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
        className="bg-slate-800/80 backdrop-blur-sm p-3 border-t border-slate-700/70 shadow-upper"
        aria-label="Chat input form"
    >
      <div className="flex items-center space-x-2 max-w-3xl mx-auto">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask about IPC, CrPC, SOPs..."
          className="flex-grow p-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors placeholder-slate-400 text-slate-100 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          disabled={isLoading || disabled}
          aria-label="Type your query for Sahayak CopBot"
        />
        <button
          type="button"
          title="Voice input (coming soon)"
          className="p-2.5 bg-slate-700 hover:bg-slate-600 text-slate-400 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed clickable-element"
          disabled // Voice input not implemented
          aria-label="Use voice input (feature coming soon)"
        >
          <Mic size={20} />
        </button>
        <button
          type="submit"
          disabled={isLoading || disabled || !inputValue.trim()}
          className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-slate-600 clickable-element"
          aria-label={isLoading ? "Sending..." : "Send message"}
        >
          {isLoading ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            <SendHorizonal size={20} />
          )}
        </button>
      </div>
      <style>{`
        .shadow-upper {
            box-shadow: 0 -4px 10px -1px rgba(0, 0, 0, 0.2), 0 -2px 8px -1px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </form>
  );
};
