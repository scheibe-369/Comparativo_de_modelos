/**
 * Calcular custo por quantidade de tokens divididos em Prompt (80%) e Completion (20%)
 */
export const calculateCost = (costInput, costOutput, tokenAmount, currency = 'USD', exchangeRate = 1) => {
    // Estimativa padrão: 80% do tráfego é contexto (Input), 20% é resposta (Output)
    const inputTokens = tokenAmount * 0.8;
    const outputTokens = tokenAmount * 0.2;

    const inputCostUSD = (costInput / 1_000_000) * inputTokens;
    const outputCostUSD = (costOutput / 1_000_000) * outputTokens;

    const totalUSD = inputCostUSD + outputCostUSD;
    return currency === 'BRL' ? totalUSD * exchangeRate : totalUSD;
};

/**
 * Calcular custo mensal projetado
 * @param {number} costInput - Custo por 1M tokens de Input em USD
 * @param {number} costOutput - Custo por 1M tokens de Output em USD
 * @param {number} tokensPerConv - Tokens médios por conversa
 * @param {number} convsPerDay - Conversas por dia
 * @param {string} currency - 'USD' ou 'BRL'
 * @param {number} exchangeRate - Taxa de câmbio USD/BRL
 */
export const calculateMonthlyCost = (costInput, costOutput, tokensPerConv, convsPerDay, currency = 'USD', exchangeRate = 1) => {
    const totalTokens = tokensPerConv * convsPerDay * 30;
    const monthlyCost = calculateCost(costInput, costOutput, totalTokens, currency, exchangeRate);
    return monthlyCost;
};
