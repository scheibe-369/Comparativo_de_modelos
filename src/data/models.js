// Catálogo centralizado de modelos AI com IDs do OpenRouter
export const modelsData = [
    { id: 'deepseek/deepseek-chat', name: 'DeepSeek V3', provider: 'DeepSeek', costPer1M: 0.14, category: 'Ultra-Fast', badge: 'new' },
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', costPer1M: 0.15, category: 'Ultra-Fast', badge: null },
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI', costPer1M: 0.15, category: 'Ultra-Fast', badge: null },
    { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', costPer1M: 0.25, category: 'Efficient', badge: null },
    { id: 'google/gemini-2.0-flash', name: 'Gemini 3 Flash Preview', provider: 'Google', costPer1M: 0.30, category: 'Next-Gen', badge: 'recommended', isBaseline: true },
    { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta', costPer1M: 0.30, category: 'Open-Source', badge: null },
    { id: 'mistralai/mistral-large-2411', name: 'Mistral Large', provider: 'Mistral', costPer1M: 2.00, category: 'High-Reasoning', badge: null },
    { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', costPer1M: 2.50, category: 'High-Reasoning', badge: null },
    { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI', costPer1M: 2.50, category: 'High-Reasoning', badge: null },
    { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', costPer1M: 3.00, category: 'High-Reasoning', badge: null },
];

export const getModelById = (id) => modelsData.find(m => m.id === id);

export const getSortedModels = () => [...modelsData].sort((a, b) => a.costPer1M - b.costPer1M);

export const TOKENS_PER_CONVERSATION = 70000;
export const DEFAULT_MODEL = 'google/gemini-2.0-flash';

