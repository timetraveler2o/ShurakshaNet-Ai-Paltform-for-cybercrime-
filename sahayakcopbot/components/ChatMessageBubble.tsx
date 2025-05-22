
import React from 'react';
import type { ChatMessage } from '../types';

// Basic markdown-to-HTML (supports **bold**, *italic*, ```code```, and lists)
const formatMessageText = (text: string): React.ReactNode[] => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent = '';
  let listItems: string[] = [];
  let inList = false;

  const renderList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc list-inside my-1 space-y-0.5">
          {listItems.map((item, idx) => <li key={idx}>{formatInlineText(item.replace(/^[-*]\s*/, ''))}</li>)}
        </ul>
      );
      listItems = [];
    }
    inList = false;
  };
  
  const formatInlineText = (line: string): React.ReactNode => {
    // Bold, Italic, Code
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    line = line.replace(/```(.*?)```/g, '<code class="px-1 py-0.5 bg-slate-600 rounded text-sm">$1</code>');
    
    return <span dangerouslySetInnerHTML={{ __html: line }} />;
  };


  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    if (line.startsWith('```') && !line.endsWith('```')) { // Start or end of multi-line code block
        if (inCodeBlock) {
            elements.push(<pre key={`codeblock-${elements.length}`} className="bg-slate-900 p-2 rounded-md text-sm overflow-x-auto my-1 whitespace-pre-wrap">{codeBlockContent.trim()}</pre>);
            codeBlockContent = '';
        }
        inCodeBlock = !inCodeBlock;
        continue;
    }

    if (inCodeBlock) {
      codeBlockContent += line + '\n';
      continue;
    }

    if (line.match(/^[-*]\s/) || line.match(/^\d+\.\s/)) {
        if (!inList) inList = true;
        listItems.push(line);
        if (i === lines.length -1) renderList(); // render if it's the last line
    } else {
        if (inList) renderList();
        elements.push(<div key={`line-${elements.length}`}>{formatInlineText(line)}</div>);
    }
  }
  if (inCodeBlock) { // Ensure dangling code block is rendered
    elements.push(<pre key={`codeblock-${elements.length}`} className="bg-slate-900 p-2 rounded-md text-sm overflow-x-auto my-1 whitespace-pre-wrap">{codeBlockContent.trim()}</pre>);
  }
  if (inList) renderList(); // Ensure dangling list is rendered

  return elements;
};


export const ChatMessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const bubbleAlignment = isUser ? 'justify-end' : 'justify-start';
  const bubbleClasses = isUser
    ? 'chat-bubble-user text-white rounded-lg rounded-br-none'
    : 'chat-bubble-bot text-slate-200 rounded-lg rounded-bl-none';
  
  const errorClasses = message.isError ? 'border-red-500 bg-red-700 bg-opacity-30 text-red-300' : 'border-transparent';

  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`flex ${bubbleAlignment} mb-3 animate-fadeInUp`}>
      <div className={`max-w-xs md:max-w-md lg:max-w-xl p-3 shadow-md border ${bubbleClasses} ${errorClasses}`}>
        <div className="prose prose-sm prose-invert max-w-none text-slate-200 selection:bg-blue-300 selection:text-blue-900">
            {formatMessageText(message.text)}
        </div>
        <p className={`text-xs mt-1.5 ${isUser ? 'text-slate-500 text-right' : 'text-slate-500 text-left'}`}>
          {message.isError ? 'Failed to send' : formattedTime}
        </p>
      </div>
    </div>
  );
};
