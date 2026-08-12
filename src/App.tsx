import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LeftPanel } from './components/LeftPanel';
import { ChatMessage } from './components/ChatMessage';
import { FewShotModal } from './components/FewShotModal';
import {
  AIProvider,
  AppMode,
  ConnectionStatus,
  JobRole,
  Message
} from './types';
import { PROVIDER_CONFIGS, SAMPLE_QUESTIONS } from './data/fewShotExamples';
import { Send, Terminal, Sparkles, MessageSquare, ArrowUpRight, HelpCircle, RefreshCw } from 'lucide-react';

export default function App() {
  // App Configuration State
  const [mode, setMode] = useState<AppMode>('interview_coach');
  const [provider, setProvider] = useState<AIProvider>('google');
  const [apiKey, setApiKey] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.6-flash');
  const [useSystemKeyForGoogle, setUseSystemKeyForGoogle] = useState<boolean>(true);

  // Status & Connection
  const [status, setStatus] = useState<ConnectionStatus>('connected');
  const [statusMessage, setStatusMessage] = useState<string>('Google Gemini system key ready.');

  // AI Interview Coach Parameters
  const [jobRole, setJobRole] = useState<JobRole>('Software Engineer');
  const [currentQuestion, setCurrentQuestion] = useState<string>(
    'Tell me about yourself and your background in software engineering.'
  );

  // Messages & Input State
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      content: `Welcome to the **Swiss Editorial AI & LangChain Interview Coach**.

### 01 / System Capabilities
* **General AI Chat**: Minimal, distraction-free conversational canvas.
* **LangChain Interview Coach**: Enforces structured feedback (Reframed Answer, Strengths, Weaknesses, Score out of 10) backed by **Few-Shot Exemplars** across engineering, analytics, and business domains.

### 02 / Active Setup
* **Provider**: ${PROVIDER_CONFIGS['google'].name} (${selectedModel})
* **Target Role**: ${jobRole}
* **Active Question**: "${currentQuestion}"

*Type your candidate response below or ask any general question to begin.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-3.6-flash',
      mode: 'interview_coach',
      jobRole: 'Software Engineer',
    }
  ]);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isFewShotModalOpen, setIsFewShotModalOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Connect & Validate Key handler
  const handleConnect = async () => {
    setStatus('connecting');
    setStatusMessage('Validating API key and testing provider endpoint...');

    try {
      const res = await fetch('/api/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          apiKey: provider === 'google' && useSystemKeyForGoogle ? '' : apiKey,
          model: selectedModel,
        })
      });

      const data = await res.json();

      if (data.success) {
        setStatus('connected');
        setStatusMessage(data.message || 'Connected & active.');
      } else {
        setStatus('error');
        setStatusMessage(data.error || 'Connection failed.');
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setStatus('error');
      setStatusMessage('Network error establishing connection.');
    }
  };

  // Send Message / Coach Evaluation Handler
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || input).trim();
    if (!messageText || isGenerating) return;

    setInput('');

    // Construct User Message
    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode,
      jobRole: mode === 'interview_coach' ? jobRole : undefined,
      interviewQuestion: mode === 'interview_coach' ? currentQuestion : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);

    // Stream / Generate Assistant Reply
    try {
      const apiPayload = {
        provider,
        apiKey: provider === 'google' && useSystemKeyForGoogle ? '' : apiKey,
        model: selectedModel,
        messages: [...messages, userMessage],
        mode,
        jobRole,
        interviewQuestion: currentQuestion,
        candidateResponse: messageText,
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload),
      });

      const data = await res.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: `ast-${Date.now()}`,
          sender: 'assistant',
          content: data.reply,
          timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          engine: data.engine,
          model: selectedModel,
          mode,
          jobRole: mode === 'interview_coach' ? jobRole : undefined,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: `**Error:** ${data.error || 'Failed to generate response.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `**Network Error:** Could not connect to AI endpoint. Please check your network or key configuration.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleExportChat = () => {
    const text = messages
      .map(
        (m) =>
          `[${m.timestamp}] ${m.sender.toUpperCase()}${m.jobRole ? ` (${m.jobRole})` : ''}:\n${m.content}\n`
      )
      .join('\n----------------------------------------\n\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swiss-interview-transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quick Action Sample Response generator
  const handleQuickSampleAnswer = () => {
    const sampleText =
      jobRole === 'Software Engineer'
        ? `At my current company, I spearheaded our microservices migration to Kubernetes. We reduced deployment cycle time from 3 days to 15 minutes, while maintaining 99.99% uptime for 800k monthly active users. I focused on automated integration testing and distributed tracing.`
        : `I led a customer segment analysis across 1.5M records. By applying k-means clustering in Python, I uncovered a high-value cohort that accounted for 35% of churn. Our targeted retention campaign recovered $400k in ARR within 60 days.`;

    setInput(sampleText);
  };

  return (
    <div className="flex h-screen w-full bg-[#FFFFFF] text-[#111111] font-sans overflow-hidden">
      {/* Left Panel Configuration */}
      <LeftPanel
        provider={provider}
        setProvider={setProvider}
        apiKey={apiKey}
        setApiKey={setApiKey}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        status={status}
        statusMessage={statusMessage}
        onConnect={handleConnect}
        mode={mode}
        jobRole={jobRole}
        setJobRole={setJobRole}
        currentQuestion={currentQuestion}
        setCurrentQuestion={setCurrentQuestion}
        useSystemKeyForGoogle={useSystemKeyForGoogle}
        setUseSystemKeyForGoogle={setUseSystemKeyForGoogle}
        onOpenFewShotModal={() => setIsFewShotModalOpen(true)}
      />

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col h-full bg-[#FFFFFF] overflow-hidden">
        {/* Top Header */}
        <Header
          mode={mode}
          setMode={setMode}
          provider={provider}
          selectedModel={selectedModel}
          status={status}
          statusMessage={statusMessage}
          onClearChat={handleClearChat}
          onExportChat={handleExportChat}
          onOpenFewShotModal={() => setIsFewShotModalOpen(true)}
        />

        {/* Active Context Bar */}
        {mode === 'interview_coach' ? (
          <div className="border-b border-[#111111]/10 px-6 md:px-10 py-3 bg-[#FFFFFF] shrink-0 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-[#111111]">
              <div>
                <span className="font-bold opacity-40 mr-1.5">Role:</span>
                <span>{jobRole}</span>
              </div>
              <div className="hidden md:block max-w-xl truncate">
                <span className="font-bold opacity-40 mr-1.5">Question:</span>
                <span className="font-light italic">"{currentQuestion}"</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleQuickSampleAnswer}
                className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 border border-[#111111]/20 hover:border-[#111111] text-[#111111] transition-colors"
              >
                + Sample Answer
              </button>
            </div>
          </div>
        ) : (
          <div className="border-b border-[#111111]/10 px-6 md:px-10 py-2.5 text-[10px] uppercase tracking-widest font-bold opacity-40 text-[#111111]">
            General AI Chat / Active Canvas
          </div>
        )}

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center p-10 text-center select-none">
              <article className="max-w-md space-y-3">
                <header className="text-[10px] uppercase tracking-widest font-bold opacity-30 text-[#111111]">
                  Interviewer / Coach
                </header>
                <p className="text-xl font-light leading-relaxed text-[#111111]">
                  Welcome. Select your provider, enter an answer or message below, and click <span className="font-normal underline">Send Response</span> to begin evaluation.
                </p>
              </article>
            </div>
          ) : (
            messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                onSelectFollowUp={(q) => setCurrentQuestion(q)}
              />
            ))
          )}

          {isGenerating && (
            <div className="py-8 px-6 md:px-10 border-b border-[#111111]/10 bg-white">
              <div className="max-w-3xl flex items-center gap-3 text-[10px] uppercase tracking-widest font-bold text-[#111111]">
                <div className="w-2 h-2 bg-[#111111] animate-ping" />
                <span>Evaluating candidate response against LangChain Few-Shot exemplars...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Bottom Input */}
        <div className="p-6 md:p-10 border-t border-[#111111]/10 bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="max-w-4xl mx-auto flex items-end gap-4"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your response..."
              className="flex-1 border-none outline-none text-base md:text-lg py-2 resize-none h-14 placeholder:text-[#111111]/20 font-light text-[#111111] bg-transparent"
            />
            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="text-[10px] uppercase tracking-[0.2em] font-bold pb-3 border-b border-[#111111] hover:opacity-50 transition-opacity text-[#111111] disabled:opacity-20 shrink-0"
            >
              Send Response
            </button>
          </form>
        </div>
      </main>

      {/* Few Shot Matrix Modal */}
      <FewShotModal
        isOpen={isFewShotModalOpen}
        onClose={() => setIsFewShotModalOpen(false)}
      />
    </div>
  );
}
