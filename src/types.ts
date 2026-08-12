export type AIProvider = 'google' | 'cohere' | 'huggingface';

export interface ModelOption {
  id: string;
  name: string;
  description: string;
}

export interface ProviderConfig {
  id: AIProvider;
  name: string;
  defaultModel: string;
  models: ModelOption[];
  keyPlaceholder: string;
  documentationUrl: string;
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'loading_model' | 'connected' | 'error';

export type AppMode = 'chat' | 'interview_coach';

export type JobRole = 
  | 'Software Engineer' 
  | 'Data Analyst / Scientist' 
  | 'Business Analyst' 
  | 'Product Manager' 
  | 'Solutions Architect';

export interface InterviewQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'situational' | 'company_fit';
  question: string;
  description: string;
}

export interface FewShotExample {
  id: string;
  jobRole: string;
  question: string;
  weakResponse: {
    text: string;
    critique: string;
  };
  strongResponse: {
    text: string;
    strengths: string[];
  };
  structuredFeedback: {
    reframedAnswerSummary: string;
    strengths: string[];
    improvements: string[];
    score: number; // 1-10
    coachingAdvice: string;
  };
}

export interface StructuredFeedback {
  originalAnswer: string;
  reframedAnswer: string;
  strengths: string[];
  areasForImprovement: string[];
  score: number; // 1-10 out of 10
  keyTakeaway: string;
  followUpQuestion?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  provider?: AIProvider;
  model?: string;
  engine?: string;
  isStreaming?: boolean;
  structuredFeedback?: StructuredFeedback;
  mode?: AppMode;
  jobRole?: string;
  interviewQuestion?: string;
}

export interface ChatSession {
  messages: Message[];
  provider: AIProvider;
  apiKey: string;
  selectedModel: string;
  status: ConnectionStatus;
  statusMessage?: string;
  mode: AppMode;
  jobRole: JobRole;
  currentQuestion: string;
  useSystemKeyForGoogle: boolean;
}
