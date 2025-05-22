
import React, { useEffect, useRef } from 'react';
import type { ChatMessage } from '../types';
import { ChatMessageBubble } from './ChatMessageBubble';
import { BotTypingIndicator } from './LoadingSpinner';

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean; // To show typing indicator
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-grow p-4 md:p-6 space-y-2 overflow-y-auto custom-scrollbar">
      {messages.map((msg) => (
        <ChatMessageBubble key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
            <div className="chat-bubble-bot text-slate-200 rounded-lg rounded-bl-none p-1 shadow-md border border-transparent">
                <BotTypingIndicator />
            </div>
        </div>
      )}
      <div ref={chatEndRef} />
    </div>
  );
};
