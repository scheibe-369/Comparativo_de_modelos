/**
 * Calcular custo por quantidade de tokens
 */
export const calculateCost = (costPer1M, tokenAmount, currency = 'USD', exchangeRate = 1) => {
    const costInUSD = (costPer1M / 1_000_000) * tokenAmount;
    return currency === 'BRL' ? costInUSD * exchangeRate : costInUSD;
};

/**
 * Calcular custo mensal projetado
 * @param {number} costPer1M - Custo por 1M tokens em USD
 * @param {number} tokensPerConv - Tokens médios por conversa
 * @param {number} convsPerDay - Conversas por dia
 * @param {string} currency - 'USD' ou 'BRL'
 * @param {number} exchangeRate - Taxa de câmbio USD/BRL
 */
export const calculateMonthlyCost = (costPer1M, tokensPerConv, convsPerDay, currency = 'USD', exchangeRate = 1) => {
    const monthlyCost = calculateCost(costPer1M, tokensPerConv * convsPerDay * 30, currency, exchangeRate);
    return monthlyCost;
};
