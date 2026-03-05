/**
 * Formatar valor como moeda
 */
export const formatCurrency = (value, currency = 'BRL', isTotal = false) => {
    return new Intl.NumberFormat(currency === 'BRL' ? 'pt-BR' : 'en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: isTotal ? 2 : 4,
    }).format(value);
};

/**
 * Formatar valor em USD sempre (para coluna de preço por 1M)
 */
export const formatUSD = (value) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};
