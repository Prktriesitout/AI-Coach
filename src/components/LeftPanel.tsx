import React, { useState } from 'react';
import { AIProvider, AppMode, ConnectionStatus, JobRole } from '../types';
import { PROVIDER_CONFIGS, SAMPLE_QUESTIONS } from '../data/fewShotExamples';
import { Key, Cpu, Sparkles, Check, HelpCircle, Layers, ShieldCheck, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface LeftPanelProps {
  provider: AIProvider;
  setProvider: (provider: AIProvider) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  status: ConnectionStatus;
  statusMessage?: string;
  onConnect: () => void;
  mode: AppMode;
  jobRole: JobRole;
  setJobRole: (role: JobRole) => void;
  currentQuestion: string;
  setCurrentQuestion: (q: string) => void;
  useSystemKeyForGoogle: boolean;
  setUseSystemKeyForGoogle: (val: boolean) => void;
  onOpenFewShotModal: () => void;
}

export const LeftPanel: React.FC<LeftPanelProps> = ({
  provider,
  setProvider,
  apiKey,
  setApiKey,
  selectedModel,
  setSelectedModel,
  status,
  statusMessage,
  onConnect,
  mode,
  jobRole,
  setJobRole,
  currentQuestion,
  setCurrentQuestion,
  useSystemKeyForGoogle,
  setUseSystemKeyForGoogle,
  onOpenFewShotModal,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const currentProviderConfig = PROVIDER_CONFIGS[provider];
  const questionsForRole = SAMPLE_QUESTIONS[jobRole] || SAMPLE_QUESTIONS['Software Engineer'];

  const handleProviderChange = (p: AIProvider) => {
    setProvider(p);
    setSelectedModel(PROVIDER_CONFIGS[p].defaultModel);
  };

  return (
    <aside className="w-[320px] shrink-0 h-full border-r border-[#111111]/10 flex flex-col p-6 lg:p-8 bg-white select-none overflow-y-auto">
      {/* Sidebar Header */}
      <header className="mb-8 shrink-0">
        <h1 className="text-2xl font-bold tracking-tighter leading-none uppercase text-[#111111]">
          AI Coach
        </h1>
        <p className="text-[10px] uppercase tracking-widest mt-2 text-[#666666]">
          Interview Intelligence / V.1.0
        </p>
      </header>

      <div className="flex-1 space-y-8">
        {/* 01 / Provider */}
        <section>
          <label className="text-[10px] uppercase tracking-widest font-bold mb-3 block text-[#111111]">
            01 / Provider
          </label>
          <div className="grid grid-cols-1 gap-px bg-[#111111]/10 border border-[#111111]/10">
            <button
              type="button"
              onClick={() => handleProviderChange('huggingface')}
              className={`py-2 px-4 text-xs text-left transition-colors font-medium ${
                provider === 'huggingface'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#F9F9F9]'
              }`}
            >
              Hugging Face
            </button>
            <button
              type="button"
              onClick={() => handleProviderChange('cohere')}
              className={`py-2 px-4 text-xs text-left transition-colors font-medium ${
                provider === 'cohere'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#F9F9F9]'
              }`}
            >
              Cohere
            </button>
            <button
              type="button"
              onClick={() => handleProviderChange('google')}
              className={`py-2 px-4 text-xs text-left transition-colors font-medium ${
                provider === 'google'
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#111111] hover:bg-[#F9F9F9]'
              }`}
            >
              Google Gemini
            </button>
          </div>
        </section>

        {/* 02 / API Key */}
        <section>
          <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block text-[#111111]">
            02 / API Key
          </label>

          {provider === 'google' && (
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="sysKeyCheck"
                checked={useSystemKeyForGoogle}
                onChange={(e) => setUseSystemKeyForGoogle(e.target.checked)}
                className="rounded-none border-[#111111] text-[#111111] focus:ring-0 cursor-pointer"
              />
              <label htmlFor="sysKeyCheck" className="text-[10px] text-[#666666] font-medium cursor-pointer">
                Use system environment key
              </label>
            </div>
          )}

          {(!useSystemKeyForGoogle || provider !== 'google') && (
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={currentProviderConfig.keyPlaceholder}
                className="w-full border-b border-[#111111] py-1 text-xs focus:outline-none placeholder:text-[#111111]/30 text-[#111111] bg-transparent font-mono pr-7"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1 text-[#666666] hover:text-[#111111]"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
          <p className="text-[9px] text-[#666666] mt-2 italic font-serif">
            Stored locally in browser session.
          </p>
        </section>

        {/* 03 / AI Model */}
        <section>
          <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block text-[#111111]">
            03 / AI Model
          </label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full border border-[#111111]/10 p-2 text-xs appearance-none bg-white text-[#111111] focus:outline-none focus:border-[#111111]"
          >
            {currentProviderConfig.models.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </section>

        {/* 04 / Job Role */}
        <section>
          <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block text-[#111111]">
            04 / Job Role
          </label>
          <select
            value={jobRole}
            onChange={(e) => {
              const role = e.target.value as JobRole;
              setJobRole(role);
              const firstQ = SAMPLE_QUESTIONS[role]?.[0]?.question || '';
              setCurrentQuestion(firstQ);
            }}
            className="w-full border border-[#111111]/10 p-2 text-xs appearance-none bg-white text-[#111111] focus:outline-none focus:border-[#111111]"
          >
            <option value="Software Engineer">Software Engineer</option>
            <option value="Data Analyst / Scientist">Data Scientist</option>
            <option value="Business Analyst">Business Analyst</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Solutions Architect">Solutions Architect</option>
          </select>
        </section>

        {/* 05 / Active Question Preset */}
        <section>
          <label className="text-[10px] uppercase tracking-widest font-bold mb-2 block text-[#111111]">
            05 / Interview Prompt
          </label>
          <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
            {questionsForRole.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentQuestion(q.question)}
                className={`w-full text-left p-2 border text-[11px] transition-colors leading-tight ${
                  currentQuestion === q.question
                    ? 'border-[#111111] bg-[#F9F9F9] font-medium text-[#111111]'
                    : 'border-[#111111]/10 bg-white text-[#666666] hover:border-[#111111]/40'
                }`}
              >
                <div className="text-[8px] uppercase tracking-wider text-[#666666] mb-0.5">{q.category}</div>
                <div className="line-clamp-2">{q.question}</div>
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={onConnect}
          disabled={status === 'connecting' || status === 'loading_model'}
          className="w-full bg-[#111111] text-white py-3 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-[#333333] transition-colors"
        >
          {status === 'connecting' ? 'Connecting...' : status === 'loading_model' ? 'Loading Model...' : 'Connect & Start'}
        </button>

        {statusMessage && (
          <p className="text-[10px] text-[#666666] font-mono tracking-wide p-2 border border-[#111111]/10 bg-[#F9F9F9]">
            {statusMessage}
          </p>
        )}
      </div>

      <footer className="mt-auto pt-6 border-t border-[#111111]/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-green-500' : 'bg-amber-500'}`} />
          <span className="text-[10px] uppercase tracking-widest font-bold text-[#111111]">
            {status === 'connected' ? 'System Ready' : status}
          </span>
        </div>
        <button
          onClick={onOpenFewShotModal}
          className="text-[9px] uppercase tracking-widest font-bold text-[#666666] hover:text-[#111111]"
        >
          Prompt Matrix
        </button>
      </footer>
    </aside>
  );
};
