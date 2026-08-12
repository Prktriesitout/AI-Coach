import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { Copy, Check, Terminal, User, Sparkles, Award, ArrowUpRight } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onSelectFollowUp?: (question: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSelectFollowUp }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 px-6 md:px-10 border-b border-[#111111]/10 bg-white">
      <div className={`max-w-3xl ${isUser ? 'ml-auto text-right' : 'mr-auto'}`}>
        {/* Header Label */}
        <div className={`flex items-center gap-3 mb-3 text-[10px] uppercase tracking-widest font-bold opacity-40 text-[#111111] ${isUser ? 'justify-end' : 'justify-start'}`}>
          {!isUser && <span className="w-2 h-2 bg-[#111111]" />}
          <span>{isUser ? 'Candidate' : message.engine || message.model || 'Interviewer / Coach'}</span>
          <span>• {message.timestamp}</span>
          <button
            onClick={handleCopy}
            className="hover:opacity-100 transition-opacity ml-2"
            title="Copy"
          >
            {copied ? 'COPIED' : 'COPY'}
          </button>
        </div>

        {/* Question context if present */}
        {message.interviewQuestion && isUser && (
          <div className="mb-4 text-xs font-mono uppercase tracking-wider text-[#666666] border-b border-[#111111]/10 pb-2">
            Prompt: "{message.interviewQuestion}"
          </div>
        )}

        {/* Message Content */}
        <div className={`prose prose-neutral max-w-none text-[#111111] ${isUser ? 'text-lg font-light italic text-[#111111]' : ''}`}>
          <ReactMarkdown
            components={{
              h3: ({ children }) => (
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#111111] mt-6 mb-3 border-b border-[#111111]/10 pb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#111111]" />
                  <span>{children}</span>
                </div>
              ),
              p: ({ children }) => <p className="text-base md:text-lg font-light leading-relaxed mb-4 text-[#111111]">{children}</p>,
              ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 mb-4 text-sm md:text-base font-light text-[#111111]">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 mb-4 text-sm md:text-base font-light text-[#111111]">{children}</ol>,
              blockquote: ({ children }) => (
                <div className="border-l border-[#111111] pl-6 py-2 bg-[#F9F9F9] text-[#111111] my-4 text-sm font-normal">
                  {children}
                </div>
              ),
              code: ({ children }) => (
                <code className="bg-[#F9F9F9] border border-[#111111]/10 text-[#111111] font-mono text-xs px-1.5 py-0.5">
                  {children}
                </code>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>

          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-[#111111] ml-1 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};
