// Modelos Evidentes (Tela Principal)
export const modelsData = [
    { id: 'openai/gpt-5.2', name: 'GPT-5.2', provider: 'OpenAI', costInput: 2.50, costOutput: 10.00, category: 'Next-Gen', badge: 'new' }, // Valores estimados
    { id: 'google/gemini-3-flash', name: 'Gemini 3 Flash', provider: 'Google', costInput: 0.10, costOutput: 0.30, category: 'Ultra-Fast', badge: 'recommended', isBaseline: true }, // Valores estimados
    { id: 'anthropic/claude-4.6-sonnet', name: 'Claude 4.6 Sonnet', provider: 'Anthropic', costInput: 3.00, costOutput: 12.00, category: 'High-Reasoning', badge: null }, // Valores estimados
    { id: 'anthropic/claude-4.6-opus', name: 'Claude 4.6 Opus', provider: 'Anthropic', costInput: 15.00, costOutput: 60.00, category: 'Powerful', badge: null }, // Valores estimados
    { id: 'openai/gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI', costInput: 0.15, costOutput: 0.60, category: 'Efficient', badge: null }, // Valores estimados
    { id: 'meta-llama/llama-3.3-70b-instruct', name: 'Llama 3.3 70B', provider: 'Meta', costInput: 0.30, costOutput: 0.90, category: 'Open-Source', badge: null }, // Valores reais de provedores comuns
];

// Modelos Adicionais (Catálogo)
export const catalogModelsData = [
    { id: 'google/gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', costInput: 0.075, costOutput: 0.30, category: 'Ultra-Fast', badge: null },
    { id: 'moonshot/kimi-2.5', name: 'Kimi 2.5', provider: 'Moonshot', costInput: 0.20, costOutput: 0.80, category: 'Efficient', badge: null },
    { id: 'anthropic/claude-4.6-haiku', name: 'Claude 4.6 Haiku', provider: 'Anthropic', costInput: 0.25, costOutput: 1.25, category: 'Efficient', badge: null },
    { id: 'openai/gpt-4o', name: 'GPT-4 Omni', provider: 'OpenAI', costInput: 2.50, costOutput: 10.00, category: 'High-Reasoning', badge: null },
    { id: 'openai/gpt-5-mini', name: 'GPT-5 Mini', provider: 'OpenAI', costInput: 0.50, costOutput: 2.00, category: 'Efficient', badge: null }, // Estimado
    { id: 'openai/gpt-5.1', name: 'GPT-5.1', provider: 'OpenAI', costInput: 3.00, costOutput: 12.00, category: 'High-Reasoning', badge: null }, // Estimado
    { id: 'openai/gpt-5', name: 'GPT-5', provider: 'OpenAI', costInput: 4.00, costOutput: 15.00, category: 'High-Reasoning', badge: null }, // Estimado
    { id: 'google/gemini-3-pro', name: 'Gemini 3 Pro', provider: 'Google', costInput: 4.00, costOutput: 12.00, category: 'High-Reasoning', badge: null }, // Estimado
    { id: 'google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google', costInput: 2.50, costOutput: 10.00, category: 'High-Reasoning', badge: null },
];

export const getModelById = (id) => {
    return modelsData.find(m => m.id === id) || catalogModelsData.find(m => m.id === id);
};

// Custo médio ponderado: assumindo que uma conversa típica tem 80% de input e 20% de output
export const getWeightedCostPer1M = (model, inputWeight = 0.8, outputWeight = 0.2) => {
    if (!model) return 0;
    return (model.costInput * inputWeight) + (model.costOutput * outputWeight);
};

export const getSortedModels = () => [...modelsData].sort((a, b) => getWeightedCostPer1M(a) - getWeightedCostPer1M(b));

export const TOKENS_PER_CONVERSATION = 70000;
export const DEFAULT_MODEL = 'google/gemini-3-flash';

