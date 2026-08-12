import { FewShotExample, InterviewQuestion, ProviderConfig } from '../types';

export const PROVIDER_CONFIGS: Record<string, ProviderConfig> = {
  google: {
    id: 'google',
    name: 'Google (Gemini API)',
    defaultModel: 'gemini-3.6-flash',
    keyPlaceholder: 'Enter Google API Key (or leave blank to use system key)',
    documentationUrl: 'https://ai.google.dev/docs',
    models: [
      { id: 'gemini-3.6-flash', name: 'Gemini 3.6 Flash', description: 'Fast, highly accurate model for conversational & reasoning tasks' },
      { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro', description: 'Advanced reasoning for complex code & deep interview analysis' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Ultra low-latency streaming response model' },
    ]
  },
  cohere: {
    id: 'cohere',
    name: 'Cohere',
    defaultModel: 'command-r-plus',
    keyPlaceholder: 'Enter Cohere API Key (e.g. co_...)',
    documentationUrl: 'https://docs.cohere.com',
    models: [
      { id: 'command-r-plus', name: 'Command R+', description: 'Flagship enterprise LLM optimized for complex multi-turn workflows' },
      { id: 'command-r', name: 'Command R', description: 'Balanced performance for conversational analysis and feedback' },
      { id: 'command-nightly', name: 'Command Nightly', description: 'Experimental nightly build with latest capabilities' },
    ]
  },
  huggingface: {
    id: 'huggingface',
    name: 'Hugging Face',
    defaultModel: 'tiiuae/falcon-7b-instruct',
    keyPlaceholder: 'Enter Hugging Face API Key (e.g. hf_...)',
    documentationUrl: 'https://huggingface.co/docs',
    models: [
      { id: 'tiiuae/falcon-7b-instruct', name: 'Falcon 7B Instruct', description: 'Open-source instruct-tuned model fine-tuned for structured Q&A' },
      { id: 'google/flan-t5-base', name: 'FLAN-T5 Base', description: 'Google FLAN instruction-following encoder-decoder transformer' },
      { id: 'mistralai/Mistral-7B-Instruct-v0.2', name: 'Mistral 7B Instruct', description: 'State-of-the-art open instruct model' },
    ]
  }
};

export const SAMPLE_QUESTIONS: Record<string, InterviewQuestion[]> = {
  'Software Engineer': [
    {
      id: 'se-1',
      category: 'behavioral',
      question: 'Tell me about yourself and your background in software engineering.',
      description: 'Focus on your key technical trajectory, notable projects, and what drives your engineering craft.'
    },
    {
      id: 'se-2',
      category: 'technical',
      question: 'Explain a challenging technical bug or architecture issue you resolved.',
      description: 'Demonstrate system debugging, root-cause analysis, performance profiling, and preventative design.'
    },
    {
      id: 'se-3',
      category: 'company_fit',
      question: 'Why do you want to join our engineering team?',
      description: 'Highlight technical alignment, engineering culture match, and genuine interest in the company platform.'
    },
    {
      id: 'se-4',
      category: 'situational',
      question: 'How do you handle technical debt when product managers push for tight feature deadlines?',
      description: 'Show balanced pragmatism, technical communication skills, and risk-benefit tradeoff reasoning.'
    }
  ],
  'Data Analyst / Scientist': [
    {
      id: 'da-1',
      category: 'behavioral',
      question: 'Tell me about a data project where your findings directly influenced a business decision.',
      description: 'Focus on translating statistical insights into actionable commercial strategies.'
    },
    {
      id: 'da-2',
      category: 'technical',
      question: 'How do you validate dataset integrity and handle missing or skewed telemetry data?',
      description: 'Detail data cleaning, imputation techniques, anomaly detection, and pipeline sanity checks.'
    },
    {
      id: 'da-3',
      category: 'situational',
      question: 'How do you communicate complex statistical models or metric anomalies to non-technical stakeholders?',
      description: 'Highlight data visualization techniques, intuitive framing, and executive storytelling.'
    }
  ],
  'Business Analyst': [
    {
      id: 'ba-1',
      category: 'behavioral',
      question: 'Walk me through how you gather and prioritize requirements from conflicting stakeholders.',
      description: 'Show requirement elicitations, MoSCoW prioritization, workshops, and consensus building.'
    },
    {
      id: 'ba-2',
      category: 'situational',
      question: 'Explain a challenging project where scope creep threatened the launch deadline.',
      description: 'Demonstrate change management, scope negotiation, gap analysis, and transparent reporting.'
    }
  ],
  'Product Manager': [
    {
      id: 'pm-1',
      category: 'behavioral',
      question: 'Tell me about a product feature you launched that failed to meet expectations, and what you learned.',
      description: 'Demonstrate intellectual honesty, post-mortem methodology, iteration, and customer focus.'
    },
    {
      id: 'pm-2',
      category: 'technical',
      question: 'How do you define North Star metrics for a new AI feature launch?',
      description: 'Show metric decomposition, leading vs lagging indicators, and guardrail metrics.'
    }
  ],
  'Solutions Architect': [
    {
      id: 'sa-1',
      category: 'technical',
      question: 'Describe a enterprise cloud architecture migration you designed.',
      description: 'Focus on scalability, multi-region redundancy, cost optimization, and security boundaries.'
    }
  ]
};

