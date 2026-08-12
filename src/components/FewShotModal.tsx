import React, { useState } from 'react';
import { FEW_SHOT_EXAMPLES } from '../data/fewShotExamples';
import { X, Layers, Code2, Check, AlertTriangle, HelpCircle } from 'lucide-react';

interface FewShotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FewShotModal: React.FC<FewShotModalProps> = ({ isOpen, onClose }) => {
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);

  if (!isOpen) return null;

  const currentEx = FEW_SHOT_EXAMPLES[selectedExampleIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans select-none animate-in fade-in duration-200">
      <div className="bg-white border border-neutral-900 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#0A1128] text-white flex items-center justify-center font-mono text-[10px] font-bold">
              FS
            </div>
            <div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-[#111111]">
                LangChain FewShotPromptTemplate Architecture
              </h3>
              <p className="text-xs text-neutral-500">
                Injected exemplar prompt templates enforcing structured evaluation.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 border border-neutral-300 hover:border-neutral-900 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Example Selector Tabs */}
          <div className="space-y-2">
            <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest block font-bold">
              SELECT EXEMPLAR PAIR
            </span>
            <div className="grid grid-cols-3 gap-2 font-mono">
              {FEW_SHOT_EXAMPLES.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExampleIndex(idx)}
                  className={`p-2.5 text-left border transition-all ${
                    selectedExampleIndex === idx
                      ? 'border-[#0A1128] bg-[#0A1128] text-white font-semibold'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <div className="text-[9px] opacity-70 uppercase">EXAMPLE #{idx + 1}</div>
                  <div className="text-xs truncate font-sans">{ex.jobRole}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question & Template Specification */}
          <div className="p-4 border border-neutral-200 bg-neutral-50 space-y-2 font-mono">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 uppercase">
              <span>VARIABLE: {"{job_role}"} → <strong className="text-[#111111]">{currentEx.jobRole}</strong></span>
              <span>VARIABLE: {"{interview_question}"}</span>
            </div>
            <div className="text-sm font-sans font-semibold text-[#111111]">
              "{currentEx.question}"
            </div>
          </div>

          {/* Side-by-Side Comparison: Weak vs Strong */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Weak Response Panel */}
            <div className="border border-rose-200 bg-rose-50/30 p-4 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-rose-800 font-bold uppercase border-b border-rose-200 pb-1.5">
                <span className="flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>01 / WEAK RESPONSE EXEMPLAR</span>
                </span>
                <span>FEW-SHOT CONTRAST</span>
              </div>
              <p className="text-neutral-800 leading-relaxed italic bg-white p-3 border border-rose-100">
                "{currentEx.weakResponse.text}"
              </p>
              <div className="pt-1 text-[11px] text-rose-900">
                <strong className="font-mono text-[10px] uppercase block text-rose-700">LangChain Critique:</strong>
                <p>{currentEx.weakResponse.critique}</p>
              </div>
            </div>

            {/* Strong Response Panel */}
            <div className="border border-emerald-200 bg-emerald-50/30 p-4 space-y-2">
              <div className="flex items-center justify-between font-mono text-[10px] text-emerald-800 font-bold uppercase border-b border-emerald-200 pb-1.5">
                <span className="flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>02 / STRONG RESPONSE EXEMPLAR</span>
                </span>
                <span>SCORE: {currentEx.structuredFeedback.score}/10</span>
              </div>
              <p className="text-neutral-800 leading-relaxed italic bg-white p-3 border border-emerald-100">
                "{currentEx.strongResponse.text}"
              </p>
              <div className="pt-1 text-[11px] text-emerald-900 space-y-1">
                <strong className="font-mono text-[10px] uppercase block text-emerald-700">Key Strengths:</strong>
                <ul className="list-disc list-inside space-y-0.5">
                  {currentEx.strongResponse.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* LangChain Template Code Snippet View */}
          <div className="border border-neutral-300 bg-neutral-900 text-neutral-100 p-4 font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5 text-neutral-400">
              <span className="flex items-center space-x-1.5">
                <Code2 className="w-3.5 h-3.5 text-amber-400" />
                <span>LANGCHAIN PROMPT TEMPLATE SCHEMA</span>
              </span>
              <span>FewShotPromptTemplate</span>
            </div>
            <pre className="overflow-x-auto text-emerald-400 leading-tight">
{`from langchain.prompts import FewShotPromptTemplate, PromptTemplate

example_prompt = PromptTemplate(
    input_variables=["job_role", "question", "candidate_response"],
    template="Role: {job_role}\\nQuestion: {question}\\nCandidate: {candidate_response}"
)

few_shot_prompt = FewShotPromptTemplate(
    examples=FEW_SHOT_EXAMPLES,
    example_prompt=example_prompt,
    prefix="You are an expert AI Interview Coach. Evaluate responses with STAR metrics.",
    suffix="Target Role: {job_role}\\nQuestion: {interview_question}\\nResponse: {candidate_response}",
    input_variables=["job_role", "interview_question", "candidate_response"]
)`}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between font-mono text-[11px]">
          <span className="text-neutral-500">EXEMPLARS INJECTED SERVER-SIDE VIA LANGCHAIN ENGINE</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#111111] text-white hover:bg-neutral-800 transition-colors uppercase font-semibold"
          >
            CLOSE MATRIX
          </button>
        </div>
      </div>
    </div>
  );
};
