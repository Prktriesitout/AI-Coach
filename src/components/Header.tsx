import React from 'react';
import { AppMode, AIProvider, ConnectionStatus } from '../types';
import { PROVIDER_CONFIGS } from '../data/fewShotExamples';
import { Cpu, Terminal, RefreshCw, Download, FileCode, CheckCircle2, AlertCircle } from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  provider: AIProvider;
  selectedModel: string;
  status: ConnectionStatus;
  statusMessage?: string;
  onClearChat: () => void;
  onExportChat: () => void;
  onOpenFewShotModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  provider,
  selectedModel,
  status,
  statusMessage,
  onClearChat,
  onExportChat,
  onOpenFewShotModal
}) => {
  const providerConfig = PROVIDER_CONFIGS[provider];
  const modelName = providerConfig?.models.find(m => m.id === selectedModel)?.name || selectedModel;

  return (
    <header className="h-16 border-b border-[#111111]/10 flex items-center justify-between px-6 md:px-10 bg-white select-none sticky top-0 z-20">
      {/* Left Model & Role Metadata */}
      <div className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-[#111111]">
        <div>
          <span className="font-bold opacity-40 mr-1.5">Model:</span>
          <span>{modelName}</span>
        </div>
        <div className="hidden sm:block">
          <span className="font-bold opacity-40 mr-1.5">Provider:</span>
          <span>{providerConfig?.name}</span>
        </div>
      </div>

      {/* Center Segmented Mode Switcher */}
      <div className="flex items-center border border-[#111111]/10 p-0.5 bg-white text-[10px] uppercase tracking-widest font-bold">
        <button
          onClick={() => setMode('chat')}
          className={`px-3 py-1 transition-colors ${
            mode === 'chat'
              ? 'bg-[#111111] text-white'
              : 'text-[#666666] hover:text-[#111111]'
          }`}
        >
          AI CHAT
        </button>
        <button
          onClick={() => setMode('interview_coach')}
          className={`px-3 py-1 transition-colors ${
            mode === 'interview_coach'
              ? 'bg-[#111111] text-white'
              : 'text-[#666666] hover:text-[#111111]'
          }`}
        >
          INTERVIEW COACH
        </button>
      </div>

      {/* Right Controls & Session Badge */}
      <div className="flex items-center gap-3">
        {mode === 'interview_coach' && (
          <button
            onClick={onOpenFewShotModal}
            className="hidden lg:block text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 border border-[#111111]/20 hover:border-[#111111] text-[#111111] transition-colors"
            title="Inspect LangChain Few-Shot Examples and Prompt Templates"
          >
            FEW-SHOT MATRIX
          </button>
        )}

        <button
          onClick={onExportChat}
          className="hidden sm:block text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 border border-[#111111]/20 hover:border-[#111111] text-[#111111] transition-colors"
          title="Export session transcript"
        >
          EXPORT
        </button>

        <button
          onClick={onClearChat}
          className="text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 text-[#666666] hover:text-[#111111] transition-colors"
          title="Clear canvas"
        >
          CLEAR
        </button>

        <div className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 border border-[#111111] flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="hidden md:inline">{status === 'connected' ? 'SESSION ACTIVE' : status.toUpperCase()}</span>
        </div>
      </div>
    </header>
  );
};
