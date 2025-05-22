
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInputForm } from './components/ChatInputForm';
import { Footer } from './components/Footer';
import { initializeChat, sendMessageToCopBot } from './services/geminiService';
import type { ChatMessage } from './types';
import { GEMINI_API_KEY_CHECK_MESSAGE, INITIAL_BOT_MESSAGE } from './constants';

const App: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { ...INITIAL_BOT_MESSAGE, sender: 'bot' }
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState<boolean>(false);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setError(GEMINI_API_KEY_CHECK_MESSAGE);
      // Add API key error as a system message
      setChatMessages(prev => [...prev, {
        id: 'system-error-apikey-' + Date.now(),
        text: GEMINI_API_KEY_CHECK_MESSAGE,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true,
      }]);
    } else {
      // Initialize chat on load if API key exists
      const chat = initializeChat();
      if (!chat) {
        const initErrorMsg = "Failed to initialize Sahayak CopBot. Please check console.";
        setError(initErrorMsg);
        setChatMessages(prev => [...prev, {
          id: 'system-error-init-' + Date.now(),
          text: initErrorMsg,
          sender: 'bot',
          timestamp: new Date().toISOString(),
          isError: true,
        }]);
      }
    }
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (apiKeyMissing) {
      // Error already shown, just prevent sending
      return;
    }

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    setChatMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);
    setError(null);

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
      console.error("Error sending message or receiving response:", err);
      const errorMessageText = err instanceof Error ? err.message : "An unknown error occurred with the CopBot.";
      setError(errorMessageText);
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
  }, [apiKeyMissing]);

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-blue-500 selection:text-white">
      <Header />
      <ChatWindow messages={chatMessages} isLoading={isLoading} />
      {apiKeyMissing && (
        <div className="p-3 bg-red-800 text-red-200 text-center text-sm">
           {GEMINI_API_KEY_CHECK_MESSAGE} Functionality is limited.
        </div>
      )}
      <ChatInputForm onSubmit={handleSendMessage} isLoading={isLoading} disabled={apiKeyMissing} />
      <Footer />
{/* Fix: Add global styles previously in styled-jsx blocks */}
      <style>{`
        body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.3s ease-out forwards; }

        .shadow-upper {
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1c2128; /* Darker track */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #303f5b; /* Muted scrollbar thumb */
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #388bfd; /* Blue accent on hover */
        }
      `}</style>
    </div>
  );
};

export default App;
