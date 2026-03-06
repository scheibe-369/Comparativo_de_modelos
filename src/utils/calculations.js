/**
 * Calcular custo por quantidade de tokens divididos em Prompt e Completion
 */
export const calculateCost = (model, tokenAmount, currency = 'USD', exchangeRate = 1, options = {}) => {
    if (!model) return 0;

    // Estimativa padrão: 80% do tráfego é contexto (Input), 20% é resposta (Output)
    const inputTokens = tokenAmount * 0.8;
    const outputTokens = tokenAmount * 0.2;

    let baseInputCost = model.costInput;
    let baseOutputCost = model.costOutput;

    // 1. Tiers logic (e.g., Gemini 2.5 Flash over_200k)
    if (model.tiers && inputTokens > 200000) {
        if (model.tiers.over_200k) {
            baseInputCost = model.tiers.over_200k.input;
            baseOutputCost = model.tiers.over_200k.output;
        }
    }

    // 2. Cache logic (if enabled via options)
    if (options.useCache && model.costCachedInput) {
        baseInputCost = model.costCachedInput;
    } else if (options.useCache && model.cacheHit) {
        baseInputCost = model.cacheHit;
    }

    // 3. Audio logic (if enabled via options)
    if (options.useAudio && model.costAudioInput) {
        baseInputCost = model.costAudioInput;
    }

    const inputCostUSD = (baseInputCost / 1_000_000) * inputTokens;
    const outputCostUSD = (baseOutputCost / 1_000_000) * outputTokens;

    const totalUSD = inputCostUSD + outputCostUSD;
    return currency === 'BRL' ? totalUSD * exchangeRate : totalUSD;
};

/**
 * Calcular custo mensal projetado
 */
export const calculateMonthlyCost = (model, tokensPerConv, convsPerDay, currency = 'USD', exchangeRate = 1, options = {}) => {
    const totalTokens = tokensPerConv * convsPerDay * 30;
    return calculateCost(model, totalTokens, currency, exchangeRate, options);
};
