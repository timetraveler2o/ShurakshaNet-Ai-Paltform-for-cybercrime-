import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../../types';
import { ChatMessageBubble } from './ChatMessageBubble';
import { BotTypingIndicator } from './LoadingSpinner'; // Assuming LoadingSpinner is generic or CopBot specific

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean; 
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-grow p-3 md:p-4 space-y-1.5 overflow-y-auto custom-scrollbar-chat">
      {messages.map((msg) => (
        <ChatMessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-200 rounded-lg rounded-bl-none p-1 shadow-md border border-transparent max-w-xs md:max-w-md lg:max-w-lg">
                <BotTypingIndicator />
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
      <style>{`
        .custom-scrollbar-chat::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-chat::-webkit-scrollbar-track { background: rgba(30, 41, 59, 0.3); } /* slate-800 with opacity */
        .custom-scrollbar-chat::-webkit-scrollbar-thumb { background: #388bfd; border-radius: 3px; } /* Blue accent */
        .custom-scrollbar-chat::-webkit-scrollbar-thumb:hover { background: #58a6ff; }
      `}</style>
    </div>
  );
};
