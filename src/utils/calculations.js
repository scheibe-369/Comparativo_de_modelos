/**
 * Calcular custo por quantidade de tokens divididos em Prompt e Completion
 */
export const calculateCost = (model, tokenAmount, currency = 'USD', exchangeRate = 1, options = {}) => {
    if (!model) return 0;

    // Se estiver no modo Exato, usa os valores literais declarados via opções
    const isExactMode = options.exactInput !== undefined && options.exactOutput !== undefined;
    
    // Estimativa padrão: 80% do tráfego é contexto (Input), 20% é resposta (Output)
    // Se "exactMode" estiver ativo, sobrescreve o blending genérico.
    const inputTokens = isExactMode ? options.exactInput : tokenAmount * 0.8;
    const outputTokens = isExactMode ? options.exactOutput : tokenAmount * 0.2;

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

    let totalUSD = inputCostUSD + outputCostUSD;

    // 4. Apply Internal Client Markup (1.5x) if requested
    if (options.clientMarkup) {
        totalUSD *= 1.5;
    }

    return currency === 'BRL' ? totalUSD * exchangeRate : totalUSD;
};

/**
 * Calcular custo mensal projetado
 */
export const calculateMonthlyCost = (model, tokensPerConv, convsPerDay, currency = 'USD', exchangeRate = 1, options = {}) => {
    const totalTokens = tokensPerConv * convsPerDay * 30;
    return calculateCost(model, totalTokens, currency, exchangeRate, options);
};
