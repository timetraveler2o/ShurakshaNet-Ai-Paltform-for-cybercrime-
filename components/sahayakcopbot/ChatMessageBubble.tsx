
import React from 'react';
import type { ChatMessage } from '../../types';
import { User, Bot, AlertCircle } from 'lucide-react';

const formatText = (text: string): React.ReactNode => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*|```[\s\S]*?```|`.*?`|\n)/g);
  return parts.map((part, index) => {
    if (part === '\n') {
      return <br key={`br-${index}`} />;
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`strong-${index}`}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={`em-${index}`}>{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('```') && part.endsWith('```')) {
      const codeContent = part.slice(3, -3).trim();
      return <pre key={`pre-${index}`} className="bg-slate-900/70 p-2 my-1 rounded-md text-xs overflow-x-auto whitespace-pre-wrap border border-slate-700">{codeContent}</pre>;
    }
     if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={`code-${index}`} className="px-1 py-0.5 bg-slate-600/80 rounded text-xs">{part.slice(1, -1)}</code>;
    }
    // Basic list support
    if (part.match(/^[-*]\s/)) {
        return <li key={`li-${index}`} className="ml-4">{part.replace(/^[-*]\s/, '')}</li>;
    }
    if (part.match(/^\d+\.\s/)) {
        return <li key={`li-${index}`} value={parseInt(part)} className="ml-4">{part.replace(/^\d+\.\s/, '')}</li>;
    }
    return part;
  });
};


export const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const bubbleBaseClasses = "max-w-xs md:max-w-md lg:max-w-lg p-2.5 shadow-md rounded-xl text-sm leading-relaxed";
  const userClasses = "bg-blue-600 text-white rounded-br-none ml-auto";
  const botClasses = "bg-slate-700 text-slate-200 rounded-bl-none";
  const errorClasses = "border-red-500/70 bg-red-600/20 text-red-300";

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex mb-2.5 animate-fadeInUp ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`${bubbleBaseClasses} ${isUser ? userClasses : botClasses} ${message.isError ? errorClasses : 'border-transparent'}`}>
        <div className="flex items-start space-x-2">
          {!isUser && !message.isError && <Bot size={18} className="text-blue-300 flex-shrink-0 mt-0.5" />}
          {message.isError && <AlertCircle size={18} className="text-red-300 flex-shrink-0 mt-0.5" />}
          
          <div className="flex-grow min-w-0 prose prose-sm prose-invert max-w-none text-inherit selection:bg-blue-300 selection:text-blue-900">
            {formatText(message.text)}
          </div>
           {isUser && <User size={18} className="text-blue-200 flex-shrink-0 mt-0.5" />}
        </div>
        <p className={`text-xs mt-1.5 ${isUser ? 'text-blue-200/70 text-right' : 'text-slate-500 text-left'}`}>
          {message.isError ? 'Failed' : formattedTime}
        </p>
      </div>
      {/* Fix: Convert <style jsx global> to standard <style> tag */}
      <style>{`
        .prose strong { color: inherit; }
        .prose em { color: inherit; }
        .prose code { color: #93c5fd; } /* blue-300 */
        .prose pre { color: #e2e8f0; } /* slate-200 */
        .animate-fadeInUp {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};