import React, { useState, useCallback, useEffect } from 'react';
import { ChatWindow } from '../components/sahayakcopbot/ChatWindow';
import { ChatInputForm } from '../components/sahayakcopbot/ChatInputForm';
import { initializeChat, sendMessageToCopBot, resetChatSession } from '../services/sahayakcopbotService';
import type { ChatMessage, GeminiServiceStatus } from '../types';
import { DASHBOARD_GEMINI_API_KEY_CHECK_MESSAGE, SAHAYAKCOPBOT_MODULE_NAME, SAHAYAKCOPBOT_INITIAL_BOT_MESSAGE_TEXT } from '../constants';
import { MessageCircleCode } from 'lucide-react';

interface SahayakCopBotViewProps {
  apiKeyStatus: GeminiServiceStatus;
}

export const SahayakCopBotView: React.FC<SahayakCopBotViewProps> = ({ apiKeyStatus }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string | null>(null); // Local error handling within chat messages

  const getInitialMessage = (): ChatMessage => ({
    id: 'copbot-initial-' + Date.now(),
    text: SAHAYAKCOPBOT_INITIAL_BOT_MESSAGE_TEXT,
    sender: 'bot',
    timestamp: new Date().toISOString(),
  });
  
  useEffect(() => {
    resetChatSession(); // Reset history when component mounts/remounts in dashboard
    const initialMessages: ChatMessage[] = [getInitialMessage()];
    if (!apiKeyStatus.isKeySet) {
        initialMessages.push({
            id: 'system-error-apikey-' + Date.now(),
            text: apiKeyStatus.message,
            sender: 'bot',
            timestamp: new Date().toISOString(),
            isError: true,
        });
    } else {
        const chat = initializeChat(); // Initialize chat session
        if (!chat) {
            initialMessages.push({
                id: 'system-error-init-' + Date.now(),
                text: "Failed to initialize Sahayak CopBot. Please check console and API Key.",
                sender: 'bot',
                timestamp: new Date().toISOString(),
                isError: true,
            });
        }
    }
    setChatMessages(initialMessages);
  }, [apiKeyStatus]);


  const handleSendMessage = useCallback(async (text: string) => {
    if (!apiKeyStatus.isKeySet) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const botResponseText = await sendMessageToCopBot(text);
      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (err) {
      const errorMessageText = err instanceof Error ? err.message : "An unknown error occurred with CopBot.";
      const botErrorMessage: ChatMessage = {
        id: 'bot-error-' + Date.now(),
        text: `Sorry, I encountered an issue: ${errorMessageText}`,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setChatMessages(prevMessages => [...prevMessages, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [apiKeyStatus.isKeySet]);

  return (
    <div className="h-full flex flex-col animate-contentFadeInUp">
      <div className="flex items-center mb-4 p-1">
        <MessageCircleCode size={30} className="text-blue-400 mr-3" />
        <div>
          <h1 className="text-2xl font-orbitron font-bold text-blue-400">{SAHAYAKCOPBOT_MODULE_NAME}</h1>
          <p className="text-sm text-slate-400">AI Assistant for Police Personnel</p>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col bg-slate-800/60 backdrop-blur-sm shadow-xl rounded-xl border border-slate-700 overflow-hidden">
        <ChatWindow messages={chatMessages} isLoading={isLoading} />
        {!apiKeyStatus.isKeySet && (
            <div className="p-2.5 bg-red-700/80 text-red-200 text-center text-xs border-t border-red-600">
            {apiKeyStatus.message} Functionality is limited.
            </div>
        )}
        <ChatInputForm onSubmit={handleSendMessage} isLoading={isLoading} disabled={!apiKeyStatus.isKeySet} />
      </div>
    </div>
  );
};