export const FEW_SHOT_EXAMPLES: FewShotExample[] = [
  {
    id: 'ex-1',
    jobRole: 'Software Engineer',
    question: 'Tell me about yourself.',
    weakResponse: {
      text: 'Um, I went to college and graduated in 2021. Then I got a job at a small company doing frontend work. I like coding in JavaScript and Python. I am looking for a new job because my current project is getting boring.',
      critique: 'Lacks structure (STAR or Present-Past-Future format). Mentions negative motivations ("boring"). Fails to highlight specific engineering achievements or high-impact technical metrics.'
    },
    strongResponse: {
      text: 'I am a full-stack software engineer with 4 years of experience specializing in distributed microservices and reactive frontend architectures. At my current role at Apex Labs, I led the redesign of our real-time analytics pipeline, which reduced API query latency by 42% for over 500k daily active users. Prior to that, I built scalable cloud integrations using Node.js and Postgres. I am passionate about clean code architecture and system performance, and I am excited about your team because of your recent open-source work in high-throughput data processing.',
      strengths: [
        'Structured in clear Present-Past-Future arc.',
        'Quantified technical impact (reduced latency by 42%, 500k DAU).',
        'Directly linked personal engineering values to the company platform.'
      ]
    },
    structuredFeedback: {
      reframedAnswerSummary: 'A high-impact 60-second summary highlighting expertise in distributed systems, concrete latency reduction metrics (42%), and clear alignment with open-source high-throughput systems.',
      strengths: [
        'Strong elevator pitch with clear domain specialization.',
        'Hard metrics demonstrate tangible engineering outcome.',
        'Positive forward-looking enthusiasm.'
      ],
      improvements: [
        'Could briefly touch on a core leadership or cross-functional teamwork signal.',
        'Keep the transition between backend and frontend crisp.'
      ],
      score: 9.2,
      coachingAdvice: 'When answering "Tell me about yourself", anchor on 1) Present role & specialty, 2) Highlight reel metric, 3) Future trajectory matching this target team.'
    }
  },
  {
    id: 'ex-2',
    jobRole: 'Data Analyst / Scientist',
    question: 'Why do you want to join our company?',
    weakResponse: {
      text: 'I saw your job post on LinkedIn and it looked cool. I hear you guys pay well and have good work life balance. I also really like data science.',
      critique: 'Superficial motives. Shows zero research into company mission, specific datasets, or business domain challenges.'
    },
    strongResponse: {
      text: 'I have followed your product team since you released your open benchmark on churn prediction models last year. In my current role, I analyzed customer behavior data for 2M subscribers, identifying high-risk churn clusters that rescued $1.2M in ARR. Your company’s expansion into automated predictive analytics matches my technical sweet spot in survival analysis and SQL optimization, and I want to apply my empirical framework to help scale your enterprise retention engine.',
      strengths: [
        'Demonstrates deep company knowledge (mentions open benchmark release).',
        'Connects candidate’s exact financial impact ($1.2M ARR saved) to the employer’s strategic goals.',
        'High technical specificity (survival analysis, churn clustering).'
      ]
    },
    structuredFeedback: {
      reframedAnswerSummary: 'An executive-ready answer linking company research with past $1.2M ARR retention success and advanced predictive modeling experience.',
      strengths: [
        'Shows genuine curiosity and thorough pre-interview research.',
        'Connects data science skills to revenue retention.',
        'High professional confidence.'
      ],
      improvements: [
        'Ensure the tone remains collaborative rather than purely transactional.'
      ],
      score: 9.5,
      coachingAdvice: 'Never give generic compliments. Reference a specific product initiative or technical publication, then match it to a metric you achieved.'
    }
  },
  {
    id: 'ex-3',
    jobRole: 'Business Analyst',
    question: 'Explain a challenging project you worked on.',
    weakResponse: {
      text: 'We had to build a new reporting tool. The clients were confused and kept asking for changes every week. It was stressful, but we eventually finished it after working late hours.',
      critique: 'Passive narrative. Blames clients for confusion without demonstrating proactive requirement gathering or scope management processes.'
    },
    strongResponse: {
      text: 'Last year, I managed the business requirements for a legacy ERP migration across 3 business units with conflicting priorities. Initially, scope creep caused a 3-week delay. I introduced a MoSCoW prioritization framework and led weekly executive alignment sessions. By mapping user stories directly to cost-savings targets, we reduced requirement flux by 65% and launched 2 weeks ahead of the revised baseline, saving $250k in legacy licensing fees.',
      strengths: [
        'Used STAR method (Situation, Task, Action, Result) seamlessly.',
        'Introduced formal frameworks (MoSCoW, user story mapping).',
        'Proactive conflict resolution resulting in measurable cost savings.'
      ]
    },
    structuredFeedback: {
      reframedAnswerSummary: 'A structured STAR framework response showing stakeholder management, methodology (MoSCoW), and $250k cost reduction.',
      strengths: [
        'Clear demonstration of BA leadership under pressure.',
        'Quantified scope stability improvement (65%) and savings.',
        'Framed conflict as a structured process challenge.'
      ],
      improvements: [
        'Mention the specific software or diagramming tools used (e.g., Jira, Miro, BPMN) if applicable.'
      ],
      score: 9.0,
      coachingAdvice: 'Use the STAR method: Situation -> Task -> Action -> Result. Always quantify the result and name the business analysis methodology used.'
    }
  }
];
